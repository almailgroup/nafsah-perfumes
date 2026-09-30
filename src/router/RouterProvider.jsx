import { useCallback, useEffect, useMemo, useState } from 'react'
import { CONTACT, HOME, RouterContext, normalise, useRouter } from './router-context'

/**
 * A two-page router, hand-rolled rather than pulled in.
 *
 * The storefront has exactly two addresses, so a dependency would cost more
 * than it saves. What matters is that they are real paths — /contact, not
 * /#contact — and that every link is a real <a>, so right-click, middle-click,
 * "copy link address" and "open in new tab" all behave. Only a plain left
 * click is intercepted.
 *
 * Direct hits resolve without a redirect shim: the build emits a real
 * contact/index.html, so GitHub Pages serves /contact/ with a 200 rather than
 * bouncing through a 404 page.
 */
export function RouterProvider({ children }) {
  const [path, setPath] = useState(() => normalise(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPath(normalise(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // An unknown path reaches the app through the 404 copy, which keeps the
  // address the visitor typed. Rewrite it to the homepage so the bar does not
  // claim a page that does not exist.
  useEffect(() => {
    const current = normalise(window.location.pathname)
    if (current === HOME || current === CONTACT) return
    window.history.replaceState(null, '', HOME + window.location.search + window.location.hash)
    setPath(HOME)
  }, [])

  // Links shared before the site had real paths still point at #contact and
  // #top. Translate those two once on load so an old address lands on the
  // right page instead of on the homepage with a stray hash. The in-page
  // anchors (#collection, #house, #notes) are real destinations and are left
  // for the browser to scroll to.
  useEffect(() => {
    const migrate = () => {
      const legacy = { '#contact': CONTACT, '#top': HOME }[window.location.hash]
      if (!legacy) return
      window.history.replaceState(null, '', legacy + window.location.search)
      setPath(legacy)
    }
    migrate()
    // Following an old link from inside the site changes only the hash, which
    // is a same-document navigation: nothing remounts, so the listener is what
    // catches it.
    window.addEventListener('hashchange', migrate)
    return () => window.removeEventListener('hashchange', migrate)
  }, [])

  const navigate = useCallback((to, { scroll = true } = {}) => {
    const next = normalise(to)
    if (next === normalise(window.location.pathname)) {
      if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.history.pushState(null, '', next)
    setPath(next)
    if (scroll) window.scrollTo({ top: 0 })
  }, [])

  const value = useMemo(
    () => ({ path: path === CONTACT ? CONTACT : HOME, navigate }),
    [path, navigate],
  )

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

/** A real anchor that navigates in place on a plain left click. */
export function Link({ to, onNavigate, children, ...rest }) {
  const { navigate } = useRouter()
  const handle = (event) => {
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
