import { useEffect, useState } from 'react'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { useScrolled } from '../hooks/useOverlay'
import { classNames } from '../lib/format'

const LINKS = [
  { label: 'Collection', href: '#collection' },
  { label: 'The House', href: '#house' },
  { label: 'Notes', href: '#notes' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ onSearchFocus }) {
  const { totals, openCart, lastAddedAt } = useCart()
  const scrolled = useScrolled(20)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (!lastAddedAt) return undefined
    setPulse(true)
    const timer = setTimeout(() => setPulse(false), 600)
    return () => clearTimeout(timer)
  }, [lastAddedAt])

  return (
    <header
      className={classNames(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-500',
        scrolled ? 'border-b hairline bg-ink-950/90 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-[70px] max-w-[1600px] items-center justify-between gap-6 px-6 sm:h-20 sm:px-10">
        <a href="#top" aria-label="Nafsah home" className="shrink-0">
          <span className="font-display text-[22px] leading-none tracking-[0.3em] text-bone-50 sm:text-2xl">
            NAFSAH
          </span>
        </a>

        <nav className="hidden items-center gap-10 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 text-[10px] font-normal uppercase tracking-wider2 text-bone-300 transition-colors duration-300 hover:text-bone-50"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-bone-100 transition-all duration-400 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onSearchFocus}
            aria-label="Search the collection"
            className="grid h-10 w-10 place-items-center text-bone-300 transition-colors duration-300 hover:text-bone-50"
          >
            <Search className="h-[17px] w-[17px]" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${totals.count} item${totals.count === 1 ? '' : 's'}`}
            className="relative grid h-10 w-10 place-items-center text-bone-200 transition-colors duration-300 hover:text-bone-50"
          >
            <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.25} />
            {totals.count > 0 && (
              <span
                className={classNames(
                  'absolute right-0.5 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-bone-50 px-1 text-[9px] font-medium tabular-nums text-ink-950 transition-transform duration-300',
                  pulse && 'scale-125',
                )}
              >
                {totals.count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="grid h-10 w-10 place-items-center text-bone-200 transition-colors duration-300 lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px]" strokeWidth={1.25} />
            ) : (
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.25} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={classNames(
          'overflow-hidden border-t hairline bg-ink-950/97 backdrop-blur-xl transition-[max-height,opacity] duration-400 lg:hidden',
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="flex flex-col px-6 sm:px-10">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b hairline py-5 text-[10px] font-normal uppercase tracking-wider2 text-bone-200 last:border-b-0 hover:text-bone-50"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
