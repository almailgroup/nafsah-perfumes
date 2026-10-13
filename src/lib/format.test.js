import { describe, expect, it } from 'vitest'
import {
  ARABIC_DIGITS,
  classNames,
  formatDate,
  formatHours,
  formatMl,
  formatMobile,
  formatNumber,
  formatOrdinal,
  formatPrice,
  formatWeekday,
  fromFils,
  lineId,
  pluralCategory,
  toFils,
  toLatinDigits,
} from './format'

const ALM = String.fromCharCode(0x061c)
const DIRECTION_MARKS = /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/

describe('formatPrice — English', () => {
  it.each([
    [75000, 'KWD 75.000'],
    [119000, 'KWD 119.000'],
    [4500, 'KWD 4.500'],
    [5500, 'KWD 5.500'],
    [1, 'KWD 0.001'],
    [0, 'KWD 0.000'],
    [1250000, 'KWD 1,250.000'],
    [1234567890, 'KWD 1,234,567.890'],
  ])('%s fils → %s', (fils, expected) => {
    expect(formatPrice(fils, 'en')).toBe(expected)
  })

  it('defaults to English', () => {
    expect(formatPrice(75000)).toBe('KWD 75.000')
  })
})

describe('formatPrice — Arabic', () => {
  it.each([
    [75000, 'د.ك. ٧٥٫٠٠٠'],
    [4500, 'د.ك. ٤٫٥٠٠'],
    [0, 'د.ك. ٠٫٠٠٠'],
    [1250000, 'د.ك. ١٬٢٥٠٫٠٠٠'],
    [1234567890, 'د.ك. ١٬٢٣٤٬٥٦٧٫٨٩٠'],
  ])('%s fils → %s', (fils, expected) => {
    expect(formatPrice(fils, 'ar')).toBe(expected)
  })

  it('puts the symbol first and carries no direction marks', () => {
    const out = formatPrice(75000, 'ar')
    expect(out.startsWith('د.ك. ')).toBe(true)
    expect(out).not.toMatch(DIRECTION_MARKS)
    expect(formatPrice(75000, 'en')).not.toMatch(DIRECTION_MARKS)
  })

  it('uses Arabic-Indic digits by default (ARABIC_DIGITS)', () => {
    expect(ARABIC_DIGITS).toBe(true)
    expect(formatPrice(75000, 'ar')).not.toMatch(/[0-9]/)
  })

  it('keeps Latin digits when the flag is off', () => {
    expect(formatPrice(75000, 'ar', { arabicDigits: false })).toBe('د.ك. 75.000')
    expect(formatPrice(1250000, 'ar', { arabicDigits: false })).toBe('د.ك. 1,250.000')
    // The flag only ever changes Arabic.
    expect(formatPrice(1250000, 'en', { arabicDigits: false })).toBe('KWD 1,250.000')
  })
})

describe('formatPrice — rounding and guards', () => {
  it('rounds to the nearest fil, halves away from zero', () => {
    expect(formatPrice(1234.4)).toBe('KWD 1.234')
    expect(formatPrice(1234.5)).toBe('KWD 1.235')
    expect(formatPrice(999.5)).toBe('KWD 1.000')
    expect(formatPrice(-1234.5)).toBe('-KWD 1.235')
  })

  it('never shows binary-fraction noise', () => {
    expect(formatPrice(toFils(0.1 + 0.2))).toBe('KWD 0.300')
    expect(formatPrice(toFils(1.005))).toBe('KWD 1.005')
  })

  it('formats negatives with the sign before the amount', () => {
    expect(formatPrice(-5000)).toBe('-KWD 5.000')
    expect(formatPrice(-5000, 'ar')).toBe(`د.ك. ${ALM}-٥٫٠٠٠`)
    expect(formatPrice(-0.4)).toBe('KWD 0.000')
  })

  it('accepts numeric strings, in either script', () => {
    expect(formatPrice('75000')).toBe('KWD 75.000')
    expect(formatPrice('٧٥٠٠٠', 'ar')).toBe('د.ك. ٧٥٫٠٠٠')
  })

  it.each([NaN, Infinity, -Infinity, null, undefined, '', '  ', 'abc', {}, []])(
    'returns an em dash for %s',
    (value) => {
      expect(formatPrice(value)).toBe('—')
      expect(formatPrice(value, 'ar')).toBe('—')
    },
  )
})

describe('toFils / fromFils', () => {
  it('converts dinars to integer fils and back', () => {
    expect(toFils(75)).toBe(75000)
    expect(toFils(5.5)).toBe(5500)
    expect(toFils(1.005)).toBe(1005)
    expect(toFils(0.1 + 0.2)).toBe(300)
    expect(fromFils(75000)).toBe(75)
    expect(fromFils(4500)).toBe(4.5)
    expect(fromFils(toFils(119))).toBe(119)
  })
})

