import { useRef } from 'react'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { useCart } from '../context/cart-context'
import { useLocale } from '../i18n/locale-context'
import { FREE_SHIPPING_KD } from '../context/CartProvider'
import { FAMILY_AR } from '../data/products'
import { useOverlay } from '../hooks/useOverlay'
import { classNames, formatNumber, formatPrice } from '../lib/format'


export default function CartDrawer() {
  const { lines, totals, maxQty, isCartOpen, closeCart, setQty, removeItem, openCheckout } =
    useCart()
  const { lang, t, pick } = useLocale()

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
          'absolute inset-0 bg-midnight-950/75 backdrop-blur-sm transition-opacity duration-300',
          isCartOpen ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside ref={panelRef} role="dialog" aria-modal="true" aria-label={t('yourCart')}
        tabIndex={-1}
        {...inertWhenClosed}
        className={classNames(
          'absolute end-0 top-0 flex h-full w-full max-w-md flex-col border-s border-white/[0.07] bg-midnight-900 shadow-[0_0_70px_-20px_rgba(0,0,0,0.9)] transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isCartOpen ? 'translate-x-0' : 'translate-x-full rtl:-translate-x-full',
        )}
      >
        <header className="flex items-center justify-between border-b rule px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-[18px] w-[18px] text-pearl-200" strokeWidth={1.5} />
            <h2 className="font-display text-[1.75rem] font-medium leading-none text-pearl-50">{t('yourCart')}</h2>
            <span className="ticket text-pearl-400">
              {formatNumber(totals.count, lang)}
            </span>
          </div>
          <button type="button"
            onClick={closeCart}
            data-autofocus aria-label={t('closeCart')}
            className="grid h-9 w-9 place-items-center rounded-full text-pearl-400 transition-colors hover:bg-white/5 hover:text-pearl-50"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid h-20 w-20 place-items-center border rule">
              <ShoppingBag className="h-7 w-7 text-pearl-400" strokeWidth={1} />
            </span>
            <h3 className="mt-6 font-display text-[1.75rem] font-medium text-pearl-100">{t('cartEmpty')}</h3>
            <p className="t-body-noir mt-3 max-w-xs text-pearl-400">
              {t('cartEmptyBody')}
            </p>
            <button type="button" onClick={closeCart} className="btn-green mt-8">
              {t('browseCatalogue')}
            </button>
          </div>
        ) : (
          <>
            {/* Free-shipping progress */}
            <div className="border-b rule px-6 py-4">
              <div className="flex items-center gap-2 font-sans text-[12px] font-light text-pearl-400">
                <Truck className="h-3.5 w-3.5 text-pearl-200" strokeWidth={1.5} />
                {remaining > 0 ? (
                  <span>{t('awayFromFree', { amount: formatPrice(remaining, lang) })}</span>
                ) : (
                  <span className="text-pearl-100">{t('freeUnlocked')}</span>
                )}
              </div>
              <div className="mt-3 h-px overflow-hidden bg-midnight-700">
                <div
                  className="h-full bg-green-500 transition-[width] duration-500" style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-white/[0.06] overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.id} className="flex animate-fade-in gap-4 py-5">
                  <div className="h-24 w-16 shrink-0 overflow-hidden  border border-white/[0.07] bg-midnight-900">
                    <BottleVisual palette={line.product.palette} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-[1.35rem] font-medium leading-tight text-pearl-50">
                          {pick(line.product.name, line.product.ar.name)}
                        </h3>
                        <p className="ticket mt-1.5 text-pearl-400">
                          {line.ml}{lang === 'ar' ? ' مل' : 'ml'} · {pick(line.product.family, FAMILY_AR[line.product.family])}
                        </p>
                      </div>
                      <button type="button"
                        onClick={() => removeItem(line.id)} aria-label={`${t('remove')} ${pick(line.product.name, line.product.ar.name)}`}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-pearl-400 transition-colors hover:bg-alert-600/15 hover:text-alert-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <div className="inline-flex items-center border rule">
                        <button type="button"
                          onClick={() => setQty(line.id, line.qty - 1)} aria-label={`${t('decrease')} ${pick(line.product.name, line.product.ar.name)}`}
                          className="grid h-8 w-8 place-items-center text-pearl-400 transition-colors hover:bg-white/5 hover:text-pearl-50"
                        >
                          <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                        <span aria-live="polite"
                          className="t-figure w-9 text-center text-[15px] text-pearl-50"
                        >
                          {formatNumber(line.qty, lang)}
                        </span>
                        <button type="button"
                          onClick={() => setQty(line.id, line.qty + 1)} disabled={line.qty >= maxQty} aria-label={`${t('increase')} ${pick(line.product.name, line.product.ar.name)}`}
                          className="grid h-8 w-8 place-items-center text-pearl-400 transition-colors hover:bg-white/5 hover:text-pearl-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                        </button>
                      </div>

                      <span className="t-figure text-[1.35rem] text-pearl-50">
                        {formatPrice(line.subtotal, lang)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t rule bg-midnight-900/60 px-6 py-5">
              <dl className="space-y-2 font-sans text-[13px] font-light">
                <div className="flex justify-between text-pearl-400">
                  <dt>{t('subtotal')}</dt>
                  <dd className="tabular-nums text-pearl-100">{formatPrice(totals.subtotal, lang)}</dd>
                </div>
                <div className="flex justify-between text-pearl-400">
                  <dt>{t('shipping')}</dt>
                  <dd className="tabular-nums">
                    {totals.shipping === 0 ? (
                      <span className="text-pearl-200">{t('complimentary')}</span>
                    ) : (
                      <span className="text-pearl-100">{formatPrice(totals.shipping, lang)}</span>
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t rule pt-3">
                  <dt className="ticket text-pearl-200">{t('total')}</dt>
                  <dd className="t-figure text-[2rem] leading-none text-pearl-50">
                    {formatPrice(totals.total, lang)}
                  </dd>
                </div>
              </dl>

              <button type="button" onClick={openCheckout} className="btn-green group mt-5 w-full">
                {t('checkout')}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </button>
              <p className="ticket mt-4 text-center text-pearl-400">
                {t('securePayment')}
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
