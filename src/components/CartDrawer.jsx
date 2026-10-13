import { useEffect, useId, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Gift,
  Minus,
  Plus,
  ShoppingBag,
  TestTube,
  Trash2,
  X,
} from 'lucide-react'
import BottleVisual from './BottleVisual'
import GiftPanel from './gifting/GiftPanel'
import DeliveryBadge from './trust/DeliveryBadge'
import { TryFirstModal } from './trust/TryFirst'
import { useCart } from '../context/cart-context'
import { useLocale } from '../i18n/locale-context'
import { FREE_SHIPPING_FILS, REMOTE_SURCHARGE_FILS } from '../data/delivery'
import { GIFT_BOX_BY_ID } from '../data/gifting'
import { policyVars } from '../data/help'
import { concentrationFor } from '../data/products'
import { CONCENTRATION_BY_ID, FORMAT_BY_ID } from '../data/taxonomy'
import { useOverlay } from '../hooks/useOverlay'
import { classNames, formatMl, formatNumber, formatPrice } from '../lib/format'

// Small square controls on paper: a tinted ground on hover, ink on focus.
const STEP_BUTTON = 'grid h-9 w-9 place-items-center text-snow-600 transition-colors duration-300'

/**
 * The cart, as a drawer from the logical end: each line with its format and
 * Try First vial, the way to complimentary delivery and when it arrives, the
 * gift (collapsed until asked for — "Send as a gift" opens the drawer on it),
 * then the totals and the way to checkout.
 */
