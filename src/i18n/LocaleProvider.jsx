import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LocaleContext, translate, translateCount, translateValue } from './locale-context'
import { STRINGS } from './strings'
import { classNames } from '../lib/format'

// Also read by the inline pre-paint script in every HTML entry's <head>.
const STORAGE_KEY = 'nafsah.lang.v1'

// Blur up, swap the script under cover, blur back down. Long enough for the
// veil's own 0.22s transition to reach full before the language changes.
const BLUR_IN_MS = 190
// If rAF never runs (a hidden tab), clear the veil anyway rather than stranding it.
const UNVEIL_FALLBACK_MS = 1500

function readStoredLang() {
  if (typeof window === 'undefined') return 'en'
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'ar' || stored === 'en' ? stored : 'en'
  } catch {
    return 'en'
  }
}

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang)
  const [switching, setSwitching] = useState(false)
  // Pending swap timers; each removes itself once it has fired.
  const timers = useRef(new Set())
  const busy = useRef(false)
  const dict = STRINGS[lang]
  const dir = dict.dir

  // The document element carries lang/dir so logical properties mirror the
  // whole layout and the browser picks the right font fallbacks and quotes.
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // A blocked localStorage must not break language switching.
    }
  }, [lang, dir])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  // Clear the veil only once the new script has actually painted. A fixed hold
  // cannot know how long that takes — a full direction flip relaid out this
  // page in about 180ms — and clearing early lets the swap show through. Two
  // frames puts us past the first paint that carries the new language.
  useEffect(() => {
    if (!busy.current) return undefined
    const outer = requestAnimationFrame(() => {
      setSwitching(false)
      busy.current = false
    })
    const fallback = setTimeout(() => {
      setSwitching(false)
      busy.current = false
    }, UNVEIL_FALLBACK_MS)
    return () => {
      cancelAnimationFrame(outer)
      clearTimeout(fallback)
    }
  }, [lang])

  /** Look up a string and interpolate {named} placeholders. */
  const t = useCallback((key, vars) => translate(lang, key, vars), [lang])

  /** A counted string: tc('reviews.count', 3) reads 'reviews.count.few' in Arabic, with {count} as ٣. */
  const tc = useCallback((key, count, vars) => translateCount(lang, key, count, vars), [lang])

  /** The active language of a { en, ar } value from the catalogue data. */
  const tr = useCallback((value) => translateValue(lang, value), [lang])

  const toggle = useCallback(() => {
    const flip = () => setLang((current) => (current === 'en' ? 'ar' : 'en'))
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      flip()
      return
    }
    // A second click mid-swap would land the veil and the language out of step.
    if (busy.current) return
    busy.current = true
    setSwitching(true)
    // The effect on `lang` takes it from here and lifts the veil after paint.
    const timer = setTimeout(() => {
      timers.current.delete(timer)
      flip()
    }, BLUR_IN_MS)
    timers.current.add(timer)
  }, [])

  const value = useMemo(
    () => ({
      lang,
      dir,
      isRtl: dir === 'rtl',
      localeTag: dict.localeTag,
      t,
      tc,
      tr,
      announce: dict.announce,
      switching,
      toggle,
    }),
    [lang, dir, dict, t, tc, tr, switching, toggle],
  )

  return (
    <LocaleContext.Provider value={value}>
      {children}
      <div aria-hidden="true" className={classNames('lang-veil', switching && 'lang-veil-on')} />
    </LocaleContext.Provider>
  )
}
