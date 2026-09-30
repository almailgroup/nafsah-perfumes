import { fileURLToPath, URL } from 'node:url'
import { copyFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const here = (path) => fileURLToPath(new URL(path, import.meta.url))

/*
 * Served from the root of the custom domain nafsah.com, so assets are
 * root-relative.
 *
 * GitHub Pages has no server-side routing, so every address the site claims
 * needs a real file behind it. Building contact/index.html as a second entry
 * means /contact/ answers with a 200 and its own <title>, rather than a 404
 * page redirecting through a query string — which is the usual trick and the
 * reason so many static SPAs serve their routes as errors.
 */
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    {
      name: 'nafsah-spa-fallback',
      // Everything else — a typo, an old deep link, a route added later — still
      // has to reach the app rather than GitHub's own 404 page.
      closeBundle() {
        copyFileSync(here('dist/index.html'), here('dist/404.html'))
      },
    },
  ],
  build: {
    rollupOptions: {
      input: {
        main: here('index.html'),
        contact: here('contact/index.html'),
        privacy: here('privacy/index.html'),
        terms: here('terms/index.html'),
      },
    },
  },
})
