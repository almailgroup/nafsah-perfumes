/**
 * Every number a shopper reads goes through this file, so Arabic mode shows
 * Arabic-Indic digits throughout and English never does.
 *
 * Output is built from Latin digits and mapped by hand rather than left to
 * each browser's locale data, which disagrees: the platform's Arabic currency
 * style put the symbol after the amount, wrapped it in direction marks and
 * changed with the engine. Built here, it is the same string everywhere.
 */

/**
 * Arabic mode writes numbers in Arabic-Indic digits (٧٥٫٠٠٠). Set this to
 * false and Arabic mode keeps Latin digits (75.000) everywhere instead.
 */
export const ARABIC_DIGITS = true

/** The dinar has 1000 fils. Prices are held in integer fils; this is the only conversion. */
export const toFils = (kwd) => Math.round(Number(kwd) * 1000)
export const fromFils = (fils) => fils / 1000

const NONE = '—'
const KWD_EN = 'KWD'
const KWD_AR = 'د.ك.'

// Latin character → Arabic script. The minus gets an Arabic letter mark in
// front, as the platform's own Arabic data does, so it stays on the right of
// the number in a right-to-left line.
const TO_ARABIC = {
  ...Object.fromEntries([...'٠١٢٣٤٥٦٧٨٩'].map((d, i) => [String(i), d])),
  '.': '٫',
  ',': '٬',
  '%': '٪',
  '-': '\u061C-',
}

const ARABIC_INDIC_DIGIT = /[\u0660-\u0669]/g
const PERSIAN_DIGIT = /[\u06F0-\u06F9]/g

/** Arabic-Indic (٠–٩) and Persian (۰–۹) digits → 0–9. Anything else is left alone. */
export const toLatinDigits = (value) =>
  String(value ?? '')
    .replace(ARABIC_INDIC_DIGIT, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(PERSIAN_DIGIT, (d) => String(d.charCodeAt(0) - 0x06f0))

const arabicScript = (lang, arabicDigits) => lang === 'ar' && arabicDigits

/** Re-script a Latin-formatted number for the active language. */
const inScript = (latin, lang, arabicDigits = ARABIC_DIGITS) =>
  arabicScript(lang, arabicDigits) ? latin.replace(/[0-9.,%-]/g, (c) => TO_ARABIC[c]) : latin

// Numbers arrive as numbers, numeric strings, or nothing at all. Only the
// first two are numbers; null and '' are not zero.
const toFinite = (value) => {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') return Number(toLatinDigits(value))
  return Number.NaN
}

// Intl instances are expensive to build and these run in every render.
const intlCache = new Map()
const cached = (kind, locale, options, make) => {
  const key = `${kind}|${locale}|${JSON.stringify(options)}`
  let instance = intlCache.get(key)
  if (!instance) {
    instance = make()
    intlCache.set(key, instance)
  }
  return instance
}

const latinNumber = (options = {}) =>
  cached('number', 'en-US', options, () =>
    new Intl.NumberFormat('en-US', { numberingSystem: 'latn', ...options }),
  )

const pluralRules = (lang) =>
  cached('plural', lang, {}, () => new Intl.PluralRules(lang === 'ar' ? 'ar' : 'en'))

/** CLDR plural category of `count` in the active language ('one', 'few', 'other'…). */
export const pluralCategory = (count, lang = 'en') => pluralRules(lang).select(count)

/**
 * A price in fils, always to three decimals.
 *   en → "KWD 1,250.000"
 *   ar → "د.ك. ١٬٢٥٠٫٠٠٠" (or "د.ك. 1,250.000" with ARABIC_DIGITS off)
 * Not a number → "—", never "KWD NaN".
 */
export const formatPrice = (fils, lang = 'en', { arabicDigits = ARABIC_DIGITS } = {}) => {
  const value = toFinite(fils)
  if (!Number.isFinite(value)) return NONE
  // Whole fils, rounded half away from zero, then split with integer maths so
  // no binary fraction ever reaches the decimals.
  const whole = Math.round(Math.abs(value))
  const sign = value < 0 && whole !== 0 ? '-' : ''
  const dinars = latinNumber({ maximumFractionDigits: 0 }).format(Math.floor(whole / 1000))
  const latin = `${dinars}.${String(whole % 1000).padStart(3, '0')}`
  if (lang === 'ar') return `${KWD_AR} ${inScript(sign + latin, lang, arabicDigits)}`
  return `${sign}${KWD_EN} ${latin}`
}

/**
 * A plain number in the active script — counts, quantities, ratings. Takes
 * Intl options (e.g. { useGrouping: false } for a year, { maximumFractionDigits: 1 }).
 */
export const formatNumber = (value, lang = 'en', options = {}) => {
  const { arabicDigits = ARABIC_DIGITS, ...intl } = options ?? {}
  const n = toFinite(value)
  if (!Number.isFinite(n)) return NONE
  return inScript(latinNumber(intl).format(n), lang, arabicDigits)
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/

const dateFormat = (lang, options, arabicDigits) => {
  const locale =
    lang === 'ar'
      ? `ar-KW-u-ca-gregory-nu-${arabicScript(lang, arabicDigits) ? 'arab' : 'latn'}`
      : 'en-GB'
  return cached('date', locale, options, () => new Intl.DateTimeFormat(locale, options))
}

// A bare 'YYYY-MM-DD' is a calendar day, not an instant: read and print it in
// UTC so a visitor west of Greenwich does not see the day before.
const dateParts = (iso) => {
  const date = new Date(iso)
  const timeZone = typeof iso === 'string' && DATE_ONLY.test(iso) ? 'UTC' : undefined
  return { date, timeZone }
}

/** A long-form date in the active script — Arabic month names and digits in Arabic. */
export const formatDate = (iso, lang = 'en', { arabicDigits = ARABIC_DIGITS } = {}) => {
  const { date, timeZone } = dateParts(iso)
  if (Number.isNaN(date.getTime())) return NONE
  return dateFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone }, arabicDigits).format(date)
}

