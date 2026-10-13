import { describe, expect, it } from 'vitest'
import { GIFT_BOXES, GIFT_BOX_BY_ID, GIFT_MESSAGE_MAX } from './gifting'
import { NOTES, NOTE_LIST } from './notes'
import {
  CATALOGUE_NUMBERS,
  PRICE_BOUNDS,
  PRODUCTS,
  PRODUCTS_BY_ID,
  allNotes,
  bottleFormats,
  concentrationFor,
  formatOf,
  fromPriceFils,
} from './products'
import { validateCatalogue, validateProduct } from './schema'
import { filterProducts } from '../lib/catalogue'
import {
  CONCENTRATIONS,
  CONCENTRATION_BY_ID,
  FAMILIES,
  FAMILY_BY_ID,
  FORMATS,
  FORMAT_BY_ID,
  GENDERS,
  GENDER_BY_ID,
  HEAT_SCALE,
  LAYERING_KINDS,
  LAYERING_KIND_BY_ID,
  LONGEVITY_BANDS,
  OCCASIONS,
  OCCASION_BY_ID,
  SEASONS,
  SEASON_BY_ID,
  SILLAGE,
  SILLAGE_BY_ID,
  longevityBand,
} from './taxonomy'

const ARABIC = /[ء-ي]/

const ORIGINAL_TWELVE = [
  'oud-noir',
  'rose-imperiale',
  'citron-de-mer',
  'ambre-royale',
  'santal-blanc',
  'nuit-de-jasmin',
  'bergamote-dor',
  'safran-imperial',
  'cedre-fume',
  'fleur-de-neroli',
  'musc-blanc',
  'vetiver-noir',
]

/** A deep copy of a real product, to break one thing at a time. */
const copyOf = (id) => {
  const product = PRODUCTS_BY_ID[id]
  return {
    ...product,
    familyProfile: { ...product.familyProfile },
    layering: product.layering.map((pairing) => ({ ...pairing })),
    formats: product.formats.map((entry) => ({ ...entry })),
  }
}

describe('catalogue', () => {
  it('passes the schema', () => {
    expect(validateCatalogue(PRODUCTS)).toEqual([])
  })

  it('has the twelve originals in order, then the three new fragrances', () => {
    expect(PRODUCTS.map((p) => p.id)).toEqual([
      ...ORIGINAL_TWELVE,
      'qahwa',
      'dehn-al-oud',
      'ward-taifi',
    ])
  })

  it('keeps catalogue numbers 01–12 for the original twelve', () => {
    ORIGINAL_TWELVE.forEach((id, index) => {
      expect(CATALOGUE_NUMBERS[id]).toBe(String(index + 1).padStart(2, '0'))
    })
    expect(CATALOGUE_NUMBERS.qahwa).toBe('13')
    expect(CATALOGUE_NUMBERS['dehn-al-oud']).toBe('14')
    expect(CATALOGUE_NUMBERS['ward-taifi']).toBe('15')
    expect(new Set(Object.values(CATALOGUE_NUMBERS)).size).toBe(PRODUCTS.length)
  })

  it('gives every family at least one fragrance as its primary family', () => {
    for (const family of FAMILIES) {
      expect(PRODUCTS.some((p) => p.family === family.id), family.id).toBe(true)
    }
  })

  it('carries the notes the brief names, spelled its way', () => {
    expect(NOTES['taif-rose'].en).toBe('Taif Rose')
    expect(NOTES['cambodi-oud'].en).toBe('Cambodi Oud')
    expect(NOTES.vanilla.en).toBe('Vanilla')
    expect(NOTES['madagascan-vanilla'].en).toBe('Madagascan Vanilla')
    expect(NOTES.saffron.en).toBe('Saffron')
    const used = new Set(PRODUCTS.flatMap((p) => allNotes(p).map((note) => note.id)))
    for (const id of ['taif-rose', 'cambodi-oud', 'saffron', 'vanilla', 'madagascan-vanilla']) {
      expect(used.has(id), id).toBe(true)
    }
  })

  it('never carries invented ratings or review counts', () => {
    for (const product of PRODUCTS) {
      expect(product).not.toHaveProperty('rating')
      expect(product).not.toHaveProperty('reviews')
    }
  })

  it('suggests two or three layering pairings for every fragrance', () => {
    for (const product of PRODUCTS) {
      expect(product.layering.length, product.id).toBeGreaterThanOrEqual(2)
      expect(product.layering.length, product.id).toBeLessThanOrEqual(3)
    }
  })

  it('layers the house way: oil on the pulse points first, the spray over it', () => {
    for (const product of PRODUCTS) {
      for (const pairing of product.layering) {
        expect(pairing.how.en, product.id).not.toMatch(/\bspray\b[^.]*\bfirst\b/i)
        expect(pairing.how.en, product.id).not.toMatch(/first and add/i)
        expect(pairing.how.en, product.id).not.toMatch(/\boil over it\b/i)
      }
    }
  })

  it('gives every fragrance its own palette', () => {
    const palettes = PRODUCTS.map((p) => JSON.stringify(p.palette))
    expect(new Set(palettes).size).toBe(PRODUCTS.length)
  })

  it('keeps the prices of the original twelve, in fils', () => {
    expect(formatOf(PRODUCTS_BY_ID['oud-noir'], 'full').priceFils).toBe(119000)
    expect(formatOf(PRODUCTS_BY_ID['oud-noir'], 'spray50').priceFils).toBe(75000)
    expect(formatOf(PRODUCTS_BY_ID['citron-de-mer'], 'spray50').priceFils).toBe(49500)
    expect(formatOf(PRODUCTS_BY_ID['ambre-royale'], 'full').priceFils).toBe(135000)
  })
})

