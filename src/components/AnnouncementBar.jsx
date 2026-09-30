import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'
import { FREE_SHIPPING_KD } from '../context/CartProvider'
import { useLocale } from '../i18n/locale-context'
import { formatPrice } from '../lib/format'

/** Rotating promotional strip, above the header in both scripts. */
export default function AnnouncementBar() {
  const { lang, announce } = useLocale()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % announce.length), 5000)
    return () => clearInterval(timer)
  }, [announce.length])

  const message = (announce[index] ?? '').replace(
    '{threshold}',
    formatPrice(FREE_SHIPPING_KD, lang),
  )

  return (
    <div className="relative overflow-hidden bg-green-600">
      
      <div className="relative mx-auto flex h-10 max-w-[1560px] items-center justify-center px-5 sm:px-9">
        <p key={index} className="ticket flex animate-fade-in items-center gap-2.5 truncate text-snow-50">
          <Truck className="h-3.5 w-3.5 shrink-0 text-gold-300" strokeWidth={1.25} />
          {message}
        </p>
      </div>
    </div>
  )
}
