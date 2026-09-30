import { useCallback, useRef, useState } from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import CartDrawer from './components/CartDrawer'
import CategoryTiles from './components/CategoryTiles'
import CheckoutModal from './components/CheckoutModal'
import Collection from './components/Collection'
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

function Storefront() {
  const { t } = useLocale()
  const catalogue = useCatalogue()
  const searchRef = useRef(null)
  // The fragrance whose page is open. There is no route for it — the overlay
  // is the product page.
  const [openProduct, setOpenProduct] = useState(null)

  const scrollToCatalogue = useCallback(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // Category tiles and the nav both focus one family, then drop the shopper
  // into the catalogue already filtered.
  const selectFamily = useCallback(
    (family) => {
      catalogue.selectFamily(family)
      scrollToCatalogue()
    },
    [catalogue, scrollToCatalogue],
  )

  const viewAll = useCallback(
    (predicate) => {
      catalogue.reset()
      if (predicate) catalogue.setSort(predicate)
      scrollToCatalogue()
    },
    [catalogue, scrollToCatalogue],
  )

  return (
    <CartProvider>
      <a
        href="#collection"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-green-600 focus:px-6 focus:py-3 focus:font-sans focus:text-[10px] focus:uppercase focus:tracking-label focus:text-ink-950"
      >
        {t('skipToCatalogue')}
      </a>

      <AnnouncementBar />
      <Navbar
        query={catalogue.query}
        onQueryChange={catalogue.setQuery}
        families={catalogue.families}
        onSelectFamily={selectFamily}
        onSubmitSearch={scrollToCatalogue}
      />

      <main>
        <HeroSlider onShopNow={scrollToCatalogue} />
        <CategoryTiles onSelectFamily={selectFamily} />
        <ProductRow
          title={t('bestsellers')}
          caption={t('bestsellersCaption')}
          products={BESTSELLERS}
          onViewAll={() => viewAll('rating')}
          onOpenProduct={setOpenProduct}
          tone="tint"
        />
        <ProductRow
          title={t('newArrivals')}
          caption={t('newArrivalsCaption')}
          products={NEW_ARRIVALS}
          onViewAll={() => viewAll('newest')}
          onOpenProduct={setOpenProduct}
        />
        <TrustBadges />
        <Collection catalogue={catalogue} searchRef={searchRef} onOpenProduct={setOpenProduct} />
        <Story />
        <NotesGuide />
      </main>

      <Footer />

      <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} />
      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <Storefront />
    </LocaleProvider>
  )
}
