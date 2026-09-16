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
        'fixed inset-x-0 top-0 z-40 transition-all duration-500',
        scrolled
          ? 'border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
        <a href="#top" className="group flex items-center gap-3" aria-label="Nafsah home">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-400/40 transition-colors duration-300 group-hover:border-gold-400">
            <span className="font-display text-lg leading-none text-gold-300">N</span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-[0.18em] text-cream-50 sm:text-2xl">
              NAFSAH
            </span>
            <span className="mt-1 hidden text-[9px] uppercase tracking-luxe text-cream-400 sm:block">
              Maison de Parfum
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-[11px] font-medium uppercase tracking-wider2 text-cream-300 transition-colors duration-300 hover:text-cream-50"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onSearchFocus}
            aria-label="Search the collection"
            className="grid h-10 w-10 place-items-center rounded-full text-cream-300 transition-colors duration-300 hover:bg-white/5 hover:text-gold-300"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${totals.count} item${totals.count === 1 ? '' : 's'}`}
            className="relative grid h-10 w-10 place-items-center rounded-full text-cream-200 transition-colors duration-300 hover:bg-white/5 hover:text-gold-300"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {totals.count > 0 && (
              <span
                className={classNames(
                  'absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-gold-400 px-1 text-[10px] font-semibold text-ink-950 transition-transform duration-300',
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
            className="grid h-10 w-10 place-items-center rounded-full text-cream-200 transition-colors duration-300 hover:bg-white/5 lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={classNames(
          'overflow-hidden border-t border-white/[0.07] bg-ink-950/95 backdrop-blur-xl transition-[max-height,opacity] duration-400 lg:hidden',
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="flex flex-col px-5 py-2 sm:px-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-white/[0.05] py-4 text-[11px] font-medium uppercase tracking-wider2 text-cream-200 last:border-b-0 hover:text-gold-300"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
