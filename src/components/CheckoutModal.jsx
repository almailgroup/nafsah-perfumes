import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronDown, Loader2, ShoppingBag, X } from 'lucide-react'
import { useCart } from '../context/cart-context'
import { useLocale } from '../i18n/locale-context'
import { useOverlay } from '../hooks/useOverlay'
import { classNames, formatPrice } from '../lib/format'
import Confirmation from './checkout/Confirmation'
import DeliveryStep from './checkout/DeliveryStep'
import DetailsStep from './checkout/DetailsStep'
import OrderSummary from './checkout/OrderSummary'
import ReviewStep from './checkout/ReviewStep'
import StepRail from './checkout/StepRail'
import {
  areaIdOf,
  buildReceipt,
  EMPTY_FORM,
  FIELD_LABELS,
  fieldId,
  firstIncompleteStep,
  orderedErrors,
  STEPS,
  validateStep,
} from './checkout/checkout-logic'

const STEP_LABELS = { details: 'checkout.step.details', delivery: 'checkout.step.delivery', review: 'checkout.step.review' }
const NEXT_LABELS = { details: 'checkout.next.delivery', delivery: 'checkout.next.review' }

// The mock authorisation: long enough to read as a payment page handing back.
const AUTHORISE_MS = 1500

/** Focus a field by name; a radio group is focused on its checked option. */
function focusField(panel, field) {
  if (!panel) return
  const node =
    panel.querySelector(`#${fieldId(field)}`) ??
    panel.querySelector(`input[type="radio"][name="${field}"]:checked`) ??
    panel.querySelector(`input[type="radio"][name="${field}"]:not(:disabled)`)
  node?.focus()
}

/**
 * Checkout, in three steps over the cart: details, delivery, review & pay.
 *
 * Delivery is within Kuwait only, to a Kuwaiti address; a gift can go
 * straight to its recipient. Nothing is charged or sent — the payment method
 * is recorded and the order confirmed locally — but the form validates for
 * real, in both languages, and the confirmation reads back exactly what a
 * shopper would be promised.
 *
 * The draft survives closing the dialog for the rest of the visit; a placed
 * order clears it, however the confirmation is then closed.
 */
