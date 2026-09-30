import { FREE_SHIPPING_KD, SHIPPING_KD } from '../context/CartProvider'
import { LEGAL_NOTE } from '../data/legal'
import { useLocale } from '../i18n/locale-context'
import { formatDate, formatOrdinal, formatPrice } from '../lib/format'
import { Link } from '../router/RouterProvider'
import { CONTACT } from '../router/router-context'

/* Slugs come off the English heading so a clause keeps the same address in
   both languages — someone can send /terms#returns-and-cancellation to a
   colleague reading the site in Arabic and land them on the same clause. */
const slugify = (heading) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** One layout for both documents; the difference between them is the prose. */
export default function LegalPage({ doc }) {
  const { lang, t, pick } = useLocale()

  const fill = (text) =>
    text
      .replace('{threshold}', formatPrice(FREE_SHIPPING_KD, lang))
      .replace('{shipping}', formatPrice(SHIPPING_KD, lang))

  const paragraph = (entry, index) => (
    <p key={index} className="t-body mt-4 first:mt-0">
      {fill(pick(entry.en, entry.ar))}
    </p>
  )

  return (
    <main id="main">
      <section className="bg-snow-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
          <header className="max-w-3xl border-b border-gold-500/60 pb-8">
            <p className="ticket text-green-600">{t('legalEyebrow')}</p>
            <h1 className="t-h2 mt-4">{pick(doc.title.en, doc.title.ar)}</h1>
            <p className="t-body mt-6 max-w-xl">{pick(doc.lede.en, doc.lede.ar)}</p>
            <p className="ticket mt-7 text-snow-600">
              {t('lastUpdated', { date: formatDate(doc.updated, lang) })}
            </p>
          </header>

          <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-[0.3fr_0.7fr] lg:gap-20">
            <nav aria-label={t('contents')} className="lg:sticky lg:top-40 lg:self-start">
              <h2 className="ticket text-snow-600">{t('contents')}</h2>
              <ol className="mt-5 space-y-3.5">
                {doc.sections.map((section, index) => (
                  <li key={section.heading.en} className="flex gap-3">
                    <span className="ticket pt-1 text-green-600">
                      {formatOrdinal(index + 1, lang)}
                    </span>
                    <a
                      href={`#${slugify(section.heading.en)}`}
                      className="nav-link nav-link-body t-body text-[14px] transition-colors duration-300 hover:text-green-600"
                    >
                      {pick(section.heading.en, section.heading.ar)}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="max-w-2xl">
              {doc.sections.map((section, index) => (
                <section
                  key={section.heading.en}
                  id={slugify(section.heading.en)}
                  className="scroll-mt-40 border-t border-snow-200 py-9 first:border-t-0 first:pt-0"
                >
                  <div className="flex gap-5 sm:gap-7">
                    <span className="ticket shrink-0 pt-1.5 text-green-600">
                      {formatOrdinal(index + 1, lang)}
                    </span>
                    <div className="min-w-0">
                      <h2 className="t-title">{pick(section.heading.en, section.heading.ar)}</h2>
                      <div className="mt-4">{(section.body ?? []).map(paragraph)}</div>

                      {section.list && (
                        <ul className="mt-4 space-y-3">
                          {section.list.map((item) => (
                            <li key={item.en} className="flex gap-3.5">
                              <span aria-hidden="true" className="mt-[0.7rem] h-px w-3 shrink-0 bg-gold-500" />
                              <span className="t-body">{fill(pick(item.en, item.ar))}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.after && <div className="mt-4">{section.after.map(paragraph)}</div>}
                    </div>
                  </div>
                </section>
              ))}

              <div className="mt-8 border-t border-gold-500/60 pt-9">
                <h2 className="t-title">{t('legalQuestionsTitle')}</h2>
                <p className="t-body mt-3 max-w-md">{t('legalQuestionsBody')}</p>
                <Link to={CONTACT} className="btn-green mt-7">
                  {t('contact')}
                </Link>
              </div>
            </div>
          </div>

          <p className="t-body mt-16 max-w-2xl border-t border-snow-200 pt-6 text-[14px] text-snow-600">
            {pick(LEGAL_NOTE.en, LEGAL_NOTE.ar)}
          </p>
        </div>
      </section>
    </main>
  )
}
