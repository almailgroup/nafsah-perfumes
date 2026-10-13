import { useCallback, useEffect, useRef, useState } from 'react'
import FinderIntro from './FinderIntro'
import FinderQuestion from './FinderQuestion'
import FinderResults from './FinderResults'
import { useLocale } from '../../i18n/locale-context'
import { QUESTIONS, QUESTION_IDS, answersFromSearch, isComplete, searchFromAnswers } from '../../lib/scent-finder'
import { useRouter } from '../../router/router-context'

// Long enough to see the card take the choice, short enough not to wait for it.
const ADVANCE_MS = 380

/** The query string with the finder's own parameters replaced by `answers` and anything else kept. */
function withAnswers(search, answers) {
  const params = new URLSearchParams(search)
  for (const id of QUESTION_IDS) params.delete(id)
  new URLSearchParams(searchFromAnswers(answers)).forEach((value, key) => params.set(key, value))
  const query = params.toString()
  return query ? `?${query}` : ''
}

/**
 * /scent-finder: an intro, five questions one at a time, then the results.
 *
 * On the results the answers are mirrored in the address
 * (?occasion=…&vibe=…), so a result can be shared or bookmarked, and an
 * address carrying a full set of answers opens straight on its results.
 * Nothing is stored anywhere else.
 *
 * App keys this page on the router's navigation key, so following a link to
 * the finder (or back and forward) starts again from the address.
 */
export default function ScentFinderPage({ onOpenProduct, onSeeAll }) {
  const { t } = useLocale()
  const { search, replaceSearch } = useRouter()
  const [initial] = useState(() => answersFromSearch(search))
  const [answers, setAnswers] = useState(initial)
  const [phase, setPhase] = useState(() => (isComplete(initial) ? 'results' : 'intro'))
  const [step, setStep] = useState(0)
  // Set while an answer is being changed from the results: moving on returns there.
  const [editing, setEditing] = useState(false)
  const headingRef = useRef(null)
  const sectionRef = useRef(null)
  const advanceTimer = useRef(null)
  // Focus follows the shopper's own moves, never the page's arrival.
  const moved = useRef(false)

  useEffect(() => () => clearTimeout(advanceTimer.current), [])

  useEffect(() => {
    replaceSearch(withAnswers(window.location.search, phase === 'results' ? answers : {}))
  }, [phase, answers, replaceSearch])

  // Each new screen: bring its top into view if it is above the fold, and put
  // focus on its heading so a screen reader starts reading from there.
  useEffect(() => {
    if (!moved.current) return
    const section = sectionRef.current
    if (section && section.getBoundingClientRect().top < 0) section.scrollIntoView({ block: 'start' })
    headingRef.current?.focus({ preventScroll: true })
  }, [phase, step])

  const go = useCallback((nextPhase, nextStep = 0) => {
    clearTimeout(advanceTimer.current)
    moved.current = true
    setPhase(nextPhase)
    setStep(nextStep)
  }, [])

  const goNext = useCallback(
    (from) => {
      if (editing || from >= QUESTIONS.length - 1) {
        setEditing(false)
        go('results')
      } else {
        go('quiz', from + 1)
      }
    },
    [editing, go],
  )

  const goBack = () => {
    if (editing) {
      setEditing(false)
      go('results')
    } else if (step === 0) {
      go('intro')
    } else {
      go('quiz', step - 1)
    }
  }

  const question = QUESTIONS[step]

  const choose = (optionId, { advance }) => {
    setAnswers((current) => ({ ...current, [question.id]: optionId }))
    clearTimeout(advanceTimer.current)
    if (advance) {
      const from = step
      advanceTimer.current = setTimeout(() => goNext(from), ADVANCE_MS)
    }
  }

  const restart = () => {
    setAnswers({})
    setEditing(false)
    go('quiz', 0)
  }

  const edit = (index) => {
    setEditing(true)
    go('quiz', index)
  }

  return (
    <main id="main">
      <section ref={sectionRef} className="scroll-mt-32 bg-snow-50 py-16 sm:py-24">
        <div className="mx-auto max-w-[1560px] px-5 sm:px-9">
          {phase === 'intro' && <FinderIntro onStart={() => go('quiz', 0)} headingRef={headingRef} />}

          {phase === 'quiz' && (
            <FinderQuestion
              key={question.id}
              question={question}
              index={step}
              total={QUESTIONS.length}
              value={answers[question.id]}
              onChoose={choose}
              onBack={goBack}
              onNext={() => goNext(step)}
              nextLabel={editing || step === QUESTIONS.length - 1 ? t('finder.seeMatches') : t('finder.next')}
              headingRef={headingRef}
            />
          )}

          {phase === 'results' && (
            <FinderResults
              answers={answers}
              onEdit={edit}
              onRestart={restart}
              onSeeAll={onSeeAll}
              onOpenProduct={onOpenProduct}
              headingRef={headingRef}
            />
          )}
        </div>
      </section>
    </main>
  )
}
