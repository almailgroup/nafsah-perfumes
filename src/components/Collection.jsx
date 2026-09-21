import { SearchX } from 'lucide-react'
import Filters from './Filters'
import ProductCard from './ProductCard'

/**
 * The full, filterable catalogue. Filter state lives in useCatalogue so the
 * header search and the category tiles drive the same query.
 */
export default function Collection({ catalogue, searchRef }) {
  const {
    query,
    setQuery,
    families,
    toggleFamily,
    priceRange,
    setPriceRange,
    sort,
    setSort,
    reset,
    isFiltered,
    results,
  } = catalogue

  return (
    <section id="collection" className="relative scroll-mt-32 bg-paper-50 py-14 sm:py-16">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <header className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="ticket text-oxblood-600">The Catalogue</p>
            <h2 className="mt-4 font-display text-[2rem] font-normal leading-none text-noir-950 sm:text-[2.5rem]">
              All Perfumes
            </h2>
          </div>
          <p className="font-sans text-[13px] font-light text-noir-600 sm:pb-1">
            Twelve extraits · 50ml and 100ml · shipped from Kuwait
          </p>
        </header>

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

        {results.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {results.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                priceRange={priceRange}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex animate-fade-in flex-col items-center border border-dashed border-noir-950/20 px-6 py-24 text-center">
            <SearchX className="h-7 w-7 text-noir-500" strokeWidth={1} />
            <h3 className="t-title mt-6">Nothing matches that yet</h3>
            <p className="t-deck mt-3 max-w-sm">
              Try a broader price range, or clear the scent families to see the full catalogue.
            </p>
            <button type="button" onClick={reset} className="btn-outline mt-8">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
