import { useReveal } from '../hooks/useReveal'
import { useLocale } from '../i18n/locale-context'
import { classNames } from '../lib/format'

const LAYERS = [
  {
    key: 'top',
    window: { en: 'First 15 minutes', ar: 'أول ١٥ دقيقة' },
    body: {
      en: 'The opening. Volatile citruses and aromatics that announce the fragrance and then step aside.',
      ar: 'الافتتاحية. حمضيات وعطريات متطايرة تُعلن العطر ثم تنسحب.',
    },
    examples: {
      en: ['Bergamot', 'Yuzu', 'Pink Pepper', 'Saffron'],
      ar: ['برغموت', 'يوزو', 'فلفل وردي', 'زعفران'],
    },
  },
  {
    key: 'heart',
    window: { en: 'Hours one to four', ar: 'من الساعة الأولى إلى الرابعة' },
    body: {
      en: 'The character of the composition — florals, spices and resins that carry it through the day.',
      ar: 'شخصية التركيبة — زهور وتوابل وراتنجات تحملها طوال اليوم.',
    },
    examples: {
      en: ['Damask Rose', 'Sambac Jasmine', 'Iris', 'Oud'],
      ar: ['وردة دمشقية', 'ياسمين سمبك', 'سوسن', 'عود'],
    },
  },
  {
    key: 'base',
    window: { en: 'Four hours onward', ar: 'بعد أربع ساعات' },
    body: {
      en: 'What remains on skin and fabric. Heavy molecules that fix the fragrance and give it a memory.',
      ar: 'ما يبقى على البشرة والقماش. جزيئات ثقيلة تثبّت العطر وتمنحه ذاكرة.',
    },
    examples: {
      en: ['Sandalwood', 'Vanilla', 'Ambergris', 'Vetiver'],
      ar: ['خشب الصندل', 'فانيلا', 'عنبر رمادي', 'نجيل الهند'],
    },
  },
]

export default function NotesGuide() {
  const [ref, visible] = useReveal()
  const { t, pick } = useLocale()

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
          {LAYERS.map((layer, index) => (
            <article
              key={layer.key}
              className={classNames(
                'border-b border-snow-200 py-9 transition-all duration-700 md:border-b-0 md:border-s md:py-11 md:ps-9 md:first:border-s-0 md:first:ps-0',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              )}
              style={{ transitionDelay: `${index * 140}ms` }}
            >
              <span className="ticket text-snow-600">{pick(layer.window.en, layer.window.ar)}</span>
              <h3 className="t-h2 mt-4 text-[1.9rem]">{t(layer.key)}</h3>
              <p className="t-body mt-5 max-w-xs">{pick(layer.body.en, layer.body.ar)}</p>
              <ul className="mt-7 border-t border-snow-200 pt-4">
                {pick(layer.examples.en, layer.examples.ar).map((example) => (
                  <li
                    key={example}
                    className="t-body border-b border-snow-200 py-2 text-ink-950 last:border-b-0"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
