import { Banknote, CreditCard, Info, Landmark, Smartphone } from 'lucide-react'
import DeliveryBadge from '../trust/DeliveryBadge'
import { useCart } from '../../context/cart-context'
import { useLocale } from '../../i18n/locale-context'
import { formatMobile } from '../../lib/format'
import GiftSummary from './GiftSummary'
import { addressFor, areaIdOf, toRecipient } from './checkout-logic'
import { AddressLine, ChoiceGroup, StepHeading, Typed } from './fields'

const PAYMENT_OPTIONS = [
  { value: 'knet', label: 'checkout.pay.knet', hint: 'checkout.pay.knetHint', icon: Landmark },
  { value: 'card', label: 'checkout.pay.card', hint: 'checkout.pay.cardHint', icon: CreditCard },
  { value: 'apple-pay', label: 'checkout.pay.applePay', hint: 'checkout.pay.applePayHint', icon: Smartphone },
  { value: 'cod', label: 'checkout.pay.cod', hint: 'checkout.pay.codHint', icon: Banknote },
]

/** One reviewed section with its "Change" link back to the step that set it. */
function ReviewRow({ title, onEdit, children }) {
  const { t } = useLocale()
  return (
    <section className="border-b border-snow-200 py-6">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="ticket text-snow-600">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          aria-label={t('checkout.review.changeLabel', { section: title })}
          className="ticket shrink-0 text-green-600 underline decoration-green-600/40 underline-offset-4 transition-colors duration-300 hover:text-ink-950 hover:decoration-ink-950"
        >
          {t('checkout.review.change')}
        </button>
      </div>
      <div className="mt-3 space-y-1 font-sans text-[15px] leading-relaxed text-ink-950 rtl:font-sans-ar">
        {children}
      </div>
    </section>
  )
}

/**
 * Step 3: everything once more before it is placed — contact, where and
 * when, the gift — then the payment method. `summary` is the order summary
 * shown inline on phones, where there is no side column.
 */
export default function ReviewStep({ form, errors, onChange, onEdit, headingRef, summary }) {
  const { gift } = useCart()
  const { t } = useLocale()
  const recipient = toRecipient(gift)
  const address = addressFor(form)
  // The recipient is never asked to pay for their own present.
  const payment = form.payment === 'cod' && recipient ? '' : form.payment

  return (
    <>
      <StepHeading ref={headingRef} title={t('checkout.review.title')} lede={t('checkout.review.lede')} />

      <div className="mt-4">
        <ReviewRow title={t('checkout.review.contact')} onEdit={() => onEdit(0)}>
          <p>
            <Typed>{form.name.trim()}</Typed>
          </p>
          <p className="text-snow-600">
            <bdi dir="ltr">{form.email.trim()}</bdi>
          </p>
          <p className="text-snow-600">
            <bdi dir="ltr">{formatMobile(form.mobile)}</bdi>
          </p>
        </ReviewRow>

        <ReviewRow title={t('checkout.review.deliverTo')} onEdit={() => onEdit(1)}>
          <p>
            <Typed>{(recipient ? form.recipientName : form.name).trim()}</Typed>
            {recipient && (
              <span className="text-snow-600">
                {' · '}
                <bdi dir="ltr">{formatMobile(form.recipientMobile)}</bdi>
              </span>
            )}
          </p>
          <p>
            <AddressLine address={address} />
          </p>
          {address.directions && (
            <p className="text-snow-600">
              <Typed>{address.directions}</Typed>
            </p>
          )}
          {form.notes.trim() && (
            <p className="text-snow-600">
              {t('checkout.field.notes')}: <Typed>{form.notes.trim()}</Typed>
            </p>
          )}
          <div className="pt-3">
            <DeliveryBadge areaId={areaIdOf(address)} variant="compact" />
          </div>
        </ReviewRow>

        <GiftSummary />
      </div>

      <ChoiceGroup
        name="payment"
        legend={t('checkout.payment.title')}
        value={payment}
        onChange={(value) => onChange({ payment: value })}
        error={errors.payment}
        options={PAYMENT_OPTIONS.map((option) => {
          const unavailable = option.value === 'cod' && recipient
          return {
            value: option.value,
            label: t(option.label),
            hint: t(option.hint),
            icon: option.icon,
            disabled: unavailable,
            note: unavailable ? t('checkout.pay.codUnavailable') : null,
          }
        })}
        className="mt-8"
      />

      <p className="mt-6 flex items-start gap-3 font-sans text-[13px] leading-relaxed text-snow-600 rtl:font-sans-ar">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={1.5} />
        {t('checkout.demo')}
      </p>

      {summary}
    </>
  )
}
