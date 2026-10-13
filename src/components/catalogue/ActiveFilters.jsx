import { X } from 'lucide-react'
import { useLocale } from '../../i18n/locale-context'
import { classNames } from '../../lib/format'

/**
 * What is narrowing the catalogue, one removable chip per filter, then
 * "Clear all" (unless the caller offers its own). Renders nothing while
 * nothing is on.
 */
export default function ActiveFilters({ chips, onRemove, onClear, showClear = true, className }) {
  const { t } = useLocale()
  if (chips.length === 0) return null

  return (
    <div className={classNames('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      <h3 className="sr-only">{t('catalogue.active')}</h3>
      <ul className="flex max-w-full flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={`${chip.facet}:${chip.value}`} className="max-w-full">
            <button
              type="button"
              onClick={() => onRemove(chip)}
              aria-label={t('catalogue.remove', { label: chip.label })}
              className="group inline-flex min-h-9 max-w-full items-center gap-2.5 border border-snow-300 bg-snow-100 px-3 py-1.5 text-start font-sans text-[13px] text-ink-950 transition-colors duration-200 hover:border-green-600 rtl:font-sans-ar"
            >
              <span className="min-w-0 break-words">{chip.label}</span>
              <X
                aria-hidden="true"
                className="h-3 w-3 shrink-0 text-snow-600 transition-colors group-hover:text-green-600"
                strokeWidth={1.75}
              />
            </button>
          </li>
        ))}
      </ul>
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="ticket min-h-9 text-green-600 underline underline-offset-4 transition-colors hover:text-ink-950"
        >
          {t('catalogue.clearAll')}
        </button>
      )}
    </div>
  )
}
