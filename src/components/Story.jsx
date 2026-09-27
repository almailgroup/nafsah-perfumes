import { useReveal } from '../hooks/useReveal'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatOrdinal } from '../lib/format'

const PILLARS = [
  {
    title: { en: 'Single-origin materials', ar: 'مواد أحادية المصدر' },
    body: {
      en: 'Sambac jasmine from Tamil Nadu, oud from Trat, iris butter aged six years in Florence. We name every source on the carton.',
      ar: 'ياسمين سمبك من تاميل نادو، وعود من ترات، وزبدة سوسن معتّقة ست سنوات في فلورنسا. نذكر كل مصدر على العلبة.',
    },
  },
  {
    title: { en: 'Composed in Grasse', ar: 'تُركَّب في غراس' },
    body: {
      en: 'Each formula is built by hand at our atelier bench, then left to macerate for four weeks before a single bottle is filled.',
      ar: 'كل تركيبة تُبنى يدوياً على طاولة المعمل، ثم تُترك للنقع أربعة أسابيع قبل تعبئة أول قارورة.',
    },
  },
  {
    title: { en: 'Extrait concentrations', ar: 'تركيز العطر المركّز' },
    body: {
      en: '22–30% perfume oil, against the 12% that passes for eau de parfum elsewhere. Less alcohol, longer wear, quieter projection.',
      ar: 'من ٢٢٪ إلى ٣٠٪ زيت عطري، مقابل ١٢٪ تمرّ على أنها ماء عطر في مكان آخر. كحول أقل، ثبات أطول، انتشار أهدأ.',
    },
  },
  {
    title: { en: 'Never reformulated', ar: 'لا تُعاد صياغتها أبداً' },
    body: {
      en: 'A Nafsah bottled in 2019 smells like one bottled today. We would rather retire a fragrance than cheapen its materials.',
      ar: 'عطر نَفْسَة المعبّأ عام ٢٠١٩ يشبه المعبّأ اليوم. نفضّل إيقاف العطر على أن نُرخص مواده.',
    },
  },
]

export default function Story() {
  const [ref, visible] = useReveal()
  const { lang, t } = useLocale()

  return (
    <section id="house" className="scroll-mt-32 bg-midnight-950 py-20 sm:py-24">
      <div
        ref={ref}
        className={classNames(
          'mx-auto max-w-[1560px] px-5 transition-all duration-1000 sm:px-9',
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        )}
      >
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="ticket text-saffron-300">{t('theHouse')}</p>
            <h2 className="t-h2 mt-5">{t('houseTitle')}</h2>
            <p className="t-body mt-8 max-w-md">
              {lang === 'ar'
                ? 'بدأت نَفْسَة عام ١٩٧٤ كمعمل بثلاث طاولات يزوّد العطّارين في الخليج. ما زلنا نعمل بالطريقة نفسها — دفعات صغيرة، ونقع طويل، وتركيبات يُسمح لها أن تكون صعبة.'
                : 'Nafsah began in 1974 as a three-bench atelier supplying attars to a handful of houses in the Gulf. We still work the same way — small batches, long maceration, and formulas that are allowed to be difficult.'}
            </p>

            <figure className="mt-10 max-w-md border-t border-pearl-50/[0.14] pt-8">
              <blockquote
                className={classNames(
                  'text-pearl-50',
                  lang === 'ar'
                    ? 'font-display-ar text-[1.5rem] leading-[1.6]'
                    : 'font-display text-[1.7rem] italic leading-[1.3]',
                )}
              >
                {lang === 'ar'
                  ? '«ينبغي أن يُعرف العطر قبل أن يُعلَن عنه.»'
                  : '“A perfume should be recognised before it is announced.”'}
              </blockquote>
              <figcaption className="ticket mt-4 text-pearl-400">{t('founder')}</figcaption>
            </figure>
          </div>

          <ol className="border-t border-pearl-50/[0.14]">
            {PILLARS.map((pillar, index) => (
              <li
                key={pillar.title.en}
                className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-pearl-50/[0.14] py-7 sm:grid-cols-[4rem_1fr] sm:gap-8 sm:py-9"
              >
                <span className="ticket pt-2 text-saffron-300">
                  {formatOrdinal(index + 1, lang)}
                </span>
                <div>
                  <h3 className="t-title">{lang === 'ar' ? pillar.title.ar : pillar.title.en}</h3>
                  <p className="t-body mt-2.5 max-w-lg">
                    {lang === 'ar' ? pillar.body.ar : pillar.body.en}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
