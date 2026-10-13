import { Star } from 'lucide-react'
import { RATING_MAX } from '../../lib/reviews'
import { classNames } from '../../lib/format'

const GAP = 2

/**
 * A row of stars filled to `value` (0–5, fractions shown as a part-filled
 * star). Decorative: whoever places it prints the value beside it as text.
 * The fill starts at the logical start, so in Arabic it grows from the right.
 */
export default function Stars({ value = 0, size = 12, className }) {
  const clamped = Math.max(0, Math.min(RATING_MAX, Number(value) || 0))
  const whole = Math.floor(clamped)
  const width = size * RATING_MAX + GAP * (RATING_MAX - 1)
  // Gaps carry no fill, so measure in whole stars plus a part of the next.
  const filled = whole * (size + GAP) + (clamped - whole) * size

  const row = (className) => (
    <span className={classNames('flex', className)} style={{ gap: GAP, width }}>
      {Array.from({ length: RATING_MAX }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className="shrink-0"
          style={{ width: size, height: size }}
          strokeWidth={1.25}
          fill="currentColor"
        />
      ))}
    </span>
  )

  return (
    <span aria-hidden="true" className={classNames('relative inline-flex shrink-0', className)} style={{ width }}>
      {row('text-snow-300')}
      <span className="absolute inset-y-0 start-0 overflow-hidden" style={{ width: filled }}>
        {row('text-green-600')}
      </span>
    </span>
  )
}
