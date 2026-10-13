import { Check } from 'lucide-react'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatNumber } from '../../lib/format'

/**
 * Where the shopper is: numbered seals joined by hairlines. The current step
 * carries aria-current="step"; a finished one is a button back to it. Below
 * sm the names leave the row but stay in it for screen readers, and the
 * current one is spelled out underneath.
 *
 * `steps` = [{ id, label }]
 */
export default function StepRail({ steps, current, onSelect, disabled = false }) {
  const { lang, t } = useLocale()
  const n = (value) => formatNumber(value, lang)

  return (
    <nav aria-label={t('checkout.progress')}>
      <ol className="flex items-center gap-3">
        {steps.map((step, index) => {
          const done = index < current
          const active = index === current
          const seal = (
            <>
              <span
                aria-hidden="true"
                className={classNames(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full border font-sans text-[12px] font-medium transition-colors duration-300 rtl:font-sans-ar',
                  done && 'border-green-600 bg-snow-50 text-green-600',
                  active && 'border-green-600 bg-green-600 text-snow-50',
                  !done && !active && 'border-snow-300 text-snow-600',
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" strokeWidth={1.75} /> : n(index + 1)}
              </span>
              <span
                className={classNames(
                  'sr-only font-sans text-[11px] font-medium uppercase tracking-wide2 sm:not-sr-only rtl:font-sans-ar rtl:text-[13px] rtl:normal-case rtl:tracking-normal',
                  active ? 'text-ink-950' : 'text-snow-600',
                  done && 'transition-colors duration-300 group-hover:text-ink-950',
                )}
              >
                {step.label}
              </span>
              {done && <span className="sr-only"> ({t('checkout.stepDone')})</span>}
            </>
          )

          return (
            <li
              key={step.id}
              aria-current={active ? 'step' : undefined}
              className={classNames('flex items-center gap-3', index < steps.length - 1 && 'flex-1')}
            >
              {done ? (
                <button
                  type="button"
                  onClick={() => onSelect(index)}
                  disabled={disabled}
                  aria-label={t('checkout.backTo', { step: step.label })}
                  className="group flex shrink-0 items-center gap-2.5 disabled:cursor-not-allowed"
                >
                  {seal}
                </button>
              ) : (
                <span className="flex shrink-0 items-center gap-2.5">{seal}</span>
              )}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={classNames(
                    'h-px min-w-4 flex-1 transition-colors duration-500',
                    done ? 'bg-green-600' : 'bg-snow-200',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
      <p aria-hidden="true" className="ticket mt-3 text-snow-600 sm:hidden">
        {t('checkout.stepOf', { current: n(current + 1), total: n(steps.length) })}
        <span className="text-snow-300"> · </span>
        <span className="text-ink-950">{steps[current]?.label}</span>
      </p>
    </nav>
  )
}
