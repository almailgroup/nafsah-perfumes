import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  User,
  X,
} from 'lucide-react'
import { useCart } from '../context/cart-context'
import { useOverlay } from '../hooks/useOverlay'
import { classNames, formatPrice } from '../lib/format'

const STEPS = [
  { id: 'contact', label: 'Contact', icon: User },
  { id: 'shipping', label: 'Shipping', icon: MapPin },
  { id: 'payment', label: 'Payment', icon: CreditCard },
]

const EMPTY_FORM = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postal: '',
  country: 'United States',
  card: '',
  expiry: '',
  cvc: '',
  nameOnCard: '',
}

const REQUIRED = {
  contact: ['email', 'firstName', 'lastName'],
  shipping: ['address', 'city', 'postal', 'country'],
  payment: ['nameOnCard', 'card', 'expiry', 'cvc'],
}

const LABELS = {
  email: 'Email address',
  firstName: 'First name',
  lastName: 'Last name',
  address: 'Street address',
  city: 'City',
  postal: 'Postal code',
  country: 'Country',
  card: 'Card number',
  expiry: 'Expiry',
  cvc: 'CVC',
  nameOnCard: 'Name on card',
}

/** Mock formatting so the fields feel like a real payment form. */
const formatCard = (value) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

function validate(step, form) {
  const errors = {}

  for (const field of REQUIRED[step]) {
    if (!form[field].trim()) errors[field] = `${LABELS[field]} is required`
  }

  if (step === 'contact' && form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = 'Enter a valid email address'
  }
  if (step === 'payment') {
    if (form.card.replace(/\s/g, '').length > 0 && form.card.replace(/\s/g, '').length < 16) {
      errors.card = 'Card number must be 16 digits'
    }
    if (form.expiry.trim() && !/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) {
      errors.expiry = 'Use MM/YY'
    }
    if (form.cvc.trim() && !/^\d{3,4}$/.test(form.cvc)) errors.cvc = '3 or 4 digits'
  }

  return errors
}

function Field({ id, label, error, className, ...props }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="ticket mb-2 block text-noir-500"
      >
        {label}
      </label>
      <input id={id}
        className={classNames('field', error && 'border-alert-600 focus:border-alert-600')} aria-invalid={Boolean(error)}
        {...props}
      />
      {error && <p className="mt-2 font-sans text-[12px] text-alert-600">{error}</p>}
    </div>
  )
}

