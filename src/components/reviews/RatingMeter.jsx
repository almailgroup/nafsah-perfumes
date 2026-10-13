import Meter from '../product/Meter'
import { useLocale } from '../../i18n/locale-context'
import { RATING_MAX } from '../../lib/reviews'
import { formatNumber } from '../../lib/format'

/**
 * One averaged dimension — "Longevity in high temperature 4.4 out of 5" — in
 * the product page's own meter: an 8px green measure on a pale green track,
 * the value written out above it and given to the meter as its valuetext.
 * The scale runs from 0 so a one-star average still shows as a fifth.
 */
export default function RatingMeter({ label, value, className }) {
  const { lang, t } = useLocale()
  const shown = formatNumber(value, lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
  const valueText = `${shown} ${t('reviews.outOf', { max: formatNumber(RATING_MAX, lang) })}`
  return <Meter label={label} value={value} min={0} max={RATING_MAX} valueText={valueText} className={className} />
}
