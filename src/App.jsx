import { useCallback, useRef } from 'react'
import CartDrawer from './components/CartDrawer'
import CheckoutModal from './components/CheckoutModal'
import Collection from './components/Collection'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import NotesGuide from './components/NotesGuide'
import Story from './components/Story'
import { CartProvider } from './context/CartProvider'

export default function App() {
  const searchRef = useRef(null)

  const scrollToCollection = useCallback(() => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const focusSearch = useCallback(() => {
    scrollToCollection()
    // Wait for the smooth scroll to settle before pulling focus.
    setTimeout(() => searchRef.current?.focus({ preventScroll: true }), 500)
  }, [scrollToCollection])

  return (
    <CartProvider>
      <a
        href="#collection"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-gold-400 focus:px-5 focus:py-2.5 focus:text-[11px] focus:font-semibold focus:uppercase focus:tracking-wider2 focus:text-ink-950"
      >
        Skip to collection
      </a>

      <Navbar onSearchFocus={focusSearch} />

      <main>
        <Hero onShopNow={scrollToCollection} />
        <Collection searchRef={searchRef} />
        <Story />
        <NotesGuide />
      </main>

      <Footer />

      <CartDrawer />
      <CheckoutModal />
    </CartProvider>
  )
}
