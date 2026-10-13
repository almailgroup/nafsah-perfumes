import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown, PenLine } from 'lucide-react'
import RatingMeter from './RatingMeter'
import ReviewForm from './ReviewForm'
import Stars from './Stars'
import { useReviews } from '../../hooks/useReviews'
import { useLocale } from '../../i18n/locale-context'
import { RATING_MAX } from '../../lib/reviews'
import { classNames, formatDate, formatNumber } from '../../lib/format'

// The three dimensions beyond the overall verdict, as meters and per review.
const DIMENSIONS = ['longevityHeat', 'sillage', 'compliment']
// Reviews shown before "Show all".
const FIRST_PAGE = 3
const ARABIC_LETTER = /[\u0600-\u06FF]/
// Room left above the form for the toggle that opened it.
const REVEAL_OFFSET = 96

/**
 * Scroll `node` up to near the top of whatever scrolls it — the product
 * page's own column, or the window — when it opened low down. Only that one
 * scroller moves: scrollIntoView would also shift the clipped overlay panel
 * and the fixed layer around it.
 */
function revealBelow(node) {
  let scroller = node.parentElement
  while (scroller && scroller !== document.body) {
    const { overflowY } = getComputedStyle(scroller)
    if ((overflowY === 'auto' || overflowY === 'scroll') && scroller.scrollHeight > scroller.clientHeight) break
    scroller = scroller.parentElement
  }
  const behavior = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  const inWindow = !scroller || scroller === document.body
  const frameTop = inWindow ? 0 : scroller.getBoundingClientRect().top
  const frameHeight = inWindow ? window.innerHeight : scroller.clientHeight
  const offset = node.getBoundingClientRect().top - frameTop
  // Already in the upper part of the view: leave the page where it is.
  if (offset < frameHeight * 0.55) return
  const by = offset - REVEAL_OFFSET
  if (inWindow) window.scrollBy({ top: by, behavior })
  else scroller.scrollBy({ top: by, behavior })
}

/**
 * A fragrance's reviews: the average (stars and "4.6 out of 5"), the three
 * Gulf-specific dimensions as meters, then the reviews themselves, newest
 * first, and a form to write one. Real submissions only — nothing is seeded,
 * and until the house has a review service each one is marked as saved in
 * this browser only, not sent to the house.
 *
 * Renders <section id="reviews"> so a rating badge can scroll to it.
 */
