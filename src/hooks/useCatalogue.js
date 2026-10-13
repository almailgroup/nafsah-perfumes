import { useCallback, useMemo, useState } from 'react'
import { allNotes, bottleFormats, fromPriceFils, PRICE_BOUNDS, PRODUCTS } from '../data/products'
import { CONCENTRATION_BY_ID, FAMILY_BY_ID } from '../data/taxonomy'

/** Prices are fils; samples are never filtered on, so the range covers bottles and oils. */
export const DEFAULT_RANGE = [PRICE_BOUNDS.minFils, PRICE_BOUNDS.maxFils]

/**
 * Search text in both scripts, folded so a shopper need not type it exactly:
 * case, Arabic short vowels and tatweel are ignored, and the alef, yaa and
 * taa marbuta variants are read as one.
 */
const fold = (text) =>
  String(text ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')

const both = (value) => [value?.en, value?.ar]

/** Everything a fragrance can be matched against by the search box, in English and Arabic. */
const searchIndex = (product) =>
  fold(
    [
      ...both(product.name),
      ...both(product.tagline),
      ...both(product.description),
      ...both(FAMILY_BY_ID[product.family]),
      ...both(CONCENTRATION_BY_ID[product.concentration]),
      ...allNotes(product).flatMap((note) => [...both(note), ...(note.aliases ?? [])]),
    ].join(' '),
  )

const INDEX = Object.fromEntries(PRODUCTS.map((product) => [product.id, searchIndex(product)]))

// Array.prototype.sort is stable, so ties keep catalogue order.
const SORTERS = {
  'price-asc': (a, b) => fromPriceFils(a) - fromPriceFils(b),
  'price-desc': (a, b) => fromPriceFils(b) - fromPriceFils(a),
  newest: (a, b) => b.year - a.year,
  featured: (a, b) =>
    Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)) ||
    Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)),
}

/**
 * Catalogue filter state, lifted out of the grid so the header search box and
 * the category tiles can drive the same query the filter bar does.
 */
export function useCatalogue() {
  const [query, setQuery] = useState('')
  const [families, setFamilies] = useState([])
  const [priceRange, setPriceRange] = useState(DEFAULT_RANGE)
  const [sort, setSort] = useState('featured')

  const toggleFamily = useCallback(
    (family) =>
      setFamilies((current) =>
        current.includes(family) ? current.filter((item) => item !== family) : [...current, family],
      ),
    [],
  )

  /** Used by the category tiles: focus exactly one family. */
  const selectFamily = useCallback((family) => setFamilies(family ? [family] : []), [])

  const reset = useCallback(() => {
    setQuery('')
    setFamilies([])
    setPriceRange(DEFAULT_RANGE)
    setSort('featured')
  }, [])

  const isFiltered =
    query.trim() !== '' ||
    families.length > 0 ||
    priceRange[0] !== DEFAULT_RANGE[0] ||
    priceRange[1] !== DEFAULT_RANGE[1] ||
    sort !== 'featured'

  const results = useMemo(() => {
    const needle = fold(query.trim())

    const matched = PRODUCTS.filter((product) => {
      if (families.length > 0 && !families.includes(product.family)) return false

      // A fragrance qualifies if any of its bottles or oils falls inside the range.
      const inRange = bottleFormats(product).some(
        (format) => format.priceFils >= priceRange[0] && format.priceFils <= priceRange[1],
      )
      if (!inRange) return false

      if (needle && !INDEX[product.id].includes(needle)) return false

      return true
    })

    return [...matched].sort(SORTERS[sort] ?? SORTERS.featured)
  }, [query, families, priceRange, sort])

  return {
    query,
    setQuery,
    families,
    toggleFamily,
    selectFamily,
    priceRange,
    setPriceRange,
    sort,
    setSort,
    reset,
    isFiltered,
    results,
  }
}
