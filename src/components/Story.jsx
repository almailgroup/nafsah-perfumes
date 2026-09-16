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
    <section id="house" className="relative scroll-mt-24 py-24 sm:py-32">
      <div
        ref={ref}
        className={classNames(
          'mx-auto max-w-[1600px] px-6 transition-all duration-1000 sm:px-10',
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
        )}
      >
        <div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <p className="eyebrow">The House</p>
            <h2 className="display mt-6 text-[clamp(2.4rem,5vw,4.25rem)]">
              Fifty years
              <br />
              of <em className="font-display italic text-bone-200">restraint</em>
            </h2>

            <p className="mt-9 max-w-md text-[15px] font-light leading-[1.8] text-bone-300">
              Nafsah began in 1974 as a three-bench atelier supplying attars to a handful of houses
              in the Gulf. We still work the same way — small batches, long maceration, and formulas
              that are allowed to be difficult.
            </p>

            <figure className="mt-12 max-w-md border-t hairline pt-10">
              <blockquote className="font-display text-[1.75rem] font-normal italic leading-[1.3] text-bone-100">
                “A perfume should be recognised before it is announced.”
              </blockquote>
              <figcaption className="mt-5 text-[9px] uppercase tracking-wider2 text-bone-500">
                Yusuf Nafsah, founder
              </figcaption>
            </figure>
          </div>

          {/* Numbered ledger rather than icon cards */}
          <ol className="border-t hairline">
            {PILLARS.map((pillar, index) => (
              <li
                key={pillar.title}
                className="group grid grid-cols-[3rem_1fr] gap-4 border-b hairline py-8 sm:grid-cols-[4.5rem_1fr] sm:gap-8 sm:py-10"
              >
                <span className="pt-1 font-display text-sm text-bone-500 tabular-nums">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display text-2xl leading-tight text-bone-50 sm:text-[1.75rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-[14px] font-light leading-[1.75] text-bone-400">
                    {pillar.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
