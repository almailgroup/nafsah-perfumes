import { ArrowRight, Droplet, Flame, SprayCan } from 'lucide-react'
import BottleVisual from '../BottleVisual'
import { layeringPairs } from './derive'
import { concentrationFor } from '../../data/products'
import { CONCENTRATION_BY_ID, LAYERING_KIND_BY_ID } from '../../data/taxonomy'
import { useLocale } from '../../i18n/locale-context'

const KIND_ICON = { bukhoor: Flame, attar: Droplet, spray: SprayCan }

/**
 * Gulf layering, one card per pairing, in the order the layers go on:
 * bukhoor smoke, then oil, then the spray. A pairing with a fragrance from
 * the catalogue links to it; `onOpenProduct` swaps the overlay over to that
 * fragrance.
 */
export default function LayeringGuide({ product, onOpenProduct }) {
  const { t, tr } = useLocale()
  const pairs = layeringPairs(product)
  if (pairs.length === 0) return null

  return (
    <div>
      <p className="t-body max-w-[36rem] text-snow-600">{t('product.layering.intro')}</p>

      <ul className="mt-6 grid gap-3">
        {pairs.map(({ kind, partner, name, how, index }) => {
          const Icon = KIND_ICON[kind] ?? Droplet
          const title = partner ? tr(partner.name) : tr(name)
          return (
            <li key={index} className="flex gap-4 border border-snow-200 bg-snow-50 p-5 sm:gap-5 sm:p-6">
              {/* On a phone the icon joins the kind's line, so the copy keeps the card's width. */}
              <span
                aria-hidden="true"
                className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-snow-200 text-green-600 sm:grid"
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </span>

              <div className="min-w-0 flex-1">
                <p className="ticket flex items-center gap-2.5 text-snow-600">
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-green-600 sm:hidden" strokeWidth={1.5} />
                  {tr(LAYERING_KIND_BY_ID[kind])}
                </p>
                <h4 className="t-title mt-1.5 text-[1.25rem]">{title}</h4>
                <p className="t-body mt-2 text-[15px]">{tr(how)}</p>
                {partner && onOpenProduct && (
                  <button
                    type="button"
                    onClick={() => onOpenProduct(partner)}
                    aria-label={t('product.layering.viewAria', { name: title })}
                    className="group/view mt-4 inline-flex items-center gap-2 py-1 font-sans text-[11px] font-medium uppercase tracking-wide2 text-green-600 transition-colors duration-300 hover:text-green-700 rtl:font-sans-ar rtl:text-[13px] rtl:normal-case rtl:tracking-normal"
                  >
                    <span className="underline decoration-green-600/30 underline-offset-[5px] transition-colors duration-300 group-hover/view:decoration-green-700">
                      {t('product.layering.view')}
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover/view:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/view:-translate-x-0.5"
                      strokeWidth={1.5}
                    />
                  </button>
                )}
              </div>

              {partner && (
                <div aria-hidden="true" className="hidden h-24 w-16 shrink-0 border border-snow-200 bg-snow-100 sm:block">
                  <BottleVisual
                    palette={partner.palette}
                    label={CONCENTRATION_BY_ID[concentrationFor(partner, partner.formats[0]?.id)]?.abbr}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
