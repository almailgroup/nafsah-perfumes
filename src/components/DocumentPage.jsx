import { ArrowRight } from 'lucide-react'
import { fillPolicy } from '../data/help'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatDate, formatOrdinal } from '../lib/format'
import { Link } from '../router/RouterProvider'
import { CONTACT } from '../router/router-context'

/* A section's anchor is its explicit id, so a clause keeps the same address
   in both languages and through any rewording — someone can send
   /terms#returns-and-cancellation to a colleague reading the site in Arabic
   and land them on the same clause. The slug is only a fallback. */
const anchor = (section) =>
  section.id ??
  section.heading.en
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** A quiet onward link under a section or an answer: ticket type, green, underlined. */
export function ProseLink({ link }) {
  const { tr } = useLocale()
  return (
    <Link
      to={link.to}
      className="ticket group mt-5 inline-flex items-center gap-2 text-green-600 underline decoration-green-600/40 underline-offset-[6px] transition-colors duration-300 hover:text-ink-950 hover:decoration-ink-950"
    >
      {tr(link.label)}
      <ArrowRight
        aria-hidden="true"
        className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
        strokeWidth={1.5}
      />
    </Link>
  )
}

/**
 * One layout for every prose page — privacy, terms, shipping. The difference
 * between them is the writing, not the design: an eyebrow, a lede, a dated
 * gold rule, a contents list that sticks while you read, and numbered clauses
 * that match it.
 *
 * `eyebrow` names the shelf the page sits on (Help for shipping, Legal for the
 * rest); `note` is optional and only the legal pages pass one. Every
 * {placeholder} in the prose is filled from the delivery, return and gifting
 * constants by fillPolicy().
 */
export default function DocumentPage({ doc, note, eyebrow }) {
  const { lang, t, tr } = useLocale()
  const fill = (entry) => fillPolicy(tr(entry), lang)

  const paragraph = (entry, index) => (
    <p key={index} className="t-body mt-4 first:mt-0">
      {fill(entry)}
    </p>
  )

  return (
    <main id="main">
      <section className="bg-snow-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
          <header className="max-w-3xl border-b border-gold-500/60 pb-8">
            <p className="ticket text-green-600">{eyebrow ?? t('legalEyebrow')}</p>
            <h1 className="t-h2 mt-4">{tr(doc.title)}</h1>
            <p className="t-body mt-6 max-w-xl">{fill(doc.lede)}</p>
            <p className="ticket mt-7 text-snow-600">
              {t('lastUpdated', { date: formatDate(doc.updated, lang) })}
            </p>
          </header>

          <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-[0.3fr_0.7fr] lg:gap-20">
            <nav aria-label={t('contents')} className="lg:sticky lg:top-40 lg:self-start">
              <h2 className="ticket text-snow-600">{t('contents')}</h2>
              <ol className="mt-5 space-y-3.5">
                {doc.sections.map((section, index) => (
                  <li key={anchor(section)} className="flex gap-3">
                    <span aria-hidden="true" className="ticket pt-1 text-green-600">
                      {formatOrdinal(index + 1, lang)}
                    </span>
                    <a
                      href={`#${anchor(section)}`}
                      className="nav-link nav-link-body t-body text-[14px] transition-colors duration-300 hover:text-green-600"
                    >
                      {tr(section.heading)}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="max-w-2xl">
              {doc.sections.map((section, index) => (
                <section
                  key={anchor(section)}
                  id={anchor(section)}
                  className="scroll-mt-40 border-t border-snow-200 py-9 first:border-t-0 first:pt-0"
                >
                  <div className="flex gap-5 sm:gap-7">
                    <span aria-hidden="true" className="ticket shrink-0 pt-1.5 text-green-600">
                      {formatOrdinal(index + 1, lang)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="t-title">{tr(section.heading)}</h2>
                      {section.body && <div className="mt-4">{section.body.map(paragraph)}</div>}

                      {section.list && (
                        <ul className="mt-4 space-y-3">
                          {section.list.map((item) => (
                            <li key={item.en} className="flex gap-3.5">
                              <span aria-hidden="true" className="mt-[0.8rem] h-px w-3 shrink-0 bg-gold-500" />
                              <span className="t-body">{fill(item)}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.table && (
                        /* A table from sm up. On a phone three columns leave a word or
                           two per line, so each row becomes a short block — its
                           first cell as the heading, then label and value pairs. */
                        <div className="mt-5">
                          <table className="w-full border-collapse text-start">
                            <thead className="hidden sm:table-header-group">
                              <tr className="border-y border-snow-300">
                                {section.table.head.map((cell) => (
                                  <th
                                    key={cell.en}
                                    scope="col"
                                    className="ticket py-3 pe-5 text-start text-snow-600 last:pe-0"
                                  >
                                    {tr(cell)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="block border-t border-snow-300 sm:table-row-group sm:border-t-0">
                              {section.table.rows.map((row) => (
                                <tr key={row[0].en} className="block border-b border-snow-200 py-4 sm:table-row sm:py-0">
                                  {row.map((cell, cellIndex) => {
                                    const Cell = cellIndex === 0 ? 'th' : 'td'
                                    return (
                                      <Cell
                                        key={cellIndex}
                                        scope={cellIndex === 0 ? 'row' : undefined}
                                        className={classNames(
                                          't-body text-start align-top font-normal sm:table-cell sm:py-4 sm:pe-5 sm:text-[14px] sm:last:pe-0',
                                          cellIndex === 0
                                            ? 'block text-ink-950'
                                            : 'mt-2 grid grid-cols-[6.5rem_1fr] gap-3 text-[14px] sm:mt-0',
                                        )}
                                      >
                                        {cellIndex > 0 && (
                                          <span className="ticket pt-1 text-snow-600 sm:hidden">
                                            {tr(section.table.head[cellIndex])}
                                          </span>
                                        )}
                                        <span>{fill(cell)}</span>
                                      </Cell>
                                    )
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {section.after && <div className="mt-4">{section.after.map(paragraph)}</div>}

                      {section.link && <ProseLink link={section.link} />}
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

          {note && (
            <p className="t-body mt-16 max-w-2xl border-t border-snow-200 pt-6 text-[14px] text-snow-600">
              {tr(note)}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