/** The day of the week for a date ('Saturday' / 'السبت'), e.g. for a delivery promise. */
export const formatWeekday = (iso, lang = 'en') => {
  const { date, timeZone } = dateParts(iso)
  if (Number.isNaN(date.getTime())) return NONE
  return dateFormat(lang, { weekday: 'long', timeZone }, ARABIC_DIGITS).format(date)
}

/**
 * Text that carries numbers the shopper typed ("18A", "Block 3"): Arabic mode
 * shows its digits in Arabic-Indic, everything else is left as written.
 */
export const localizeDigits = (text, lang = 'en', { arabicDigits = ARABIC_DIGITS } = {}) => {
  const value = String(text ?? '')
  return arabicScript(lang, arabicDigits) ? value.replace(/[0-9]/g, (d) => TO_ARABIC[d]) : value
}

/** Zero-padded catalogue numbers, in the active script. */
export const formatOrdinal = (value, lang = 'en', { arabicDigits = ARABIC_DIGITS } = {}) =>
  localizeDigits(String(value).padStart(2, '0'), lang, { arabicDigits })

/** A volume: "100 ml" / "١٠٠ مل". */
export const formatMl = (ml, lang = 'en') => {
  const n = formatNumber(ml, lang)
  if (n === NONE) return NONE
  return lang === 'ar' ? `${n} مل` : `${n} ml`
}

/**
 * Hours on skin: "12 h" / "١٢ ساعة", "٨ ساعات", "ساعتان". Arabic agrees the
 * noun with the number: ساعات from 3 to 10, ساعة from 11 up and for
 * fractions, and words of its own for one and two.
 */
export const formatHours = (hours, lang = 'en') => {
  const n = formatNumber(hours, lang, { maximumFractionDigits: 1 })
  if (n === NONE) return NONE
  if (lang !== 'ar') return `${n} h`
  // Agree with the number as shown, not as stored (1.04 shows as ١).
  const category = pluralCategory(Math.round(toFinite(hours) * 10) / 10, 'ar')
  if (category === 'one') return 'ساعة واحدة'
  if (category === 'two') return 'ساعتان'
  return `${n} ${category === 'few' ? 'ساعات' : 'ساعة'}`
}

/**
 * A Kuwaiti mobile for display: "+965 9123 4567". Latin digits and LTR in both
 * languages; callers wrap it in dir="ltr". Input that is not a Kuwaiti
 * number comes back as typed rather than as a misleading reformat.
 */
export const formatMobile = (value) => {
  let digits = toLatinDigits(value).replace(/\D/g, '')
  if (digits.length === 13 && digits.startsWith('00965')) digits = digits.slice(5)
  if (digits.length === 11 && digits.startsWith('965')) digits = digits.slice(3)
  if (digits.length !== 8) return String(value ?? '').trim()
  return `+965 ${digits.slice(0, 4)} ${digits.slice(4)}`
}

/** Stable identity for a cart line: one fragrance in one format. */
export const lineId = (productId, formatId) => `${productId}__${formatId}`

export const classNames = (...values) => values.filter(Boolean).join(' ')
