import { useCallback, useRef } from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import CartDrawer from './components/CartDrawer'
import CategoryTiles from './components/CategoryTiles'
import CheckoutModal from './components/CheckoutModal'
import Collection from './components/Collection'
import Footer from './components/Footer'
import HeroSlider from './components/HeroSlider'
import Navbar from './components/Navbar'
import NotesGuide from './components/NotesGuide'
import ProductRow from './components/ProductRow'
import Story from './components/Story'
import TrustBadges from './components/TrustBadges'
import { CartProvider } from './context/CartProvider'
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

export default function App() {
  const catalogue = useCatalogue()
  const searchRef = useRef(null)

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
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-noir-950 focus:px-6 focus:py-3 focus:font-sans focus:text-[10px] focus:uppercase focus:tracking-label focus:text-paper-50"
      >
        Skip to catalogue
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
          title="Bestsellers"
          caption="Most worn this season"
          products={BESTSELLERS}
          onViewAll={() => viewAll('rating')}
          tone="tint"
        />
        <ProductRow
          title="New Arrivals"
          caption="Latest from the atelier"
          products={NEW_ARRIVALS}
          onViewAll={() => viewAll('newest')}
        />
        <TrustBadges />
        <Collection catalogue={catalogue} searchRef={searchRef} />
        <Story />
        <NotesGuide />
      </main>

      <Footer />

      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  )
}
