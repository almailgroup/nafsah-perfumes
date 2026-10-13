import { useEffect, useId, useRef, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import BottleVisual from './BottleVisual'
import FormatToggle from './product/FormatToggle'
import RatingBadge from './reviews/RatingBadge'
import { useCart } from '../context/cart-context'
import { bottleFormats, CATALOGUE_NUMBERS, concentrationFor, formatOf } from '../data/products'
import { CONCENTRATION_BY_ID, FAMILY_BY_ID, FORMAT_BY_ID, SILLAGE_BY_ID } from '../data/taxonomy'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatOrdinal, formatPrice } from '../lib/format'

const NOTE_ROWS = [
  ['top', 'topNotes'],
  ['heart', 'heartNotes'],
  ['base', 'baseNotes'],
]

// How long the button says "Added" before it reads "Add to Cart" again.
const ADDED_MS = 1400

const noteLists = new Map()
const listNotes = (names, lang) => {
  if (!noteLists.has(lang)) noteLists.set(lang, new Intl.ListFormat(lang, { style: 'short', type: 'unit' }))
  return noteLists.get(lang).format(names)
}

const inRange = (format, range) => !range || (format.priceFils >= range[0] && format.priceFils <= range[1])

/**
 * A catalogue plate: catalogue number and family, the vial on a tinted
 * ground, then the entry — name, rating (once there are reviews), the "from"
 * price, tagline, pyramid — and the format toggle with Add to Cart, which
 * carries the chosen format's price.
 *
 * One tab stop opens the product page: the name. The vial is a larger mouse
 * target for the same action, kept out of the tab order.
 *
 * With a price filter on, the card opens on a bottle inside the range and its
 * "from" price is the cheapest bottle in that range, so it never advertises a
 * price the shopper just filtered out. Samples are never filtered on.
 */
export default function ProductCard({ product, index = 0, priceRange, compact = false, onOpen }) {
  const { addItem } = useCart()
  const { lang, t, tr } = useLocale()
  const uid = useId()
  const [choice, setChoice] = useState(null)
  const [justAdded, setJustAdded] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const addedTimer = useRef(null)

  useEffect(() => () => clearTimeout(addedTimer.current), [])

  const bottles = bottleFormats(product)
  const bottlesInRange = bottles.filter((format) => inRange(format, priceRange))
  const preferred = bottlesInRange[0] ?? product.formats[0]
  // The shopper's own choice stands while the filter allows it.
  const chosen = choice ? formatOf(product, choice) : null
  const format =
    chosen && (FORMAT_BY_ID[chosen.id]?.kind === 'sample' || inRange(chosen, priceRange)) ? chosen : preferred

  const priced = bottlesInRange.length ? bottlesInRange : bottles.length ? bottles : product.formats
  const fromFils = Math.min(...priced.map((f) => f.priceFils))
  const showFrom = priced.length > 1

  const concentration = CONCENTRATION_BY_ID[concentrationFor(product, format.id)]
  const catalogue = CATALOGUE_NUMBERS[product.id]
  const name = tr(product.name)
  const formatName = tr(FORMAT_BY_ID[format.id])
  const open = () => onOpen?.(product)

  const handleAdd = () => {
    addItem(product, format.id)
    setJustAdded(true)
    setAnnouncement(t('trust.card.added', { name, format: formatName }))
    clearTimeout(addedTimer.current)
    addedTimer.current = setTimeout(() => {
      setJustAdded(false)
      setAnnouncement('')
    }, ADDED_MS)
  }

  return (
    <article
      aria-labelledby={`${uid}-name`}
      className="group flex animate-fade-up flex-col border border-snow-200 bg-snow-50 transition-[border-color,box-shadow] duration-500 hover:border-green-600/50 hover:shadow-[0_18px_44px_-28px_rgba(8,20,15,0.45)]"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="flex items-center justify-between gap-4 border-b border-snow-200 px-5 py-3">
        <span className="ticket text-green-600">
          {t('trust.card.number', { number: formatOrdinal(catalogue, lang) })}
        </span>
        <span className="ticket text-end text-snow-600">{tr(FAMILY_BY_ID[product.family]?.short)}</span>
      </div>

      {/* The vial: a click target for the same action as the name, not a second tab stop. */}
      <div onClick={open} className="relative cursor-pointer overflow-hidden bg-snow-100">
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
          className="ticket pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center bg-gradient-to-t from-snow-50 via-snow-50/85 to-transparent pb-4 pt-12 text-green-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-has-[h3_button:focus-visible]:opacity-100"
        >
          {t('viewDetails')}
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t border-snow-200 px-5 pb-5 pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 id={`${uid}-name`} className="t-title min-w-0">
            <button
              type="button"
              onClick={open}
              className="text-start transition-colors duration-300 hover:text-green-600"
            >
              {name}
              <span className="sr-only"> — {t('viewDetails')}</span>
            </button>
          </h3>
          <p className="flex shrink-0 flex-col items-end pt-1 text-end">
            {showFrom && <span className="ticket text-snow-600">{t('from')}</span>}
            <span className="t-figure text-[1.2rem] leading-tight text-ink-950">{formatPrice(fromFils, lang)}</span>
          </p>
        </div>

        <RatingBadge productId={product.id} className="mt-2" />

        <p className="t-body mt-2.5">{tr(product.tagline)}</p>

        <p className="ticket mt-4 text-snow-600">
          {tr(concentration)} · {tr(SILLAGE_BY_ID[product.projectionSillage])}
        </p>

        {/* Pyramid, omitted on the compact merchandised rows. */}
        {!compact && (
          <dl className="mt-5 border-t border-snow-200">
            {NOTE_ROWS.map(([key, field]) => (
              <div key={key} className="flex items-baseline gap-4 border-b border-snow-200 py-2.5 last:border-b-0">
                <dt className="ticket w-14 shrink-0 text-snow-600">{t(key)}</dt>
                <dd className="t-body text-ink-950">{listNotes(product[field].map(tr), lang)}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-auto pt-6">
          <span id={`${uid}-formats`} className="sr-only">
            {t('trust.card.formatLabel', { name })}
          </span>
          <FormatToggle
            product={product}
            value={format.id}
            onChange={setChoice}
            variant="compact"
            labelledBy={`${uid}-formats`}
          />

          <button
            type="button"
            onClick={handleAdd}
            className="mt-2 flex w-full items-center justify-center gap-2.5 bg-green-600 px-4 py-3 font-sans text-[11px] font-medium uppercase tracking-label text-snow-50 transition-colors duration-300 hover:bg-green-700 rtl:font-sans-ar rtl:text-[13px] rtl:normal-case rtl:tracking-normal"
          >
            {justAdded ? (
              <>
                <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
                {t('added')}
              </>
            ) : (
              <>
                <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
                {t('addToCart')}
                <span aria-hidden="true" className="opacity-60">
                  ·
                </span>
                <span className="tabular-nums">{formatPrice(format.priceFils, lang)}</span>
              </>
            )}
            <span className="sr-only"> — {t('trust.card.addContext', { name, format: formatName })}</span>
          </button>

          {/* Announces the add; the button's own text changes too, but a
              screen reader does not re-read a button it has left. */}
          <p role="status" className="sr-only">
            {announcement}
          </p>
        </div>
      </div>
    </article>
  )
}
