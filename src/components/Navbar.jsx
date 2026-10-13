import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { FAMILIES } from '../data/taxonomy'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatNumber } from '../lib/format'
import { HEADER_LOGO } from '../brand'
import { Link } from '../router/RouterProvider'
import { CONTACT, HOME, useRouter } from '../router/router-context'

const MOBILE_MENU_ID = 'mobile-menu'

/**
 * Retail header. Layout is expressed in logical properties (ms/me/ps/pe/start)
 * so it mirrors wholesale when the document direction flips to RTL.
 *
 * The family row and "All Perfumes" drive the catalogue: a family starts it
 * afresh on that family, "All Perfumes" clears every filter. Each is a toggle
 * that reads as pressed while it is what the catalogue shows.
 */
export default function Navbar({ query, onQueryChange, families, isFiltered, onSelectFamily, onSubmitSearch }) {
  const { totals, openCart, lastAddedAt } = useCart()
  const { lang, t, tr, toggle } = useLocale()
  const { path } = useRouter()
  // A category is only 'current' while the catalogue is the page you are on.
  const onHome = path === HOME
  const filtered = isFiltered ?? (families.length > 0 || query.trim() !== '')
  const [mobileOpen, setMobileOpen] = useState(false)
  // True for the one frame the menu shuts without its transition.
  const [snapClose, setSnapClose] = useState(false)
  const [pulse, setPulse] = useState(false)
  const inputRef = useRef(null)
  const mobileInputRef = useRef(null)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    if (!lastAddedAt) return undefined
    setPulse(true)
    const timer = setTimeout(() => setPulse(false), 600)
    return () => clearTimeout(timer)
  }, [lastAddedAt])

  // Escape folds the open menu away and hands focus back to its button —
  // unless a dialog is open above it (the cart, a fragrance): that one is the
  // top layer and takes the Escape. Closed dialogs unmount or go inert.
  useEffect(() => {
    if (!mobileOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      const overlayOpen = [...document.querySelectorAll('[aria-modal="true"]')].some(
        (node) => !node.closest('[inert]'),
      )
      if (overlayOpen) return
      setMobileOpen(false)
      menuButtonRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  /**
   * The open menu pushes the page down. Folded away on its transition, it
   * would still be in the flow when the catalogue's position is measured for
   * the scroll, and the shopper would land far past the results. So it shuts
   * at once, committed before `then` runs, and gets its transition back on
   * the next frame.
   */
  const closeThen = (then) => {
    flushSync(() => {
      setSnapClose(true)
      setMobileOpen(false)
    })
    then()
    requestAnimationFrame(() => setSnapClose(false))
  }

  const submit = (event) => {
    event.preventDefault()
    // Put the phone keyboard away and the menu with it, so the shopper lands
    // on the results rather than on the menu covering them.
    inputRef.current?.blur()
    mobileInputRef.current?.blur()
    closeThen(onSubmitSearch)
  }

  const LINKS = [{ label: t('contact'), to: CONTACT }]

  // What the catalogue is showing, for the pressed state of each toggle.
  const allActive = onHome && !filtered
  const familyActive = (id) => onHome && families.includes(id)

  const pickFamily = (id) => closeThen(() => onSelectFamily(id))

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

  const desktopItem = (active) =>
    classNames(
      'nav-link nav-link-label t-label shrink-0 py-3 transition-colors duration-300',
      active ? 'nav-link-active text-green-600' : 'text-snow-600 hover:text-ink-950',
    )

  const mobileItem = (active) =>
    classNames(
      't-label flex items-center justify-between gap-4 border-b border-snow-200 py-4 text-start transition-colors',
      active ? 'text-green-600' : 'text-ink-950',
    )

  // A small seal marks the family the catalogue is on; aria-pressed says it.
  const mark = (active) =>
    active && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-600" />

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
          {/* 16px: anything smaller makes iOS zoom the page when it takes focus. */}
          <input
            id="header-search"
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full border border-snow-300 bg-snow-100 py-2.5 pe-4 ps-11 font-sans text-[16px] font-normal text-ink-950 placeholder:text-snow-600 focus:border-green-600 focus:outline-none focus:ring-0 rtl:font-sans-ar"
          />
        </form>

        <div className="ms-auto flex items-center gap-0.5 md:ms-0">
          <button
            type="button"
            aria-label={t('search')}
            aria-controls={MOBILE_MENU_ID}
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
            onClick={() => {
              // The cart opens over the page, not over a menu left open beneath it.
              setMobileOpen(false)
              openCart()
            }}
            aria-label={`${t('openCart')} — ${formatNumber(totals.count, lang)}`}
            className="relative grid h-10 w-10 place-items-center text-snow-600 transition-colors hover:text-ink-950"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.25} />
            {totals.count > 0 && (
              <span
                className={classNames(
                  'absolute end-0 top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-green-600 px-1 font-sans text-[10px] font-medium leading-none text-snow-50 transition-transform duration-300',
                  pulse && 'scale-125',
                )}
              >
                {formatNumber(totals.count, lang)}
              </span>
            )}
          </button>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_MENU_ID}
            className="grid h-10 w-10 place-items-center text-snow-600 transition-colors hover:text-ink-950 lg:hidden"
          >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px]" strokeWidth={1.25} />
            ) : (
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.25} />
            )}
          </button>
        </div>
      </div>

      <nav aria-label={t('shopByFamily')} className="hidden border-t border-snow-200 lg:block">
        {/* Eight toggles and two links share this row. They sit tight at lg and
            open up from xl; below 1280px the families scroll sideways inside
            their own strip rather than push the language and contact links off. */}
        <div className="mx-auto flex max-w-[1560px] items-center gap-6 px-9 xl:gap-10">
          {/* The 4px of padding, taken back by the negative margin, leaves room
              for the focus ring inside the scrolling strip. */}
          <div className="-m-1 flex min-w-0 flex-1 items-center gap-4 overflow-x-auto whitespace-nowrap p-1 [scrollbar-width:none] xl:gap-8 [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              aria-pressed={allActive}
              onClick={() => onSelectFamily(null)}
              className={desktopItem(allActive)}
            >
              {t('allPerfumes')}
            </button>
            {FAMILIES.map((family) => (
              <button
                key={family.id}
                type="button"
                aria-pressed={familyActive(family.id)}
                onClick={() => onSelectFamily(family.id)}
                className={desktopItem(familyActive(family.id))}
              >
                {tr(family.short)}
              </button>
            ))}
          </div>
          <span className="flex shrink-0 items-center gap-6 xl:gap-9">
            <button type="button" onClick={toggle} lang={lang === 'en' ? 'ar' : 'en'} className={swapClass}>
              {t('switchTo')}
            </button>
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                aria-current={path === link.to ? 'page' : undefined}
                className={desktopItem(path === link.to)}
              >
                {link.label}
              </Link>
            ))}
          </span>
        </div>
      </nav>

      <div
        id={MOBILE_MENU_ID}
        // Folded away it is out of the tab order and the accessibility tree,
        // not merely invisible.
        {...(mobileOpen ? {} : { inert: '', 'aria-hidden': true })}
        className={classNames(
          'border-t border-snow-200 bg-snow-50 lg:hidden',
          snapClose ? 'transition-none' : 'transition-[max-height,opacity] duration-400',
          // Never taller than the screen below the header, scrolling inside if it must.
          mobileOpen
            ? 'max-h-[calc(100dvh-4rem)] overflow-y-auto opacity-100 sm:max-h-[calc(100dvh-4.5rem)]'
            : 'max-h-0 overflow-hidden opacity-0',
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
              enterKeyHint="search"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder={t('searchShort')}
              className="w-full border border-snow-300 bg-snow-100 py-3 pe-4 ps-11 font-sans text-[16px] font-normal text-ink-950 placeholder:text-snow-600 focus:border-green-600 focus:outline-none focus:ring-0 rtl:font-sans-ar"
            />
          </form>

          <nav aria-label={t('shopByFamily')} className="mt-2 flex flex-col">
            <button type="button" aria-pressed={allActive} onClick={() => pickFamily(null)} className={mobileItem(allActive)}>
              {t('allPerfumes')}
              {mark(allActive)}
            </button>
            {FAMILIES.map((family) => (
              <button
                key={family.id}
                type="button"
                aria-pressed={familyActive(family.id)}
                onClick={() => pickFamily(family.id)}
                className={mobileItem(familyActive(family.id))}
              >
                {tr(family.short)}
                {mark(familyActive(family.id))}
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
                aria-current={path === link.to ? 'page' : undefined}
                onNavigate={() => setMobileOpen(false)}
                className={classNames(
                  't-label border-b border-snow-200 py-4 last:border-b-0',
                  path === link.to ? 'text-green-600' : 'text-snow-600',
                )}
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
