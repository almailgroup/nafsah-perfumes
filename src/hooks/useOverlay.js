import { useEffect, useRef } from 'react'

/*
 * Every open overlay, bottom to top: the cart drawer, the product page, the
 * checkout, and the dialogs opened from them (Try First over the product page,
 * a filter sheet). Only the topmost answers Escape and holds Tab, so closing
 * a dialog opened from another leaves the one beneath it open. The scroll
 * lock is shared: taken by the first overlay, released by the last, whatever
 * order they close in.
 */
const stack = []
let savedBodyStyle = null

// Anything that can take focus from the keyboard. Filtered below for what is
// actually reachable: not disabled, not inert, not hidden, not tabindex -1.
const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'iframe',
  'summary',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',')

/** The panel's Tab stops in order, as the browser would visit them. */
function tabStops(panel) {
  const radioSeen = new Set()
  return [...panel.querySelectorAll(FOCUSABLE)].filter((node) => {
    if (node.tabIndex < 0 || node.disabled || node.closest('[inert]')) return false
    if (!node.getClientRects().length || getComputedStyle(node).visibility === 'hidden') return false
    // A native radio group is one stop: its checked radio, else its first.
    if (node.type === 'radio' && node.name) {
      const key = `${node.form?.id ?? ''}|${node.name}`
      if (radioSeen.has(key)) return false
      const group = [...panel.querySelectorAll(`input[type="radio"][name="${CSS.escape(node.name)}"]`)]
      const checked = group.find((radio) => radio.checked)
      if (checked && checked !== node) return false
      radioSeen.add(key)
    }
    return true
  })
}

const top = () => stack[stack.length - 1]
const panelOf = (entry) => entry?.panelRef.current ?? entry?.panel ?? null
const focusQuietly = (node) => node?.focus({ preventScroll: true })

function onKeyDown(event) {
  const entry = top()
  if (!entry) return

  if (event.key === 'Escape') {
    // A control inside that used Escape itself (a listbox, a popover) calls
    // preventDefault; then the overlay stays.
    if (event.defaultPrevented || event.isComposing) return
    entry.onCloseRef.current?.()
    return
  }

  if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return
  const panel = panelOf(entry)
  if (!panel) return
  const stops = tabStops(panel)
  const active = document.activeElement
  if (stops.length === 0) {
    event.preventDefault()
    focusQuietly(panel)
    return
  }
  const first = stops[0]
  const last = stops[stops.length - 1]
  if (!panel.contains(active)) {
    event.preventDefault()
    focusQuietly(event.shiftKey ? last : first)
  } else if (event.shiftKey && (active === first || active === panel)) {
    event.preventDefault()
    focusQuietly(last)
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    focusQuietly(first)
  }
}

// Focus that lands behind the top overlay — a click on the page under a
// sheet, a script — is brought back inside it.
function onFocusIn(event) {
  const panel = panelOf(top())
  if (!panel || panel.contains(event.target)) return
  focusQuietly(tabStops(panel)[0] ?? panel)
}

function lockScroll() {
  const { body, documentElement } = document
  // Compensate for the scrollbar so the page doesn't shift as it locks.
  const gutter = window.innerWidth - documentElement.clientWidth
  savedBodyStyle = { overflow: body.style.overflow, paddingRight: body.style.paddingRight }
  body.style.overflow = 'hidden'
  if (gutter > 0) body.style.paddingRight = `${gutter}px`
}

function unlockScroll() {
  if (!savedBodyStyle) return
  document.body.style.overflow = savedBodyStyle.overflow
  document.body.style.paddingRight = savedBodyStyle.paddingRight
  savedBodyStyle = null
}

function push(entry) {
  if (stack.length === 0) {
    lockScroll()
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocusIn)
  }
  stack.push(entry)
}

function remove(entry) {
  const index = stack.indexOf(entry)
  if (index === -1) return
  const wasTop = index === stack.length - 1
  stack.splice(index, 1)

  // An overlay opened from this one would have handed focus back into a panel
  // that is going away; it hands it to whatever this one came from instead.
  const above = stack[index]
  if (above) {
    const target = above.previouslyFocused
    const closing = panelOf(entry)
    if (!target?.isConnected || closing?.contains(target)) above.previouslyFocused = entry.previouslyFocused
  }

  if (stack.length === 0) {
    window.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('focusin', onFocusIn)
    unlockScroll()
  }

  if (!wasTop) return
  const back = entry.previouslyFocused
  if (back instanceof HTMLElement && back.isConnected) focusQuietly(back)
  else if (stack.length) focusQuietly(panelOf(top()))
}

/**
 * Shared behaviour for every overlay — drawer, product page, checkout, sheet,
 * nested dialog. While `isOpen`: locks page scroll, moves focus into
 * `panelRef` (its [data-autofocus] element, else the panel), keeps Tab and
 * Shift+Tab inside it, closes on Escape, and on close returns focus to what
 * had it. Overlays stack: only the topmost reacts to Escape and holds focus.
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

    const entry = {
      panelRef,
      panel: panelRef?.current ?? null,
      onCloseRef,
      previouslyFocused: document.activeElement,
    }
    push(entry)

    // Pull focus into the overlay so keyboard and screen-reader users land there.
    const focusTimer = setTimeout(() => {
      const panel = panelOf(entry)
      if (!panel || top() !== entry) return
      focusQuietly(panel.querySelector('[data-autofocus]') ?? panel)
    }, 60)

    return () => {
      clearTimeout(focusTimer)
      remove(entry)
    }
  }, [isOpen, panelRef])
}
