/**
 * Every address the site claims, in one table.
 *
 * Plain data with no React in it, because two very different readers need it:
 * the app (which page to render, which title to set) and vite.config.js
 * (which HTML entries to build). A route added here without its HTML entry
 * fails the build, rather than shipping a page that GitHub Pages answers
 * with a 404 and the homepage's title.
 *
 * To add a page: a constant and a row here, its <dir>/index.html (copy
 * contact/index.html: title, description, the pre-paint language script),
 * a title key in the dictionaries and a render branch in App.jsx.
 */

export const HOME = '/'
export const CONTACT = '/contact'
export const PRIVACY = '/privacy'
export const TERMS = '/terms'
export const SHIPPING = '/shipping'
export const FAQ = '/faq'
export const SCENT_FINDER = '/scent-finder'

/** path → the HTML entry that serves it, its Rollup input name and its title key. */
export const ROUTE_TABLE = [
  { path: HOME, entry: 'index.html', input: 'main', titleKey: 'titleHome' },
  { path: CONTACT, entry: 'contact/index.html', input: 'contact', titleKey: 'titleContact' },
  { path: PRIVACY, entry: 'privacy/index.html', input: 'privacy', titleKey: 'titlePrivacy' },
  { path: TERMS, entry: 'terms/index.html', input: 'terms', titleKey: 'titleTerms' },
  { path: SHIPPING, entry: 'shipping/index.html', input: 'shipping', titleKey: 'titleShipping' },
  { path: FAQ, entry: 'faq/index.html', input: 'faq', titleKey: 'titleFaq' },
  { path: SCENT_FINDER, entry: 'scent-finder/index.html', input: 'scentFinder', titleKey: 'finder.pageTitle' },
]

/** Every address the site claims. Anything else resolves to the homepage. */
export const ROUTES = ROUTE_TABLE.map((route) => route.path)

export const TITLE_KEY = Object.fromEntries(ROUTE_TABLE.map((route) => [route.path, route.titleKey]))

/* GitHub Pages serves a directory at /contact/, so a trailing slash has to
   resolve to the same route a pushState to /contact produces. */
export const normalise = (pathname) => pathname.replace(/\/+$/, '') || '/'

/**
 * Split an address into the route it names, its query string and its hash.
 * Relative addresses resolve against `base`; the path is normalised, the
 * query and hash are kept exactly as given ('' when absent).
 */
export function parseLocation(to, base = 'http://localhost/') {
  const url = new URL(String(to ?? ''), base)
  return { path: normalise(url.pathname), search: url.search, hash: url.hash, origin: url.origin }
}
