import { useId, useRef } from 'react'
import { X } from 'lucide-react'
import CheckboxList from './CheckboxList'
import NotePicker from './NotePicker'
import PriceRange from './PriceRange'
import SearchField from './SearchField'
import { CHECKBOX_FACETS } from './facets'
import { useOverlay } from '../../hooks/useOverlay'
import { useLocale } from '../../i18n/locale-context'

/**
 * One group of the sheet, on a hairline. Choices sit in a fieldset named by
 * its legend; the search and price controls carry labels of their own.
 */
function Section({ title, children }) {
  return (
    <div className="border-t border-snow-200 py-6 first:border-t-0 first:pt-2">
      {title ? (
        <fieldset className="min-w-0">
          <legend className="ticket mb-3 text-snow-600">{title}</legend>
          {children}
        </fieldset>
      ) : (
        children
      )}
    </div>
  )
}

/**
 * Phones and tablets: every filter in one bottom sheet. Filters apply as they
 * are chosen; the footer button says how many fragrances that leaves and
 * closes the sheet onto them. Escape and the scrim close it too.
 */
export default function FilterSheet({ open, onClose, catalogue }) {
  const { t, tc } = useLocale()
  const titleId = useId()
  const panelRef = useRef(null)
  useOverlay(open, onClose, panelRef)

  if (!open) return null

  const { filters, counts, results, toggle, toggleNote, setQuery, setPriceRange, reset, isFiltered } = catalogue
  const [families, ...rest] = CHECKBOX_FACETS

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div onClick={onClose} className="absolute inset-0 animate-fade-in bg-ink-950/35 backdrop-blur-sm" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-x-0 bottom-0 flex max-h-[min(92dvh,52rem)] animate-fade-up flex-col border-t border-gold-500/60 bg-snow-50 shadow-[0_-24px_60px_-30px_rgba(8,20,15,0.6)] focus:outline-none sm:inset-x-auto sm:end-0 sm:top-0 sm:max-h-none sm:w-[26rem] sm:border-s sm:border-t-0"
      >
        <header className="flex items-center justify-between gap-4 border-b border-snow-200 px-5 py-4 sm:px-7">
          <h2 id={titleId} className="t-title">
            {t('catalogue.sheetTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            aria-label={t('catalogue.closeFilters')}
            className="grid h-10 w-10 place-items-center rounded-full text-snow-600 transition-colors hover:bg-snow-100 hover:text-ink-950"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4 pt-4 sm:px-7">
          <Section>
            <SearchField value={filters.query} onChange={setQuery} />
          </Section>
          <Section>
            <PriceRange range={filters.priceRange} onChange={setPriceRange} />
          </Section>
          <Section title={t(families.labelKey)}>
            <CheckboxList
              name={`${titleId}-families`}
              options={families.options}
              selected={filters.families}
              counts={counts.families}
              onToggle={(id) => toggle('families', id)}
            />
          </Section>
          <Section title={t('catalogue.facet.notes')}>
            <NotePicker selected={filters.notes} counts={counts.notes} onToggle={toggleNote} hideLabel />
          </Section>
          {rest.map((config) => (
            <Section key={config.facet} title={t(config.labelKey)}>
              <CheckboxList
                name={`${titleId}-${config.facet}`}
                options={config.options}
                selected={filters[config.facet]}
                counts={counts[config.facet]}
                steps={config.steps}
                onToggle={(id) => toggle(config.facet, id)}
              />
            </Section>
          ))}
        </div>

        <footer className="flex items-center gap-4 border-t border-snow-200 bg-snow-50 px-5 py-4 sm:px-7">
          {isFiltered && (
            <button
              type="button"
              onClick={reset}
              className="ticket shrink-0 text-green-600 underline underline-offset-4 transition-colors hover:text-ink-950"
            >
              {t('catalogue.clearAll')}
            </button>
          )}
          <button type="button" onClick={onClose} className="btn-green flex-1">
            {tc('catalogue.showResults', results.length)}
          </button>
        </footer>
      </div>
    </div>
  )
}
