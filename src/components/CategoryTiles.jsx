import BottleVisual from './BottleVisual'
import { PRODUCTS, SCENT_FAMILIES } from '../data/products'
import { formatPrice } from '../lib/format'

/** One representative fragrance per family, used as the tile's swatch. */
const FACE = Object.fromEntries(
  SCENT_FAMILIES.map((family) => [family, PRODUCTS.find((p) => p.family === family)]),
)

const COUNTS = Object.fromEntries(
  SCENT_FAMILIES.map((family) => [family, PRODUCTS.filter((p) => p.family === family).length]),
)

const FROM = Object.fromEntries(
  SCENT_FAMILIES.map((family) => [
    family,
    Math.min(...PRODUCTS.filter((p) => p.family === family).flatMap((p) => p.sizes.map((s) => s.price))),
  ]),
)

export default function CategoryTiles({ onSelectFamily }) {
  return (
    <section className="bg-paper-50 py-14 sm:py-16">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <div className="flex items-end justify-between gap-6 border-b border-noir-950/[0.14] pb-5">
          <h2 className="font-display text-[2rem] font-normal leading-none text-noir-950 sm:text-[2.5rem]">
            Shop by family
          </h2>
          <button
            type="button"
            onClick={() => onSelectFamily(null)}
            className="ticket shrink-0 text-noir-600 underline underline-offset-4 transition-colors hover:text-oxblood-600"
          >
            All 12
          </button>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {SCENT_FAMILIES.map((family) => (
            <li key={family}>
              <button
                type="button"
                onClick={() => onSelectFamily(family)}
                className="group flex w-full items-center gap-4 border border-noir-950/[0.14] bg-paper-100 p-4 text-left transition-colors duration-300 hover:border-noir-950/40 sm:gap-5 sm:p-5"
              >
                <span className="h-20 w-14 shrink-0 overflow-hidden sm:h-24 sm:w-16">
                  <BottleVisual palette={FACE[family].palette} fillLevel={0.9} />
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[1.5rem] font-medium leading-none text-noir-950 sm:text-[1.75rem]">
                    {family}
                  </span>
                  <span className="ticket mt-2 block text-noir-500">
                    {COUNTS[family]} extraits
                  </span>
                  <span className="mt-2 block font-sans text-[12px] font-light text-noir-600">
                    from{' '}
                    <span className="t-figure text-[14px] text-noir-950">
                      {formatPrice(FROM[family])}
                    </span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
