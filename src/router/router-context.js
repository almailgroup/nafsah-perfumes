import { createContext, useContext } from 'react'

export const HOME = '/'
export const CONTACT = '/contact'
export const PRIVACY = '/privacy'
export const TERMS = '/terms'
export const SHIPPING = '/shipping'
export const FAQ = '/faq'

/** Every address the site claims. Anything else resolves to the homepage. */
export const ROUTES = [HOME, CONTACT, PRIVACY, TERMS, SHIPPING, FAQ]

/* GitHub Pages serves a directory at /contact/, so a trailing slash has to
   resolve to the same route a pushState to /contact produces. */
export const normalise = (pathname) => pathname.replace(/\/+$/, '') || '/'

export const RouterContext = createContext(null)

export function useRouter() {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRouter must be used inside a <RouterProvider>')
  return value
}
