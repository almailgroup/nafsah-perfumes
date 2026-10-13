/**
 * The checkout's rules, kept out of the components so they stay pure and
 * testable: what each step asks for, what counts as filled in, and the
 * record a placed order leaves behind. Messages are dictionary keys
 * (src/i18n/dict/checkout.js), never text.
 */
import { AREA_BY_ID } from '../../data/kuwait'
import { EMPTY_ADDRESS, isValidKuwaitMobile, normalizeAddress, normalizeMobile, validateAddress } from '../../lib/address'
import { deliveryPromise } from '../../lib/delivery'
import { toLatinDigits } from '../../lib/format'

export const STEPS = ['details', 'delivery', 'review']

/** Payment is chosen here and taken nowhere: this is a demonstration storefront. */
export const PAYMENT_METHODS = ['knet', 'card', 'apple-pay', 'cod']

export const EMPTY_FORM = Object.freeze({
  name: '',
  email: '',
  mobile: '', // 8 local digits, Latin
  recipientName: '',
  recipientMobile: '',
  address: EMPTY_ADDRESS,
  buildingType: 'house',
  notes: '',
  // KNET is how most of Kuwait pays online.
  payment: 'knet',
})

export const CHECKOUT_ERRORS = Object.freeze({
  required: 'checkout.err.required',
  email: 'checkout.err.email',
  mobile: 'checkout.err.mobile',
  payment: 'checkout.err.payment',
  codGift: 'checkout.err.codGift',
})

/** Every field a step can flag, in the order the shopper meets them. */
export const FIELD_ORDER = {
  details: ['name', 'email', 'mobile'],
  delivery: [
    'recipientName',
    'recipientMobile',
    'governorate',
    'area',
    'areaOther',
    'block',
    'street',
    'avenue',
    'building',
    'floor',
    'apartment',
    'directions',
    'notes',
  ],
  review: ['payment'],
}

/** The label key for each field, for the error summary. */
export const FIELD_LABELS = {
  name: 'checkout.field.name',
  email: 'checkout.field.email',
  mobile: 'checkout.field.mobile',
  recipientName: 'checkout.field.recipientName',
  recipientMobile: 'checkout.field.recipientMobile',
  governorate: 'checkout.field.governorate',
  area: 'checkout.field.area',
  areaOther: 'checkout.field.areaOther',
  block: 'checkout.field.block',
  street: 'checkout.field.street',
  avenue: 'checkout.field.avenue',
  building: 'checkout.field.building',
  floor: 'checkout.field.floor',
  apartment: 'checkout.field.apartment',
  directions: 'checkout.field.directions',
  notes: 'checkout.field.notes',
  payment: 'checkout.payment.title',
}

/** The DOM id of a field's control. */
export const fieldId = (name) => `checkout-${name}`

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const blank = (value) => String(value ?? '').trim() === ''
const tidy = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()

/** A gift that goes straight to someone else needs their name and number. */
export const toRecipient = (gift) => Boolean(gift?.enabled && gift?.deliverToRecipient)

/** The address as it will be saved: a house has no floor or apartment. */
export function addressFor(form) {
  const address = form?.address ?? EMPTY_ADDRESS
  return normalizeAddress(form?.buildingType === 'apartment' ? address : { ...address, floor: '', apartment: '' })
}

/** The delivery area for the promise and the surcharge: a listed area, or none. */
export const areaIdOf = (address) =>
  typeof address?.area === 'string' && Object.hasOwn(AREA_BY_ID, address.area) ? address.area : null

