import { Droplets, FlaskConical, Leaf, Timer } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { classNames } from '../lib/format'

const PILLARS = [
  {
    icon: Leaf,
    title: 'Single-origin materials',
    body: 'Sambac jasmine from Tamil Nadu, oud from Trat, iris butter aged six years in Florence. We name every source on the carton.',
  },
  {
    icon: FlaskConical,
    title: 'Composed in Grasse',
    body: 'Each formula is built by hand at our atelier bench, then left to macerate for four weeks before a single bottle is filled.',
  },
  {
    icon: Droplets,
    title: 'Extrait concentrations',
    body: '22–30% perfume oil, against the 12% that passes for eau de parfum elsewhere. Less alcohol, longer wear, quieter projection.',
  },
  {
    icon: Timer,
    title: 'Never reformulated',
    body: 'A Nafsah bottled in 2019 smells like one bottled today. We would rather retire a fragrance than cheapen its materials.',
  },
]

export default function Story() {
  const [ref, visible] = useReveal()

  return (
    <section id="house" className="relative scroll-mt-24 overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,169,97,0.10),transparent_60%)]"
      />

      <div
        ref={ref}
        className={classNames(
          'mx-auto grid max-w-7xl gap-14 px-5 transition-all duration-700 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20',
          visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
        )}
      >
        <div>
          <p className="eyebrow">The House</p>
          <h2 className="mt-4 font-display text-4xl font-light leading-[1.1] text-cream-50 sm:text-5xl">
            Fifty years of
            <em className="text-gilded not-italic"> restraint</em>
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-cream-300">
            Nafsah began in 1974 as a three-bench atelier supplying attars to a handful of houses in
            the Gulf. We still work the same way — small batches, long maceration, and formulas that
            are allowed to be difficult.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-cream-300">
            Nothing here is designed by committee or tested for mass appeal. A composition leaves the
            atelier when it is finished, and not before.
          </p>

          <figure className="mt-10 border-l-2 border-gold-400/40 pl-6">
            <blockquote className="font-display text-2xl font-light italic leading-snug text-cream-100">
              “A perfume should be recognised before it is announced.”
            </blockquote>
            <figcaption className="mt-3 text-[10px] uppercase tracking-wider2 text-cream-400">
              Yusuf Nafsah, founder
            </figcaption>
          </figure>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-white/[0.07] bg-ink-900/60 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/25"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className="grid h-11 w-11 place-items-center rounded-full border border-gold-400/25 bg-gold-400/[0.07] transition-colors duration-500 group-hover:border-gold-400/50">
                  <Icon className="h-[18px] w-[18px] text-gold-300" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 font-display text-xl text-cream-50">{pillar.title}</h3>
                <p className="mt-2.5 text-[13px] leading-relaxed text-cream-400">{pillar.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
