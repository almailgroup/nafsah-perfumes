import { useEffect, useId, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import StarInput from './StarInput'
import { useLocale } from '../../i18n/locale-context'
import {
  AREA_MAX,
  BODY_MAX,
  BODY_MIN,
  NAME_MAX,
  RATING_KEYS,
  RATING_MAX,
  RATING_MIN,
  textLength,
  validateReview,
} from '../../lib/reviews'
import { classNames, formatNumber } from '../../lib/format'

const EMPTY = {
  name: '',
  area: '',
  body: '',
  ratings: Object.fromEntries(RATING_KEYS.map((key) => [key, 0])),
}

// Where focus goes after a failed submit: the first problem in reading order.
const FIELD_ORDER = [...RATING_KEYS, 'body', 'name', 'area']
const SCALE = [1, 2, 3, 4, 5]

/**
 * Write a review: the four ratings (all required), the text with a live
 * count, a name and, if they like, an area. Errors appear on submit, are
 * tied to their field with aria-describedby, and clear as each is fixed;
 * focus goes to the first one. A saved review says plainly where it went.
 *
 * `add(draft)` is useReviews().add; `onDone` closes the form.
 */
export default function ReviewForm({ productName, add, onDone }) {
  const { lang, t, tc } = useLocale()
  const uid = useId()
  const id = (name) => `${uid}-${name}`

  const [draft, setDraft] = useState(EMPTY)
  const [attempted, setAttempted] = useState(false)
  const [storageError, setStorageError] = useState(null)
  const [saved, setSaved] = useState(null)
  // { field, count, n } from the last failed submit: where focus goes, and
  // what the summary says until the next one.
  const [failure, setFailure] = useState(null)

  const fieldRefs = useRef({})
  const successRef = useRef(null)

  const errors = attempted ? validateReview({ ...draft, productId: 'draft' }) : {}
  const invalid = FIELD_ORDER.filter((field) => errors[field])

  const vars = {
    min: formatNumber(RATING_MIN, lang),
    max: formatNumber(RATING_MAX, lang),
  }
  const messageVars = {
    rating: vars,
    body: { min: formatNumber(BODY_MIN, lang), max: formatNumber(BODY_MAX, lang) },
    name: { max: formatNumber(NAME_MAX, lang) },
    area: { max: formatNumber(AREA_MAX, lang) },
  }
  const message = (field) => {
    const key = errors[field]
    if (!key) return null
    return t(key, RATING_KEYS.includes(field) ? messageVars.rating : messageVars[field])
  }

  // After a failed submit, move to the first field that needs attention.
  useEffect(() => {
    const node = failure?.field && fieldRefs.current[failure.field]
    if (!node) return
    const target = node.getAttribute('role') === 'radiogroup' ? node.querySelector('[tabindex="0"]') : node
    target?.focus()
  }, [failure])

  useEffect(() => {
    if (saved) successRef.current?.focus()
  }, [saved])

  const set = (field) => (event) => setDraft((current) => ({ ...current, [field]: event.target.value }))
  const rate = (key) => (value) =>
    setDraft((current) => ({ ...current, ratings: { ...current.ratings, [key]: value } }))

  const handleSubmit = (event) => {
    event.preventDefault()
    setStorageError(null)
    const result = add({ ...draft, lang })
    if (result.ok) {
      setSaved(result.review)
      setDraft(EMPTY)
      setAttempted(false)
      setFailure(null)
      return
    }
    setAttempted(true)
    if (result.errors.form) setStorageError(result.errors.form)
    const fields = FIELD_ORDER.filter((field) => result.errors[field])
    setFailure((last) => ({ field: fields[0] ?? null, count: fields.length, n: (last?.n ?? 0) + 1 }))
  }

  const describedBy = (...ids) => ids.filter(Boolean).join(' ') || undefined
  const bodyLength = textLength(draft.body)

  if (saved) {
    return (
      <div className="border border-green-600/40 bg-snow-100 px-6 py-7">
        <span className="grid h-11 w-11 place-items-center rounded-full border border-green-600/40">
          <Check aria-hidden="true" className="h-5 w-5 text-green-600" strokeWidth={1.5} />
        </span>
        <h4
          ref={successRef}
          tabIndex={-1}
          className="t-title mt-5 text-[1.25rem] focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          {t('reviews.form.successTitle', { name: saved.name })}
        </h4>
        <p className="t-body mt-3 max-w-md text-[15px]">{t('reviews.form.successBody')}</p>
        <button
          type="button"
          onClick={onDone}
          className="ticket mt-6 text-green-600 underline underline-offset-4 transition-colors hover:text-ink-950"
        >
          {t('reviews.form.done')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-labelledby={id('title')} className="border border-snow-200 bg-snow-50">
      <div className="border-b border-snow-200 bg-snow-100 px-5 py-4 sm:px-6">
        <h4 id={id('title')} className="t-title text-[1.2rem]">
          {t('reviews.form.title', { name: productName })}
        </h4>
      </div>

      <div className="px-5 pb-6 pt-5 sm:px-6">
        <fieldset>
          <legend className="ticket text-green-600">{t('reviews.form.ratings')}</legend>
          <p className="mt-1.5 font-sans text-[13px] text-snow-600 rtl:font-sans-ar">{t('reviews.form.allRequired')}</p>

          <div className="mt-3 border-t border-snow-200">
            {RATING_KEYS.map((key) => {
              const error = message(key)
              return (
                <div
                  key={key}
                  className="grid gap-x-6 gap-y-2 border-b border-snow-200 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                >
                  <div className="min-w-0">
                    <p
                      id={id(`${key}-label`)}
                      className="font-sans text-[15px] font-medium leading-snug text-ink-950 rtl:font-sans-ar"
                    >
                      {t(`reviews.dim.${key}`)}
                    </p>
                    <p
                      id={id(`${key}-help`)}
                      className="mt-1 font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar"
                    >
                      {t(`reviews.help.${key}`)}
                    </p>
                  </div>
                  <StarInput
                    ref={(node) => {
                      fieldRefs.current[key] = node
                    }}
                    value={draft.ratings[key]}
                    onChange={rate(key)}
                    labels={SCALE.map((n) => t(`reviews.scale.${key}.${n}`))}
                    labelledBy={id(`${key}-label`)}
                    describedBy={describedBy(id(`${key}-help`), error && id(`${key}-error`))}
                    invalid={Boolean(error)}
                  />
                  {error && (
                    <p
                      id={id(`${key}-error`)}
                      className="font-sans text-[13px] text-alert-600 rtl:font-sans-ar sm:col-span-2"
                    >
                      {error}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </fieldset>

        <div className="mt-6">
          <label htmlFor={id('body')} className="ticket block text-snow-600">
            {t('reviews.form.body')}
          </label>
          <textarea
            id={id('body')}
            ref={(node) => {
              fieldRefs.current.body = node
            }}
            rows={5}
            dir="auto"
            value={draft.body}
            onChange={set('body')}
            aria-required="true"
            aria-invalid={Boolean(errors.body) || undefined}
            aria-describedby={describedBy(id('body-help'), id('body-count'), errors.body && id('body-error'))}
            className={classNames(
              'field mt-2 resize-y focus:shadow-[inset_0_0_0_1px_#006039]',
              errors.body && 'border-alert-600',
            )}
          />
          <div className="mt-2 flex items-start justify-between gap-4">
            <p id={id('body-help')} className="font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">
              {t('reviews.form.bodyHelp', { min: formatNumber(BODY_MIN, lang) })}
            </p>
            <p
              id={id('body-count')}
              className={classNames(
                't-figure shrink-0 text-[12px] font-normal',
                bodyLength > BODY_MAX ? 'text-alert-600' : 'text-snow-600',
              )}
            >
              {t('reviews.form.counter', {
                count: formatNumber(bodyLength, lang),
                max: formatNumber(BODY_MAX, lang),
              })}
            </p>
          </div>
          {errors.body && (
            <p id={id('body-error')} className="mt-2 font-sans text-[13px] text-alert-600 rtl:font-sans-ar">
              {message('body')}
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={id('name')} className="ticket block text-snow-600">
              {t('reviews.form.name')}
            </label>
            <input
              id={id('name')}
              ref={(node) => {
                fieldRefs.current.name = node
              }}
              type="text"
              autoComplete="given-name"
              dir="auto"
              maxLength={NAME_MAX}
              value={draft.name}
              onChange={set('name')}
              aria-required="true"
              aria-invalid={Boolean(errors.name) || undefined}
              aria-describedby={describedBy(id('name-help'), errors.name && id('name-error'))}
              className={classNames(
                'field mt-2 focus:shadow-[inset_0_0_0_1px_#006039]',
                errors.name && 'border-alert-600',
              )}
            />
            <p id={id('name-help')} className="mt-2 font-sans text-[13px] text-snow-600 rtl:font-sans-ar">
              {t('reviews.form.nameHelp')}
            </p>
            {errors.name && (
              <p id={id('name-error')} className="mt-1 font-sans text-[13px] text-alert-600 rtl:font-sans-ar">
                {message('name')}
              </p>
            )}
          </div>

          <div>
            <label htmlFor={id('area')} className="ticket block text-snow-600">
              {t('reviews.form.area')}{' '}
              <span className="normal-case tracking-normal">({t('reviews.form.optional')})</span>
            </label>
            <input
              id={id('area')}
              ref={(node) => {
                fieldRefs.current.area = node
              }}
              type="text"
              autoComplete="address-level2"
              dir="auto"
              maxLength={AREA_MAX}
              value={draft.area}
              onChange={set('area')}
              aria-invalid={Boolean(errors.area) || undefined}
              aria-describedby={describedBy(id('area-help'), errors.area && id('area-error'))}
              className={classNames(
                'field mt-2 focus:shadow-[inset_0_0_0_1px_#006039]',
                errors.area && 'border-alert-600',
              )}
            />
            <p id={id('area-help')} className="mt-2 font-sans text-[13px] text-snow-600 rtl:font-sans-ar">
              {t('reviews.form.areaHelp')}
            </p>
            {errors.area && (
              <p id={id('area-error')} className="mt-1 font-sans text-[13px] text-alert-600 rtl:font-sans-ar">
                {message('area')}
              </p>
            )}
          </div>
        </div>

        {/* Announced once per failed submit (keyed by it); the fields carry the
            details, and the summary goes once they are all put right. */}
        <div role="alert">
          {storageError ? (
            <p
              key={failure?.n}
              className="mt-6 border-s-2 border-alert-600 ps-4 font-sans text-[14px] text-alert-600 rtl:font-sans-ar"
            >
              {t(storageError)}
            </p>
          ) : (
            failure?.count > 0 &&
            invalid.length > 0 && (
              <p
                key={failure.n}
                className="mt-6 border-s-2 border-alert-600 ps-4 font-sans text-[14px] text-alert-600 rtl:font-sans-ar"
              >
                {tc('reviews.form.errorSummary', failure.count)}
              </p>
            )
          )}
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-snow-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-sm font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">
            {t('reviews.form.localNote')}
          </p>
          <button type="submit" className="btn-green shrink-0">
            {t('reviews.form.submit')}
          </button>
        </div>
      </div>
    </form>
  )
}
