import { useLocale } from '../../i18n/locale-context'
import { QUESTIONS } from '../../lib/scent-finder'
import { classNames, formatOrdinal } from '../../lib/format'

/**
 * The house meter for a match score: a green measure on a pale green track,
 * square at zero and rounded at the data end only. The score is always
 * written beside it; the bar illustrates the number, never replaces it.
 */
export function MatchMeter({ score, text, label, className }) {
  const share = Math.min(100, Math.max(0, score))
  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={share}
      aria-valuetext={text}
      className={classNames('relative h-2 bg-green-600/10', className)}
    >
      <div
        className={classNames('absolute inset-y-0 start-0 bg-green-600', share < 100 && 'rounded-e-[4px]')}
        style={{ width: `${share}%` }}
      />
    </div>
  )
}

/**
 * The five questions as a numbered list — the intro screen and the homepage
 * teaser both show what is about to be asked. `tone` is the ground it sits on.
 */
export function QuestionList({ tone = 'paper', className }) {
  const { lang, tr } = useLocale()
  const onGreen = tone === 'green'
  return (
    <ol className={classNames('border-t', onGreen ? 'border-snow-50/25' : 'border-gold-500/60', className)}>
      {QUESTIONS.map((question, index) => (
        <li
          key={question.id}
          className={classNames(
            'grid grid-cols-[2.75rem_1fr] gap-4 border-b py-5 sm:grid-cols-[3.5rem_1fr] sm:gap-6',
            onGreen ? 'border-snow-50/15' : 'border-snow-200',
          )}
        >
          <span className={classNames('ticket pt-1.5', onGreen ? 'text-gold-300' : 'text-green-600')}>
            {formatOrdinal(index + 1, lang)}
          </span>
          <div className="min-w-0">
            <p className={classNames('t-title text-[1.2rem]', onGreen && 'text-snow-50')}>{tr(question.title)}</p>
            <p className={classNames('t-body mt-1 text-[14px]', onGreen ? 'text-snow-200' : 'text-snow-600')}>
              {question.options.map((option) => tr(option)).join(' · ')}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