export default function ReviewsSection({ product, id = 'reviews' }) {
  const { lang, t, tc, tr } = useLocale()
  const { reviews, summary, add } = useReviews(product?.id)
  const uid = useId()
  const [open, setOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const formRef = useRef(null)

  // Opening the form brings it up the page; the toggle stays in sight above it.
  useEffect(() => {
    if (open && formRef.current) revealBelow(formRef.current)
  }, [open])

  if (!product) return null

  const name = tr(product.name)
  const max = formatNumber(RATING_MAX, lang)
  const one = (value) => formatNumber(value, lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const shown = expanded ? reviews : reviews.slice(0, FIRST_PAGE)

  const closeForm = () => {
    setOpen(false)
    // A fresh, empty form next time rather than the thank-you note.
    setFormKey((n) => n + 1)
  }

  return (
    <section id={id} aria-labelledby={`${uid}-title`} className="scroll-mt-8">
      <h3 id={`${uid}-title`} className="ticket text-green-600">
        {t('reviews.title')}
      </h3>
      <p className="t-body mt-3 max-w-[36rem] text-snow-600">{t('reviews.lede')}</p>

      {summary.count > 0 ? (
        <div className="mt-7 grid gap-8 border-y border-snow-200 py-7 sm:grid-cols-[minmax(9rem,auto)_minmax(0,1fr)] sm:gap-12">
          <div>
            <p className="flex items-baseline gap-2">
              <span className="t-figure text-[2.6rem] font-normal leading-none text-ink-950">
                {one(summary.overall)}
              </span>
              <span className="font-sans text-[14px] text-snow-600 rtl:font-sans-ar">
                {t('reviews.outOf', { max })}
              </span>
            </p>
            <Stars value={summary.overall} size={15} className="mt-3" />
            <p className="mt-2.5 font-sans text-[13px] text-snow-600 rtl:font-sans-ar">
              {tc('reviews.count', summary.count)}
            </p>
          </div>
          <div className="grid content-start gap-6">
            {DIMENSIONS.map((key) => (
              <RatingMeter key={key} label={t(`reviews.dim.${key}`)} value={summary[key]} />
            ))}
          </div>
        </div>
      ) : (
        <p className="t-body mt-7 border-y border-snow-200 py-6 text-ink-950">{t('reviews.empty', { name })}</p>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${uid}-form`}
        onClick={() => (open ? closeForm() : setOpen(true))}
        className="btn-outline mt-6 px-6"
      >
        <PenLine aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
        {t('reviews.write')}
        <ChevronDown
          aria-hidden="true"
          className={classNames('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')}
          strokeWidth={1.5}
        />
      </button>

      <div id={`${uid}-form`} ref={formRef} hidden={!open} className="mt-5">
        {open && <ReviewForm key={formKey} productName={name} add={add} onDone={closeForm} />}
      </div>

      {reviews.length > 0 && (
        <>
          <ol aria-label={t('reviews.listLabel', { name })} className="mt-8 border-t border-snow-200">
            {shown.map((review) => (
              <li key={review.id} className="border-b border-snow-200 py-6">
                <ReviewItem review={review} />
              </li>
            ))}
          </ol>
          {reviews.length > FIRST_PAGE && (
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setExpanded((value) => !value)}
              className="ticket mt-5 text-green-600 underline underline-offset-4 transition-colors hover:text-ink-950"
            >
              {expanded ? t('reviews.showFewer') : tc('reviews.showAll', reviews.length)}
            </button>
          )}
          <p className="mt-5 font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">{t('reviews.local')}</p>
        </>
      )}
    </section>
  )
}

/** One review: who and when, the overall stars, their words, the three dimensions. */
function ReviewItem({ review }) {
  const { lang, t } = useLocale()
  const max = formatNumber(RATING_MAX, lang)
  const date = formatDate(review.createdAt, lang)
  const score = (value) => (
    <>
      <span aria-hidden="true">{t('reviews.score', { value: formatNumber(value, lang), max })}</span>
      <span className="sr-only">
        {formatNumber(value, lang)} {t('reviews.outOf', { max })}
      </span>
    </>
  )

  return (
    <article>
      <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h4 className="min-w-0 font-sans text-[15px] font-medium text-ink-950 rtl:font-sans-ar">
          <bdi>{review.name}</bdi>
          {review.area && (
            <span className="font-normal text-snow-600">
              {' · '}
              <bdi>{review.area}</bdi>
            </span>
          )}
        </h4>
        <p className="ticket shrink-0 text-snow-600">
          <time dateTime={review.createdAt}>{date}</time>
        </p>
      </header>

      <p className="mt-2 flex items-center gap-2.5 font-sans text-[13px] text-ink-950 rtl:font-sans-ar">
        <Stars value={review.ratings.overall} size={13} />
        <span className="sr-only">{t('reviews.dim.overall')}: </span>
        <span className="t-figure text-[13px]">{score(review.ratings.overall)}</span>
      </p>

      <p
        dir="auto"
        className={classNames(
          't-body mt-3 whitespace-pre-line break-words text-[15px]',
          ARABIC_LETTER.test(review.body) && 'font-sans-ar',
        )}
      >
        {review.body}
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-x-4 gap-y-3">
        {DIMENSIONS.map((key) => (
          <div key={key} className="min-w-0">
            <dt className="font-sans text-[12px] leading-snug text-snow-600 rtl:font-sans-ar">
              {t(`reviews.dimShort.${key}`)}
            </dt>
            <dd className="mt-1.5 flex items-center gap-2">
              <span aria-hidden="true" className="flex gap-[2px]">
                {Array.from({ length: RATING_MAX }, (_, i) => (
                  <span
                    key={i}
                    className={classNames('h-1.5 w-2.5', i < review.ratings[key] ? 'bg-green-600' : 'bg-green-600/10')}
                  />
                ))}
              </span>
              <span className="t-figure text-[12px] text-ink-950">{score(review.ratings[key])}</span>
            </dd>
          </div>
        ))}
      </dl>

      <p className="ticket mt-4 text-snow-600">{t('reviews.pending')}</p>
    </article>
  )
}
