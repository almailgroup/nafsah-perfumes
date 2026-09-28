import { useId } from 'react'
import { classNames } from '../lib/format'

/**
 * Vector stand-in for product photography.
 *
 * An apothecary vial rather than a designer flacon: ground-glass stopper,
 * sloped shoulders, a wrapped paper label carrying the catalogue number, and a
 * wax seal at the neck. The glass is achromatic and the only colour is the
 * fragrance's own `palette`, so twelve of these read as one collection.
 *
 * Swap this component for an <img> once real photography exists.
 */

const BODY_TOP = 96
const BODY_BOTTOM = 268

const SILHOUETTE =
  'M84 32 L116 32 L116 62 C116 67 118 71 123 74 L143 88 C150 94 154 104 154 114 ' +
  'L154 250 C154 261 146 268 136 268 L64 268 C54 268 46 261 46 250 L46 114 ' +
  'C46 104 50 94 57 88 L77 74 C82 71 84 67 84 62 Z'

const STOPPER = 'M80 4 L120 4 L123 18 C123 25 113 30 100 30 C87 30 77 25 77 18 Z'

export default function BottleVisual({ palette, fillLevel = 0.88, catalogue, className }) {
  const uid = useId().replace(/:/g, '')
  const liquid = `lq-${uid}`
  const glass = `gl-${uid}`
  const clip = `cl-${uid}`

  const surfaceY = BODY_BOTTOM - (BODY_BOTTOM - BODY_TOP) * fillLevel

  const contour = '#f6f2e9'
  const contourOpacity = 0.32
  const stopperFill = '#233e33'
  const labelFill = '#f6f2e9'

  return (
    <svg
      viewBox="0 0 200 300"
      role="img"
      aria-hidden="true"
      className={classNames('h-full w-full', className)}
    >
      <defs>
        <linearGradient id={liquid} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor={palette.from} />
          <stop offset="55%" stopColor={palette.via} />
          <stop offset="100%" stopColor={palette.to} />
        </linearGradient>

        <linearGradient id={glass} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="16%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="58%" stopColor="#000000" stopOpacity="0.26" />
          <stop offset="86%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.16" />
        </linearGradient>

        <clipPath id={clip}>
          <path d={SILHOUETTE} />
        </clipPath>
      </defs>

      {/* Ground-glass stopper */}
      <path d={STOPPER} fill={stopperFill} />
      <path d={STOPPER} fill="none" stroke={contour} strokeOpacity={contourOpacity} strokeWidth="1.1" />
      <path d="M84 9 L91 9 L89 24 L82 22 Z" fill="#ffffff" opacity="0.14" />
      <rect x="88" y="29" width="24" height="6" fill={stopperFill} />
      <rect
        x="88"
        y="29"
        width="24"
        height="6"
        fill="none"
        stroke={contour}
        strokeOpacity={contourOpacity * 0.7}
        strokeWidth="1"
      />

      {/* Vial: glass shell, then liquid clipped inside it */}
      <path d={SILHOUETTE} fill="#0c1a15" fillOpacity="0.55" />
      <g clipPath={`url(#${clip})`}>
        <rect x="40" y={surfaceY} width="120" height={BODY_BOTTOM - surfaceY} fill={`url(#${liquid})`} />
        <rect x="40" y={surfaceY} width="120" height="1.75" fill="#ffffff" opacity="0.4" />
        <path d={SILHOUETTE} fill={`url(#${glass})`} />
        <rect x="57" y="116" width="7" height="128" fill="#ffffff" opacity="0.26" />
      </g>
      <path d={SILHOUETTE} fill="none" stroke={contour} strokeOpacity={contourOpacity} strokeWidth="1.2" />

      {/* Wax seal at the neck — the one spot of oxblood on the product */}
      <circle cx="100" cy="80" r="7.5" fill="#a37e2c" />
      <circle cx="100" cy="80" r="7.5" fill="none" stroke="#08140f" strokeOpacity="0.3" strokeWidth="0.8" />
      <circle cx="97.4" cy="77.4" r="2.1" fill="#ffffff" opacity="0.18" />

      {/* Wrapped paper label carrying the catalogue number */}
      <rect x="68" y="168" width="64" height="56" fill={labelFill} />
      <rect
        x="68"
        y="168"
        width="64"
        height="56"
        fill="none"
        stroke="#08140f"
        strokeOpacity="0.3"
        strokeWidth="0.8"
      />
      <rect
        x="70.5"
        y="170.5"
        width="59"
        height="51"
        fill="none"
        stroke="#08140f"
        strokeOpacity="0.18"
        strokeWidth="0.5"
      />
      <text
        x="100"
        y="193"
        textAnchor="middle"
        fontFamily="Jost, Futura, sans-serif"
        fontSize="20"
        letterSpacing="1"
        fontWeight="500"
        fill="#08140f"
      >
        N
      </text>
      <line x1="78" y1="199" x2="122" y2="199" stroke="#08140f" strokeOpacity="0.3" strokeWidth="0.6" />
      <text
        x="100"
        y="210"
        textAnchor="middle"
        fontFamily="Jost, Futura, sans-serif"
        fontSize="6"
        letterSpacing="1.5"
        fill="#08140f"
        fillOpacity="0.72"
      >
        EXTRAIT
      </text>
      {catalogue && (
        <text
          x="100"
          y="219"
          textAnchor="middle"
          fontFamily="Jost, Futura, sans-serif"
          fontSize="5.5"
          letterSpacing="1.2"
          fill="#08140f"
          fillOpacity="0.55"
        >
          No. {catalogue}
        </text>
      )}

      {/* Contact shadow */}
      <ellipse
        cx="100"
        cy="271"
        rx="56"
        ry="5"
        fill="#000000"
        opacity="0.5"
      />
    </svg>
  )
}