describe('formatNumber', () => {
  it('groups and keeps decimals in both scripts', () => {
    expect(formatNumber(1234.5)).toBe('1,234.5')
    expect(formatNumber(1234.5, 'ar')).toBe('١٬٢٣٤٫٥')
    expect(formatNumber(12, 'ar')).toBe('١٢')
  })

  it('passes Intl options through', () => {
    expect(formatNumber(2019, 'ar', { useGrouping: false })).toBe('٢٠١٩')
    expect(formatNumber(4.25, 'en', { maximumFractionDigits: 1 })).toBe('4.3')
    expect(formatNumber(4.25, 'ar', { maximumFractionDigits: 1 })).toBe('٤٫٣')
  })

  it('honours the Latin-digit option in Arabic', () => {
    expect(formatNumber(1234, 'ar', { arabicDigits: false })).toBe('1,234')
  })

  it('guards non-numbers', () => {
    expect(formatNumber(NaN)).toBe('—')
    expect(formatNumber(Infinity, 'ar')).toBe('—')
    expect(formatNumber(null)).toBe('—')
  })
})

describe('formatOrdinal', () => {
  it('zero-pads in the active script', () => {
    expect(formatOrdinal(3)).toBe('03')
    expect(formatOrdinal(3, 'ar')).toBe('٠٣')
    expect(formatOrdinal(12, 'ar')).toBe('١٢')
    expect(formatOrdinal(3, 'ar', { arabicDigits: false })).toBe('03')
  })
})

describe('formatMl / formatHours', () => {
  it('labels volumes', () => {
    expect(formatMl(100)).toBe('100 ml')
    expect(formatMl(100, 'ar')).toBe('١٠٠ مل')
    expect(formatMl(2, 'ar')).toBe('٢ مل')
    expect(formatMl(NaN)).toBe('—')
  })

  it('labels hours with Arabic number agreement', () => {
    expect(formatHours(12)).toBe('12 h')
    expect(formatHours(12, 'ar')).toBe('١٢ ساعة')
    expect(formatHours(8, 'ar')).toBe('٨ ساعات')
    expect(formatHours(3, 'ar')).toBe('٣ ساعات')
    expect(formatHours(11, 'ar')).toBe('١١ ساعة')
    expect(formatHours(2, 'ar')).toBe('ساعتان')
    expect(formatHours(1, 'ar')).toBe('ساعة واحدة')
    expect(formatHours(7.5, 'ar')).toBe('٧٫٥ ساعة')
    expect(formatHours(1.04, 'ar')).toBe('ساعة واحدة')
    expect(formatHours('٨', 'ar')).toBe('٨ ساعات')
    expect(formatHours(undefined, 'ar')).toBe('—')
  })
})

describe('formatMobile', () => {
  it.each(['91234567', '9123 4567', '9123-4567', '+965 9123 4567', '0096591234567', '٩١٢٣٤٥٦٧'])(
    '%s → +965 9123 4567',
    (input) => {
      expect(formatMobile(input)).toBe('+965 9123 4567')
    },
  )

  it('returns anything that is not a Kuwaiti number as typed', () => {
    expect(formatMobile(' 12345 ')).toBe('12345')
    expect(formatMobile(null)).toBe('')
  })
})

describe('dates', () => {
  it('prints a calendar day as that day', () => {
    expect(formatDate('2026-10-13')).toBe('13 October 2026')
    const ar = formatDate('2026-10-13', 'ar')
    expect(ar).toContain('١٣')
    expect(ar).toContain('٢٠٢٦')
    expect(ar).not.toMatch(/[0-9]/)
  })

  it('names the weekday', () => {
    expect(formatWeekday('2026-10-17')).toBe('Saturday')
    expect(formatWeekday('2026-10-17', 'ar')).toBe('السبت')
  })

  it('guards invalid dates', () => {
    expect(formatDate('not a date')).toBe('—')
    expect(formatWeekday('')).toBe('—')
  })
})

describe('helpers', () => {
  it('maps Arabic-Indic and Persian digits to Latin and leaves the rest', () => {
    expect(toLatinDigits('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789')
    expect(toLatinDigits('۰۱۲۳۴۵۶۷۸۹')).toBe('0123456789')
    expect(toLatinDigits('قطعة ٣ / Block 3')).toBe('قطعة 3 / Block 3')
    expect(toLatinDigits(null)).toBe('')
    expect(toLatinDigits(42)).toBe('42')
  })

  it('knows plural categories', () => {
    expect(pluralCategory(1)).toBe('one')
    expect(pluralCategory(2)).toBe('other')
    expect(pluralCategory(0, 'ar')).toBe('zero')
    expect(pluralCategory(2, 'ar')).toBe('two')
    expect(pluralCategory(5, 'ar')).toBe('few')
    expect(pluralCategory(11, 'ar')).toBe('many')
  })

  it('builds cart line ids from product and format', () => {
    expect(lineId('oud-noir', 'spray50')).toBe('oud-noir__spray50')
  })

  it('joins class names', () => {
    expect(classNames('a', false, null, undefined, '', 'b')).toBe('a b')
  })
})
