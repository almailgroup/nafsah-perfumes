import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { auditStrings } from '../../scripts/check-i18n.mjs'
import { LocaleProvider } from './LocaleProvider'
import { interpolate, translate, translateCount, translateValue, useLocale } from './locale-context'
import { CORE, DICTIONARIES, LANGUAGES, STRINGS, mergeStrings } from './strings'

const NAMESPACES = ['catalogue', 'product', 'reviews', 'trust', 'finder', 'checkout', 'gifting', 'delivery']

const audit = (core, dictionaries = {}) => auditStrings({ core, dictionaries })
const empty = { en: {}, ar: {} }

describe('the shipped dictionaries', () => {
  it('pass the i18n audit (npm run check:i18n)', () => {
    const { errors } = auditStrings()
    expect(errors, errors.join('\n')).toEqual([])
  })

  it('merge all eight feature dictionaries', () => {
    expect(Object.keys(DICTIONARIES).sort()).toEqual([...NAMESPACES].sort())
    for (const name of NAMESPACES) {
      expect(DICTIONARIES[name].en, name).toBeTypeOf('object')
      expect(DICTIONARIES[name].ar, name).toBeTypeOf('object')
    }
    expect(LANGUAGES).toEqual(['en', 'ar'])
  })

  it('keep every core string exactly as it was', () => {
    for (const lang of LANGUAGES) {
      for (const [key, value] of Object.entries(CORE[lang])) expect(STRINGS[lang][key], key).toBe(value)
    }
    expect(STRINGS.en.dir).toBe('ltr')
    expect(STRINGS.ar.dir).toBe('rtl')
  })

  it('carry every feature key into the merged table', () => {
    for (const lang of LANGUAGES) {
      for (const dict of Object.values(DICTIONARIES)) {
        for (const [key, value] of Object.entries(dict[lang])) expect(STRINGS[lang][key], key).toBe(value)
      }
    }
  })
})

describe('mergeStrings', () => {
  const core = { en: { a: 'A' }, ar: { a: 'أ' } }

  it('throws in strict (development) mode when a key is defined twice', () => {
    const dup = { checkout: { en: { a: 'again' }, ar: {} } }
    expect(() => mergeStrings(core, dup, { strict: true })).toThrow(/"a" \(en\) in dict\/checkout\.js/)
  })

  it('keeps the first definition otherwise', () => {
    const dup = { checkout: { en: { a: 'again', 'checkout.b': 'B' }, ar: {} } }
    expect(mergeStrings(core, dup, { strict: false }).en).toEqual({ a: 'A', 'checkout.b': 'B' })
  })

  it('is strict under Vitest by default', () => {
    expect(() => mergeStrings(core, { trust: { en: {}, ar: { a: 'x' } } })).toThrow()
  })
})

describe('the audit catches', () => {
  it('a key missing in one language', () => {
    const { errors } = audit({ en: { a: 'A', b: 'B' }, ar: { a: 'أ' } })
    expect(errors).toEqual(['"b" is missing in ar (strings.js)'])
  })

  it('placeholders that differ', () => {
    const { errors } = audit({ en: { a: '{amount} away' }, ar: { a: 'يفصلك {total}' } })
    expect(errors).toHaveLength(1)
    expect(errors[0]).toMatch(/"a" placeholders differ — en: \{amount\}, ar: \{total\}/)
  })

  it('empty strings, empty lists and non-strings', () => {
    const { errors } = audit({ en: { a: ' ', b: [], c: 3 }, ar: { a: 'أ', b: [], c: 'ج' } })
    expect(errors.join('\n')).toMatch(/"a" is empty/)
    expect(errors.join('\n')).toMatch(/"b" is an empty list/)
    expect(errors.join('\n')).toMatch(/"c" is not a string/)
  })

  it('lists that differ in length or placeholders', () => {
    expect(audit({ en: { a: ['x', 'y'] }, ar: { a: ['س'] } }).errors[0]).toMatch(/2 items in en and 1 in ar/)
    expect(audit({ en: { a: ['{n}'] }, ar: { a: ['س'] } }).errors[0]).toMatch(/"a"\[0\] placeholders differ/)
  })

  it('a key outside its namespace, and a key defined twice', () => {
    const { errors } = audit(
      { en: { shared: 'S' }, ar: { shared: 'ش' } },
      {
        product: { en: { 'checkout.x': 'X' }, ar: { 'checkout.x': 'س' } },
        checkout: { en: { shared: 'again' }, ar: { shared: 'مرة' } },
      },
    )
    const text = errors.join('\n')
    expect(text).toMatch(/dict\/product\.js \[en\] "checkout\.x": keys here must start with "product\."/)
    expect(text).toMatch(/"shared" \[en\] is defined in both strings\.js and dict\/checkout\.js/)
  })

  it('a dictionary without a language', () => {
    expect(audit(empty, { gifting: { en: {} } }).errors).toEqual(['dict/gifting.js: no "ar" dictionary'])
  })
})

