import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import ActiveFilters from './catalogue/ActiveFilters'
import CheckboxList from './catalogue/CheckboxList'
import FacetPopover from './catalogue/FacetPopover'
import FilterSheet from './catalogue/FilterSheet'
import NotePicker from './catalogue/NotePicker'
import PriceRange from './catalogue/PriceRange'
import SearchField from './catalogue/SearchField'
import SortSelect from './catalogue/SortSelect'
import { CHECKBOX_FACETS } from './catalogue/facets'
import { useLocale } from '../i18n/locale-context'
import { formatNumber } from '../lib/format'

/**
 * "8 of 15", announced politely as the results change. Focusable from script
 * only: focus lands here when the last chip or "Clear all" goes.
 */
const ResultCount = forwardRef(function ResultCount({ shown, total, className }, ref) {
  const { lang, t } = useLocale()
  return (
    <p ref={ref} tabIndex={-1} aria-live="polite" aria-atomic="true" className={className}>
      {t('catalogue.showing', { shown: formatNumber(shown, lang), total: formatNumber(total, lang) })}
    </p>
  )
})

/**
 * The catalogue's filter bar.
 *
 * From lg: search, price and sort; then the facets as buttons opening panels
 * of choices with counts (notes as a combobox), and the result count; then
 * the active filters as chips with "Clear all".
 *
 * Below lg: a bar that stays under the header while the grid scrolls, with
 * "Filters (n)", the count and the sort; the chips beneath it; and every
 * filter in a sheet. The pieces are siblings of the grid (a fragment), so the
 * bar can stick for the whole length of the catalogue.
 */
const Filters = forwardRef(function Filters({ catalogue }, searchRef) {
  const { lang, t } = useLocale()
  const [openFacet, setOpenFacet] = useState(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const topRef = useRef(null)
  const deskCountRef = useRef(null)
  const barCountRef = useRef(null)

  // Closing the sheet on fewer results can leave the shopper scrolled past
  // the end of a now shorter grid. Bring the top of the results back under
  // the header when it has gone above it.
  const closeSheet = useCallback(() => {
    setSheetOpen(false)
    requestAnimationFrame(() => {
      const anchor = topRef.current
      const header = document.querySelector('header')
      if (!anchor) return
      const below = header ? header.getBoundingClientRect().bottom : 0
      const top = anchor.getBoundingClientRect().top
      if (top < below) window.scrollTo({ top: window.scrollY + top - below, behavior: 'instant' })
    })
  }, [])

  // The sheet is for narrow screens; widening past lg puts the bar back.
  useEffect(() => {
    if (!sheetOpen) return undefined
    const wide = window.matchMedia('(min-width: 1024px)')
    const onChange = () => wide.matches && setSheetOpen(false)
    onChange()
    wide.addEventListener('change', onChange)
    return () => wide.removeEventListener('change', onChange)
  }, [sheetOpen])

  const {
    filters, counts, results, total, sort, sorts, setSort, setQuery, setPriceRange, toggle, toggleNote,
    activeChips, removeChip, reset, activeCount,
  } = catalogue

  const popover = (facet) => ({
    open: openFacet === facet,
    onOpenChange: (open) => setOpenFacet(open ? facet : null),
  })

  const [families, ...rest] = CHECKBOX_FACETS
  const facetPanel = (config) => (
    <FacetPopover
      key={config.facet}
      label={t(config.labelKey)}
      count={filters[config.facet].length}
      {...popover(config.facet)}
    >
      <CheckboxList
        name={`filter-${config.facet}`}
        options={config.options}
        selected={filters[config.facet]}
        counts={counts[config.facet]}
        steps={config.steps}
        onToggle={(id) => toggle(config.facet, id)}
      />
    </FacetPopover>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden border-y border-snow-200 py-7 lg:block">
        <div className="flex items-end justify-between gap-10 xl:gap-16">
          <SearchField ref={searchRef} value={filters.query} onChange={setQuery} className="max-w-sm flex-1" />
          <PriceRange range={filters.priceRange} onChange={setPriceRange} className="max-w-[20rem] flex-1" />
          <SortSelect value={sort} options={sorts} onChange={setSort} className="w-56 shrink-0" />
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          {facetPanel(families)}
          <FacetPopover label={t('catalogue.facet.notes')} count={filters.notes.length} wide {...popover('notes')}>
            <NotePicker selected={filters.notes} counts={counts.notes} onToggle={toggleNote} />
          </FacetPopover>
          {rest.map(facetPanel)}
          <ResultCount ref={deskCountRef} shown={results.length} total={total} className="ticket ms-auto text-snow-600" />
        </div>

        {/* With nothing found, the empty state lists the filters instead. */}
        {results.length > 0 && (
          <ActiveFilters
            chips={activeChips}
            onRemove={removeChip}
            onClear={reset}
            onEmpty={() => deskCountRef.current?.focus({ preventScroll: true })}
            className="mt-5"
          />
        )}
      </div>

      {/* Phones and tablets */}
      <div ref={topRef} aria-hidden="true" className="lg:hidden" />
      <div className="sticky top-[65px] z-20 -mx-5 flex items-center gap-3 border-y border-snow-200 bg-snow-50/95 px-5 py-3 backdrop-blur-sm sm:top-[73px] sm:-mx-9 sm:px-9 lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-haspopup="dialog"
          className="inline-flex h-10 shrink-0 items-center gap-2.5 border border-snow-300 px-4 font-sans text-[11px] font-medium uppercase tracking-wide2 text-ink-950 transition-colors hover:border-green-600 hover:text-green-600 rtl:font-sans-ar rtl:text-[13px] rtl:normal-case rtl:tracking-normal"
        >
          <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t('catalogue.filters')}
          {activeCount > 0 && (
            <span className="t-figure grid h-[18px] min-w-[18px] place-items-center rounded-full bg-green-600 px-1 text-[10px] leading-none text-snow-50">
              <span className="sr-only">{' ('}</span>
              {formatNumber(activeCount, lang)}
              <span className="sr-only">)</span>
            </span>
          )}
        </button>
        <ResultCount
          ref={barCountRef}
          shown={results.length}
          total={total}
          className="ticket min-w-0 truncate text-snow-600"
        />
        <SortSelect value={sort} options={sorts} onChange={setSort} compact className="ms-auto min-w-0 max-w-[11.5rem] flex-1" />
      </div>
      {results.length > 0 && (
        <ActiveFilters
          chips={activeChips}
          onRemove={removeChip}
          onClear={reset}
          onEmpty={() => barCountRef.current?.focus({ preventScroll: true })}
          className="mt-4 lg:hidden"
        />
      )}

      <FilterSheet open={sheetOpen} onClose={closeSheet} catalogue={catalogue} />
    </>
  )
})

export default Filters
