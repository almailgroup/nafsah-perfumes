import { SearchX } from 'lucide-react'
import Filters from './Filters'
import ProductCard from './ProductCard'
import { useLocale } from '../i18n/locale-context'

/** The full, filterable catalogue. State lives in useCatalogue. */
export default function Collection({ catalogue, searchRef }) {
  const { t } = useLocale()
  const {
    query, setQuery, families, toggleFamily, priceRange, setPriceRange,
    sort, setSort, reset, isFiltered, results,
  } = catalogue

  return (
    <section id="collection" className="relative scroll-mt-32 bg-midnight-950 py-14 sm:py-16">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <header className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="ticket text-saffron-300">{t('theCatalogue')}</p>
            <h2 className="t-h2 mt-4">{t('allPerfumes')}</h2>
          </div>
          <p className="ticket text-pearl-400 sm:pb-1">{t('catalogueMeta')}</p>
        </header>

        <Filters
          ref={searchRef}
          query={query} onQueryChange={setQuery}
          families={families} onToggleFamily={toggleFamily}
          priceRange={priceRange} onPriceChange={setPriceRange}
          sort={sort} onSortChange={setSort}
          resultCount={results.length} onReset={reset} isFiltered={isFiltered}
        />

        {results.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} priceRange={priceRange} />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex animate-fade-in flex-col items-center border border-dashed border-pearl-50/20 px-6 py-24 text-center">
            <SearchX className="h-7 w-7 text-pearl-400" strokeWidth={1} />
            <h3 className="t-title mt-6">{t('noMatch')}</h3>
            <p className="t-body mt-3 max-w-sm">{t('noMatchBody')}</p>
            <button type="button" onClick={reset} className="btn-outline mt-8">
              {t('clearFilters')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
