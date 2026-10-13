import { useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, TestTube, X } from 'lucide-react'
import { RETURN_WINDOW_DAYS } from '../../data/delivery'
import { FORMATS } from '../../data/taxonomy'
import { useOverlay } from '../../hooks/useOverlay'
import { useLocale } from '../../i18n/locale-context'
import { SHIPPING } from '../../router/router-context'
import { classNames, formatMl, formatNumber } from '../../lib/format'

// The policy follows the data: which formats carry a vial, and its size.
const VIAL_ML = FORMATS.find((format) => format.kind === 'sample')?.ml ?? 2
const WITH_VIAL = FORMATS.filter((format) => format.tryFirst)
const WITHOUT_VIAL = FORMATS.filter((format) => !format.tryFirst)

const listFormats = new Map()
const joined = (items, lang, type) => {
  const key = `${lang}|${type}`
  if (!listFormats.has(key)) listFormats.set(key, new Intl.ListFormat(lang, { style: 'long', type }))
  return listFormats.get(key).format(items)
}

/**
 * The figures every Try First sentence quotes, in the active language and
 * script. Exported for the homepage trust badges, so they quote the same.
 */
// eslint-disable-next-line react-refresh/only-export-components -- a hook beside the components it serves
export function useTryFirstVars() {
  const { lang, tc, tr } = useLocale()
  return {
    vial: formatMl(VIAL_ML, lang),
    formats: joined(WITH_VIAL.map(tr), lang, 'conjunction'),
    others: joined(WITHOUT_VIAL.map(tr), lang, 'disjunction'),
    period: tc('trust.days', RETURN_WINDOW_DAYS),
  }
}

/** "How it works", with the policy's name for a screen reader that lists buttons. */
function HowItWorks({ onClick, className, onGreen = false }) {
  const { t } = useLocale()
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={onClick}
      className={classNames(
        'ticket shrink-0 underline underline-offset-4 transition-colors duration-300',
        onGreen
          ? 'text-snow-50 decoration-gold-300 hover:decoration-snow-50'
          : 'text-green-600 decoration-green-600/40 hover:text-ink-950 hover:decoration-ink-950',
        className,
      )}
    >
      {t('trust.howItWorks')}
      <span className="sr-only"> — {t('trust.tryFirst')}</span>
    </button>
  )
}

/**
 * Try First, in brief, with its own "How it works" button that opens the
 * full terms in TryFirstModal.
 *
 *   compact  one line under a product's price: "Try First — a free 2 ml test
 *            vial comes with this bottle"
 *   inline   two lines in a hairline box, for the cart or a policy page
 *   band     a full-width homepage strip with the three steps
 */
export function TryFirstBanner({ variant = 'inline' }) {
  const { lang, t } = useLocale()
  const vars = useTryFirstVars()
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const show = () => setOpen(true)
  const modal = <TryFirstModal open={open} onClose={() => setOpen(false)} />

  if (variant === 'compact') {
    return (
      <div className="flex items-start gap-3 border-y border-snow-200 py-3.5">
        <TestTube aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={1.5} />
        <p className="min-w-0 flex-1 font-sans text-[14px] leading-snug text-ink-950 rtl:font-sans-ar">
          <span className="font-medium">{t('trust.tryFirst')}</span>
          <span className="text-snow-600">{' — '}</span>
          {t('trust.compactBody', vars)}
        </p>
        <HowItWorks onClick={show} className="mt-0.5" />
        {modal}
      </div>
    )
  }

  if (variant === 'band') {
    const steps = ['trust.bandStep1', 'trust.bandStep2', 'trust.bandStep3']
    return (
      <section aria-labelledby={titleId} className="border-y border-snow-200 bg-snow-100">
        <div className="mx-auto grid max-w-[1560px] gap-10 px-5 py-14 sm:px-9 sm:py-20 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <p className="ticket flex items-center gap-2.5 text-green-600">
              <TestTube aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              {t('trust.tryFirst')}
            </p>
            <h2 id={titleId} className="t-h2 mt-4">
              {t('trust.bandTitle')}
            </h2>
            <p className="t-body mt-5 max-w-xl">{t('trust.bandBody', vars)}</p>
            <button type="button" aria-haspopup="dialog" onClick={show} className="btn-outline mt-8">
              {t('trust.howItWorks')}
              <span className="sr-only"> — {t('trust.tryFirst')}</span>
            </button>
          </div>
          <ol className="grid border-t border-gold-500/60 sm:grid-cols-3 sm:border-t-0">
            {steps.map((key, index) => (
              <li
                key={key}
                className={classNames(
                  'flex items-baseline gap-4 border-b border-snow-200 py-5 sm:block sm:border-b-0 sm:border-t sm:border-gold-500/60 sm:py-0 sm:pt-6',
                  index > 0 && 'sm:border-s sm:border-s-snow-200 sm:ps-6',
                  index < steps.length - 1 && 'sm:pe-6',
                )}
              >
                <span className="ticket text-green-600">{formatNumber(index + 1, lang, { minimumIntegerDigits: 2 })}</span>
                <p className="t-title text-[1.15rem] sm:mt-4">{t(key)}</p>
              </li>
            ))}
          </ol>
        </div>
        {modal}
      </section>
    )
  }

  return (
    <div className="flex items-start gap-4 border border-snow-200 bg-snow-100 px-5 py-4">
      <TestTube aria-hidden="true" className="mt-1 h-[18px] w-[18px] shrink-0 text-green-600" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="font-sans text-[14px] font-medium leading-snug text-ink-950 rtl:font-sans-ar">
          {t('trust.inlineTitle')}
        </p>
        <p className="mt-1 font-sans text-[13px] leading-relaxed text-snow-600 rtl:font-sans-ar">
          {t('trust.inlineBody', vars)}
        </p>
        <HowItWorks onClick={show} className="mt-2.5" />
      </div>
      {modal}
    </div>
  )
}

