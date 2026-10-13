/**
 * npm run check:i18n — the English and Arabic dictionaries must say the same
 * things. For every key, across src/i18n/strings.js and src/i18n/dict/*.js:
 *
 *   - it exists in both languages (plural keys are compared by base key:
 *     English needs .one and .other, Arabic at least .other);
 *   - both languages use the same {placeholders};
 *   - no string is empty;
 *   - it is defined once, and a feature key starts with its file's namespace.
 *
 * Plain Node, no build step. Exits 1 with a report when anything is wrong.
 * src/i18n/strings.test.js runs the same audit under Vitest.
 */
import { pathToFileURL } from 'node:url'
import { CORE, DICTIONARIES, LANGUAGES } from '../src/i18n/strings.js'

const CATEGORIES = ['zero', 'one', 'two', 'few', 'many', 'other']
const REQUIRED_FORMS = { en: ['one', 'other'], ar: ['other'] }
// The forms Intl.PluralRules can actually select; any other suffix is dead copy.
const USABLE_FORMS = Object.fromEntries(
  LANGUAGES.map((lang) => [lang, new Intl.PluralRules(lang).resolvedOptions().pluralCategories]),
)

const where = (source) => (source === 'core' ? 'strings.js' : `dict/${source}.js`)
const placeholders = (text) => [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))].sort()
const sameList = (a, b) => a.length === b.length && a.every((x, i) => x === b[i])
const show = (list) => (list.length ? list.map((p) => `{${p}}`).join(' ') : 'none')

// A key is plural when it ends in a CLDR category and at least one language
// spells out a form other than .other — so a plain 'checkout.area.other'
// ("Other area") stays an ordinary key.
function pluralParts(key) {
  const dot = key.lastIndexOf('.')
  if (dot < 1) return null
  const form = key.slice(dot + 1)
  return CATEGORIES.includes(form) ? { base: key.slice(0, dot), form } : null
}

/**
 * Audit the dictionaries. Returns { errors, warnings, stats }; no errors
 * means the dictionaries are consistent.
 */
