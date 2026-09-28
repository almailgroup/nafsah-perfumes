import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LocaleContext } from './locale-context'
import { STRINGS } from './strings'
import { classNames } from '../lib/format'

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
  const timers = useRef([])
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
  const t = useCallback(
    (key, vars) => {
      const raw = dict[key] ?? STRINGS.en[key] ?? key
      if (!vars || typeof raw !== 'string') return raw
      return raw.replace(/\{(\w+)\}/g, (match, name) =>
        name in vars ? String(vars[name]) : match,
      )
    },
    [dict],
  )

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
    timers.current.push(setTimeout(flip, BLUR_IN_MS))
  }, [])

  const value = useMemo(
    () => ({
      lang,
      dir,
      isRtl: dir === 'rtl',
      localeTag: dict.localeTag,
      t,
      announce: dict.announce,
      switching,
      toggle,
      /** Pick the Arabic field when it exists, else fall back to English. */
      pick: (en, ar) => (lang === 'ar' && ar ? ar : en),
    }),
    [lang, dir, dict, t, switching, toggle],
  )

  return (
    <LocaleContext.Provider value={value}>
      {children}
      <div aria-hidden="true" className={classNames('lang-veil', switching && 'lang-veil-on')} />
    </LocaleContext.Provider>
  )
}
