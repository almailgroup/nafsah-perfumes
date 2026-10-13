import { describe, expect, it } from 'vitest'
import { FAQ, SHIPPING_DOC, fillPolicy, policyVars } from './help'
import { LEGAL, LEGAL_NOTE } from './legal'
import { CORE } from '../i18n/strings'
import { RETURN_WINDOW_DAYS } from './delivery'

const LANGS = ['en', 'ar']
const placeholders = (text) => [...String(text).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()

// Every bilingual { en, ar } entry anywhere in a document.
function entries(node, out = []) {
  if (Array.isArray(node)) node.forEach((child) => entries(child, out))
  else if (node && typeof node === 'object') {
    if (typeof node.en === 'string' && typeof node.ar === 'string') out.push(node)
    else Object.values(node).forEach((child) => entries(child, out))
  }
  return out
}

const DOCS = { shipping: SHIPPING_DOC, faq: FAQ, privacy: LEGAL.privacy, terms: LEGAL.terms, note: LEGAL_NOTE }

// The core strings that are filled from policyVars() rather than by t() vars.
const POLICY_CORE = [
  ...CORE.en.announce.map((_, i) => ({ en: CORE.en.announce[i], ar: CORE.ar.announce[i] })),
  ...['houseLede', 'houseGrasseBody', 'houseStrengthBody'].map((key) => ({ en: CORE.en[key], ar: CORE.ar[key] })),
]

describe('policy copy', () => {
  it('uses only placeholders policyVars() fills, the same ones in both languages', () => {
    const known = Object.keys(policyVars('en'))
    for (const [name, doc] of Object.entries({ ...DOCS, core: POLICY_CORE })) {
      for (const entry of entries(doc)) {
        expect(placeholders(entry.ar), `${name}: ${entry.en}`).toEqual(placeholders(entry.en))
        for (const p of placeholders(entry.en)) expect(known, `${name}: {${p}}`).toContain(p)
      }
    }
  })

  it('leaves no placeholder behind and no Latin digit in Arabic', () => {
    for (const [name, doc] of Object.entries({ ...DOCS, core: POLICY_CORE })) {
      for (const entry of entries(doc)) {
        for (const lang of LANGS) expect(fillPolicy(entry[lang], lang), name).not.toMatch(/\{\w+\}/)
        // nafsah.com is a domain name, not a number.
        expect(fillPolicy(entry.ar, 'ar').replace('nafsah.com', ''), `${name}: ${entry.en}`).not.toMatch(/[0-9]/)
      }
    }
  })

  it('formats every figure for its language', () => {
    expect(policyVars('en')).toMatchObject({
      threshold: 'KWD 75.000',
      cutoff: '14:00',
      restDays: 'Fridays',
      returnPeriod: `${RETURN_WINDOW_DAYS} days`,
      vial: '2 ml',
      tryFirstFormats: 'Full Bottle, 50ml Spray and Tola Oil',
      extraitOil: '20–30%',
      founded: '1974',
    })
    expect(policyVars('ar')).toMatchObject({
      threshold: 'د.ك. ٧٥٫٠٠٠',
      cutoff: '١٤:٠٠',
      restDays: 'الجمعة',
      returnPeriod: '٣٠ يوماً',
      remoteDelay: 'يوم توصيل إضافي',
      vial: '٢ مل',
      extraitOil: '٢٠–٣٠٪',
      founded: '١٩٧٤',
    })
  })

  it('fills every occurrence, and keeps an unknown placeholder visible', () => {
    expect(fillPolicy('{cutoff} and {cutoff}', 'en')).toBe('14:00 and 14:00')
    expect(fillPolicy('{nope}', 'en')).toBe('{nope}')
  })
})

describe('anchors', () => {
  it('gives every section and FAQ group a unique, stable id', () => {
    for (const doc of [SHIPPING_DOC, LEGAL.privacy, LEGAL.terms]) {
      const ids = doc.sections.map((section) => section.id)
      expect(ids.every((id) => /^[a-z0-9-]+$/.test(id))).toBe(true)
      expect(new Set(ids).size).toBe(ids.length)
    }
    const groups = FAQ.groups.map((group) => group.id)
    expect(new Set(groups).size).toBe(groups.length)
  })

  it('keeps the addresses other pages link to', () => {
    expect(FAQ.groups.map((group) => group.id)).toContain('gifting')
    expect(SHIPPING_DOC.sections.map((section) => section.id)).toContain('try-first')
    expect(LEGAL.terms.sections.map((section) => section.id)).toContain('returns-and-cancellation')
  })
})

describe('what the copy no longer promises', () => {
  const all = Object.values(DOCS)
    .flatMap((doc) => entries(doc))
    .map((entry) => entry.en)
    .join('\n')

  it('has no accounts, no free samples with every order and no "over" threshold', () => {
    expect(all).not.toMatch(/\baccount\b/i)
    expect(all).not.toMatch(/two (2ml )?samples/i)
    expect(all).not.toMatch(/over \{threshold\}/)
    expect(all).not.toMatch(/quoted at checkout/i)
  })
})
