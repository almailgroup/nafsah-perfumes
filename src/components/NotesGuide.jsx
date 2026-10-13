import { Droplet, Flame, SprayCan } from 'lucide-react'
import { NOTES } from '../data/notes'
import { useReveal } from '../hooks/useReveal'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatNumber, formatOrdinal } from '../lib/format'

/*
 * The three tiers of a pyramid. Timings are numbers so Arabic prints them in
 * its own digits; the examples are real notes from the catalogue's note
 * dictionary, so their names match the product pages in both languages.
 */
const TIERS = [
  {
    key: 'top',
    window: (lang) => ['notesTopWindow', { minutes: formatNumber(15, lang) }],
    body: 'notesTopBody',
    examples: ['bergamot', 'saffron', 'pink-pepper', 'cardamom'],
  },
  {
    key: 'heart',
    window: (lang) => ['notesHeartWindow', { from: formatNumber(1, lang), to: formatNumber(4, lang) }],
    body: 'notesHeartBody',
    examples: ['taif-rose', 'jasmine-sambac', 'cambodi-oud', 'iris'],
  },
  {
    key: 'base',
    window: (lang) => ['notesBaseWindow', { hour: formatNumber(4, lang) }],
    body: 'notesBaseBody',
    examples: ['sandalwood', 'ambergris', 'white-musk', 'madagascan-vanilla'],
  },
]

// The Gulf order of layering, first to last; each is `${key}Title` / `${key}Body`.
const LAYERS = [
  { key: 'layeringBukhoor', Icon: Flame },
  { key: 'layeringOil', Icon: Droplet },
  { key: 'layeringSpray', Icon: SprayCan },
]

export default function NotesGuide() {
  const [ref, visible] = useReveal()
  const { lang, t, tr } = useLocale()
  const reveal = visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'

  return (
    <section
      id="notes"
      className="relative scroll-mt-32 overflow-hidden border-t border-snow-200 bg-snow-50 py-20 sm:py-24"
    >
      <div ref={ref} className="relative mx-auto max-w-[1560px] px-5 sm:px-9">
        <header className="max-w-2xl">
          <p className="ticket text-green-600">{t('readingFragrance')}</p>
          <h2 className="t-h2 mt-5">{t('pyramidTitle')}</h2>
          <p className="t-body mt-6 max-w-md">{t('pyramidBody')}</p>
        </header>

        <div className="mt-14 grid border-t border-gold-500/60 md:grid-cols-3">
          {TIERS.map((tier, index) => (
            <article
              key={tier.key}
              className={classNames(
                'border-b border-snow-200 py-9 transition-all duration-700 last:border-b-0 md:border-b-0 md:border-s md:py-11 md:ps-9 md:first:border-s-0 md:first:ps-0',
                reveal,
              )}
              style={{ transitionDelay: `${index * 140}ms` }}
            >
              <span className="ticket text-snow-600">{t(...tier.window(lang))}</span>
              <h3 className="t-h2 mt-4 text-[1.9rem]">{t(tier.key)}</h3>
              <p className="t-body mt-5 max-w-xs">{t(tier.body)}</p>
              <ul className="mt-7 border-t border-snow-200 pt-4">
                {tier.examples
                  .filter((id) => NOTES[id])
                  .map((id) => (
                    <li key={id} className="t-body border-b border-snow-200 py-2 text-ink-950 last:border-b-0">
                      {tr(NOTES[id])}
                    </li>
                  ))}
              </ul>
            </article>
          ))}
        </div>

        <div
          className={classNames(
            'mt-16 grid gap-10 border-t border-gold-500/60 pt-12 transition-all delay-300 duration-700 sm:mt-20 lg:grid-cols-[0.9fr_2.1fr] lg:gap-20 lg:pt-14',
            reveal,
          )}
        >
          <div className="max-w-sm">
            <p className="ticket text-green-600">{t('layeringEyebrow')}</p>
            <h3 className="t-h2 mt-4 text-[1.9rem]">{t('layeringTitle')}</h3>
            <p className="t-body mt-5">{t('layeringBody')}</p>
          </div>

          <ol className="grid sm:grid-cols-3">
            {LAYERS.map(({ key, Icon }, index) => (
              <li
                key={key}
                className="border-t border-snow-200 py-7 first:border-t-0 first:pt-0 sm:border-s sm:border-t-0 sm:py-0 sm:ps-7 sm:first:border-s-0 sm:first:ps-0 lg:ps-9"
              >
                <div className="flex items-center gap-3 text-green-600">
                  <span aria-hidden="true" className="ticket">
                    {formatOrdinal(index + 1, lang)}
                  </span>
                  <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.25} />
                </div>
                <h4 className="t-title mt-4">{t(`${key}Title`)}</h4>
                <p className="t-body mt-2.5 max-w-xs">{t(`${key}Body`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
