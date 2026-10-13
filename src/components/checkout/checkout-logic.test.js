import { describe, expect, it } from 'vitest'
import {
  addressFor,
  areaIdOf,
  buildReceipt,
  caretAfterDigits,
  EMPTY_FORM,
  FIELD_LABELS,
  FIELD_ORDER,
  firstIncompleteStep,
  groupMobile,
  mobileDigits,
  orderedErrors,
  orderReference,
  toRecipient,
  validateStep,
} from './checkout-logic'
import { STRINGS } from '../../i18n/strings'
import { PRODUCTS_BY_ID } from '../../data/products'
import { detailLines, cartTotals, EMPTY_GIFT } from '../../context/cart-context'

const ADDRESS = {
  governorate: 'hawalli',
  area: 'salmiya',
  areaOther: '',
  block: '3',
  street: 'Baghdad Street',
  avenue: '',
  building: '18',
  floor: '2',
  apartment: '5',
  directions: '',
}

const filled = (patch = {}) => ({
  ...EMPTY_FORM,
  name: 'Noura Al-Mutairi',
  email: 'noura@example.com',
  mobile: '91234567',
  address: ADDRESS,
  ...patch,
})

const GIFT_TO_RECIPIENT = { ...EMPTY_GIFT, enabled: true, deliverToRecipient: true }

describe('validateStep — details', () => {
  it('asks for a name, an email and a Kuwaiti mobile', () => {
    expect(validateStep('details', EMPTY_FORM)).toEqual({
      name: 'checkout.err.required',
      email: 'checkout.err.required',
      mobile: 'checkout.err.required',
    })
    expect(validateStep('details', filled())).toEqual({})
  })

  it('rejects a malformed email and a number that is not a Kuwaiti mobile', () => {
    const errors = validateStep('details', filled({ email: 'noura@', mobile: '22001234' }))
    expect(errors).toEqual({ email: 'checkout.err.email', mobile: 'checkout.err.mobile' })
  })

  it('accepts a mobile typed in Arabic-Indic digits', () => {
    expect(validateStep('details', filled({ mobile: '٩٩٨٨٧٧٦٦' }))).toEqual({})
  })
})

describe('validateStep — delivery', () => {
  it('passes the address errors through as dictionary keys', () => {
    const errors = validateStep('delivery', filled({ address: { ...ADDRESS, block: '0', street: '' } }))
    expect(errors).toEqual({ block: 'checkout.err.block', street: 'checkout.err.required' })
  })

  it('needs the recipient only when the gift goes straight to them', () => {
    expect(validateStep('delivery', filled(), { ...EMPTY_GIFT, enabled: true })).toEqual({})
    expect(validateStep('delivery', filled(), GIFT_TO_RECIPIENT)).toEqual({
      recipientName: 'checkout.err.required',
      recipientMobile: 'checkout.err.required',
    })
    expect(
      validateStep('delivery', filled({ recipientName: 'Sara', recipientMobile: '1234' }), GIFT_TO_RECIPIENT),
    ).toEqual({ recipientMobile: 'checkout.err.mobile' })
    // A switched-off gift keeps its old flag; it must not ask for anyone.
    expect(toRecipient({ ...EMPTY_GIFT, enabled: false, deliverToRecipient: true })).toBe(false)
  })

  it('asks for the area name when "Other area" is chosen', () => {
    const errors = validateStep('delivery', filled({ address: { ...ADDRESS, area: 'other' } }))
    expect(errors).toEqual({ areaOther: 'checkout.err.required' })
  })
})

describe('validateStep — review', () => {
  it('needs a payment method, and no cash from a gift recipient', () => {
    expect(validateStep('review', filled({ payment: '' }))).toEqual({ payment: 'checkout.err.payment' })
    expect(validateStep('review', filled({ payment: 'cod' }))).toEqual({})
    expect(validateStep('review', filled({ payment: 'cod' }), GIFT_TO_RECIPIENT)).toEqual({
      payment: 'checkout.err.codGift',
    })
  })
})

describe('firstIncompleteStep', () => {
  it('points at the earliest step with something to fix', () => {
    expect(firstIncompleteStep(filled())).toBeNull()
    expect(firstIncompleteStep(filled({ email: '' }))?.index).toBe(0)
    // Turning on direct delivery at review sends the shopper back to delivery.
    expect(firstIncompleteStep(filled(), GIFT_TO_RECIPIENT)?.index).toBe(1)
  })
})

