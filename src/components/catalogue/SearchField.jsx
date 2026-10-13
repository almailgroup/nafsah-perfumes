import { forwardRef, useId } from 'react'
import { Search, X } from 'lucide-react'
import { useLocale } from '../../i18n/locale-context'
import { classNames } from '../../lib/format'

/** The catalogue's free-text search, in either language, on a hairline. */
const SearchField = forwardRef(function SearchField({ value, onChange, className }, ref) {
  const { t } = useLocale()
  const id = useId()

  return (
    <div className={classNames('relative', className)}>
      <label htmlFor={id} className="ticket mb-2 block text-snow-600">
        {t('search')}
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-snow-600"
          strokeWidth={1.25}
        />
        <input
          id={id}
          ref={ref}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            // Escape empties the field; a second one is the page's.
            if (event.key === 'Escape' && value) {
              event.preventDefault()
              onChange('')
            }
          }}
          placeholder={t('searchShort')}
          enterKeyHint="search"
          className="h-10 w-full border-b border-snow-300 bg-transparent pe-8 ps-6 font-sans text-[16px] font-normal text-ink-950 placeholder:text-snow-600 focus:border-green-600 focus:outline-none focus:ring-0 rtl:font-sans-ar"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label={t('catalogue.remove', { label: t('catalogue.chip.query', { query: value }) })}
            className="absolute end-0 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-snow-600 transition-colors hover:text-ink-950"
          >
            <X aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        )}
      </div>
    </div>
  )
})

export default SearchField
