import { describe, expect, it } from 'vitest'
import {
  ADDRESS_ERRORS,
  EMPTY_ADDRESS,
  formatAddress,
  isValidKuwaitMobile,
  normalizeAddress,
  normalizeMobile,
  toLatinDigits,
  validateAddress,
} from './address'

const SALMIYA = {
  governorate: 'hawalli',
  area: 'salmiya',
  areaOther: '',
  block: '3',
  street: '12',
  avenue: '4',
  building: '18',
  floor: '2',
  apartment: '5',
  directions: 'Opposite the co-op',
}

describe('toLatinDigits', () => {
  it('is re-exported for form inputs', () => {
    expect(toLatinDigits('٩٩١٢٣٤٥٦')).toBe('99123456')
    expect(toLatinDigits('۹۹۱۲')).toBe('9912')
  })
})

describe('normalizeMobile', () => {
  it.each([
    ['99123456', '99123456'],
    ['٩٩١٢٣٤٥٦', '99123456'],
    ['۹۹۱۲۳۴۵۶', '99123456'],
    ['9912 3456', '99123456'],
    ['9912-3456', '99123456'],
    [' 99 12 34 56 ', '99123456'],
    ['+965 9912 3456', '99123456'],
    ['+965-9912-3456', '99123456'],
    ['+٩٦٥ ٩٩١٢ ٣٤٥٦', '99123456'],
    ['00965 99123456', '99123456'],
    ['٠٠٩٦٥٩٩١٢٣٤٥٦', '99123456'],
    ['96599123456', '99123456'],
    ['(+965) 9912 3456', '99123456'],
    [`\u200E+965 9912 3456\u200F`, '99123456'],
  ])('%s → %s', (input, expected) => {
    expect(normalizeMobile(input)).toBe(expected)
  })

  it.each(['', null, undefined, '9912345', '991234567', '+966 5512 3456', 'phone', '9912345a', '+96599123456789'])(
    'rejects %s',
    (input) => {
      expect(normalizeMobile(input)).toBe('')
    },
  )

  it('keeps an 8-digit number that happens to start with 965', () => {
    expect(normalizeMobile('96512345')).toBe('96512345')
  })
})

describe('isValidKuwaitMobile', () => {
  it.each(['41234567', '51234567', '61234567', '91234567', '+965 6123 4567', '٥١٢٣٤٥٦٧'])('%s is valid', (n) => {
    expect(isValidKuwaitMobile(n)).toBe(true)
  })

  it.each(['11234567', '21234567', '31234567', '71234567', '81234567', '01234567'])(
    '%s has a non-mobile prefix',
    (n) => {
      expect(isValidKuwaitMobile(n)).toBe(false)
    },
  )

  it.each(['9123456', '912345678', '+965 912 3456', ''])('%s has the wrong length', (n) => {
    expect(isValidKuwaitMobile(n)).toBe(false)
  })
})

describe('normalizeAddress', () => {
  it('fills every field, trims, single-spaces and Latinises numbers', () => {
    expect(normalizeAddress({ block: ' ٣ ', street: ' شارع   ١٢ ', building: '١٨أ' })).toEqual({
      ...EMPTY_ADDRESS,
      block: '3',
      street: 'شارع 12',
      building: '18أ',
    })
  })

  it('strips a typed "Block" / "قطعة" word and leading zeros from the block', () => {
    expect(normalizeAddress({ block: 'Block 3' }).block).toBe('3')
    expect(normalizeAddress({ block: 'قطعة ٤' }).block).toBe('4')
    expect(normalizeAddress({ block: '03' }).block).toBe('3')
  })

  it('drops areaOther unless the area is "other"', () => {
    expect(normalizeAddress({ area: 'salmiya', areaOther: 'x' }).areaOther).toBe('')
    expect(normalizeAddress({ area: 'other', areaOther: ' Salhiya ' }).areaOther).toBe('Salhiya')
  })

  it('copes with nothing at all', () => {
    expect(normalizeAddress()).toEqual(EMPTY_ADDRESS)
    expect(normalizeAddress(null)).toEqual(EMPTY_ADDRESS)
  })
})