export default function CheckoutModal() {
  const {
    lines,
    totals,
    gift,
    isCheckoutOpen,
    closeCheckout,
    openCart,
    clearCart,
    deliveryAreaId,
    setDeliveryAreaId,
  } = useCart()
  const { lang, t, tc, isRtl } = useLocale()
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  /** The fields flagged by the last failed Continue, for the error summary. */
  const [flagged, setFlagged] = useState([])
  const [status, setStatus] = useState('idle') // idle | processing | confirmed
  /** The placed order, captured before the cart is emptied. */
  const [receipt, setReceipt] = useState(null)
  const [summaryOpen, setSummaryOpen] = useState(false)

  const panelRef = useRef(null)
  const scrollRef = useRef(null)
  const headingRef = useRef(null)
  const confirmationRef = useRef(null)
  /** Pending mock-authorisation timer, cancelled if the dialog closes first. */
  const payTimer = useRef(null)
  /** What to focus after the next render: 'heading', 'confirmation' or a field name. */
  const pendingFocus = useRef(null)
  const summaryId = useId()

  useOverlay(isCheckoutOpen, closeCheckout, panelRef)

  // Closing — by button, scrim or Escape — cancels an authorisation in flight,
  // so an abandoned order never empties the cart behind the shopper, and sets
  // the dialog back to its first step for next time. A placed order's receipt
  // goes with it. (Its draft was already cleared when it was placed.)
  useEffect(() => {
    if (isCheckoutOpen) return
    clearTimeout(payTimer.current)
    payTimer.current = null
    setStatus('idle')
    setReceipt(null)
    setStepIndex(0)
    setErrors({})
    setFlagged([])
    setSummaryOpen(false)
  }, [isCheckoutOpen])

  useEffect(() => () => clearTimeout(payTimer.current), [])

  // Focus after a step change, a failed Continue or the confirmation.
  useLayoutEffect(() => {
    const target = pendingFocus.current
    if (!target) return
    pendingFocus.current = null
    if (target === 'heading' || target === 'confirmation') {
      if (scrollRef.current) scrollRef.current.scrollTop = 0
      const node = target === 'heading' ? headingRef.current : confirmationRef.current
      node?.focus({ preventScroll: true })
      return
    }
    focusField(panelRef.current, target)
  })

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1
  const processing = status === 'processing'
  const steps = STEPS.map((id) => ({ id, label: t(STEP_LABELS[id]) }))

  const clearErrors = (fields) =>
    setErrors((current) => {
      if (!fields.some((field) => current[field])) return current
      const next = { ...current }
      fields.forEach((field) => delete next[field])
      return next
    })

  const update = (patch) => {
    setForm((current) => ({ ...current, ...patch }))
    clearErrors(Object.keys(patch))
  }

  const updateAddress = (patch) => {
    setForm((current) => ({ ...current, address: { ...current.address, ...patch } }))
    clearErrors(Object.keys(patch))
    // The area decides the outlying-area fee in the totals.
    if ('area' in patch) setDeliveryAreaId(areaIdOf(patch))
  }

  const goTo = (index) => {
    setStepIndex(index)
    setErrors({})
    setFlagged([])
    pendingFocus.current = 'heading'
  }

  const showErrors = (index, found) => {
    const fields = orderedErrors(STEPS[index], found)
    if (index !== stepIndex) setStepIndex(index)
    setErrors(found)
    setFlagged(fields)
    pendingFocus.current = fields[0] ?? 'heading'
  }

  const placeOrder = () => {
    // A gift switched to direct delivery at review still needs its recipient.
    const incomplete = firstIncompleteStep(form, gift)
    if (incomplete) {
      showErrors(incomplete.index, incomplete.errors)
      return
    }
    const snapshot = buildReceipt({ form, gift, lines, totals, now: new Date() })
    setStatus('processing')
    payTimer.current = setTimeout(() => {
      payTimer.current = null
      setReceipt(snapshot)
      setStatus('confirmed')
      // The order is placed: its draft, cart, gift and area go with it.
      setForm(EMPTY_FORM)
      setDeliveryAreaId(null)
      clearCart()
      pendingFocus.current = 'confirmation'
    }, AUTHORISE_MS)
  }

  const handleNext = () => {
    if (processing || lines.length === 0) return
    const found = validateStep(step, form, gift)
    if (Object.keys(found).length > 0) showErrors(stepIndex, found)
    else if (isLast) placeOrder()
    else goTo(stepIndex + 1)
  }

  const handleBack = () => {
    if (processing) return
    if (stepIndex > 0) {
      goTo(stepIndex - 1)
      return
    }
    closeCheckout()
    openCart()
  }

  // Enter in one of the checkout's own text fields continues, as in a form.
  // (Not in a textarea, and not in the gift panel's fields at review.)
  const handleKeyDown = (event) => {
    const { target } = event
    if (event.key !== 'Enter' || event.isComposing || target.tagName !== 'INPUT') return
    if (!target.id?.startsWith('checkout-') || ['radio', 'checkbox'].includes(target.type)) return
    event.preventDefault()
    handleNext()
  }

  if (!isCheckoutOpen) return null

  const confirmed = status === 'confirmed' && receipt
  const Forward = isRtl ? ArrowLeft : ArrowRight
  const Backward = isRtl ? ArrowRight : ArrowLeft
  const summary = (
    <OrderSummary lines={lines} totals={totals} gift={gift} areaChosen={Boolean(deliveryAreaId)} />
  )
  const stepProps = { form, errors, onChange: update, headingRef }

  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center sm:items-center sm:p-6">
      <div onClick={closeCheckout} className="absolute inset-0 animate-fade-in bg-ink-950/35 backdrop-blur-sm" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-title"
        tabIndex={-1}
        className="relative flex h-full w-full max-w-5xl animate-scale-in flex-col bg-snow-50 shadow-[0_40px_100px_-30px_rgba(8,20,15,0.5)] focus:outline-none sm:h-[min(92vh,920px)] sm:border sm:border-snow-200"
      >
        {confirmed ? (
          <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto">
            {/* Scrolls away with the receipt rather than sit over it. */}
            <button
              type="button"
              onClick={closeCheckout}
              aria-label={t('checkout.close')}
              className="absolute end-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-snow-600 transition-colors duration-300 hover:bg-snow-100 hover:text-ink-950"
            >
              <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <Confirmation ref={confirmationRef} receipt={receipt} onClose={closeCheckout} />
          </div>
        ) : (
          <>
            <header className="border-b border-snow-200 px-6 pb-5 pt-5 sm:px-10 sm:pt-7">
              <div className="flex items-center justify-between gap-6">
                <h2 id="checkout-title" className="t-h2 text-[1.75rem] sm:text-[2rem]">
                  {t('checkout.title')}
                </h2>
                <button
                  type="button"
                  onClick={closeCheckout}
                  aria-label={t('checkout.close')}
                  className="-me-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-snow-600 transition-colors duration-300 hover:bg-snow-100 hover:text-ink-950"
                >
                  <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              <div className="mt-5">
                <StepRail steps={steps} current={stepIndex} onSelect={goTo} disabled={processing} />
              </div>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
                <span className="grid h-20 w-20 place-items-center border border-snow-200">
                  <ShoppingBag aria-hidden="true" className="h-7 w-7 text-snow-600" strokeWidth={1} />
                </span>
                <p className="t-title mt-6">{t('cartEmpty')}</p>
                <p className="t-body mt-2 max-w-xs text-snow-600">{t('checkout.empty.body')}</p>
                <button type="button" onClick={closeCheckout} className="btn-green mt-8">
                  {t('browseCatalogue')}
                </button>
              </div>
            ) : (
              <>
                <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto" onKeyDown={handleKeyDown}>
                  <div className="lg:grid lg:min-h-full lg:grid-cols-[minmax(0,1fr)_22.5rem]">
                    <div className="min-w-0">
                      {/* Phones and tablets: the summary folds away above the form. */}
                      {!isLast && (
                        <div className="border-b border-snow-200 bg-snow-100 lg:hidden">
                          <button
                            type="button"
                            aria-expanded={summaryOpen}
                            aria-controls={summaryId}
                            onClick={() => setSummaryOpen((open) => !open)}
                            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-start sm:px-10"
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              <ShoppingBag aria-hidden="true" className="h-4 w-4 shrink-0 text-green-600" strokeWidth={1.5} />
                              <span className="ticket whitespace-nowrap text-ink-950">{t('orderSummary')}</span>
                              <span className="ticket sr-only whitespace-nowrap text-snow-600 sm:not-sr-only">
                                {tc('checkout.summary.items', totals.count)}
                              </span>
                              <ChevronDown
                                aria-hidden="true"
                                className={classNames(
                                  'h-4 w-4 shrink-0 text-snow-600 transition-transform duration-300',
                                  summaryOpen && 'rotate-180',
                                )}
                                strokeWidth={1.5}
                              />
                            </span>
                            <span className="t-figure shrink-0 text-[16px] text-ink-950">
                              {formatPrice(totals.totalFils, lang)}
                            </span>
                          </button>
                          <div id={summaryId} hidden={!summaryOpen} className="px-6 pb-6 sm:px-10">
                            {summary}
                          </div>
                        </div>
                      )}

                      <div key={step} className="animate-fade-in px-6 py-7 sm:px-10 sm:py-9">
                        {flagged.length > 0 && (
                          <div
                            role="alert"
                            className="mb-7 border border-alert-600/50 border-s-2 border-s-alert-600 bg-snow-100 px-5 py-4"
                          >
                            <p className="font-sans text-[14px] font-medium text-alert-600 rtl:font-sans-ar">
                              {tc('checkout.err.summary', flagged.length)}
                            </p>
                            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                              {flagged.map((field) => (
                                <li key={field}>
                                  <button
                                    type="button"
                                    onClick={() => focusField(panelRef.current, field)}
                                    className="font-sans text-[14px] text-ink-950 underline decoration-alert-600/50 underline-offset-4 transition-colors hover:text-alert-600 rtl:font-sans-ar"
                                  >
                                    {t(FIELD_LABELS[field])}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {step === 'details' && <DetailsStep {...stepProps} />}
                        {step === 'delivery' && <DeliveryStep {...stepProps} onAddress={updateAddress} />}
                        {step === 'review' && (
                          <ReviewStep
                            {...stepProps}
                            onEdit={goTo}
                            summary={
                              <OrderSummary
                                title={t('orderSummary')}
                                headingId="checkout-review-summary"
                                lines={lines}
                                totals={totals}
                                gift={gift}
                                className="mt-10 lg:hidden"
                              />
                            }
                          />
                        )}
                      </div>
                    </div>

                    <aside className="hidden border-s border-snow-200 bg-snow-100 lg:block">
                      <div className="sticky top-0 px-8 py-9">
                        <OrderSummary
                          title={t('orderSummary')}
                          headingId="checkout-aside-summary"
                          lines={lines}
                          totals={totals}
                          gift={gift}
                          areaChosen={Boolean(deliveryAreaId)}
                        />
                      </div>
                    </aside>
                  </div>
                </div>

                <footer className="flex items-center justify-between gap-4 border-t border-snow-200 bg-snow-50 px-6 py-4 sm:px-10 sm:py-5">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={processing}
                    className="group inline-flex shrink-0 items-center gap-2 py-2 font-sans text-[11px] font-medium uppercase tracking-wide2 text-snow-600 transition-colors duration-300 hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-40 rtl:text-[13px] rtl:normal-case rtl:tracking-normal"
                  >
                    <Backward
                      aria-hidden="true"
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5"
                      strokeWidth={1.75}
                    />
                    {stepIndex === 0 ? t('checkout.backToCart') : steps[stepIndex - 1].label}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={processing}
                    className="btn-green group min-w-0 flex-1 px-5 sm:flex-none sm:px-8"
                  >
                    {processing ? (
                      <>
                        <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" strokeWidth={2} />
                        {t('checkout.placing')}
                      </>
                    ) : (
                      <>
                        {isLast ? (
                          // Phones drop the total from the button rather than cut it
                          // short; it sits just above, at the foot of the summary.
                          <>
                            <span className="sm:hidden">{t('checkout.placeOrderShort')}</span>
                            <span className="hidden sm:inline">
                              {t('checkout.placeOrder', { total: formatPrice(totals.totalFils, lang) })}
                            </span>
                          </>
                        ) : (
                          <span className="truncate">{t(NEXT_LABELS[step])}</span>
                        )}
                        <Forward
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                          strokeWidth={1.75}
                        />
                      </>
                    )}
                  </button>
                </footer>
              </>
            )}
            <p role="status" className="sr-only">
              {processing ? t('checkout.placing') : ''}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
