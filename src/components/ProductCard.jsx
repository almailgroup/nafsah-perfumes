import { useState } from 'react'
import { Check, Plus, Star } from 'lucide-react'
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
      className="group relative flex animate-fade-up flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-ink-900/70 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/25 hover:shadow-[0_28px_60px_-28px_rgba(0,0,0,0.9)]"
      style={{ animationDelay: `${Math.min(index, 7) * 70}ms` }}
    >
      {/* Image placeholder */}
      <div className="relative overflow-hidden bg-gradient-to-b from-ink-850 to-ink-900 px-6 pb-4 pt-8">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% 45%, ${product.palette.via}22, transparent 68%)`,
          }}
        />

        <div className="absolute left-5 top-5 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-gold-400 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider2 text-ink-950">
              New
            </span>
          )}
          {product.bestseller && (
            <span className="rounded-full border border-white/20 bg-ink-950/70 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider2 text-cream-200 backdrop-blur">
              Bestseller
            </span>
          )}
        </div>

        <span className="absolute right-5 top-5 rounded-full border border-white/10 bg-ink-950/60 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider2 text-cream-300 backdrop-blur">
          {product.family}
        </span>

        <div className="relative mx-auto h-56 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
          <BottleVisual palette={product.palette} />
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-6 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-[1.6rem] leading-tight text-cream-50">
              {product.name}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-cream-400">{product.tagline}</p>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-cream-300">
            <Star className="h-3 w-3 fill-gold-300 text-gold-300" strokeWidth={0} />
            {product.rating}
          </span>
        </div>

        <p className="mt-3 text-[10px] uppercase tracking-wider2 text-gold-400/80">
          {product.concentration} · {product.intensity}
        </p>

        {/* Fragrance pyramid */}
        <dl className="mt-5 space-y-2 border-t hairline pt-5">
          {NOTE_ROWS.map((row) => (
            <div key={row.key} className="flex gap-3 text-xs">
              <dt className="w-12 shrink-0 text-[10px] uppercase tracking-wider2 text-cream-400">
                {row.label}
              </dt>
              <dd className="text-cream-200">{product.notes[row.key].join(' · ')}</dd>
            </div>
          ))}
        </dl>

        {/* Size + price + add */}
        <div className="mt-auto pt-6">
          <div className="flex items-center justify-between gap-3">
            <div
              role="radiogroup"
              aria-label={`Size for ${product.name}`}
              className="inline-flex rounded-full border border-white/10 p-1"
            >
              {product.sizes.map((option) => (
                <button
                  key={option.ml}
                  type="button"
                  role="radio"
                  aria-checked={option.ml === selectedMl}
                  onClick={() => setSelectedMl(option.ml)}
                  className={classNames(
                    'rounded-full px-3.5 py-1.5 text-[11px] font-medium transition-all duration-300',
                    option.ml === selectedMl
                      ? 'bg-gold-400 text-ink-950'
                      : 'text-cream-300 hover:text-cream-50',
                  )}
                >
                  {option.ml}ml
                </button>
              ))}
            </div>

            <span className="font-display text-2xl text-cream-50">{formatPrice(size.price)}</span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} ${size.ml}ml to cart`}
            className={classNames(
              'mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[11px] font-semibold uppercase tracking-wider2 transition-all duration-300 active:scale-[0.98]',
              justAdded
                ? 'border border-gold-400/60 bg-gold-400/15 text-gold-200'
                : 'border border-white/15 text-cream-100 hover:border-gold-400/60 hover:bg-gold-400 hover:text-ink-950',
            )}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" strokeWidth={2.5} />
                Added to Cart
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" strokeWidth={2} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