describe('validateAddress', () => {
  it('accepts a complete address', () => {
    expect(validateAddress(SALMIYA)).toEqual({})
  })

  it('accepts one without the optional fields', () => {
    expect(
      validateAddress({ governorate: 'ahmadi', area: 'khiran', block: '1', street: 'Coast Road', building: 'Villa 9' }),
    ).toEqual({})
  })

  it('requires governorate, area, block, street and building', () => {
    expect(validateAddress({})).toEqual({
      governorate: 'checkout.err.required',
      area: 'checkout.err.required',
      block: 'checkout.err.required',
      street: 'checkout.err.required',
      building: 'checkout.err.required',
    })
    expect(validateAddress({ ...SALMIYA, street: '   ' })).toEqual({ street: ADDRESS_ERRORS.required })
  })

  it('takes a block of 1–3 digits, in either script', () => {
    expect(validateAddress({ ...SALMIYA, block: '٣' })).toEqual({})
    expect(validateAddress({ ...SALMIYA, block: '123' })).toEqual({})
    expect(validateAddress({ ...SALMIYA, block: ' 12 ' })).toEqual({})
    expect(validateAddress({ ...SALMIYA, block: 'Block 7' })).toEqual({})
    for (const bad of ['1234', 'A', '3A', '0', '00', '-3', '1.5']) {
      expect(validateAddress({ ...SALMIYA, block: bad }), bad).toEqual({ block: 'checkout.err.block' })
    }
  })

  it('needs areaOther when the area is "other"', () => {
    expect(validateAddress({ ...SALMIYA, area: 'other' })).toEqual({ areaOther: 'checkout.err.required' })
    expect(validateAddress({ ...SALMIYA, area: 'other', areaOther: 'Salhiya' })).toEqual({})
  })

  it('rejects an area from another governorate, or one that does not exist', () => {
    expect(validateAddress({ ...SALMIYA, governorate: 'ahmadi' })).toEqual({ area: 'checkout.err.area' })
    expect(validateAddress({ ...SALMIYA, area: 'atlantis' })).toEqual({ area: 'checkout.err.area' })
    expect(validateAddress({ ...SALMIYA, area: 'toString' })).toEqual({ area: 'checkout.err.area' })
  })

  it('rejects an unknown governorate', () => {
    expect(validateAddress({ ...SALMIYA, governorate: 'basra' })).toEqual({
      governorate: 'checkout.err.governorate',
    })
  })
})

describe('formatAddress', () => {
  it('writes one English line', () => {
    expect(formatAddress(SALMIYA, 'en')).toBe(
      'Block 3, Street 12, Avenue 4, Building 18, Floor 2, Apt 5 — Salmiya, Hawalli',
    )
  })

  it('writes one Arabic line with Arabic-Indic digits', () => {
    expect(formatAddress(SALMIYA, 'ar')).toBe('قطعة ٣، شارع ١٢، جادة ٤، مبنى ١٨، الدور ٢، شقة ٥ — السالمية، حولي')
  })

  it('leaves out empty optional fields and the directions', () => {
    const minimal = { governorate: 'ahmadi', area: 'mangaf', block: '4', street: '20', building: '7' }
    expect(formatAddress(minimal)).toBe('Block 4, Street 20, Building 7 — Mangaf, Ahmadi')
    expect(formatAddress(minimal, 'ar')).toBe('قطعة ٤، شارع ٢٠، مبنى ٧ — المنقف، الأحمدي')
    expect(formatAddress(SALMIYA)).not.toContain('co-op')
  })

  it('does not double a label the shopper already typed', () => {
    const named = { ...SALMIYA, street: 'Baghdad Street', avenue: '', building: 'Villa 9', floor: '', apartment: '' }
    expect(formatAddress(named)).toBe('Block 3, Baghdad Street, Villa 9 — Salmiya, Hawalli')
    expect(formatAddress({ ...named, street: 'شارع بغداد' }, 'ar')).toBe(
      'قطعة ٣، شارع بغداد، Villa ٩ — السالمية، حولي',
    )
  })

  it('uses the typed name for "other" and the short Capital name', () => {
    const other = { governorate: 'capital', area: 'other', areaOther: 'Salhiya', block: '1', street: '5', building: '2' }
    expect(formatAddress(other)).toBe('Block 1, Street 5, Building 2 — Salhiya, Al Asimah')
    expect(formatAddress(other, 'ar')).toBe('قطعة ١، شارع ٥، مبنى ٢ — Salhiya، العاصمة')
  })

  it('takes the governorate from the area when it is missing', () => {
    expect(formatAddress({ area: 'jabriya', block: '1', street: '1', building: '1' })).toBe(
      'Block 1, Street 1, Building 1 — Jabriya, Hawalli',
    )
  })

  it('is empty for an empty address', () => {
    expect(formatAddress({})).toBe('')
  })
})
