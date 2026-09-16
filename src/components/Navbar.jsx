import { useEffect, useState } from 'react'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { useScrolled } from '../hooks/useOverlay'
import { classNames } from '../lib/format'

const LINKS = [
  { label: 'Catalogue', href: '#collection' },
  { label: 'The House', href: '#house' },
  { label: 'Notes', href: '#notes' },
  { label: 'Contact', href: '#contact' },
]

/**
 * The bar sits over the noir hero at rest and inverts to paper once the
 * catalogue scrolls under it.
 */
export default function Navbar({ onSearchFocus }) {
  const { totals, openCart, lastAddedAt } = useCart()
  const scrolled = useScrolled(120)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (!lastAddedAt) return undefined
    setPulse(true)
    const timer = setTimeout(() => setPulse(false), 600)
    return () => clearTimeout(timer)
  }, [lastAddedAt])

  const onPaper = scrolled

  return (
    <header
      className={classNames(
        'fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500',
        onPaper ? 'border-noir-950/12 bg-paper-50/95 backdrop-blur-md' : 'border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1560px] items-center justify-between gap-6 px-5 sm:h-[76px] sm:px-9">
        <a
          href="#top"
          aria-label="Nafsah home"
          className={classNames(
            'shrink-0 font-display text-[26px] font-medium leading-none tracking-[0.2em] transition-colors duration-500 sm:text-[28px]',
            onPaper ? 'text-noir-950' : 'text-paper-50',
          )}
        >
          NAFSAH
        </a>

        <nav className="hidden items-center gap-10 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={classNames(
                'group relative t-label py-1 transition-colors duration-300',
                onPaper ? 'text-noir-600 hover:text-noir-950' : 'text-paper-400 hover:text-paper-50',
              )}
            >
              {link.label}
              <span
                className={classNames(
                  'absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-400 group-hover:w-full',
                  onPaper ? 'bg-noir-950' : 'bg-paper-50',
                )}
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onSearchFocus}
            aria-label="Search the catalogue"
            className={classNames(
              'grid h-10 w-10 place-items-center transition-colors duration-300',
              onPaper ? 'text-noir-600 hover:text-noir-950' : 'text-paper-400 hover:text-paper-50',
            )}
          >
            <Search className="h-[17px] w-[17px]" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${totals.count} item${totals.count === 1 ? '' : 's'}`}
            className={classNames(
              'relative grid h-10 w-10 place-items-center transition-colors duration-300',
              onPaper ? 'text-noir-800 hover:text-noir-950' : 'text-paper-200 hover:text-paper-50',
            )}
          >
            <ShoppingBag className="h-[17px] w-[17px]" strokeWidth={1.25} />
            {totals.count > 0 && (
              <span
                className={classNames(
                  'ticket absolute right-0 top-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-oxblood-600 px-1 text-[9px] leading-none text-paper-50 transition-transform duration-300',
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
            className={classNames(
              'grid h-10 w-10 place-items-center transition-colors duration-300 lg:hidden',
              onPaper ? 'text-noir-800' : 'text-paper-200',
            )}
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
          'overflow-hidden border-t border-noir-950/12 bg-paper-50 transition-[max-height,opacity] duration-400 lg:hidden',
          mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="flex flex-col px-5 sm:px-9">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="t-label border-b border-noir-950/10 py-5 text-noir-800 last:border-b-0"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
