/**
 * The Kuwaiti address and mobile number: normalising what was typed (often on
 * an Arabic keyboard), validating it, and writing it back as one line.
 *
 * Address shape — every field a string:
 *   { governorate, area, areaOther, block, street, avenue, building, floor, apartment, directions }
 * `area` is an AREAS id, or 'other' with the name in `areaOther`. Avenue
 * (جادة), floor, apartment and directions are optional.
 *
 * Validation returns message keys, not messages; they live in the checkout
 * dictionary (src/i18n/dict/checkout.js).
 */
import { AREA_BY_ID, GOVERNORATE_BY_ID, OTHER_AREA_ID } from '../data/kuwait'
import { localizeDigits, toLatinDigits } from './format'

export { toLatinDigits }

export const EMPTY_ADDRESS = Object.freeze({
  governorate: '',
  area: '',
  areaOther: '',
  block: '',
  street: '',
  avenue: '',
  building: '',
  floor: '',
  apartment: '',
  directions: '',
})

/** The message keys validateAddress() can return. */
export const ADDRESS_ERRORS = Object.freeze({
  required: 'checkout.err.required',
  governorate: 'checkout.err.governorate',
  area: 'checkout.err.area',
  block: 'checkout.err.block',
})

const has = (record, id) => typeof id === 'string' && Object.hasOwn(record, id)

// Spaces, dashes, brackets, dots, and the invisible direction marks a number
// picks up when pasted out of an Arabic message.
const PHONE_NOISE = /[\s\-().\u200E\u200F\u202A-\u202E\u2066-\u2069]/g

/**
 * A Kuwaiti mobile as its 8 local digits, or '' if it is not one. Accepts
 * Arabic-Indic digits, spaces and dashes, and a +965 / 00965 / 965 prefix.
 */
export function normalizeMobile(input) {
  let digits = toLatinDigits(input).replace(PHONE_NOISE, '')
  if (digits.startsWith('+965')) digits = digits.slice(4)
  else if (digits.startsWith('00965')) digits = digits.slice(5)
  else if (digits.length === 11 && digits.startsWith('965')) digits = digits.slice(3)
  return /^\d{8}$/.test(digits) ? digits : ''
}

/** Kuwaiti mobiles are 8 digits starting 4, 5, 6 or 9. */
export const isValidKuwaitMobile = (input) => /^[4569]\d{7}$/.test(normalizeMobile(input))

// Fields that hold numbers or short codes get Latin digits; free text keeps
// whatever script it was written in.
const NUMERIC_FIELDS = ['block', 'street', 'avenue', 'building', 'floor', 'apartment']
const tidy = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

