import { describe, expect, it, vi } from 'vitest'
import {
  AREA_MAX,
  BODY_MAX,
  BODY_MIN,
  NAME_MAX,
  REVIEWS_KEY,
  aggregate,
  aggregateByProduct,
  createLocalReviewStore,
  normalizeDraft,
  parseStored,
  sanitizeReview,
  textLength,
  validateReview,
} from './reviews'

const BODY = 'Lasted from the school run to the diwaniya, in August.'

const draft = (overrides = {}) => ({
  productId: 'oud-noir',
  name: 'Fatima',
  area: 'Salmiya',
  ratings: { overall: 5, longevityHeat: 4, sillage: 4, compliment: 5 },
  body: BODY,
  lang: 'en',
  ...overrides,
})

const stored = (overrides = {}) => ({
  id: 'r1',
  createdAt: '2026-10-01T09:00:00.000Z',
  ...draft(),
  ...overrides,
})

/** A Storage stand-in: a Map behind getItem/setItem, with switches to fail. */
function memoryStorage(initial = {}) {
  const map = new Map(Object.entries(initial))
  return {
    map,
    failWrites: false,
    failReads: false,
    getItem(key) {
      if (this.failReads) throw new Error('blocked')
      return map.has(key) ? map.get(key) : null
    },
    setItem(key, value) {
      if (this.failWrites) throw new Error('QuotaExceededError')
      map.set(key, String(value))
    },
  }
}

const clock = (iso) => () => new Date(iso)
let n = 0
const ids = () => `id-${++n}`

describe('validateReview', () => {
  it('accepts a complete draft', () => {
    expect(validateReview(draft())).toEqual({})
  })

  it('requires every one of the four ratings, as whole numbers from 1 to 5', () => {
    expect(validateReview(draft({ ratings: {} }))).toEqual({
      overall: 'reviews.err.rating',
      longevityHeat: 'reviews.err.rating',
      sillage: 'reviews.err.rating',
      compliment: 'reviews.err.rating',
    })
    const errors = validateReview(draft({ ratings: { overall: 0, longevityHeat: 6, sillage: 3.5, compliment: 3 } }))
    expect(Object.keys(errors)).toEqual(['overall', 'longevityHeat', 'sillage'])
  })

  it('takes ratings that arrive as numeric strings from a form', () => {
    expect(validateReview(draft({ ratings: { overall: '4', longevityHeat: '4', sillage: '2', compliment: '1' } }))).toEqual({})
  })

  it('requires a name and caps its length', () => {
    expect(validateReview(draft({ name: '   ' })).name).toBe('reviews.err.name')
    expect(validateReview(draft({ name: 'x'.repeat(NAME_MAX + 1) })).name).toBe('reviews.err.nameLong')
    expect(validateReview(draft({ name: 'x'.repeat(NAME_MAX) })).name).toBeUndefined()
  })

  it('leaves the area optional but caps it', () => {
    expect(validateReview(draft({ area: '' }))).toEqual({})
    expect(validateReview(draft({ area: undefined }))).toEqual({})
    expect(validateReview(draft({ area: 'a'.repeat(AREA_MAX) }))).toEqual({})
    expect(validateReview(draft({ area: 'a'.repeat(AREA_MAX + 1) })).area).toBe('reviews.err.areaLong')
  })

  it('holds the review text between the minimum and maximum, counted by character', () => {
    expect(validateReview(draft({ body: '' })).body).toBe('reviews.err.body')
    expect(validateReview(draft({ body: '   \n ' })).body).toBe('reviews.err.body')
    expect(validateReview(draft({ body: 'x'.repeat(BODY_MIN - 1) })).body).toBe('reviews.err.bodyShort')
    expect(validateReview(draft({ body: 'x'.repeat(BODY_MIN) })).body).toBeUndefined()
    expect(validateReview(draft({ body: 'x'.repeat(BODY_MAX) })).body).toBeUndefined()
    expect(validateReview(draft({ body: 'x'.repeat(BODY_MAX + 1) })).body).toBe('reviews.err.bodyLong')
    // Twenty Arabic letters are twenty characters; twenty emoji are twenty, not forty.
    expect(validateReview(draft({ body: 'ع'.repeat(BODY_MIN) })).body).toBeUndefined()
    expect(validateReview(draft({ body: '🌹'.repeat(BODY_MIN) })).body).toBeUndefined()
    expect(textLength('🌹🌹')).toBe(2)
  })

  it('needs a product id', () => {
    expect(validateReview(draft({ productId: '' })).productId).toBe('reviews.err.product')
    expect(validateReview(draft({ productId: '../x' })).productId).toBe('reviews.err.product')
  })
})

describe('normalizeDraft', () => {
  it('trims and collapses one-line fields, keeps paragraph breaks in the body', () => {
    const clean = normalizeDraft(draft({ name: '  Abu   Khalid ', area: ' Al  Khiran ', body: ' First line \r\n\r\n\r\n\r\nSecond line  ' }))
    expect(clean.name).toBe('Abu Khalid')
    expect(clean.area).toBe('Al Khiran')
    expect(clean.body).toBe('First line\n\nSecond line')
  })

  it('falls back to English for an unknown language', () => {
    expect(normalizeDraft(draft({ lang: 'fr' })).lang).toBe('en')
    expect(normalizeDraft(draft({ lang: 'ar' })).lang).toBe('ar')
  })
})

