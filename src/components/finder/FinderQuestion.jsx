import { useId, useRef } from 'react'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { OPTION_ICONS } from './finder-utils'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatNumber } from '../../lib/format'

/**
 * One question: where we are, the question, and its answers as large option
 * cards.
 *
 * The cards are an ARIA radiogroup with a roving tab stop. Arrow keys move
 * through them and select as they go (left and right follow the reading
 * direction), Home and End jump to the ends. Activating a card — a click, a
 * tap, Enter or Space — chooses it and moves on after a beat; browsing with
 * the arrows never does, so the keyboard can look before it leaps. Back and
 * Next are always there.
 */
export default function FinderQuestion({
  question,
  index,
  total,
  value,
  onChoose,
  onBack,
  onNext,
  nextLabel,
  headingRef,
}) {
  const { lang, t, tr, isRtl } = useLocale()
  const uid = useId()
  const titleId = `${uid}-title`
  const hintId = `${uid}-hint`
  const stepId = `${uid}-step`
  const refs = useRef([])
  const Back = isRtl ? ArrowRight : ArrowLeft
  const Forward = isRtl ? ArrowLeft : ArrowRight

  const options = question.options
  const selectedIndex = options.findIndex((option) => option.id === value)
  const tabStop = selectedIndex >= 0 ? selectedIndex : 0
  const stepText = t('finder.step', { step: formatNumber(index + 1, lang), total: formatNumber(total, lang) })

  const onKeyDown = (event, at) => {
    const last = options.length - 1
    const forward = isRtl ? 'ArrowLeft' : 'ArrowRight'
    const backward = isRtl ? 'ArrowRight' : 'ArrowLeft'
    let next = null
    if (event.key === 'ArrowDown' || event.key === forward) next = at === last ? 0 : at + 1
    else if (event.key === 'ArrowUp' || event.key === backward) next = at === 0 ? last : at - 1
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    if (next === null) return
    event.preventDefault()
    refs.current[next]?.focus()
    onChoose(options[next].id, { advance: false })
  }

  return (
    <section aria-labelledby={titleId} className="animate-fade-in">
      <div className="flex items-baseline justify-between gap-6">
        {/* Not a live region: the screen is remounted per question, so the
            step is read as the description of the heading that takes focus. */}
        <p id={stepId} className="ticket text-green-600">
          {stepText}
        </p>
        <p className="ticket text-end text-snow-600">{tr(question.label)}</p>
      </div>
      {/* Progress as steps: each one parted from the next by a 2px gap of paper. */}
      <div
        role="progressbar"
        aria-label={t('finder.progress')}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={index + 1}
        aria-valuetext={stepText}
        className="mt-4 grid gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }, (_, step) => (
          <span key={step} className={classNames('h-1', step <= index ? 'bg-green-600' : 'bg-green-600/10')} />
        ))}
      </div>

      <h1
        id={titleId}
        ref={headingRef}
        tabIndex={-1}
        aria-describedby={stepId}
        className="t-h2 mt-10 max-w-3xl outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:mt-14"
      >
        {tr(question.title)}
      </h1>
      <p id={hintId} className="t-body mt-4 max-w-xl text-snow-600">
        {tr(question.hint)}
      </p>

      <div
        role="radiogroup"
        aria-labelledby={titleId}
        aria-describedby={hintId}
        className={classNames(
          'mt-8 grid gap-3 sm:mt-10 sm:gap-5',
          options.length === 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-3',
        )}
      >
        {options.map((option, at) => {
          const selected = at === selectedIndex
          const Icon = OPTION_ICONS[option.icon]
          return (
            <button
              key={option.id}
              ref={(node) => {
                refs.current[at] = node
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={at === tabStop ? 0 : -1}
              onClick={() => onChoose(option.id, { advance: true })}
              onKeyDown={(event) => onKeyDown(event, at)}
              className={classNames(
                'group relative flex h-full w-full items-start gap-4 border p-5 text-start transition-[border-color,background-color,box-shadow] duration-300 sm:flex-col sm:gap-6 sm:p-6',
                selected
                  ? 'border-green-600 bg-snow-100 shadow-[inset_0_0_0_1px_#006039]'
                  : 'border-snow-200 bg-snow-50 hover:border-green-600/50 hover:shadow-[0_14px_34px_-24px_rgba(8,20,15,0.45)]',
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  'grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-300 sm:h-12 sm:w-12',
                  selected
                    ? 'border-green-600 bg-green-600 text-snow-50'
                    : 'border-snow-300 text-green-600 group-hover:border-green-600/60',
                )}
              >
                {Icon && <Icon className="h-5 w-5" strokeWidth={1.25} />}
              </span>
              <span className="min-w-0 pe-6 sm:pe-0">
                <span className="t-title block text-[1.2rem]">{tr(option)}</span>
                <span className="t-body mt-1.5 block text-[14px] leading-relaxed text-snow-600">{tr(option.hint)}</span>
              </span>
              {selected && (
                <Check
                  aria-hidden="true"
                  className="absolute end-4 top-4 h-4 w-4 text-green-600 sm:end-5 sm:top-5"
                  strokeWidth={1.75}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-snow-200 pt-6 sm:mt-12">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex min-h-11 items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-wide2 text-snow-600 transition-colors duration-300 hover:text-green-600 rtl:font-sans-ar rtl:text-[13px] rtl:normal-case rtl:tracking-normal"
        >
          <Back
            aria-hidden="true"
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
            strokeWidth={1.5}
          />
          {t('finder.back')}
        </button>
        <div className="flex items-center gap-5">
          {!value && (
            <p className="t-body hidden text-[14px] text-snow-600 sm:block">{t('finder.chooseOne')}</p>
          )}
          <button type="button" onClick={onNext} disabled={!value} className="btn-green group">
            {nextLabel}
            <Forward
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 group-disabled:translate-x-0 rtl:group-hover:-translate-x-1"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>
    </section>
  )
}
