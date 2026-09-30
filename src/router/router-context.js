import { createContext, useContext } from 'react'

export const HOME = '/'
export const CONTACT = '/contact'

/* GitHub Pages serves a directory at /contact/, so a trailing slash has to
   resolve to the same route a pushState to /contact produces. */
export const normalise = (pathname) => pathname.replace(/\/+$/, '') || '/'

export const RouterContext = createContext(null)

export function useRouter() {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRouter must be used inside a <RouterProvider>')
  return value
}
