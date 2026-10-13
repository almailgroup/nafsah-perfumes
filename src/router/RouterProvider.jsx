import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { CONTACT, HOME, ROUTES, RouterContext, normalise, parseLocation, useRouter } from './router-context'

const here = () => ({
  path: normalise(window.location.pathname),
  search: window.location.search,
  hash: window.location.hash,
})

// A page loaded on demand renders a few frames after its address changes.
// How long to wait for it, in frames: about two seconds.
const WAIT_FRAMES = 120

/**
 * The element with this id, once it is rendered and shown. While Suspense
 * waits for the next page, the previous one stays in the document hidden, so
 * an element that is there but has no box does not count.
 */
function shownById(id) {
  const element = document.getElementById(id)
  return element && element.getClientRects().length > 0 ? element : null
}

/** The in-page target a '#hash' names, or null. */
function hashTarget(hash) {
  if (!hash || hash === '#') return null
  let id = hash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    // A malformed escape is still a usable id as written.
  }
  return shownById(id)
}

/** Scroll an in-page target into view; the element, or null when the page has no such element. */
function scrollToHash(hash) {
  const target = hashTarget(hash)
  target?.scrollIntoView({ block: 'start' })
  return target
}

/** Focus without moving the view, making the element focusable first if it is not. */
function focusQuietly(element) {
  if (!element.hasAttribute('tabindex')) element.setAttribute('tabindex', '-1')
  element.focus({ preventScroll: true })
}

/**
 * Call `act` with what `find` returns as soon as it returns something: now,
 * or on one of the next WAIT_FRAMES frames. Returns a cancel function.
 */
function whenFound(find, act) {
  let frames = 0
  let request = null
  const attempt = () => {
    const found = find()
    if (found) act?.(found)
    else if (frames++ < WAIT_FRAMES) request = requestAnimationFrame(attempt)
  }
  attempt()
  return () => cancelAnimationFrame(request)
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
    let cancel = null
    if (!migrate() && window.location.hash) {
      const hash = window.location.hash
      cancel = whenFound(() => scrollToHash(hash))
    }
    // Following an old link from inside the site changes only the hash, which
    // is a same-document navigation: nothing remounts, so the listener is what
    // catches it. Any other hash change (a contents link) is recorded quietly.
    const onHashChange = () => {
      if (migrate()) return
      setLocation((state) => (state.hash === window.location.hash ? state : { ...state, hash: window.location.hash }))
    }
    window.addEventListener('hashchange', onHashChange)
    return () => {
      cancel?.()
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  // Before paint, so the new page never shows for a frame at the old offset.
  // Focus moves with the view, so the next Tab continues from the top of the
  // new page (or the section the address names) rather than from the footer
  // link that was followed, and a screen reader starts reading there. Focus
  // goes first so a smooth scroll is not cut short. Back and forward leave
  // both to the browser.
  useLayoutEffect(() => {
    const pending = pendingScroll.current
    pendingScroll.current = null
    if (pending === 'top') {
      const cancel = whenFound(() => shownById('main'), focusQuietly)
      window.scrollTo({ top: 0 })
      return cancel
    }
    if (pending) {
      return whenFound(
        () => hashTarget(pending),
        (target) => {
          focusQuietly(target)
          target.scrollIntoView({ block: 'start' })
        },
      )
    }
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
