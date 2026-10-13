import {
  Bean,
  Briefcase,
  CalendarDays,
  Coffee,
  Flame,
  Flower2,
  Gem,
  Moon,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SunMoon,
  ThermometerSun,
  User,
  UserRound,
  Users,
  Waves,
} from 'lucide-react'
import { NOTES } from '../../data/notes'
import { FAMILY_BY_ID } from '../../data/taxonomy'
import { useLocale } from '../../i18n/locale-context'
import { formatHours, formatNumber } from '../../lib/format'

/** The lucide names src/lib/scent-finder.js uses, imported one by one so the bundle carries only these. */
export const OPTION_ICONS = {
  Bean,
  Briefcase,
  CalendarDays,
  Coffee,
  Flame,
  Flower2,
  Gem,
  Moon,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SunMoon,
  ThermometerSun,
  User,
  UserRound,
  Users,
  Waves,
}

// The heat a "holds up in …" reason quotes: Kuwait's summer afternoons.
const SUMMER_PEAK_C = 45

/**
 * A reason from recommend() in the active language: ids become labels and
 * numbers are written in the active script before they reach the sentence.
 */
export function useReasonText() {
  const { lang, t, tr } = useLocale()
  return ({ key, vars = {} }) =>
    t(key, {
      family: vars.family ? tr(FAMILY_BY_ID[vars.family]?.short) : undefined,
      note: vars.note ? tr(NOTES[vars.note]) : undefined,
      hours: vars.hours != null ? formatHours(vars.hours, lang) : undefined,
      temp: formatNumber(SUMMER_PEAK_C, lang),
    })
}

/** A match score as text: "92% match" / "توافق ٩٢٪". */
export function useMatchText() {
  const { lang, t } = useLocale()
  return (score) => t('finder.results.match', { percent: formatNumber(score / 100, lang, { style: 'percent' }) })
}
