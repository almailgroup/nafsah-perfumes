import { useId } from 'react'
import { classNames } from '../lib/format'

/**
 * Vector stand-in for product photography.
 *
 * Each flacon is tinted from the fragrance's own `palette`, so the catalogue
 * reads as a coherent set of images without shipping a single binary asset.
 * Swap this component for an <img> once real photography exists.
 */

// Body geometry, shared by the fill calculation and the clip path.
const BODY_TOP = 68
const BODY_BOTTOM = 260
const BODY_PATH =
  'M84 68 L116 68 C144 73 165 94 165 120 L165 238 C165 252 154 260 140 260 L60 260 C46 260 35 252 35 238 L35 120 C35 94 56 73 84 68 Z'

export default function BottleVisual({ palette, fillLevel = 0.72, className, glow = true }) {
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
        <linearGradient id={liquid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="52%" stopColor={palette.via} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>

        {/* Faceted glass: bright edges, a darker core, one catch-light */}
        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.24" />
          <stop offset="14%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="55%" stopColor="#000000" stopOpacity="0.20" />
          <stop offset="86%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.18" />
        </linearGradient>

        <linearGradient id={cap} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7d6432" />
          <stop offset="24%" stopColor="#e6d3ab" />
          <stop offset="52%" stopColor="#c9a961" />
          <stop offset="78%" stopColor="#f4e9d2" />
          <stop offset="100%" stopColor="#6f5a2d" />
        </linearGradient>

        <linearGradient id={shine} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={halo} cx="50%" cy="54%" r="50%">
          <stop offset="0%" stopColor={palette.via} stopOpacity="0.40" />
          <stop offset="62%" stopColor={palette.from} stopOpacity="0.12" />
          <stop offset="100%" stopColor={palette.from} stopOpacity="0" />
        </radialGradient>

        <clipPath id={clip}>
          <path d={BODY_PATH} />
        </clipPath>
      </defs>

      {glow && <circle cx="100" cy="164" r="98" fill={`url(#${halo})`} />}

      {/* Stopper, collar and neck */}
      <rect x="74" y="8" width="52" height="36" rx="5" fill={`url(#${cap})`} />
      <rect x="74" y="8" width="52" height="10" rx="5" fill="#ffffff" opacity="0.20" />
      <rect x="74" y="38" width="52" height="6" fill="#000000" opacity="0.18" />
      <rect x="79" y="44" width="42" height="7" rx="2.5" fill={`url(#${cap})`} />
      <rect x="84" y="51" width="32" height="18" fill={palette.glass} />
      <rect x="84" y="51" width="7" height="18" fill="#ffffff" opacity="0.12" />
      <rect x="110" y="51" width="6" height="18" fill="#ffffff" opacity="0.06" />

      {/* Flacon body: glass shell, then liquid clipped inside it */}
      <path d={BODY_PATH} fill={palette.glass} />
      <g clipPath={`url(#${clip})`}>
        <rect
          x="30"
          y={surfaceY}
          width="140"
          height={BODY_BOTTOM - surfaceY}
          fill={`url(#${liquid})`}
        />
        {/* Meniscus */}
        <rect x="30" y={surfaceY} width="140" height="2.5" fill="#ffffff" opacity="0.30" />
        <path d={BODY_PATH} fill={`url(#${glass})`} />
        <rect x="48" y="92" width="12" height="142" rx="6" fill={`url(#${shine})`} />
        <rect x="146" y="124" width="5" height="100" rx="2.5" fill="#ffffff" opacity="0.10" />
      </g>
      <path d={BODY_PATH} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.25" />

      {/* Embossed house mark */}
      <circle cx="100" cy="186" r="21" fill="none" stroke="#ffffff" strokeOpacity="0.24" />
      <text
        x="100"
        y="194"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Georgia, serif"
        fontSize="22"
        fill="#ffffff"
        fillOpacity="0.5"
      >
        N
      </text>

      {/* Reflection on the display surface */}
      <ellipse cx="100" cy="268" rx="66" ry="8" fill="#000000" opacity="0.5" />
      <ellipse cx="100" cy="268" rx="44" ry="4.5" fill={palette.via} opacity="0.22" />
    </svg>
  )
}
