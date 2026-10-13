import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { CATALOGUE_NUMBERS, fromPriceFils, PRODUCTS_BY_ID } from '../data/products'
import { CONCENTRATION_BY_ID } from '../data/taxonomy'
import { useLocale } from '../i18n/locale-context'
import { classNames, formatNumber, formatPrice } from '../lib/format'
import { Link } from '../router/RouterProvider'
import { SCENT_FINDER } from '../router/router-context'

/*
 * Each slide is a fragrance and a copy key. Its eyebrow, three-line headline
 * and body live in the dictionary as `${copy}Eyebrow`, `${copy}Headline` and
 * `${copy}Body`, beside every other claim the house makes. A slide whose
 * fragrance has left the catalogue is dropped rather than taking the hero down.
 */
const SLIDES = [
  { id: 'ambre-royale', copy: 'heroSignature', finder: true },
  { id: 'ward-taifi', copy: 'heroOil' },
  { id: 'citron-de-mer', copy: 'heroHeat' },
].filter((slide) => PRODUCTS_BY_ID[slide.id])

const INTERVAL = 6500

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)

/**
 * The homepage carousel. It turns on its own only while nobody is using it:
 * hover or focus anywhere inside holds it, the pause control stops it for
 * good, and a visitor who prefers reduced motion starts with it stopped.
 * Slides changed by hand are announced; slides that turn on their own are not.
 */
export default function HeroSlider({ onShopNow }) {
  const { lang, t, isRtl, tr } = useLocale()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(() => !prefersReducedMotion())
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const rotating = playing && !hovered && !focused && SLIDES.length > 1

  const go = useCallback(
    (next) => setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length),
    [],
  )

  useEffect(() => {
    if (!rotating) return undefined
    const timer = setInterval(() => setIndex((c) => (c + 1) % SLIDES.length), INTERVAL)
    return () => clearInterval(timer)
  }, [rotating, index])

  if (!SLIDES.length) return null

  const slide = SLIDES[index]
  const product = PRODUCTS_BY_ID[slide.id]
  const name = tr(product.name)
  const Forward = isRtl ? ArrowLeft : ArrowRight
  const controlClass =
    'grid h-10 w-10 place-items-center border border-snow-200 text-ink-950 transition-colors duration-300 hover:border-green-600 hover:bg-green-600 hover:text-snow-50'

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label={t('heroLabel')}
      className="relative overflow-hidden bg-snow-50"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          key={`wash-${index}`}
          className="absolute end-[-12%] top-[-10%] h-[680px] w-[680px] animate-fade-in rounded-full blur-[130px]"
          style={{
            background: `radial-gradient(circle at center, ${product.palette.via}1c, transparent 70%)`,
          }}
        />
        <div className="mashrabiya-band absolute inset-y-0 end-0 w-1/2" />
      </div>

      <div aria-live={rotating ? 'off' : 'polite'}>
        <div
          role="group"
          aria-roledescription="slide"
          aria-label={t('heroSlide', {
            index: formatNumber(index + 1, lang),
            total: formatNumber(SLIDES.length, lang),
            name,
          })}
          className="relative mx-auto grid max-w-[1560px] items-center gap-10 px-5 py-12 sm:px-9 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20"
        >
          <div key={`copy-${index}`} className="animate-fade-up">
            <p className="ticket text-green-600">{t(`${slide.copy}Eyebrow`)}</p>

            <h1 className="t-display mt-6">
              {t(`${slide.copy}Headline`).map((line, lineIndex) => (
                <span key={line} className="block">
                  {/* Invisible at the start of a block, but keeps the words apart in search snippets */}
                  {lineIndex > 0 && ' '}
                  {line}
                </span>
              ))}
            </h1>

            <p className="t-body mt-7 max-w-[32rem]">{t(`${slide.copy}Body`)}</p>

            {/* Stacked full width on a phone, where two buttons side by side
                would wrap unevenly; side by side from sm up. The ink border
                matches the outline button's height exactly. */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button type="button" onClick={onShopNow} className="btn-ink group border border-ink-950 hover:border-green-700">
                {t('shopNow')}
                <Forward
                  aria-hidden="true"
                  className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  strokeWidth={1.5}
                />
              </button>
              {slide.finder && (
                <Link to={SCENT_FINDER} className="btn-outline">
                  {t('heroFinder')}
                </Link>
              )}
            </div>

            <p className="ticket mt-6 text-snow-600">
              {name} · {t('from')}{' '}
              <span className="t-figure text-[15px] text-ink-950">{formatPrice(fromPriceFils(product), lang)}</span>
            </p>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end">
            <div key={`vial-${index}`} className="animate-fade-in">
              <BottleVisual
                palette={product.palette}
                catalogue={CATALOGUE_NUMBERS[product.id]}
                label={CONCENTRATION_BY_ID[product.concentration]?.abbr}
                fillLevel={0.9}
                className="h-[240px] w-auto drop-shadow-[0_44px_64px_rgba(0,0,0,0.65)] sm:h-[330px] lg:h-[390px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1560px] items-center justify-between gap-4 px-5 pb-8 sm:px-9">
        <div className="flex items-center gap-2.5">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={t('heroDot', { index: formatNumber(i + 1, lang), name: tr(PRODUCTS_BY_ID[s.id].name) })}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => setIndex(i)}
              className="group grid h-8 w-8 place-items-center"
            >
              <span
                className={classNames(
                  'block h-px transition-all duration-500',
                  i === index ? 'w-8 bg-green-600' : 'w-4 bg-snow-300 group-hover:bg-snow-600',
                )}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? t('heroPause') : t('heroPlay')}
            className={controlClass}
          >
            {playing ? (
              <Pause aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
            ) : (
              <Play aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
          </button>
          <button type="button" onClick={() => go(index - 1)} aria-label={t('prevSlide')} className={controlClass}>
            <ChevronLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" strokeWidth={1.5} />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label={t('nextSlide')} className={controlClass}>
            <ChevronRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </section>
  )
}
