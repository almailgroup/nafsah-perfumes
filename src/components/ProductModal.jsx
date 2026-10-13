import { useEffect, useRef, useState } from 'react'
import { Gift, Plus, X } from 'lucide-react'
import BottleVisual from './BottleVisual'
import FormatToggle from './product/FormatToggle'
import LayeringGuide from './product/LayeringGuide'
import OlfactoryPyramid from './product/OlfactoryPyramid'
import ProductFacts from './product/ProductFacts'
import ScentProfile from './product/ScentProfile'
import RatingBadge from './reviews/RatingBadge'
import ReviewsSection from './reviews/ReviewsSection'
import DeliveryBadge from './trust/DeliveryBadge'
import { TryFirstBanner } from './trust/TryFirst'
import { useCart } from '../context/cart-context'
import { CATALOGUE_NUMBERS, concentrationFor, formatOf } from '../data/products'
import { CONCENTRATION_BY_ID, FAMILY_BY_ID, FORMAT_BY_ID } from '../data/taxonomy'
import { useOverlay } from '../hooks/useOverlay'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatMl, formatNumber, formatOrdinal, formatPrice } from '../lib/format'

const TITLE_ID = 'product-modal-title'
// The reviews block's wrapper; ReviewsSection itself carries id="reviews".
const REVIEWS_ID = 'product-reviews'

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** A ruled section of the page with a small green eyebrow for its heading. */
function Section({ id, title, lede, children, className }) {
  return (
    <section aria-labelledby={id} className={classNames('mt-12 border-t border-snow-200 pt-10', className)}>
      <h3 id={id} className="ticket text-green-600">
        {title}
      </h3>
      {lede && <p className="t-body mt-3 max-w-[36rem] text-snow-600">{lede}</p>}
      <div className="mt-7">{children}</div>
    </section>
  )
}

/**
 * The product page, as an overlay. There is no router here and no second URL:
 * a fragrance opens over the catalogue, fills the screen, and closes back onto
 * the grid position it came from.
 *
 * One scroll for the whole page. On large screens the vial plate stays put
 * while the column beside it scrolls through the purchase, the composition,
 * the profile, the layering and the reviews; once the purchase block has
 * scrolled away, a slim bar at the foot of the column keeps it in reach.
 *
 * `onOpenProduct(product)` swaps the overlay to another fragrance; the
 * layering guide's links to partner scents are its caller.
 *
 * `initialFormatId` is the format the card was showing, so the page opens on
 * the size and price the shopper just saw. The layering guide's swap passes
 * none: a partner fragrance starts on its first format.
 */
