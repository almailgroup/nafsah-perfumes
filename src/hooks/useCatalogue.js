import { useCallback, useMemo, useReducer, useSyncExternalStore } from 'react'
import { NOTES } from '../data/notes'
import { PRODUCTS } from '../data/products'
import { CONCENTRATION_BY_ID, FAMILY_BY_ID, GENDER_BY_ID, SILLAGE_BY_ID } from '../data/taxonomy'
import { useLocale } from '../i18n/locale-context'
import {
  DEFAULT_FILTERS,
  FACETS,
  FULL_RANGE,
  activeFilterCount,
  availableSorts,
  facetCounts,
  filterProducts,
  isFullRange,
  sanitizeFilters,
} from '../lib/catalogue'
import { formatPrice } from '../lib/format'
import { getAggregates, subscribeReviews } from '../lib/reviews'

/** The price slider's full span, in fils. Kept under its old name for callers. */
export const DEFAULT_RANGE = FULL_RANGE

// What a chip calls each value: the short family name, the full name elsewhere.
const LABEL_OF = {
  families: (id) => FAMILY_BY_ID[id]?.short,
  notes: (id) => NOTES[id],
  concentrations: (id) => CONCENTRATION_BY_ID[id],
  sillage: (id) => SILLAGE_BY_ID[id],
  genders: (id) => GENDER_BY_ID[id],
}

const NO_REVIEWS = Object.freeze({})

function reducer(state, action) {
  switch (action.type) {
    case 'query':
      return state.query === action.value ? state : { ...state, query: String(action.value ?? '') }
    case 'set':
      return sanitizeFilters({ ...state, [action.key]: action.value })
    case 'toggle': {
      const list = state[action.facet] ?? []
      const value = list.includes(action.id) ? list.filter((id) => id !== action.id) : [...list, action.id]
      return sanitizeFilters({ ...state, [action.facet]: value })
    }
    case 'apply':
      return sanitizeFilters(action.merge ? { ...state, ...action.patch } : action.patch)
    case 'family':
      // A family from the header or the tiles starts the catalogue afresh on
      // that family, so an old search cannot leave the shopper on an empty grid.
      return sanitizeFilters({ sort: state.sort, families: action.id ? [action.id] : [] })
    case 'reset':
      return DEFAULT_FILTERS
    default:
      return state
  }
}

/**
 * Catalogue filter state, lifted above the grid so the header, the family
 * tiles, the filter bar and the Scent Finder all drive the same catalogue.
 * The rules live in src/lib/catalogue; this keeps the state and labels it.
 */
export function useCatalogue() {
  const { lang, t, tr } = useLocale()
  const [filters, dispatch] = useReducer(reducer, DEFAULT_FILTERS)
  // Live: a review written here or in another tab can bring "Top rated" in.
  const aggregates = useSyncExternalStore(subscribeReviews, getAggregates, () => NO_REVIEWS)

  const sorts = useMemo(() => availableSorts(aggregates), [aggregates])
  // A rating sort with nothing rated (storage cleared) reads as featured.
  const sort = sorts.some((option) => option.id === filters.sort) ? filters.sort : 'featured'

  const setQuery = useCallback((value) => dispatch({ type: 'query', value }), [])
  const setPriceRange = useCallback((value) => dispatch({ type: 'set', key: 'priceRange', value }), [])
  const setSort = useCallback((value) => dispatch({ type: 'set', key: 'sort', value }), [])
  const setFacet = useCallback((facet, value) => dispatch({ type: 'set', key: facet, value }), [])
  const toggle = useCallback((facet, id) => dispatch({ type: 'toggle', facet, id }), [])
  const clearFacet = useCallback((facet) => dispatch({ type: 'set', key: facet, value: [] }), [])
  const toggleFamily = useCallback((id) => dispatch({ type: 'toggle', facet: 'families', id }), [])
  const toggleNote = useCallback((id) => dispatch({ type: 'toggle', facet: 'notes', id }), [])
  /** One family and nothing else, or (null) the whole catalogue — the header and tiles use this. */
  const selectFamily = useCallback((id) => dispatch({ type: 'family', id }), [])
  /**
   * Several filters at once, e.g. the Scent Finder's "see all matches":
   * starts from a clean catalogue unless { merge: true }. Unknown ids are
   * dropped and the price range clamped (lib/catalogue sanitizeFilters).
   */
  const applyFilters = useCallback(
    (patch, { merge = false } = {}) => dispatch({ type: 'apply', patch, merge }),
    [],
  )
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])

  const results = useMemo(
    () => filterProducts(PRODUCTS, { ...filters, sort }, { aggregates }),
    [filters, sort, aggregates],
  )

  const counts = useMemo(
    () => Object.fromEntries(FACETS.map((facet) => [facet, facetCounts(PRODUCTS, filters, facet)])),
    [filters],
  )

  const activeChips = useMemo(() => {
    const chips = []
    const query = filters.query.trim()
    if (query) chips.push({ facet: 'query', value: query, label: t('catalogue.chip.query', { query }) })
    for (const facet of FACETS) {
      for (const id of filters[facet]) chips.push({ facet, value: id, label: tr(LABEL_OF[facet](id)) })
    }
    if (!isFullRange(filters.priceRange)) {
      const [min, max] = filters.priceRange
      chips.push({
        facet: 'priceRange',
        value: `${min}-${max}`,
        label: t('catalogue.chip.price', { min: formatPrice(min, lang), max: formatPrice(max, lang) }),
      })
    }
    return chips
  }, [filters, lang, t, tr])

  const removeChip = useCallback((chip) => {
    if (chip.facet === 'query') dispatch({ type: 'query', value: '' })
    else if (chip.facet === 'priceRange') dispatch({ type: 'set', key: 'priceRange', value: FULL_RANGE })
    else dispatch({ type: 'toggle', facet: chip.facet, id: chip.value })
  }, [])

  const activeCount = activeFilterCount(filters)

  return useMemo(
    () => ({
      filters,
      query: filters.query,
      setQuery,
      families: filters.families,
      toggleFamily,
      selectFamily,
      notes: filters.notes,
      toggleNote,
      concentrations: filters.concentrations,
      sillage: filters.sillage,
      genders: filters.genders,
      toggle,
      setFacet,
      clearFacet,
      priceRange: filters.priceRange,
      setPriceRange,
      sort,
      setSort,
      sorts,
      applyFilters,
      reset,
      isFiltered: activeCount > 0,
      activeCount,
      activeChips,
      removeChip,
      counts,
      results,
      total: PRODUCTS.length,
    }),
    [
      filters, setQuery, toggleFamily, selectFamily, toggleNote, toggle, setFacet, clearFacet,
      setPriceRange, sort, setSort, sorts, applyFilters, reset, activeCount, activeChips, removeChip,
      counts, results,
    ],
  )
}
