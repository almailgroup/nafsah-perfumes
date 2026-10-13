import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Link2, Plus, RotateCcw } from 'lucide-react'
import BottleVisual from '../BottleVisual'
import { TryFirstBanner } from '../trust/TryFirst'
import { MatchMeter } from './parts'
import { useMatchText, useReasonText } from './finder-utils'
import { useCart } from '../../context/cart-context'
import { CATALOGUE_NUMBERS, PRODUCTS, concentrationFor, fromPriceFils } from '../../data/products'
import { CONCENTRATION_BY_ID, FAMILY_BY_ID, FORMAT_BY_ID } from '../../data/taxonomy'
import { useLocale } from '../../i18n/locale-context'
import { QUESTIONS, familiesFor, optionOf, recommend } from '../../lib/scent-finder'
import { classNames, formatMl, formatOrdinal, formatPrice } from '../../lib/format'

// How long a button says "Added" or "Link copied" before it resets.
const CONFIRM_MS = 1800

const LINK_BUTTON =
  'group inline-flex min-h-11 items-center gap-2 font-sans text-[11px] font-medium uppercase tracking-wide2 text-green-600 transition-colors duration-300 hover:text-ink-950 rtl:font-sans-ar rtl:text-[13px] rtl:normal-case rtl:tracking-normal'

const listFormats = new Map()
const joinList = (items, lang) => {
  if (!listFormats.has(lang)) listFormats.set(lang, new Intl.ListFormat(lang, { style: 'long', type: 'conjunction' }))
  return listFormats.get(lang).format(items)
}

/** A short-lived flag for "Added" / "Copied", with its timer cleared on unmount. */
function useConfirm() {
  const [on, setOn] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const flash = () => {
    setOn(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOn(false), CONFIRM_MS)
  }
  return [on, flash]
}

/** A status message that clears itself, so adding the same thing twice is announced twice. */
function useAnnouncement() {
  const [message, setMessage] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const announce = (text) => {
    setMessage(text)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setMessage(''), CONFIRM_MS)
  }
  return [message, announce]
}

/** The vial on its tinted plate: a larger mouse target for "view details", never a second tab stop. */
function Vial({ product, formatId, onOpen, className }) {
  const concentration = CONCENTRATION_BY_ID[concentrationFor(product, formatId)]
  return (
    <div onClick={onOpen} className={classNames('relative cursor-pointer overflow-hidden bg-snow-100', className)}>
      <div aria-hidden="true" className="mashrabiya-band pointer-events-none absolute inset-0" />
      <div className="relative mx-auto h-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]">
        <BottleVisual palette={product.palette} catalogue={CATALOGUE_NUMBERS[product.id]} label={concentration?.abbr} />
      </div>
    </div>
  )
}

