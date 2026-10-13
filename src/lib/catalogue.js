/**
 * Catalogue search, filtering and sorting. Pure: every function takes the
 * products (and, for the rating sort, the review aggregates) it works on, so
 * the grid, the facet counts, the Scent Finder and the tests all share one
 * set of rules.
 *
 * Filters = {
 *   query,            // free text, EN or AR; every word must be found
 *   families[],       // FAMILIES ids — a fragrance's primary family
 *   notes[],          // NOTES ids — a fragrance must carry ALL of them
 *   concentrations[], // CONCENTRATIONS ids — a bottle or oil in one of them (oils are attar)
 *   sillage[],        // SILLAGE ids
 *   genders[],        // GENDERS ids
 *   priceRange,       // [minFils, maxFils] — a bottle or oil inside it, never the sample
 *   sort,             // SORTS id
 * }
 *
 * Concentration and price are met by the same bottle: an extrait whose only
 * bottle under 35 KWD is its quarter-tola attar is not an extrait under 35.
 */
import { NOTE_LIST, NOTES } from '../data/notes'
import {
  allNotes,
  bottleFormats,
  concentrationFor,
  fromPriceFils,
  PRICE_BOUNDS,
} from '../data/products'
import {
  CONCENTRATION_BY_ID,
  FAMILY_BY_ID,
  FORMAT_BY_ID,
  GENDER_BY_ID,
  SILLAGE_BY_ID,
} from '../data/taxonomy'
import { toLatinDigits } from './format'

/* ---------------------------------------------------------------------------
 * Text
 * ------------------------------------------------------------------------- */

// Combining marks left by NFKD: Latin accents, Arabic short vowels, shadda,
// sukun, the hamza and madda carriers, superscript alef and Quranic marks.
const MARKS = /[̀-ًͯ-ٰٟۖ-ۭ]/g
const TATWEEL = /ـ/g
const APOSTROPHES = /['’‘`´ʼ]/g
const SEPARATORS = /[^\p{L}\p{N}]+/gu

/**
 * Text folded so a shopper need not type it exactly: lower case, no Latin
 * accents ("cèdre fumé" → "cedre fume"), Arabic without tashkeel or tatweel,
 * with أ إ آ ٱ read as ا, ة as ه, ى as ي, ؤ as و and ئ as ي, Arabic-Indic
 * digits as Latin, and punctuation as a single space.
 */
export function normalizeText(text) {
  return toLatinDigits(String(text ?? ''))
    .toLowerCase()
    .normalize('NFKD') // splits é → e + ́ and أ → ا + ٔ, so dropping marks unifies both
    .replace(MARKS, '')
    .replace(TATWEEL, '')
    .replace(/ٱ/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىی]/g, 'ي')
    .replace(/ک/g, 'ك')
    .replace(APOSTROPHES, '')
    .replace(SEPARATORS, ' ')
    .trim()
}

const ARABIC = /[؀-ۿ]/

// The article and the clitics that glue onto an Arabic word: "العود" and
// "ومسك" should be found by "عود" and "مسك". Each needs a stem of 3+ letters
// left, so "ورد" (rose) is never cut down to "رد".
const PREFIXES = [
  ['وال', 3],
  ['بال', 3],
  ['فال', 3],
  ['كال', 3],
  ['ال', 2],
  ['لل', 2],
  ['و', 1],
]

/** The ways a single folded word can be met: itself, and its Arabic stem. */
function wordForms(word) {
  const forms = [word]
  if (!ARABIC.test(word)) return forms
  for (const [prefix, length] of PREFIXES) {
    if (word.startsWith(prefix) && word.length - length >= 3) forms.push(word.slice(length))
  }
  return forms
}

/**
 * The forms a query word is looked up by: "والورد" and "وعود" as "ورد" and
 * "عود". A stem of one letter, or the article on fewer than three ("والع" →
 * "الع"), is dropped so a half-typed word does not match half the catalogue.
 */
const queryForms = (token) =>
  wordForms(token).filter(
    (form) => form === token || (form.length >= 2 && !(form.startsWith('ال') && form.length < 5)),
  )

/** Whether some form of the query word begins one of `words`. */
const tokenFound = (token, words) =>
  queryForms(token).some((form) => words.some((word) => word.startsWith(form)))

// "oud and rose", "عود و ورد": the joining word is not something to find,
// unless it is all the shopper has typed so far.
const CONNECTORS = new Set(['and', '&', 'و'])
const withoutConnectors = (tokens) => {
  const words = tokens.filter((token) => !CONNECTORS.has(token))
  return words.length ? words : tokens
}

