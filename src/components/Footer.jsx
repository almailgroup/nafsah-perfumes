import { useEffect, useId, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, CircleAlert } from 'lucide-react'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatNumber } from '../lib/format'
import { FOOTER_LOGO } from '../brand'
import { HOUSE_FOUNDED } from '../data/help'
import { Link } from '../router/RouterProvider'
import { CONTACT, FAQ, PRIVACY, SCENT_FINDER, SHIPPING, TERMS } from '../router/router-context'

const EMAIL = 'atelier@nafsah.example'
const PHONE = '+965 2200 0000'

/* Every link goes somewhere real: a page, a section of the homepage, or the
   contact form with its subject already chosen. */
const COLUMNS = [
  {
    title: 'finder.footer.col.catalogue',
    links: [
      { label: 'finder.footer.link.catalogue', section: 'collection' },
      { label: 'finder.footer.link.newArrivals', section: 'new-arrivals' },
      { label: 'finder.footer.link.bestsellers', section: 'bestsellers' },
      { label: 'finder.footer.link.scentFinder', to: SCENT_FINDER },
      { label: 'finder.footer.link.gifting', to: `${FAQ}#gifting` },
    ],
  },
  {
    title: 'finder.footer.col.house',
    links: [
      { label: 'finder.footer.link.story', section: 'house' },
      { label: 'finder.footer.link.sourcing', section: 'house' },
      { label: 'finder.footer.link.reading', section: 'notes' },
    ],
  },
  {
    title: 'finder.footer.col.care',
    links: [
      { label: 'finder.footer.link.shipping', to: SHIPPING },
      { label: 'finder.footer.link.faq', to: FAQ },
      { label: 'finder.footer.link.track', to: `${CONTACT}?subject=order` },
      { label: 'finder.footer.link.consultation', to: `${CONTACT}?subject=consultation` },
      { label: 'finder.footer.link.international', to: `${CONTACT}?subject=international` },
    ],
  },
]

// The methods the checkout offers. Brand names stay in their own script.
const PAYMENTS = ['KNET', 'Visa', 'Mastercard', 'Apple Pay']

// How long the button reads "Subscribed" before it offers to join again.
const SUBSCRIBED_MS = 3500

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

const LINK_CLASS =
  'nav-link nav-link-body t-body text-[14px] text-snow-200 transition-colors duration-300 hover:text-green-300'

export default function Footer({ onGoToSection }) {
  const { lang, t, isRtl } = useLocale()
  const uid = useId()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [subscribed, setSubscribed] = useState(false)
  const timer = useRef(null)
  const inputRef = useRef(null)
  const Forward = isRtl ? ArrowLeft : ArrowRight
  const errorId = `${uid}-error`

  useEffect(() => () => clearTimeout(timer.current), [])

  // Our own messages, in the page's language, rather than the browser's bubble.
  const handleSubmit = (event) => {
    event.preventDefault()
    const value = email.trim()
    const problem = !value ? 'required' : !EMAIL_PATTERN.test(value) ? 'invalidEmail' : null
    setError(problem)
    if (problem) {
      inputRef.current?.focus()
      return
    }
    setSubscribed(true)
    setEmail('')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setSubscribed(false), SUBSCRIBED_MS)
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
            <form onSubmit={handleSubmit} noValidate className="mt-7">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor={`${uid}-email`} className="sr-only">
                  {t('emailAddress')}
                </label>
                <input
                  ref={inputRef}
                  id={`${uid}-email`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (error) setError(null)
                  }}
                  placeholder={t('finder.footer.emailPlaceholder')}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  className={classNames('field flex-1', error && 'border-gold-300')}
                />
                <button type="submit" className="btn-paper group shrink-0">
                  {subscribed ? (
                    <>
                      <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
                      {t('subscribed')}
                    </>
                  ) : (
                    <>
                      {t('join')}
                      <Forward
                        aria-hidden="true"
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                        strokeWidth={1.5}
                      />
                    </>
                  )}
                </button>
              </div>
              {/* On the green band the house's alert red cannot be read, so an
                  error is gold-300 with an icon: never colour alone. */}
              {error && (
                <p id={errorId} role="alert" className="mt-3 flex items-center gap-2 font-sans text-[14px] text-gold-300 rtl:font-sans-ar">
                  <CircleAlert aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {t(error)}
                </p>
              )}
              {/* Said as well as shown: nothing stores an address yet, so the
                  form must not claim one was saved. */}
              <p role="status" className="t-body mt-3 text-[14px] text-snow-300 empty:mt-0">
                {subscribed ? t('finder.footer.subscribedNote') : ''}
              </p>
            </form>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1560px] px-5 py-14 sm:px-9">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="sm:col-span-2 md:col-span-1">
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
              {t('finder.footer.tagline', { year: formatNumber(HOUSE_FOUNDED, lang, { useGrouping: false }) })}
            </p>
            {/* One address in both languages: the Kuwait boutique. */}
            <address className="mt-6 space-y-2 not-italic">
              <p className="t-body text-[14px] text-snow-200">{t('finder.site.boutiqueAddress')}</p>
              <p>
                <a href={`mailto:${EMAIL}`} className={LINK_CLASS} dir="ltr">
                  {EMAIL}
                </a>
              </p>
              <p>
                <a href={`tel:${PHONE.replace(/\s/g, '')}`} className={LINK_CLASS} dir="ltr">
                  {PHONE}
                </a>
              </p>
            </address>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-labelledby={`${uid}-${column.title}`}>
              <h3 id={`${uid}-${column.title}`} className="ticket text-snow-50">
                {t(column.title)}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className={LINK_CLASS}>
                        {t(link.label)}
                      </Link>
                    ) : (
                      <a
                        href={`/#${link.section}`}
                        onClick={(event) => {
                          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
                          event.preventDefault()
                          onGoToSection(link.section)
                        }}
                        className={LINK_CLASS}
                      >
                        {t(link.label)}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-snow-50/20 pt-8">
          <span className="ticket me-2 text-snow-300">{t('weAccept')}</span>
          {PAYMENTS.map((method) => (
            <span
              key={method}
              lang="en"
              dir="ltr"
              className="border border-snow-50/20 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wide2 text-snow-200"
            >
              {method}
            </span>
          ))}
          <span className="border border-snow-50/20 px-3 py-1.5 font-sans text-[10px] uppercase tracking-wide2 text-snow-200 rtl:font-sans-ar rtl:text-[12px] rtl:normal-case rtl:tracking-normal">
            {t('finder.footer.cod')}
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-snow-50/20 pt-8 sm:flex-row">
          <p className="ticket text-center text-snow-300 sm:text-start">
            {t('rights', { year: formatNumber(new Date().getFullYear(), lang, { useGrouping: false }) })}
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
