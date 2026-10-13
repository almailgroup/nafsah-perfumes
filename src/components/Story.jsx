import { policyVars } from '../data/help'
import { PRODUCTS } from '../data/products'
import { useReveal } from '../hooks/useReveal'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatNumber, formatOrdinal } from '../lib/format'

/** The year the oldest fragrance in the catalogue was introduced: the proof behind "never reformulated". */
const OLDEST_FORMULA = Math.min(...PRODUCTS.map((product) => product.year))

// Each pillar is a pair of dictionary keys: `${key}Title` and `${key}Body`.
const PILLARS = ['houseSources', 'houseGrasse', 'houseStrength', 'houseFormula']

export default function Story() {
  const [ref, visible] = useReveal()
  const { lang, t } = useLocale()
  // The house's figures — founding year, vial size, oil ranges — come from
  // the same data the catalogue and the help pages read.
  const vars = { ...policyVars(lang), year: formatNumber(OLDEST_FORMULA, lang, { useGrouping: false }) }

  return (
    <section id="house" className="scroll-mt-32 bg-snow-50 py-20 sm:py-24">
      <div
        ref={ref}
        className={classNames(
          'mx-auto max-w-[1560px] px-5 transition-all duration-1000 sm:px-9',
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        )}
      >
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="ticket text-green-600">{t('theHouse')}</p>
            <h2 className="t-h2 mt-5">{t('houseTitle')}</h2>
            <p className="t-body mt-8 max-w-md">{t('houseLede', vars)}</p>

            <figure className="mt-10 max-w-md border-t border-snow-200 pt-8">
              <blockquote
                className={classNames(
                  'text-ink-950',
                  lang === 'ar'
                    ? 'font-display-ar text-[1.5rem] leading-[1.6]'
                    : 'font-display text-[1.7rem] italic leading-[1.3]',
                )}
              >
                {t('houseQuote')}
              </blockquote>
              <figcaption className="ticket mt-4 text-snow-600">{t('founder')}</figcaption>
            </figure>
          </div>

          <ol className="border-t border-gold-500/60">
            {PILLARS.map((key, index) => (
              <li
                key={key}
                className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-snow-200 py-7 sm:grid-cols-[4rem_1fr] sm:gap-8 sm:py-9"
              >
                <span aria-hidden="true" className="ticket pt-2 text-green-600">
                  {formatOrdinal(index + 1, lang)}
                </span>
                <div>
                  <h3 className="t-title">{t(`${key}Title`)}</h3>
                  <p className="t-body mt-2.5 max-w-lg">{t(`${key}Body`, vars)}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
