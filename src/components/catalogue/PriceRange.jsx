import { useId, useRef, useState } from 'react'
import { FULL_RANGE } from '../../lib/catalogue'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatPrice } from '../../lib/format'

/** One dinar, in fils. The bounds are whole dinars, so every step lands on both ends. */
const STEP = 1000
// The native thumb is a 40px hit box (index.css .range-input) with a small
// dot at its centre, so a thumb's centre runs from 20px in to 20px short of
// each end. The rail and its fill are drawn on that same inner span.
const INSET = 20

const [FLOOR, CEILING] = FULL_RANGE
const SPAN = CEILING - FLOOR
const fraction = (value) => (value - FLOOR) / SPAN

/**
 * The dual-thumb price range in KWD.
 *
 * Two native range inputs carry the values, the keyboard (arrows, Page keys,
 * Home/End) and what a screen reader announces: a localised name and the
 * price as KWD text. The pointer is handled here instead, on the whole rail:
 * a press picks the thumb nearer to it — or, where the two sit together, the
 * one on the side being pulled towards — so they can always be pulled apart,
 * and pressing the bare rail moves the nearer thumb there. The thumb in hand
 * (or in focus) is drawn above the other.
 */
export default function PriceRange({ range, onChange, className }) {
  const { lang, t, isRtl } = useLocale()
  const labelId = useId()
  const railRef = useRef(null)
  const drag = useRef(null)
  const [front, setFront] = useState('max')
  const [low, high] = range

  const valueAt = (clientX) => {
    const rect = railRef.current.getBoundingClientRect()
    const usable = rect.width - INSET * 2
    const offset = isRtl ? rect.right - INSET - clientX : clientX - rect.left - INSET
    const ratio = Math.min(1, Math.max(0, offset / usable))
    return FLOOR + Math.round((ratio * SPAN) / STEP) * STEP
  }

  const move = (thumb, value) => {
    if (thumb === 'min') onChange([Math.min(value, high), high])
    else onChange([low, Math.max(value, low)])
  }

  const onPointerDown = (event) => {
    if (event.button !== 0) return
    const value = valueAt(event.clientX)
    let thumb = null
    if (value < low || (value === low && low !== high)) thumb = 'min'
    else if (value > high || value === high) thumb = low === high ? null : 'max'
    else thumb = value - low <= high - value ? 'min' : 'max'
    // Both thumbs on one value: wait for the first move to say which way.
    drag.current = { pointerId: event.pointerId, thumb }
    event.currentTarget.setPointerCapture(event.pointerId)
    event.preventDefault()
    if (thumb) {
      setFront(thumb)
      move(thumb, value)
      railRef.current.querySelector(`[data-thumb="${thumb}"]`)?.focus({ preventScroll: true })
    }
  }

  const onPointerMove = (event) => {
    const current = drag.current
    if (!current || current.pointerId !== event.pointerId) return
    const value = valueAt(event.clientX)
    if (!current.thumb) {
      if (value === low) return
      current.thumb = value < low ? 'min' : 'max'
      setFront(current.thumb)
      railRef.current.querySelector(`[data-thumb="${current.thumb}"]`)?.focus({ preventScroll: true })
    }
    move(current.thumb, value)
  }

  const endDrag = (event) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null
  }

  // The fill runs between the thumb centres, from the logical start, so it
  // mirrors with the page.
  const fill = {
    insetInlineStart: `calc(${INSET}px + (100% - ${INSET * 2}px) * ${fraction(low)})`,
    width: `calc((100% - ${INSET * 2}px) * ${fraction(high) - fraction(low)})`,
  }

  const thumbClass = (thumb) =>
    classNames(
      'range-input absolute inset-x-0 top-0 w-full',
      // The rail takes the pointer; the inputs keep the keyboard.
      '[&::-moz-range-thumb]:!pointer-events-none [&::-webkit-slider-thumb]:!pointer-events-none',
      front === thumb ? 'z-[2]' : 'z-[1]',
    )

  return (
    <div role="group" aria-labelledby={labelId} className={classNames('w-full', className)}>
      <div className="flex items-baseline justify-between gap-4 leading-4">
        <span id={labelId} className="ticket text-snow-600">
          {t('price')}
        </span>
        <span className="t-figure text-[14px] leading-4 text-ink-950" aria-hidden="true">
          {formatPrice(low, lang)} – {formatPrice(high, lang)}
        </span>
      </div>
      <div
        ref={railRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative mt-1 h-10 cursor-pointer touch-pan-y select-none"
      >
        <div className="pointer-events-none absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-snow-300" />
        <div className="pointer-events-none absolute top-1/2 h-0.5 -translate-y-1/2 bg-green-600" style={fill} />
        <input
          type="range" min={FLOOR} max={CEILING} step={STEP} value={low} data-thumb="min"
          aria-label={t('catalogue.priceMin')} aria-valuetext={formatPrice(low, lang)}
          onChange={(event) => move('min', Number(event.target.value))}
          onFocus={() => setFront('min')}
          className={thumbClass('min')}
        />
        <input
          type="range" min={FLOOR} max={CEILING} step={STEP} value={high} data-thumb="max"
          aria-label={t('catalogue.priceMax')} aria-valuetext={formatPrice(high, lang)}
          onChange={(event) => move('max', Number(event.target.value))}
          onFocus={() => setFront('max')}
          className={thumbClass('max')}
        />
      </div>
    </div>
  )
}
