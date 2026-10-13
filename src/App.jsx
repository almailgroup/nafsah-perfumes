import { useCallback, useEffect, useRef, useState } from 'react'
import ROUTE_META from 'virtual:route-meta'
import AnnouncementBar from './components/AnnouncementBar'
import CartDrawer from './components/CartDrawer'
import CategoryTiles from './components/CategoryTiles'
import CheckoutModal from './components/CheckoutModal'
import Collection from './components/Collection'
import ContactPage from './components/ContactPage'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import DocumentPage from './components/DocumentPage'
import FaqPage from './components/FaqPage'
import FinderTeaser from './components/finder/FinderTeaser'
import ScentFinderPage from './components/finder/ScentFinderPage'
import Navbar from './components/Navbar'
import NotesGuide from './components/NotesGuide'
import ProductModal from './components/ProductModal'
import ProductRow from './components/ProductRow'
import Story from './components/Story'
import TrustBadges from './components/TrustBadges'
import { CartProvider } from './context/CartProvider'
import { LocaleProvider } from './i18n/LocaleProvider'
import { useLocale } from './i18n/locale-context'
import { LEGAL, LEGAL_NOTE } from './data/legal'
import { SHIPPING_DOC } from './data/help'
import { PRODUCTS } from './data/products'
import { useCatalogue } from './hooks/useCatalogue'
import { RouterProvider } from './router/RouterProvider'
import {
  CONTACT,
  FAQ,
  HOME,
  PRIVACY,
  SCENT_FINDER,
  SHIPPING,
  TERMS,
  TITLE_KEY,
  useRouter,
} from './router/router-context'

// The rows show only what carries the flag: with no real sales or review
// data, topping a "Bestsellers" row up with unflagged fragrances would
// present a guess as a fact.
const BESTSELLERS = PRODUCTS.filter((p) => p.bestseller)

// Newest first; the sort is stable, so a year's releases keep catalogue order.
const NEW_ARRIVALS = PRODUCTS.filter((p) => p.isNew).sort((a, b) => b.year - a.year)

function Storefront({ catalogue, searchRef, onSelectFamily, onViewAll, onOpenProduct }) {
  const { t } = useLocale()
  return (
    <main id="main">
      <HeroSlider onShopNow={() => onViewAll(null)} />
      <CategoryTiles onSelectFamily={onSelectFamily} />
      <FinderTeaser />
      <ProductRow
        id="bestsellers"
        title={t('bestsellers')}
        caption={t('bestsellersCaption')}
        products={BESTSELLERS}
        onViewAll={() => onViewAll('featured')}
        onOpenProduct={onOpenProduct}
        tone="tint"
      />
      <ProductRow
        id="new-arrivals"
        title={t('newArrivals')}
        caption={t('newArrivalsCaption')}
        products={NEW_ARRIVALS}
        onViewAll={() => onViewAll('newest')}
        onOpenProduct={onOpenProduct}
      />
      <TrustBadges />
      <Collection catalogue={catalogue} searchRef={searchRef} onOpenProduct={onOpenProduct} />
      <Story />
      <NotesGuide />
    </main>
  )
}

/**
 * The skip link. It moves focus as well as the view — to the catalogue on the
 * homepage, to <main id="main"> everywhere else — so the next Tab continues
 * from there, in either direction of reading.
 */
function SkipLink({ onHome }) {
  const { t } = useLocale()
  const target = onHome ? 'collection' : 'main'
  const skip = (event) => {
    const element = document.getElementById(target) ?? document.querySelector('main')
    if (!element) return
    event.preventDefault()
    if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1')
    element.focus({ preventScroll: true })
    element.scrollIntoView({ block: 'start' })
  }
  return (
    <a
      href={`#${target}`}
      onClick={skip}
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[70] focus:bg-green-600 focus:px-6 focus:py-3 focus:font-sans focus:text-[10px] focus:uppercase focus:tracking-label focus:text-snow-50 rtl:focus:font-sans-ar rtl:focus:text-[13px] rtl:focus:normal-case rtl:focus:tracking-normal"
    >
      {t(onHome ? 'skipToCatalogue' : 'skipToContent')}
    </a>
  )
}