describe('derived exports and helpers', () => {
  it('indexes every product by id', () => {
    expect(Object.keys(PRODUCTS_BY_ID)).toEqual(PRODUCTS.map((p) => p.id))
    for (const product of PRODUCTS) expect(PRODUCTS_BY_ID[product.id]).toBe(product)
  })

  it('bounds prices over bottles and oils only, rounded out to whole dinars', () => {
    const { minFils, maxFils } = PRICE_BOUNDS
    const bottlePrices = PRODUCTS.flatMap((p) => bottleFormats(p).map((f) => f.priceFils))
    const samplePrices = PRODUCTS.map((p) => formatOf(p, 'sample').priceFils)

    expect(Number.isInteger(minFils)).toBe(true)
    expect(Number.isInteger(maxFils)).toBe(true)
    expect(minFils % 1000).toBe(0)
    expect(maxFils % 1000).toBe(0)
    expect(minFils).toBeLessThan(maxFils)
    expect(minFils).toBeLessThanOrEqual(Math.min(...bottlePrices))
    expect(Math.min(...bottlePrices) - minFils).toBeLessThan(1000)
    expect(maxFils).toBeGreaterThanOrEqual(Math.max(...bottlePrices))
    expect(maxFils - Math.max(...bottlePrices)).toBeLessThan(1000)
    expect(minFils).toBeGreaterThan(Math.max(...samplePrices))
  })

  it('separates bottles from the sample', () => {
    const oudNoir = PRODUCTS_BY_ID['oud-noir']
    expect(bottleFormats(oudNoir).map((f) => f.id)).toEqual(['full', 'spray50', 'quarter-tola'])
    expect(fromPriceFils(oudNoir)).toBe(29000)
    expect(fromPriceFils(PRODUCTS_BY_ID['rose-imperiale'])).toBe(65000)
    expect(fromPriceFils(PRODUCTS_BY_ID['dehn-al-oud'])).toBe(35000)
  })

  it('looks up a format, or returns null', () => {
    expect(formatOf(PRODUCTS_BY_ID['ward-taifi'], 'tola')).toEqual({ id: 'tola', ml: 12, priceFils: 85000 })
    expect(formatOf(PRODUCTS_BY_ID['ward-taifi'], 'full')).toBeNull()
  })

  it('treats every oil format as attar', () => {
    const oudNoir = PRODUCTS_BY_ID['oud-noir']
    expect(concentrationFor(oudNoir, 'full')).toBe('extrait')
    expect(concentrationFor(oudNoir, 'sample')).toBe('extrait')
    expect(concentrationFor(oudNoir, 'quarter-tola')).toBe('attar')
    expect(concentrationFor(PRODUCTS_BY_ID.qahwa, 'spray50')).toBe('edp')
    expect(concentrationFor(PRODUCTS_BY_ID['dehn-al-oud'], 'tola')).toBe('attar')
  })

  it('lists all notes in pyramid order', () => {
    const qahwa = PRODUCTS_BY_ID.qahwa
    expect(allNotes(qahwa)).toEqual([...qahwa.topNotes, ...qahwa.heartNotes, ...qahwa.baseNotes])
  })
})

