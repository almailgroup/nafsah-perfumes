import { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLocale } from '../../i18n/locale-context'
import { classNames } from '../../lib/format'

/** The sort order, as a native select so every platform's own picker opens. */
export default function SortSelect({ value, options, onChange, compact = false, className }) {
  const { t } = useLocale()
  const id = useId()

  return (
    <div className={classNames('relative', className)}>
      <label htmlFor={id} className={compact ? 'sr-only' : 'ticket mb-2 block text-snow-600'}>
        {t('sort')}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={classNames(
            'h-10 w-full cursor-pointer appearance-none bg-transparent pe-7 font-sans font-normal text-ink-950 focus:border-green-600 focus:outline-none focus:ring-0 rtl:font-sans-ar',
            // 16px either way: smaller type makes iOS zoom the page on focus.
            compact ? 'border border-snow-300 ps-3 text-[16px]' : 'border-b border-snow-300 text-[16px]',
          )}
        >
          {options.map((option) => (
            <option key={option.id} value={option.id} className="bg-snow-50 text-ink-950">
              {t(option.labelKey)}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className={classNames(
            'pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-snow-600',
            compact ? 'end-3' : 'end-0',
          )}
          strokeWidth={1.25}
        />
      </div>
    </div>
  )
}
