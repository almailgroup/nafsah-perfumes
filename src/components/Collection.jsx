import { useMemo, useState } from 'react'
import { SearchX } from 'lucide-react'
import Filters from './Filters'
import ProductCard from './ProductCard'
import { PRICE_BOUNDS, PRODUCTS } from '../data/products'

const DEFAULT_RANGE = [PRICE_BOUNDS.min, PRICE_BOUNDS.max]

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

export default function Collection({ searchRef }) {
  const [query, setQuery] = useState('')
  const [families, setFamilies] = useState([])
  const [priceRange, setPriceRange] = useState(DEFAULT_RANGE)
  const [sort, setSort] = useState('featured')

  const toggleFamily = (family) =>
    setFamilies((current) =>
      current.includes(family) ? current.filter((item) => item !== family) : [...current, family],
    )

  const reset = () => {
    setQuery('')
    setFamilies([])
    setPriceRange(DEFAULT_RANGE)
    setSort('featured')
  }

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

    const cheapest = (product) => Math.min(...product.sizes.map((size) => size.price))

    const sorters = {
      'price-asc': (a, b) => cheapest(a) - cheapest(b),
      'price-desc': (a, b) => cheapest(b) - cheapest(a),
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      newest: (a, b) => b.year - a.year || b.rating - a.rating,
      featured: (a, b) =>
        Number(Boolean(b.bestseller)) - Number(Boolean(a.bestseller)) ||
        Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) ||
        b.rating - a.rating,
    }

    return [...matched].sort(sorters[sort] ?? sorters.featured)
  }, [query, families, priceRange, sort])

  return (
    <section id="collection" className="relative scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">The Collection</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight text-cream-50 sm:text-5xl">
            Twelve compositions,
            <em className="text-gilded not-italic"> no compromises</em>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-cream-300">
            Filter by scent family or price, or search any single note — bergamot, oud, iris — to
            find the composition that carries it.
          </p>
        </header>

        <div className="mt-12">
          <Filters
            ref={searchRef}
            query={query}
            onQueryChange={setQuery}
            families={families}
            onToggleFamily={toggleFamily}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            sort={sort}
            onSortChange={setSort}
            resultCount={results.length}
            onReset={reset}
            isFiltered={isFiltered}
          />
        </div>

        {results.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex animate-fade-in flex-col items-center rounded-3xl border border-dashed border-white/10 px-6 py-24 text-center">
            <SearchX className="h-8 w-8 text-cream-400" strokeWidth={1.25} />
            <h3 className="mt-5 font-display text-2xl text-cream-100">Nothing matches that yet</h3>
            <p className="mt-2 max-w-sm text-sm text-cream-400">
              Try a broader price range, or clear the scent families to see the full collection.
            </p>
            <button type="button" onClick={reset} className="btn-ghost mt-7">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