/** Folded query words. An Arabic word loses its article, so "العود" looks for "عود". */
export function tokenize(query) {
  const text = normalizeText(query)
  if (!text) return []
  return text.split(' ').map((word) => {
    if (!ARABIC.test(word)) return word
    for (const prefix of ['ال', 'لل']) {
      if (word.startsWith(prefix) && word.length - 2 >= 3) return word.slice(2)
    }
    return word
  })
}

const both = (value) => (value ? [value.en, value.ar] : [])

/**
 * Every folded word a fragrance can be found by, in both languages: its name
 * and tagline, its family, the concentration of every format it comes in (a
 * spray that also offers a quarter-tola oil is findable as an attar), those
 * formats, its gender and projection, and every note with its aliases.
 */
const INDEX = new WeakMap()

export function searchIndex(product) {
  if (INDEX.has(product)) return INDEX.get(product)
  const family = FAMILY_BY_ID[product.family]
  const concentrations = new Set(product.formats.map((entry) => concentrationFor(product, entry.id)))
  const text = [
    ...both(product.name),
    ...both(product.tagline),
    ...both(family),
    ...both(family?.short),
    ...[...concentrations].flatMap((id) => {
      const concentration = CONCENTRATION_BY_ID[id]
      return [...both(concentration), ...both(concentration?.short), concentration?.abbr]
    }),
    ...product.formats.flatMap((entry) => both(FORMAT_BY_ID[entry.id])),
    ...both(GENDER_BY_ID[product.gender]),
    ...both(SILLAGE_BY_ID[product.projectionSillage]),
    ...allNotes(product).flatMap((note) => [...both(note), ...(note.aliases ?? [])]),
  ].join(' ')
  const words = [...new Set(normalizeText(text).split(' ').filter(Boolean).flatMap(wordForms))]
  INDEX.set(product, words)
  return words
}

/**
 * Every word of the query must begin some word of the fragrance, in either
 * language. Matching word starts rather than any substring keeps "rose" from
 * finding tuberose while "cam" still finds Cambodi as you type. An Arabic
 * word may carry و ب ف ك and the article ("والورد" finds "ورد"), and "and"
 * or "و" between words asks for nothing of its own.
 */
export function matchesQuery(product, query) {
  const tokens = withoutConnectors(tokenize(query))
  if (tokens.length === 0) return true
  const words = searchIndex(product)
  return tokens.every((token) => tokenFound(token, words))
}

/* ---------------------------------------------------------------------------
 * Notes
 * ------------------------------------------------------------------------- */

/**
 * A generic note also finds its named varieties: a shopper who asks for
 * vanilla wants the Madagascan one too. A named variety stays exact — Mysore
 * Sandalwood does not find plain sandalwood.
 */
export const NOTE_VARIETIES = {
  amber: ['amber-resin'],
  bergamot: ['calabrian-bergamot'],
  cedar: ['atlas-cedar'],
  iris: ['iris-pallida', 'orris-root'],
  jasmine: ['jasmine-sambac'],
  mandarin: ['green-mandarin'],
  musk: ['white-musk'],
  sandalwood: ['mysore-sandalwood'],
  vanilla: ['madagascan-vanilla'],
  vetiver: ['haitian-vetiver'],
}

/** The note ids that satisfy a request for `noteId`. */
export const noteMatches = (noteId) => [noteId, ...(NOTE_VARIETIES[noteId] ?? [])]

const noteIdsOf = new WeakMap()
const productNoteIds = (product) => {
  if (!noteIdsOf.has(product)) noteIdsOf.set(product, new Set(allNotes(product).map((note) => note.id)))
  return noteIdsOf.get(product)
}

/** Whether a fragrance carries the note (or one of its varieties). */
export const hasNote = (product, noteId) => {
  const ids = productNoteIds(product)
  return noteMatches(noteId).some((id) => ids.has(id))
}

/**
 * Notes for the notes picker, best match first: a name in the active language
 * that starts with the query, then one with a word that does, then a match on
 * the other language or an alias ("cambodian oud", "جاوي"). Given `counts`
 * (facetCounts for notes), a note that would still find something goes ahead
 * of an equally good match that would find nothing. Empty query, none.
 */
export function noteSuggestions(query, lang = 'en', limit = 8, { exclude = [], counts = null } = {}) {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []
  const whole = tokens.join(' ')
  const other = lang === 'ar' ? 'en' : 'ar'
  const skip = new Set(exclude)

  const wordsMatch = (name) => {
    const words = normalizeText(name).split(' ').flatMap(wordForms)
    return tokens.every((token) => tokenFound(token, words))
  }

  const ranked = []
  for (const note of NOTE_LIST) {
    if (skip.has(note.id)) continue
    const own = note[lang] ?? note.en
    let rank = -1
    if (normalizeText(own).startsWith(whole)) rank = 0
    else if (wordsMatch(own)) rank = 1
    else if ([note[other], ...(note.aliases ?? [])].some((name) => name && wordsMatch(name))) rank = 2
    if (rank >= 0) ranked.push({ note, rank, own })
  }
  const empty = ({ note }) => (counts && !counts[note.id] ? 1 : 0)
  return ranked
    .sort((a, b) => a.rank - b.rank || empty(a) - empty(b) || a.own.localeCompare(b.own, lang))
    .slice(0, limit)
    .map(({ note }) => note)
}

