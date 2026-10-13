import BottleVisual from './BottleVisual'
import { fromPriceFils, PRODUCTS } from '../data/products'
import { CONCENTRATION_BY_ID, FAMILIES } from '../data/taxonomy'
import { useLocale } from '../i18n/locale-context'
import { formatNumber, formatPrice } from '../lib/format'

// One tile per family, in display order. A family with nothing in it yet
// still gets its tile, just without a bottle or a price.
const TILES = FAMILIES.map((family) => {
  const members = PRODUCTS.filter((p) => p.family === family.id)
  return {
    family,
    face: members[0] ?? null,
    count: members.length,
    fromFils: members.length > 0 ? Math.min(...members.map(fromPriceFils)) : null,
  }
})

export default function CategoryTiles({ onSelectFamily }) {
  const { lang, t, tr } = useLocale()

  return (
    <section className="bg-snow-50 py-16 sm:py-24">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <div className="flex items-end justify-between gap-6 border-b border-gold-500/60 pb-5">
          <h2 className="t-h2">{t('shopByFamily')}</h2>
          <button
            type="button"
            onClick={() => onSelectFamily(null)}
            className="ticket shrink-0 text-green-600 underline underline-offset-4 transition-colors hover:text-ink-950"
          >
            {t('all12')}
          </button>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {TILES.map(({ family, face, count, fromFils }) => (
            <li key={family.id}>
              <button
                type="button"
                onClick={() => onSelectFamily(family.id)}
                className="group relative flex h-full w-full items-center gap-3 overflow-hidden border border-snow-200 bg-snow-100 p-3 text-start transition-[border-color,box-shadow] duration-300 hover:border-green-600/50 hover:shadow-[0_14px_34px_-24px_rgba(8,20,15,0.45)] sm:gap-5 sm:p-5"
              >
                <span
                  aria-hidden="true"
                  className="mashrabiya-band pointer-events-none absolute inset-0"
                />
                <span className="relative h-16 w-11 shrink-0 sm:h-24 sm:w-16">
                  {face && (
                    <BottleVisual
                      palette={face.palette}
                      fillLevel={0.9}
                      label={CONCENTRATION_BY_ID[face.concentration]?.abbr}
                    />
                  )}
                </span>
                <span className="relative min-w-0">
                  {/* Two columns on a phone leave little room for the longer family names. */}
                  <span className="t-title block max-sm:!text-[1.125rem]">{tr(family.short)}</span>
                  <span className="ticket mt-2 block text-snow-600">
                    {formatNumber(count, lang)} {t('extraits')}
                  </span>
                  {fromFils !== null && (
                    <span className="ticket mt-2 block text-snow-600">
                      {t('from')}{' '}
                      <span className="t-figure text-[14px] text-ink-950">
                        {formatPrice(fromFils, lang)}
                      </span>
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
