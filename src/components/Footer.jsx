import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useLocale } from '../i18n/locale-context'
import { formatNumber } from '../lib/format'

const COLUMNS = [
  {
    title: { en: 'Catalogue', ar: 'الفهرس' },
    links: {
      en: ['New Arrivals', 'Bestsellers', 'Discovery Sets', 'Gifting'],
      ar: ['وصل حديثاً', 'الأكثر مبيعاً', 'أطقم الاكتشاف', 'الهدايا'],
    },
  },
  {
    title: { en: 'The House', ar: 'الدار' },
    links: {
      en: ['Our Story', 'Sourcing', 'Sustainability', 'Ateliers'],
      ar: ['قصتنا', 'مصادر المواد', 'الاستدامة', 'المعامل'],
    },
  },
  {
    title: { en: 'Client Care', ar: 'خدمة العملاء' },
    links: {
      en: ['Shipping & Returns', 'Track an Order', 'Consultation', 'FAQ'],
      ar: ['الشحن والإرجاع', 'تتبّع الطلب', 'استشارة', 'الأسئلة الشائعة'],
    },
  },
]

const PAYMENTS = ['KNET', 'Visa', 'Mastercard', 'Amex', 'Apple Pay']

export default function Footer() {
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
    <footer id="contact" className="relative scroll-mt-32 overflow-hidden bg-midnight-900">
      <div aria-hidden="true" className="mashrabiya-band pointer-events-none absolute inset-0" />

      <div className="relative border-b border-pearl-50/15">
        <div className="mx-auto grid max-w-[1560px] gap-10 px-5 py-16 sm:px-9 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="ticket text-gold-300">{t('privateList')}</p>
            <h2 className="t-h2 mt-5">{t('newsletterTitle')}</h2>
          </div>
          <div className="lg:ps-10">
            <p className="t-body max-w-md">{t('newsletterBody')}</p>
            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter" className="sr-only">{t('emailAddress')}</label>
              <input
                id="newsletter" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                className="field flex-1"
              />
              <button type="submit" className="btn-pearl group shrink-0">
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
            <span className={lang === 'ar'
              ? 'font-display-ar text-[30px] font-medium text-pearl-50'
              : 'font-display text-[28px] font-medium tracking-[0.2em] text-pearl-50'}>
              {t('brand')}
            </span>
            <p className="t-body mt-5 max-w-xs">
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
                <li key={line} className="t-body text-[13px]" dir={line.startsWith('+') ? 'ltr' : undefined}>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title.en}>
              <h3 className="ticket text-pearl-200">{pick(column.title.en, column.title.ar)}</h3>
              <ul className="mt-5 space-y-3">
                {pick(column.links.en, column.links.ar).map((link) => (
                  <li key={link}>
                    <a
                      href="#collection"
                      className="nav-link nav-link-body t-body text-[13px] transition-colors duration-300 hover:text-green-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-pearl-50/15 pt-8">
          <span className="ticket me-2 text-pearl-400">{t('weAccept')}</span>
          {PAYMENTS.map((method) => (
            <span key={method} className="border border-pearl-50/25 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wide2 text-pearl-200">
              {method}
            </span>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-pearl-50/15 pt-8 sm:flex-row">
          <p className="ticket text-pearl-400">
            {t('rights', { year: formatNumber(new Date().getFullYear(), lang).replace(/[,٬]/g, '') })}
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#collection"
              className="nav-link nav-link-ticket ticket text-pearl-400 transition-colors duration-300 hover:text-green-300"
            >
              {t('privacy')}
            </a>
            <a
              href="#collection"
              className="nav-link nav-link-ticket ticket text-pearl-400 transition-colors duration-300 hover:text-green-300"
            >
              {t('terms')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
