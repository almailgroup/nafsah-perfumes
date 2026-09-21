import { useCallback, useMemo, useState } from 'react'
import { PRICE_BOUNDS, PRODUCTS } from '../data/products'

export const DEFAULT_RANGE = [PRICE_BOUNDS.min, PRICE_BOUNDS.max]

/** Everything a fragrance can be matched against by the search box. */
const searchIndex = (product) =>
  [
    product.name,
    product.tagline,
    product.family,
    product.concentration,
    product.description,
    ...product.notes.top,
    ...product.notes.heart,
    ...product.notes.base,
  ]
    .join(' ')
    .toLowerCase()

const INDEX = Object.fromEntries(PRODUCTS.map((product) => [product.id, searchIndex(product)]))

const cheapest = (product) => Math.min(...product.sizes.map((size) => size.price))

const SORTERS = {
  'price-asc': (a, b) => cheapest(a) - cheapest(b),
  'price-desc': (a, b) => cheapest(b) - cheapest(a),
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  newest: (a, b) => b.year - a.year || b.rating - a.rating,
  featured: (a, b) =>
    Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)) ||
    Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) ||
    b.rating - a.rating,
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
    const needle = query.trim().toLowerCase()

    const matched = PRODUCTS.filter((product) => {
      if (families.length > 0 && !families.includes(product.family)) return false

      // A fragrance qualifies if any of its sizes falls inside the range.
      const inRange = product.sizes.some(
        (size) => size.price >= priceRange[0] && size.price <= priceRange[1],
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
