import { useId, useState } from 'react'
import { BadgeCheck, Clock, Headset, TestTube } from 'lucide-react'
import { TryFirstModal } from './trust/TryFirst'
import { FORMATS } from '../data/taxonomy'
import { useLocale } from '../i18n/locale-context'
import { deliveryVars } from '../lib/delivery'
import { classNames, formatMl } from '../lib/format'

const VIAL_ML = FORMATS.find((format) => format.kind === 'sample')?.ml ?? 2

// Same-day delivery and Try First are the house's own promises (trust.*); the
// authenticity and consultation lines are core copy.
const BADGES = [
  { id: 'same-day', icon: Clock, title: 'trust.badges.sameDay', body: 'trust.badges.sameDayBody' },
  { id: 'authentic', icon: BadgeCheck, title: 'trustAuthentic', body: 'trustAuthenticBody' },
  { id: 'try-first', icon: TestTube, title: 'trust.tryFirst', body: 'trust.badges.tryFirstBody', opensTryFirst: true },
  { id: 'advice', icon: Headset, title: 'trustAdvice', body: 'trustAdviceBody' },
]

/**
 * The house's promises on the green band: same-day delivery before the
 * cut-off, Try First (its tile opens the full terms), authenticity and a
 * perfumer to ask. A visually hidden h2 keeps the badge titles out from under
 * the previous section's heading.
 */
export default function TrustBadges() {
  const { lang, t } = useLocale()
  const headingId = useId()
  const [tryFirstOpen, setTryFirstOpen] = useState(false)
  const vars = { ...deliveryVars(lang), vial: formatMl(VIAL_ML, lang) }

  return (
    <section aria-labelledby={headingId} className="relative overflow-hidden bg-green-600">
      <h2 id={headingId} className="sr-only">
        {t('trust.badges.heading')}
      </h2>
      <div aria-hidden="true" className="mashrabiya-band mashrabiya-on-green pointer-events-none absolute inset-0" />
      <ul className="relative mx-auto grid max-w-[1560px] grid-cols-1 px-5 min-[480px]:grid-cols-2 sm:px-9 lg:grid-cols-4">
        {BADGES.map(({ id, icon: Icon, title, body, opensTryFirst }, index) => (
          <li
            key={id}
            className={classNames(
              'flex items-start gap-3.5 py-7 sm:gap-4 sm:py-9',
              // One column below 480px, a 2×2 grid to lg, then one row; a
              // hairline between neighbours in each.
              index > 0 && 'border-t border-snow-50/25',
              index === 1 && 'min-[480px]:border-t-0',
              index >= 2 && 'lg:border-t-0',
              index % 2 === 1 && 'min-[480px]:border-s min-[480px]:ps-5 sm:ps-6',
              index % 2 === 0 && 'min-[480px]:pe-5 sm:pe-6',
              index === 2 && 'lg:border-s lg:ps-6',
              index === 1 && 'lg:pe-6',
            )}
          >
            <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" strokeWidth={1.25} />
            <div className="min-w-0">
              <h3 className="t-title text-[1.2rem] text-snow-50">{t(title)}</h3>
              <p className="t-body mt-1.5 text-[14px] text-snow-200">{t(body, vars)}</p>
              {opensTryFirst && (
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={() => setTryFirstOpen(true)}
                  className="ticket mt-3 text-snow-50 underline decoration-gold-300 underline-offset-4 transition-colors duration-300 hover:decoration-snow-50"
                >
                  {t('trust.howItWorks')}
                  <span className="sr-only"> — {t('trust.tryFirst')}</span>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
      <TryFirstModal open={tryFirstOpen} onClose={() => setTryFirstOpen(false)} />
    </section>
  )
}
