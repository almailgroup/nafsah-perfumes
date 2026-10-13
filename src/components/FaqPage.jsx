import { ChevronDown } from 'lucide-react'
import { ProseLink } from './DocumentPage'
import { FAQ, fillPolicy } from '../data/help'
import { useLocale } from '../i18n/locale-context'
import { formatOrdinal } from '../lib/format'
import { Link } from '../router/RouterProvider'
import { CONTACT, SHIPPING } from '../router/router-context'

/**
 * Built on <details>, not a hand-rolled accordion. It is keyboard operable and
 * announced correctly without any of that being written here, and Chrome will
 * open a closed answer when find-in-page matches inside it — which a div with
 * an onClick will not do.
 *
 * Each group carries its own anchor (/faq#gifting), and every {placeholder}
 * in an answer is filled from the delivery, return and gifting constants.
 */
export default function FaqPage() {
  const { lang, t, tr } = useLocale()
  const fill = (entry) => fillPolicy(tr(entry), lang)

  return (
    <main id="main">
      <section className="bg-snow-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
          <header className="max-w-3xl border-b border-gold-500/60 pb-8">
            <p className="ticket text-green-600">{t('helpEyebrow')}</p>
            <h1 className="t-h2 mt-4">{t('faqHeading')}</h1>
            <p className="t-body mt-6 max-w-xl">{t('faqLede')}</p>
          </header>

          <div className="mt-12 max-w-3xl lg:mt-16">
            {FAQ.groups.map((group, groupIndex) => (
              <section
                key={group.id}
                id={group.id}
                aria-labelledby={`faq-${group.id}`}
                className="mt-14 scroll-mt-40 first:mt-0"
              >
                <h2 id={`faq-${group.id}`} className="ticket flex items-center gap-3 text-green-600">
                  <span aria-hidden="true">{formatOrdinal(groupIndex + 1, lang)}</span>
                  <span className="text-snow-600">{tr(group.group)}</span>
                </h2>

                <div className="mt-5 border-t border-snow-300">
                  {group.items.map((item) => (
                    <details key={item.q.en} className="group border-b border-snow-200">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                        <h3 className="t-title text-[1.2rem] transition-colors duration-300 group-hover:text-green-600">
                          {tr(item.q)}
                        </h3>
                        <ChevronDown
                          aria-hidden="true"
                          className="mt-1 h-4 w-4 shrink-0 text-green-600 transition-transform duration-300 group-open:rotate-180"
                          strokeWidth={1.5}
                        />
                      </summary>
                      <div className="max-w-2xl pb-7 pe-10 pt-1">
                        <p className="t-body">{fill(item.a)}</p>
                        {item.link && <ProseLink link={item.link} />}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            <div className="mt-14 border-t border-gold-500/60 pt-9">
              <h2 className="t-title">{t('moreHelpTitle')}</h2>
              <p className="t-body mt-3 max-w-md">{t('moreHelpBody')}</p>
              <div className="mt-7 flex flex-wrap gap-4">
                <Link to={SHIPPING} className="btn-outline">
                  {t('shippingReturns')}
                </Link>
                <Link to={CONTACT} className="btn-green">
                  {t('contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
