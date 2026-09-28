import ProductCard from './ProductCard'
import { useLocale } from '../i18n/locale-context'

/** A merchandised row: heading, "view all", and four compact cards. */
export default function ProductRow({ title, caption, products, onViewAll, onOpenProduct, tone = 'base' }) {
  const { t } = useLocale()
  if (products.length === 0) return null

  return (
    <section className={tone === 'tint' ? 'bg-midnight-900 py-14 sm:py-16' : 'bg-midnight-950 py-14 sm:py-16'}>
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <div className="flex items-end justify-between gap-6 border-b border-pearl-50/[0.14] pb-5">
          <div>
            <h2 className="t-h2">{title}</h2>
            {caption && <p className="ticket mt-3 text-pearl-400">{caption}</p>}
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="ticket shrink-0 text-green-300 underline underline-offset-4 transition-colors hover:text-green-200"
          >
            {t('viewAll')}
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onOpen={onOpenProduct}
              compact
            />
          ))}
        </div>
      </div>
    </section>
  )
}
