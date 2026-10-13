import { fileURLToPath, URL } from 'node:url'
import { copyFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ROUTE_TABLE } from './src/router/routes.js'

const here = (path) => fileURLToPath(new URL(path, import.meta.url))

const ROUTE_META_ID = 'virtual:route-meta'
const RESOLVED_ROUTE_META_ID = `\0${ROUTE_META_ID}`

const ENTITIES = { '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&lt;': '<', '&gt;': '>' }

/** The content of an HTML file's <meta name="description">, decoded, or null. */
function readDescription(html) {
  const tag = html.match(/<meta\b[^>]*\bname=["']description["'][^>]*>/i)?.[0]
  const content = tag?.match(/\bcontent="([^"]*)"/i)?.[1]
  return content == null ? null : content.replace(/&(amp|quot|#39|apos|lt|gt);/g, (entity) => ENTITIES[entity])
}

/**
 * Served from the root of the custom domain nafsah.com, so assets are
 * root-relative.
 *
 * GitHub Pages has no server-side routing, so every address the site claims
 * needs a real file behind it. Each row of src/router/routes.js is built from
 * its own <dir>/index.html, so /contact/ or /scent-finder/ answers with a 200
 * and its own <title> and description — rather than a 404 page redirecting
 * through a query string, which is the usual trick and the reason so many
 * static SPAs serve their routes as errors.
 */
function routeEntries() {
  return {
    name: 'nafsah-routes',

    // A route without its HTML entry would still render, but be served as a
    // 404 with the homepage's title. Refuse to build it.
    buildStart() {
      const missing = ROUTE_TABLE.filter((route) => !existsSync(here(route.entry)))
      if (missing.length) {
        this.error(
          `Routes without an HTML entry: ${missing.map((route) => `${route.path} → ${route.entry}`).join(', ')}. ` +
            'Copy contact/index.html (see src/router/routes.js).',
        )
      }
    },

    // `import ROUTE_META from 'virtual:route-meta'` → { [path]: { description } },
    // read from the HTML entries themselves, so the description a page shows
    // after client-side navigation is the one a direct hit is served.
    resolveId(id) {
      return id === ROUTE_META_ID ? RESOLVED_ROUTE_META_ID : null
    },
    load(id) {
      if (id !== RESOLVED_ROUTE_META_ID) return null
      const meta = {}
      for (const route of ROUTE_TABLE) {
        const file = here(route.entry)
        if (!existsSync(file)) continue
        this.addWatchFile(file)
        meta[route.path] = { description: readDescription(readFileSync(file, 'utf8')) }
      }
      return `export default ${JSON.stringify(meta)}`
    },
  }
}

/** Everything else — a typo, an old deep link — still has to reach the app rather than GitHub's own 404 page. */
function spaFallback() {
  let outDir = null
  return {
    name: 'nafsah-spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const index = resolve(outDir, 'index.html')
      if (existsSync(index)) copyFileSync(index, resolve(outDir, '404.html'))
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), routeEntries(), spaFallback()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(ROUTE_TABLE.map((route) => [route.input, here(route.entry)])),
    },
  },
})
