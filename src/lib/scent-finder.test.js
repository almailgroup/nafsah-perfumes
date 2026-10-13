import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '../data/products'
import { NOTES } from '../data/notes'
import { FAMILY_BY_ID } from '../data/taxonomy'
import finder from '../i18n/dict/finder.js'
import {
  QUESTIONS,
  QUESTION_IDS,
  WEIGHTS,
  answersFromSearch,
  familiesFor,
  isComplete,
  optionOf,
  recommend,
  sanitizeAnswers,
  searchFromAnswers,
} from './scent-finder'

const top = (answers, n = 3) => recommend(answers, PRODUCTS).slice(0, n).map((r) => r.product.id)

/** Every full set of answers: 4 × 4 × 3 × 3 × 3 = 432. */
const ALL_ANSWERS = QUESTIONS.reduce(
  (sets, question) => sets.flatMap((set) => question.options.map((option) => ({ ...set, [question.id]: option.id }))),
  [{}],
)

describe('QUESTIONS', () => {
  it('asks the five questions of the brief, in order, with the brief’s options', () => {
    expect(QUESTION_IDS).toEqual(['occasion', 'vibe', 'season', 'projection', 'wearer'])
    const options = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.options.map((o) => o.id)]))
    expect(options).toEqual({
      occasion: ['diwaniya', 'office', 'wedding', 'everyday'],
      vibe: ['heavy-oud', 'fresh-blue', 'floral', 'sweet-gourmand'],
      season: ['summer', 'winter', 'all-year'],
      projection: ['soft', 'noticeable', 'beast'],
      wearer: ['him', 'her', 'anyone'],
    })
  })

  it('gives every question and option English and Arabic copy, a hint and an icon', () => {
    const arabic = /[؀-ۿ]/
    for (const question of QUESTIONS) {
      for (const field of ['label', 'title', 'hint']) {
        expect(question[field].en, `${question.id}.${field}`).toBeTruthy()
        expect(question[field].ar, `${question.id}.${field}`).toMatch(arabic)
      }
      for (const option of question.options) {
        expect(option.en).toBeTruthy()
        expect(option.ar).toMatch(arabic)
        expect(option.hint.en).toBeTruthy()
        expect(option.hint.ar).toMatch(arabic)
        expect(option.icon).toMatch(/^[A-Z][A-Za-z0-9]+$/)
      }
    }
  })

  it('weights the questions to a total of 100', () => {
    expect(Object.keys(WEIGHTS)).toEqual(QUESTION_IDS)
    expect(Object.values(WEIGHTS).reduce((a, b) => a + b, 0)).toBe(100)
  })
})

describe('answers', () => {
  it('keeps only known questions and options', () => {
    expect(
      sanitizeAnswers({ occasion: 'office', vibe: 'nope', season: 'summer', extra: 'x', constructor: 'y', wearer: 3 }),
    ).toEqual({ occasion: 'office', season: 'summer' })
    expect(sanitizeAnswers(null)).toEqual({})
    expect(optionOf('vibe', 'toString')).toBeNull()
    expect(optionOf('toString', 'x')).toBeNull()
  })

  it('round-trips through the query string in asking order', () => {
    const answers = { wearer: 'her', occasion: 'wedding', vibe: 'floral', season: 'all-year', projection: 'noticeable' }
    const search = searchFromAnswers(answers)
    expect(search).toBe('?occasion=wedding&vibe=floral&season=all-year&projection=noticeable&wearer=her')
    expect(answersFromSearch(search)).toEqual(answers)
    expect(answersFromSearch(new URLSearchParams(search))).toEqual(answers)
    expect(isComplete(answersFromSearch(search))).toBe(true)
  })

  it('reads a partial or tampered query string safely', () => {
    expect(answersFromSearch('?occasion=office&vibe=%3Cscript%3E&utm_source=x')).toEqual({ occasion: 'office' })
    expect(answersFromSearch('')).toEqual({})
    expect(answersFromSearch(undefined)).toEqual({})
    expect(isComplete({ occasion: 'office' })).toBe(false)
    expect(searchFromAnswers({})).toBe('')
  })
})

