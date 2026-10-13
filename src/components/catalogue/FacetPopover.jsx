import { useEffect, useId, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatNumber } from '../../lib/format'

/**
 * A facet in the desktop filter bar: a disclosure button that names the facet
 * and how many of its values are on, opening a panel of choices beneath it.
 * One panel is open at a time (the bar holds which). It closes on Escape —
 * handing focus back to its button — on a press outside it, and when focus
 * leaves it.
 */
export default function FacetPopover({ label, count = 0, open, onOpenChange, wide = false, children }) {
  const { lang } = useLocale()
  const panelId = useId()
  const rootRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) onOpenChange(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open, onOpenChange])

  const onKeyDown = (event) => {
    if (event.key !== 'Escape' || !open || event.defaultPrevented) return
    event.preventDefault()
    onOpenChange(false)
    buttonRef.current?.focus()
  }

  const onBlur = (event) => {
    if (open && event.relatedTarget && !rootRef.current?.contains(event.relatedTarget)) onOpenChange(false)
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown} onBlur={onBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onOpenChange(!open)}
        className={classNames(
          'inline-flex h-10 items-center gap-2.5 border px-4 font-sans text-[11px] font-medium uppercase tracking-wide2 transition-colors duration-300',
          'rtl:font-sans-ar rtl:text-[13px] rtl:normal-case rtl:tracking-normal',
          open || count > 0
            ? 'border-green-600 text-green-600'
            : 'border-snow-300 text-ink-950 hover:border-green-600 hover:text-green-600',
        )}
      >
        {label}
        {count > 0 && (
          <span className="t-figure grid h-[18px] min-w-[18px] place-items-center rounded-full bg-green-600 px-1 text-[10px] leading-none text-snow-50">
            <span className="sr-only">{' ('}</span>
            {formatNumber(count, lang)}
            <span className="sr-only">)</span>
          </span>
        )}
        <ChevronDown
          aria-hidden="true"
          className={classNames('h-3.5 w-3.5 transition-transform duration-300', open && 'rotate-180')}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={label}
          className={classNames(
            'absolute start-0 top-full z-30 mt-2 animate-scale-in border border-snow-200 bg-snow-50 p-5 shadow-[0_22px_48px_-30px_rgba(8,20,15,0.55)]',
            wide ? 'w-[24rem]' : 'w-[19rem]',
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