describe('the audit compares plurals by base key', () => {
  const reviews = (en, ar) => audit(empty, { reviews: { en, ar } })

  it('accepts English one/other against a full Arabic set', () => {
    const { errors, warnings, stats } = reviews(
      { 'reviews.count.one': '{count} review', 'reviews.count.other': '{count} reviews' },
      {
        'reviews.count.zero': 'لا مراجعات',
        'reviews.count.one': 'مراجعة واحدة',
        'reviews.count.two': 'مراجعتان',
        'reviews.count.few': '{count} مراجعات',
        'reviews.count.many': '{count} مراجعة',
        'reviews.count.other': '{count} مراجعة',
      },
    )
    expect(errors).toEqual([])
    expect(warnings).toEqual([])
    expect(stats.plurals).toBe(1)
  })

  it('accepts Arabic with only .other, with a note', () => {
    const { errors, warnings } = reviews(
      { 'reviews.count.one': '{count} review', 'reviews.count.other': '{count} reviews' },
      { 'reviews.count.other': '{count} مراجعة' },
    )
    expect(errors).toEqual([])
    expect(warnings[0]).toMatch(/"reviews\.count" \[ar\] falls back to \.other/)
  })

  it('requires English .one and .other, and Arabic .other', () => {
    const { errors } = reviews({ 'reviews.count.other': '{count} reviews' }, { 'reviews.count.one': 'مراجعة' })
    expect(errors).toContain('plural "reviews.count" [en] needs .one')
    expect(errors).toContain('plural "reviews.count" [ar] needs .other')
  })

  it('rejects forms the language never selects', () => {
    const { errors } = reviews(
      { 'reviews.n.one': 'one', 'reviews.n.few': 'few', 'reviews.n.other': 'other' },
      { 'reviews.n.other': 'أخرى' },
    )
    expect(errors).toEqual(['plural "reviews.n" [en] has .few, which en never uses'])
  })

  it('checks placeholders across forms, letting a form omit {count}', () => {
    const ok = reviews(
      { 'reviews.by.one': 'One review by {name}', 'reviews.by.other': '{count} reviews by {name}' },
      { 'reviews.by.two': 'مراجعتان من {name}', 'reviews.by.other': '{count} مراجعة من {name}' },
    )
    expect(ok.errors).toEqual([])
    const bad = reviews(
      { 'reviews.by.one': 'One review by {name}', 'reviews.by.other': '{count} reviews' },
      { 'reviews.by.other': '{count} مراجعة' },
    )
    expect(bad.errors[0]).toMatch(/plural "reviews\.by" placeholders differ/)
  })

  it('treats a lone ".other" key as ordinary copy, e.g. an "Other area" label', () => {
    const { errors, stats } = audit(empty, {
      checkout: { en: { 'checkout.area.other': 'Other area' }, ar: { 'checkout.area.other': 'منطقة أخرى' } },
    })
    expect(errors).toEqual([])
    expect(stats.plurals).toBe(0)
  })
})