describe('recommend', () => {
  it('ranks every product, once, with an integer score from 0 to 100', () => {
    for (const answers of ALL_ANSWERS) {
      const results = recommend(answers, PRODUCTS)
      expect(results).toHaveLength(PRODUCTS.length)
      expect(new Set(results.map((r) => r.product.id)).size).toBe(PRODUCTS.length)
      for (const { score } of results) {
        expect(Number.isInteger(score)).toBe(true)
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      }
      for (let i = 1; i < results.length; i += 1) expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score)
    }
  })

  it('always offers at least three fragrances with a score above zero', () => {
    for (const answers of ALL_ANSWERS) {
      const positive = recommend(answers, PRODUCTS).filter((r) => r.score > 0)
      expect(positive.length, JSON.stringify(answers)).toBeGreaterThanOrEqual(3)
    }
  })

  it('gives a perfect fit a perfect score', () => {
    // Qahwa: gourmand 60, Diwaniya and everyday, winter, strong, unisex.
    const [first] = recommend(
      { occasion: 'everyday', vibe: 'sweet-gourmand', season: 'winter', projection: 'noticeable', wearer: 'anyone' },
      PRODUCTS,
    )
    expect(first.product.id).toBe('qahwa')
    expect(first.score).toBe(100)
  })

  it('finds the oud for a Diwaniya in winter', () => {
    const picks = top({ occasion: 'diwaniya', vibe: 'heavy-oud', season: 'winter', projection: 'beast', wearer: 'him' })
    for (const id of picks) expect(['safran-imperial', 'oud-noir', 'cedre-fume', 'dehn-al-oud']).toContain(id)
  })

  it('finds the fresh scents for an office in summer, kept close', () => {
    const picks = top({ occasion: 'office', vibe: 'fresh-blue', season: 'summer', projection: 'soft', wearer: 'anyone' })
    expect(picks[0]).toBe('bergamote-dor')
    expect(picks).toEqual(expect.arrayContaining(['bergamote-dor', 'fleur-de-neroli']))
    for (const id of picks) expect(PRODUCTS.find((p) => p.id === id).seasons).toContain('summer')
  })

  it('finds the roses for a wedding', () => {
    const picks = top({ occasion: 'wedding', vibe: 'floral', season: 'all-year', projection: 'noticeable', wearer: 'her' })
    expect(picks).toEqual(expect.arrayContaining(['rose-imperiale', 'nuit-de-jasmin']))
    for (const id of picks) expect(PRODUCTS.find((p) => p.id === id).occasions).toContain('wedding')
  })

  it('puts beast mode that survives 45°C first for a Kuwaiti summer', () => {
    const [first] = top({ occasion: 'everyday', vibe: 'fresh-blue', season: 'summer', projection: 'beast', wearer: 'him' })
    expect(first).toBe('citron-de-mer')
  })

  it('never puts a gendered fragrance for the other wearer in the top three when unisex ones exist', () => {
    for (const answers of ALL_ANSWERS.filter((a) => a.wearer !== 'anyone')) {
      const other = answers.wearer === 'him' ? 'women' : 'men'
      for (const id of top(answers)) {
        expect(PRODUCTS.find((p) => p.id === id).gender, JSON.stringify(answers)).not.toBe(other)
      }
    }
  })

  it('reads partial answers over the questions answered', () => {
    const results = recommend({ vibe: 'fresh-blue' }, PRODUCTS)
    expect(results[0].product.family).toBe('fresh-aquatic')
    expect(results[0].score).toBe(100)
    expect(recommend({}, PRODUCTS).every((r) => r.score === 0)).toBe(true)
    expect(recommend({}, PRODUCTS).map((r) => r.product.id)).toEqual(PRODUCTS.map((p) => p.id))
  })

  it('is pure and deterministic', () => {
    const answers = { occasion: 'office', vibe: 'floral', season: 'summer', projection: 'soft', wearer: 'him' }
    const frozen = Object.freeze({ ...answers })
    const before = JSON.stringify(PRODUCTS)
    const a = recommend(frozen, PRODUCTS)
    const b = recommend(frozen, [...PRODUCTS])
    expect(a.map((r) => [r.product.id, r.score])).toEqual(b.map((r) => [r.product.id, r.score]))
    expect(JSON.stringify(PRODUCTS)).toBe(before)
    expect(a[0].product).toBe(PRODUCTS.find((p) => p.id === a[0].product.id))
  })

  it('breaks ties in catalogue order', () => {
    const results = recommend({ wearer: 'anyone' }, PRODUCTS)
    const unisex = results.filter((r) => r.score === 100).map((r) => r.product.id)
    expect(unisex).toEqual(PRODUCTS.filter((p) => p.gender === 'unisex').map((p) => p.id))
  })
})

