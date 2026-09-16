import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { useCart } from '../context/cart-context'
import { classNames, formatPrice } from '../lib/format'

const NOTE_ROWS = [
  { key: 'top', label: 'Top' },
  { key: 'heart', label: 'Heart' },
  { key: 'base', label: 'Base' },
]

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const [selectedMl, setSelectedMl] = useState(product.sizes[0].ml)
  const [justAdded, setJustAdded] = useState(false)

  const size = product.sizes.find((entry) => entry.ml === selectedMl) ?? product.sizes[0]

  const handleAdd = () => {
    addItem(product, size)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1400)
  }

  return (
    <article
      className="group flex animate-fade-up flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* Image panel — the only tinted surface; the bottle sits on a common
          baseline across the row so the grid reads as a set. */}
      <div className="relative overflow-hidden bg-ink-900">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% 55%, ${product.palette.via}1f, transparent 70%)`,
          }}
        />

        <div className="absolute left-5 top-5 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="text-[9px] uppercase tracking-wider2 text-bone-50">New</span>
          )}
          {product.bestseller && (
            <span className="text-[9px] uppercase tracking-wider2 text-bone-400">Bestseller</span>
          )}
        </div>

        <span className="absolute right-5 top-5 z-10 text-[9px] uppercase tracking-wider2 text-bone-400">
          {product.family}
        </span>

        <div className="relative mx-auto h-[19rem] pb-3 pt-10 transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]">
          <BottleVisual palette={product.palette} />
        </div>
      </div>

      {/* Details sit on the page canvas, not in a card */}
      <div className="flex flex-1 flex-col pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-[1.75rem] leading-none text-bone-50">{product.name}</h3>
          <span className="font-display text-xl leading-none text-bone-100 tabular-nums">
            {formatPrice(size.price)}
          </span>
        </div>

        <p className="mt-3 text-[13px] font-light leading-relaxed text-bone-400">
          {product.tagline}
        </p>

        <p className="mt-4 text-[9px] uppercase tracking-wider2 text-bone-500">
          {product.concentration} · {product.intensity} · {product.rating} ★
        </p>

        {/* Fragrance pyramid */}
        <dl className="mt-6 space-y-2.5 border-t hairline pt-5">
          {NOTE_ROWS.map((row) => (
            <div key={row.key} className="flex gap-4 text-[13px]">
              <dt className="w-11 shrink-0 pt-px text-[9px] uppercase tracking-wider2 text-bone-500">
                {row.label}
              </dt>
              <dd className="font-light text-bone-200">{product.notes[row.key].join(', ')}</dd>
            </div>
          ))}
        </dl>

        {/* Size + add */}
        <div className="mt-auto pt-7">
          <div
            role="radiogroup"
            aria-label={`Size for ${product.name}`}
            className="flex items-center gap-6"
          >
            {product.sizes.map((option) => (
              <button
                key={option.ml}
                type="button"
                role="radio"
                aria-checked={option.ml === selectedMl}
                onClick={() => setSelectedMl(option.ml)}
                className={classNames(
                  'relative py-1 text-[10px] uppercase tracking-wider2 transition-colors duration-300',
                  option.ml === selectedMl
                    ? 'text-bone-50'
                    : 'text-bone-500 hover:text-bone-200',
                )}
              >
                {option.ml} ml
                <span
                  className={classNames(
                    'absolute -bottom-0.5 left-0 h-px bg-bone-100 transition-all duration-300',
                    option.ml === selectedMl ? 'w-full' : 'w-0',
                  )}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} ${size.ml}ml to cart`}
            className={classNames(
              'mt-5 flex w-full items-center justify-center gap-2.5 border py-3.5 text-[10px] uppercase tracking-wider2 transition-colors duration-300',
              justAdded
                ? 'border-bone-300 bg-transparent text-bone-200'
                : 'border-white/20 text-bone-100 hover:border-bone-50 hover:bg-bone-50 hover:text-ink-950',
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
