import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import LayeringGuide from './LayeringGuide'
import Meter from './Meter'
import OlfactoryPyramid from './OlfactoryPyramid'
import ProductFacts from './ProductFacts'
import ScentProfile from './ScentProfile'
import { familyShares, isAllYear, layeringPairs } from './derive'
import { PRODUCTS, PRODUCTS_BY_ID } from '../../data/products'
import { LocaleContext, translate, translateCount, translateValue } from '../../i18n/locale-context'

function render(lang, element) {
  const value = {
    lang,
    isRtl: lang === 'ar',
    t: (key, vars) => translate(lang, key, vars),
    tc: (key, count, vars) => translateCount(lang, key, count, vars),
    tr: (v) => translateValue(lang, v),
  }
  return renderToStaticMarkup(<LocaleContext.Provider value={value}>{element}</LocaleContext.Provider>)
}

// Visible text only: tags (and their attributes, inline widths included) dropped.
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const tags = (html, pattern) => [...html.matchAll(pattern)].map(([tag]) => tag)
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1]

const oudNoir = PRODUCTS_BY_ID['oud-noir']
const wardTaifi = PRODUCTS_BY_ID['ward-taifi']

describe('derive', () => {
  it('orders family shares largest first, the product’s own family leading a tie', () => {
    expect(familyShares(oudNoir).map((row) => row.id)).toEqual(['oud-musk', 'amber', 'rose'])
    // Ward Taifi is 50/50 rose and bukhoor-oils; its plate says Bukhoor & Oils.
    expect(familyShares(wardTaifi).map((row) => row.id)).toEqual(['bukhoor-oils', 'rose'])
    for (const product of PRODUCTS) {
      expect(familyShares(product)[0].id).toBe(product.family)
      expect(familyShares(product).reduce((sum, row) => sum + row.share, 0)).toBe(100)
    }
  })

  it('reads two seasons as all year', () => {
    expect(isAllYear(PRODUCTS_BY_ID['dehn-al-oud'])).toBe(true)
    expect(isAllYear(oudNoir)).toBe(false)
  })

  it('puts layers in the order they go on and resolves catalogue partners', () => {
    const citron = layeringPairs(PRODUCTS_BY_ID['citron-de-mer'])
    expect(citron.map((pair) => pair.kind)).toEqual(['bukhoor', 'spray'])
    expect(citron[1].partner.id).toBe('musc-blanc')
    for (const product of PRODUCTS) {
      const pairs = layeringPairs(product)
      expect(pairs.length).toBe(product.layering.length)
      for (const pair of pairs) if (pair.productId) expect(pair.partner?.id).toBe(pair.productId)
    }
  })

  it('drops a pairing whose partner is no longer in the catalogue', () => {
    const product = { layering: [{ kind: 'spray', productId: 'retired', how: { en: '' } }] }
    expect(layeringPairs(product)).toEqual([])
  })
})

describe('Meter', () => {
  it('is a labelled meter whose value text is shown once to the eye and once to assistive tech', () => {
    const html = render('en', <Meter label="Heat" value={4} max={5} segments={5} valueText="4/5 · Warm" />)
    const [meter] = tags(html, /<div[^>]*role="meter"[^>]*>/g)
    expect(attr(meter, 'aria-valuemin')).toBe('0')
    expect(attr(meter, 'aria-valuemax')).toBe('5')
    expect(attr(meter, 'aria-valuenow')).toBe('4')
    expect(attr(meter, 'aria-valuetext')).toBe('4/5 · Warm')
    expect(html).toContain(`id="${attr(meter, 'aria-labelledby')}"`)
    expect(text(html)).toBe('Heat 4/5 · Warm')
    expect(tags(html, /<span class="h-2 bg-green-600"/g)).toHaveLength(4)
    expect(tags(html, /<span class="h-2 bg-green-600\/10"/g)).toHaveLength(1)
  })

  it('clamps a value outside its range', () => {
    const html = render('en', <Meter label="Longevity" value={30} max={24} valueText="30 h" />)
    expect(attr(tags(html, /<div[^>]*role="meter"[^>]*>/g)[0], 'aria-valuenow')).toBe('24')
  })
})

