import { createContext, useContext } from 'react'

// The route table is plain data shared with vite.config.js; it is re-exported
// here so components keep importing every route from one place.
export {
  CONTACT,
  FAQ,
  HOME,
  PRIVACY,
  ROUTES,
  ROUTE_TABLE,
  SCENT_FINDER,
  SHIPPING,
  TERMS,
  TITLE_KEY,
  normalise,
  parseLocation,
} from './routes'

/**
 * { path, search, hash, key, navigate(to, { scroll, replace }), replaceSearch(search) }
 *
 * `key` changes on every navigation (a link, back or forward) but not when a
 * page rewrites its own query string, so a page can be keyed on it to start
 * afresh from the address it was opened at.
 */
export const RouterContext = createContext(null)

export function useRouter() {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRouter must be used inside a <RouterProvider>')
  return value
}
