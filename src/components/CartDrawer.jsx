import { useRef } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { useCart } from '../context/cart-context'
import { FREE_SHIPPING_KD } from '../context/CartProvider'
import { useOverlay } from '../hooks/useOverlay'
import { classNames, formatPrice } from '../lib/format'


export default function CartDrawer() {
  const { lines, totals, maxQty, isCartOpen, closeCart, setQty, removeItem, openCheckout } =
    useCart()

  const panelRef = useRef(null)

  useOverlay(isCartOpen, closeCart, panelRef)

  // An empty-string `inert` attribute keeps the closed drawer out of the tab
  // order and the accessibility tree without disturbing its slide transition.
  const inertWhenClosed = isCartOpen ? {} : { inert: '' }

  const remaining = Math.max(0, FREE_SHIPPING_KD - totals.subtotal)
  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_KD) * 100)

  return (
    <div
      className={classNames(
        'fixed inset-0 z-50',
        isCartOpen ? 'pointer-events-auto' : 'pointer-events-none',
      )} aria-hidden={!isCartOpen}
    >
      {/* Scrim */}
      <div
        onClick={closeCart}
        className={classNames(
          'absolute inset-0 bg-noir-950/75 backdrop-blur-sm transition-opacity duration-300',
          isCartOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside ref={panelRef} role="dialog" aria-modal="true" aria-label="Shopping cart"
        tabIndex={-1}
        {...inertWhenClosed}
        className={classNames(
          'absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/[0.07] bg-noir-900 shadow-[-30px_0_70px_-20px_rgba(0,0,0,0.9)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isCartOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b rule-noir px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-[18px] w-[18px] text-paper-200" strokeWidth={1.5} />
            <h2 className="font-display text-[1.75rem] font-medium leading-none text-paper-50">Your Cart</h2>
            <span className="ticket text-paper-400">
              {totals.count}
            </span>
          </div>
          <button type="button"
            onClick={closeCart}
            data-autofocus aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-paper-400 transition-colors hover:bg-white/5 hover:text-paper-50"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-20 w-20 place-items-center border rule-noir">
              <ShoppingBag className="h-7 w-7 text-paper-400" strokeWidth={1} />
            </span>
            <h3 className="mt-6 font-display text-[1.75rem] font-medium text-paper-100">Your cart is empty</h3>
            <p className="t-body-noir mt-3 max-w-xs text-paper-400">
              Every Nafsah order arrives with two complimentary 2ml samples of your choosing.
            </p>
            <button type="button" onClick={closeCart} className="btn-paper mt-8">
              Browse the Collection
            </button>
          </div>
        ) : (
          <>
            {/* Free-shipping progress */}
            <div className="border-b rule-noir px-6 py-4">
              <div className="flex items-center gap-2 font-sans text-[12px] font-light text-paper-400">
                <Truck className="h-3.5 w-3.5 text-paper-200" strokeWidth={1.5} />
                {remaining > 0 ? (
                  <span>
                    <span className="text-paper-100">{formatPrice(remaining)}</span> away from
                    complimentary express shipping
                  </span>
                ) : (
                  <span className="text-paper-100">Complimentary express shipping unlocked</span>
                )}
              </div>
              <div className="mt-3 h-px overflow-hidden bg-noir-700">
                <div
                  className="h-full bg-oxblood-500 transition-[width] duration-500" style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-white/[0.06] overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.id} className="flex animate-fade-in gap-4 py-5">
                  <div className="h-24 w-16 shrink-0 overflow-hidden  border border-white/[0.07] bg-noir-900">
                    <BottleVisual palette={line.product.palette} onDark />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-[1.35rem] font-medium leading-tight text-paper-50">
                          {line.product.name}
                        </h3>
                        <p className="ticket mt-1.5 text-paper-400">
                          {line.ml}ml · {line.product.family}
                        </p>
                      </div>
                      <button type="button"
                        onClick={() => removeItem(line.id)} aria-label={`Remove ${line.product.name} ${line.ml}ml`}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-paper-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center border rule-noir">
                        <button type="button"
                          onClick={() => setQty(line.id, line.qty - 1)} aria-label={`Decrease quantity of ${line.product.name}`}
                          className="grid h-8 w-8 place-items-center text-paper-400 transition-colors hover:bg-white/5 hover:text-paper-50"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                        <span aria-live="polite"
                          className="t-figure w-9 text-center text-[15px] text-paper-50"
                        >
                          {line.qty}
                        </span>
                        <button type="button"
                          onClick={() => setQty(line.id, line.qty + 1)} disabled={line.qty >= maxQty} aria-label={`Increase quantity of ${line.product.name}`}
                          className="grid h-8 w-8 place-items-center text-paper-400 transition-colors hover:bg-white/5 hover:text-paper-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>

                      <span className="t-figure text-[1.35rem] text-paper-50">
                        {formatPrice(line.subtotal)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t rule-noir bg-noir-900/60 px-6 py-5">
              <dl className="space-y-2 font-sans text-[13px] font-light">
                <div className="flex justify-between text-paper-400">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums text-paper-100">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between text-paper-400">
                  <dt>Shipping</dt>
                  <dd className="tabular-nums">
                    {totals.shipping === 0 ? (
                      <span className="text-paper-200">Complimentary</span>
                    ) : (
                      <span className="text-paper-100">{formatPrice(totals.shipping)}</span>
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t rule-noir pt-3">
                  <dt className="ticket text-paper-200">Total</dt>
                  <dd className="t-figure text-[2rem] leading-none text-paper-50">
                    {formatPrice(totals.total)}
                  </dd>
                </div>
              </dl>

              <button type="button" onClick={openCheckout} className="btn-paper group mt-5 w-full">
                Proceed to Checkout
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </button>
              <p className="ticket mt-4 text-center text-paper-400">
                Secure payment · 30-day returns
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
