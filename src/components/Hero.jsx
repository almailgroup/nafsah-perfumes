import { ArrowRight, Sparkles, Star } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { PRODUCTS_BY_ID } from '../data/products'

const HERO_FRAGRANCE = PRODUCTS_BY_ID['ambre-royale']

const STATS = [
  { value: '38', label: 'Rare raw materials' },
  { value: '1974', label: 'House founded' },
  { value: '12', label: 'Signature extraits' },
]

export default function Hero({ onShopNow }) {
  return (
    <section id="top" className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36">
      {/* Ambient background: layered radial washes plus a fine grid */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-ink-950" />
        <div className="absolute left-1/2 top-[-18%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,169,97,0.20),transparent_62%)] blur-2xl" />
        <div className="absolute -left-40 top-1/3 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(176,106,125,0.16),transparent_65%)] blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,rgba(87,166,160,0.12),transparent_65%)] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.045]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(ellipse at 50% 40%, black 30%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 40%, black 30%, transparent 78%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28">
        <div className="animate-fade-up text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/[0.06] px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-gold-300" strokeWidth={1.5} />
            <span className="text-[10px] font-medium uppercase tracking-wider2 text-gold-200">
              New — Musc Blanc, bottled in Grasse
            </span>
          </span>

          <h1 className="mt-7 font-display text-[2.85rem] font-light leading-[1.02] tracking-tight text-cream-50 sm:text-6xl lg:text-[4.6rem]">
            Scent is the
            <br className="hidden sm:block" /> last thing they
            <br className="hidden sm:block" />{' '}
            <em className="text-gilded not-italic">forget.</em>
          </h1>

          <p className="mx-auto mt-7 max-w-lg text-[15px] leading-relaxed text-cream-300 lg:mx-0">
            Extraits de parfum composed in small batches from oud, saffron, neroli and Damask rose —
            aged in oak, decanted by hand, and never reformulated for volume.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <button type="button" onClick={onShopNow} className="btn-gold group w-full sm:w-auto">
              Shop Now
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2}
              />
            </button>
            <a href="#house" className="btn-ghost w-full sm:w-auto">
              Our Craft
            </a>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-4 border-t hairline pt-8 text-center lg:text-left">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block font-display text-3xl text-cream-50">{stat.value}</span>
                  <span className="mt-1 block text-[10px] uppercase tracking-wider2 text-cream-400">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Hero flacon */}
        <div className="relative mx-auto flex w-full max-w-md items-center justify-center lg:max-w-none">
          <div className="absolute h-64 w-64 rounded-full bg-gold-400/10 blur-3xl sm:h-80 sm:w-80" />

          <div className="relative animate-float">
            <BottleVisual
              palette={HERO_FRAGRANCE.palette}
              fillLevel={0.78}
              className="h-[340px] w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,0.65)] sm:h-[440px] lg:h-[520px]"
            />
          </div>

          <figure className="absolute -bottom-2 right-0 w-56 rounded-2xl border border-white/10 bg-ink-900/80 p-4 backdrop-blur-xl sm:right-2 lg:right-0">
            <div className="flex items-center gap-1 text-gold-300">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-3 w-3 fill-current" strokeWidth={0} />
              ))}
            </div>
            <figcaption className="mt-2 text-xs leading-relaxed text-cream-300">
              “Ambre Royale outlasts everything else on my shelf.”
              <span className="mt-2 block text-[10px] uppercase tracking-wider2 text-cream-400">
                — Verified client, Paris
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