/** → { field: messageKey } for one step; empty means the step is complete. */
export function validateStep(step, form, gift) {
  const errors = {}

  if (step === 'details') {
    if (blank(form.name)) errors.name = CHECKOUT_ERRORS.required
    if (blank(form.email)) errors.email = CHECKOUT_ERRORS.required
    else if (!EMAIL.test(form.email.trim())) errors.email = CHECKOUT_ERRORS.email
    if (blank(form.mobile)) errors.mobile = CHECKOUT_ERRORS.required
    else if (!isValidKuwaitMobile(form.mobile)) errors.mobile = CHECKOUT_ERRORS.mobile
  }

  if (step === 'delivery') {
    if (toRecipient(gift)) {
      if (blank(form.recipientName)) errors.recipientName = CHECKOUT_ERRORS.required
      if (blank(form.recipientMobile)) errors.recipientMobile = CHECKOUT_ERRORS.required
      else if (!isValidKuwaitMobile(form.recipientMobile)) errors.recipientMobile = CHECKOUT_ERRORS.mobile
    }
    Object.assign(errors, validateAddress(addressFor(form)))
  }

  if (step === 'review') {
    if (!PAYMENT_METHODS.includes(form.payment)) errors.payment = CHECKOUT_ERRORS.payment
    // The recipient should never be asked to pay for their own present.
    else if (form.payment === 'cod' && toRecipient(gift)) errors.payment = CHECKOUT_ERRORS.codGift
  }

  return errors
}

/**
 * The first step with something left to fix, for "Place order": a gift
 * switched to direct delivery on the review step still needs its recipient.
 * → { index, errors } or null when every step is complete.
 */
export function firstIncompleteStep(form, gift) {
  for (let index = 0; index < STEPS.length; index += 1) {
    const errors = validateStep(STEPS[index], form, gift)
    if (Object.keys(errors).length > 0) return { index, errors }
  }
  return null
}

/** The flagged fields of a step, in reading order. */
export const orderedErrors = (step, errors) => (FIELD_ORDER[step] ?? []).filter((field) => errors?.[field])

/**
 * What the mobile field keeps as the shopper types or pastes: Latin digits
 * (an Arabic keyboard types ٠–٩), at most 8, with a pasted +965 / 00965
 * prefix dropped once the number is too long to be local.
 */
export function mobileDigits(input) {
  let digits = toLatinDigits(input).replace(/\D/g, '')
  if (digits.length > 8) {
    if (digits.startsWith('00965')) digits = digits.slice(5)
    else if (digits.startsWith('965')) digits = digits.slice(3)
  }
  return digits.slice(0, 8)
}

/** 8 digits shown as Kuwaitis write them: "9123 4567". */
export const groupMobile = (digits) => (digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits)

/** The caret position in a grouped number after `count` digits. */
export const caretAfterDigits = (grouped, count) => {
  if (count <= 0) return 0
  let seen = 0
  for (let i = 0; i < grouped.length; i += 1) {
    if (/\d/.test(grouped[i])) seen += 1
    if (seen === count) return i + 1
  }
  return grouped.length
}

// Crockford's base 32: no I, L, O or U, so a reference read over the phone
// cannot be misheard. 32 symbols take 5 bits of a byte with no bias.
const REFERENCE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

const randomBytes = (n) => globalThis.crypto.getRandomValues(new Uint8Array(n))

/** An order reference like "NFS-7K3Q9M", from the platform's secure random source. */
export function orderReference(random = randomBytes) {
  return `NFS-${Array.from(random(6), (byte) => REFERENCE_ALPHABET[byte & 31]).join('')}`
}

/**
 * Everything the confirmation shows, captured before the cart is emptied.
 * Product and format objects are kept rather than strings, so the receipt
 * still follows a language switch.
 */
export function buildReceipt({ form, gift, lines, totals, now = new Date(), reference = orderReference() }) {
  const address = addressFor(form)
  return {
    reference,
    placedAt: now.toISOString(),
    promise: deliveryPromise({ now, areaId: areaIdOf(address) }),
    customer: {
      name: tidy(form.name),
      email: String(form.email ?? '').trim(),
      mobile: normalizeMobile(form.mobile),
    },
    recipient: toRecipient(gift)
      ? { name: tidy(form.recipientName), mobile: normalizeMobile(form.recipientMobile) }
      : null,
    address,
    notes: String(form.notes ?? '').trim(),
    payment: form.payment,
    gift: gift?.enabled ? { ...gift } : null,
    lines: lines.map(({ id, product, formatId, format, qty, subtotalFils, includesTestVial }) => ({
      id,
      product,
      formatId,
      format,
      qty,
      subtotalFils,
      includesTestVial,
    })),
    totals: { ...totals },
  }
}
