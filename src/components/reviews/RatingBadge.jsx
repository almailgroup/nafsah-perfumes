import Stars from './Stars'
import { useReviews } from '../../hooks/useReviews'
import { useLocale } from '../../i18n/locale-context'
import { RATING_MAX } from '../../lib/reviews'
import { classNames, formatNumber } from '../../lib/format'

/**
 * A fragrance's average rating in one line: stars, "4.6", "3 reviews".
 * Renders nothing until the fragrance has a review — no placeholder stars, no
 * zero. With `onClick` it is a button (the product page scrolls to its
 * reviews); without, plain text.
 */
export default function RatingBadge({ productId, onClick, className }) {
  const { lang, t, tc } = useLocale()
  const { summary } = useReviews(productId)
  if (!summary.count) return null

  const interactive = typeof onClick === 'function'
  const average = formatNumber(summary.overall, lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const count = tc('reviews.count', summary.count)
  const content = (
    <>
      {/* Seen: stars, "4.6 · 3 reviews". Heard: "4.6 out of 5, 3 reviews". */}
      <span aria-hidden="true" className="inline-flex items-baseline gap-2">
        <Stars value={summary.overall} size={12} className="self-center" />
        <span className="t-figure text-[13px] leading-none text-ink-950">{average}</span>
        <span className="text-snow-300">·</span>
        <span
          className={classNames(
            'text-snow-600',
            interactive &&
              'underline decoration-snow-300 underline-offset-4 transition-colors duration-300 group-hover:text-green-600 group-hover:decoration-green-600',
          )}
        >
          {count}
        </span>
      </span>
      <span className="sr-only">
        {t(interactive ? 'reviews.badgeSrLink' : 'reviews.badgeSr', {
          average,
          max: formatNumber(RATING_MAX, lang),
          count,
        })}
      </span>
    </>
  )

  const base = 'inline-flex items-baseline gap-2 font-sans text-[13px] leading-none rtl:font-sans-ar'

  if (!interactive) return <p className={classNames(base, className)}>{content}</p>

  return (
    <button type="button" onClick={onClick} className={classNames(base, 'group py-1 text-start', className)}>
      {content}
    </button>
  )
}
