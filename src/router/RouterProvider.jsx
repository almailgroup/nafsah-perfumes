import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { CONTACT, HOME, ROUTES, RouterContext, normalise, parseLocation, useRouter } from './router-context'

const here = () => ({
  path: normalise(window.location.pathname),
  search: window.location.search,
  hash: window.location.hash,
})

/** Scroll an in-page target into view; false when the page has no such element. */
function scrollToHash(hash) {
  if (!hash || hash === '#') return false
  let id = hash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    // A malformed escape is still a usable id as written.
  }
  const target = document.getElementById(id)
  if (!target) return false
  target.scrollIntoView({ block: 'start' })
  return true
}

/**
 * A small router, hand-rolled rather than pulled in.
 *
 * The site has a handful of real addresses (src/router/routes.js), so a
 * dependency would cost more than it saves. What matters is that they are
 * real paths — /contact, not /#contact — and that every link is a real <a>,
 * so right-click, middle-click, "copy link address" and "open in new tab" all
 * behave. Only a plain left click is intercepted.
 *
 * Addresses may carry a query string and a hash: /scent-finder?occasion=…
 * keeps its answers, /faq#gifting lands on its group once the page renders.
 *
 * Direct hits resolve without a redirect shim: the build emits a real
 * index.html for every route, so GitHub Pages serves /contact/ with a 200
 * rather than bouncing through a 404 page.
 */
export function RouterProvider({ children }) {
  const [location, setLocation] = useState(() => ({ ...here(), key: 0 }))
  // Where to scroll once the next location has rendered: 'top', a '#hash', or nothing.
  const pendingScroll = useRef(null)

  useEffect(() => {
    const onPop = () => setLocation((current) => ({ ...here(), key: current.key + 1 }))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // An unknown path reaches the app through the 404 copy, which keeps the
  // address the visitor typed. Rewrite it to the homepage so the bar does not
  // claim a page that does not exist.
  useEffect(() => {
    const current = normalise(window.location.pathname)
    if (ROUTES.includes(current)) return
    window.history.replaceState(null, '', HOME + window.location.search + window.location.hash)
    setLocation((state) => ({ ...state, path: HOME }))
  }, [])

  // Links shared before the site had real paths still point at #contact and
  // #top. Translate those two once on load so an old address lands on the
  // right page instead of on the homepage with a stray hash. Every other hash
  // is a real in-page destination; it is scrolled to once the page exists,
  // because the browser looked for it before React had rendered it.
  useEffect(() => {
    const migrate = () => {
      const legacy = { '#contact': CONTACT, '#top': HOME }[window.location.hash]
      if (!legacy) return false
      window.history.replaceState(null, '', legacy + window.location.search)
      setLocation((state) => ({ path: legacy, search: window.location.search, hash: '', key: state.key + 1 }))
      return true
    }
    if (!migrate() && window.location.hash) {
      const hash = window.location.hash
      requestAnimationFrame(() => scrollToHash(hash))
    }
    // Following an old link from inside the site changes only the hash, which
    // is a same-document navigation: nothing remounts, so the listener is what
    // catches it. Any other hash change (a contents link) is recorded quietly.
    const onHashChange = () => {
      if (migrate()) return
      setLocation((state) => (state.hash === window.location.hash ? state : { ...state, hash: window.location.hash }))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // Before paint, so the new page never shows for a frame at the old offset.
  useLayoutEffect(() => {
    const pending = pendingScroll.current
    pendingScroll.current = null
    if (pending === 'top') window.scrollTo({ top: 0 })
    else if (pending) scrollToHash(pending)
  }, [location.key])

  const navigate = useCallback((to, { scroll = true, replace = false } = {}) => {
    const next = parseLocation(to, window.location.href)
    if (next.origin !== window.location.origin) {
      window.location.assign(String(to))
      return
    }
    const target = next.path + next.search + next.hash
    const current = normalise(window.location.pathname) + window.location.search + window.location.hash
    if (target === current) {
      if (next.hash) scrollToHash(next.hash)
      else if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.history[replace ? 'replaceState' : 'pushState'](null, '', target)
    pendingScroll.current = next.hash || (scroll ? 'top' : null)
    setLocation((state) => ({ path: next.path, search: next.search, hash: next.hash, key: state.key + 1 }))
  }, [])

  /**
   * Rewrite the query string of the page in place — no history entry, no
   * scroll, no new key — for a page that mirrors its own state in the address.
   */
  const replaceSearch = useCallback((search) => {
    const raw = String(search ?? '')
    const next = raw && raw !== '?' ? (raw.startsWith('?') ? raw : `?${raw}`) : ''
    if (next === window.location.search) return
    window.history.replaceState(window.history.state, '', window.location.pathname + next + window.location.hash)
    setLocation((state) => ({ ...state, search: next }))
  }, [])

  const value = useMemo(
    () => ({
      path: ROUTES.includes(location.path) ? location.path : HOME,
      search: location.search,
      hash: location.hash,
      key: location.key,
      navigate,
      replaceSearch,
    }),
    [location, navigate, replaceSearch],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

/** A real anchor that navigates in place on a plain left click. */
export function Link({ to, onNavigate, onClick, children, ...rest }) {
  const { navigate } = useRouter()
  const handle = (event) => {
    onClick?.(event)
    // Leave modified clicks to the browser — that is the whole point of
    // rendering an anchor rather than a button.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }
    event.preventDefault()
    navigate(to)
    onNavigate?.()
  }
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
