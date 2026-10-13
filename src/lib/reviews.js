/**
 * Customer reviews: their shape, the rules a submission must meet, the
 * averages the storefront shows, and the store that keeps them.
 *
 * The house has no review service yet, so a review is kept in the browser it
 * was written in (localStorage 'nafsah.reviews.v1') until one is connected.
 * Nothing is pre-seeded and nothing here invents a figure: every average and
 * count on the site is worked out from reviews that exist.
 *
 * Review = {
 *   id, productId,
 *   name,                 // shown with the review
 *   area,                 // optional free text, e.g. 'Salmiya'
 *   ratings: { overall, longevityHeat, sillage, compliment },   // whole 1–5
 *   body,                 // BODY_MIN–BODY_MAX characters
 *   lang,                 // 'en' | 'ar', the language it was written in
 *   createdAt,            // ISO timestamp
 * }
 *
 * Pure apart from the default store, which binds to window.localStorage on
 * first use and listens for writes from other tabs.
 */

export const REVIEWS_KEY = 'nafsah.reviews.v1'

/** The four things a reviewer rates, in the order the form asks them. */
export const RATING_KEYS = ['overall', 'longevityHeat', 'sillage', 'compliment']

export const RATING_MIN = 1
export const RATING_MAX = 5
export const NAME_MAX = 60
export const AREA_MAX = 40
export const BODY_MIN = 20
export const BODY_MAX = 1000

// Enough for any one browser; the oldest drop off first.
const MAX_STORED = 500
const LANGS = ['en', 'ar']
const PRODUCT_ID = /^[a-z0-9][a-z0-9-]*$/

/**
 * Length as a reader counts it: one per character, so an emoji or an Arabic
 * letter with its mark is not charged twice as UTF-16 would.
 */
export const textLength = (text) => [...String(text ?? '')].length

const oneLine = (value) => String(value ?? '').replace(/\s+/g, ' ').trim()
// Paragraph breaks are kept; runs of blank lines and trailing space are not.
const paragraphs = (value) =>
  String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

const isRating = (value) => Number.isInteger(value) && value >= RATING_MIN && value <= RATING_MAX

/** A draft as the form holds it, tidied: trimmed text, ratings as numbers. */
export function normalizeDraft(draft = {}) {
  const ratings = {}
  for (const key of RATING_KEYS) {
    const value = Number(draft?.ratings?.[key])
    ratings[key] = Number.isFinite(value) ? value : 0
  }
  return {
    productId: oneLine(draft?.productId),
    name: oneLine(draft?.name),
    area: oneLine(draft?.area),
    ratings,
    body: paragraphs(draft?.body),
    lang: LANGS.includes(draft?.lang) ? draft.lang : 'en',
  }
}

/**
 * What is wrong with a draft, as { field: messageKey } — empty when it can be
 * saved. Fields: productId, name, area, body and each of RATING_KEYS. The
 * keys live in the reviews dictionary; {min}/{max} come from the constants.
 */
export function validateReview(draft) {
  const review = normalizeDraft(draft)
  const errors = {}

  if (!PRODUCT_ID.test(review.productId)) errors.productId = 'reviews.err.product'

  for (const key of RATING_KEYS) {
    if (!isRating(review.ratings[key])) errors[key] = 'reviews.err.rating'
  }

  const bodyLength = textLength(review.body)
  if (bodyLength === 0) errors.body = 'reviews.err.body'
  else if (bodyLength < BODY_MIN) errors.body = 'reviews.err.bodyShort'
  else if (bodyLength > BODY_MAX) errors.body = 'reviews.err.bodyLong'

  if (!review.name) errors.name = 'reviews.err.name'
  else if (textLength(review.name) > NAME_MAX) errors.name = 'reviews.err.nameLong'

  if (textLength(review.area) > AREA_MAX) errors.area = 'reviews.err.areaLong'

  return errors
}

/**
 * A stored entry checked field by field, or null. Whatever another tab, an
 * older build or a curious visitor left in storage, only well-formed reviews
 * reach the page, and only the fields a review has.
 */
export function sanitizeReview(raw) {
  if (!raw || typeof raw !== 'object') return null
  const { id, createdAt } = raw
  if (typeof id !== 'string' || id === '' || id.length > 100) return null
  if (typeof createdAt !== 'string' || Number.isNaN(Date.parse(createdAt))) return null
  if (!raw.ratings || typeof raw.ratings !== 'object') return null
  for (const field of ['productId', 'name', 'body']) {
    if (typeof raw[field] !== 'string') return null
  }
  if (raw.area != null && typeof raw.area !== 'string') return null

  const draft = normalizeDraft(raw)
  if (Object.keys(validateReview(draft)).length > 0) return null
  // Ratings must already be whole numbers, not strings that happen to parse.
  if (!RATING_KEYS.every((key) => isRating(raw.ratings[key]))) return null

  return {
    id,
    productId: draft.productId,
    name: draft.name,
    area: draft.area,
    ratings: draft.ratings,
    body: draft.body,
    lang: draft.lang,
    createdAt: new Date(createdAt).toISOString(),
  }
}

