import { useEffect, useRef, useState } from 'react'
import { Plus, Star, X } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { useCart } from '../context/cart-context'
import { CATALOGUE_NUMBERS, CONCENTRATION_AR, FAMILY_AR, INTENSITY_AR } from '../data/products'
import { useOverlay } from '../hooks/useOverlay'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatNumber, formatOrdinal, formatPrice } from '../lib/format'

const NOTE_ROWS = ['top', 'heart', 'base']

/**
 * The product page, as an overlay. There is no router here and no second URL:
 * a fragrance opens over the catalogue, fills the screen, and closes back onto
 * the grid position it came from.
 *
 * It is the only place the long `description` is shown — the cards carry the
 * tagline — so this is where a shopper reads before buying.
 */
export default function ProductModal({ product, onClose }) {
  const { addItem } = useCart()
  const { lang, t, pick } = useLocale()
  const panelRef = useRef(null)
  const [selectedMl, setSelectedMl] = useState(null)

  // Reopening on a different fragrance must not inherit the last one's size.
  useEffect(() => {
    setSelectedMl(product ? product.sizes[0].ml : null)
  }, [product])

  useOverlay(Boolean(product), onClose, panelRef)

  if (!product) return null

  const size = product.sizes.find((entry) => entry.ml === selectedMl) ?? product.sizes[0]
  const catalogue = CATALOGUE_NUMBERS[product.id]
  const name = pick(product.name, product.ar.name)
  // formatNumber groups thousands, which turns a year into "2,019".
  const year = formatNumber(product.year, lang).replace(/[,٬]/g, '')

  const handleAdd = () => {
    // addItem opens the cart drawer, which sits below this overlay, so hand
    // the screen over to it rather than stacking the two.
    addItem(product, size)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-stretch justify-center sm:items-center sm:p-6 lg:p-8">
      <div
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-midnight-950/80 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby="product-modal-title"
        className="relative flex h-full w-full max-w-[1400px] animate-scale-in flex-col overflow-hidden border border-pearl-50/15 bg-midnight-900 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] sm:h-auto sm:max-h-[92vh]"
      >
        <button
          data-autofocus
          type="button"
          onClick={onClose}
          aria-label={t('closeDetails')}
          className="absolute end-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-midnight-950/70 text-pearl-300 backdrop-blur-sm transition-colors duration-300 hover:text-pearl-50"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[1.02fr_1fr] lg:overflow-hidden">
          <figure className="relative flex flex-col justify-between overflow-hidden border-b border-pearl-50/[0.12] bg-midnight-800 px-6 py-7 sm:px-10 lg:border-b-0 lg:border-e">
            <div aria-hidden="true" className="mashrabiya-band pointer-events-none absolute inset-0" />
            <figcaption className="relative flex items-center gap-4">
              <span className="ticket text-gold-300">
                {lang === 'ar' ? 'رقم' : 'No.'} {formatOrdinal(catalogue, lang)}
              </span>
              {(product.isNew || product.bestseller) && (
                <span className="ticket text-green-300">
                  {product.isNew ? t('newBadge') : t('bestsellerBadge')}
                </span>
              )}
            </figcaption>

            <div className="relative mx-auto h-[15rem] w-full py-4 sm:h-[21rem] lg:h-auto lg:min-h-0 lg:flex-1 lg:py-8">
              <BottleVisual palette={product.palette} catalogue={catalogue} />
            </div>

            <p className="ticket relative text-center text-pearl-400">
              {pick(product.family, FAMILY_AR[product.family])}
            </p>
          </figure>

          <div className="flex flex-col overflow-y-auto px-6 py-9 sm:px-10 lg:px-12 lg:py-11">
            <h2 id="product-modal-title" className="t-h2 pe-12">
              {name}
            </h2>
            <p className="t-body mt-3 text-[17px]">{pick(product.tagline, product.ar.tagline)}</p>

            <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="ticket flex items-center gap-1.5 text-pearl-100">
                <Star className="h-3.5 w-3.5 text-gold-300" strokeWidth={1.5} fill="currentColor" />
                {formatNumber(product.rating, lang)}
              </span>
              <span className="ticket text-pearl-400">
                {t('reviewsLabel', { count: formatNumber(product.reviews, lang) })}
              </span>
            </p>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-pearl-50/[0.12] py-6 sm:grid-cols-3">
              {[
                [t('concentrationLabel'), pick(product.concentration, CONCENTRATION_AR[product.concentration])],
                [t('intensityLabel'), pick(product.intensity, INTENSITY_AR[product.intensity])],
                [t('introduced'), year],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="ticket text-pearl-400">{label}</dt>
                  <dd className="t-body mt-1.5 text-[14px] text-pearl-100">{value}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-7">
              <h3 className="ticket text-gold-300">{t('aboutThis')}</h3>
              <p className="t-body mt-3">{pick(product.description, product.ar.description)}</p>
            </section>

            <section className="mt-8">
              <h3 className="ticket text-gold-300">{t('theComposition')}</h3>
              <dl className="mt-3 border-t border-pearl-50/[0.12]">
                {NOTE_ROWS.map((key) => (
                  <div
                    key={key}
                    className="flex items-baseline gap-5 border-b border-pearl-50/[0.08] py-3 last:border-b-0"
                  >
                    <dt className="ticket w-16 shrink-0 text-pearl-400">{t(key)}</dt>
                    <dd className="t-body text-[14px] text-pearl-100">
                      {pick(product.notes[key], product.ar.notes[key]).join(lang === 'ar' ? '، ' : ', ')}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-auto pt-9">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div
                  role="radiogroup"
                  aria-label={t('selectSize')}
                  className="flex border border-pearl-50/20"
                >
                  {product.sizes.map((option) => (
                    <button
                      key={option.ml}
                      type="button"
                      role="radio"
                      aria-checked={option.ml === size.ml}
                      onClick={() => setSelectedMl(option.ml)}
                      className={classNames(
                        'px-6 py-2.5 font-sans text-[11px] tracking-label transition-colors duration-300 rtl:font-sans-ar rtl:tracking-normal',
                        option.ml === size.ml
                          ? 'bg-midnight-700 text-pearl-50'
                          : 'text-pearl-400 hover:text-pearl-100',
                      )}
                    >
                      {option.ml} {lang === 'ar' ? 'مل' : 'ml'}
                    </button>
                  ))}
                </div>
                <span className="t-figure text-[1.6rem] leading-none text-pearl-50">
                  {formatPrice(size.price, lang)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                aria-label={`${t('addToCart')} — ${name}`}
                className="btn-green mt-4 w-full"
              >
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                {t('addToCart')}
              </button>

              <p className="ticket mt-4 text-center text-pearl-400">{t('securePayment')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