export default function CheckoutModal() {
  const { lines, totals, isCheckoutOpen, closeCheckout, clearCart } = useCart()
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | processing | confirmed
  /** Snapshot of the placed order, captured before the cart is emptied. */
  const [receipt, setReceipt] = useState(null)

  const panelRef = useRef(null)
  /** Pending mock-authorisation timer, cancelled if the modal closes first. */
  const payTimer = useRef(null)

  useOverlay(isCheckoutOpen, closeCheckout, panelRef)

  // Cancel any in-flight authorisation whenever the modal closes — by button,
  // by scrim, or by Escape (which reaches closeCheckout directly via
  // useOverlay) — and on unmount. Otherwise the timer still fires and empties
  // the cart behind an order the customer abandoned.
  useEffect(() => {
    if (isCheckoutOpen) return undefined
    if (payTimer.current) {
      clearTimeout(payTimer.current)
      payTimer.current = null
      setStatus('idle')
    }
    return undefined
  }, [isCheckoutOpen])

  useEffect(
    () => () => {
      if (payTimer.current) clearTimeout(payTimer.current)
    },
    [],
  )

  // Reset the flow whenever the modal is re-opened for a new order.
  useEffect(() => {
    if (!isCheckoutOpen) return
    setStepIndex(0)
    setErrors({})
    setStatus('idle')
  }, [isCheckoutOpen])

  const step = STEPS[stepIndex]
  const isLast = stepIndex === STEPS.length - 1

  const update = (field) => (event) => {
    let value = event.target.value
    if (field === 'card') value = formatCard(value)
    if (field === 'expiry') value = formatExpiry(value)
    if (field === 'cvc') value = value.replace(/\D/g, '').slice(0, 4)

    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const { [field]: _removed, ...rest } = current
      return rest
    })
  }

  const handleNext = () => {
    const found = validate(step.id, form)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    if (!isLast) {
      setStepIndex((index) => index + 1)
      return
    }

    // Mock payment authorisation — no network call is made.
    setStatus('processing')
    const snapshot = {
      reference: `NFS-${Math.floor(100000 + Math.random() * 900000)}`,
      items: totals.count,
      total: totals.total,
      email: form.email,
    }
    payTimer.current = setTimeout(() => {
      payTimer.current = null
      setReceipt(snapshot)
      setStatus('confirmed')
      clearCart()
    }, 1500)
  }

  const handleClose = () => {
    closeCheckout()
    if (status === 'confirmed') setForm(EMPTY_FORM)
  }

  if (!isCheckoutOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        onClick={handleClose}
        className="absolute inset-0 animate-fade-in bg-noir-950/60 backdrop-blur-sm"
      />

      <div ref={panelRef} role="dialog" aria-modal="true"
        tabIndex={-1} aria-labelledby="checkout-title"
        className="relative flex max-h-[94vh] w-full max-w-3xl animate-scale-in flex-col overflow-hidden  border border-white/[0.08] bg-paper-50 border-noir-950/25 shadow-[0_40px_100px_-30px_rgba(20,18,16,0.5)] sm:"
      >
        <button type="button"
          onClick={handleClose} aria-label="Close checkout"
          className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full text-noir-600 transition-colors hover:text-noir-950"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>

        {status === 'confirmed' && receipt ? (
          <div className="flex flex-col items-center px-6 py-16 text-center sm:px-12">
            <span className="grid h-20 w-20 place-items-center rounded-full border border-oxblood-600/40 bg-oxblood-600/[0.07]">
              <BadgeCheck className="h-9 w-9 text-oxblood-600" strokeWidth={1.25} />
            </span>
            <h2 id="checkout-title" className="t-display-sm mt-7">Thank you</h2>
            <p className="t-deck mt-4 max-w-sm">
              Your order is confirmed. A receipt is on its way to{' '}
              <span className="text-noir-950">{receipt.email}</span>, and your parcel ships within two
              business days.
            </p>
            <div className="mt-8 w-full max-w-xs  border rule bg-paper-100/70 p-5 text-left">
              <div className="flex items-baseline justify-between gap-4">
                <span className="ticket text-noir-500">Order</span>
                <span className="t-figure text-[1.25rem] text-noir-950">{receipt.reference}</span>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between gap-4">
                <span className="ticket text-noir-500">Items</span>
                <span className="t-figure text-[1.25rem] text-noir-950">{receipt.items}</span>
              </div>
              <div className="mt-2.5 flex items-baseline justify-between gap-4">
                <span className="ticket text-noir-500">Paid</span>
                <span className="t-figure text-[1.25rem] text-noir-950">
                  {formatPrice(receipt.total)}
                </span>
              </div>
            </div>
            <button type="button" onClick={handleClose} className="btn-ink mt-9">
              Continue Browsing
            </button>
          </div>
        ) : (
          <>
            <header className="border-b rule px-6 pb-5 pt-6 sm:px-10">
              <h2 id="checkout-title" className="t-display-sm">Order Form</h2>

              {/* Step rail */}
              <ol className="mt-6 flex items-center gap-2 sm:gap-3">
                {STEPS.map((entry, index) => {
                  const done = index < stepIndex
                  const active = index === stepIndex
                  const Icon = done ? Check : entry.icon
                  return (
                    <li key={entry.id} className="flex flex-1 items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={classNames(
                            'grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-colors duration-300',
                            done && 'border-oxblood-600 bg-oxblood-600 text-paper-50',
                            active && 'border-noir-950 bg-noir-950 text-paper-50',
                            !done && !active && 'border-noir-950/25 text-noir-500',
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </span>
                        <span
                          className={classNames(
                            'hidden font-sans text-[10px] uppercase tracking-label transition-colors duration-300 sm:block',
                            active ? 'text-noir-950' : 'text-noir-500',
                          )}
                        >
                          {entry.label}
                        </span>
                      </div>
                      {index < STEPS.length - 1 && (
                        <span
                          className={classNames(
                            'h-px flex-1 transition-colors duration-500',
                            done ? 'bg-oxblood-600/60' : 'bg-noir-950/15',
                          )}
                        />
                      )}
                    </li>
                  )
                })}
              </ol>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-7 sm:px-10">
              <div key={step.id} className="animate-fade-in">
                {step.id === 'contact' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="email" type="email" label={LABELS.email} placeholder="you@example.com"
                      autoComplete="email" value={form.email}
                      onChange={update('email')} error={errors.email}
                      className="sm:col-span-2"
                    />
                    <Field id="firstName" label={LABELS.firstName} placeholder="Amira"
                      autoComplete="given-name" value={form.firstName}
                      onChange={update('firstName')} error={errors.firstName}
                    />
                    <Field id="lastName" label={LABELS.lastName} placeholder="Haddad"
                      autoComplete="family-name" value={form.lastName}
                      onChange={update('lastName')} error={errors.lastName}
                    />
                  </div>
                )}

                {step.id === 'shipping' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="address" label={LABELS.address} placeholder="14 Rue de la Paix"
                      autoComplete="street-address" value={form.address}
                      onChange={update('address')} error={errors.address}
                      className="sm:col-span-2"
                    />
                    <Field id="city" label={LABELS.city} placeholder="Paris"
                      autoComplete="address-level2" value={form.city}
                      onChange={update('city')} error={errors.city}
                    />
                    <Field id="postal" label={LABELS.postal} placeholder="75002"
                      autoComplete="postal-code" value={form.postal}
                      onChange={update('postal')} error={errors.postal}
                    />
                    <Field id="country" label={LABELS.country}
                      autoComplete="country-name" value={form.country}
                      onChange={update('country')} error={errors.country}
                      className="sm:col-span-2"
                    />
                  </div>
                )}

                {step.id === 'payment' && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="nameOnCard" label={LABELS.nameOnCard} placeholder="AMIRA HADDAD"
                      autoComplete="cc-name" value={form.nameOnCard}
                      onChange={update('nameOnCard')} error={errors.nameOnCard}
                      className="sm:col-span-2"
                    />
                    <Field id="card" label={LABELS.card} placeholder="4242 4242 4242 4242"
                      inputMode="numeric"
                      autoComplete="cc-number" value={form.card}
                      onChange={update('card')} error={errors.card}
                      className="sm:col-span-2"
                    />
                    <Field id="expiry" label={LABELS.expiry} placeholder="MM/YY"
                      inputMode="numeric"
                      autoComplete="cc-exp" value={form.expiry}
                      onChange={update('expiry')} error={errors.expiry}
                    />
                    <Field id="cvc" label={LABELS.cvc} placeholder="123"
                      inputMode="numeric"
                      autoComplete="cc-csc" value={form.cvc}
                      onChange={update('cvc')} error={errors.cvc}
                    />
                    <p className="sm:col-span-2 mt-1 flex items-center gap-2 text-[11px] text-noir-500">
                      <Lock className="h-3.5 w-3.5 text-noir-800" strokeWidth={1.5} />
                      Demonstration only — no card is charged and nothing is transmitted.
                    </p>
                  </div>
                )}

                {/* Order summary */}
                <div className="mt-8  border rule bg-paper-100/60 p-5">
                  <h3 className="ticket text-oxblood-600">Order summary</h3>
                  <ul className="mt-4 space-y-2.5">
                    {lines.map((line) => (
                      <li key={line.id} className="flex justify-between gap-4 text-sm">
                        <span className="min-w-0 truncate text-noir-800">
                          {line.product.name}
                          <span className="text-noir-500">
                            {' '}
                            · {line.ml}ml × {line.qty}
                          </span>
                        </span>
                        <span className="shrink-0 tabular-nums text-noir-950">
                          {formatPrice(line.subtotal)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 space-y-1.5 border-t rule pt-4 text-sm">
                    <div className="flex justify-between text-noir-600">
                      <span>Shipping</span>
                      <span className="tabular-nums">
                        {totals.shipping === 0 ? 'Complimentary' : formatPrice(totals.shipping)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1.5">
                      <span className="ticket text-noir-950">Total</span>
                      <span className="t-figure text-[1.75rem] text-noir-950">
                        {formatPrice(totals.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <footer className="flex items-center justify-between gap-3 border-t rule bg-paper-100/40 px-6 py-5 sm:px-10">
              <button type="button"
                onClick={() => (stepIndex === 0 ? handleClose() : setStepIndex((i) => i - 1))}
                className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-label text-noir-600 transition-colors hover:text-noir-950"
              >
                <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
                {stepIndex === 0 ? 'Cancel' : STEPS[stepIndex - 1].label}
              </button>

              <button type="button"
                onClick={handleNext} disabled={status === 'processing' || lines.length === 0}
                className="btn-ink group"
              >
                {status === 'processing' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                    Processing
                  </>
                ) : (
                  <>
                    {isLast ? `Pay ${formatPrice(totals.total)}` : 'Continue'}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </>
                )}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  )
}
