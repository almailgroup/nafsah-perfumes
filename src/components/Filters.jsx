import { forwardRef } from 'react'
import { Check, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
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
    <div className="w-full sm:w-64">
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wider2 text-cream-400">
          Price
        </span>
        <span className="font-display text-base text-cream-100">
          {formatPrice(range[0])} — {formatPrice(range[1])}
        </span>
      </div>

      <div className="relative h-5">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-ink-700" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
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
  { query, onQueryChange, families, onToggleFamily, priceRange, onPriceChange, sort, onSortChange, resultCount, onReset, isFiltered },
  searchRef,
) {
  return (
    <div className="rounded-3xl border border-white/[0.07] bg-ink-900/60 p-5 backdrop-blur-sm sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 lg:max-w-sm">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-400"
            strokeWidth={1.5}
          />
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name or note…"
            aria-label="Search fragrances"
            className="field pl-11 pr-10"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange('')}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-cream-400 transition-colors hover:bg-white/10 hover:text-cream-100"
            >
              <X className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
        </div>

        <PriceSlider range={priceRange} onChange={onPriceChange} />

        {/* Sort */}
        <div className="relative">
          <SlidersHorizontal
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-400"
            strokeWidth={1.5}
          />
          <select
            value={sort}
            onChange={(event) => onSortChange(event.target.value)}
            aria-label="Sort fragrances"
            className="field cursor-pointer appearance-none pl-11 pr-10"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-ink-850">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-400"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Scent families */}
      <div className="mt-6 flex flex-wrap items-center gap-2 border-t hairline pt-6">
        <span className="mr-1 text-[10px] font-medium uppercase tracking-wider2 text-cream-400">
          Scent family
        </span>
        {SCENT_FAMILIES.map((family) => {
          const active = families.includes(family)
          return (
            <button
              key={family}
              type="button"
              onClick={() => onToggleFamily(family)}
              aria-pressed={active}
              className={classNames(
                'inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[11px] font-medium uppercase tracking-wider2 transition-all duration-300',
                active
                  ? 'border-gold-400/70 bg-gold-400/15 text-gold-200'
                  : 'border-white/10 text-cream-300 hover:border-white/25 hover:text-cream-100',
              )}
            >
              {active && <Check className="h-3 w-3" strokeWidth={2.5} />}
              {family}
            </button>
          )
        })}

        <div className="flex w-full items-center justify-between gap-4 pt-2 sm:ml-auto sm:w-auto sm:justify-end sm:pt-0">
          <span className="text-[11px] tracking-wide text-cream-400">
            {resultCount} {resultCount === 1 ? 'fragrance' : 'fragrances'}
          </span>
          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider2 text-gold-300 transition-colors hover:text-gold-100"
            >
              <X className="h-3 w-3" strokeWidth={2} />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
})

export default Filters
