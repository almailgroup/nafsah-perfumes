import { forwardRef, Fragment, useLayoutEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLocale } from '../../i18n/locale-context'
import { formatAddress } from '../../lib/address'
import { classNames, toLatinDigits } from '../../lib/format'
import { caretAfterDigits, fieldId, groupMobile, mobileDigits } from './checkout-logic'

// The house field, bordered in alert red while it holds an error. Focus
// takes the green frame back, doubled to 2px so it reads at a glance; the
// message underneath keeps saying what is wrong.
const inputClass = (invalid, extra) =>
  classNames('field focus:shadow-[inset_0_0_0_1px_#006039]', invalid && 'border-alert-600', extra)

export function TextInput({ invalid, className, ...props }) {
  return <input {...props} className={inputClass(invalid, className)} />
}

export function TextArea({ invalid, className, rows = 2, ...props }) {
  return <textarea rows={rows} {...props} className={inputClass(invalid, classNames('resize-y', className))} />
}

function Message({ id, tone, children }) {
  return (
    <p
      id={id}
      className={classNames(
        'mt-2 font-sans text-[13px] leading-snug rtl:font-sans-ar',
        tone === 'error' ? 'text-alert-600' : 'text-snow-600',
      )}
    >
      {children}
    </p>
  )
}

/**
 * One labelled field: label, control, help and error. The control is a render
 * prop handed the id and ARIA wiring — aria-describedby names the error first,
 * then the help — so inputs, selects and textareas share one pattern.
 * `error` is a dictionary key.
 */
export function Field({ name, label, help, error, optional = false, describedBy, className, children }) {
  const { t } = useLocale()
  const id = fieldId(name)
  const helpId = help ? `${id}-help` : null
  const errorId = error ? `${id}-error` : null
  const aria = {
    id,
    'aria-describedby': [errorId, helpId, describedBy].filter(Boolean).join(' ') || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-required': optional ? undefined : true,
  }

  return (
    <div className={classNames('min-w-0', className)}>
      {/* One fixed line, so fields side by side start level with or without "Optional". */}
      <label htmlFor={id} className="mb-2 flex h-5 items-end justify-between gap-3">
        <span className="ticket truncate leading-5 text-snow-600">{label}</span>
        {optional && (
          <span className="shrink-0 font-sans text-[12px] leading-5 text-snow-600 rtl:font-sans-ar">
            {t('checkout.optional')}
          </span>
        )}
      </label>
      {children(aria, Boolean(error))}
      {help && <Message id={helpId}>{help}</Message>}
      {error && (
        <Message id={errorId} tone="error">
          {t(error)}
        </Message>
      )}
    </div>
  )
}

/** A native select in the house field, with the chevron on the logical end. */
export function Select({ invalid, className, children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={inputClass(
          invalid,
          classNames('cursor-pointer appearance-none pe-11 disabled:cursor-not-allowed disabled:text-snow-600', className),
        )}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute end-4 top-1/2 h-4 w-4 -translate-y-1/2 text-snow-600"
        strokeWidth={1.5}
      />
    </div>
  )
}

// The selected choice: a green frame and green type, as on the format toggle.
const CHECKED_CARD = 'border-green-600 bg-snow-100 shadow-[inset_0_0_0_1px_#006039]'
const FOCUS_RING =
  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-green-600 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-snow-50'

/**
 * A group of native radios: one Tab stop, arrow keys move and select (the
 * browser mirrors them in Arabic), each option a whole clickable label.
 *
 *   cards      label + hint (+ icon), one per row or two up — payment, who receives
 *   segmented  a two-way switch in a hairline frame — house or apartment
 */
