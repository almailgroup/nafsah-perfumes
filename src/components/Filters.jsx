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
    <div className="w-full lg:w-56">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <span className="ticket text-noir-500">Price</span>
        <span className="t-figure text-[15px] text-noir-950">
          {formatPrice(range[0])}–{formatPrice(range[1])}
        </span>
      </div>

      <div className="relative h-10">
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-noir-950/20" />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-noir-950"
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
          className="range-input absolute inset-x-0 top-1/2 w-full -translate-y-1/2 touch-none"
        />
        <input
          type="range"
          min={floor}
          max={ceiling}
          step={STEP}
          value={range[1]}
          onChange={(event) => setMax(event.target.value)}
          aria-label="Maximum price"
          className="range-input absolute inset-x-0 top-1/2 w-full -translate-y-1/2 touch-none"
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
    <div className="border-y border-noir-950/[0.14] py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
        <div className="relative flex-1 lg:max-w-xs">
          <label htmlFor="fragrance-search" className="ticket mb-3 block text-noir-500">
            Search
          </label>
          <Search
            className="pointer-events-none absolute bottom-2.5 left-0 h-3.5 w-3.5 text-noir-500"
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
            className="w-full border-b border-noir-950/25 bg-transparent px-6 pb-2 font-sans text-[15px] font-light text-noir-950 placeholder:text-noir-500 focus:border-noir-950 focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="absolute bottom-1.5 right-0 grid h-6 w-6 place-items-center text-noir-500 transition-colors hover:text-noir-950"
            >
              <X className="h-3 w-3" strokeWidth={1.75} />
            </button>
          )}
        </div>

        <PriceSlider range={priceRange} onChange={onPriceChange} />

        <div className="relative lg:w-52">
          <label htmlFor="fragrance-sort" className="ticket mb-3 block text-noir-500">
            Sort
          </label>
          <select
            id="fragrance-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sort fragrances"
            className="w-full cursor-pointer appearance-none border-b border-noir-950/25 bg-transparent pb-2 pr-6 font-sans text-[15px] font-light text-noir-950 focus:border-noir-950 focus:outline-none focus:ring-0"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute bottom-2.5 right-0 h-3.5 w-3.5 text-noir-500"
            strokeWidth={1.25}
          />
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3">
        <span className="ticket text-noir-500">Family</span>
        {SCENT_FAMILIES.map((family) => {
          const active = families.includes(family)
          return (
            <button
              key={family}
              type="button"
              onClick={() => onToggleFamily(family)}
              aria-pressed={active}
              className={classNames(
                'relative py-1 font-sans text-[10px] uppercase tracking-label transition-colors duration-300',
                active ? 'text-oxblood-600' : 'text-noir-500 hover:text-noir-950',
              )}
            >
              {family}
              <span
                className={classNames(
                  'absolute -bottom-0.5 left-0 h-px bg-oxblood-600 transition-all duration-300',
                  active ? 'w-full' : 'w-0',
                )}
              />
            </button>
          )
        })}

        <div className="flex w-full items-center justify-between gap-6 sm:ml-auto sm:w-auto">
          <span className="ticket text-noir-500">
            {String(resultCount).padStart(2, '0')} of 12
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="font-sans text-[10px] uppercase tracking-label text-noir-950 underline underline-offset-4 transition-colors hover:text-oxblood-600"
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
