import './polyfills.js'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './fonts.js'
import './index.css'

// A tab opened before a deploy still asks for the old build's page chunks,
// which GitHub Pages no longer serves. Reload once onto the new build. The
// guard is keyed to the build that failed (this module's hashed URL), so a
// chunk missing from the current build cannot reload in a loop, while the
// next deploy can still recover the same tab.
const RELOADED_KEY = 'nafsah.reloaded'
window.addEventListener('vite:preloadError', (event) => {
  const build = import.meta.url
  try {
    if (sessionStorage.getItem(RELOADED_KEY) === build) return
    sessionStorage.setItem(RELOADED_KEY, build)
  } catch {
    return
  }
  event.preventDefault()
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