/* ---------------------------------------------------------------------------
 * Filters
 * ------------------------------------------------------------------------- */

/** The multi-select facets, in the order the filter bar shows them. */
export const FACETS = ['families', 'notes', 'concentrations', 'sillage', 'genders']

const FACET_IDS = {
  families: FAMILY_BY_ID,
  notes: NOTES,
  concentrations: CONCENTRATION_BY_ID,
  sillage: SILLAGE_BY_ID,
  genders: GENDER_BY_ID,
}

/** The price slider's domain, in fils: whole dinars around every bottle and oil. */
export const FULL_RANGE = Object.freeze([PRICE_BOUNDS.minFils, PRICE_BOUNDS.maxFils])

export const DEFAULT_FILTERS = Object.freeze({
  query: '',
  families: [],
  notes: [],
  concentrations: [],
  sillage: [],
  genders: [],
  priceRange: FULL_RANGE,
  sort: 'featured',
})

/** Sort orders. `rating` is offered only once a fragrance has a review. */
export const SORTS = [
  { id: 'featured', labelKey: 'sortFeatured' },
  { id: 'price-asc', labelKey: 'sortPriceAsc' },
  { id: 'price-desc', labelKey: 'sortPriceDesc' },
  { id: 'newest', labelKey: 'sortNewest' },
  { id: 'rating', labelKey: 'sortRating' },
]

const SORT_IDS = new Set(SORTS.map((sort) => sort.id))

const hasReviews = (aggregates) =>
  Object.values(aggregates ?? {}).some((summary) => summary?.count > 0)

/** The sorts worth offering: no "Top rated" while nothing has been rated. */
export const availableSorts = (aggregates) =>
  hasReviews(aggregates) ? SORTS : SORTS.filter((sort) => sort.id !== 'rating')

const own = (table, id) => typeof id === 'string' && Object.hasOwn(table, id)

const clampFils = (value, fallback) => {
  // null and '' are not zero.
  const number = typeof value === 'number' || (typeof value === 'string' && value.trim()) ? Number(value) : NaN
  if (!Number.isFinite(number)) return fallback
  return Math.min(FULL_RANGE[1], Math.max(FULL_RANGE[0], Math.round(number)))
}

/**
 * Filters from anything — a partial patch, the Scent Finder, a stale link —
 * made safe: unknown ids dropped, each id once, the price range clamped to
 * the slider and put in order, an unknown sort read as featured. Missing
 * fields take their defaults.
 */
export function sanitizeFilters(input = {}) {
  const source = input && typeof input === 'object' ? input : {}
  const filters = { ...DEFAULT_FILTERS }
  if (typeof source.query === 'string') filters.query = source.query
  for (const facet of FACETS) {
    const list = Array.isArray(source[facet]) ? source[facet] : []
    filters[facet] = [...new Set(list.filter((id) => own(FACET_IDS[facet], id)))]
  }
  if (Array.isArray(source.priceRange) && source.priceRange.length === 2) {
    const low = clampFils(source.priceRange[0], FULL_RANGE[0])
    const high = clampFils(source.priceRange[1], FULL_RANGE[1])
    filters.priceRange = [Math.min(low, high), Math.max(low, high)]
  }
  if (SORT_IDS.has(source.sort)) filters.sort = source.sort
  return filters
}

export const isFullRange = (range) =>
  !range || (range[0] <= FULL_RANGE[0] && range[1] >= FULL_RANGE[1])

/** How many filters narrow the catalogue — each id, the query and the price count once. */
export function activeFilterCount(filters) {
  let count = filters.query?.trim() ? 1 : 0
  for (const facet of FACETS) count += filters[facet]?.length ?? 0
  if (!isFullRange(filters.priceRange)) count += 1
  return count
}

/**
 * The bottles and oils (never the sample) that meet the price range and the
 * concentration filter together — one format must satisfy both. With
 * `except: 'concentrations'`, the price alone.
 */
export const matchingFormats = (product, filters = {}, { except = null } = {}) => {
  const range = filters.priceRange
  const ids = except === 'concentrations' ? [] : filters.concentrations ?? []
  return bottleFormats(product).filter(
    (entry) =>
      (isFullRange(range) || (entry.priceFils >= range[0] && entry.priceFils <= range[1])) &&
      (!ids.length || ids.includes(concentrationFor(product, entry.id))),
  )
}