/**
 * The full Try First terms, as a dialog above whatever opened it — a product
 * page, the cart, the trust band. Rendered into <body>: an ancestor's
 * transform or overflow (the product panel has both) would otherwise trap a
 * fixed layer inside it.
 */
export function TryFirstModal({ open, onClose }) {
  if (!open || typeof document === 'undefined') return null
  return createPortal(<TryFirstDialog onClose={onClose} />, document.body)
}

function TryFirstDialog({ onClose }) {
  const { lang, t } = useLocale()
  const vars = useTryFirstVars()
  const panelRef = useRef(null)
  const uid = useId()
  useOverlay(true, onClose, panelRef)

  const steps = [1, 2, 3]
  const conditions = ['trust.modal.condition1', 'trust.modal.condition2', 'trust.modal.condition3']
  const included = ['trust.modal.included1', 'trust.modal.included2', 'trust.modal.included3']

  return (
    <div className="fixed inset-0 z-[65] flex items-stretch justify-center sm:items-center sm:p-6">
      <div onClick={onClose} className="absolute inset-0 animate-fade-in bg-ink-950/40 backdrop-blur-sm" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-title`}
        aria-describedby={`${uid}-lede`}
        tabIndex={-1}
        className="relative flex h-full w-full max-w-2xl animate-scale-in flex-col border border-snow-200 bg-snow-50 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] focus:outline-none sm:h-auto sm:max-h-[90vh]"
      >
        <header className="flex items-start justify-between gap-6 border-b border-snow-200 px-6 pb-5 pt-6 sm:px-9 sm:pt-8">
          <div className="min-w-0">
            <p className="ticket flex items-center gap-2.5 text-green-600">
              <TestTube aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
              {t('trust.modal.eyebrow')}
            </p>
            <h2 id={`${uid}-title`} className="t-h2 mt-3">
              {t('trust.tryFirst')}
            </h2>
          </div>
          <button
            data-autofocus
            type="button"
            onClick={onClose}
            aria-label={t('trust.modal.close')}
            className="-me-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-snow-600 transition-colors duration-300 hover:bg-snow-100 hover:text-ink-950"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-6 sm:px-9">
          <p id={`${uid}-lede`} className="t-body text-[17px]">
            {t('trust.modal.lede', vars)}
          </p>

          <section aria-labelledby={`${uid}-included`} className="mt-8">
            <h3 id={`${uid}-included`} className="ticket text-green-600">
              {t('trust.modal.includedTitle')}
            </h3>
            <ul className="mt-3 border-t border-snow-200">
              {included.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 border-b border-snow-200 py-3 font-sans text-[15px] leading-snug text-ink-950 rtl:font-sans-ar"
                >
                  <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  {t(key, vars)}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby={`${uid}-how`} className="mt-8">
            <h3 id={`${uid}-how`} className="ticket text-green-600">
              {t('trust.modal.howTitle')}
            </h3>
            <ol className="mt-3 border-t border-snow-200">
              {steps.map((n) => (
                <li key={n} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 border-b border-snow-200 py-4">
                  <span aria-hidden="true" className="t-figure pt-0.5 text-[15px] text-green-600">
                    {formatNumber(n, lang, { minimumIntegerDigits: 2 })}
                  </span>
                  <div>
                    <p className="font-sans text-[15px] font-medium leading-snug text-ink-950 rtl:font-sans-ar">
                      {t(`trust.modal.step${n}Title`)}
                    </p>
                    <p className="mt-1 font-sans text-[14px] leading-relaxed text-snow-600 rtl:font-sans-ar">
                      {t(`trust.modal.step${n}Body`, vars)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby={`${uid}-conditions`} className="mt-8">
            <h3 id={`${uid}-conditions`} className="ticket text-green-600">
              {t('trust.modal.conditionsTitle')}
            </h3>
            <ul className="mt-3 border-t border-snow-200">
              {conditions.map((key) => (
                <li
                  key={key}
                  className="flex gap-3 border-b border-snow-200 py-3 font-sans text-[14px] leading-snug text-ink-950 rtl:font-sans-ar"
                >
                  <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <footer className="flex flex-col-reverse gap-4 border-t border-snow-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
          {/* A new tab, so a cart or checkout in progress is left as it was. */}
          <a
            href={`${SHIPPING}/#try-first`}
            target="_blank"
            rel="noopener noreferrer"
            className="ticket inline-flex items-center gap-1.5 self-start text-green-600 underline underline-offset-4 transition-colors hover:text-ink-950 sm:self-auto"
          >
            {t('trust.modal.policyLink')}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={1.5} />
            <span className="sr-only"> {t('trust.newTab')}</span>
          </a>
          <button type="button" onClick={onClose} className="btn-green">
            {t('trust.modal.close')}
          </button>
        </footer>
      </div>
    </div>
  )
}
