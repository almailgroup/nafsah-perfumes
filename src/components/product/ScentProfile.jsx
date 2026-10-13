import { useId } from 'react'
import Meter from './Meter'
import { familyShares, isAllYear, LONGEVITY_SCALE_HOURS } from './derive'
import {
  FAMILY_BY_ID,
  HEAT_SCALE,
  longevityBand,
  OCCASION_BY_ID,
  SEASON_BY_ID,
  SILLAGE,
  SILLAGE_BY_ID,
} from '../../data/taxonomy'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatHours, formatNumber } from '../../lib/format'

// Past this share the figure no longer fits after the tip, and sits just inside it.
const FIGURE_FITS_BELOW = 88

/**
 * How the fragrance behaves, drawn to the house's chart rules: one hue,
 * thin marks, values written as text in ink (never in the data colour), and
 * a single series so no legend. Family character is a set of horizontal bars
 * with the share at each tip; heat, longevity and projection are meters.
 */
export default function ScentProfile({ product }) {
  const { lang, t, tr } = useLocale()
  const familiesId = useId()
  const n = (value) => formatNumber(value, lang)

  const heat = HEAT_SCALE.find((step) => step.value === product.heatResistance)
  const sillage = SILLAGE_BY_ID[product.projectionSillage]
  const season = isAllYear(product)
    ? t('product.profile.allYear')
    : product.seasons.map((id) => tr(SEASON_BY_ID[id])).join(' · ')
  const occasions = product.occasions.map((id) => tr(OCCASION_BY_ID[id])).join(' · ')

  return (
    <div>
      <h4 id={familiesId} className="ticket text-snow-600">
        {t('product.profile.families')}
      </h4>
      <ul aria-labelledby={familiesId} className="mt-4 space-y-3.5">
        {familyShares(product).map(({ id, share }) => (
          <li
            key={id}
            className="grid items-center gap-x-5 gap-y-1.5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]"
          >
            <span className="font-sans text-[14px] leading-snug text-ink-950 rtl:font-sans-ar">
              {tr(FAMILY_BY_ID[id])}
            </span>
            {/* The track is the whole 0–100 scale. The value rides the tip of
                its bar on a paper ground that parts the track around it; a
                share too near the end to fit turns its figure inward. */}
            <span className="relative block h-5">
              <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-green-600/10" />
              <span
                aria-hidden="true"
                className="absolute start-0 top-1/2 h-2 -translate-y-1/2 rounded-e-[4px] bg-green-600"
                style={{ width: `${share}%` }}
              />
              <span
                className={classNames(
                  't-figure absolute top-1/2 -translate-y-1/2 whitespace-nowrap bg-snow-50 text-[13px] leading-none text-ink-950',
                  share > FIGURE_FITS_BELOW ? 'pe-2 ps-1.5' : 'pe-1.5 ps-2',
                )}
                style={
                  share > FIGURE_FITS_BELOW
                    ? { insetInlineEnd: `${100 - share}%` }
                    : { insetInlineStart: `${share}%` }
                }
              >
                {t('product.profile.share', { value: n(share) })}
              </span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-9 grid gap-7">
        {heat && (
          <Meter
            label={t('product.profile.heat')}
            value={heat.value}
            min={0}
            max={HEAT_SCALE.length}
            segments={HEAT_SCALE.length}
            valueText={t('product.profile.steps', {
              value: n(heat.value),
              max: n(HEAT_SCALE.length),
              label: tr(heat),
            })}
          />
        )}
        <Meter
          label={t('product.profile.longevity')}
          value={Math.min(product.longevity, LONGEVITY_SCALE_HOURS)}
          min={0}
          max={LONGEVITY_SCALE_HOURS}
          valueText={t('product.longevityValue', {
            hours: formatHours(product.longevity, lang),
            band: tr(longevityBand(product.longevity)),
          })}
          scale={[formatHours(0, lang), formatHours(LONGEVITY_SCALE_HOURS, lang)]}
        />
        {sillage && (
          <Meter
            label={t('product.profile.projection')}
            value={sillage.level}
            min={0}
            max={SILLAGE.length}
            segments={SILLAGE.length}
            valueText={t('product.profile.steps', {
              value: n(sillage.level),
              max: n(SILLAGE.length),
              label: tr(sillage),
            })}
          />
        )}
      </div>

      <dl className="mt-9 grid gap-x-6 gap-y-4 border-t border-snow-200 pt-6 sm:grid-cols-2">
        <div>
          <dt className="ticket text-snow-600">{t('product.profile.season')}</dt>
          <dd className="mt-1.5 font-sans text-[14px] leading-snug text-ink-950 rtl:font-sans-ar">{season}</dd>
        </div>
        <div>
          <dt className="ticket text-snow-600">{t('product.profile.occasions')}</dt>
          <dd className="mt-1.5 font-sans text-[14px] leading-snug text-ink-950 rtl:font-sans-ar">
            {occasions}
          </dd>
        </div>
      </dl>
    </div>
  )
}