describe('t / tc / tr', () => {
  const strings = {
    en: {
      hello: 'Hello {name}',
      onlyEn: 'English only',
      'reviews.count.one': '{count} review',
      'reviews.count.other': '{count} reviews',
      'items.left.one': 'One left of {total}',
      'items.left.other': '{count} left of {total}',
      'enOnly.count.one': '{count} thing',
      'enOnly.count.other': '{count} things',
    },
    ar: {
      hello: 'مرحباً {name}',
      'reviews.count.zero': 'لا مراجعات بعد',
      'reviews.count.one': 'مراجعة واحدة',
      'reviews.count.two': 'مراجعتان',
      'reviews.count.few': '{count} مراجعات',
      'reviews.count.many': '{count} مراجعة',
      'reviews.count.other': '{count} مراجعة',
      'items.left.other': 'تبقّى {count} من {total}',
    },
  }

  afterEach(() => vi.restoreAllMocks())

  it('t looks up, interpolates, and falls back to English then the key', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(translate('ar', 'hello', { name: 'نورة' }, strings)).toBe('مرحباً نورة')
    expect(translate('ar', 'onlyEn', undefined, strings)).toBe('English only')
    expect(translate('ar', 'nowhere', undefined, strings)).toBe('nowhere')
    expect(translate('en', 'hello', {}, strings)).toBe('Hello {name}')
    expect(translate('en', 'constructor', undefined, strings)).toBe('constructor')
  })

  it('t still reads the real dictionary', () => {
    expect(translate('ar', 'awayFromFree', { amount: 'د.ك. ٥٫٠٠٠' })).toBe('يفصلك د.ك. ٥٫٠٠٠ عن التوصيل المجاني')
    expect(translate('en', 'announce')).toEqual(CORE.en.announce)
  })

  it('warns once per missing key and language, in development', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    translate('ar', 'test.missing.once', undefined, strings)
    translate('ar', 'test.missing.once', undefined, strings)
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toMatch(/No ar string for "test\.missing\.once"/)
    translate('en', 'test.missing.once', undefined, strings)
    expect(warn).toHaveBeenCalledTimes(2)
  })

  it('tc picks the English form', () => {
    expect(translateCount('en', 'reviews.count', 1, undefined, strings)).toBe('1 review')
    expect(translateCount('en', 'reviews.count', 0, undefined, strings)).toBe('0 reviews')
    expect(translateCount('en', 'reviews.count', 1250, undefined, strings)).toBe('1,250 reviews')
  })

  it('tc picks the Arabic form and writes {count} in Arabic-Indic digits', () => {
    const ar = (n) => translateCount('ar', 'reviews.count', n, undefined, strings)
    expect(ar(0)).toBe('لا مراجعات بعد')
    expect(ar(1)).toBe('مراجعة واحدة')
    expect(ar(2)).toBe('مراجعتان')
    expect(ar(5)).toBe('٥ مراجعات')
    expect(ar(11)).toBe('١١ مراجعة')
    expect(ar(100)).toBe('١٠٠ مراجعة')
  })

  it('tc falls back to .other, then to English, and keeps other placeholders', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(translateCount('ar', 'items.left', 3, { total: '٩' }, strings)).toBe('تبقّى ٣ من ٩')
    expect(translateCount('en', 'items.left', 1, { total: 9 }, strings)).toBe('One left of 9')
    expect(translateCount('ar', 'enOnly.count', 3, undefined, strings)).toBe('٣ things')
    expect(translateCount('en', 'test.no.plural', 3, undefined, strings)).toBe('test.no.plural')
  })

  it('tc formats {count} itself, whatever the caller passes', () => {
    expect(translateCount('ar', 'reviews.count', 7, { count: 7 }, strings)).toBe('٧ مراجعات')
  })

  it('tr reads { en, ar } values', () => {
    expect(translateValue('ar', { en: 'Rose', ar: 'ورد' })).toBe('ورد')
    expect(translateValue('en', { en: 'Rose', ar: 'ورد' })).toBe('Rose')
    expect(translateValue('ar', { en: 'Rose' })).toBe('Rose')
    expect(translateValue('ar', null)).toBe('')
    expect(translateValue('ar', undefined)).toBe('')
    expect(translateValue('ar', 'already text')).toBe('already text')
  })

  it('interpolate leaves unknown placeholders visible', () => {
    expect(interpolate('{a} and {b}', { a: 1 })).toBe('1 and {b}')
    expect(interpolate('{toString}', {})).toBe('{toString}')
    expect(interpolate(['x'], { a: 1 })).toEqual(['x'])
  })
})

describe('LocaleProvider', () => {
  afterEach(() => vi.restoreAllMocks())

  it('hands t, tc, tr and pick to its children', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    function Probe() {
      const { lang, dir, isRtl, t, tc, tr, pick } = useLocale()
      const out = [lang, dir, isRtl, t('brand'), tc('test.provider.count', 2), tr({ en: 'Rose', ar: 'ورد' }), pick('a', 'b')]
      return h('p', null, out.join('|'))
    }
    expect(renderToStaticMarkup(h(LocaleProvider, null, h(Probe)))).toContain(
      '<p>en|ltr|false|Nafsah|test.provider.count|Rose|a</p>',
    )
  })

  it('refuses to be used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const Orphan = () => h('p', null, useLocale().lang)
    expect(() => renderToStaticMarkup(h(Orphan))).toThrow(/inside a <LocaleProvider>/)
  })
})
