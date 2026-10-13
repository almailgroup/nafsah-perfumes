import { useEffect, useId, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import BottleVisual from './BottleVisual'
import FormatToggle from './product/FormatToggle'
import { useCart } from '../context/cart-context'
import { bottleFormats, CATALOGUE_NUMBERS, concentrationFor, formatOf } from '../data/products'
import { CONCENTRATION_BY_ID, FAMILY_BY_ID, SILLAGE_BY_ID } from '../data/taxonomy'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatOrdinal, formatPrice } from '../lib/format'

const NOTE_ROWS = [
  ['top', 'topNotes'],
  ['heart', 'heartNotes'],
  ['base', 'baseNotes'],
]

/**
 * A catalogue plate framed in the mashrabiya lattice: catalogue number, the
 * vial on a tinted ground, then the entry as a ruled table. Controls are sans
 * in both scripts — Cormorant is display-only on this dark ground.
 */
export default function ProductCard({ product, index = 0, priceRange, compact = false, onOpen }) {
  const { addItem } = useCart()
  const { lang, t, tr } = useLocale()
  const nameId = useId()
  const [justAdded, setJustAdded] = useState(false)

  // A product qualifies for the price filter if ANY bottle is in range, so the
  // card must open on a format inside that range or it advertises a price the
  // shopper just filtered out. Samples are never filtered on.
  const inRange = priceRange
    ? bottleFormats(product).filter((f) => f.priceFils >= priceRange[0] && f.priceFils <= priceRange[1])
    : product.formats
  const preferredId = (inRange[0] ?? product.formats[0]).id
  const [selectedId, setSelectedId] = useState(preferredId)

  useEffect(() => {
    setSelectedId((current) =>
      inRange.length > 0 && !inRange.some((f) => f.id === current) ? inRange[0].id : current,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredId, inRange.length])

  const format = formatOf(product, selectedId) ?? product.formats[0]
  const concentration = CONCENTRATION_BY_ID[concentrationFor(product, format.id)]
  const catalogue = CATALOGUE_NUMBERS[product.id]

  const handleAdd = () => {
    addItem(product, format.id)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  const name = tr(product.name)

  return (
    <article
      className="group flex animate-fade-up flex-col border border-snow-200 bg-snow-50 transition-[border-color,box-shadow] duration-500 hover:border-green-600/50 hover:shadow-[0_18px_44px_-28px_rgba(8,20,15,0.45)]"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="flex items-center justify-between border-b border-snow-200 px-5 py-3">
        <span className="ticket text-green-600">
          {lang === 'ar' ? 'رقم' : 'No.'} {formatOrdinal(catalogue, lang)}
        </span>
        <span className="ticket text-snow-600">{tr(FAMILY_BY_ID[product.family]?.short)}</span>
      </div>

      <button
        type="button"
        onClick={() => onOpen?.(product)}
        aria-label={`${t('viewDetails')} — ${name}`}
        className="relative block w-full overflow-hidden bg-snow-100 text-start"
      >
        <div aria-hidden="true" className="mashrabiya-band pointer-events-none absolute inset-0" />
        {(product.isNew || product.bestseller) && (
          <span className="ticket absolute start-5 top-4 z-10 text-green-600">
            {product.isNew ? t('newBadge') : t('bestsellerBadge')}
          </span>
        )}
        <div
          className={classNames(
            'relative mx-auto py-8 transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]',
            compact ? 'h-[15rem]' : 'h-[18.5rem]',
          )}
        >
          <BottleVisual palette={product.palette} catalogue={catalogue} label={concentration?.abbr} />
        </div>
        <span
          aria-hidden="true"
          className="ticket pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center bg-gradient-to-t from-snow-50 via-snow-50/85 to-transparent pb-4 pt-12 text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {t('viewDetails')}
        </span>
      </button>

      <div className="flex flex-1 flex-col border-t border-snow-200 px-5 pb-5 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 id={nameId} className="t-title">
            <button
              type="button"
              onClick={() => onOpen?.(product)}
              className="text-start transition-colors duration-300 hover:text-green-600"
            >
              {name}
            </button>
          </h3>
          <span className="t-figure shrink-0 text-[1.3rem] leading-none text-ink-950">
            {formatPrice(format.priceFils, lang)}
          </span>
        </div>

        <p className="t-body mt-2.5">{tr(product.tagline)}</p>

        <p className="ticket mt-4 text-snow-600">
          {tr(concentration)} · {tr(SILLAGE_BY_ID[product.projectionSillage])}
        </p>

        {/* Pyramid, omitted on the compact merchandised rows. */}
        <dl className={classNames('mt-5 border-t border-snow-200', compact && 'hidden')}>
          {NOTE_ROWS.map(([key, field]) => (
            <div
              key={key}
              className="flex items-baseline gap-4 border-b border-snow-200 py-2.5 last:border-b-0"
            >
              <dt className="ticket w-14 shrink-0 text-snow-600">{t(key)}</dt>
              <dd className="t-body text-ink-950">
                {product[field].map((note) => tr(note)).join(lang === 'ar' ? '، ' : ', ')}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto pt-6">
          <FormatToggle
            product={product}
            value={format.id}
            onChange={setSelectedId}
            variant="compact"
            labelledBy={nameId}
          />

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`${t('addToCart')} — ${name}`}
            className={classNames(
              'mt-2 flex w-full items-center justify-center gap-2.5 py-3 font-sans text-[11px] uppercase tracking-label transition-colors duration-300 rtl:font-sans-ar rtl:normal-case rtl:tracking-normal',
              justAdded
                ? 'bg-green-600 text-snow-50'
                : 'bg-green-600 text-snow-50 hover:bg-green-700',
            )}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
                {t('added')}
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                {t('addToCart')}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
