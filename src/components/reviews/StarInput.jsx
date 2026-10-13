import { forwardRef, useRef, useState } from 'react'
import { Star } from 'lucide-react'
import { useLocale } from '../../i18n/locale-context'
import { RATING_MAX } from '../../lib/reviews'
import { classNames, formatNumber } from '../../lib/format'

const VALUES = Array.from({ length: RATING_MAX }, (_, i) => i + 1)

/**
 * Five stars as a WAI-ARIA radiogroup. One tab stop (the chosen star, else the
 * first); the arrow keys move and choose, mirrored in Arabic so "forward" is
 * always toward the fifth star; Home and End jump to one and five. Each star
 * is named in full — "3 of 5 — Noticed across the room" — from `labels`, and
 * the choice is repeated as text beside the stars.
 *
 * `value` is 0 until chosen. The ref is the group, so a form can focus it.
 */
const StarInput = forwardRef(function StarInput(
  { value = 0, onChange, labels, labelledBy, describedBy, invalid = false, size = 22 },
  ref,
) {
  const { lang, t, isRtl } = useLocale()
  const starRefs = useRef([])
  const [preview, setPreview] = useState(0)

  const tabStop = value >= 1 ? value : 1
  const shown = preview || value
  const max = formatNumber(RATING_MAX, lang)

  const choose = (next) => {
    const wrapped = ((next - 1 + RATING_MAX) % RATING_MAX) + 1
    onChange?.(wrapped)
    starRefs.current[wrapped]?.focus()
  }

  const onKeyDown = (event, n) => {
    const forward = isRtl ? 'ArrowLeft' : 'ArrowRight'
    const backward = isRtl ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === forward || event.key === 'ArrowDown') choose(n + 1)
    else if (event.key === backward || event.key === 'ArrowUp') choose(n - 1)
    else if (event.key === 'Home') choose(1)
    else if (event.key === 'End') choose(RATING_MAX)
    else return
    event.preventDefault()
  }

  const describe = (n) => t('reviews.star', { value: formatNumber(n, lang), max, label: labels?.[n - 1] ?? '' })

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      <div
        ref={ref}
        role="radiogroup"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-required="true"
        aria-invalid={invalid || undefined}
        onMouseLeave={() => setPreview(0)}
        className="-mx-1.5 flex"
      >
        {VALUES.map((n) => {
          const checked = n === value
          const lit = n <= shown
          return (
            <button
              key={n}
              ref={(node) => {
                starRefs.current[n] = node
              }}
              type="button"
              role="radio"
              aria-checked={checked}
              aria-label={describe(n)}
              tabIndex={n === tabStop ? 0 : -1}
              onClick={() => onChange?.(n)}
              onKeyDown={(event) => onKeyDown(event, n)}
              onMouseEnter={() => setPreview(n)}
              className="grid h-10 w-10 place-items-center focus-visible:z-10"
            >
              <Star
                aria-hidden="true"
                style={{ width: size, height: size }}
                strokeWidth={1.25}
                fill={lit ? 'currentColor' : 'none'}
                className={classNames(
                  'transition-colors duration-200',
                  lit
                    ? preview && !(n <= value)
                      ? 'text-green-600/60'
                      : 'text-green-600'
                    : invalid
                      ? 'text-alert-600'
                      : 'text-snow-600',
                )}
              />
            </button>
          )
        })}
      </div>
      {/* The choice in words: never left to the colour of the stars alone. */}
      <p
        aria-hidden="true"
        className={classNames(
          'min-h-[1.25rem] font-sans text-[13px] leading-snug rtl:font-sans-ar',
          value ? 'text-ink-950' : 'text-snow-600',
        )}
      >
        {value ? describe(value) : t('reviews.notRated')}
      </p>
    </div>
  )
})

export default StarInput
