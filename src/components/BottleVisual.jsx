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
 * `onDark` flips the glass modelling — light grounds need dark contour and
 * shadow, dark grounds need specular highlight — so the same component works
 * on the paper catalogue and in the noir hero.
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

export default function BottleVisual({
  palette,
  fillLevel = 0.88,
  catalogue,
  className,
  onDark = false,
}) {
  const uid = useId().replace(/:/g, '')
  const liquid = `lq-${uid}`
  const glass = `gl-${uid}`
  const clip = `cl-${uid}`

  const surfaceY = BODY_BOTTOM - (BODY_BOTTOM - BODY_TOP) * fillLevel

  const contour = onDark ? '#faf7f1' : '#141210'
  const contourOpacity = onDark ? 0.34 : 0.42
  const stopperFill = onDark ? '#3a352e' : '#cfc6b4'
  const labelFill = onDark ? '#f4efe5' : '#faf7f1'

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
          <stop offset="0%" stopColor="#ffffff" stopOpacity={onDark ? 0.2 : 0.55} />
          <stop offset="16%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="58%" stopColor="#000000" stopOpacity={onDark ? 0.24 : 0.14} />
          <stop offset="86%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={onDark ? 0.14 : 0.4} />
        </linearGradient>

        <clipPath id={clip}>
          <path d={SILHOUETTE} />
        </clipPath>
      </defs>

      {/* Ground-glass stopper */}
      <path d={STOPPER} fill={stopperFill} />
      <path d={STOPPER} fill="none" stroke={contour} strokeOpacity={contourOpacity} strokeWidth="1.1" />
      <path d="M84 9 L91 9 L89 24 L82 22 Z" fill="#ffffff" opacity={onDark ? 0.12 : 0.55} />
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
      <path d={SILHOUETTE} fill={onDark ? '#1c1916' : '#ffffff'} fillOpacity={onDark ? 0.5 : 0.55} />
      <g clipPath={`url(#${clip})`}>
        <rect x="40" y={surfaceY} width="120" height={BODY_BOTTOM - surfaceY} fill={`url(#${liquid})`} />
        <rect x="40" y={surfaceY} width="120" height="1.75" fill="#ffffff" opacity="0.4" />
        <path d={SILHOUETTE} fill={`url(#${glass})`} />
        <rect x="57" y="116" width="7" height="128" fill="#ffffff" opacity={onDark ? 0.24 : 0.42} />
      </g>
      <path d={SILHOUETTE} fill="none" stroke={contour} strokeOpacity={contourOpacity} strokeWidth="1.2" />

      {/* Wax seal at the neck — the one spot of oxblood on the product */}
      <circle cx="100" cy="80" r="9" fill="#6e2c3c" />
      <circle cx="100" cy="80" r="9" fill="none" stroke="#141210" strokeOpacity="0.28" strokeWidth="0.8" />
      <circle cx="96.8" cy="76.8" r="2.6" fill="#ffffff" opacity="0.18" />

      {/* Wrapped paper label carrying the catalogue number */}
      <rect x="68" y="168" width="64" height="56" fill={labelFill} />
      <rect
        x="68"
        y="168"
        width="64"
        height="56"
        fill="none"
        stroke="#141210"
        strokeOpacity="0.3"
        strokeWidth="0.8"
      />
      <rect
        x="70.5"
        y="170.5"
        width="59"
        height="51"
        fill="none"
        stroke="#141210"
        strokeOpacity="0.18"
        strokeWidth="0.5"
      />
      <text
        x="100"
        y="193"
        textAnchor="middle"
        fontFamily="Cormorant Garamond, Garamond, Georgia, serif"
        fontSize="21"
        fontWeight="500"
        fill="#141210"
      >
        N
      </text>
      <line x1="78" y1="199" x2="122" y2="199" stroke="#141210" strokeOpacity="0.28" strokeWidth="0.6" />
      <text
        x="100"
        y="210"
        textAnchor="middle"
        fontFamily="Jost, system-ui, sans-serif"
        fontSize="6"
        letterSpacing="1.5"
        fill="#141210"
        fillOpacity="0.72"
      >
        EXTRAIT
      </text>
      {catalogue && (
        <text
          x="100"
          y="219"
          textAnchor="middle"
          fontFamily="Jost, system-ui, sans-serif"
          fontSize="5.5"
          letterSpacing="1.2"
          fill="#141210"
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
        fill={onDark ? '#000000' : '#141210'}
        opacity={onDark ? 0.5 : 0.16}
      />
    </svg>
  )
}
