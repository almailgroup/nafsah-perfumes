import { useCallback, useEffect, useMemo, useState } from 'react'
import { LocaleContext } from './locale-context'
import { STRINGS } from './strings'

const STORAGE_KEY = 'nafsah.lang.v1'

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

  const value = useMemo(
    () => ({
      lang,
      dir,
      isRtl: dir === 'rtl',
      localeTag: dict.localeTag,
      t,
      announce: dict.announce,
      toggle: () => setLang((current) => (current === 'en' ? 'ar' : 'en')),
      /** Pick the Arabic field when it exists, else fall back to English. */
      pick: (en, ar) => (lang === 'ar' && ar ? ar : en),
    }),
    [lang, dir, dict, t],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