/** One of the three closest: the match, why, the default format's price, and the two ways forward. */
function MatchCard({ result, rank, onOpenProduct }) {
  const { product, score, reasons } = result
  const { addItem } = useCart()
  const { lang, t, tr } = useLocale()
  const reasonText = useReasonText()
  const matchText = useMatchText()
  const uid = useId()
  const [added, flashAdded] = useConfirm()
  const [announcement, announce] = useAnnouncement()

  const name = tr(product.name)
  const format = product.formats[0]
  const formatName = tr(FORMAT_BY_ID[format.id])
  const sample = product.formats.find((entry) => FORMAT_BY_ID[entry.id]?.kind === 'sample' && entry !== format)
  const sampleName = sample ? tr(FORMAT_BY_ID[sample.id]) : ''
  const open = () => onOpenProduct(product)

  const add = (entry, entryName) => {
    addItem(product, entry.id)
    if (entry === format) flashAdded()
    announce(t('finder.results.added', { name, format: entryName }))
  }

  return (
    <li className="h-full">
      <article
        aria-labelledby={`${uid}-name`}
        className="group flex h-full animate-fade-up flex-col border border-snow-200 bg-snow-50 transition-[border-color,box-shadow] duration-500 hover:border-green-600/50 hover:shadow-[0_18px_44px_-28px_rgba(8,20,15,0.45)]"
        style={{ animationDelay: `${rank * 80}ms` }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-snow-200 px-5 py-3">
          <span className="ticket text-green-600">{formatOrdinal(rank, lang)}</span>
          <span className="ticket text-end text-snow-600">{tr(FAMILY_BY_ID[product.family]?.short)}</span>
        </div>

        <Vial product={product} formatId={format.id} onOpen={open} className="h-[12rem] py-6 sm:h-[15rem] sm:py-7" />

        <div className="flex flex-1 flex-col border-t border-snow-200 p-5 sm:p-6">
          <p aria-hidden="true" className="font-sans text-[15px] font-medium text-green-600 rtl:font-sans-ar">
            {matchText(score)}
          </p>
          <MatchMeter
            score={score}
            text={matchText(score)}
            label={t('finder.results.matchLabel')}
            className="mt-2.5"
          />

          <h3 id={`${uid}-name`} className="t-title mt-6">
            {name}
          </h3>
          <p className="t-body mt-2">{tr(product.tagline)}</p>

          {reasons.length > 0 && (
            <div className="mt-5 border-t border-snow-200 pt-4">
              <h4 className="ticket text-snow-600">{t('finder.results.why')}</h4>
              <ul className="mt-3 space-y-2">
                {reasons.map((reason) => (
                  <li key={reason.key} className="t-body flex items-start gap-2.5 text-[15px] leading-snug">
                    <Check aria-hidden="true" className="mt-[3px] h-3.5 w-3.5 shrink-0 text-green-600" strokeWidth={1.75} />
                    <span>{reasonText(reason)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto pt-6">
            <p className="flex items-baseline justify-between gap-4 border-t border-snow-200 pt-4">
              <span className="ticket text-snow-600">
                {formatName} · {formatMl(format.ml, lang)}
              </span>
              <span className="t-figure whitespace-nowrap text-[1.2rem] text-ink-950">
                {formatPrice(format.priceFils, lang)}
              </span>
            </p>
            <div className="mt-4 grid gap-2 min-[480px]:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <button type="button" onClick={() => add(format, formatName)} className="btn-green px-4">
                {added ? (
                  <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
                ) : (
                  <Plus aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
                )}
                {added ? t('added') : t('addToCart')}
                <span className="sr-only">
                  {' — '}
                  {name}, {formatName}
                </span>
              </button>
              <button type="button" onClick={open} aria-haspopup="dialog" className="btn-outline px-4">
                {t('viewDetails')}
                <span className="sr-only"> — {name}</span>
              </button>
            </div>
            {sample && (
              <button
                type="button"
                onClick={() => add(sample, sampleName)}
                className="mt-3 inline-flex min-h-11 items-center gap-2 text-start font-sans text-[14px] text-green-600 underline decoration-green-600/40 underline-offset-4 transition-colors duration-300 hover:text-ink-950 hover:decoration-ink-950 rtl:font-sans-ar"
              >
                <span>
                  {t('finder.results.sample', { format: sampleName })}
                  <span aria-hidden="true"> · </span>
                  <span className="whitespace-nowrap tabular-nums">{formatPrice(sample.priceFils, lang)}</span>
                  <span className="sr-only"> — {name}</span>
                </span>
              </button>
            )}
            <p role="status" className="sr-only">
              {announcement}
            </p>
          </div>
        </div>
      </article>
    </li>
  )
}

/** One of the next three: smaller, with the match and a way to the product page. */
function MoreCard({ result, rank, onOpenProduct }) {
  const { product, score } = result
  const { lang, t, tr } = useLocale()
  const matchText = useMatchText()
  const uid = useId()
  const open = () => onOpenProduct(product)

  return (
    <li className="h-full">
      <article
        aria-labelledby={`${uid}-name`}
        className="group flex h-full gap-4 border border-snow-200 bg-snow-50 p-4 transition-[border-color] duration-500 hover:border-green-600/50 sm:gap-5"
      >
        <Vial product={product} formatId={product.formats[0].id} onOpen={open} className="w-20 shrink-0 py-3 sm:w-24" />
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="flex items-baseline justify-between gap-3">
            <span className="ticket text-green-600">{formatOrdinal(rank, lang)}</span>
            <span className="ticket truncate text-snow-600">{tr(FAMILY_BY_ID[product.family]?.short)}</span>
          </p>
          <h3 id={`${uid}-name`} className="t-title mt-2 text-[1.2rem]">
            {tr(product.name)}
          </h3>
          <p aria-hidden="true" className="mt-1 font-sans text-[14px] text-ink-950 rtl:font-sans-ar">
            {matchText(score)}
          </p>
          <MatchMeter score={score} text={matchText(score)} label={t('finder.results.matchLabel')} className="mt-2" />
          <div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-4">
            <span className="ticket text-snow-600">
              {t('from')}{' '}
              <span className="t-figure whitespace-nowrap text-[15px] text-ink-950">
                {formatPrice(fromPriceFils(product), lang)}
              </span>
            </span>
            <button
              type="button"
              onClick={open}
              aria-haspopup="dialog"
              className="ticket text-green-600 underline decoration-green-600/40 underline-offset-4 transition-colors duration-300 hover:text-ink-950"
            >
              {t('viewDetails')}
              <span className="sr-only"> — {tr(product.name)}</span>
            </button>
          </div>
        </div>
      </article>
    </li>
  )
}

/**
 * The results: three closest with their reasons, three more, and the ways
 * on — the filtered catalogue, a fresh start, or the link to come back to.
 * Any answer can be changed from here; the list follows.
 */
export default function FinderResults({ answers, onEdit, onRestart, onSeeAll, onOpenProduct, headingRef }) {
  const { lang, t, tr, isRtl } = useLocale()
  const uid = useId()
  const [copied, flashCopied] = useConfirm()
  const results = useMemo(() => recommend(answers, PRODUCTS), [answers])
  const top = results.slice(0, 3)
  const more = results.slice(3, 6)
  const families = familiesFor(answers)
  const Forward = isRtl ? ArrowLeft : ArrowRight
  const canCopy = typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.writeText)

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(flashCopied, () => {})
  }

  return (
    <div className="animate-fade-in">
      <header className="border-b border-gold-500/60 pb-8">
        <div className="max-w-3xl">
          <p className="ticket text-green-600">{t('finder.results.eyebrow')}</p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="t-h2 mt-4 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {t('finder.results.title')}
          </h1>
          <p className="t-body mt-6 max-w-xl">{t('finder.results.body')}</p>
        </div>
      </header>

      <section aria-labelledby={`${uid}-answers`} className="mt-8">
        <h2 id={`${uid}-answers`} className="ticket text-snow-600">
          {t('finder.results.answers')}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {QUESTIONS.map((question, index) => {
            const option = optionOf(question.id, answers[question.id])
            if (!option) return null
            return (
              <li key={question.id}>
                <button
                  type="button"
                  onClick={() => onEdit(index)}
                  aria-label={t('finder.results.change', { question: tr(question.label), answer: tr(option) })}
                  className="inline-flex min-h-11 items-center gap-2.5 border border-snow-300 bg-snow-50 px-3.5 py-2 transition-colors duration-300 hover:border-green-600"
                >
                  <span className="ticket text-snow-600">{tr(question.label)}</span>
                  <span className="font-sans text-[14px] text-ink-950 rtl:font-sans-ar">{tr(option)}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 flex flex-col items-start gap-x-6 gap-y-1 sm:flex-row sm:items-center">
          <p className="t-body max-w-xl text-[14px] text-snow-600">{t('finder.results.shareNote')}</p>
          {canCopy && (
            <button type="button" onClick={copyLink} className={classNames(LINK_BUTTON, 'shrink-0')}>
              {copied ? (
                <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.75} />
              ) : (
                <Link2 aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
              )}
              {copied ? t('finder.results.copied') : t('finder.results.copyLink')}
            </button>
          )}
          <p role="status" className="sr-only">
            {copied ? t('finder.results.copied') : ''}
          </p>
        </div>
      </section>

      <ol className="mt-10 grid gap-5 lg:grid-cols-3">
        {top.map((result, index) => (
          <MatchCard key={result.product.id} result={result} rank={index + 1} onOpenProduct={onOpenProduct} />
        ))}
      </ol>

      <div className="mt-8">
        <TryFirstBanner variant="inline" />
      </div>

      {more.length > 0 && (
        <section aria-labelledby={`${uid}-more`} className="mt-16 sm:mt-20">
          <div className="border-b border-gold-500/60 pb-5">
            <h2 id={`${uid}-more`} className="t-h2">
              {t('finder.results.more')}
            </h2>
          </div>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {more.map((result, index) => (
              <MoreCard key={result.product.id} result={result} rank={index + 4} onOpenProduct={onOpenProduct} />
            ))}
          </ol>
        </section>
      )}

      <div className="mt-14 flex flex-col items-start gap-6 border-t border-snow-200 pt-9 sm:flex-row sm:items-center sm:justify-between">
        {families.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => onSeeAll(families)}
              aria-describedby={`${uid}-see-all`}
              className="btn-outline group"
            >
              {t('finder.results.seeAll')}
              <Forward
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                strokeWidth={1.5}
              />
            </button>
            <p id={`${uid}-see-all`} className="t-body mt-3 text-[14px] text-snow-600">
              {t('finder.results.seeAllHint', {
                families: joinList(families.map((id) => tr(FAMILY_BY_ID[id])), lang),
              })}
            </p>
          </div>
        )}
        <button type="button" onClick={onRestart} className={LINK_BUTTON}>
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t('finder.results.startAgain')}
        </button>
      </div>
    </div>
  )
}
