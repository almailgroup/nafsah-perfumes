/**
 * The Kuwaiti dinar is a three-decimal currency (1 KD = 1000 fils), so prices
 * are always shown to three places.
 *
 * English renders "KD 75.000" — the ISO "KWD" is correct but "KD" is how
 * Kuwaiti retail writes it. Arabic defers to the platform, which gives Arabic-
 * Indic digits, the Arabic decimal separator and "د.ك" in the right order.
 */
const LATIN = new Intl.NumberFormat('en-KW', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

const ARABIC = new Intl.NumberFormat('ar-KW', {
  style: 'currency',
  currency: 'KWD',
})

export const formatPrice = (value, lang = 'en') =>
  lang === 'ar' ? ARABIC.format(value) : `KD ${LATIN.format(value)}`

/** Plain number in the active script — for counts, quantities and ratings. */
export const formatNumber = (value, lang = 'en') =>
  new Intl.NumberFormat(lang === 'ar' ? 'ar-KW' : 'en-KW').format(value)

/** Zero-padded catalogue numbers, in the active script. */
export const formatOrdinal = (value, lang = 'en') => {
  const n = String(value).padStart(2, '0')
  if (lang !== 'ar') return n
  return n.replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)])
}

/** Stable identity for a cart line: one fragrance in one size. */
export const lineId = (productId, ml) => `${productId}__${ml}`

export const classNames = (...values) => values.filter(Boolean).join(' ')