/**
 * Everything outside <main> is shared by every page, so the header, footer and
 * the three overlays live here and only the page body swaps. The cart and the
 * catalogue filters survive navigation because they never unmount.
 */
function Shell() {
  const { t } = useLocale()
  const { path, key, navigate } = useRouter()
  const catalogue = useCatalogue()
  const { selectFamily: focusFamily, reset, setSort, applyFilters } = catalogue
  const searchRef = useRef(null)
  const [openProduct, setOpenProduct] = useState(null)
  // Holds a section id when a jump fires from another page: the storefront is
  // not mounted yet, so the scroll has to wait for it.
  const pendingScroll = useRef(null)

  const onHome = path === HOME

  // The tab title follows the language; the description follows the page, and
  // is the same text its own HTML entry serves to a direct hit.
  useEffect(() => {
    document.title = t(TITLE_KEY[path] ?? 'titleHome')
  }, [path, t])

  useEffect(() => {
    const description = ROUTE_META[path]?.description
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [path])

  const goToSection = useCallback(
    (id) => {
      if (onHome) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
      pendingScroll.current = id
      navigate(HOME, { scroll: false })
    },
    [onHome, navigate],
  )

  const goToCatalogue = useCallback(() => goToSection('collection'), [goToSection])

  useEffect(() => {
    if (!onHome || !pendingScroll.current) return
    const id = pendingScroll.current
    pendingScroll.current = null
    // One frame for the storefront to mount and the section to exist.
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    )
    return () => cancelAnimationFrame(frame)
  }, [onHome])

  // Category tiles and the nav both focus one family, then drop the shopper
  // into the catalogue already filtered — from any page.
  const selectFamily = useCallback(
    (family) => {
      focusFamily(family)
      goToCatalogue()
    },
    [focusFamily, goToCatalogue],
  )

  const viewAll = useCallback(
    (predicate) => {
      reset()
      if (predicate) setSort(predicate)
      goToCatalogue()
    },
    [reset, setSort, goToCatalogue],
  )

  // The Scent Finder's "see all matches": the catalogue on the families its
  // answers point at, and nothing else.
  const seeFinderMatches = useCallback(
    (families) => {
      applyFilters({ families })
      goToCatalogue()
    },
    [applyFilters, goToCatalogue],
  )

  return (
    <CartProvider>
      <SkipLink onHome={onHome} />

      <AnnouncementBar />
      <Navbar
        query={catalogue.query}
        onQueryChange={catalogue.setQuery}
        families={catalogue.families}
        onSelectFamily={selectFamily}
        onSubmitSearch={goToCatalogue}
      />

      {path === CONTACT && <ContactPage />}
      {path === PRIVACY && <DocumentPage doc={LEGAL.privacy} note={LEGAL_NOTE} eyebrow={t('legalEyebrow')} />}
      {path === TERMS && <DocumentPage doc={LEGAL.terms} note={LEGAL_NOTE} eyebrow={t('legalEyebrow')} />}
      {path === SHIPPING && <DocumentPage doc={SHIPPING_DOC} eyebrow={t('helpEyebrow')} />}
      {path === FAQ && <FaqPage />}
      {path === SCENT_FINDER && (
        <ScentFinderPage key={key} onOpenProduct={setOpenProduct} onSeeAll={seeFinderMatches} />
      )}
      {onHome && (
        <Storefront
          catalogue={catalogue}
          searchRef={searchRef}
          onSelectFamily={selectFamily}
          onViewAll={viewAll}
          onOpenProduct={setOpenProduct}
        />
      )}

      <Footer onGoToSection={goToSection} />

      <ProductModal
        product={openProduct}
        onClose={() => setOpenProduct(null)}
        onOpenProduct={setOpenProduct}
      />
      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <RouterProvider>
        <Shell />
      </RouterProvider>
    </LocaleProvider>
  )
}
