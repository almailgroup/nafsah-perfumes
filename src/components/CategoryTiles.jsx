import BottleVisual from './BottleVisual'
import { FAMILY_AR, PRODUCTS, SCENT_FAMILIES } from '../data/products'
import { useLocale } from '../i18n/locale-context'
import { formatNumber, formatPrice } from '../lib/format'

const FACE = Object.fromEntries(
  SCENT_FAMILIES.map((f) => [f, PRODUCTS.find((p) => p.family === f)]),
)
const COUNTS = Object.fromEntries(
  SCENT_FAMILIES.map((f) => [f, PRODUCTS.filter((p) => p.family === f).length]),
)
const FROM = Object.fromEntries(
  SCENT_FAMILIES.map((f) => [
    f,
    Math.min(...PRODUCTS.filter((p) => p.family === f).flatMap((p) => p.sizes.map((s) => s.price))),
  ]),
)

export default function CategoryTiles({ onSelectFamily }) {
  const { lang, t, pick } = useLocale()

  return (
    <section className="bg-midnight-950 py-14 sm:py-16">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <div className="flex items-end justify-between gap-6 border-b border-pearl-50/[0.14] pb-5">
          <h2 className="t-h2">{t('shopByFamily')}</h2>
          <button
            type="button"
            onClick={() => onSelectFamily(null)}
            className="ticket shrink-0 text-jade-300 underline underline-offset-4 transition-colors hover:text-jade-200"
          >
            {t('all12')}
          </button>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {SCENT_FAMILIES.map((family) => (
            <li key={family}>
              <button
                type="button"
                onClick={() => onSelectFamily(family)}
                className="group relative flex w-full items-center gap-4 overflow-hidden border border-pearl-50/[0.14] bg-midnight-900 p-4 text-start transition-colors duration-300 hover:border-jade-500/50 sm:gap-5 sm:p-5"
              >
                <span
                  aria-hidden="true"
                  className="mashrabiya-band pointer-events-none absolute inset-0"
                />
                <span className="relative h-20 w-14 shrink-0 sm:h-24 sm:w-16">
                  <BottleVisual palette={FACE[family].palette} fillLevel={0.9} />
                </span>
                <span className="relative min-w-0">
                  <span className="t-title block">{pick(family, FAMILY_AR[family])}</span>
                  <span className="ticket mt-2 block text-pearl-400">
                    {formatNumber(COUNTS[family], lang)} {t('extraits')}
                  </span>
                  <span className="ticket mt-2 block text-pearl-300">
                    {t('from')}{' '}
                    <span className="t-figure text-[14px] text-pearl-50">
                      {formatPrice(FROM[family], lang)}
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
