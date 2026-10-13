import { createContext, useContext } from 'react'
import { formatNumber, pluralCategory } from '../lib/format'
import { STRINGS } from './strings'

export const LocaleContext = createContext(null)

export function useLocale() {
  const value = useContext(LocaleContext)
  if (!value) throw new Error('useLocale must be used inside a <LocaleProvider>')
  return value
}

/*
 * The lookups behind t(), tc() and tr(). They live here, outside the
 * provider, so they stay pure and testable without a DOM.
 */

const DEV = Boolean(import.meta.env?.DEV)
const warned = new Set()

// Once per key and language, in development only: a missing string should be
// noticed, not repeated on every render.
function warnMissing(lang, key) {
  if (!DEV || warned.has(`${lang}:${key}`)) return
  warned.add(`${lang}:${key}`)
  console.warn(`[i18n] No ${lang} string for "${key}"`)
}

const dictFor = (strings, lang) => strings[lang] ?? strings.en
// Own properties only, so a key like "constructor" is missing, not a function.
const lookup = (dict, key) => (Object.hasOwn(dict, key) ? dict[key] : undefined)

/** Fill {named} placeholders; unknown ones stay visible rather than vanish. */
export function interpolate(raw, vars) {
  if (!vars || typeof raw !== 'string') return raw
  return raw.replace(/\{(\w+)\}/g, (match, name) => (Object.hasOwn(vars, name) ? String(vars[name]) : match))
}

// Each takes the merged dictionary last so tests can hand in their own.

/** t(): the active language, then English, then the key itself. */
export function translate(lang, key, vars, strings = STRINGS) {
  let raw = lookup(dictFor(strings, lang), key)
  if (raw === undefined) {
    warnMissing(lang, key)
    raw = lookup(strings.en, key) ?? key
  }
  return interpolate(raw, vars)
}

/**
 * tc(): the plural form of `key` for `count` — `${key}.${category}` by
 * Intl.PluralRules, else `${key}.other` — with {count} already written in the
 * active script.
 */
export function translateCount(lang, key, count, vars, strings = STRINGS) {
  const filled = { ...vars, count: formatNumber(count, lang) }
  const dict = dictFor(strings, lang)
  const own = lookup(dict, `${key}.${pluralCategory(count, lang)}`) ?? lookup(dict, `${key}.other`)
  if (own !== undefined) return interpolate(own, filled)
  warnMissing(lang, `${key}.other`)
  const english =
    lookup(strings.en, `${key}.${pluralCategory(count, 'en')}`) ?? lookup(strings.en, `${key}.other`)
  return interpolate(english ?? key, filled)
}

/** tr(): the active language of a { en, ar } value, falling back to English. */
export function translateValue(lang, value) {
  if (typeof value === 'string') return value
  return value?.[lang] ?? value?.en ?? ''
}