describe('aggregate', () => {
  it('gives null averages and a zero count with no reviews — never a zero rating', () => {
    expect(aggregate([])).toEqual({ count: 0, overall: null, longevityHeat: null, sillage: null, compliment: null })
    expect(aggregate(undefined).count).toBe(0)
  })

  it('averages each dimension to one decimal', () => {
    const reviews = [
      stored({ ratings: { overall: 5, longevityHeat: 4, sillage: 3, compliment: 5 } }),
      stored({ ratings: { overall: 4, longevityHeat: 4, sillage: 2, compliment: 4 } }),
      stored({ ratings: { overall: 5, longevityHeat: 3, sillage: 2, compliment: 4 } }),
    ]
    expect(aggregate(reviews)).toEqual({ count: 3, overall: 4.7, longevityHeat: 3.7, sillage: 2.3, compliment: 4.3 })
  })

  it('groups by product', () => {
    const byProduct = aggregateByProduct([
      stored({ id: 'a', productId: 'oud-noir' }),
      stored({ id: 'b', productId: 'oud-noir', ratings: { overall: 3, longevityHeat: 3, sillage: 3, compliment: 3 } }),
      stored({ id: 'c', productId: 'qahwa' }),
    ])
    expect(Object.keys(byProduct).sort()).toEqual(['oud-noir', 'qahwa'])
    expect(byProduct['oud-noir'].count).toBe(2)
    expect(byProduct['oud-noir'].overall).toBe(4)
    expect(byProduct.qahwa.count).toBe(1)
  })
})

describe('sanitizeReview / parseStored', () => {
  it('keeps a well-formed review and only its own fields', () => {
    const review = sanitizeReview({ ...stored(), extra: '<script>', ratings: { ...stored().ratings, bonus: 9 } })
    expect(review).toEqual({
      id: 'r1',
      productId: 'oud-noir',
      name: 'Fatima',
      area: 'Salmiya',
      ratings: { overall: 5, longevityHeat: 4, sillage: 4, compliment: 5 },
      body: BODY,
      lang: 'en',
      createdAt: '2026-10-01T09:00:00.000Z',
    })
  })

  it('drops entries that are malformed in any way', () => {
    expect(sanitizeReview(null)).toBeNull()
    expect(sanitizeReview('review')).toBeNull()
    expect(sanitizeReview(stored({ id: '' }))).toBeNull()
    expect(sanitizeReview(stored({ id: 7 }))).toBeNull()
    expect(sanitizeReview(stored({ createdAt: 'yesterday' }))).toBeNull()
    expect(sanitizeReview(stored({ ratings: null }))).toBeNull()
    expect(sanitizeReview(stored({ ratings: { overall: '5', longevityHeat: 4, sillage: 4, compliment: 5 } }))).toBeNull()
    expect(sanitizeReview(stored({ name: 42 }))).toBeNull()
    expect(sanitizeReview(stored({ body: 'too short' }))).toBeNull()
    expect(sanitizeReview(stored({ area: { en: 'x' } }))).toBeNull()
  })

  it('ignores corrupt storage rather than throwing', () => {
    expect(parseStored(null)).toEqual([])
    expect(parseStored('')).toEqual([])
    expect(parseStored('{not json')).toEqual([])
    expect(parseStored('{"a":1}')).toEqual([])
    expect(parseStored('"text"')).toEqual([])
  })

  it('keeps the valid entries of a partly corrupt list, each id once, newest first', () => {
    const list = parseStored(
      JSON.stringify([
        stored({ id: 'old', createdAt: '2026-01-01T00:00:00.000Z' }),
        { junk: true },
        stored({ id: 'new', createdAt: '2026-09-01T00:00:00.000Z' }),
        stored({ id: 'old', createdAt: '2026-05-01T00:00:00.000Z', name: 'Duplicate' }),
      ]),
    )
    expect(list.map((r) => r.id)).toEqual(['new', 'old'])
    expect(list[1].name).toBe('Fatima')
  })
})

