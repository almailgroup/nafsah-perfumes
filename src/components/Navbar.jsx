import { useEffect, useRef, useState } from 'react'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { SCENT_FAMILIES } from '../data/products'
import { classNames } from '../lib/format'

const LINKS = [
  { label: 'The House', href: '#house' },
  { label: 'Notes', href: '#notes' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Retail header: wordmark, a real search field, account and cart, with the
 * scent families as a category nav row beneath. Sticky as one block so the
 * categories stay reachable while browsing.
 */
export default function Navbar({ query, onQueryChange, families, onSelectFamily, onSubmitSearch }) {
  const { totals, openCart, lastAddedAt } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pulse, setPulse] = useState(false)
  const inputRef = useRef(null)
  const mobileInputRef = useRef(null)

  useEffect(() => {
    if (!lastAddedAt) return undefined
    setPulse(true)
    const timer = setTimeout(() => setPulse(false), 600)
    return () => clearTimeout(timer)
  }, [lastAddedAt])

  const submit = (event) => {
    event.preventDefault()
    inputRef.current?.blur()
    onSubmitSearch()
  }

  return (
    <header className="sticky top-0 z-40 border-b border-noir-950/[0.12] bg-paper-50">
      <div className="mx-auto flex h-16 max-w-[1560px] items-center gap-4 px-5 sm:h-[72px] sm:gap-8 sm:px-9">
        <a
          href="#top"
          aria-label="Nafsah home"
          className="shrink-0 font-display text-[24px] font-medium leading-none tracking-[0.2em] text-noir-950 sm:text-[28px]"
        >
          NAFSAH
        </a>

        {/* Search is the primary affordance in a retail header */}
        <form onSubmit={submit} role="search" className="relative hidden flex-1 md:block">
          <label htmlFor="header-search" className="sr-only">
            Search the catalogue
          </label>
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-noir-500"
            strokeWidth={1.25}
          />
          <input
            id="header-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by name, note or family…"
            className="w-full border border-noir-950/20 bg-paper-100 py-2.5 pl-11 pr-4 font-sans text-[14px] font-light text-noir-950 placeholder:text-noir-500 focus:border-noir-950 focus:outline-none focus:ring-0"
          />
        </form>

        <div className="ml-auto flex items-center gap-0.5 md:ml-0">
          <span className="ticket mr-3 hidden text-noir-500 lg:inline">EN | ع</span>

          <button
            type="button"
            aria-label="Search the catalogue"
            aria-expanded={mobileOpen}
            onClick={() => {
              setMobileOpen(true)
              setTimeout(() => mobileInputRef.current?.focus({ preventScroll: true }), 220)
            }}
            className="grid h-10 w-10 place-items-center text-noir-600 transition-colors hover:text-noir-950 md:hidden"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            aria-label="Account"
            className="hidden h-10 w-10 place-items-center text-noir-600 transition-colors hover:text-noir-950 sm:grid"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${totals.count} item${totals.count === 1 ? '' : 's'}`}
            className="relative grid h-10 w-10 place-items-center text-noir-800 transition-colors hover:text-noir-950"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.25} />
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
            className="grid h-10 w-10 place-items-center text-noir-800 lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px]" strokeWidth={1.25} />
            ) : (
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.25} />
            )}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden border-t border-noir-950/[0.08] lg:block">
        <div className="mx-auto flex max-w-[1560px] items-center gap-9 px-9">
          <button
            type="button"
            onClick={() => onSelectFamily(null)}
            className={classNames(
              't-label py-3 transition-colors duration-300',
              families.length === 0 ? 'text-oxblood-600' : 'text-noir-600 hover:text-noir-950',
            )}
          >
            All Perfumes
          </button>
          {SCENT_FAMILIES.map((family) => (
            <button
              key={family}
              type="button"
              onClick={() => onSelectFamily(family)}
              className={classNames(
                't-label py-3 transition-colors duration-300',
                families.includes(family)
                  ? 'text-oxblood-600'
                  : 'text-noir-600 hover:text-noir-950',
              )}
            >
              {family}
            </button>
          ))}
          <span className="ml-auto flex items-center gap-9">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="t-label py-3 text-noir-600 transition-colors duration-300 hover:text-noir-950"
              >
                {link.label}
              </a>
            ))}
          </span>
        </div>
      </nav>

      {/* Mobile drawer: search plus the same categories */}
      <div
        className={classNames(
          'overflow-hidden border-t border-noir-950/[0.08] bg-paper-50 transition-[max-height,opacity] duration-400 lg:hidden',
          mobileOpen ? 'max-h-[30rem] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-5 py-4 sm:px-9">
          <form onSubmit={submit} role="search" className="relative md:hidden">
            <label htmlFor="mobile-search" className="sr-only">
              Search the catalogue
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-noir-500"
              strokeWidth={1.25}
            />
            <input
              id="mobile-search"
              ref={mobileInputRef}
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search by name or note…"
              className="w-full border border-noir-950/20 bg-paper-100 py-3 pl-11 pr-4 font-sans text-[14px] font-light text-noir-950 placeholder:text-noir-500 focus:border-noir-950 focus:outline-none"
            />
          </form>

          <nav className="mt-2 flex flex-col">
            <button
              type="button"
              onClick={() => {
                onSelectFamily(null)
                setMobileOpen(false)
              }}
              className="t-label border-b border-noir-950/[0.08] py-4 text-left text-noir-800"
            >
              All Perfumes
            </button>
            {SCENT_FAMILIES.map((family) => (
              <button
                key={family}
                type="button"
                onClick={() => {
                  onSelectFamily(family)
                  setMobileOpen(false)
                }}
                className="t-label border-b border-noir-950/[0.08] py-4 text-left text-noir-800"
              >
                {family}
              </button>
            ))}
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="t-label border-b border-noir-950/[0.08] py-4 text-noir-600 last:border-b-0"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