export default function CartDrawer() {
  const {
    lines,
    totals,
    maxQty,
    isCartOpen,
    closeCart,
    setQty,
    removeItem,
    openCheckout,
    deliveryAreaId,
    gift,
    cartSection,
    lastAddedAt,
  } = useCart()
  const { lang, isRtl, t, tc, tr, switching } = useLocale()
  const uid = useId()

  const panelRef = useRef(null)
  const titleRef = useRef(null)
  const scrollRef = useRef(null)
  const giftRef = useRef(null)
  const [giftOpen, setGiftOpen] = useState(false)
  const [tryFirstOpen, setTryFirstOpen] = useState(false)
  // Read out once by screen readers: what was just removed.
  const [status, setStatus] = useState('')

  useOverlay(isCartOpen, closeCart, panelRef)

  // Opened from "Send as a gift": the gift panel is where the shopper is going.
  const toGift = isCartOpen && cartSection === 'gift'

  // Expand the gift and bring it to the top of the drawer — again on each
  // gift added while the drawer is already open (lastAddedAt).
  useEffect(() => {
    if (!toGift) return undefined
    setGiftOpen(true)
    const timer = setTimeout(() => {
      const scroller = scrollRef.current
      const section = giftRef.current
      if (!scroller || !section) return
      const top = section.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
      const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      scroller.scrollTo({ top, behavior: still ? 'auto' : 'smooth' })
    }, 80)
    return () => clearTimeout(timer)
  }, [toGift, lastAddedAt])

  useEffect(() => {
    if (!isCartOpen) setStatus('')
  }, [isCartOpen])

  // An empty-string `inert` attribute keeps the closed drawer out of the tab
  // order and the accessibility tree without disturbing its slide transition.
  const inertWhenClosed = isCartOpen ? {} : { inert: '' }

  const price = (fils) => formatPrice(fils, lang)
  // "Oud Noir, Full Bottle": two lines can be the same fragrance in two formats.
  const itemName = (line) => t('gifting.cart.item', { name: tr(line.product.name), format: tr(FORMAT_BY_ID[line.formatId]) })

  const remove = (line) => {
    removeItem(line.id)
    setStatus(t('gifting.cart.removed', { item: itemName(line) }))
    // The row and its button are gone; the cart's title is the next sure footing.
    titleRef.current?.focus({ preventScroll: true })
  }

  const reached = Math.min(totals.subtotalFils, FREE_SHIPPING_FILS)
  const progress = (reached / FREE_SHIPPING_FILS) * 100
  const box = GIFT_BOX_BY_ID[gift.boxId]
  const Forward = isRtl ? ArrowLeft : ArrowRight

  return (
    <div
      className={classNames('fixed inset-0 z-50', isCartOpen ? 'pointer-events-auto' : 'pointer-events-none')}
      aria-hidden={!isCartOpen}
    >
      {/* Scrim */}
      <div
        onClick={closeCart}
        className={classNames(
          'absolute inset-0 bg-ink-950/35 backdrop-blur-sm transition-opacity duration-300',
          isCartOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        tabIndex={-1}
        {...inertWhenClosed}
        className={classNames(
          'absolute end-0 top-0 flex h-full w-full max-w-md flex-col border-s border-snow-200 bg-snow-50 focus:outline-none',
          // A direction flip moves the side the closed drawer is parked on,
          // from translateX(+100%) off the right to -100% off the left. With
          // the transition armed that is animated, so the panel sweeps the
          // full width of the viewport on every language switch. Cut the
          // transition while the scripts swap; the transform has settled by
          // the time it is re-armed, so nothing animates.
          switching ? 'transition-none' : 'transition-[transform,box-shadow] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
          // The shadow only while open: parked off-screen it would still fall
          // across the page's inline-end edge.
          isCartOpen
            ? 'translate-x-0 shadow-[0_0_70px_-20px_rgba(0,0,0,0.9)]'
            : 'translate-x-full rtl:-translate-x-full',
        )}
      >
        <header className="flex items-center justify-between gap-4 border-b rule px-6 py-5">
          <div className="flex min-w-0 items-center gap-3">
            <ShoppingBag aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-ink-950" strokeWidth={1.5} />
            <h2
              ref={titleRef}
              id={`${uid}-title`}
              tabIndex={-1}
              className="font-display text-[1.75rem] font-medium leading-none text-ink-950 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rtl:font-display-ar rtl:text-[1.6rem] rtl:leading-tight"
            >
              {t('yourCart')}
            </h2>
            {totals.count > 0 && (
              <span className="ticket text-snow-600">
                <span aria-hidden="true">{formatNumber(totals.count, lang)}</span>
                <span className="sr-only">{tc('gifting.cart.items', totals.count)}</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            data-autofocus={toGift ? undefined : true}
            aria-label={t('closeCart')}
            className="-me-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-snow-600 transition-colors duration-300 hover:bg-snow-100 hover:text-ink-950"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        <p role="status" className="sr-only">
          {status}
        </p>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-20 w-20 place-items-center border rule">
              <ShoppingBag aria-hidden="true" className="h-7 w-7 text-snow-600" strokeWidth={1.25} />
            </span>
            <h3 className="mt-6 font-display text-[1.75rem] font-medium leading-tight text-ink-950 rtl:font-display-ar rtl:text-[1.6rem]">
              {t('cartEmpty')}
            </h3>
            <p className="t-body mt-3 max-w-xs text-snow-600">{t('cartEmptyBody', policyVars(lang))}</p>
            <button type="button" onClick={closeCart} className="btn-green mt-8">
              {t('browseCatalogue')}
            </button>
          </div>
        ) : (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
              {/* The way to complimentary delivery, and when an order placed now arrives. */}
              <div className="border-b rule px-6 py-4">
                {/* No icon here: the delivery badge below carries the truck. */}
                <p className="font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">
                  {totals.remainingForFreeFils > 0 ? (
                    t('awayFromFree', { amount: price(totals.remainingForFreeFils) })
                  ) : (
                    <span className="text-ink-950">{t('freeUnlocked')}</span>
                  )}
                </p>
                <div
                  role="progressbar"
                  aria-label={t('gifting.cart.progress')}
                  aria-valuemin={0}
                  aria-valuemax={FREE_SHIPPING_FILS / 1000}
                  aria-valuenow={reached / 1000}
                  aria-valuetext={t('gifting.cart.progressValue', {
                    amount: price(reached),
                    threshold: price(FREE_SHIPPING_FILS),
                  })}
                  className="mt-3 h-[2px] bg-snow-200"
                >
                  <div className="h-full bg-green-600 transition-[width] duration-500" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-3.5">
                  <DeliveryBadge areaId={deliveryAreaId} variant="compact" />
                </div>
              </div>

              <ul className="divide-y divide-snow-200 px-6">
                {lines.map((line) => {
                  const item = itemName(line)
                  const atMin = line.qty <= 1
                  const atMax = line.qty >= maxQty
                  const maxNoteId = `${uid}-${line.id}-max`
                  return (
                    <li key={line.id} className="flex animate-fade-in gap-4 py-5">
                      <div aria-hidden="true" className="h-24 w-16 shrink-0 overflow-hidden border border-snow-200 bg-snow-50">
                        <BottleVisual
                          palette={line.product.palette}
                          label={CONCENTRATION_BY_ID[concentrationFor(line.product, line.formatId)]?.abbr}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-display text-[1.35rem] font-medium leading-tight text-ink-950 rtl:font-display-ar rtl:text-[1.2rem]">
                              {tr(line.product.name)}
                            </h3>
                            <p className="ticket mt-1.5 text-snow-600">
                              {t('product.selection', { format: tr(FORMAT_BY_ID[line.formatId]), volume: formatMl(line.format.ml, lang) })}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(line)}
                            aria-label={t('gifting.cart.remove', { item })}
                            className="-me-1.5 grid h-8 w-8 shrink-0 place-items-center rounded-full text-snow-600 transition-colors duration-300 hover:bg-alert-600/10 hover:text-alert-600"
                          >
                            <Trash2 aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </button>
                        </div>

                        {line.includesTestVial && (
                          <div className="mt-2 flex items-start gap-1.5 font-sans text-[12px] leading-snug text-snow-600 rtl:font-sans-ar">
                            <TestTube aria-hidden="true" className="mt-px h-3.5 w-3.5 shrink-0 text-green-600" strokeWidth={1.5} />
                            <div className="min-w-0">
                              <p>{t('gifting.cart.vial', { volume: formatMl(FORMAT_BY_ID.sample.ml, lang) })}</p>
                              <button
                                type="button"
                                aria-haspopup="dialog"
                                onClick={() => setTryFirstOpen(true)}
                                className="mt-0.5 text-start text-green-600 underline decoration-green-600/40 underline-offset-[3px] transition-colors duration-300 hover:text-ink-950 hover:decoration-ink-950"
                              >
                                {t('gifting.cart.howTryFirst')}
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex items-end justify-between gap-3">
                          <div role="group" aria-label={t('gifting.cart.quantity', { item })} className="inline-flex items-center border rule">
                            {/* aria-disabled rather than disabled, so focus stays put at the limits. */}
                            <button
                              type="button"
                              onClick={() => !atMin && setQty(line.id, line.qty - 1)}
                              aria-disabled={atMin || undefined}
                              aria-label={t('gifting.cart.decrease', { item })}
                              className={classNames(
                                STEP_BUTTON,
                                atMin ? 'cursor-not-allowed opacity-40' : 'hover:bg-snow-100 hover:text-ink-950',
                              )}
                            >
                              <Minus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
                            </button>
                            <span aria-live="polite" aria-atomic="true" className="t-figure w-9 text-center text-[15px] text-ink-950">
                              {formatNumber(line.qty, lang)}
                            </span>
                            <button
                              type="button"
                              onClick={() => !atMax && setQty(line.id, line.qty + 1)}
                              aria-disabled={atMax || undefined}
                              aria-label={t('gifting.cart.increase', { item })}
                              aria-describedby={atMax ? maxNoteId : undefined}
                              className={classNames(
                                STEP_BUTTON,
                                atMax ? 'cursor-not-allowed opacity-40' : 'hover:bg-snow-100 hover:text-ink-950',
                              )}
                            >
                              <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
                            </button>
                          </div>

                          <div className="min-w-0 text-end">
                            <span className="t-figure block text-[1.3rem] leading-none text-ink-950">
                              {price(line.subtotalFils)}
                            </span>
                            {line.qty > 1 && (
                              <span className="mt-1.5 block font-sans text-[12px] leading-none text-snow-600 rtl:font-sans-ar">
                                {t('gifting.cart.each', { price: price(line.unitFils) })}
                              </span>
                            )}
                          </div>
                        </div>
                        {/* Why the plus has gone quiet. */}
                        {atMax && (
                          <p id={maxNoteId} className="ticket mt-1 text-snow-600">
                            {t('gifting.cart.maxQty', { max: formatNumber(maxQty, lang) })}
                          </p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>

              <section ref={giftRef} aria-labelledby={`${uid}-gift`} className="border-t rule">
                <h3>
                  <button
                    id={`${uid}-gift`}
                    type="button"
                    aria-expanded={giftOpen}
                    aria-controls={`${uid}-gift-panel`}
                    onClick={() => setGiftOpen((open) => !open)}
                    data-autofocus={toGift ? true : undefined}
                    className="flex w-full items-center gap-3.5 px-6 py-5 text-start transition-colors duration-300 hover:bg-snow-100"
                  >
                    <Gift aria-hidden="true" className="h-[18px] w-[18px] shrink-0 text-green-600" strokeWidth={1.5} />
                    <span className="min-w-0 flex-1">
                      <span className="ticket block text-ink-950">{t('gifting.cart.giftOptions')}</span>
                      <span className="mt-1 block font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">
                        {gift.enabled
                          ? t(gift.message.trim() ? 'gifting.cart.giftOnCard' : 'gifting.cart.giftOnNoCard', { box: tr(box) })
                          : t('gifting.cart.giftOff')}
                      </span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={classNames(
                        'h-4 w-4 shrink-0 text-snow-600 transition-transform duration-300',
                        giftOpen && 'rotate-180',
                      )}
                      strokeWidth={1.5}
                    />
                  </button>
                </h3>
                <div id={`${uid}-gift-panel`} hidden={!giftOpen} className="px-6 pb-8 pt-1">
                  {giftOpen && <GiftPanel />}
                </div>
              </section>
            </div>

            <footer className="border-t rule px-6 pb-4 pt-4 sm:pb-5">
              <dl className="space-y-2 font-sans text-[14px] leading-snug rtl:font-sans-ar">
                <div className="flex justify-between gap-4 text-snow-600">
                  <dt>{t('subtotal')}</dt>
                  <dd className="tabular-nums text-ink-950">{price(totals.subtotalFils)}</dd>
                </div>
                {gift.enabled && (
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 text-snow-600">
                    <dt>{t('gifting.cart.giftBox')}</dt>
                    <dd className="tabular-nums text-ink-950">
                      {totals.giftFils > 0 ? price(totals.giftFils) : t('complimentary')}
                    </dd>
                    <dd className="col-span-2 mt-0.5 text-[12px]">{tr(box)}</dd>
                  </div>
                )}
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 text-snow-600">
                  <dt>{t('gifting.cart.delivery')}</dt>
                  <dd className="tabular-nums text-ink-950">
                    {totals.shippingFils === 0 ? t('complimentary') : price(totals.shippingFils)}
                  </dd>
                  {/* The area, and so any outlying-area fee, is chosen at checkout. */}
                  {!deliveryAreaId && totals.remoteSurchargeFils === 0 && (
                    <dd className="col-span-2 mt-0.5 text-[12px]">
                      {t('gifting.cart.remoteLater', { fee: price(REMOTE_SURCHARGE_FILS) })}
                    </dd>
                  )}
                </div>
                {totals.remoteSurchargeFils > 0 && (
                  <div className="flex justify-between gap-4 text-snow-600">
                    <dt>{t('delivery.remoteSurcharge')}</dt>
                    <dd className="tabular-nums text-ink-950">{price(totals.remoteSurchargeFils)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-4 border-t rule pt-3">
                  <dt className="ticket text-ink-950">{t('total')}</dt>
                  <dd className="t-figure text-[1.6rem] leading-none text-ink-950 sm:text-[1.85rem]">{price(totals.totalFils)}</dd>
                </div>
              </dl>

              <button type="button" onClick={openCheckout} className="btn-green group mt-4 w-full sm:mt-5">
                {t('checkout')}
                <Forward
                  aria-hidden="true"
                  className={classNames(
                    'h-4 w-4 transition-transform duration-300',
                    isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1',
                  )}
                  strokeWidth={1.75}
                />
              </button>
              <p className="ticket mt-3 text-center text-snow-600 sm:mt-4">{t('securePayment')}</p>
            </footer>
          </>
        )}
      </aside>

      <TryFirstModal open={tryFirstOpen} onClose={() => setTryFirstOpen(false)} />
    </div>
  )
}
