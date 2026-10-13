import { describe, expect, it } from 'vitest'
import {
  AREAS,
  AREA_BY_ID,
  GOVERNORATES,
  GOVERNORATE_BY_ID,
  OTHER_AREA_ID,
  areasIn,
  isRemoteArea,
} from './kuwait'

const ARABIC_LETTER = /[\u0621-\u064A]/
const LATIN_LETTER = /[A-Za-z]/

describe('governorates', () => {
  it('are the six, in the contract order, with their names', () => {
    expect(GOVERNORATES.map(({ id, en, ar }) => ({ id, en, ar }))).toEqual([
      { id: 'capital', en: 'Al Asimah (Capital)', ar: 'العاصمة' },
      { id: 'hawalli', en: 'Hawalli', ar: 'حولي' },
      { id: 'farwaniya', en: 'Farwaniya', ar: 'الفروانية' },
      { id: 'mubarak-al-kabeer', en: 'Mubarak Al-Kabeer', ar: 'مبارك الكبير' },
      { id: 'ahmadi', en: 'Ahmadi', ar: 'الأحمدي' },
      { id: 'jahra', en: 'Jahra', ar: 'الجهراء' },
    ])
  })

  it('are indexed by id', () => {
    for (const g of GOVERNORATES) expect(GOVERNORATE_BY_ID[g.id]).toBe(g)
  })
})

describe('areas', () => {
  it('cover the country: a realistic count, every governorate represented', () => {
    expect(AREAS.length).toBeGreaterThanOrEqual(100)
    expect(AREAS.length).toBeLessThanOrEqual(140)
    for (const g of GOVERNORATES) expect(areasIn(g.id).length).toBeGreaterThanOrEqual(8)
  })

  it('have unique, kebab-case ids, none of them the "other" sentinel', () => {
    const ids = AREAS.map((a) => a.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/)
    expect(ids).not.toContain(OTHER_AREA_ID)
  })

  it('each belong to a governorate that exists', () => {
    for (const a of AREAS) expect(GOVERNORATE_BY_ID[a.governorate], a.id).toBeDefined()
  })

  it('have an Arabic name in Arabic letters and an English name in Latin ones', () => {
    for (const a of [...AREAS, ...GOVERNORATES]) {
      expect(a.ar, a.id).toMatch(ARABIC_LETTER)
      expect(a.ar, a.id).not.toMatch(LATIN_LETTER)
      expect(a.en, a.id).toMatch(LATIN_LETTER)
      expect(a.en, a.id).not.toMatch(ARABIC_LETTER)
      expect(a.en.trim(), a.id).toBe(a.en)
      expect(a.ar.trim(), a.id).toBe(a.ar)
    }
  })

  it('never repeat a name within a governorate, in either language', () => {
    for (const g of GOVERNORATES) {
      const list = areasIn(g.id)
      expect(new Set(list.map((a) => a.en)).size, g.id).toBe(list.length)
      expect(new Set(list.map((a) => a.ar)).size, g.id).toBe(list.length)
    }
  })

  it('all have the same shape', () => {
    for (const a of AREAS) {
      expect(Object.keys(a).sort()).toEqual(['ar', 'en', 'governorate', 'id', 'remote'])
      expect(typeof a.remote).toBe('boolean')
    }
  })

  it('include the well-known ones in the right governorate', () => {
    expect(AREA_BY_ID.salmiya).toMatchObject({ governorate: 'hawalli', en: 'Salmiya', ar: 'السالمية' })
    expect(AREA_BY_ID.jabriya.governorate).toBe('hawalli')
    expect(AREA_BY_ID.mangaf.governorate).toBe('ahmadi')
    expect(AREA_BY_ID.khaitan.governorate).toBe('farwaniya')
    expect(AREA_BY_ID.qurain.governorate).toBe('mubarak-al-kabeer')
    expect(AREA_BY_ID.oyoun.governorate).toBe('jahra')
    expect(AREA_BY_ID.kaifan.governorate).toBe('capital')
    expect(AREA_BY_ID.khiran).toMatchObject({ governorate: 'ahmadi', en: 'Al Khiran', ar: 'الخيران' })
  })
})

describe('remote areas', () => {
  it.each([
    'khiran',
    'wafra',
    'sabah-al-ahmad',
    'sabah-al-ahmad-sea-city',
    'zour',
    'nuwaiseeb',
    'bneider',
    'julaia',
    'abdali',
    'mutlaa',
    'subiya',
    'salmi',
    'rawdatain',
    'kabd',
    'failaka',
  ])('%s is remote', (id) => {
    expect(AREA_BY_ID[id], id).toBeDefined()
    expect(isRemoteArea(id)).toBe(true)
  })

  it.each(['salmiya', 'jabriya', 'hawalli', 'fahaheel', 'jahra'])('%s is not remote', (id) => {
    expect(isRemoteArea(id)).toBe(false)
  })

  it('is false for unknown, "other" and empty areas', () => {
    expect(isRemoteArea('atlantis')).toBe(false)
    expect(isRemoteArea(OTHER_AREA_ID)).toBe(false)
    expect(isRemoteArea(null)).toBe(false)
    expect(isRemoteArea(undefined)).toBe(false)
    expect(isRemoteArea('toString')).toBe(false)
  })
})

describe('areasIn', () => {
  it('returns only that governorate, sorted by English name ignoring a leading "Al"', () => {
    const list = areasIn('ahmadi')
    expect(list.every((a) => a.governorate === 'ahmadi')).toBe(true)
    const keys = list.map((a) => a.en.replace(/^al[\s-]+/i, ''))
    expect(keys).toEqual([...keys].sort((a, b) => a.localeCompare(b, 'en')))
    // "Al Khiran" files under K, between Jaber Al-Ali and Mahboula.
    const names = list.map((a) => a.en)
    expect(names.indexOf('Al Khiran')).toBeGreaterThan(names.indexOf('Jaber Al-Ali'))
    expect(names.indexOf('Al Khiran')).toBeLessThan(names.indexOf('Mahboula'))
  })

  it('sorts by Arabic name in Arabic, ignoring the article', () => {
    const keys = areasIn('hawalli', 'ar').map((a) => a.ar.replace(/^ال/, ''))
    expect(keys).toEqual([...keys].sort((a, b) => a.localeCompare(b, 'ar')))
  })

  it('together cover every area exactly once', () => {
    const all = GOVERNORATES.flatMap((g) => areasIn(g.id))
    expect(all.length).toBe(AREAS.length)
    expect(new Set(all).size).toBe(AREAS.length)
  })

  it('is empty for an unknown governorate, and the list cannot be mutated', () => {
    expect(areasIn('basra')).toEqual([])
    expect(() => areasIn('hawalli').sort()).toThrow()
  })
})
