import { ArrowUpRight } from 'lucide-react'
import DeliveryBadge from '../trust/DeliveryBadge'
import { useCart } from '../../context/cart-context'
import { useLocale } from '../../i18n/locale-context'
import { CONTACT } from '../../router/router-context'
import AddressFields from './AddressFields'
import { areaIdOf, toRecipient } from './checkout-logic'
import { ChoiceGroup, Field, MobileField, StepHeading, TextArea, TextInput } from './fields'

/**
 * Step 2: where it goes. A gift can go to the shopper or straight to the
 * recipient, whose name and mobile the driver needs. Then the Kuwaiti
 * address, the delivery promise for the chosen area, and a note for the
 * driver.
 */
export default function DeliveryStep({ form, errors, onChange, onAddress, headingRef }) {
  const { gift, setGift } = useCart()
  const { t } = useLocale()
  const recipient = toRecipient(gift)

  return (
    <>
      <StepHeading ref={headingRef} title={t('checkout.delivery.title')} />

      {gift.enabled && (
        <ChoiceGroup
          name="giftWho"
          legend={t('checkout.giftWho.legend')}
          value={gift.deliverToRecipient ? 'recipient' : 'me'}
          onChange={(value) => setGift({ deliverToRecipient: value === 'recipient' })}
          options={[
            { value: 'me', label: t('checkout.giftWho.me'), hint: t('checkout.giftWho.meHint') },
            {
              value: 'recipient',
              label: t('checkout.giftWho.recipient'),
              hint: t('checkout.giftWho.recipientHint'),
            },
          ]}
          className="mt-7"
        />
      )}

      {recipient && (
        <section aria-labelledby="checkout-recipient-title" className="mt-8 animate-fade-in">
          <h4 id="checkout-recipient-title" className="ticket border-b border-snow-200 pb-3 text-green-600">
            {t('checkout.recipient.title')}
          </h4>
          <div className="mt-6 grid grid-cols-6 gap-x-4 gap-y-5">
            <Field
              name="recipientName"
              label={t('checkout.field.recipientName')}
              error={errors.recipientName}
              className="col-span-6 sm:col-span-3"
            >
              {(aria, invalid) => (
                <TextInput
                  {...aria}
                  invalid={invalid}
                  autoComplete="section-recipient name"
                  value={form.recipientName}
                  onChange={(event) => onChange({ recipientName: event.target.value })}
                />
              )}
            </Field>
            <MobileField
              name="recipientMobile"
              label={t('checkout.field.recipientMobile')}
              help={t('checkout.field.recipientMobileHelp')}
              error={errors.recipientMobile}
              value={form.recipientMobile}
              onChange={(recipientMobile) => onChange({ recipientMobile })}
              autoComplete="section-recipient tel-national"
              className="col-span-6 sm:col-span-3"
            />
          </div>
        </section>
      )}

      <section aria-labelledby="checkout-address-title" className="mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5 border-b border-snow-200 pb-3">
          <h4 id="checkout-address-title" className="ticket text-green-600">
            {t(recipient ? 'checkout.address.titleRecipient' : 'checkout.address.title')}
          </h4>
          <p className="font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">
            {t('checkout.address.kuwaitOnly')}{' '}
            {/* A new tab, so the order in progress stays as it is. */}
            <a
              href={`${CONTACT}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-green-600 underline decoration-green-600/40 underline-offset-4 transition-colors duration-300 hover:text-ink-950 hover:decoration-ink-950"
            >
              {t('checkout.address.abroad')}
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={1.5} />
              <span className="sr-only"> {t('checkout.newTab')}</span>
            </a>
          </p>
        </div>

        <div className="mt-6">
          <AddressFields
            address={form.address}
            buildingType={form.buildingType}
            errors={errors}
            onChange={onAddress}
            onBuildingType={(buildingType) => onChange({ buildingType })}
          />
        </div>
      </section>

      <section aria-labelledby="checkout-promise-title" className="mt-8 border border-snow-200 bg-snow-100 px-5 py-4">
        <h4 id="checkout-promise-title" className="ticket mb-3 text-snow-600">
          {t('checkout.promise.title')}
        </h4>
        <DeliveryBadge areaId={areaIdOf(form.address)} variant="inline" />
      </section>

      <Field
        name="notes"
        label={t('checkout.field.notes')}
        help={t('checkout.field.notesHelp')}
        optional
        error={errors.notes}
        className="mt-6"
      >
        {(aria, invalid) => (
          <TextArea
            {...aria}
            invalid={invalid}
            value={form.notes}
            onChange={(event) => onChange({ notes: event.target.value })}
          />
        )}
      </Field>
    </>
  )
}