describe('taxonomy', () => {
  it('has the formats of the contract, in display order', () => {
    expect(FORMATS.map((f) => f.id)).toEqual(['full', 'spray50', 'tola', 'quarter-tola', 'sample'])
    expect(FORMATS.map((f) => f.kind)).toEqual(['spray', 'spray', 'oil', 'oil', 'sample'])
    expect(FORMATS.map((f) => f.tryFirst)).toEqual([true, true, true, false, false])
    expect(FORMATS.map((f) => f.ml)).toEqual([100, 50, 12, 3, 2])
  })

  it('has the families, concentrations and scales of the contract', () => {
    expect(FAMILIES.map((f) => f.id)).toEqual([
      'oud-musk',
      'amber',
      'rose',
      'french-arabic',
      'bukhoor-oils',
      'gourmand',
      'fresh-aquatic',
    ])
    expect(CONCENTRATIONS.map((c) => c.id)).toEqual(['extrait', 'edp', 'edt', 'attar'])
    expect(SILLAGE.map((s) => [s.id, s.level])).toEqual([
      ['intimate', 1],
      ['moderate', 2],
      ['strong', 3],
      ['beast', 4],
    ])
    expect(GENDERS.map((g) => g.id)).toEqual(['unisex', 'men', 'women'])
    expect(SEASONS.map((s) => s.id)).toEqual(['summer', 'winter'])
    expect(OCCASIONS.map((o) => o.id)).toEqual(['diwaniya', 'office', 'wedding', 'everyday'])
    expect(HEAT_SCALE.map((h) => h.value)).toEqual([1, 2, 3, 4, 5])
  })

  it('labels every entry in both languages', () => {
    const lists = [FAMILIES, CONCENTRATIONS, SILLAGE, GENDERS, SEASONS, OCCASIONS, FORMATS, HEAT_SCALE, LONGEVITY_BANDS, LAYERING_KINDS]
    for (const entry of lists.flat()) {
      expect(entry.en.trim()).not.toBe('')
      expect(entry.ar, entry.en).toMatch(ARABIC)
    }
    for (const family of FAMILIES) {
      expect(family.short.ar).toMatch(ARABIC)
      expect(family.blurb.en.trim()).not.toBe('')
      expect(family.blurb.ar).toMatch(ARABIC)
    }
    expect(FAMILY_BY_ID['fresh-aquatic'].short).toEqual({ en: 'Fresh & Aquatic', ar: 'منعش ومائي' })
  })

  it('builds complete byId maps', () => {
    const pairs = [
      [FAMILIES, FAMILY_BY_ID],
      [CONCENTRATIONS, CONCENTRATION_BY_ID],
      [SILLAGE, SILLAGE_BY_ID],
      [GENDERS, GENDER_BY_ID],
      [FORMATS, FORMAT_BY_ID],
      [OCCASIONS, OCCASION_BY_ID],
      [SEASONS, SEASON_BY_ID],
      [LAYERING_KINDS, LAYERING_KIND_BY_ID],
      [GIFT_BOXES, GIFT_BOX_BY_ID],
    ]
    for (const [list, map] of pairs) {
      expect(Object.keys(map)).toEqual(list.map((x) => x.id))
      for (const entry of list) expect(map[entry.id]).toBe(entry)
    }
  })

  it('bands longevity by hours', () => {
    expect(longevityBand(1).en).toBe('Moderate')
    expect(longevityBand(5).en).toBe('Moderate')
    expect(longevityBand(6).en).toBe('Long-lasting')
    expect(longevityBand(9).en).toBe('Long-lasting')
    expect(longevityBand(14).en).toBe('Very long')
    expect(longevityBand(18).en).toBe('All day and night')
    expect(longevityBand(24)).toBe(LONGEVITY_BANDS.at(-1))
  })
})

describe('notes', () => {
  it('includes every note the contract requires', () => {
    const required = [
      'taif-rose', 'damask-rose', 'cambodi-oud', 'hindi-oud', 'saffron', 'vanilla',
      'madagascan-vanilla', 'cardamom', 'arabic-coffee', 'dates', 'amber', 'ambergris',
      'ambroxan', 'labdanum', 'frankincense', 'sandalwood', 'mysore-sandalwood', 'white-musk',
      'musk', 'jasmine-sambac', 'neroli', 'orange-blossom', 'bergamot', 'sea-salt',
      'marine-accord', 'leather', 'vetiver', 'tobacco', 'patchouli', 'tonka', 'benzoin',
      'cedar', 'pink-pepper', 'iris', 'rose-absolute',
    ]
    for (const id of required) expect(NOTES[id], id).toBeDefined()
  })

  it('keys every note by its own id', () => {
    for (const [key, note] of Object.entries(NOTES)) expect(note.id).toBe(key)
  })

  it('gives every note one distinct name per language', () => {
    const en = NOTE_LIST.map((n) => n.en)
    const ar = NOTE_LIST.map((n) => n.ar)
    expect(new Set(en).size).toBe(en.length)
    expect(new Set(ar).size).toBe(ar.length)
    for (const note of NOTE_LIST) expect(note.ar, note.id).toMatch(ARABIC)
  })

  it('keeps amber and ambergris apart', () => {
    expect(NOTES.amber.ar).toBe('عنبر')
    expect(NOTES.ambergris.ar).toBe('عنبر رمادي')
    expect(NOTES.driftwood.ar).toBe('الخشب الطافي')
  })

  it('finds the oud fragrances under the other spellings of oud', () => {
    for (const query of ['oudh', 'aoud', 'agarwood', 'agar']) {
      const ids = filterProducts(PRODUCTS, { query }).map((p) => p.id)
      expect(ids, query).toEqual(expect.arrayContaining(['oud-noir', 'qahwa', 'dehn-al-oud']))
    }
  })

  it('lists every note A–Z by English name', () => {
    expect(NOTE_LIST).toHaveLength(Object.keys(NOTES).length)
    const names = NOTE_LIST.map((n) => n.en)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en')))
  })
})