export default function ProductModal({ product, onClose, onOpenProduct, initialFormatId = null }) {
  const { addItem } = useCart()
  const { lang, t, tr } = useLocale()
  const panelRef = useRef(null)
  const scrollRef = useRef(null)
  const titleRef = useRef(null)
  const actionsRef = useRef(null)
  const shownId = useRef(null)
  // The choice belongs to one fragrance and one visit: opening another, or the
  // same one again, starts on the format it was opened with.
  const [choice, setChoice] = useState({ productId: null, formatId: null })
  const [actionsInView, setActionsInView] = useState(true)
  const isOpen = Boolean(product)

  useOverlay(isOpen, onClose, panelRef)

  // A swap from the layering guide starts the new fragrance at the top, and
  // takes focus to its name so the change is announced, not just painted.
  useEffect(() => {
    const previous = shownId.current
    shownId.current = product?.id ?? null
    if (!previous || !product || previous === product.id) return
    scrollRef.current?.scrollTo({ top: 0 })
    titleRef.current?.focus({ preventScroll: true })
  }, [product])

  // Watch the purchase block; the bar at the foot shows only while it is out of view.
  useEffect(() => {
    const root = scrollRef.current
    const target = actionsRef.current
    if (!isOpen || !root || !target || typeof IntersectionObserver === 'undefined') return undefined
    const observer = new IntersectionObserver(([entry]) => setActionsInView(entry.isIntersecting), {
      root,
    })
    observer.observe(target)
    return () => {
      observer.disconnect()
      // The next opening starts with the bar tucked away until the observer reports.
      setActionsInView(true)
    }
  }, [isOpen])

  // Closing forgets the choice, so the next opening follows the card again.
  useEffect(() => {
    if (!isOpen) setChoice({ productId: null, formatId: null })
  }, [isOpen])

  if (!product) return null

  const format =
    (choice.productId === product.id && formatOf(product, choice.formatId)) ||
    formatOf(product, initialFormatId) ||
    product.formats[0]
  const formatLabel = tr(FORMAT_BY_ID[format.id])
  const concentration = CONCENTRATION_BY_ID[concentrationFor(product, format.id)]
  const catalogue = CATALOGUE_NUMBERS[product.id]
  const name = tr(product.name)
  const price = formatPrice(format.priceFils, lang)
  const year = formatNumber(product.year, lang, { useGrouping: false })
  // Read after each action's visible label, which has to lead its name: speech
  // input calls a button by the words it shows.
  const context = t('trust.card.addContext', { name, format: formatLabel })

  // addItem opens the cart drawer, which sits below this overlay, so hand the
  // screen over to it rather than stacking the two. A gift opens it on the gift panel.
  const handleAdd = () => {
    addItem(product, format.id)
    onClose()
  }
  const handleGift = () => {
    addItem(product, format.id, { gift: true })
    onClose()
  }

  // Scroll the page's own column, never scrollIntoView: that also shifts the
  // clipped panel and the fixed layer around it once the column hits bottom.
  const scrollToReviews = () => {
    const root = scrollRef.current
    const target = document.getElementById(REVIEWS_ID)
    if (!root || !target) return
    const top = target.getBoundingClientRect().top - root.getBoundingClientRect().top + root.scrollTop
    root.scrollTo({ top: Math.max(0, top - 24), behavior: reducedMotion() ? 'auto' : 'smooth' })
    target.focus({ preventScroll: true })
  }

  const showBar = !actionsInView

  return (
    <div className="fixed inset-0 z-[55] flex items-stretch justify-center sm:items-center sm:p-6 lg:p-8">
      <div onClick={onClose} className="absolute inset-0 animate-fade-in bg-ink-950/40 backdrop-blur-sm" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby={TITLE_ID}
        className="relative flex h-full w-full max-w-[1400px] animate-scale-in flex-col overflow-clip border border-snow-200 bg-snow-50 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] sm:h-auto sm:max-h-[92vh] lg:h-[92vh]"
      >
        <button
          data-autofocus
          type="button"
          onClick={onClose}
          aria-label={t('closeDetails')}
          className="absolute end-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-snow-200 bg-snow-50/85 text-ink-950 backdrop-blur-sm transition-colors duration-300 hover:border-snow-300 hover:bg-snow-200"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
          <div className="lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            {/* The vial plate. Decorative art and two lines of record: no figure
                semantics, since nothing here captions an image. */}
            <div className="relative flex flex-col justify-between overflow-hidden border-b border-snow-200 bg-snow-100 px-6 py-6 sm:px-10 sm:py-7 lg:sticky lg:top-0 lg:h-[calc(92vh-2px)] lg:self-start lg:border-b-0 lg:border-e">
              <div aria-hidden="true" className="mashrabiya-band pointer-events-none absolute inset-0" />
              <p className="relative flex flex-wrap items-center gap-x-4 gap-y-1 pe-12 lg:pe-0">
                <span className="ticket text-green-600">
                  {t('product.catalogueNo', { no: formatOrdinal(catalogue, lang) })}
                </span>
                {(product.isNew || product.bestseller) && (
                  <span className="ticket text-green-600">
                    {product.isNew ? t('newBadge') : t('bestsellerBadge')}
                  </span>
                )}
              </p>

              <div className="relative mx-auto h-[13.5rem] w-full py-3 sm:h-[20rem] sm:py-4 lg:h-auto lg:min-h-0 lg:flex-1 lg:py-8">
                <BottleVisual palette={product.palette} catalogue={catalogue} label={concentration?.abbr} />
              </div>

              <p className="relative flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <span className="ticket text-snow-600">{tr(FAMILY_BY_ID[product.family])}</span>
                <span className="ticket text-snow-600">{t('product.introducedIn', { year })}</span>
              </p>
            </div>

            <div className="px-6 pt-9 sm:px-10 lg:px-12 lg:pt-11">
              <div className="max-w-[40rem]">
                <h2
                  ref={titleRef}
                  id={TITLE_ID}
                  tabIndex={-1}
                  className="t-h2 pe-12 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  {name}
                </h2>
                <p className="t-body mt-3 text-[17px]">{tr(product.tagline)}</p>
                <div className="mt-4 empty:hidden">
                  <RatingBadge productId={product.id} onClick={scrollToReviews} />
                </div>

                <ProductFacts product={product} formatId={format.id} className="mt-7" />

                <div className="mt-8">
                  <h3 id="product-format-heading" className="ticket text-green-600">
                    {t('product.formatHeading')}
                  </h3>
                  <div className="mt-3.5">
                    <FormatToggle
                      product={product}
                      value={format.id}
                      onChange={(formatId) => setChoice({ productId: product.id, formatId })}
                      labelledBy="product-format-heading"
                    />
                  </div>

                  <p
                    aria-live="polite"
                    aria-atomic="true"
                    className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1"
                  >
                    <span className="font-sans text-[14px] text-snow-600 rtl:font-sans-ar">
                      {t('product.selection', { format: formatLabel, volume: formatMl(format.ml, lang) })}
                    </span>
                    <span className="t-figure text-[1.6rem] leading-none text-ink-950">{price}</span>
                  </p>

                  <div ref={actionsRef} className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={handleAdd} className="btn-green w-full">
                      <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {t('addToCart')}
                      <span className="sr-only"> — {context}</span>
                    </button>
                    <button type="button" onClick={handleGift} className="btn-outline w-full">
                      <Gift aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {t('product.gift')}
                      <span className="sr-only"> — {context}</span>
                    </button>
                  </div>

                  <div className="mt-6 space-y-4 border-t border-snow-200 pt-5">
                    <DeliveryBadge variant="inline" />
                    {FORMAT_BY_ID[format.id]?.tryFirst && <TryFirstBanner variant="compact" />}
                  </div>
                </div>

                <section aria-labelledby="product-about" className="mt-10">
                  <h3 id="product-about" className="ticket text-green-600">
                    {t('product.about')}
                  </h3>
                  <p className="t-body mt-3">{tr(product.description)}</p>
                </section>

                <Section id="product-pyramid" title={t('product.pyramid.title')} lede={t('product.pyramid.lede')}>
                  <OlfactoryPyramid product={product} labelledBy="product-pyramid" />
                </Section>

                <Section id="product-profile" title={t('product.profile.title')} lede={t('product.profile.lede')}>
                  <ScentProfile product={product} />
                </Section>

                {product.layering?.length > 0 && (
                  <Section id="product-layering" title={t('product.layering.title')}>
                    <LayeringGuide product={product} onOpenProduct={onOpenProduct} />
                  </Section>
                )}

                <div
                  id={REVIEWS_ID}
                  tabIndex={-1}
                  className="mt-12 scroll-mt-6 border-t border-snow-200 pt-10 empty:hidden focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                  {/* Keyed: a swap to a partner fragrance starts a fresh review, not this one's draft. */}
                  <ReviewsSection key={product.id} product={product} />
                </div>
              </div>

              {/* The purchase, kept in reach once its block has scrolled away. */}
              <div
                aria-hidden={!showBar}
                className={classNames(
                  'sticky bottom-0 z-10 -mx-6 mt-14 border-t border-snow-200 bg-snow-50/95 px-6 py-3 backdrop-blur-sm transition-[opacity,transform,visibility] duration-300 sm:-mx-10 sm:px-10 lg:-mx-12 lg:px-12',
                  showBar ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-2 opacity-0',
                )}
              >
                <div className="flex max-w-[40rem] items-center gap-4">
                  <p className="min-w-0 flex-1">
                    <span className="block truncate font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">
                      {name} · {formatLabel}
                    </span>
                    <span className="t-figure block text-[1.05rem] leading-snug text-ink-950">{price}</span>
                  </p>
                  <button
                    type="button"
                    onClick={handleAdd}
                    tabIndex={showBar ? 0 : -1}
                    className="btn-green shrink-0 px-6"
                  >
                    <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {t('addToCart')}
                    <span className="sr-only"> — {context}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
