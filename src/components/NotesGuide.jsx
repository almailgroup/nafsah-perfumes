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
    <section
      id="notes"
      className="scroll-mt-24 border-y border-noir-950/[0.14] bg-paper-100 py-20 sm:py-28"
    >
      <div ref={ref} className="mx-auto max-w-[1560px] px-5 sm:px-9">
        <header className="max-w-2xl">
          <p className="ticket text-oxblood-600">Reading a Fragrance</p>
          <h2 className="t-display-sm mt-5">Top, heart and base</h2>
          <p className="t-deck mt-6 max-w-md">
            Every composition in the catalogue is listed as a pyramid. Here is how to read one
            before you buy.
          </p>
        </header>

        <div className="mt-14 grid border-t border-noir-950/[0.14] md:grid-cols-3">
          {LAYERS.map((layer, index) => (
            <article
              key={layer.label}
              className={classNames(
                'border-b border-noir-950/[0.14] py-9 transition-all duration-700 md:border-b-0 md:border-l md:py-11 md:pl-9 md:first:border-l-0 md:first:pl-0',
                visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              )}
              style={{ transitionDelay: `${index * 140}ms` }}
            >
              <span className="ticket text-noir-500">{layer.window}</span>
              <h3 className="mt-4 font-display text-[2.25rem] font-normal leading-none text-noir-950">
                {layer.label}
              </h3>
              <p className="t-deck mt-5 max-w-xs">{layer.body}</p>
              <ul className="mt-7 border-t border-noir-950/[0.1] pt-4">
                {layer.examples.map((example) => (
                  <li
                    key={example}
                    className="border-b border-noir-950/[0.08] py-2 font-display text-[1.0625rem] font-medium text-noir-800 last:border-b-0"
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
