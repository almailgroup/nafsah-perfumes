import { useReveal } from '../hooks/useReveal'
import { classNames } from '../lib/format'

const LAYERS = [
  {
    label: 'Top notes',
    window: 'First 15 minutes',
    body: 'The opening. Volatile citruses and aromatics that announce the fragrance and then step aside.',
    examples: ['Bergamot', 'Yuzu', 'Pink Pepper', 'Saffron'],
    tint: '#d9a32c',
  },
  {
    label: 'Heart notes',
    window: 'Hours one to four',
    body: 'The character of the composition — florals, spices and resins that carry it through the day.',
    examples: ['Damask Rose', 'Sambac Jasmine', 'Iris', 'Oud'],
    tint: '#b06a7d',
  },
  {
    label: 'Base notes',
    window: 'Four hours onward',
    body: 'What remains on skin and fabric. Heavy molecules that fix the fragrance and give it a memory.',
    examples: ['Sandalwood', 'Vanilla', 'Ambergris', 'Vetiver'],
    tint: '#8a5a2b',
  },
]

export default function NotesGuide() {
  const [ref, visible] = useReveal()

  return (
    <section id="notes" className="scroll-mt-24 border-y hairline bg-ink-900/40 py-20 sm:py-28">
      <div ref={ref} className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Reading a Fragrance</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight text-cream-50 sm:text-5xl">
            Top, heart and base
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-cream-300">
            Every composition in the collection is listed as a pyramid. Here is how to read one
            before you buy.
          </p>
        </header>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {LAYERS.map((layer, index) => (
            <article
              key={layer.label}
              className={classNames(
                'relative overflow-hidden rounded-2xl border border-white/[0.07] bg-ink-900/70 p-7 transition-all duration-700',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
              )}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${layer.tint}, transparent)` }}
              />
              <span
                className="text-[10px] font-semibold uppercase tracking-wider2"
                style={{ color: layer.tint }}
              >
                {layer.window}
              </span>
              <h3 className="mt-3 font-display text-2xl text-cream-50">{layer.label}</h3>
              <p className="mt-3 text-[13px] leading-relaxed text-cream-400">{layer.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {layer.examples.map((example) => (
                  <li
                    key={example}
                    className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-cream-300"
                  >
                    {example}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
