import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useLocale } from '../i18n/locale-context'
import { formatNumber } from '../lib/format'
import { FOOTER_LOGO } from '../brand'
import { Link } from '../router/RouterProvider'
import { CONTACT, FAQ, PRIVACY, SHIPPING, TERMS } from '../router/router-context'

/* Each link carries its own destination now that Client Care has real pages
   behind it: two of the four are pages, two still reach a person. */
const COLUMNS = [
  {
    title: { en: 'Catalogue', ar: 'الفهرس' },
    links: [
      { en: 'New Arrivals', ar: 'وصل حديثاً', section: 'collection' },
      { en: 'Bestsellers', ar: 'الأكثر مبيعاً', section: 'collection' },
      { en: 'Discovery Sets', ar: 'أطقم الاكتشاف', section: 'collection' },
      { en: 'Gifting', ar: 'الهدايا', section: 'collection' },
    ],
  },
  {
    title: { en: 'The House', ar: 'الدار' },
    links: [
      { en: 'Our Story', ar: 'قصتنا', section: 'house' },
      { en: 'Sourcing', ar: 'مصادر المواد', section: 'house' },
      { en: 'Sustainability', ar: 'الاستدامة', section: 'house' },
      { en: 'Ateliers', ar: 'المعامل', section: 'house' },
    ],
  },
  {
    title: { en: 'Client Care', ar: 'خدمة العملاء' },
    links: [
      { en: 'Shipping & Returns', ar: 'الشحن والإرجاع', to: SHIPPING },
      { en: 'FAQ', ar: 'الأسئلة الشائعة', to: FAQ },
      { en: 'Track an Order', ar: 'تتبّع الطلب', to: CONTACT },
      { en: 'Consultation', ar: 'استشارة', to: CONTACT },
    ],
  },
]

const PAYMENTS = ['KNET', 'Visa', 'Mastercard', 'Amex', 'Apple Pay']

export default function Footer({ onGoToSection }) {
  const { lang, t, isRtl, pick } = useLocale()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const Forward = isRtl ? ArrowLeft : ArrowRight

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3500)
  }

  return (
    <footer id="contact" className="relative scroll-mt-32 overflow-hidden bg-green-700">
      <div aria-hidden="true" className="mashrabiya-band mashrabiya-on-green pointer-events-none absolute inset-0" />

      <div className="relative border-b border-snow-50/20">
        <div className="mx-auto grid max-w-[1560px] gap-10 px-5 py-16 sm:px-9 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="ticket text-gold-300">{t('privateList')}</p>
            <h2 className="t-h2 mt-5 text-snow-50">{t('newsletterTitle')}</h2>
          </div>
          <div className="lg:ps-10">
            <p className="t-body max-w-md text-snow-200">{t('newsletterBody')}</p>
            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter" className="sr-only">{t('emailAddress')}</label>
              <input
                id="newsletter" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="field flex-1"
              />
              <button type="submit" className="btn-paper group shrink-0">
                {subscribed ? (
                  <>
                    <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
                    {t('subscribed')}
                  </>
                ) : (
                  <>
                    {t('join')}
                    <Forward className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" strokeWidth={1.5} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1560px] px-5 py-14 sm:px-9">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            {/* The plain wordmark reversed out in paper — see src/brand.js for
                why the footer does not follow the header's logo. */}
            <img
              src={FOOTER_LOGO.src}
              alt={t('brand')}
              width={FOOTER_LOGO.width}
              height={FOOTER_LOGO.height}
              className="block h-9 w-auto"
            />
            <p className="t-body mt-5 max-w-xs text-snow-200">
              {lang === 'ar'
                ? 'دار عطور تأسست عام ١٩٧٤. تُركَّب في غراس، وتُعبّأ بدفعات صغيرة، وتُشحن من الكويت إلى العالم.'
                : 'Maison de parfum, founded 1974. Composed in Grasse, bottled in small batches, shipped worldwide from Kuwait.'}
            </p>
            <ul className="mt-6 space-y-2">
              {[
                lang === 'ar' ? 'شارع الخليج العربي، مدينة الكويت' : '12 Boulevard du Jeu de Ballon, Grasse',
                'atelier@nafsah.example',
                '+965 2200 0000',
              ].map((line) => (
                <li key={line} className="t-body text-[14px] text-snow-200" dir={line.startsWith('+') ? 'ltr' : undefined}>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title.en}>
              <h3 className="ticket text-snow-50">{pick(column.title.en, column.title.ar)}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => {
                  const className =
                    'nav-link nav-link-body t-body text-[14px] text-snow-200 transition-colors duration-300 hover:text-green-300'
                  return (
                    <li key={link.en}>
                      {link.to ? (
                        <Link to={link.to} className={className}>
                          {pick(link.en, link.ar)}
                        </Link>
                      ) : (
                        <a
                          href={`#${link.section}`}
                          onClick={(event) => {
                            event.preventDefault()
                            onGoToSection(link.section)
                          }}
                          className={className}
                        >
                          {pick(link.en, link.ar)}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-snow-50/20 pt-8">
          <span className="ticket me-2 text-snow-300">{t('weAccept')}</span>
          {PAYMENTS.map((method) => (
            <span key={method} className="border border-snow-50/20 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wide2 text-snow-200">
              {method}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-snow-50/20 pt-8 sm:flex-row">
          <p className="ticket text-snow-300">
            {t('rights', { year: formatNumber(new Date().getFullYear(), lang).replace(/[,٬]/g, '') })}
          </p>
          <div className="flex items-center gap-6">
            {[
              [PRIVACY, t('privacy')],
              [TERMS, t('terms')],
            ].map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="nav-link nav-link-ticket ticket text-snow-300 transition-colors duration-300 hover:text-green-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
