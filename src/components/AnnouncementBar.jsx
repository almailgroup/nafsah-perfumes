import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'
import { FREE_SHIPPING_KD } from '../context/CartProvider'
import { useLocale } from '../i18n/locale-context'
import { formatPrice } from '../lib/format'

/** Rotating promotional strip, above the header in both scripts. */
export default function AnnouncementBar() {
  const { lang, announce, t, toggle } = useLocale()
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
    <div className="relative overflow-hidden bg-midnight-900">
      <div aria-hidden="true" className="mashrabiya-band pointer-events-none absolute inset-0" />
      <div className="relative mx-auto flex h-10 max-w-[1560px] items-center justify-between gap-4 px-5 sm:px-9">
        <span className="hidden sm:block sm:w-24" />
        <p key={index} className="ticket flex animate-fade-in items-center gap-2.5 truncate text-pearl-200">
          <Truck className="h-3.5 w-3.5 shrink-0 text-saffron-300" strokeWidth={1.25} />
          {message}
        </p>
        <button
          type="button"
          onClick={toggle}
          lang={lang === 'en' ? 'ar' : 'en'}
          className="ticket shrink-0 border border-pearl-50/25 px-3 py-1 text-pearl-100 transition-colors duration-300 hover:border-jade-400 hover:text-jade-200 sm:w-24"
        >
          {t('switchTo')}
        </button>
      </div>
    </div>
  )
}
