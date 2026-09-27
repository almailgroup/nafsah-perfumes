import { forwardRef } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { FAMILY_AR, PRICE_BOUNDS, SCENT_FAMILIES } from '../data/products'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatOrdinal, formatPrice } from '../lib/format'

const STEP = 1

function PriceSlider({ range, onChange }) {
  const { lang, t, isRtl } = useLocale()
  const { min: floor, max: ceiling } = PRICE_BOUNDS
  const span = ceiling - floor
  const leftPct = ((range[0] - floor) / span) * 100
  const rightPct = ((range[1] - floor) / span) * 100

  const setMin = (v) => onChange([Math.min(Number(v), range[1] - STEP), range[1]])
  const setMax = (v) => onChange([range[0], Math.max(Number(v), range[0] + STEP)])

  // The rail is drawn from the logical start, so it must flip with direction.
  const fill = isRtl
    ? { right: `${leftPct}%`, left: `${100 - rightPct}%` }
    : { left: `${leftPct}%`, right: `${100 - rightPct}%` }

  return (
    <div className="w-full lg:w-60">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="ticket text-pearl-400">{t('price')}</span>
        <span className="t-figure text-[14px] text-pearl-100">
          {formatPrice(range[0], lang)} – {formatPrice(range[1], lang)}
        </span>
      </div>
      <div className="relative h-10">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-pearl-50/25" />
        <div className="absolute top-1/2 h-px -translate-y-1/2 bg-jade-300" style={fill} />
        <input
          type="range" min={floor} max={ceiling} step={STEP} value={range[0]}
          onChange={(e) => setMin(e.target.value)} aria-label={`${t('price')} — min`}
          className="range-input absolute inset-x-0 top-1/2 w-full -translate-y-1/2 touch-none"
        />
        <input
          type="range" min={floor} max={ceiling} step={STEP} value={range[1]}
          onChange={(e) => setMax(e.target.value)} aria-label={`${t('price')} — max`}
          className="range-input absolute inset-x-0 top-1/2 w-full -translate-y-1/2 touch-none"
        />
      </div>
    </div>
  )
}

const Filters = forwardRef(function Filters(
  { query, onQueryChange, families, onToggleFamily, priceRange, onPriceChange, sort, onSortChange,
    resultCount, onReset, isFiltered },
  searchRef,
) {
  const { lang, t, pick } = useLocale()

  const SORT_OPTIONS = [
    { value: 'featured', label: t('sortFeatured') },
    { value: 'price-asc', label: t('sortPriceAsc') },
    { value: 'price-desc', label: t('sortPriceDesc') },
    { value: 'rating', label: t('sortRating') },
    { value: 'newest', label: t('sortNewest') },
  ]

  return (
    <div className="border-y border-pearl-50/[0.14] py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="relative flex-1 lg:max-w-xs">
          <label htmlFor="fragrance-search" className="ticket mb-3 block text-pearl-400">
            {t('search')}
          </label>
          <Search className="pointer-events-none absolute bottom-2.5 start-0 h-3.5 w-3.5 text-pearl-400" strokeWidth={1.25} />
          <input
            id="fragrance-search" ref={searchRef} type="search" value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={t('searchShort')} aria-label={t('search')}
            className="w-full border-b border-pearl-50/25 bg-transparent pb-2 pe-6 ps-6 font-sans text-[15px] font-light text-pearl-50 placeholder:text-pearl-400 focus:border-jade-400 focus:outline-none focus:ring-0 rtl:font-sans-ar"
          />
          {query && (
            <button
              type="button" onClick={() => onQueryChange('')} aria-label={t('reset')}
              className="absolute bottom-1.5 end-0 grid h-6 w-6 place-items-center text-pearl-400 transition-colors hover:text-pearl-50"
            >
              <X className="h-3 w-3" strokeWidth={1.75} />
            </button>
          )}
        </div>

        <PriceSlider range={priceRange} onChange={onPriceChange} />

        <div className="relative lg:w-52">
          <label htmlFor="fragrance-sort" className="ticket mb-3 block text-pearl-400">
            {t('sort')}
          </label>
          <select
            id="fragrance-sort" value={sort} onChange={(e) => onSortChange(e.target.value)}
            className="w-full cursor-pointer appearance-none border-b border-pearl-50/25 bg-transparent pb-2 pe-6 font-sans text-[15px] font-light text-pearl-50 focus:border-jade-400 focus:outline-none focus:ring-0 rtl:font-sans-ar"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-midnight-900 text-pearl-50">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute bottom-2.5 end-0 h-3.5 w-3.5 text-pearl-400" strokeWidth={1.25} />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
        <span className="ticket text-pearl-400">{t('family')}</span>
        {SCENT_FAMILIES.map((family) => {
          const active = families.includes(family)
          return (
            <button
              key={family} type="button" onClick={() => onToggleFamily(family)} aria-pressed={active}
              className={classNames(
                'relative py-1 font-sans text-[11px] uppercase tracking-label transition-colors duration-300 rtl:font-sans-ar rtl:text-[13px] rtl:normal-case rtl:tracking-normal',
                active ? 'text-jade-300' : 'text-pearl-400 hover:text-pearl-100',
              )}
            >
              {pick(family, FAMILY_AR[family])}
              <span className={classNames(
                'absolute -bottom-0.5 start-0 h-px bg-jade-300 transition-all duration-300',
                active ? 'w-full' : 'w-0',
              )} />
            </button>
          )
        })}

        <div className="flex w-full items-center justify-between gap-6 sm:ms-auto sm:w-auto">
          <span className="ticket text-pearl-400">
            {formatOrdinal(resultCount, lang)} {t('of')} {formatOrdinal(12, lang)}
          </span>
          {isFiltered && (
            <button
              type="button" onClick={onReset}
              className="ticket text-jade-300 underline underline-offset-4 transition-colors hover:text-jade-200"
            >
              {t('reset')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

export default Filters
