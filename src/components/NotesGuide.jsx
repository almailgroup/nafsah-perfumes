import { useReveal } from '../hooks/useReveal'
import { classNames } from '../lib/format'

const LAYERS = [
  {
    label: 'Top',
    window: 'First 15 minutes',
    body: 'The opening. Volatile citruses and aromatics that announce the fragrance and then step aside.',
    examples: ['Bergamot', 'Yuzu', 'Pink Pepper', 'Saffron'],
  },
  {
    label: 'Heart',
    window: 'Hours one to four',
    body: 'The character of the composition — florals, spices and resins that carry it through the day.',
    examples: ['Damask Rose', 'Sambac Jasmine', 'Iris', 'Oud'],
  },
  {
    label: 'Base',
    window: 'Four hours onward',
    body: 'What remains on skin and fabric. Heavy molecules that fix the fragrance and give it a memory.',
    examples: ['Sandalwood', 'Vanilla', 'Ambergris', 'Vetiver'],
  },
]

export default function NotesGuide() {
  const [ref, visible] = useReveal()

  return (
    <section id="notes" className="scroll-mt-24 border-t hairline bg-ink-900/50 py-24 sm:py-32">
      <div ref={ref} className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <header className="max-w-2xl">
          <p className="eyebrow">Reading a Fragrance</p>
          <h2 className="display mt-6 text-[clamp(2.4rem,5vw,4.25rem)]">Top, heart and base</h2>
          <p className="mt-7 max-w-md text-[15px] font-light leading-[1.75] text-bone-400">
            Every composition in the collection is listed as a pyramid. Here is how to read one
            before you buy.
          </p>
        </header>

        <div className="mt-16 grid gap-px border-t hairline md:grid-cols-3">
          {LAYERS.map((layer, index) => (
            <article
              key={layer.label}
              className={classNames(
                'border-b hairline py-10 transition-all duration-700 md:border-b-0 md:border-l md:py-12 md:pl-10 md:first:border-l-0 md:first:pl-0',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              )}
              style={{ transitionDelay: `${index * 140}ms` }}
            >
              <span className="text-[9px] uppercase tracking-wider2 text-bone-500">
                {layer.window}
              </span>
              <h3 className="mt-4 font-display text-[2rem] leading-none text-bone-50">
                {layer.label}
              </h3>
              <p className="mt-5 max-w-xs text-[14px] font-light leading-[1.75] text-bone-400">
                {layer.body}
              </p>
              <ul className="mt-7 space-y-2">
                {layer.examples.map((example) => (
                  <li key={example} className="text-[13px] font-light text-bone-200">
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