export function auditStrings({ core = CORE, dictionaries = DICTIONARIES } = {}) {
  const errors = []
  const warnings = []
  const entries = Object.fromEntries(LANGUAGES.map((lang) => [lang, new Map()]))

  // Collect every key with where it came from: namespace and duplicates.
  for (const [source, dict] of [['core', core], ...Object.entries(dictionaries)]) {
    for (const lang of LANGUAGES) {
      const table = dict?.[lang]
      if (!table || typeof table !== 'object') {
        errors.push(`${where(source)}: no "${lang}" dictionary`)
        continue
      }
      for (const [key, value] of Object.entries(table)) {
        if (source !== 'core' && !key.startsWith(`${source}.`)) {
          errors.push(`${where(source)} [${lang}] "${key}": keys here must start with "${source}."`)
        }
        const seen = entries[lang].get(key)
        if (seen) errors.push(`"${key}" [${lang}] is defined in both ${where(seen.source)} and ${where(source)}`)
        else entries[lang].set(key, { value, source })
      }
    }
  }

  // Values: a non-empty string, or (core's announcement bar) a list of them.
  for (const lang of LANGUAGES) {
    for (const [key, { value, source }] of entries[lang]) {
      const items = Array.isArray(value) ? value : [value]
      if (Array.isArray(value) && value.length === 0) errors.push(`${where(source)} [${lang}] "${key}" is an empty list`)
      items.forEach((item, i) => {
        const label = Array.isArray(value) ? `"${key}"[${i}]` : `"${key}"`
        if (typeof item !== 'string') errors.push(`${where(source)} [${lang}] ${label} is not a string`)
        else if (item.trim() === '') errors.push(`${where(source)} [${lang}] ${label} is empty`)
      })
    }
  }

  // Split plural groups from ordinary keys.
  const pluralBases = new Set()
  for (const lang of LANGUAGES) {
    for (const key of entries[lang].keys()) {
      const parts = pluralParts(key)
      if (parts && parts.form !== 'other') pluralBases.add(parts.base)
    }
  }
  const isPluralKey = (key) => {
    const parts = pluralParts(key)
    return Boolean(parts && pluralBases.has(parts.base))
  }

  // Ordinary keys: same set, same type, same placeholders.
  const [first, ...others] = LANGUAGES
  const allKeys = new Set(LANGUAGES.flatMap((lang) => [...entries[lang].keys()]))
  for (const key of allKeys) {
    if (isPluralKey(key)) continue
    const missing = LANGUAGES.filter((lang) => !entries[lang].has(key))
    if (missing.length) {
      const present = LANGUAGES.find((lang) => entries[lang].has(key))
      errors.push(`"${key}" is missing in ${missing.join(', ')} (${where(entries[present].get(key).source)})`)
      continue
    }
    const base = entries[first].get(key).value
    for (const lang of others) {
      const value = entries[lang].get(key).value
      if (Array.isArray(base) !== Array.isArray(value)) {
        errors.push(`"${key}" is a list in one language and text in the other`)
        continue
      }
      let pairs = [[base, value, `"${key}"`]]
      if (Array.isArray(base)) {
        if (base.length !== value.length) {
          errors.push(`"${key}" has ${base.length} items in ${first} and ${value.length} in ${lang}`)
          continue
        }
        pairs = base.map((item, i) => [item, value[i], `"${key}"[${i}]`])
      }
      for (const [a, b, label] of pairs) {
        if (typeof a !== 'string' || typeof b !== 'string') continue
        const pa = placeholders(a)
        const pb = placeholders(b)
        if (!sameList(pa, pb)) errors.push(`${label} placeholders differ — ${first}: ${show(pa)}, ${lang}: ${show(pb)}`)
      }
    }
  }

  // Plural groups: required forms present, no forms Intl can never pick, and
  // the same placeholders throughout. {count} may be left out of a form —
  // Arabic says "مراجعة واحدة" and "مراجعتان" without a numeral.
  for (const base of [...pluralBases].sort()) {
    const forms = {}
    for (const lang of LANGUAGES) {
      forms[lang] = CATEGORIES.filter((form) => entries[lang].has(`${base}.${form}`))
      const missing = REQUIRED_FORMS[lang].filter((form) => !forms[lang].includes(form))
      if (missing.length) {
        errors.push(`plural "${base}" [${lang}] needs ${missing.map((f) => `.${f}`).join(' and ')}`)
      }
      const unusable = forms[lang].filter((form) => !USABLE_FORMS[lang].includes(form))
      if (unusable.length) {
        errors.push(`plural "${base}" [${lang}] has ${unusable.map((f) => `.${f}`).join(' ')}, which ${lang} never uses`)
      }
      const absent = CATEGORIES.filter((form) => USABLE_FORMS[lang].includes(form) && !forms[lang].includes(form))
      if (lang === 'ar' && absent.length && forms[lang].includes('other')) {
        warnings.push(`plural "${base}" [ar] falls back to .other for ${absent.map((f) => `.${f}`).join(' ')}`)
      }
    }
    const signatures = []
    for (const lang of LANGUAGES) {
      for (const form of forms[lang]) {
        const { value } = entries[lang].get(`${base}.${form}`)
        if (typeof value !== 'string') continue
        signatures.push({ label: `${lang}.${form}`, list: placeholders(value).filter((p) => p !== 'count') })
      }
    }
    const [reference] = signatures
    for (const sig of signatures.slice(1)) {
      if (!sameList(reference.list, sig.list)) {
        errors.push(`plural "${base}" placeholders differ — ${reference.label}: ${show(reference.list)}, ${sig.label}: ${show(sig.list)}`)
      }
    }
  }

  const stats = {
    dictionaries: 1 + Object.keys(dictionaries).length,
    keys: Object.fromEntries(LANGUAGES.map((lang) => [lang, entries[lang].size])),
    plurals: pluralBases.size,
  }
  return { errors, warnings, stats }
}

function main() {
  const { errors, warnings, stats } = auditStrings()
  const summary = `${stats.dictionaries} dictionaries · ${LANGUAGES.map((l) => `${stats.keys[l]} ${l}`).join(' / ')} keys · ${stats.plurals} plural groups`
  for (const warning of warnings) console.warn(`  note: ${warning}`)
  if (errors.length === 0) {
    console.log(`i18n check passed — ${summary}`)
    return
  }
  console.error(`i18n check failed — ${errors.length} problem${errors.length === 1 ? '' : 's'} (${summary}):\n`)
  for (const error of errors) console.error(`  ✗ ${error}`)
  console.error('\nFix the dictionaries in src/i18n/ and run `npm run check:i18n` again.')
  process.exit(1)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main()
