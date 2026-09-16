import { ArrowRight } from 'lucide-react'
import BottleVisual from './BottleVisual'
import { CATALOGUE_NUMBERS, PRODUCTS_BY_ID } from '../data/products'

const HERO_FRAGRANCE = PRODUCTS_BY_ID['ambre-royale']

/**
 * The one full-noir surface above the fold. Cormorant is set at 44-100px here,
 * well above the size where its hairlines survive being reversed out; every
 * small string on this section is Jost.
 */
export default function Hero({ onShopNow }) {
  return (
    <section id="top" className="relative overflow-hidden bg-noir-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute right-[-12%] top-[-8%] h-[720px] w-[720px] rounded-full blur-[120px]"
          style={{
            background: `radial-gradient(circle at center, ${HERO_FRAGRANCE.palette.via}2e, transparent 66%)`,
          }}
        />
        <div className="absolute -left-52 bottom-0 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle_at_center,rgba(196,185,163,0.08),transparent_66%)] blur-[100px]" />
      </div>

      <div className="relative mx-auto grid max-w-[1560px] items-center gap-12 px-5 pb-20 pt-28 sm:px-9 sm:pb-24 sm:pt-36 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-28 lg:pt-40">
        <div className="animate-fade-up">
          <p className="t-label text-oxblood-300">Maison de Parfum — Grasse, 1974</p>

          <h1 className="t-display mt-7 text-paper-50">
            Scent is the
            <br />
            last thing
            <br />
            they <em className="font-medium italic">forget</em>
          </h1>

          <p className="t-body-noir mt-9 max-w-[30rem]">
            Twelve extraits, composed in small batches from oud, saffron, neroli and Damask rose.
            Aged in oak, decanted by hand, never reformulated for volume.
          </p>

          <div className="mt-11 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={onShopNow} className="btn-paper group">
              View the Catalogue
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </button>
            <a
              href="#house"
              className="inline-flex items-center justify-center gap-2.5 border border-paper-50/25 px-8 py-3.5 font-sans text-[11px] uppercase tracking-label text-paper-100 transition-colors duration-300 hover:border-paper-50 hover:bg-paper-50 hover:text-noir-950"
            >
              Our Craft
            </a>
          </div>
        </div>

        {/* Featured vial, presented as a catalogue plate */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="animate-float">
            <BottleVisual
              palette={HERO_FRAGRANCE.palette}
              catalogue={CATALOGUE_NUMBERS[HERO_FRAGRANCE.id]}
              fillLevel={0.9}
              onDark
              className="h-[320px] w-auto drop-shadow-[0_44px_64px_rgba(0,0,0,0.6)] sm:h-[440px] lg:h-[520px]"
            />
          </div>

          <figure className="absolute bottom-0 left-0 max-w-[17rem] border-l border-paper-50/25 pl-5 sm:bottom-6">
            <figcaption>
              <span className="ticket block text-oxblood-300">
                No. {CATALOGUE_NUMBERS[HERO_FRAGRANCE.id]}
              </span>
              <span className="mt-2 block font-display text-[26px] font-medium leading-tight text-paper-50">
                {HERO_FRAGRANCE.name}
              </span>
              <span className="t-label mt-2 block text-paper-400">
                Saffron · Labdanum · Vanilla
              </span>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Running header of the house's raw materials, set as a ruled ticker */}
      <div className="relative border-t border-paper-50/15">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-y-3 px-5 py-5 sm:px-9">
          {['38 raw materials', 'Extrait concentration', 'Macerated four weeks', 'Never reformulated'].map(
            (item) => (
              <span key={item} className="t-label text-paper-400">
                {item}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
