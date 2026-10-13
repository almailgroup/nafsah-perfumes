import { ArrowLeft, ArrowRight, SearchX } from 'lucide-react'
import ActiveFilters from './catalogue/ActiveFilters'
import Filters from './Filters'
import ProductCard from './ProductCard'
import { useLocale } from '../i18n/locale-context'
import { Link } from '../router/RouterProvider'
import { SCENT_FINDER } from '../router/router-context'

/** The full, filterable catalogue. State lives in useCatalogue. */
export default function Collection({ catalogue, searchRef, onOpenProduct }) {
  const { t, tc, isRtl } = useLocale()
  const { results, total, priceRange, activeChips, removeChip, reset } = catalogue
  const Forward = isRtl ? ArrowLeft : ArrowRight

  return (
    <section id="collection" aria-labelledby="collection-title" className="relative scroll-mt-32 bg-snow-50 py-16 sm:py-24">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <header className="flex flex-col gap-4 border-b border-gold-500/60 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="ticket text-green-600">{t('theCatalogue')}</p>
            <h2 id="collection-title" className="t-h2 mt-4">{t('allPerfumes')}</h2>
          </div>
          <p className="ticket text-snow-600 sm:pb-1 sm:text-end">{tc('catalogue.meta', total)}</p>
        </header>

        <Filters ref={searchRef} catalogue={catalogue} />

        {results.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:mt-10 xl:grid-cols-4">
            {results.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                priceRange={priceRange}
                onOpen={onOpenProduct}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex animate-fade-in flex-col items-center border border-snow-200 bg-snow-100/60 px-6 py-20 text-center lg:mt-10">
            <SearchX aria-hidden="true" className="h-7 w-7 text-snow-600" strokeWidth={1} />
            <h3 className="t-title mt-6">{t('noMatch')}</h3>
            <p className="t-body mt-3 max-w-md text-snow-600">{t('catalogue.empty.body')}</p>
            {/* Every filter that is on, each removable from here. */}
            <ActiveFilters
              chips={activeChips}
              onRemove={removeChip}
              showClear={false}
              className="mt-7 max-w-2xl justify-center [&>ul]:justify-center"
            />
            <button type="button" onClick={reset} className="btn-outline mt-8">
              {t('catalogue.clearAll')}
            </button>
            <Link
              to={SCENT_FINDER}
              className="group mt-6 inline-block max-w-sm font-sans text-[14px] leading-relaxed text-green-600 underline-offset-4 hover:underline rtl:font-sans-ar"
            >
              {t('catalogue.empty.finder')}
              <Forward
                aria-hidden="true"
                className="ms-1.5 inline-block h-3.5 w-3.5 align-[-2px] transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
