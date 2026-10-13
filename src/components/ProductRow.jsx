import { useId } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { PRODUCTS } from '../data/products'
import { useLocale } from '../i18n/locale-context'
import { classNames } from '../lib/format'

const ROW_SIZE = 4

/**
 * A merchandised row: heading, "view all", and up to four compact cards.
 *
 * A row that carries fewer than four honest entries — three bestsellers, say —
 * closes with a tile into the whole catalogue rather than leaving a hole in
 * the grid or padding it with fragrances that do not carry the flag. `id`
 * makes the row a destination (the footer links to it).
 */
export default function ProductRow({ id, title, caption, products, onViewAll, onOpenProduct, tone = 'base' }) {
  const { t, tc, isRtl } = useLocale()
  const titleId = useId()
  const Forward = isRtl ? ArrowLeft : ArrowRight
  if (products.length === 0) return null

  const shown = products.slice(0, ROW_SIZE)
  const fill = shown.length < ROW_SIZE

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className={classNames('scroll-mt-32 py-16 sm:py-24', tone === 'tint' ? 'bg-snow-100' : 'bg-snow-50')}
    >
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <div className="flex items-end justify-between gap-6 border-b border-gold-500/60 pb-5">
          <div>
            <h2 id={titleId} className="t-h2">
              {title}
            </h2>
            {caption && <p className="ticket mt-3 text-snow-600">{caption}</p>}
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="ticket shrink-0 text-green-600 underline underline-offset-4 transition-colors hover:text-ink-950"
          >
            {t('viewAll')}
            <span className="sr-only"> — {title}</span>
          </button>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {shown.map((product, index) => (
            <li key={product.id} className="flex [&>article]:w-full">
              <ProductCard product={product} index={index} onOpen={onOpenProduct} compact />
            </li>
          ))}
          {fill && (
            <li className="hidden sm:flex">
              <button
                type="button"
                onClick={onViewAll}
                className="group relative flex w-full flex-col items-start justify-end gap-5 overflow-hidden border border-green-700 bg-green-700 p-6 text-start transition-colors duration-300 hover:border-green-600 hover:bg-green-600 sm:p-7"
              >
                <span aria-hidden="true" className="mashrabiya-band mashrabiya-on-green pointer-events-none absolute inset-0" />
                <span className="relative grid h-12 w-12 place-items-center rounded-full border border-gold-300/70 text-gold-300">
                  <Forward
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </span>
                <span className="relative">
                  <span className="t-title block !text-snow-50">{t('finder.row.allTitle')}</span>
                  <span className="ticket mt-2 block text-gold-300 transition-colors duration-300 group-hover:text-snow-200">
                    {tc('finder.row.count', PRODUCTS.length)}
                  </span>
                </span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
