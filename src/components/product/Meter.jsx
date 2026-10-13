import { useId } from 'react'
import { classNames } from '../../lib/format'

/**
 * The house meter: one hue, a green measure on a pale green track, with the
 * value always written out above it — the bar illustrates the words, it never
 * replaces them.
 *
 * - `segments` (a whole number of steps) draws a stepped meter, each step
 *   parted from the next by a 2px gap of paper; without it the meter is a
 *   continuous 8px bar, square at zero and rounded at the data end only.
 * - `valueText` is shown and is also the meter's aria-valuetext, so a screen
 *   reader hears it once, from the meter, rather than twice.
 * - `scale` puts small start/end captions under a continuous bar (0 h … 24 h).
 *
 * Shared with the reviews section, which draws its averages the same way.
 */
export default function Meter({ label, value, min = 0, max, valueText, segments, scale, className }) {
  const labelId = useId()
  const span = max - min
  const clamped = Math.min(max, Math.max(min, Number(value) || 0))
  const share = span > 0 ? ((clamped - min) / span) * 100 : 0

  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span id={labelId} className="ticket text-snow-600">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="font-sans text-[14px] leading-snug text-ink-950 rtl:font-sans-ar"
        >
          {valueText}
        </span>
      </div>

      <div
        role="meter"
        aria-labelledby={labelId}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={clamped}
        aria-valuetext={valueText}
        className="mt-2.5"
      >
        {segments ? (
          <div
            className="grid gap-[2px]"
            style={{ gridTemplateColumns: `repeat(${segments}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: segments }, (_, index) => (
              <span
                key={index}
                className={classNames('h-2', index < clamped - min ? 'bg-green-600' : 'bg-green-600/10')}
              />
            ))}
          </div>
        ) : (
          <div className="relative h-2 bg-green-600/10">
            <div
              className={classNames(
                'absolute inset-y-0 start-0 bg-green-600',
                share < 100 && 'rounded-e-[4px]',
              )}
              style={{ width: `${share}%` }}
            />
          </div>
        )}
      </div>

      {scale && (
        <div
          aria-hidden="true"
          className="mt-1.5 flex justify-between font-sans text-[11px] text-snow-600 rtl:font-sans-ar"
        >
          <span>{scale[0]}</span>
          <span>{scale[1]}</span>
        </div>
      )}
    </div>
  )
}
