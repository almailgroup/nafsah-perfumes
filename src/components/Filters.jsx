import { forwardRef } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'
import { PRICE_BOUNDS, SCENT_FAMILIES } from '../data/products'
import { classNames, formatPrice } from '../lib/format'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
]

const STEP = 5

function PriceSlider({ range, onChange }) {
  const { min: floor, max: ceiling } = PRICE_BOUNDS
  const span = ceiling - floor
  const leftPct = ((range[0] - floor) / span) * 100
  const rightPct = ((range[1] - floor) / span) * 100

  const setMin = (value) => onChange([Math.min(Number(value), range[1] - STEP), range[1]])
  const setMax = (value) => onChange([range[0], Math.max(Number(value), range[0] + STEP)])

  return (
    <div className="w-full lg:w-60">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="text-[9px] uppercase tracking-wider2 text-bone-500">Price</span>
        <span className="text-[11px] tabular-nums text-bone-200">
          {formatPrice(range[0])} – {formatPrice(range[1])}
        </span>
      </div>

      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-ink-600" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-bone-200"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        <input
          type="range"
          min={floor}
          max={ceiling}
          step={STEP}
          value={range[0]}
          onChange={(event) => setMin(event.target.value)}
          aria-label="Minimum price"
          className="range-input absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
        />
        <input
          type="range"
          min={floor}
          max={ceiling}
          step={STEP}
          value={range[1]}
          onChange={(event) => setMax(event.target.value)}
          aria-label="Maximum price"
          className="range-input absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
        />
      </div>
    </div>
  )
}

const Filters = forwardRef(function Filters(
  {
    query,
    onQueryChange,
    families,
    onToggleFamily,
    priceRange,
    onPriceChange,
    sort,
    onSortChange,
    resultCount,
    onReset,
    isFiltered,
  },
  searchRef,
) {
  return (
    <div className="border-y hairline py-7">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        {/* Search */}
        <div className="relative flex-1 lg:max-w-xs">
          <label
            htmlFor="fragrance-search"
            className="mb-3 block text-[9px] uppercase tracking-wider2 text-bone-500"
          >
            Search
          </label>
          <Search
            className="pointer-events-none absolute bottom-3 left-0 h-3.5 w-3.5 text-bone-500"
            strokeWidth={1.25}
          />
          <input
            id="fragrance-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Name or note…"
            aria-label="Search fragrances"
            className="w-full border-b hairline bg-transparent px-6 pb-2.5 text-sm font-light text-bone-50 placeholder:text-bone-500 focus:border-bone-200 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="absolute bottom-2 right-0 grid h-6 w-6 place-items-center text-bone-400 transition-colors hover:text-bone-50"
            >
              <X className="h-3 w-3" strokeWidth={1.75} />
            </button>
          )}
        </div>

        <PriceSlider range={priceRange} onChange={onPriceChange} />

        {/* Sort */}
        <div className="relative lg:w-52">
          <label
            htmlFor="fragrance-sort"
            className="mb-3 block text-[9px] uppercase tracking-wider2 text-bone-500"
          >
            Sort
          </label>
          <select
            id="fragrance-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sort fragrances"
            className="w-full cursor-pointer appearance-none border-b hairline bg-transparent pb-2.5 pr-6 text-sm font-light text-bone-50 focus:border-bone-200 focus:outline-none focus:ring-0"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-ink-850">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute bottom-3 right-0 h-3.5 w-3.5 text-bone-500"
            strokeWidth={1.25}
          />
        </div>
      </div>

      {/* Scent families */}
      <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
        <span className="text-[9px] uppercase tracking-wider2 text-bone-500">Family</span>
        {SCENT_FAMILIES.map((family) => {
          const active = families.includes(family)
          return (
            <button
              key={family}
              type="button"
              onClick={() => onToggleFamily(family)}
              aria-pressed={active}
              className={classNames(
                'relative py-1 text-[10px] uppercase tracking-wider2 transition-colors duration-300',
                active ? 'text-bone-50' : 'text-bone-400 hover:text-bone-100',
              )}
            >
              {family}
              <span
                className={classNames(
                  'absolute -bottom-0.5 left-0 h-px bg-bone-100 transition-all duration-300',
                  active ? 'w-full' : 'w-0',
                )}
              />
            </button>
          )
        })}

        <div className="flex w-full items-center justify-between gap-6 sm:ml-auto sm:w-auto">
          <span className="text-[10px] tabular-nums text-bone-500">
            {String(resultCount).padStart(2, '0')}{' '}
            {resultCount === 1 ? 'fragrance' : 'fragrances'}
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="text-[10px] uppercase tracking-wider2 text-bone-200 underline underline-offset-4 transition-colors hover:text-bone-50"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

export default Filters