/**
 * The price a fragrance's card leads with: the cheapest bottle or oil that
 * meets the price and concentration filters, else its plain "from" price.
 */
export const displayPriceFils = (product, filters = {}) => {
  const active = !isFullRange(filters.priceRange) || (filters.concentrations?.length ?? 0) > 0
  if (!active) return fromPriceFils(product)
  const matching = matchingFormats(product, filters)
  return matching.length ? Math.min(...matching.map((entry) => entry.priceFils)) : fromPriceFils(product)
}

// Concentration is not here: it is met format by format, with the price.
const PREDICATES = {
  families: (product, ids) => ids.includes(product.family),
  notes: (product, ids) => ids.every((id) => hasNote(product, id)),
  sillage: (product, ids) => ids.includes(product.projectionSillage),
  genders: (product, ids) => ids.includes(product.gender),
}

/** Whether a fragrance passes every filter, leaving out the facet named in `except`. */
export function matchesFilters(product, filters, { except = null } = {}) {
  for (const facet of FACETS) {
    if (facet === except || facet === 'concentrations') continue
    const ids = filters[facet]
    if (ids?.length && !PREDICATES[facet](product, ids)) return false
  }
  if (!matchingFormats(product, filters, { except }).length) return false
  return matchesQuery(product, filters.query)
}

const flag = (value) => Number(Boolean(value))

const SORTERS = {
  featured: (a, b) => flag(b.bestseller) - flag(a.bestseller) || flag(b.isNew) - flag(a.isNew),
  newest: (a, b) => b.year - a.year,
}

const PRICE_DIRECTION = { 'price-asc': 1, 'price-desc': -1 }

/**
 * The fragrances in order. Array#sort is stable, so ties keep catalogue
 * order. By price: the price each card shows under `filters` (displayPriceFils
 * — the cheapest bottle inside the price and concentration filters), so the
 * grid reads in order. By rating: highest average first, then most reviews;
 * fragrances nobody has reviewed yet follow, in featured order.
 */
export function sortProducts(products, sort = 'featured', { aggregates = {}, filters = null } = {}) {
  const list = [...products]
  if (Object.hasOwn(PRICE_DIRECTION, sort)) {
    const direction = PRICE_DIRECTION[sort]
    const price = new Map(list.map((product) => [product, displayPriceFils(product, filters ?? {})]))
    return list.sort((a, b) => direction * (price.get(a) - price.get(b)))
  }
  if (sort === 'rating' && hasReviews(aggregates)) {
    const score = (product) => aggregates?.[product.id]
    return list.sort((a, b) => {
      const x = score(a)
      const y = score(b)
      if (x?.count && y?.count) return y.overall - x.overall || y.count - x.count
      if (x?.count || y?.count) return y?.count ? 1 : -1
      return SORTERS.featured(a, b)
    })
  }
  return list.sort(SORTERS[sort] ?? SORTERS.featured)
}

/** The fragrances that pass every filter, in the chosen order. */
export function filterProducts(products, filters, { aggregates = {} } = {}) {
  const clean = sanitizeFilters(filters)
  const matched = products.filter((product) => matchesFilters(product, clean))
  return sortProducts(matched, clean.sort, { aggregates, filters: clean })
}

/**
 * Counts for one facet's options, with every other filter applied — what the
 * shopper would see on choosing it. Families, concentrations, projection and
 * gender are either-or within the facet, so its own selection is left out.
 * Notes must all be present, so a note's count is the current results that
 * also carry it. A concentration counts a fragrance only when a bottle in
 * that concentration is inside the price range. Every option of the facet is
 * listed, zeros included.
 */
export function facetCounts(products, filters, facet) {
  const clean = sanitizeFilters(filters)
  const counts = Object.fromEntries(Object.keys(FACET_IDS[facet] ?? {}).map((id) => [id, 0]))

  if (facet === 'notes') {
    for (const product of products) {
      if (!matchesFilters(product, clean)) continue
      const ids = productNoteIds(product)
      for (const id of Object.keys(counts)) {
        if (noteMatches(id).some((note) => ids.has(note))) counts[id] += 1
      }
    }
    return counts
  }

  const has =
    facet === 'concentrations'
      ? (product, id) => matchingFormats(product, { ...clean, concentrations: [id] }).length > 0
      : PREDICATES[facet] && ((product, id) => PREDICATES[facet](product, [id]))
  if (!has) return counts
  for (const product of products) {
    if (!matchesFilters(product, clean, { except: facet })) continue
    for (const id of Object.keys(counts)) {
      if (has(product, id)) counts[id] += 1
    }
  }
  return counts
}
