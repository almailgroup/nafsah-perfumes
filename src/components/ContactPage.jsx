import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useLocale } from '../i18n/locale-context'
import { classNames } from '../lib/format'
import { useRouter } from '../router/router-context'

const EMAIL = 'atelier@nafsah.example'
const PHONE = '+965 2200 0000'

const CHANNELS = [
  { key: 'emailLabel', icon: Mail, value: EMAIL, href: `mailto:${EMAIL}`, ltr: false },
  { key: 'phoneLabel', icon: Phone, value: PHONE, href: `tel:${PHONE.replace(/\s/g, '')}`, ltr: true },
  { key: 'whatsappLabel', icon: MessageCircle, value: PHONE, href: `https://wa.me/${PHONE.replace(/[^\d]/g, '')}`, ltr: true },
]

const PLACES = [
  { key: 'boutiqueTitle', hours: 'boutiqueHours', address: 'finder.site.boutiqueAddress' },
  { key: 'atelierTitle', hours: 'atelierHours', address: 'finder.site.atelierAddress' },
]

// ?subject=order (the footer's "Track an Order") opens the form on that subject.
const SUBJECTS = [
  { id: 'general', label: 'subjectGeneral' },
  { id: 'order', label: 'subjectOrder' },
  { id: 'consultation', label: 'subjectConsultation' },
  { id: 'international', label: 'finder.contact.subjectInternational' },
  { id: 'wholesale', label: 'subjectWholesale' },
]
const EMPTY = { name: '', email: '', subject: 'general', message: '' }
const REQUIRED = ['name', 'email', 'message']

function subjectFrom(search) {
  const wanted = new URLSearchParams(search).get('subject')
  return SUBJECTS.some((subject) => subject.id === wanted) ? wanted : EMPTY.subject
}

/**
 * The contact page, at /contact rather than at an anchor in the footer.
 *
 * Nothing here posts anywhere — this is a demonstration storefront — but the
 * form validates for real, so the failure states are the ones a shopper would
 * actually meet.
 */
export default function ContactPage() {
  const { t } = useLocale()
  const { search } = useRouter()
  const uid = useId()
  const [form, setForm] = useState(() => ({ ...EMPTY, subject: subjectFrom(search) }))
  const [errors, setErrors] = useState({})
  const [sentTo, setSentTo] = useState(null)
  const fields = useRef({})
  const fieldId = (key) => `${uid}-${key}`
  const errorId = (key) => `${uid}-${key}-error`

  // A link to /contact?subject=… followed from this page changes only the
  // query: take the new subject and keep whatever is already typed.
  useEffect(() => {
    if (!new URLSearchParams(search).has('subject')) return
    setForm((current) => ({ ...current, subject: subjectFrom(search) }))
  }, [search])

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const next = {}
    // Message keys, not messages, so a language switch re-translates them.
    if (!form.name.trim()) next.name = 'required'
    if (!form.email.trim()) next.email = 'required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = 'invalidEmail'
    if (!form.message.trim()) next.message = 'required'
    setErrors(next)
    const first = REQUIRED.find((key) => next[key])
    if (first) {
      fields.current[first]?.focus()
      return
    }
    setSentTo(form.email)
    setForm({ ...EMPTY, subject: form.subject })
  }

  // Each required field: wired to its error, which is announced when it appears.
  const control = (key) => ({
    id: fieldId(key),
    ref: (node) => {
      fields.current[key] = node
    },
    value: form[key],
    onChange: update(key),
    'aria-required': true,
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? errorId(key) : undefined,
  })

  const label = (key) => (
    <span className="ticket block text-snow-600">{t(key)}</span>
  )

  const error = (key) =>
    errors[key] ? (
      <p id={errorId(key)} role="alert" className="mt-2 font-sans text-[13px] text-alert-600 rtl:font-sans-ar">
        {t(errors[key])}
      </p>
    ) : null

  return (
    <main id="main">
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
                  <label htmlFor={fieldId('name')} className="sm:col-span-1">
                    {label('fieldName')}
                    <input
                      {...control('name')}
                      autoComplete="name"
                      className={classNames('field mt-2', errors.name && 'border-alert-600')}
                    />
                    {error('name')}
                  </label>

                  <label htmlFor={fieldId('email')} className="sm:col-span-1">
                    {label('fieldEmail')}
                    <input
                      {...control('email')}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      className={classNames('field mt-2', errors.email && 'border-alert-600')}
                    />
                    {error('email')}
                  </label>

                  <label htmlFor={fieldId('subject')} className="relative sm:col-span-2">
                    {label('fieldSubject')}
                    <select
                      id={fieldId('subject')}
                      value={form.subject}
                      onChange={update('subject')}
                      className="field mt-2 cursor-pointer appearance-none pe-11"
                    >
                      {SUBJECTS.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {t(subject.label)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-4 end-4 h-4 w-4 text-snow-600"
                      strokeWidth={1.5}
                    />
                  </label>

                  <label htmlFor={fieldId('message')} className="sm:col-span-2">
                    {label('fieldMessage')}
                    <textarea
                      {...control('message')}
                      rows={6}
                      dir="auto"
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
              <p className="t-body mt-3 max-w-sm text-[15px] text-snow-600">{t('finder.contact.international')}</p>

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
                      {t(place.address)}
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
