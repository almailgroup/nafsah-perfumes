import { useState } from 'react'
import { Check, ChevronDown, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useLocale } from '../i18n/locale-context'
import { classNames } from '../lib/format'

const EMAIL = 'atelier@nafsah.example'
const PHONE = '+965 2200 0000'

const CHANNELS = [
  { key: 'emailLabel', icon: Mail, value: EMAIL, href: `mailto:${EMAIL}`, ltr: false },
  { key: 'phoneLabel', icon: Phone, value: PHONE, href: `tel:${PHONE.replace(/\s/g, '')}`, ltr: true },
  { key: 'whatsappLabel', icon: MessageCircle, value: PHONE, href: `https://wa.me/${PHONE.replace(/[^\d]/g, '')}`, ltr: true },
]

const PLACES = [
  {
    key: 'boutiqueTitle',
    hours: 'boutiqueHours',
    address: { en: 'Arabian Gulf Street, Kuwait City', ar: 'شارع الخليج العربي، مدينة الكويت' },
  },
  {
    key: 'atelierTitle',
    hours: 'atelierHours',
    address: { en: '12 Boulevard du Jeu de Ballon, Grasse', ar: '١٢ شارع جو دو بالون، غراس' },
  },
]

const SUBJECTS = ['subjectGeneral', 'subjectOrder', 'subjectConsultation', 'subjectWholesale']
const EMPTY = { name: '', email: '', subject: 'subjectGeneral', message: '' }

/**
 * The contact page, at /contact rather than at an anchor in the footer.
 *
 * Nothing here posts anywhere — this is a demonstration storefront — but the
 * form validates for real, so the failure states are the ones a shopper would
 * actually meet.
 */
export default function ContactPage() {
  const { t, pick } = useLocale()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sentTo, setSentTo] = useState(null)

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = {}
    if (!form.name.trim()) next.name = t('required')
    if (!form.email.trim()) next.email = t('required')
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = t('invalidEmail')
    if (!form.message.trim()) next.message = t('required')
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setSentTo(form.email)
    setForm(EMPTY)
  }

  const label = (key) => (
    <span className="ticket block text-snow-600">{t(key)}</span>
  )

  const error = (key) =>
    errors[key] ? (
      <p role="alert" className="mt-2 font-sans text-[13px] text-alert-600 rtl:font-sans-ar">
        {errors[key]}
      </p>
    ) : null

  return (
    <main>
      <section className="bg-snow-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
          <header className="max-w-3xl border-b border-gold-500/60 pb-8">
            <p className="ticket text-green-600">{t('contactEyebrow')}</p>
            <h1 className="t-h2 mt-4">{t('contactHeading')}</h1>
            <p className="t-body mt-6 max-w-xl">{t('contactLede')}</p>
          </header>

          <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* ---- the form ---- */}
            <div>
              <h2 className="t-title">{t('contactFormTitle')}</h2>

              {sentTo ? (
                <div className="mt-7 border border-green-600/40 bg-snow-100 px-6 py-8">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-green-600/40">
                    <Check className="h-5 w-5 text-green-600" strokeWidth={1.5} />
                  </span>
                  <p className="t-title mt-5 text-[1.25rem]">{t('messageSent')}</p>
                  <p className="t-body mt-3 max-w-sm">{t('messageSentBody', { email: sentTo })}</p>
                  <button
                    type="button"
                    onClick={() => setSentTo(null)}
                    className="ticket mt-6 text-green-600 underline underline-offset-4 transition-colors hover:text-ink-950"
                  >
                    {t('sendAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="mt-7 grid gap-5 sm:grid-cols-2">
                  <label htmlFor="contact-name" className="sm:col-span-1">
                    {label('fieldName')}
                    <input
                      id="contact-name"
                      value={form.name}
                      onChange={update('name')}
                      aria-invalid={Boolean(errors.name)}
                      className={classNames('field mt-2', errors.name && 'border-alert-600')}
                    />
                    {error('name')}
                  </label>

                  <label htmlFor="contact-email" className="sm:col-span-1">
                    {label('fieldEmail')}
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      aria-invalid={Boolean(errors.email)}
                      className={classNames('field mt-2', errors.email && 'border-alert-600')}
                    />
                    {error('email')}
                  </label>

                  <label htmlFor="contact-subject" className="relative sm:col-span-2">
                    {label('fieldSubject')}
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={update('subject')}
                      className="field mt-2 cursor-pointer appearance-none pe-11"
                    >
                      {SUBJECTS.map((key) => (
                        <option key={key} value={key}>
                          {t(key)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-4 end-4 h-4 w-4 text-snow-600"
                      strokeWidth={1.5}
                    />
                  </label>

                  <label htmlFor="contact-message" className="sm:col-span-2">
                    {label('fieldMessage')}
                    <textarea
                      id="contact-message"
                      rows={6}
                      value={form.message}
                      onChange={update('message')}
                      aria-invalid={Boolean(errors.message)}
                      className={classNames('field mt-2 resize-y', errors.message && 'border-alert-600')}
                    />
                    {error('message')}
                  </label>

                  <button type="submit" className="btn-green sm:col-span-2 sm:justify-self-start">
                    {t('sendMessage')}
                  </button>
                </form>
              )}
            </div>

            {/* ---- direct channels and the two addresses ---- */}
            <aside className="lg:border-s lg:border-snow-200 lg:ps-16">
              <h2 className="t-title">{t('contactDirect')}</h2>
              <p className="t-body mt-4 max-w-sm text-[15px]">{t('contactResponse')}</p>

              <ul className="mt-8 border-t border-gold-500/60">
                {CHANNELS.map(({ key, icon: Icon, value, href, ltr }) => (
                  <li key={key} className="border-b border-snow-200 last:border-b-0">
                    <a
                      href={href}
                      className="group flex items-center gap-4 py-4 transition-colors duration-300 hover:text-green-600"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-green-600" strokeWidth={1.5} />
                      <span className="ticket w-24 shrink-0 text-snow-600">{t(key)}</span>
                      <span className="t-body text-[15px] text-ink-950" dir={ltr ? 'ltr' : undefined}>
                        {value}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
                {PLACES.map((place) => (
                  <div key={place.key} className="border-t border-snow-200 pt-6">
                    <h3 className="ticket text-green-600">{t(place.key)}</h3>
                    <p className="t-body mt-3 flex items-start gap-3 text-[15px]">
                      <MapPin className="mt-1 h-4 w-4 shrink-0 text-snow-600" strokeWidth={1.5} />
                      {pick(place.address.en, place.address.ar)}
                    </p>
                    <p className="t-body mt-2 flex items-start gap-3 text-[14px] text-snow-600">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span>
                        <span className="sr-only">{t('hoursLabel')}: </span>
                        {t(place.hours)}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}
