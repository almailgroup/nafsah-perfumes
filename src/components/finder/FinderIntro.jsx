import { useId } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import BottleVisual from '../BottleVisual'
import { QuestionList } from './parts'
import { PRODUCTS_BY_ID } from '../../data/products'
import { CONCENTRATION_BY_ID } from '../../data/taxonomy'
import { useLocale } from '../../i18n/locale-context'
import { QUESTION_BY_ID } from '../../lib/scent-finder'

// One vial for each character the second question offers, so the plate
// previews the choice rather than decorating the page.
const CHARACTER_FACES = {
  'heavy-oud': 'oud-noir',
  'fresh-blue': 'citron-de-mer',
  floral: 'rose-imperiale',
  'sweet-gourmand': 'qahwa',
}

/** The opening screen: what the finder does, what it will ask, and one way in. */
export default function FinderIntro({ onStart, headingRef }) {
  const { t, tr, isRtl } = useLocale()
  const questionsId = useId()
  const Forward = isRtl ? ArrowLeft : ArrowRight

  return (
    <div className="animate-fade-in">
      <header className="grid gap-8 border-b border-gold-500/60 pb-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
        <div className="max-w-3xl">
          <p className="ticket text-green-600">{t('finder.name')}</p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="t-h2 mt-4 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {t('finder.intro.title')}
          </h1>
          <p className="t-body mt-6 max-w-xl">{t('finder.intro.body')}</p>
        </div>
        <div className="flex flex-col items-start gap-4 lg:max-w-xs lg:items-stretch">
          <button type="button" onClick={onStart} className="btn-green group">
            {t('finder.intro.start')}
            <Forward
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              strokeWidth={1.5}
            />
          </button>
          <p className="t-body text-[14px] text-snow-600">{t('finder.intro.note')}</p>
        </div>
      </header>

      <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div aria-hidden="true" className="relative overflow-hidden border border-snow-200 bg-snow-100 lg:self-start">
          <div className="mashrabiya-band pointer-events-none absolute inset-0" />
          <ul className="relative grid grid-cols-4 gap-2 px-4 pb-6 pt-10 sm:gap-4 sm:px-8 sm:pt-14">
            {Object.entries(CHARACTER_FACES).map(([character, productId]) => {
              const product = PRODUCTS_BY_ID[productId]
              return (
                <li key={character} className="flex flex-col items-center text-center">
                  <span className="block h-28 w-full sm:h-40">
                    <BottleVisual
                      palette={product.palette}
                      fillLevel={0.86}
                      label={CONCENTRATION_BY_ID[product.concentration]?.abbr}
                    />
                  </span>
                  <span className="ticket mt-4 block text-snow-600">
                    {tr(QUESTION_BY_ID.vibe.options.find((option) => option.id === character))}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <section aria-labelledby={questionsId}>
          <h2 id={questionsId} className="ticket text-snow-600">
            {t('finder.intro.questions')}
          </h2>
          <QuestionList className="mt-5" />
        </section>
      </div>
    </div>
  )
}
