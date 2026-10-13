import { useRef } from 'react'
import { FORMAT_BY_ID } from '../../data/taxonomy'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatMl, formatPrice } from '../../lib/format'

// The compact control lays its options out in rows of at most three; four
// read best as two pairs.
const COMPACT_COLUMNS = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3' }

/**
 * The size and sample toggle: full bottle, 50 ml spray, tola and quarter-tola
 * oil, the 2 ml vial — whichever the fragrance is sold in.
 *
 * A WAI-ARIA radiogroup with a roving tabindex: Tab enters on the selected
 * option, the arrow keys move and select (left and right mirror in Arabic),
 * Home and End jump to the ends. `full` stacks every option with its label,
 * volume and price; `compact` is the small segmented control on the cards,
 * where the price is read out but shown once, above, by the card itself.
 * The full variant also says which formats carry the free Try First vial.
 */
export default function FormatToggle({ product, value, onChange, variant = 'full', labelledBy }) {
  const { lang, t, tr, isRtl } = useLocale()
  const optionRefs = useRef([])
  const formats = product?.formats ?? []
  if (formats.length === 0) return null

  const selected = formats.findIndex((entry) => entry.id === value)
  // With nothing selected the first option takes the tab stop.
  const tabStop = selected >= 0 ? selected : 0
  const compact = variant === 'compact'

  const select = (index) => {
    const next = (index + formats.length) % formats.length
    onChange?.(formats[next].id)
    optionRefs.current[next]?.focus()
  }

  const onKeyDown = (event, index) => {
    const forward = isRtl ? 'ArrowLeft' : 'ArrowRight'
    const backward = isRtl ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === forward || event.key === 'ArrowDown') select(index + 1)
    else if (event.key === backward || event.key === 'ArrowUp') select(index - 1)
    else if (event.key === 'Home') select(0)
    else if (event.key === 'End') select(formats.length - 1)
    else return
    event.preventDefault()
  }

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : t('product.formatLabel')}
      className={classNames(
        compact
          ? `grid gap-px border border-snow-300 bg-snow-300 ${COMPACT_COLUMNS[formats.length] ?? 'grid-cols-2'}`
          : 'grid gap-2',
      )}
    >
      {formats.map((entry, index) => {
        const checked = index === selected
        const label = tr(FORMAT_BY_ID[entry.id])
        const volume = formatMl(entry.ml, lang)
        // Try First formats ship with a 2 ml vial of the same scent.
        const vial = FORMAT_BY_ID[entry.id]?.tryFirst
          ? t('product.format.vial', { volume: formatMl(FORMAT_BY_ID.sample.ml, lang) })
          : null
        const price = formatPrice(entry.priceFils, lang)

        const common = {
          ref: (node) => {
            optionRefs.current[index] = node
          },
          type: 'button',
          role: 'radio',
          'aria-checked': checked,
          tabIndex: index === tabStop ? 0 : -1,
          onClick: () => onChange?.(entry.id),
          onKeyDown: (event) => onKeyDown(event, index),
        }

        if (compact) {
          return (
            <button
              key={entry.id}
              {...common}
              className={classNames(
                'relative flex min-w-0 flex-col items-center justify-center gap-0.5 px-2 py-2 text-center transition-colors duration-300 focus-visible:z-10',
                // Selected: a 2px Arab Green frame and green type, 7.4:1 on paper.
                checked
                  ? 'bg-snow-50 text-green-600 shadow-[inset_0_0_0_2px_#006039]'
                  : 'bg-snow-50 text-snow-600 hover:text-ink-950',
              )}
            >
              <span className="font-sans text-[12px] font-medium leading-tight rtl:font-sans-ar">{label}</span>
              <span className="font-sans text-[11px] leading-tight rtl:font-sans-ar">{volume}</span>
              <span className="sr-only">{price}</span>
            </button>
          )
        }

        return (
          <button
            key={entry.id}
            {...common}
            className={classNames(
              'flex w-full items-center justify-between gap-4 border px-4 py-3 text-start transition-colors duration-300',
              checked
                ? 'border-green-600 bg-snow-100 shadow-[inset_0_0_0_1px_#006039]'
                : 'border-snow-300 bg-snow-50 hover:border-snow-600',
            )}
          >
            <span className="flex min-w-0 items-center gap-3">
              {/* The radio dot: its ring is 7:1 either way, the fill marks the choice. */}
              <span
                aria-hidden="true"
                className={classNames(
                  'grid h-4 w-4 shrink-0 place-items-center rounded-full border',
                  checked ? 'border-green-600' : 'border-snow-600',
                )}
              >
                {checked && <span className="h-2 w-2 rounded-full bg-green-600" />}
              </span>
              <span className="min-w-0">
                <span className="block font-sans text-[14px] font-medium leading-snug text-ink-950 rtl:font-sans-ar">
                  {label}
                </span>
                <span className="block font-sans text-[12px] leading-snug text-snow-600 rtl:font-sans-ar">
                  {volume}
                  {vial && ` · ${vial}`}
                </span>
              </span>
            </span>
            <span className="t-figure shrink-0 text-[15px] leading-none text-ink-950">{price}</span>
          </button>
        )
      })}
    </div>
  )
}
