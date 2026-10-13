import { Check } from 'lucide-react'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatNumber } from '../../lib/format'

/** Four hairline steps, filled to the level: projection drawn, its word beside it. */
function StepMeter({ level, steps }) {
  return (
    <span aria-hidden="true" className="flex items-end gap-[2px]">
      {Array.from({ length: steps }, (_, index) => (
        <span
          key={index}
          className={classNames('w-[3px]', index < level ? 'bg-green-600' : 'bg-snow-300')}
          style={{ height: `${5 + index * 3}px` }}
        />
      ))}
    </span>
  )
}

/**
 * One facet as a list of real checkboxes. Each option carries how many
 * fragrances it would show with the other filters applied — in words for
 * screen readers, as a figure on screen. An option at zero stays choosable,
 * only quieter.
 */
export default function CheckboxList({ name, options, selected, counts, onToggle, steps, className }) {
  const { lang, tc, tr } = useLocale()

  return (
    <ul className={classNames('flex flex-col', className)}>
      {options.map((option) => {
        const checked = selected.includes(option.id)
        const count = counts?.[option.id] ?? 0
        const quiet = !checked && count === 0
        return (
          <li key={option.id}>
            <label className="group flex min-h-11 cursor-pointer items-center gap-3 py-1.5">
              <input
                type="checkbox"
                name={name}
                value={option.id}
                checked={checked}
                onChange={() => onToggle(option.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={classNames(
                  'grid h-[18px] w-[18px] shrink-0 place-items-center border transition-colors duration-200',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-green-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-snow-50',
                  checked ? 'border-green-600 bg-green-600 text-snow-50' : 'border-snow-600 bg-snow-50 group-hover:border-ink-950',
                )}
              >
                {checked && <Check className="h-3 w-3" strokeWidth={2} />}
              </span>
              <span
                className={classNames(
                  'min-w-0 flex-1 font-sans text-[15px] leading-snug transition-colors rtl:font-sans-ar rtl:text-[14px]',
                  quiet ? 'text-snow-600' : 'text-ink-950',
                )}
              >
                {tr(option.label)}
                <span className="sr-only"> ({tc('catalogue.count', count)})</span>
              </span>
              {option.level && <StepMeter level={option.level} steps={steps} />}
              <span aria-hidden="true" className="t-figure min-w-[2ch] text-end text-[13px] font-normal text-snow-600">
                {formatNumber(count, lang)}
              </span>
            </label>
          </li>
        )
      })}
    </ul>
  )
}