describe('OlfactoryPyramid', () => {
  it('is an ordered list of three tiers, top to base, each with its own list of notes', () => {
    const html = render('en', <OlfactoryPyramid product={oudNoir} labelledBy="h" />)
    expect(html.startsWith('<ol aria-labelledby="h"')).toBe(true)
    expect(text(html)).toBe(
      'Top notes First 15 minutes Bergamot Pink Pepper ' +
        'Heart notes Hours 1–4 Cambodi Oud Damask Rose ' +
        'Base notes The dry-down, from hour 4 Sandalwood Leather Vetiver',
    )
    expect(tags(html, /<ul aria-labelledby="[^"]+"/g)).toHaveLength(3)
  })

  it('narrows to the top: each tier is wider than the one above', () => {
    const widths = tags(render('en', <OlfactoryPyramid product={oudNoir} />), /<li class="relative" style="width:([\d.]+)%"/g)
      .map((tag) => Number(tag.match(/width:([\d.]+)%/)[1]))
    expect(widths).toHaveLength(3)
    expect(widths[0]).toBeLessThan(widths[1])
    expect(widths[1]).toBeLessThan(widths[2])
    expect(widths[2]).toBe(100)
  })

  it('writes Arabic notes and timings in Arabic-Indic digits', () => {
    const shown = text(render('ar', <OlfactoryPyramid product={oudNoir} />))
    expect(shown).toContain('النفحات العليا أول ١٥ دقيقة برغموت')
    expect(shown).toContain('عود كمبودي')
    expect(shown).not.toMatch(/[0-9]/)
  })
})

describe('ProductFacts', () => {
  it('follows the chosen format: a quarter tola of a spray is an attar', () => {
    expect(text(render('en', <ProductFacts product={oudNoir} formatId="full" />))).toBe(
      'At a glance Concentration Extrait de Parfum 20–30% perfume oil Gender Unisex Longevity 12 h · Very long Projection Strong',
    )
    expect(text(render('en', <ProductFacts product={oudNoir} formatId="quarter-tola" />))).toContain(
      'Concentration Perfume Oil · Attar Pure oil, alcohol-free',
    )
  })

  it('has no Latin digits in Arabic', () => {
    const shown = text(render('ar', <ProductFacts product={oudNoir} formatId="full" />))
    expect(shown).toContain('زيوت عطرية بنسبة ٢٠–٣٠٪')
    expect(shown).toContain('١٢ ساعة · ثبات طويل جداً')
    expect(shown).not.toMatch(/[0-9]/)
  })
})

describe('ScentProfile', () => {
  it('draws heat, longevity and projection as meters with their values written out', () => {
    const html = render('en', <ScentProfile product={oudNoir} />)
    const meters = tags(html, /<div[^>]*role="meter"[^>]*>/g)
    expect(meters.map((tag) => [attr(tag, 'aria-valuenow'), attr(tag, 'aria-valuemax'), attr(tag, 'aria-valuetext')])).toEqual([
      ['3', '5', '3/5 · Holds up in mild heat'],
      ['12', '24', '12 h · Very long'],
      ['3', '4', '3/4 · Strong'],
    ])
    const shown = text(html)
    expect(shown).toContain('Oud & Musk 60% Amber 20% Rose & Florals 20%')
    expect(shown).toContain('3/5 · Holds up in mild heat')
    expect(shown).toContain('Season Winter nights Occasions Diwaniya · Weddings & occasions')
  })

  it('gives every bar its share as a width, one hue, rounded at the data end only', () => {
    const html = render('en', <ScentProfile product={oudNoir} />)
    const bars = tags(html, /<span aria-hidden="true" class="[^"]*rounded-e-\[4px\] bg-green-600" style="width:\d+%"/g)
    expect(bars.map((tag) => tag.match(/width:(\d+)%/)[1])).toEqual(['60', '20', '20'])
  })

  it('reads in Arabic with Arabic-Indic digits throughout', () => {
    const shown = text(render('ar', <ScentProfile product={PRODUCTS_BY_ID['dehn-al-oud']} />))
    expect(shown).toContain('١٨ ساعة · يدوم نهاراً وليلاً')
    expect(shown).toContain('طوال العام')
    expect(shown).not.toMatch(/[0-9]/)
  })
})

describe('LayeringGuide', () => {
  it('names each partner and links only the catalogue ones', () => {
    const html = render('en', <LayeringGuide product={oudNoir} onOpenProduct={() => {}} />)
    const shown = text(html)
    expect(shown).toContain('Bukhoor Oud bukhoor')
    expect(shown).toContain('Perfume oil Ward Taifi')
    expect(shown).toContain('Spray Musc Blanc')
    expect(tags(html, /<button[^>]*>/g).map((tag) => attr(tag, 'aria-label'))).toEqual([
      'View Ward Taifi',
      'View Musc Blanc',
    ])
  })

  it('shows no links without a way to open a product', () => {
    expect(render('en', <LayeringGuide product={oudNoir} />)).not.toContain('<button')
  })

  it('reads in Arabic', () => {
    const html = render('ar', <LayeringGuide product={oudNoir} onOpenProduct={() => {}} />)
    expect(text(html)).toContain('دهن عطري ورد طائفي')
    expect(tags(html, /<button[^>]*>/g).map((tag) => attr(tag, 'aria-label'))).toEqual([
      'عرض ورد طائفي',
      'عرض المسك الأبيض',
    ])
  })
})
