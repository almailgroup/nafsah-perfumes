import { useEffect, useRef, useState } from 'react'

/**
 * Shared behaviour for the cart drawer and checkout modal: lock background
 * scrolling while open and close on Escape.
 */
export function useOverlay(isOpen, onClose, panelRef) {
  // Kept in a ref so an unstable `onClose` identity can never tear down and
  // re-run the lock/focus effect while the overlay is still open.
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    if (!isOpen) return undefined

    const previouslyFocused = document.activeElement

    const { overflow, paddingRight } = document.body.style
    // Compensate for the scrollbar so the page doesn't shift as it locks.
    const gutter = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKeyDown)

    // Pull focus into the overlay so keyboard and screen-reader users land there.
    const focusTimer = setTimeout(() => {
      const panel = panelRef?.current
      if (!panel) return
      const target = panel.querySelector('[data-autofocus]') ?? panel
      target.focus({ preventScroll: true })
    }, 60)

    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(focusTimer)
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus({ preventScroll: true })
      }
    }
  }, [isOpen, panelRef])
}

/** Tracks whether the window has scrolled past `offset` pixels. */
export function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return scrolled
}
