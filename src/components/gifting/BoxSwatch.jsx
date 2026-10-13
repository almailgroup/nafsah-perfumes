import { classNames } from '../../lib/format'

// The weave's rows, a hair apart: linen reads as texture, not as stripes.
const THREADS = Array.from({ length: 16 }, (_, i) => 1.5 + i * 3)

/** Green linen, the lid's seam and the gold house seal. */
function Signature() {
  return (
    <>
      <rect width="48" height="48" className="fill-green-600" />
      {THREADS.map((at) => (
        <path key={`h${at}`} d={`M0 ${at}H48`} className="stroke-snow-50" strokeOpacity="0.1" strokeWidth="0.6" />
      ))}
      {THREADS.map((at) => (
        <path key={`v${at}`} d={`M${at} 0V48`} className="stroke-snow-50" strokeOpacity="0.06" strokeWidth="0.6" />
      ))}
      <path d="M0 15.5H48" className="stroke-green-700" strokeWidth="1.2" />
      <circle cx="24" cy="29" r="6.5" className="fill-gold-500 stroke-gold-300" strokeWidth="0.75" />
      <circle cx="24" cy="29" r="4" fill="none" className="stroke-gold-300" strokeWidth="0.6" />
    </>
  )
}

// Al Sadu: red ground, black bands edged with teeth, and a white band of
// lozenges down the middle, the way the Bedouin weave is laid out.
const TEETH = Array.from({ length: 8 }, (_, i) => i * 6)
const LOZENGES = [4, 12, 20, 28, 36, 44]

function Sadu() {
  return (
    <>
      <rect width="48" height="48" className="fill-alert-600" />
      <rect y="6" width="48" height="8" className="fill-ink-950" />
      <path d={TEETH.map((x) => `M${x} 14L${x + 3} 17L${x + 6} 14Z`).join('')} className="fill-ink-950" />
      <rect y="19" width="48" height="10" className="fill-snow-100" />
      {LOZENGES.map((x) => (
        <g key={x}>
          <path d={`M${x} 20.5L${x + 3.5} 24L${x} 27.5L${x - 3.5} 24Z`} className="fill-ink-950" />
          <circle cx={x} cy="24" r="0.9" className="fill-alert-600" />
        </g>
      ))}
      <path d={TEETH.map((x) => `M${x} 34L${x + 3} 31L${x + 6} 34Z`).join('')} className="fill-ink-950" />
      <rect y="34" width="48" height="8" className="fill-ink-950" />
    </>
  )
}

// Walnut, mixed from the tokens: the house bronze warmed with the alert red
// and darkened with ink. A grain that runs the width, the lid and a brass clasp.
const GRAIN = [
  'M0 4.5C12 3 22 7 48 5',
  'M0 10C9 11.5 30 8 48 10.5',
  'M0 22C14 20 26 25 48 22.5',
  'M0 28.5C10 30 34 27 48 29',
  'M0 35C16 33.5 28 37.5 48 35.5',
  'M0 42C12 43.5 30 40 48 42.5',
]

function Majlis() {
  return (
    <>
      <rect width="48" height="48" className="fill-gold-500" />
      <rect width="48" height="48" className="fill-alert-600" fillOpacity="0.5" />
      <rect width="48" height="48" className="fill-ink-950" fillOpacity="0.36" />
      {GRAIN.map((d) => (
        <path key={d} d={d} fill="none" className="stroke-ink-950" strokeOpacity="0.32" strokeWidth="0.7" />
      ))}
      <path d="M0 16.5H48" className="stroke-ink-950" strokeOpacity="0.6" strokeWidth="1.1" />
      <rect x="20.5" y="13" width="7" height="9" className="fill-gold-300 stroke-ink-950" strokeOpacity="0.45" strokeWidth="0.5" />
      <circle cx="24" cy="18.5" r="1" className="fill-ink-950" fillOpacity="0.7" />
    </>
  )
}

const DRAWINGS = { signature: Signature, sadu: Sadu, majlis: Majlis }

/**
 * A small drawing of each gift box, in the house tokens: the signature box's
 * green linen and gold seal, the Al Sadu weave, the majlis chest's wood and
 * brass. Decorative; the box's name sits beside it.
 */
export default function BoxSwatch({ boxId, className }) {
  const Drawing = DRAWINGS[boxId] ?? Signature
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 48 48"
      className={classNames('block shrink-0 border border-snow-300', className)}
    >
      <Drawing />
    </svg>
  )
}
