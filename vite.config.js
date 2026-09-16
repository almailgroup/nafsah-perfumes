import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed as a GitHub Pages *project* site at /nafsah-perfumes/, so assets
// must be requested relative to that prefix rather than the domain root.
export default defineConfig({
  base: '/nafsah-perfumes/',
  plugins: [react()],
})
