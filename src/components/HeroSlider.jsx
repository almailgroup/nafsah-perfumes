import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { CATALOGUE_NUMBERS, PRODUCTS_BY_ID } from '../data/products'
import { classNames, formatPrice } from '../lib/format'

const SLIDES = [
  {
    id: 'ambre-royale',
    eyebrow: 'The house signature',
    headline: ['Scent is the', 'last thing', 'they forget'],
    emphasis: 2,
    body: 'Saffron and cardamom over labdanum and Madagascan vanilla. Our most worn extrait, and the one people ask about.',
  },
  {
    id: 'nuit-de-jasmin',
    eyebrow: 'New this season',
    headline: ['Jasmine picked', 'between midnight', 'and dawn'],
    emphasis: 1,
    body: 'Sambac jasmine and tuberose at full indolic strength. Unapologetically nocturnal.',
  },
  {
    id: 'citron-de-mer',
    eyebrow: 'Built for heat',
    headline: ['Cold-pressed', 'lemon over', 'salt air'],
    emphasis: 2,
    body: 'Sicilian lemon and yuzu snapping against a mineral accord, settling into sun-bleached driftwood.',
  },
]

const INTERVAL = 6500

export default function HeroSlider({ onShopNow }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  const go = useCallback(
    (next) => setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length),
    [],
  )

  useEffect(() => {
    if (paused || reduced.current) return undefined
    const timer = setInterval(() => setIndex((current) => (current + 1) % SLIDES.length), INTERVAL)
    return () => clearInterval(timer)
  }, [paused, index])

  const slide = SLIDES[index]
  const product = PRODUCTS_BY_ID[slide.id]
  const from = Math.min(...product.sizes.map((s) => s.price))

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="Featured extraits"
      className="relative overflow-hidden bg-noir-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          key={`wash-${index}`}
          className="absolute right-[-12%] top-[-10%] h-[680px] w-[680px] animate-fade-in rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle at center, ${product.palette.via}30, transparent 66%)`,
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-[1560px] items-center gap-10 px-5 py-12 sm:px-9 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div key={`copy-${index}`} className="animate-fade-up">
          <p className="ticket text-oxblood-300">{slide.eyebrow}</p>

          <h1 className="t-display mt-6 text-paper-50">
            {slide.headline.map((line, i) => (
              <span key={line} className="block">
                {i === slide.emphasis ? <em className="font-medium italic">{line}</em> : line}
              </span>
            ))}
          </h1>

          <p className="t-body-noir mt-7 max-w-[30rem]">{slide.body}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button type="button" onClick={onShopNow} className="btn-paper group">
              Shop Now
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </button>
            <span className="ticket text-paper-400">
              {product.name} · from <span className="t-figure text-[15px] text-paper-100">{formatPrice(from)}</span>
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div key={`vial-${index}`} className="animate-fade-in">
            <BottleVisual
              palette={product.palette}
              catalogue={CATALOGUE_NUMBERS[product.id]}
              fillLevel={0.9}
              onDark
              className="h-[240px] w-auto drop-shadow-[0_44px_64px_rgba(0,0,0,0.6)] sm:h-[330px] lg:h-[390px]"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative mx-auto flex max-w-[1560px] items-center justify-between gap-4 px-5 pb-8 sm:px-9">
        <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose a slide">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${PRODUCTS_BY_ID[s.id].name}`}
              onClick={() => setIndex(i)}
              className="grid h-8 w-8 place-items-center"
            >
              <span
                className={classNames(
                  'block h-px transition-all duration-500',
                  i === index ? 'w-8 bg-paper-50' : 'w-4 bg-paper-50/35',
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
            className="grid h-10 w-10 place-items-center border border-paper-50/25 text-paper-200 transition-colors hover:border-paper-50 hover:bg-paper-50 hover:text-noir-950"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
            className="grid h-10 w-10 place-items-center border border-paper-50/25 text-paper-200 transition-colors hover:border-paper-50 hover:bg-paper-50 hover:text-noir-950"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  )
}
