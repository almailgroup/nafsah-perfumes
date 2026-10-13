import { useId } from 'react'
import { concentrationFor } from '../../data/products'
import {
  CONCENTRATION_BY_ID,
  GENDER_BY_ID,
  longevityBand,
  SILLAGE_BY_ID,
} from '../../data/taxonomy'
import { useLocale } from '../../i18n/locale-context'
import { formatHours, formatNumber } from '../../lib/format'

/**
 * The four facts a shopper checks before anything else, as a ruled strip of
 * label/value pairs. Concentration follows the chosen format: the oils of a
 * spray are attar, so picking a quarter tola changes the first line.
 */
export default function ProductFacts({ product, formatId, className }) {
  const { lang, t, tr } = useLocale()
  const headingId = useId()
  const concentration = CONCENTRATION_BY_ID[concentrationFor(product, formatId)]
  const [low, high] = concentration?.oilRange ?? []
  const n = (value) => formatNumber(value, lang)

  let oil = null
  if (low != null && low === high) oil = t('product.oilPure')
  else if (low != null) oil = t('product.oilShare', { min: n(low), max: n(high) })

  const facts = [
    { key: 'concentration', value: tr(concentration), note: oil },
    { key: 'gender', value: tr(GENDER_BY_ID[product.gender]) },
    {
      key: 'longevity',
      value: t('product.longevityValue', {
        hours: formatHours(product.longevity, lang),
        band: tr(longevityBand(product.longevity)),
      }),
    },
    { key: 'projection', value: tr(SILLAGE_BY_ID[product.projectionSillage]) },
  ]

  return (
    <section aria-labelledby={headingId} className={className}>
      <h3 id={headingId} className="sr-only">
        {t('product.facts')}
      </h3>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-snow-200 py-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        {facts.map(({ key, value, note }) => (
          <div key={key} className="min-w-0">
            <dt className="ticket text-snow-600">{t(`product.fact.${key}`)}</dt>
            <dd className="mt-1.5 font-sans text-[14px] leading-snug text-ink-950 rtl:font-sans-ar">
              {value}
              {note && (
                <span className="mt-1 block text-[12px] leading-snug text-snow-600">{note}</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