const newestFirst = (a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0)

/** The stored list, cleaned: valid entries only, each id once, newest first. */
export function parseStored(raw) {
  let parsed
  try {
    parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
  } catch {
    return []
  }
  if (!Array.isArray(parsed)) return []
  const seen = new Set()
  const reviews = []
  for (const entry of parsed) {
    const review = sanitizeReview(entry)
    if (!review || seen.has(review.id)) continue
    seen.add(review.id)
    reviews.push(review)
  }
  return reviews.sort(newestFirst)
}

const round1 = (value) => Math.round(value * 10) / 10

/**
 * Averages to one decimal: { count, overall, longevityHeat, sillage,
 * compliment }. With no reviews every average is null — never a zero that
 * would read as a rating.
 */
export function aggregate(reviews) {
  const list = Array.isArray(reviews) ? reviews : []
  const summary = { count: list.length }
  for (const key of RATING_KEYS) {
    summary[key] = list.length
      ? round1(list.reduce((sum, review) => sum + review.ratings[key], 0) / list.length)
      : null
  }
  return summary
}

/** { [productId]: aggregate } for every product with at least one review. */
export function aggregateByProduct(reviews) {
  const groups = {}
  for (const review of reviews ?? []) {
    ;(groups[review.productId] ??= []).push(review)
  }
  return Object.fromEntries(Object.entries(groups).map(([id, list]) => [id, aggregate(list)]))
}

const randomId = () => {
  const crypto = globalThis.crypto
  if (crypto?.randomUUID) return crypto.randomUUID()
  return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * A review store over a Storage-like object (getItem/setItem). Reads are
 * cached, so all() and aggregates() return the same object until something
 * changes — safe as useSyncExternalStore snapshots.
 *
 *   all()             every review, newest first
 *   forProduct(id)    one product's reviews, newest first
 *   aggregates()      { [productId]: aggregate }
 *   add(draft)        → { ok: true, review } | { ok: false, errors }
 *   subscribe(fn)     → unsubscribe; fn runs after every change
 *   refresh()         re-read storage (another tab wrote to it)
 *
 * Storage that is missing, full or blocked never throws: reading gives an
 * empty list and add() reports { form: 'reviews.err.storage' }.
 */
export function createLocalReviewStore(
  storage,
  { key = REVIEWS_KEY, now = () => new Date(), makeId = randomId } = {},
) {
  let cache = null
  let aggregatesCache = null
  const listeners = new Set()

  const read = () => {
    if (cache) return cache
    let raw = null
    try {
      raw = storage?.getItem(key) ?? null
    } catch {
      raw = null
    }
    cache = Object.freeze(parseStored(raw))
    aggregatesCache = null
    return cache
  }

  const emit = () => listeners.forEach((listener) => listener())

  const store = {
    all: () => read(),

    forProduct: (productId) => read().filter((review) => review.productId === productId),

    aggregates() {
      const reviews = read()
      if (!aggregatesCache) aggregatesCache = Object.freeze(aggregateByProduct(reviews))
      return aggregatesCache
    },

    add(draft) {
      const errors = validateReview(draft)
      if (Object.keys(errors).length > 0) return { ok: false, errors }

      const clean = normalizeDraft(draft)
      const review = {
        id: makeId(),
        productId: clean.productId,
        name: clean.name,
        area: clean.area,
        ratings: clean.ratings,
        body: clean.body,
        lang: clean.lang,
        createdAt: now().toISOString(),
      }
      // Re-read first: another tab may have written since this one last looked.
      cache = null
      const next = [review, ...read()].slice(0, MAX_STORED)
      try {
        if (!storage) throw new Error('no storage')
        storage.setItem(key, JSON.stringify(next))
      } catch {
        return { ok: false, errors: { form: 'reviews.err.storage' } }
      }
      cache = Object.freeze(next)
      aggregatesCache = null
      emit()
      return { ok: true, review }
    },

    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    refresh() {
      cache = null
      aggregatesCache = null
      emit()
    },
  }
  return store
}

// localStorage can throw on access alone (blocked cookies, some private modes).
const browserStorage = () => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

let defaultStore = null

/** The storefront's own store, over localStorage, kept in step across tabs. */
export function reviewStore() {
  if (defaultStore) return defaultStore
  defaultStore = createLocalReviewStore(browserStorage())
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      // key null: the whole of localStorage was cleared.
      if (event.key === REVIEWS_KEY || event.key === null) defaultStore.refresh()
    })
  }
  return defaultStore
}

/** { [productId]: { count, overall, … } } — for sorting the catalogue by rating. */
export const getAggregates = () => reviewStore().aggregates()

/** Run `listener` whenever any review is added, here or in another tab. Returns unsubscribe. */
export const subscribeReviews = (listener) => reviewStore().subscribe(listener)
