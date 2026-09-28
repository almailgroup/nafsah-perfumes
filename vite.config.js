import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from the root of the custom domain nafsah.com, so assets are
// root-relative. This was '/nafsah-perfumes/' while the site lived at the
// GitHub Pages project URL; on an apex domain that prefix makes every asset
// 404 and the page renders blank.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
