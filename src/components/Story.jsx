import { useReveal } from '../hooks/useReveal'
import { classNames } from '../lib/format'

const PILLARS = [
  {
    title: 'Single-origin materials',
    body: 'Sambac jasmine from Tamil Nadu, oud from Trat, iris butter aged six years in Florence. We name every source on the carton.',
  },
  {
    title: 'Composed in Grasse',
    body: 'Each formula is built by hand at our atelier bench, then left to macerate for four weeks before a single bottle is filled.',
  },
  {
    title: 'Extrait concentrations',
    body: '22–30% perfume oil, against the 12% that passes for eau de parfum elsewhere. Less alcohol, longer wear, quieter projection.',
  },
  {
    title: 'Never reformulated',
    body: 'A Nafsah bottled in 2019 smells like one bottled today. We would rather retire a fragrance than cheapen its materials.',
  },
]

export default function Story() {
  const [ref, visible] = useReveal()

  return (
    <section id="house" className="scroll-mt-24 bg-paper-50 py-20 sm:py-28">
      <div
        ref={ref}
        className={classNames(
          'mx-auto max-w-[1560px] px-5 transition-all duration-1000 sm:px-9',
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        )}
      >
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <p className="ticket text-oxblood-600">The House</p>
            <h2 className="t-display-sm mt-5">
              Fifty years
              <br />
              of <em className="font-medium italic">restraint</em>
            </h2>

            <p className="t-body mt-8 max-w-md">
              Nafsah began in 1974 as a three-bench atelier supplying attars to a handful of houses
              in the Gulf. We still work the same way — small batches, long maceration, and formulas
              that are allowed to be difficult.
            </p>

            <figure className="mt-10 max-w-md border-t border-noir-950/[0.14] pt-8">
              <blockquote className="font-display text-[1.75rem] font-medium italic leading-[1.28] text-noir-950">
                “A perfume should be recognised before it is announced.”
              </blockquote>
              <figcaption className="ticket mt-4 text-noir-500">Yusuf Nafsah, founder</figcaption>
            </figure>
          </div>

          {/* The house's principles, set as ruled ledger entries */}
          <ol className="border-t border-noir-950/[0.14]">
            {PILLARS.map((pillar, index) => (
              <li
                key={pillar.title}
                className="grid grid-cols-[2.75rem_1fr] gap-4 border-b border-noir-950/[0.14] py-7 sm:grid-cols-[4rem_1fr] sm:gap-8 sm:py-9"
              >
                <span className="ticket pt-2 text-oxblood-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="t-title">{pillar.title}</h3>
                  <p className="t-deck mt-2.5 max-w-lg">{pillar.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