describe('field bookkeeping', () => {
  it('orders errors as the form reads and labels every field', () => {
    expect(orderedErrors('delivery', { street: 'x', governorate: 'x', recipientName: 'x' })).toEqual([
      'recipientName',
      'governorate',
      'street',
    ])
    for (const field of Object.values(FIELD_ORDER).flat()) {
      expect(STRINGS.en[FIELD_LABELS[field]], field).toBeTruthy()
      expect(STRINGS.ar[FIELD_LABELS[field]], field).toBeTruthy()
    }
  })

  it('only saves floor and apartment for an apartment building', () => {
    expect(addressFor(filled({ buildingType: 'house' }))).toMatchObject({ floor: '', apartment: '' })
    expect(addressFor(filled({ buildingType: 'apartment' }))).toMatchObject({ floor: '2', apartment: '5' })
  })

  it('knows a listed area from "other" or nothing', () => {
    expect(areaIdOf({ area: 'khiran' })).toBe('khiran')
    expect(areaIdOf({ area: 'other' })).toBeNull()
    expect(areaIdOf({ area: 'constructor' })).toBeNull()
  })
})

describe('the mobile field', () => {
  it('keeps 8 Latin digits from whatever is typed or pasted', () => {
    expect(mobileDigits('٩١٢٣ ٤٥٦٧')).toBe('91234567')
    expect(mobileDigits('+965 9123 4567')).toBe('91234567')
    expect(mobileDigits('00965-9123-4567')).toBe('91234567')
    expect(mobileDigits('9651 2345')).toBe('96512345') // a local number that starts 965
    expect(mobileDigits('912345678')).toBe('91234567')
  })

  it('groups as 4 + 4 and keeps the caret beside the same digit', () => {
    expect(groupMobile('9123')).toBe('9123')
    expect(groupMobile('91234')).toBe('9123 4')
    expect(caretAfterDigits('9123 4567', 4)).toBe(4)
    expect(caretAfterDigits('9123 4567', 5)).toBe(6)
    expect(caretAfterDigits('9123 4567', 0)).toBe(0)
    expect(caretAfterDigits('9123', 9)).toBe(4)
  })
})

describe('orderReference', () => {
  it('reads as NFS- and six unambiguous characters', () => {
    expect(orderReference(() => new Uint8Array([0, 31, 32, 255, 18, 9]))).toBe('NFS-0Z0ZJ9')
    for (let i = 0; i < 50; i += 1) expect(orderReference()).toMatch(/^NFS-[0-9A-HJKMNP-TV-Z]{6}$/)
  })
})

describe('buildReceipt', () => {
  const product = PRODUCTS_BY_ID['oud-noir']
  const lines = detailLines([{ id: 'oud-noir__full', productId: 'oud-noir', formatId: 'full', qty: 1 }])

  it('captures who, where, when and what before the cart empties', () => {
    // Sunday 11 October 2026, 10:00 in Kuwait.
    const now = new Date('2026-10-11T10:00:00+03:00')
    const gift = { ...GIFT_TO_RECIPIENT, message: 'Eid Mubarak' }
    const form = filled({
      recipientName: '  Sara   Al-Sabah ',
      recipientMobile: '+965 5555 1234',
      address: { ...ADDRESS, area: 'khiran', governorate: 'ahmadi' },
      payment: 'card',
    })
    const totals = cartTotals(lines, gift, 'khiran')
    const receipt = buildReceipt({ form, gift, lines, totals, now, reference: 'NFS-TEST01' })

    expect(receipt.reference).toBe('NFS-TEST01')
    expect(receipt.customer).toEqual({ name: 'Noura Al-Mutairi', email: 'noura@example.com', mobile: '91234567' })
    expect(receipt.recipient).toEqual({ name: 'Sara Al-Sabah', mobile: '55551234' })
    // A house: the floor and apartment typed earlier are not kept.
    expect(receipt.address).toMatchObject({ area: 'khiran', floor: '', apartment: '' })
    // Remote: never same-day; Sunday morning arrives Tuesday.
    expect(receipt.promise).toMatchObject({ type: 'remote', dateISO: '2026-10-13' })
    expect(receipt.totals.remoteSurchargeFils).toBeGreaterThan(0)
    expect(receipt.lines[0]).toMatchObject({ product, formatId: 'full', qty: 1, includesTestVial: true })
    expect(receipt.gift).toMatchObject({ message: 'Eid Mubarak' })
    expect(receipt.payment).toBe('card')
  })

  it('has no recipient and no gift for an ordinary order', () => {
    const receipt = buildReceipt({ form: filled(), gift: EMPTY_GIFT, lines, totals: cartTotals(lines) })
    expect(receipt.recipient).toBeNull()
    expect(receipt.gift).toBeNull()
    expect(receipt.reference).toMatch(/^NFS-/)
  })
})
