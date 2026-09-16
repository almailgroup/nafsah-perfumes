import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { useCart } from '../context/cart-context'
import { CATALOGUE_NUMBERS } from '../data/products'
import { classNames, formatPrice } from '../lib/format'

const NOTE_ROWS = [
  { key: 'top', label: 'Top' },
  { key: 'heart', label: 'Heart' },
  { key: 'base', label: 'Base' },
]

/**
 * A catalogue plate: ruled frame, catalogue number, the vial on a tinted
 * ground, then the entry set as a small ruled table. Every control is Jost —
 * Cormorant is unusable at button and label size.
 */
export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const [selectedMl, setSelectedMl] = useState(product.sizes[0].ml)
  const [justAdded, setJustAdded] = useState(false)

  const size = product.sizes.find((entry) => entry.ml === selectedMl) ?? product.sizes[0]
  const catalogue = CATALOGUE_NUMBERS[product.id]

  const handleAdd = () => {
    addItem(product, size)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  return (
    <article
      className="group flex animate-fade-up flex-col border border-noir-950/[0.14] bg-paper-50 transition-colors duration-500 hover:border-noir-950/35"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* Plate header: catalogue number and family, as on a specimen card */}
      <div className="flex items-center justify-between border-b border-noir-950/[0.14] px-5 py-3">
        <span className="ticket text-oxblood-600">No. {catalogue}</span>
        <span className="ticket text-noir-500">{product.family}</span>
      </div>

      {/* The vial on a tinted ground */}
      <div className="relative overflow-hidden bg-paper-100">
        {(product.isNew || product.bestseller) && (
          <span className="ticket absolute left-5 top-4 z-10 text-noir-600">
            {product.isNew ? 'New' : 'Bestseller'}
          </span>
        )}
        <div className="relative mx-auto h-[18.5rem] py-8 transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]">
          <BottleVisual palette={product.palette} catalogue={catalogue} />
        </div>
      </div>

      {/* Entry */}
      <div className="flex flex-1 flex-col border-t border-noir-950/[0.14] px-5 pb-5 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="t-title">{product.name}</h3>
          <span className="t-figure text-[1.4rem] leading-none text-noir-950">
            {formatPrice(size.price)}
          </span>
        </div>

        <p className="mt-2.5 font-display text-[1.0625rem] font-medium italic leading-snug text-noir-600">
          {product.tagline}
        </p>

        <p className="t-label mt-4 text-noir-500">
          {product.concentration} · {product.intensity}
        </p>

        {/* Fragrance pyramid, set as a ruled table */}
        <dl className="mt-5 border-t border-noir-950/[0.14]">
          {NOTE_ROWS.map((row) => (
            <div
              key={row.key}
              className="flex gap-4 border-b border-noir-950/[0.08] py-2.5 last:border-b-0"
            >
              <dt className="ticket w-12 shrink-0 pt-1 text-noir-500">{row.label}</dt>
              <dd className="font-display text-[1.0625rem] font-medium leading-snug text-noir-800">
                {product.notes[row.key].join(', ')}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-auto pt-6">
          <div
            role="radiogroup"
            aria-label={`Size for ${product.name}`}
            className="flex border border-noir-950/20"
          >
            {product.sizes.map((option) => (
              <button
                key={option.ml}
                type="button"
                role="radio"
                aria-checked={option.ml === selectedMl}
                onClick={() => setSelectedMl(option.ml)}
                className={classNames(
                  'flex-1 py-2.5 font-sans text-[10px] uppercase tracking-label transition-colors duration-300',
                  option.ml === selectedMl
                    ? 'bg-noir-950 text-paper-50'
                    : 'text-noir-500 hover:text-noir-950',
                )}
              >
                {option.ml} ml
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} ${size.ml}ml to cart`}
            className={classNames(
              'mt-2 flex w-full items-center justify-center gap-2.5 border py-3 font-sans text-[10px] uppercase tracking-label transition-colors duration-300',
              justAdded
                ? 'border-oxblood-600 bg-oxblood-600 text-paper-50'
                : 'border-noir-950/25 text-noir-950 hover:border-noir-950 hover:bg-noir-950 hover:text-paper-50',
            )}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
                Added
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
