import { ArrowLeft, ArrowRight } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { fromPriceFils, PRODUCTS } from '../data/products'
import { CONCENTRATION_BY_ID, FAMILIES } from '../data/taxonomy'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatPrice } from '../lib/format'

const cheapest = (products) => (products.length ? Math.min(...products.map(fromPriceFils)) : null)

// One tile per family, in display order. A family with nothing in it yet
// still shows, quietly, without a bottle, a price or a link to an empty grid.
const TILES = FAMILIES.map((family) => {
  const members = PRODUCTS.filter((p) => p.family === family.id)
  return { family, face: members[0] ?? null, count: members.length, fromFils: cheapest(members) }
})
const ALL_FROM = cheapest(PRODUCTS)

// Seven families and the whole catalogue make eight: four rows of two, then
// two rows of four, never a stray tile. Where a tile is narrow — two to a
// phone, four to a 1024px screen — the vial stands over the words; where it
// is wide, beside them.
const TILE = classNames(
  'relative flex h-full w-full flex-col items-start gap-3 overflow-hidden border p-4 text-start',
  'sm:flex-row sm:items-center sm:gap-5 sm:p-5',
  'lg:flex-col lg:items-start lg:gap-4 xl:flex-row xl:items-center xl:gap-5',
)
const VIAL = 'relative h-20 w-14 shrink-0 sm:h-24 sm:w-16'

function Price({ fils, tone = 'paper' }) {
  const { lang, t } = useLocale()
  return (
    <span className={classNames('ticket mt-2 block', tone === 'green' ? 'text-snow-300' : 'text-snow-600')}>
      {t('from')}{' '}
      <span className={classNames('t-figure whitespace-nowrap text-[14px]', tone === 'green' ? 'text-snow-50' : 'text-ink-950')}>
        {formatPrice(fils, lang)}
      </span>
    </span>
  )
}

export default function CategoryTiles({ onSelectFamily }) {
  const { t, tc, tr, isRtl } = useLocale()
  const Forward = isRtl ? ArrowLeft : ArrowRight

  return (
    <section aria-labelledby="family-tiles-title" className="bg-snow-50 py-16 sm:py-24">
      <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <div className="border-b border-gold-500/60 pb-5">
          <h2 id="family-tiles-title" className="t-h2">
            {t('shopByFamily')}
          </h2>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {TILES.map(({ family, face, count, fromFils }) => {
            const body = (
              <>
                <span aria-hidden="true" className="mashrabiya-band pointer-events-none absolute inset-0" />
                <span className={VIAL}>
                  {face && (
                    <BottleVisual
                      palette={face.palette}
                      fillLevel={0.9}
                      label={CONCENTRATION_BY_ID[face.concentration]?.abbr}
                    />
                  )}
                </span>
                <span className="relative min-w-0">
                  <span className="t-title block max-sm:!text-[1.125rem]">
                    {tr(family.short)}
                  </span>
                  <span className="ticket mt-2 block text-snow-600">
                    {count > 0 ? tc('catalogue.count', count) : t('catalogue.tiles.empty')}
                  </span>
                  {fromFils !== null && <Price fils={fromFils} />}
                </span>
              </>
            )
            return (
              <li key={family.id}>
                {count > 0 ? (
                  <button
                    type="button"
                    onClick={() => onSelectFamily(family.id)}
                    className={classNames(
                      TILE,
                      'group border-snow-200 bg-snow-100 transition-[border-color,box-shadow] duration-300 hover:border-green-600/50 hover:shadow-[0_14px_34px_-24px_rgba(8,20,15,0.45)]',
                    )}
                  >
                    {body}
                  </button>
                ) : (
                  <div className={classNames(TILE, 'border-dashed border-snow-300 bg-snow-50')}>{body}</div>
                )}
              </li>
            )
          })}

          <li>
            <button
              type="button"
              onClick={() => onSelectFamily(null)}
              className={classNames(
                TILE,
                'group border-green-700 bg-green-700 transition-colors duration-300 hover:border-green-600 hover:bg-green-600',
              )}
            >
              <span aria-hidden="true" className="mashrabiya mashrabiya-on-green pointer-events-none absolute inset-0 opacity-[0.07]" />
              <span className={classNames(VIAL, 'grid place-items-center')}>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-300/70 text-gold-300 sm:h-12 sm:w-12">
                  <Forward
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5"
                    strokeWidth={1.5}
                  />
                </span>
              </span>
              <span className="relative min-w-0">
                <span className="t-title block !text-snow-50 max-sm:!text-[1.125rem]">
                  {t('catalogue.tiles.all')}
                </span>
                {/* Gold reads only on green-700; on the lighter hover green it turns to snow. */}
                <span className="ticket mt-2 block text-gold-300 transition-colors duration-300 group-hover:text-snow-200">
                  {tc('catalogue.count', PRODUCTS.length)}
                </span>
                {ALL_FROM !== null && <Price fils={ALL_FROM} tone="green" />}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </section>
  )
}