export function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  variant = 'cards',
  className,
  columns = 'sm:grid-cols-2',
}) {
  const { t } = useLocale()
  const id = fieldId(name)
  const errorId = error ? `${id}-error` : null
  const segmented = variant === 'segmented'

  return (
    <fieldset className={classNames('min-w-0', className)}>
      <legend className="ticket mb-2 text-snow-600">{legend}</legend>
      <div
        className={classNames(
          'grid',
          segmented ? 'grid-cols-2 gap-px border border-snow-300 bg-snow-300' : classNames('gap-2', columns),
        )}
      >
        {options.map((option) => {
          const checked = option.value === value
          const Icon = option.icon
          const input = (
            <input
              type="radio"
              id={`${id}-${option.value}`}
              name={name}
              value={option.value}
              checked={checked}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
              aria-describedby={[errorId, option.note ? `${id}-${option.value}-note` : null].filter(Boolean).join(' ') || undefined}
              aria-invalid={error && checked ? true : undefined}
              className="sr-only"
            />
          )

          if (segmented) {
            return (
              <label
                key={option.value}
                className={classNames(
                  'relative flex min-h-[44px] cursor-pointer items-center justify-center px-3 py-2.5 text-center font-sans text-[14px] leading-snug transition-colors duration-300 rtl:font-sans-ar',
                  FOCUS_RING,
                  'has-[:focus-visible]:z-10',
                  checked
                    ? 'bg-snow-50 font-medium text-green-600 shadow-[inset_0_0_0_2px_#006039]'
                    : 'bg-snow-50 text-snow-600 hover:text-ink-950',
                )}
              >
                {input}
                {option.label}
              </label>
            )
          }

          return (
            <label
              key={option.value}
              className={classNames(
                'flex items-start gap-3 border px-4 py-3.5 transition-colors duration-300',
                FOCUS_RING,
                option.disabled
                  ? 'cursor-not-allowed border-snow-200 bg-snow-50'
                  : classNames('cursor-pointer', checked ? CHECKED_CARD : 'border-snow-300 bg-snow-50 hover:border-snow-600'),
              )}
            >
              {input}
              <span
                aria-hidden="true"
                className={classNames(
                  'mt-[3px] grid h-4 w-4 shrink-0 place-items-center rounded-full border',
                  checked ? 'border-green-600' : option.disabled ? 'border-snow-300' : 'border-snow-600',
                )}
              >
                {checked && <span className="h-2 w-2 rounded-full bg-green-600" />}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={classNames(
                    'block font-sans text-[15px] font-medium leading-snug rtl:font-sans-ar',
                    option.disabled ? 'text-snow-600' : 'text-ink-950',
                  )}
                >
                  {option.label}
                </span>
                {option.hint && (
                  <span className="mt-0.5 block font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">
                    {option.hint}
                  </span>
                )}
                {option.note && (
                  <span
                    id={`${id}-${option.value}-note`}
                    className="mt-1 block font-sans text-[12px] leading-snug text-snow-600 rtl:font-sans-ar"
                  >
                    {option.note}
                  </span>
                )}
              </span>
              {Icon && (
                <Icon
                  aria-hidden="true"
                  className={classNames('mt-0.5 h-5 w-5 shrink-0', option.disabled ? 'text-snow-300' : 'text-green-600')}
                  strokeWidth={1.25}
                />
              )}
            </label>
          )
        })}
      </div>
      {error && (
        <Message id={errorId} tone="error">
          {t(error)}
        </Message>
      )}
    </fieldset>
  )
}

/**
 * The Kuwaiti mobile: a fixed +965, then 8 digits grouped 4 + 4. Left to
 * right in both languages, as numbers are dialled. Arabic-Indic digits are
 * accepted and kept as Latin; a pasted +965 / 00965 is dropped. `value` is
 * the bare digits.
 */
