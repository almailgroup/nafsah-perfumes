import { useRef } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { useCart } from '../context/cart-context'
import { useOverlay } from '../hooks/useOverlay'
import { classNames, formatPrice, formatPriceWithCents } from '../lib/format'

const FREE_SHIPPING_THRESHOLD = 250

export default function CartDrawer() {
  const { lines, totals, maxQty, isCartOpen, closeCart, setQty, removeItem, openCheckout } =
    useCart()

  const panelRef = useRef(null)

  useOverlay(isCartOpen, closeCart, panelRef)

  // An empty-string `inert` attribute keeps the closed drawer out of the tab
  // order and the accessibility tree without disturbing its slide transition.
  const inertWhenClosed = isCartOpen ? {} : { inert: '' }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal)
  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  return (
    <div
      className={classNames(
        'fixed inset-0 z-50',
        isCartOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!isCartOpen}
    >
      {/* Scrim */}
      <div
        onClick={closeCart}
        className={classNames(
          'absolute inset-0 bg-ink-950/75 backdrop-blur-sm transition-opacity duration-300',
          isCartOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        {...inertWhenClosed}
        className={classNames(
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/[0.07] bg-ink-900 shadow-[-30px_0_70px_-20px_rgba(0,0,0,0.9)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isCartOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b hairline px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-[18px] w-[18px] text-gold-300" strokeWidth={1.5} />
            <h2 className="font-display text-2xl text-cream-50">Your Cart</h2>
            <span className="rounded-full bg-white/[0.07] px-2.5 py-0.5 text-[11px] text-cream-300">
              {totals.count}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            data-autofocus
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-cream-300 transition-colors hover:bg-white/5 hover:text-cream-50"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-20 w-20 place-items-center rounded-full border border-white/10">
              <ShoppingBag className="h-7 w-7 text-cream-400" strokeWidth={1} />
            </span>
            <h3 className="mt-6 font-display text-2xl text-cream-100">Your cart is empty</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-cream-400">
              Every Nafsah order arrives with two complimentary 2ml samples of your choosing.
            </p>
            <button type="button" onClick={closeCart} className="btn-gold mt-8">
              Browse the Collection
            </button>
          </div>
        ) : (
          <>
            {/* Free-shipping progress */}
            <div className="border-b hairline px-6 py-4">
              <div className="flex items-center gap-2 text-[11px] text-cream-300">
                <Truck className="h-3.5 w-3.5 text-gold-300" strokeWidth={1.5} />
                {remaining > 0 ? (
                  <span>
                    <span className="text-cream-100">{formatPrice(remaining)}</span> away from
                    complimentary express shipping
                  </span>
                ) : (
                  <span className="text-gold-200">Complimentary express shipping unlocked</span>
                )}
              </div>
              <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-ink-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-200 transition-[width] duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-white/[0.06] overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.id} className="flex animate-fade-in gap-4 py-5">
                  <div className="h-24 w-16 shrink-0 overflow-hidden rounded-xl border border-white/[0.07] bg-ink-850">
                    <BottleVisual palette={line.product.palette} glow={false} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-lg leading-tight text-cream-50">
                          {line.product.name}
                        </h3>
                        <p className="mt-0.5 text-[10px] uppercase tracking-wider2 text-cream-400">
                          {line.ml}ml · {line.product.family}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(line.id)}
                        aria-label={`Remove ${line.product.name} ${line.ml}ml`}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-cream-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-white/10">
                        <button
                          type="button"
                          onClick={() => setQty(line.id, line.qty - 1)}
                          aria-label={`Decrease quantity of ${line.product.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full text-cream-300 transition-colors hover:bg-white/5 hover:text-cream-50"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                        <span
                          aria-live="polite"
                          className="w-8 text-center text-sm tabular-nums text-cream-100"
                        >
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.id, line.qty + 1)}
                          disabled={line.qty >= maxQty}
                          aria-label={`Increase quantity of ${line.product.name}`}
                          className="grid h-8 w-8 place-items-center rounded-full text-cream-300 transition-colors hover:bg-white/5 hover:text-cream-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>

                      <span className="font-display text-xl text-cream-50">
                        {formatPrice(line.subtotal)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t hairline bg-ink-850/60 px-6 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between text-cream-300">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums text-cream-100">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-cream-300">
                  <dt>Shipping</dt>
                  <dd className="tabular-nums">
                    {totals.shipping === 0 ? (
                      <span className="text-gold-300">Complimentary</span>
                    ) : (
                      <span className="text-cream-100">{formatPrice(totals.shipping)}</span>
                    )}
                  </dd>
                </div>
                <div className="flex justify-between text-cream-300">
                  <dt>Estimated tax</dt>
                  <dd className="tabular-nums text-cream-100">
                    {formatPriceWithCents(totals.tax)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t hairline pt-3">
                  <dt className="text-[11px] uppercase tracking-wider2 text-cream-300">Total</dt>
                  <dd className="font-display text-3xl tabular-nums text-cream-50">
                    {formatPriceWithCents(totals.total)}
                  </dd>
                </div>
              </dl>

              <button type="button" onClick={openCheckout} className="btn-gold group mt-5 w-full">
                Proceed to Checkout
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </button>
              <p className="mt-3 text-center text-[10px] uppercase tracking-wider2 text-cream-400">
                Secure payment · 30-day returns
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
