import { BadgeCheck, Headset, RotateCcw, Truck } from 'lucide-react'
import { FREE_SHIPPING_KD } from '../context/CartProvider'
import { useLocale } from '../i18n/locale-context'
import { formatPrice } from '../lib/format'

const BADGES = [
  { icon: Truck, title: 'trustDelivery', body: 'trustDeliveryBody' },
  { icon: BadgeCheck, title: 'trustAuthentic', body: 'trustAuthenticBody' },
  { icon: RotateCcw, title: 'trustReturns', body: 'trustReturnsBody' },
  { icon: Headset, title: 'trustAdvice', body: 'trustAdviceBody' },
]

export default function TrustBadges() {
  const { lang, t } = useLocale()
  const threshold = formatPrice(FREE_SHIPPING_KD, lang)

  return (
    <section className="relative overflow-hidden bg-green-600">
      <div aria-hidden="true" className="mashrabiya-band mashrabiya-on-green pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1560px] grid-cols-2 px-5 sm:px-9 lg:grid-cols-4">
        {BADGES.map(({ icon: Icon, title, body }, index) => (
          <div
            key={title}
            className={[
              'flex items-start gap-3.5 py-7 sm:gap-4 sm:py-9',
              index % 2 === 1 ? 'border-s border-snow-50/25 ps-4 sm:ps-6' : '',
              index >= 2 ? 'border-t border-snow-50/25 lg:border-t-0' : '',
              index === 2 ? 'lg:border-s lg:border-snow-50/25 lg:ps-6' : '',
              index === 3 ? 'lg:ps-6' : '',
            ].join(' ')}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-300" strokeWidth={1.25} />
            <div className="min-w-0">
              <h3 className="t-title text-[1.2rem] text-snow-50">{t(title)}</h3>
              <p className="t-body mt-1.5 text-[14px] text-snow-200">{t(body, { threshold })}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