export function MobileField({ name, label, help, error, value, onChange, autoComplete = 'tel-national', className }) {
  const { t } = useLocale()
  const inputRef = useRef(null)
  const pendingCaret = useRef(null)
  const prefixId = `${fieldId(name)}-prefix`

  // Regrouping rewrites the value; put the caret back beside the same digit.
  useLayoutEffect(() => {
    const input = inputRef.current
    if (pendingCaret.current == null || !input || document.activeElement !== input) return
    input.setSelectionRange(pendingCaret.current, pendingCaret.current)
    pendingCaret.current = null
  })

  const handleChange = (event) => {
    const raw = event.target.value
    const caret = event.target.selectionStart ?? raw.length
    let digits = mobileDigits(raw)
    let before = Math.min(digits.length, mobileDigits(raw.slice(0, caret)).length)
    // Backspace over the group space alone would change nothing; take the
    // digit in front of it instead, as a shopper expects.
    if (digits === value && raw.length < groupMobile(value).length && before > 0) {
      digits = value.slice(0, before - 1) + value.slice(before)
      before -= 1
    }
    // A pasted +965 was dropped: the caret belongs at the end.
    const pasted = toLatinDigits(raw).replace(/\D/g, '').length > 8
    pendingCaret.current = pasted ? groupMobile(digits).length : caretAfterDigits(groupMobile(digits), before)
    onChange(digits)
  }

  return (
    <Field name={name} label={label} help={help} error={error} describedBy={prefixId} className={className}>
      {(aria, invalid) => (
        <div
          dir="ltr"
          className={classNames(
            'flex items-stretch border bg-snow-100 transition-colors duration-200',
            'focus-within:border-green-600 focus-within:shadow-[inset_0_0_0_1px_#006039]',
            invalid ? 'border-alert-600' : 'border-snow-300',
          )}
        >
          <span
            aria-hidden="true"
            className="flex select-none items-center border-e border-snow-300 px-3.5 font-sans text-[16px] text-snow-600"
          >
            +965
          </span>
          <span id={prefixId} className="sr-only">
            {t('checkout.field.mobilePrefix')}
          </span>
          <input
            {...aria}
            ref={inputRef}
            type="tel"
            dir="ltr"
            inputMode="numeric"
            autoComplete={autoComplete}
            value={groupMobile(value)}
            onChange={handleChange}
            className="w-full min-w-0 bg-transparent px-4 py-3 font-sans text-[16px] tracking-[0.04em] text-ink-950 focus:outline-none focus:ring-0"
          />
        </div>
      )}
    </Field>
  )
}

/**
 * Text the shopper typed — a name, a street — in whichever script they used:
 * isolated from the sentence around it, Jost for Latin and Plex for Arabic.
 */
export function Typed({ children, className }) {
  return (
    <bdi
      className={classNames(
        // Arabic mode's own faces already carry Latin; English mode's need Plex for Arabic.
        "font-['Jost','IBM_Plex_Sans_Arabic','Futura',system-ui,sans-serif] rtl:[font-family:inherit]",
        className,
      )}
    >
      {children}
    </bdi>
  )
}

/**
 * The title of a step. It takes focus when the dialog opens and when the
 * step changes (tabIndex -1), so a screen reader starts reading the new step
 * from the top rather than from wherever the last button was.
 */
export const StepHeading = forwardRef(function StepHeading({ id, title, lede }, ref) {
  return (
    <div>
      {/* data-autofocus: opening the dialog lands here too, at the top of the form. */}
      <h3
        ref={ref}
        id={id}
        tabIndex={-1}
        data-autofocus
        className="t-title text-[1.6rem] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      >
        {title}
      </h3>
      {lede && <p className="t-body mt-2 text-[15px] text-snow-600">{lede}</p>}
    </div>
  )
})

/**
 * A formatted address line (formatAddress), each part isolated: a Latin
 * street inside an Arabic line, or the reverse, keeps its own order instead
 * of pulling the commas and numbers around it out of place.
 */
export function AddressLine({ address }) {
  const { lang } = useLocale()
  const sep = lang === 'ar' ? '، ' : ', '
  const halves = formatAddress(address, lang).split(' — ')
  return (
    <Typed>
      {halves.map((half, h) => (
        <Fragment key={h}>
          {h > 0 && ' — '}
          {half.split(sep).map((part, i) => (
            <Fragment key={i}>
              {i > 0 && sep}
              <bdi>{part}</bdi>
            </Fragment>
          ))}
        </Fragment>
      ))}
    </Typed>
  )
}
