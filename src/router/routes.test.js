import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { describe, expect, it } from 'vitest'
import { CORE, STRINGS } from '../i18n/strings'
import { HOME, ROUTES, ROUTE_TABLE, SCENT_FINDER, TITLE_KEY, normalise, parseLocation } from './routes'

const root = (path) => fileURLToPath(new URL(`../../${path}`, import.meta.url))

describe('route table', () => {
  it('claims every page once, the finder included', () => {
    expect(new Set(ROUTES).size).toBe(ROUTES.length)
    expect(ROUTES).toContain(SCENT_FINDER)
    expect(ROUTES[0]).toBe(HOME)
    expect(new Set(ROUTE_TABLE.map((route) => route.input)).size).toBe(ROUTE_TABLE.length)
  })

  it('has an HTML entry with its own title, description and pre-paint script for every route', () => {
    for (const route of ROUTE_TABLE) {
      expect(existsSync(root(route.entry)), route.entry).toBe(true)
      const html = readFileSync(root(route.entry), 'utf8')
      expect(html, route.entry).toMatch(/<title>[^<]+<\/title>/)
      expect(html, route.entry).toMatch(/<meta\s[^>]*name="description"/)
      expect(html, route.entry).toContain("localStorage.getItem('nafsah.lang.v1')")
      // The pre-paint script follows the charset so the charset stays first.
      expect(html.indexOf('<meta charset')).toBeLessThan(html.indexOf('<script>'))
    }
  })

  it('gives every route a title in both languages', () => {
    for (const [path, key] of Object.entries(TITLE_KEY)) {
      expect(STRINGS.en[key], `${path} en`).toBeTruthy()
      expect(STRINGS.ar[key], `${path} ar`).toBeTruthy()
    }
    // The finder's title is the finder's own string, not a core one.
    expect(Object.hasOwn(CORE.en, TITLE_KEY[SCENT_FINDER])).toBe(false)
  })
})

describe('parseLocation', () => {
  it('splits route, query and hash, normalising a trailing slash', () => {
    expect(parseLocation('/scent-finder/?occasion=office#top')).toMatchObject({
      path: '/scent-finder',
      search: '?occasion=office',
      hash: '#top',
    })
    expect(parseLocation('/faq#gifting')).toMatchObject({ path: '/faq', search: '', hash: '#gifting' })
    expect(parseLocation('/')).toMatchObject({ path: '/', search: '', hash: '' })
    expect(normalise('/contact///')).toBe('/contact')
    expect(normalise('')).toBe('/')
  })

  it('resolves relative addresses against the current one and reports other origins', () => {
    expect(parseLocation('?vibe=floral', 'https://nafsah.com/scent-finder')).toMatchObject({
      path: '/scent-finder',
      search: '?vibe=floral',
    })
    expect(parseLocation('https://example.com/x', 'https://nafsah.com/').origin).toBe('https://example.com')
  })
})