describe('reasons', () => {
  const en = finder.en
  const ar = finder.ar

  it('are at most three dictionary keys that exist in both languages, with resolvable vars', () => {
    const seen = new Set()
    for (const answers of ALL_ANSWERS) {
      for (const { reasons } of recommend(answers, PRODUCTS).slice(0, 6)) {
        expect(reasons.length).toBeLessThanOrEqual(3)
        for (const { key, vars } of reasons) {
          seen.add(key)
          expect(en[key], key).toBeTruthy()
          expect(ar[key], key).toBeTruthy()
          if (vars?.family) expect(FAMILY_BY_ID[vars.family]).toBeTruthy()
          if (vars?.note) expect(NOTES[vars.note]).toBeTruthy()
          if (vars?.hours) expect(Number.isFinite(vars.hours)).toBe(true)
        }
      }
    }
    // The three the brief names: 45°C heat, the Diwaniya, projecting without shouting.
    for (const key of ['finder.reason.heatThrives', 'finder.reason.occasion.diwaniya', 'finder.reason.projection.moderate']) {
      expect(seen.has(key), key).toBe(true)
    }
  })

  it('only claim what holds: a heat reason needs heat resistance of 4 or more', () => {
    for (const answers of ALL_ANSWERS.filter((a) => a.season !== 'winter')) {
      for (const { product, reasons } of recommend(answers, PRODUCTS)) {
        if (reasons.some((r) => r.key.startsWith('finder.reason.heat'))) {
          expect(product.heatResistance).toBeGreaterThanOrEqual(4)
        }
      }
    }
  })

  it('name the occasion only when the fragrance is made for it', () => {
    for (const answers of ALL_ANSWERS) {
      for (const { product, reasons } of recommend(answers, PRODUCTS)) {
        if (reasons.some((r) => r.key === `finder.reason.occasion.${answers.occasion}`)) {
          expect(product.occasions).toContain(answers.occasion)
        }
      }
    }
  })
})

describe('familiesFor', () => {
  it('maps each character to its families in display order', () => {
    expect(familiesFor({ vibe: 'heavy-oud' })).toEqual(['oud-musk', 'amber', 'french-arabic', 'bukhoor-oils'])
    expect(familiesFor({ vibe: 'fresh-blue' })).toEqual(['fresh-aquatic'])
    expect(familiesFor({ vibe: 'floral' })).toEqual(['rose'])
    expect(familiesFor({ vibe: 'sweet-gourmand' })).toEqual(['amber', 'gourmand'])
    expect(familiesFor({})).toEqual([])
  })

  it('always points at a non-empty part of the catalogue', () => {
    for (const option of QUESTIONS[1].options) {
      const families = familiesFor({ vibe: option.id })
      expect(PRODUCTS.filter((p) => families.includes(p.family)).length).toBeGreaterThan(0)
    }
  })
})
