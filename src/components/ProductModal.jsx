import { useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import BottleVisual from './BottleVisual'
import FormatToggle from './product/FormatToggle'
import { useCart } from '../context/cart-context'
import { CATALOGUE_NUMBERS, concentrationFor, formatOf } from '../data/products'
import { CONCENTRATION_BY_ID, FAMILY_BY_ID, SILLAGE_BY_ID } from '../data/taxonomy'
import { useOverlay } from '../hooks/useOverlay'
import { useLocale } from '../i18n/locale-context'
import { formatNumber, formatOrdinal, formatPrice } from '../lib/format'

const NOTE_ROWS = [
  ['top', 'topNotes'],
  ['heart', 'heartNotes'],
  ['base', 'baseNotes'],
]

/**
 * The product page, as an overlay. There is no router here and no second URL:
 * a fragrance opens over the catalogue, fills the screen, and closes back onto
 * the grid position it came from.
 *
 * It is the only place the long `description` is shown — the cards carry the
 * tagline — so this is where a shopper reads before buying.
 *
 * `onOpenProduct(product)` swaps the overlay to another fragrance; the
 * layering guide's links to partner scents are its caller.
 */
// eslint-disable-next-line no-unused-vars -- wired by App, used by the layering guide (P1)
export default function ProductModal({ product, onClose, onOpenProduct }) {
  const { addItem } = useCart()
  const { lang, t, tr } = useLocale()
  const panelRef = useRef(null)
  // The choice belongs to one fragrance: reopening on another starts on its first format.
  const [choice, setChoice] = useState({ productId: null, formatId: null })

  useOverlay(Boolean(product), onClose, panelRef)

  if (!product) return null

  const format =
    (choice.productId === product.id && formatOf(product, choice.formatId)) || product.formats[0]
  const concentration = CONCENTRATION_BY_ID[concentrationFor(product, format.id)]
  const catalogue = CATALOGUE_NUMBERS[product.id]
  const name = tr(product.name)
  const year = formatNumber(product.year, lang, { useGrouping: false })

  const handleAdd = () => {
    // addItem opens the cart drawer, which sits below this overlay, so hand
    // the screen over to it rather than stacking the two.
    addItem(product, format.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-stretch justify-center sm:items-center sm:p-6 lg:p-8">
      <div
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-ink-950/40 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-labelledby="product-modal-title"
        className="relative flex h-full w-full max-w-[1400px] animate-scale-in flex-col overflow-hidden border border-snow-200 bg-snow-50 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] sm:h-auto sm:max-h-[92vh]"
      >
        <button
          data-autofocus
          type="button"
          onClick={onClose}
          aria-label={t('closeDetails')}
          className="absolute end-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-snow-50/80 text-ink-950 backdrop-blur-sm transition-colors duration-300 hover:text-ink-950"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[1.02fr_1fr] lg:overflow-hidden">
          <figure className="relative flex flex-col justify-between overflow-hidden border-b border-snow-200 bg-snow-100 px-6 py-7 sm:px-10 lg:border-b-0 lg:border-e">
            <div aria-hidden="true" className="mashrabiya-band pointer-events-none absolute inset-0" />
            <figcaption className="relative flex items-center gap-4">
              <span className="ticket text-green-600">
                {lang === 'ar' ? 'رقم' : 'No.'} {formatOrdinal(catalogue, lang)}
              </span>
              {(product.isNew || product.bestseller) && (
                <span className="ticket text-green-600">
                  {product.isNew ? t('newBadge') : t('bestsellerBadge')}
                </span>
              )}
            </figcaption>

            <div className="relative mx-auto h-[15rem] w-full py-4 sm:h-[21rem] lg:h-auto lg:min-h-0 lg:flex-1 lg:py-8">
              <BottleVisual palette={product.palette} catalogue={catalogue} label={concentration?.abbr} />
            </div>

            <p className="ticket relative text-center text-snow-600">
              {tr(FAMILY_BY_ID[product.family])}
            </p>
          </figure>

          <div className="flex flex-col overflow-y-auto px-6 py-9 sm:px-10 lg:px-12 lg:py-11">
            <h2 id="product-modal-title" className="t-h2 pe-12">
              {name}
            </h2>
            <p className="t-body mt-3 text-[17px]">{tr(product.tagline)}</p>

            <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-snow-200 py-6 sm:grid-cols-3">
              {[
                [t('concentrationLabel'), tr(concentration)],
                [t('intensityLabel'), tr(SILLAGE_BY_ID[product.projectionSillage])],
                [t('introduced'), year],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="ticket text-snow-600">{label}</dt>
                  <dd className="t-body mt-1.5 text-[14px] text-ink-950">{value}</dd>
                </div>
              ))}
            </dl>

            <section className="mt-7">
              <h3 className="ticket text-green-600">{t('aboutThis')}</h3>
              <p className="t-body mt-3">{tr(product.description)}</p>
            </section>

            <section className="mt-8">
              <h3 className="ticket text-green-600">{t('theComposition')}</h3>
              <dl className="mt-3 border-t border-snow-200">
                {NOTE_ROWS.map(([key, field]) => (
                  <div
                    key={key}
                    className="flex items-baseline gap-5 border-b border-snow-200 py-3 last:border-b-0"
                  >
                    <dt className="ticket w-16 shrink-0 text-snow-600">{t(key)}</dt>
                    <dd className="t-body text-[14px] text-ink-950">
                      {product[field].map((note) => tr(note)).join(lang === 'ar' ? '، ' : ', ')}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-auto pt-9">
              <FormatToggle
                product={product}
                value={format.id}
                onChange={(formatId) => setChoice({ productId: product.id, formatId })}
              />
              <div className="mt-5 flex items-baseline justify-end">
                <span className="t-figure text-[1.6rem] leading-none text-ink-950">
                  {formatPrice(format.priceFils, lang)}
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

              <p className="ticket mt-4 text-center text-snow-600">{t('securePayment')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
