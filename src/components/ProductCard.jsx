import { useEffect, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { useCart } from '../context/cart-context'
import { CATALOGUE_NUMBERS, CONCENTRATION_AR, FAMILY_AR, INTENSITY_AR } from '../data/products'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatOrdinal, formatPrice } from '../lib/format'

const NOTE_ROWS = ['top', 'heart', 'base']

/**
 * A catalogue plate framed in the mashrabiya lattice: catalogue number, the
 * vial on a tinted ground, then the entry as a ruled table. Controls are sans
 * in both scripts — Cormorant is display-only on this dark ground.
 */
export default function ProductCard({ product, index = 0, priceRange, compact = false }) {
  const { addItem } = useCart()
  const { lang, t, pick } = useLocale()
  const [justAdded, setJustAdded] = useState(false)

  // A product qualifies for the price filter if ANY size is in range, so the
  // card must open on a size inside that range or it advertises a price the
  // shopper just filtered out.
  const inRange = priceRange
    ? product.sizes.filter((s) => s.price >= priceRange[0] && s.price <= priceRange[1])
    : product.sizes
  const preferredMl = (inRange[0] ?? product.sizes[0]).ml
  const [selectedMl, setSelectedMl] = useState(preferredMl)

  useEffect(() => {
    setSelectedMl((current) =>
      inRange.length > 0 && !inRange.some((s) => s.ml === current) ? inRange[0].ml : current,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredMl, inRange.length])

  const size = product.sizes.find((entry) => entry.ml === selectedMl) ?? product.sizes[0]
  const catalogue = CATALOGUE_NUMBERS[product.id]

  const handleAdd = () => {
    addItem(product, size)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  const name = pick(product.name, product.ar.name)

  return (
    <article
      className="group flex animate-fade-up flex-col border border-pearl-50/[0.14] bg-midnight-850 transition-colors duration-500 hover:border-jade-500/50"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="flex items-center justify-between border-b border-pearl-50/[0.14] px-5 py-3">
        <span className="ticket text-saffron-300">
          {lang === 'ar' ? 'رقم' : 'No.'} {formatOrdinal(catalogue, lang)}
        </span>
        <span className="ticket text-pearl-400">{pick(product.family, FAMILY_AR[product.family])}</span>
      </div>

      <div className="relative overflow-hidden bg-midnight-800">
        <div aria-hidden="true" className="mashrabiya-band pointer-events-none absolute inset-0" />
        {(product.isNew || product.bestseller) && (
          <span className="ticket absolute start-5 top-4 z-10 text-jade-300">
            {product.isNew ? t('newBadge') : t('bestsellerBadge')}
          </span>
        )}
        <div
          className={classNames(
            'relative mx-auto py-8 transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]',
            compact ? 'h-[15rem]' : 'h-[18.5rem]',
          )}
        >
          <BottleVisual palette={product.palette} catalogue={catalogue} />
        </div>
      </div>

      <div className="flex flex-1 flex-col border-t border-pearl-50/[0.14] px-5 pb-5 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="t-title">{name}</h3>
          <span className="t-figure shrink-0 text-[1.3rem] leading-none text-pearl-50">
            {formatPrice(size.price, lang)}
          </span>
        </div>

        <p className="t-body mt-2.5">{pick(product.tagline, product.ar.tagline)}</p>

        <p className="ticket mt-4 text-pearl-400">
          {pick(product.concentration, CONCENTRATION_AR[product.concentration])} ·{' '}
          {pick(product.intensity, INTENSITY_AR[product.intensity])}
        </p>

        {/* Pyramid, omitted on the compact merchandised rows. */}
        <dl className={classNames('mt-5 border-t border-pearl-50/[0.14]', compact && 'hidden')}>
          {NOTE_ROWS.map((key) => (
            <div
              key={key}
              className="flex items-baseline gap-4 border-b border-pearl-50/[0.08] py-2.5 last:border-b-0"
            >
              <dt className="ticket w-14 shrink-0 text-pearl-400">{t(key)}</dt>
              <dd className="t-body text-pearl-100">
                {pick(product.notes[key], product.ar.notes[key]).join(lang === 'ar' ? '، ' : ', ')}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto pt-6">
          <div
            role="radiogroup"
            aria-label={`${name} — ${t('price')}`}
            className="flex border border-pearl-50/20"
          >
            {product.sizes.map((option) => (
              <button
                key={option.ml}
                type="button"
                role="radio"
                aria-checked={option.ml === selectedMl}
                onClick={() => setSelectedMl(option.ml)}
                className={classNames(
                  'flex-1 py-2.5 font-sans text-[11px] tracking-label transition-colors duration-300 rtl:font-sans-ar rtl:tracking-normal',
                  option.ml === selectedMl
                    ? 'bg-midnight-700 text-pearl-50'
                    : 'text-pearl-400 hover:text-pearl-100',
                )}
              >
                {option.ml} {lang === 'ar' ? 'مل' : 'ml'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`${t('addToCart')} — ${name}`}
            className={classNames(
              'mt-2 flex w-full items-center justify-center gap-2.5 py-3 font-sans text-[11px] uppercase tracking-label transition-colors duration-300 rtl:font-sans-ar rtl:normal-case rtl:tracking-normal',
              justAdded
                ? 'bg-jade-400 text-midnight-950'
                : 'bg-jade-600 text-pearl-50 hover:bg-jade-500',
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
