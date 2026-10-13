import { useId } from 'react'
import { useLocale } from '../../i18n/locale-context'
import { formatNumber } from '../../lib/format'

/*
 * The pyramid's silhouette. Each tier is a trapezoid whose top edge is the
 * base of the tier above, so the three sides run as one slope from a narrow
 * apex to the full width. Widths are shares of the base; the shape is
 * symmetrical, so it needs no mirroring in Arabic.
 */
const APEX = 50
const TIERS = [
  { key: 'top', field: 'topNotes', base: 66, tint: 'bg-green-600/[0.05]' },
  { key: 'heart', field: 'heartNotes', base: 83, tint: 'bg-green-600/[0.09]' },
  { key: 'base', field: 'baseNotes', base: 100, tint: 'bg-green-600/[0.14]' },
]

// How far in, as a share of a tier's own width, its top corners sit.
const insets = TIERS.map((tier, index) => {
  const top = index === 0 ? APEX : TIERS[index - 1].base
  return ((tier.base - top) / (2 * tier.base)) * 100
})

/**
 * Top, heart and base as a real pyramid: narrow at the top where the
 * volatile notes burn off, widest at the base that stays on skin. An ordered
 * list of tiers, each with its own list of notes, so a screen reader hears
 * the same order the eye reads.
 */
export default function OlfactoryPyramid({ product, labelledBy }) {
  const { lang, t, tr } = useLocale()
  const uid = useId()
  const n = (value) => formatNumber(value, lang)

  const when = {
    top: t('product.tier.topWhen', { minutes: n(15) }),
    heart: t('product.tier.heartWhen', { from: n(1), to: n(4) }),
    base: t('product.tier.baseWhen', { from: n(4) }),
  }

  return (
    <ol aria-labelledby={labelledBy} className="flex flex-col items-center gap-[2px]">
      {TIERS.map((tier, index) => {
        const inset = insets[index]
        const tierId = `${uid}-${tier.key}`
        return (
          <li key={tier.key} className="relative" style={{ width: `${tier.base}%` }}>
            <div
              aria-hidden="true"
              className={`absolute inset-0 ${tier.tint}`}
              style={{
                clipPath: `polygon(${inset}% 0, ${100 - inset}% 0, 100% 100%, 0 100%)`,
              }}
            />
            {/* Kept inside the top edge, the narrowest line of the trapezoid. */}
            <div
              className="relative py-5 text-center sm:py-6"
              style={{ paddingInline: `calc(${inset}% + 0.75rem)` }}
            >
              <h4 id={tierId} className="ticket text-ink-950">
                {t(`product.tier.${tier.key}`)}
              </h4>
              <p className="mt-1 font-sans text-[12px] leading-snug text-snow-600 rtl:font-sans-ar">
                {when[tier.key]}
              </p>
              <ul aria-labelledby={tierId} className="mt-3.5 flex flex-wrap justify-center gap-1.5">
                {product[tier.field].map((note) => (
                  <li
                    key={note.id}
                    className="border border-green-600/20 bg-snow-50 px-2.5 py-1 font-sans text-[13px] leading-snug text-ink-950 rtl:font-sans-ar"
                  >
                    {tr(note)}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
