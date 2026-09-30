import { useCallback, useEffect, useRef, useState } from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import CartDrawer from './components/CartDrawer'
import CategoryTiles from './components/CategoryTiles'
import CheckoutModal from './components/CheckoutModal'
import Collection from './components/Collection'
import ContactPage from './components/ContactPage'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import Navbar from './components/Navbar'
import NotesGuide from './components/NotesGuide'
import ProductModal from './components/ProductModal'
import ProductRow from './components/ProductRow'
import Story from './components/Story'
import TrustBadges from './components/TrustBadges'
import { CartProvider } from './context/CartProvider'
import { LocaleProvider } from './i18n/LocaleProvider'
import { useLocale } from './i18n/locale-context'
import { PRODUCTS } from './data/products'
import { useCatalogue } from './hooks/useCatalogue'
import { RouterProvider } from './router/RouterProvider'
import { CONTACT, HOME, useRouter } from './router/router-context'

// Only three fragrances carry each flag, so the rows are topped up to a full
// four by the next best candidate — otherwise the 4-up grid shows a hole.
const topUp = (flagged, rank) =>
  [...flagged, ...[...PRODUCTS].filter((p) => !flagged.includes(p)).sort(rank)].slice(0, 4)

const BESTSELLERS = topUp(
  PRODUCTS.filter((p) => p.bestseller),
  (a, b) => b.rating - a.rating || b.reviews - a.reviews,
)
const NEW_ARRIVALS = topUp(
  PRODUCTS.filter((p) => p.isNew),
  (a, b) => b.year - a.year || b.rating - a.rating,
)

function Storefront({ catalogue, searchRef, onViewAll, onOpenProduct }) {
  const { t } = useLocale()
  return (
    <main id="main">
      <HeroSlider onShopNow={() => onViewAll(null)} />
      <CategoryTiles onSelectFamily={catalogue.onSelectFamily} />
      <ProductRow
        title={t('bestsellers')}
        caption={t('bestsellersCaption')}
        products={BESTSELLERS}
        onViewAll={() => onViewAll('rating')}
        onOpenProduct={onOpenProduct}
        tone="tint"
      />
      <ProductRow
        title={t('newArrivals')}
        caption={t('newArrivalsCaption')}
        products={NEW_ARRIVALS}
        onViewAll={() => onViewAll('newest')}
        onOpenProduct={onOpenProduct}
      />
      <TrustBadges />
      <Collection catalogue={catalogue.state} searchRef={searchRef} onOpenProduct={onOpenProduct} />
      <Story />
      <NotesGuide />
    </main>
  )
}

/**
 * Everything outside <main> is shared by both pages, so the header, footer and
 * the three overlays live here and only the page body swaps. The cart survives
 * navigation because it never unmounts.
 */
function Shell() {
  const { t } = useLocale()
  const { path, navigate } = useRouter()
  const catalogue = useCatalogue()
  const searchRef = useRef(null)
  const [openProduct, setOpenProduct] = useState(null)
  // Holds a section id when a jump fires from /contact: the storefront is not
  // mounted yet, so the scroll has to wait for it.
  const pendingScroll = useRef(null)

  const onHome = path === HOME

  useEffect(() => {
    document.title = t(path === CONTACT ? 'titleContact' : 'titleHome')
  }, [path, t])

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
  // into the catalogue already filtered — from either page.
  const selectFamily = useCallback(
    (family) => {
      catalogue.selectFamily(family)
      goToCatalogue()
    },
    [catalogue, goToCatalogue],
  )

  const viewAll = useCallback(
    (predicate) => {
      catalogue.reset()
      if (predicate) catalogue.setSort(predicate)
      goToCatalogue()
    },
    [catalogue, goToCatalogue],
  )

  return (
    <CartProvider>
      <a
        href={onHome ? '#collection' : '#main'}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-green-600 focus:px-6 focus:py-3 focus:font-sans focus:text-[10px] focus:uppercase focus:tracking-label focus:text-snow-50"
      >
        {t(onHome ? 'skipToCatalogue' : 'skipToContent')}
      </a>

      <AnnouncementBar />
      <Navbar
        query={catalogue.query}
        onQueryChange={catalogue.setQuery}
        families={catalogue.families}
        onSelectFamily={selectFamily}
        onSubmitSearch={goToCatalogue}
      />

      {onHome ? (
        <Storefront
          catalogue={{ state: catalogue, onSelectFamily: selectFamily }}
          searchRef={searchRef}
          onViewAll={viewAll}
          onOpenProduct={setOpenProduct}
        />
      ) : (
        <ContactPage />
      )}

      <Footer onGoToSection={goToSection} />

      <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />
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
