import { BadgeCheck, Headset, RotateCcw, Truck } from 'lucide-react'
import { FREE_SHIPPING_KD } from '../context/CartProvider'
import { formatPrice } from '../lib/format'

const BADGES = [
  {
    icon: Truck,
    title: 'Free express delivery',
    body: `On every order over ${formatPrice(FREE_SHIPPING_KD)} across Kuwait`,
  },
  { icon: BadgeCheck, title: 'Guaranteed authentic', body: 'Bottled and sealed at our Grasse atelier' },
  { icon: RotateCcw, title: '30-day returns', body: 'Unopened flacons, no questions asked' },
  { icon: Headset, title: 'Fragrance consultation', body: 'Speak to the atelier before you buy' },
]

export default function TrustBadges() {
  return (
    <section className="border-y border-noir-950/[0.14] bg-paper-50">
      <div className="mx-auto grid max-w-[1560px] grid-cols-2 gap-px px-5 sm:px-9 lg:grid-cols-4">
        {BADGES.map(({ icon: Icon, title, body }, index) => (
          <div
            key={title}
            className={[
              'flex items-start gap-3.5 py-7 sm:gap-4 sm:py-9',
              index % 2 === 1 ? 'border-l border-noir-950/[0.1] pl-4 sm:pl-6' : '',
              index >= 2 ? 'border-t border-noir-950/[0.1] lg:border-t-0' : '',
              index === 2 ? 'lg:border-l lg:pl-6' : '',
              index === 3 ? 'lg:pl-6' : '',
            ].join(' ')}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-oxblood-600" strokeWidth={1.25} />
            <div className="min-w-0">
              <h3 className="font-display text-[1.25rem] font-medium leading-tight text-noir-950">
                {title}
              </h3>
              <p className="mt-1.5 font-sans text-[12px] font-light leading-relaxed text-noir-600">
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
