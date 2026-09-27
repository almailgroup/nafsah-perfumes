import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { CATALOGUE_NUMBERS, PRODUCTS_BY_ID } from '../data/products'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatPrice } from '../lib/format'

const SLIDES = [
  {
    id: 'ambre-royale',
    eyebrow: { en: 'The house signature', ar: 'توقيع الدار' },
    headline: { en: ['Scent is the', 'last thing', 'they forget'], ar: ['العطر', 'آخر ما', 'يُنسى'] },
    body: {
      en: 'Saffron and cardamom over labdanum and Madagascan vanilla. Our most worn extrait.',
      ar: 'زعفران وهيل فوق اللادن والفانيلا المدغشقرية. أكثر عطورنا استعمالاً.',
    },
  },
  {
    id: 'nuit-de-jasmin',
    eyebrow: { en: 'New this season', ar: 'جديد هذا الموسم' },
    headline: {
      en: ['Jasmine picked', 'between midnight', 'and dawn'],
      ar: ['ياسمين يُقطف', 'بين منتصف الليل', 'والفجر'],
    },
    body: {
      en: 'Sambac jasmine and tuberose at full strength. Unapologetically nocturnal.',
      ar: 'ياسمين سمبك ومسك الروم بكامل قوتهما. ليليّ بلا اعتذار.',
    },
  },
  {
    id: 'citron-de-mer',
    eyebrow: { en: 'Built for heat', ar: 'صُنع للحرّ' },
    headline: {
      en: ['Cold-pressed', 'lemon over', 'salt air'],
      ar: ['ليمون معصور', 'على البارد فوق', 'هواء مالح'],
    },
    body: {
      en: 'Sicilian lemon and yuzu against a mineral accord, settling into sun-bleached driftwood.',
      ar: 'ليمون صقلي ويوزو على أكورد معدني، يستقرّ في خشب طافٍ أبيضته الشمس.',
    },
  },
]

const INTERVAL = 6500

export default function HeroSlider({ onShopNow }) {
  const { lang, t, isRtl, pick } = useLocale()
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
    const timer = setInterval(() => setIndex((c) => (c + 1) % SLIDES.length), INTERVAL)
    return () => clearInterval(timer)
  }, [paused, index])

  const slide = SLIDES[index]
  const product = PRODUCTS_BY_ID[slide.id]
  const from = Math.min(...product.sizes.map((s) => s.price))
  const Forward = isRtl ? ArrowLeft : ArrowRight

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      className="relative overflow-hidden bg-midnight-950"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          key={`wash-${index}`}
          className="absolute end-[-12%] top-[-10%] h-[680px] w-[680px] animate-fade-in rounded-full blur-[130px]"
          style={{
            background: `radial-gradient(circle at center, ${product.palette.via}38, transparent 66%)`,
          }}
        />
        <div className="mashrabiya-band absolute inset-y-0 end-0 w-1/2" />
      </div>

      <div className="relative mx-auto grid max-w-[1560px] items-center gap-10 px-5 py-12 sm:px-9 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div key={`copy-${index}`} className="animate-fade-up">
          <p className="ticket text-saffron-300">{pick(slide.eyebrow.en, slide.eyebrow.ar)}</p>

          <h1 className="t-display mt-6">
            {pick(slide.headline.en, slide.headline.ar).map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <p className="t-body mt-7 max-w-[32rem]">{pick(slide.body.en, slide.body.ar)}</p>

          <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            <button type="button" onClick={onShopNow} className="btn-pearl group">
              {t('shopNow')}
              <Forward
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                strokeWidth={1.5}
              />
            </button>
            <span className="ticket text-pearl-300">
              {pick(product.name, product.ar.name)} · {t('from')}{' '}
              <span className="t-figure text-[15px] text-pearl-50">{formatPrice(from, lang)}</span>
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div key={`vial-${index}`} className="animate-fade-in">
            <BottleVisual
              palette={product.palette}
              catalogue={CATALOGUE_NUMBERS[product.id]}
              fillLevel={0.9}
              className="h-[240px] w-auto drop-shadow-[0_44px_64px_rgba(0,0,0,0.65)] sm:h-[330px] lg:h-[390px]"
            />
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1560px] items-center justify-between gap-4 px-5 pb-8 sm:px-9">
        <div className="flex items-center gap-2.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`${i + 1} — ${pick(PRODUCTS_BY_ID[s.id].name, PRODUCTS_BY_ID[s.id].ar.name)}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className="grid h-8 w-8 place-items-center"
            >
              <span
                className={classNames(
                  'block h-px transition-all duration-500',
                  i === index ? 'w-8 bg-jade-300' : 'w-4 bg-pearl-50/30',
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label={t('prevSlide')}
            className="grid h-10 w-10 place-items-center border border-pearl-50/25 text-pearl-200 transition-colors hover:border-jade-400 hover:bg-jade-600 hover:text-pearl-50"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label={t('nextSlide')}
            className="grid h-10 w-10 place-items-center border border-pearl-50/25 text-pearl-200 transition-colors hover:border-jade-400 hover:bg-jade-600 hover:text-pearl-50"
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  )
}
