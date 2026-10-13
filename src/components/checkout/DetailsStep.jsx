import { useLocale } from '../../i18n/locale-context'
import { Field, MobileField, StepHeading, TextInput } from './fields'

/** Step 1: who is ordering, and the email and mobile the order is confirmed and tracked on. */
export default function DetailsStep({ form, errors, onChange, headingRef }) {
  const { t } = useLocale()

  return (
    <>
      <StepHeading ref={headingRef} title={t('checkout.details.title')} lede={t('checkout.details.lede')} />

      <div className="mt-7 grid grid-cols-6 gap-x-4 gap-y-5">
        <Field name="name" label={t('checkout.field.name')} error={errors.name} className="col-span-6">
          {(aria, invalid) => (
            <TextInput
              {...aria}
              invalid={invalid}
              autoComplete="name"
              value={form.name}
              onChange={(event) => onChange({ name: event.target.value })}
            />
          )}
        </Field>

        <Field
          name="email"
          label={t('checkout.field.email')}
          help={t('checkout.field.emailHelp')}
          error={errors.email}
          className="col-span-6 sm:col-span-3"
        >
          {(aria, invalid) => (
            <TextInput
              {...aria}
              invalid={invalid}
              type="email"
              dir="ltr"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              value={form.email}
              onChange={(event) => onChange({ email: event.target.value })}
              className="rtl:text-right"
            />
          )}
        </Field>

        <MobileField
          name="mobile"
          label={t('checkout.field.mobile')}
          help={t('checkout.field.mobileHelp')}
          error={errors.mobile}
          value={form.mobile}
          onChange={(mobile) => onChange({ mobile })}
          className="col-span-6 sm:col-span-3"
        />
      </div>
    </>
  )
}