describe('gifting', () => {
  it('offers the three boxes of the contract', () => {
    expect(GIFT_BOXES.map((b) => [b.id, b.priceFils])).toEqual([
      ['signature', 0],
      ['sadu', 4500],
      ['majlis', 12000],
    ])
    for (const box of GIFT_BOXES) {
      expect(box.ar).toMatch(ARABIC)
      expect(box.blurb.en.trim()).not.toBe('')
      expect(box.blurb.ar).toMatch(ARABIC)
    }
    expect(GIFT_MESSAGE_MAX).toBe(200)
  })
})

describe('schema', () => {
  it('accepts a real product on its own', () => {
    expect(validateProduct(PRODUCTS_BY_ID['ward-taifi'])).toEqual([])
  })

  it('rejects a family mix that does not add up', () => {
    const product = copyOf('oud-noir')
    product.familyProfile.rose = 10
    expect(validateProduct(product)).toContain('oud-noir: familyProfile must add up to 100 (adds up to 90)')
  })

  it('rejects a primary family that is not the largest share', () => {
    const product = copyOf('oud-noir')
    product.family = 'rose'
    expect(validateProduct(product)).toContain('oud-noir: family "rose" must be the largest share of familyProfile')
  })

  it('rejects invented ratings', () => {
    const product = { ...copyOf('musc-blanc'), rating: 4.8, reviews: 132 }
    const errors = validateProduct(product)
    expect(errors.some((e) => e.includes('rating'))).toBe(true)
    expect(errors.some((e) => e.includes('review count'))).toBe(true)
  })

  it('rejects Arabic fields that are not in Arabic', () => {
    const product = { ...copyOf('qahwa'), tagline: { en: 'Coffee', ar: 'Coffee' } }
    expect(validateProduct(product)).toContain('qahwa: tagline.ar must be written in Arabic')
  })

  it('rejects unknown enum values and out-of-range meters', () => {
    const product = { ...copyOf('qahwa'), projectionSillage: 'loud', heatResistance: 6, longevity: 30 }
    const errors = validateProduct(product)
    expect(errors.some((e) => e.startsWith('qahwa: projectionSillage "loud"'))).toBe(true)
    expect(errors.some((e) => e.startsWith('qahwa: heatResistance'))).toBe(true)
    expect(errors.some((e) => e.startsWith('qahwa: longevity'))).toBe(true)
  })

  it('rejects notes that are not dictionary entries', () => {
    const product = { ...copyOf('qahwa'), topNotes: [{ id: 'saffron', en: 'Saffron', ar: 'زعفران' }] }
    expect(validateProduct(product).some((e) => e.includes('topNotes[0]'))).toBe(true)
  })

  it('rejects an attar sold as a spray, and a missing sample', () => {
    const product = copyOf('dehn-al-oud')
    product.formats = [{ id: 'full', ml: 100, priceFils: 150000 }]
    const errors = validateProduct(product)
    expect(errors).toContain('dehn-al-oud: an attar is sold as oil only, not as full')
    expect(errors).toContain('dehn-al-oud: formats must include a 2 ml sample')
  })

  it('rejects prices that are not whole fils', () => {
    const product = copyOf('citron-de-mer')
    product.formats[0].priceFils = 79.5
    expect(validateProduct(product).some((e) => e.includes('priceFils'))).toBe(true)
  })

  it('rejects layering with itself or with a fragrance that does not exist', () => {
    const product = copyOf('musc-blanc')
    product.layering[0].productId = 'musc-blanc'
    product.layering[1].productId = 'nowhere'
    const errors = validateCatalogue(PRODUCTS.map((p) => (p.id === 'musc-blanc' ? product : p)))
    expect(errors.some((e) => e.includes('pairs the fragrance with itself'))).toBe(true)
    expect(errors.some((e) => e.includes('"nowhere" is not in the catalogue'))).toBe(true)
  })

  it('rejects duplicate ids', () => {
    const errors = validateCatalogue([...PRODUCTS, PRODUCTS[0]])
    expect(errors.some((e) => e.startsWith('oud-noir: id is used twice'))).toBe(true)
  })
})
