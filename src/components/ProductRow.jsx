import ProductCard from './ProductCard'

/**
 * A merchandised row: heading, a "view all" that drops the shopper into the
 * filtered catalogue, and four compact cards.
 */
export default function ProductRow({ title, caption, products, onViewAll, tone = 'paper' }) {
  if (products.length === 0) return null

  return (
    <section className={tone === 'tint' ? 'bg-paper-100 py-14 sm:py-16' : 'bg-paper-50 py-14 sm:py-16'}>
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <div className="flex items-end justify-between gap-6 border-b border-noir-950/[0.14] pb-5">
          <div>
            <h2 className="font-display text-[2rem] font-normal leading-none text-noir-950 sm:text-[2.5rem]">
              {title}
            </h2>
            {caption && <p className="ticket mt-3 text-noir-500">{caption}</p>}
          </div>
          <button
            type="button"
            onClick={onViewAll}
            className="ticket shrink-0 text-noir-600 underline underline-offset-4 transition-colors hover:text-oxblood-600"
          >
            View all
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} compact />
          ))}
        </div>
      </div>
    </section>
  )
}
