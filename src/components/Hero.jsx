import { ArrowRight } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { PRODUCTS_BY_ID } from '../data/products'

const HERO_FRAGRANCE = PRODUCTS_BY_ID['ambre-royale']

const STATS = [
  { value: '38', label: 'Raw materials' },
  { value: '1974', label: 'Est. in Grasse' },
  { value: '12', label: 'Extraits' },
]

export default function Hero({ onShopNow }) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Ambient background: a single warm wash from the featured fragrance,
          plus a vignette. No grid, no metal. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-ink-950" />
        <div
          className="absolute right-[-10%] top-[6%] h-[680px] w-[680px] rounded-full blur-[110px]"
          style={{
            background: `radial-gradient(circle at center, ${HERO_FRAGRANCE.palette.via}26, transparent 66%)`,
          }}
        />
        <div className="absolute -left-40 bottom-[10%] h-[440px] w-[440px] rounded-full bg-[radial-gradient(circle_at_center,rgba(186,177,164,0.07),transparent_66%)] blur-[90px]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-[1600px] items-center gap-14 px-6 pb-16 pt-32 sm:px-10 sm:pt-36 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-24 lg:pt-44">
        <div className="animate-fade-up">
          <p className="eyebrow">Maison de Parfum — Grasse</p>

          <h1 className="display mt-8 text-[clamp(3.1rem,8.4vw,7.2rem)]">
            Scent is the
            <br />
            last thing
            <br />
            they <em className="font-display italic text-bone-200">forget</em>
          </h1>

          <p className="mt-9 max-w-md text-[15px] font-light leading-[1.75] text-bone-300">
            Extraits composed in small batches from oud, saffron, neroli and Damask rose — aged in
            oak, decanted by hand, and never reformulated for volume.
          </p>

          <div className="mt-11 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onShopNow} className="btn-primary group">
              Shop the Collection
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.75}
              />
            </button>
            <a href="#house" className="btn-outline">
              Our Craft
            </a>
          </div>

          <dl className="mt-16 flex max-w-lg divide-x divide-white/[0.08] border-t hairline pt-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex-1 pl-6 first:pl-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-[2rem] leading-none text-bone-50">
                    {stat.value}
                  </span>
                  <span className="mt-2.5 block text-[9px] uppercase tracking-wider2 text-bone-400">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Hero flacon */}
        <div className="relative flex items-center justify-center lg:justify-end lg:pr-6">
          <div className="animate-float">
            <BottleVisual
              palette={HERO_FRAGRANCE.palette}
              fillLevel={0.8}
              className="h-[320px] w-auto drop-shadow-[0_50px_70px_rgba(0,0,0,0.7)] sm:h-[440px] lg:h-[520px]"
            />
          </div>

          {/* Caption set like a gallery placard */}
          <figure className="absolute bottom-2 left-0 max-w-[13rem] border-l hairline pl-5 sm:bottom-6">
            <figcaption>
              <span className="block font-display text-lg text-bone-100">Ambre Royale</span>
              <span className="mt-1.5 block text-[10px] uppercase tracking-wider2 text-bone-400">
                Extrait · Saffron, Labdanum, Vanilla
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