// "Block 3", "قطعة ٣", "ق 3" → "3"; "03" → "3".
const LEADING_BLOCK_WORD = /^(?:block|blk|qitaa|قطعة|ق)\s*[.:#-]?\s*/i
const normalizeBlock = (value) => {
  const block = value.replace(LEADING_BLOCK_WORD, '').replace(/\s+/g, '')
  return /^\d+$/.test(block) ? block.replace(/^0+(?=\d)/, '') : block
}

/** Every field present, trimmed, single-spaced, with Latin digits where numbers belong. */
export function normalizeAddress(address = {}) {
  const out = {}
  for (const field of Object.keys(EMPTY_ADDRESS)) {
    const value = tidy(address?.[field])
    out[field] = NUMERIC_FIELDS.includes(field) ? toLatinDigits(value) : value
  }
  out.block = normalizeBlock(out.block)
  if (out.area !== OTHER_AREA_ID) out.areaOther = ''
  return out
}

/**
 * → { [field]: messageKey } for every problem; an empty object means valid.
 * Governorate, area (or areaOther), block, street and building are required.
 */
export function validateAddress(address) {
  const a = normalizeAddress(address)
  const errors = {}

  if (!a.governorate) errors.governorate = ADDRESS_ERRORS.required
  else if (!has(GOVERNORATE_BY_ID, a.governorate)) errors.governorate = ADDRESS_ERRORS.governorate

  if (!a.area) errors.area = ADDRESS_ERRORS.required
  else if (a.area === OTHER_AREA_ID) {
    if (!a.areaOther) errors.areaOther = ADDRESS_ERRORS.required
  } else if (!has(AREA_BY_ID, a.area)) errors.area = ADDRESS_ERRORS.area
  else if (has(GOVERNORATE_BY_ID, a.governorate) && AREA_BY_ID[a.area].governorate !== a.governorate) {
    errors.area = ADDRESS_ERRORS.area
  }

  if (!a.block) errors.block = ADDRESS_ERRORS.required
  else if (!/^[1-9]\d{0,2}$/.test(a.block)) errors.block = ADDRESS_ERRORS.block

  if (!a.street) errors.street = ADDRESS_ERRORS.required
  if (!a.building) errors.building = ADDRESS_ERRORS.required

  return errors
}

const LABELS = {
  en: { block: 'Block', street: 'Street', avenue: 'Avenue', building: 'Building', floor: 'Floor', apartment: 'Apt' },
  ar: { block: 'قطعة', street: 'شارع', avenue: 'جادة', building: 'مبنى', floor: 'الدور', apartment: 'شقة' },
}

// A value that already names itself ("Tunis Street", "شارع ١٢", "Villa 4",
// "Apt.3", "شقة٣") is printed as typed rather than as "Street Tunis Street".
// The word may run straight into its number; values have Latin digits here.
const SELF_LABELLED = {
  street: /(^|\s)(street|st\.?|road|rd\.?|شارع|طريق)(?=$|[\s.#:\-\d])/i,
  avenue: /(^|\s)(avenue|ave\.?|jadda|jaddah|جادة)(?=$|[\s.#:\-\d])/i,
  building: /(^|\s)(building|bldg\.?|house|villa|tower|مبنى|منزل|عمارة|بيت|فيلا|برج)(?=$|[\s.#:\-\d])/i,
  floor: /(^|\s)(floor|fl\.?|الدور|دور|طابق|الطابق)(?=$|[\s.#:\-\d])/i,
  apartment: /(^|\s)(apartment|apt\.?|flat|شقة)(?=$|[\s.#:\-\d])/i,
}

const LINE_FIELDS = ['block', 'street', 'avenue', 'building', 'floor', 'apartment']

/**
 * One line, for the order summary and receipt:
 *   en "Block 3, Street 12, Avenue 4, Building 18, Floor 2, Apt 5 — Salmiya, Hawalli"
 *   ar "قطعة ٣، شارع ١٢، جادة ٤، مبنى ١٨، الدور ٢، شقة ٥ — السالمية، حولي"
 * Empty optional fields drop out; directions are not part of the line.
 */
export function formatAddress(address, lang = 'en') {
  const a = normalizeAddress(address)
  const language = lang === 'ar' ? 'ar' : 'en'
  const sep = language === 'ar' ? '، ' : ', '

  const parts = LINE_FIELDS.filter((field) => a[field]).map((field) => {
    const value = localizeDigits(a[field], language)
    return SELF_LABELLED[field]?.test(a[field]) ? value : `${LABELS[language][field]} ${value}`
  })

  const area = a.area === OTHER_AREA_ID ? a.areaOther : has(AREA_BY_ID, a.area) ? AREA_BY_ID[a.area] : null
  const governorateId = has(GOVERNORATE_BY_ID, a.governorate) ? a.governorate : area?.governorate
  const governorate = GOVERNORATE_BY_ID[governorateId]
  const place = [
    typeof area === 'string' ? area : area?.[language],
    governorate ? (governorate.short?.[language] ?? governorate[language]) : null,
  ].filter(Boolean)

  return [parts.join(sep), place.join(sep)].filter(Boolean).join(' — ')
}
