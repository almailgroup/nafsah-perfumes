import { useId } from 'react'
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react'
import { QuestionList } from './parts'
import { useLocale } from '../../i18n/locale-context'
import { Link } from '../../router/RouterProvider'
import { SCENT_FINDER } from '../../router/router-context'

/**
 * The homepage's way into the Scent Finder, on the deep green band: the
 * promise on one side, the five questions it will ask on the other, so the
 * shopper knows what they are starting before they start it.
 */
export default function FinderTeaser() {
  const { t, isRtl } = useLocale()
  const titleId = useId()
  const Forward = isRtl ? ArrowLeft : ArrowRight

  return (
    <section aria-labelledby={titleId} className="relative overflow-hidden bg-green-700">
      <div aria-hidden="true" className="mashrabiya-band mashrabiya-on-green pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1560px] gap-12 px-5 py-16 sm:px-9 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div>
          <p className="ticket text-gold-300">{t('finder.teaser.eyebrow')}</p>
          <h2 id={titleId} className="t-h2 mt-5 text-snow-50">
            {t('finder.teaser.title')}
          </h2>
          <p className="t-body mt-6 max-w-md text-snow-200">{t('finder.teaser.body')}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link to={SCENT_FINDER} className="btn-paper group">
              {t('finder.teaser.cta')}
              <Forward
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
            <span className="ticket inline-flex items-center gap-2 text-snow-300">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
              {t('finder.teaser.duration')}
            </span>
          </div>
        </div>
        {/* The questions themselves wait for a screen with room for them; a phone gets the promise and the way in. */}
        <QuestionList tone="green" className="hidden md:block" />
      </div>
    </section>
  )
}
