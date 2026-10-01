import { useEffect, useRef, useState } from 'react'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { SCENT_FAMILIES, FAMILY_AR } from '../data/products'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatNumber } from '../lib/format'
import { HEADER_LOGO } from '../brand'
import { Link } from '../router/RouterProvider'
import { CONTACT, HOME, useRouter } from '../router/router-context'

/**
 * Retail header. Layout is expressed in logical properties (ms/me/ps/pe/start)
 * so it mirrors wholesale when the document direction flips to RTL.
 */
export default function Navbar({ query, onQueryChange, families, onSelectFamily, onSubmitSearch }) {
  const { totals, openCart, lastAddedAt } = useCart()
  const { lang, t, pick, toggle } = useLocale()
  const { path } = useRouter()
  // A category is only 'current' while the catalogue is the page you are on.
  const onHome = path === HOME
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

  const LINKS = [{ label: t('contact'), to: CONTACT }]

  /**
   * The switcher always names the language you are moving TO, so its label is
   * in the script the page is not currently in. That inverts every type
   * decision the surrounding row makes: face, size, casing and tracking all
   * have to follow the label's script, not the document's.
   */
  const swapClass = classNames(
    'nav-link nav-link-swap py-3 text-snow-600 transition-colors duration-300 hover:text-ink-950',
    lang === 'en'
      // Arabic inside an LTR page. 0.16em tracking would pull joined
      // letterforms apart, and 11px is too small for this script.
      ? 'font-sans-ar text-[13px] normal-case tracking-normal'
      : 'font-sans text-[11px] font-medium uppercase tracking-wide2',
  )

  return (
    <header className="sticky top-0 z-40 border-b border-gold-500/40 bg-snow-50">
      <div className="mx-auto flex h-16 max-w-[1560px] items-center gap-4 px-5 sm:h-[72px] sm:gap-8 sm:px-9">
        {/* Whichever logo src/brand.js marks active. width and height are the
            file's intrinsic size, so the browser reserves the space before it
            loads and nothing in the header shifts. */}
        <Link to={HOME} className="shrink-0 leading-none">
          <img
            src={HEADER_LOGO.src}
            alt={t('brand')}
            width={HEADER_LOGO.width}
            height={HEADER_LOGO.height}
            className={classNames('block w-auto', HEADER_LOGO.className)}
          />
        </Link>

        <form onSubmit={submit} role="search" className="relative hidden flex-1 md:block">
          <label htmlFor="header-search" className="sr-only">
            {t('search')}
          </label>
          <Search
            className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-snow-600"
            strokeWidth={1.25}
          />
          <input
            id="header-search"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full border border-snow-300 bg-snow-100 py-2.5 pe-4 ps-11 font-sans text-[15px] font-normal text-ink-950 placeholder:text-snow-600 focus:border-green-600 focus:outline-none focus:ring-0 rtl:font-sans-ar"
          />
        </form>

        <div className="ms-auto flex items-center gap-0.5 md:ms-0">
          <button
            type="button"
            aria-label={t('search')}
            onClick={() => {
              setMobileOpen(true)
              setTimeout(() => mobileInputRef.current?.focus({ preventScroll: true }), 220)
            }}
            className="grid h-10 w-10 place-items-center text-snow-600 transition-colors hover:text-ink-950 md:hidden"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            aria-label={t('account')}
            className="hidden h-10 w-10 place-items-center text-snow-600 transition-colors hover:text-ink-950 sm:grid"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={1.25} />
          </button>

          <button
            type="button"
            onClick={openCart}
            aria-label={`${t('openCart')} — ${formatNumber(totals.count, lang)}`}
            className="relative grid h-10 w-10 place-items-center text-snow-600 transition-colors hover:text-ink-950"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.25} />
            {totals.count > 0 && (
              <span
                className={classNames(
                  'absolute end-0 top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-green-600 text-snow-50 px-1 font-sans text-[10px] font-medium leading-none text-ink-950 transition-transform duration-300',
                  pulse && 'scale-125',
                )}
              >
                {formatNumber(totals.count, lang)}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={mobileOpen}
            className="grid h-10 w-10 place-items-center text-snow-600 lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px]" strokeWidth={1.25} />
            ) : (
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.25} />
            )}
          </button>
        </div>
      </div>

      <nav className="hidden border-t border-snow-200 lg:block">
        <div className="mx-auto flex max-w-[1560px] items-center gap-9 px-9">
          <button
            type="button"
            onClick={() => onSelectFamily(null)}
            className={classNames(
              'nav-link nav-link-label t-label py-3 transition-colors duration-300',
              onHome && families.length === 0
                ? 'nav-link-active text-green-600'
                : 'text-snow-600 hover:text-ink-950',
            )}
          >
            {t('allPerfumes')}
          </button>
          {SCENT_FAMILIES.map((family) => (
            <button
              key={family}
              type="button"
              onClick={() => onSelectFamily(family)}
              className={classNames(
                'nav-link nav-link-label t-label py-3 transition-colors duration-300',
                onHome && families.includes(family)
                  ? 'nav-link-active text-green-600'
                  : 'text-snow-600 hover:text-ink-950',
              )}
            >
              {pick(family, FAMILY_AR[family])}
            </button>
          ))}
          <span className="ms-auto flex items-center gap-9">
            <button type="button" onClick={toggle} lang={lang === 'en' ? 'ar' : 'en'} className={swapClass}>
              {t('switchTo')}
            </button>
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={path === link.to ? 'page' : undefined}
                className={classNames(
                  'nav-link nav-link-label t-label py-3 transition-colors duration-300',
                  path === link.to
                    ? 'nav-link-active text-green-600'
                    : 'text-snow-600 hover:text-ink-950',
                )}
              >
                {link.label}
              </Link>
            ))}
          </span>
        </div>
      </nav>

      <div
        className={classNames(
          'overflow-hidden border-t border-snow-200 bg-snow-50 transition-[max-height,opacity] duration-400 lg:hidden',
          mobileOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <div className="px-5 py-4 sm:px-9">
          <form onSubmit={submit} role="search" className="relative md:hidden">
            <label htmlFor="mobile-search" className="sr-only">
              {t('search')}
            </label>
            <Search
              className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-snow-600"
              strokeWidth={1.25}
            />
            <input
              id="mobile-search"
              ref={mobileInputRef}
              type="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={t('searchShort')}
              className="w-full border border-snow-300 bg-snow-100 py-3 pe-4 ps-11 font-sans text-[15px] font-normal text-ink-950 placeholder:text-snow-600 focus:border-green-600 focus:outline-none rtl:font-sans-ar"
            />
          </form>

          <nav className="mt-2 flex flex-col">
            <button
              type="button"
              onClick={() => {
                onSelectFamily(null)
                setMobileOpen(false)
              }}
              className="t-label border-b border-snow-200 py-4 text-start text-ink-950"
            >
              {t('allPerfumes')}
            </button>
            {SCENT_FAMILIES.map((family) => (
              <button
                key={family}
                type="button"
                onClick={() => {
                  onSelectFamily(family)
                  setMobileOpen(false)
                }}
                className="t-label border-b border-snow-200 py-4 text-start text-ink-950"
              >
                {pick(family, FAMILY_AR[family])}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                toggle()
                setMobileOpen(false)
              }}
              lang={lang === 'en' ? 'ar' : 'en'}
              className={classNames(
                'border-b border-snow-200 py-4 text-start text-ink-950',
                lang === 'en'
                  ? 'font-sans-ar text-[15px] normal-case tracking-normal'
                  : 'font-sans text-[11px] font-medium uppercase tracking-wide2',
              )}
            >
              {t('switchTo')}
            </button>
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onNavigate={() => setMobileOpen(false)}
                className="t-label border-b border-snow-200 py-4 text-snow-600 last:border-b-0"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