describe('createLocalReviewStore', () => {
  it('starts empty: nothing is pre-seeded', () => {
    const store = createLocalReviewStore(memoryStorage())
    expect(store.all()).toEqual([])
    expect(store.aggregates()).toEqual({})
  })

  it('saves a valid review to storage under nafsah.reviews.v1 and returns it', () => {
    const storage = memoryStorage()
    const store = createLocalReviewStore(storage, { now: clock('2026-10-13T08:30:00.000Z'), makeId: () => 'abc' })
    const result = store.add(draft({ name: '  Noura ', lang: 'ar' }))
    expect(result.ok).toBe(true)
    expect(result.review).toMatchObject({ id: 'abc', name: 'Noura', lang: 'ar', createdAt: '2026-10-13T08:30:00.000Z' })
    expect(JSON.parse(storage.map.get(REVIEWS_KEY))).toEqual([result.review])
    expect(store.forProduct('oud-noir')).toEqual([result.review])
    expect(store.forProduct('qahwa')).toEqual([])
  })

  it('refuses an invalid draft and writes nothing', () => {
    const storage = memoryStorage()
    const store = createLocalReviewStore(storage)
    const result = store.add(draft({ name: '', ratings: { overall: 5 } }))
    expect(result.ok).toBe(false)
    expect(result.errors).toMatchObject({ name: 'reviews.err.name', sillage: 'reviews.err.rating' })
    expect(storage.map.has(REVIEWS_KEY)).toBe(false)
  })

  it('lists newest first and keeps snapshots stable until something changes', () => {
    let t = 0
    const store = createLocalReviewStore(memoryStorage(), {
      now: () => new Date(Date.UTC(2026, 9, 1, 10, t++)),
      makeId: ids,
    })
    const first = store.add(draft()).review
    const second = store.add(draft({ productId: 'qahwa' })).review
    const snapshot = store.all()
    expect(snapshot.map((r) => r.id)).toEqual([second.id, first.id])
    expect(store.all()).toBe(snapshot)
    const aggregates = store.aggregates()
    expect(store.aggregates()).toBe(aggregates)
    expect(Object.keys(aggregates).sort()).toEqual(['oud-noir', 'qahwa'])
    store.add(draft())
    expect(store.all()).not.toBe(snapshot)
    expect(store.aggregates()).not.toBe(aggregates)
    expect(store.aggregates()['oud-noir'].count).toBe(2)
  })

  it('notifies subscribers after a save, and stops when unsubscribed', () => {
    const store = createLocalReviewStore(memoryStorage(), { makeId: ids })
    const listener = vi.fn()
    const unsubscribe = store.subscribe(listener)
    store.add(draft())
    expect(listener).toHaveBeenCalledTimes(1)
    store.add(draft({ name: '' }))
    expect(listener).toHaveBeenCalledTimes(1)
    unsubscribe()
    store.add(draft())
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('picks up what another tab wrote on refresh, and keeps it when adding', () => {
    const storage = memoryStorage()
    let i = 0
    const here = createLocalReviewStore(storage, { makeId: () => `here-${++i}` })
    const there = createLocalReviewStore(storage, { makeId: () => `there-${++i}` })
    expect(here.all()).toEqual([])
    there.add(draft())
    expect(here.all()).toEqual([]) // cached until told
    const listener = vi.fn()
    here.subscribe(listener)
    here.refresh()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(here.all().map((r) => r.id)).toEqual(['there-1'])

    // A write from this tab re-reads first, so the other tab's later review survives.
    there.add(draft({ productId: 'qahwa' }))
    here.add(draft())
    expect(JSON.parse(storage.map.get(REVIEWS_KEY)).map((r) => r.id).sort()).toEqual(['here-3', 'there-1', 'there-2'])
  })

  it('reports a storage error instead of claiming a save when the browser refuses', () => {
    const storage = memoryStorage()
    storage.failWrites = true
    const store = createLocalReviewStore(storage)
    const listener = vi.fn()
    store.subscribe(listener)
    expect(store.add(draft())).toEqual({ ok: false, errors: { form: 'reviews.err.storage' } })
    expect(store.all()).toEqual([])
    expect(listener).not.toHaveBeenCalled()
  })

  it('survives storage that throws on read, or no storage at all', () => {
    const storage = memoryStorage()
    storage.failReads = true
    expect(createLocalReviewStore(storage).all()).toEqual([])
    const none = createLocalReviewStore(null)
    expect(none.all()).toEqual([])
    expect(none.add(draft()).errors).toEqual({ form: 'reviews.err.storage' })
  })

  it('ignores corrupt data already in storage and replaces it cleanly on the next save', () => {
    const storage = memoryStorage({ [REVIEWS_KEY]: '[{"broken": tru' })
    const store = createLocalReviewStore(storage, { makeId: () => 'fresh' })
    expect(store.all()).toEqual([])
    store.add(draft())
    expect(JSON.parse(storage.map.get(REVIEWS_KEY)).map((r) => r.id)).toEqual(['fresh'])
  })

  it('keeps at most 500 reviews, dropping the oldest', () => {
    const many = Array.from({ length: 500 }, (_, i) =>
      stored({ id: `old-${i}`, createdAt: new Date(Date.UTC(2025, 0, 1, 0, i)).toISOString() }),
    )
    const storage = memoryStorage({ [REVIEWS_KEY]: JSON.stringify(many) })
    const store = createLocalReviewStore(storage, { now: clock('2026-10-13T00:00:00.000Z'), makeId: () => 'newest' })
    store.add(draft())
    const saved = JSON.parse(storage.map.get(REVIEWS_KEY))
    expect(saved).toHaveLength(500)
    expect(saved[0].id).toBe('newest')
    expect(saved.some((r) => r.id === 'old-0')).toBe(false)
  })
})
