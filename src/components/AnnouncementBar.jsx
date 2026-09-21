import { useEffect, useState } from 'react'
import { Truck } from 'lucide-react'
import { FREE_SHIPPING_KD } from '../context/CartProvider'
import { formatPrice } from '../lib/format'

const MESSAGES = [
  `Complimentary express shipping over ${formatPrice(FREE_SHIPPING_KD)}`,
  'Free 2ml samples with every order',
  'Authentic extraits — bottled in Grasse, shipped from Kuwait',
]

/** Rotating promotional strip above the header. */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-noir-950 text-paper-100">
      <div className="mx-auto flex h-9 max-w-[1560px] items-center justify-center gap-2.5 px-5 sm:px-9">
        <Truck className="h-3.5 w-3.5 shrink-0 text-oxblood-300" strokeWidth={1.25} />
        <p key={index} className="ticket animate-fade-in truncate text-paper-200">
          {MESSAGES[index]}
        </p>
      </div>
    </div>
  )
}
