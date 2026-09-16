import { useId } from 'react'
import { classNames } from '../lib/format'

/**
 * Vector stand-in for product photography.
 *
 * The flacon chrome is deliberately achromatic — graphite cap, clear glass —
 * so the fragrance's own `palette` is the only colour in the frame. That keeps
 * a grid of twelve bottles reading as a collection rather than as metal.
 * Swap this component for an <img> once real photography exists.
 */

// Body geometry, shared by the fill calculation and the clip path.
const BODY_TOP = 72
const BODY_BOTTOM = 264
const BODY_PATH =
  'M46 72 L154 72 C158 72 160 75 160 79 L160 252 C160 259 154 264 147 264 L53 264 C46 264 40 259 40 252 L40 79 C40 75 42 72 46 72 Z'

export default function BottleVisual({ palette, fillLevel = 0.74, className, glow = true }) {
  const uid = useId().replace(/:/g, '')
  const liquid = `liquid-${uid}`
  const glass = `glass-${uid}`
  const cap = `cap-${uid}`
  const shine = `shine-${uid}`
  const halo = `halo-${uid}`
  const clip = `clip-${uid}`

  const surfaceY = BODY_BOTTOM - (BODY_BOTTOM - BODY_TOP) * fillLevel

  return (
    <svg
      viewBox="0 0 200 300"
      role="img"
      aria-hidden="true"
      className={classNames('h-full w-full', className)}
    >
      <defs>
        <linearGradient id={liquid} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="55%" stopColor={palette.via} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>

        {/* Faceted glass: bright edges, a darker core, one catch-light */}
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.20" />
          <stop offset="13%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="56%" stopColor="#000000" stopOpacity="0.22" />
          <stop offset="88%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
        </linearGradient>

        {/* Matte graphite, not metal */}
        <linearGradient id={cap} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#201e1d" />
          <stop offset="18%" stopColor="#413d39" />
          <stop offset="55%" stopColor="#2c2a27" />
          <stop offset="88%" stopColor="#3a3632" />
          <stop offset="100%" stopColor="#1b1a18" />
        </linearGradient>

        <linearGradient id={shine} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={halo} cx="50%" cy="56%" r="50%">
          <stop offset="0%" stopColor={palette.via} stopOpacity="0.34" />
          <stop offset="64%" stopColor={palette.from} stopOpacity="0.10" />
          <stop offset="100%" stopColor={palette.from} stopOpacity="0" />
        </radialGradient>

        <clipPath id={clip}>
          <path d={BODY_PATH} />
        </clipPath>
      </defs>

      {glow && <circle cx="100" cy="168" r="96" fill={`url(#${halo})`} />}

      {/* Stopper and neck */}
      <rect x="68" y="8" width="64" height="42" fill={`url(#${cap})`} />
      <rect x="68" y="8" width="64" height="4" fill="#ffffff" opacity="0.07" />
      <rect x="68" y="46" width="64" height="4" fill="#000000" opacity="0.35" />
      <rect x="82" y="50" width="36" height="22" fill={palette.glass} />
      <rect x="82" y="50" width="6" height="22" fill="#ffffff" opacity="0.09" />

      {/* Flacon body: glass shell, then liquid clipped inside it */}
      <path d={BODY_PATH} fill={palette.glass} />
      <g clipPath={`url(#${clip})`}>
        <rect
          x="36"
          y={surfaceY}
          width="128"
          height={BODY_BOTTOM - surfaceY}
          fill={`url(#${liquid})`}
        />
        {/* Meniscus */}
        <rect x="36" y={surfaceY} width="128" height="2" fill="#ffffff" opacity="0.26" />
        <path d={BODY_PATH} fill={`url(#${glass})`} />
        <rect x="52" y="92" width="10" height="146" fill={`url(#${shine})`} />
        <rect x="145" y="120" width="4" height="104" fill="#ffffff" opacity="0.08" />
      </g>
      <path d={BODY_PATH} fill="none" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" />

      {/* Apothecary label rather than an embossed seal */}
      <rect
        x="74"
        y="176"
        width="52"
        height="40"
        fill="#0a0a09"
        fillOpacity="0.42"
        stroke="#faf8f4"
        strokeOpacity="0.24"
        strokeWidth="0.6"
      />
      <text
        x="100"
        y="196"
        textAnchor="middle"
        fontFamily="Bodoni Moda, Didot, Times New Roman, serif"
        fontSize="14"
        fill="#faf8f4"
        fillOpacity="0.7"
      >
        N
      </text>
      <line x1="84" y1="202" x2="116" y2="202" stroke="#faf8f4" strokeOpacity="0.18" />
      <text
        x="100"
        y="211"
        textAnchor="middle"
        fontFamily="Jost, system-ui, sans-serif"
        fontSize="5"
        letterSpacing="1.6"
        fill="#faf8f4"
        fillOpacity="0.42"
      >
        PARFUM
      </text>

      {/* Reflection on the display surface */}
      <ellipse cx="100" cy="268" rx="62" ry="6" fill="#000000" opacity="0.55" />
      <ellipse cx="100" cy="268" rx="40" ry="3" fill={palette.via} opacity="0.18" />
    </svg>
  )
}
