import { describe, expect, it } from 'vitest'
import {
  DEFAULT_FILTERS,
  FACETS,
  FULL_RANGE,
  SORTS,
  activeFilterCount,
  availableSorts,
  displayPriceFils,
  facetCounts,
  filterProducts,
  hasNote,
  matchesFilters,
  matchesQuery,
  matchingFormats,
  noteSuggestions,
  normalizeText,
  sanitizeFilters,
  searchIndex,
  sortProducts,
  tokenize,
} from './catalogue'
import { NOTES } from '../data/notes'
import { PRICE_BOUNDS, PRODUCTS, PRODUCTS_BY_ID, bottleFormats, concentrationFor, fromPriceFils } from '../data/products'
import { CONCENTRATIONS, FAMILIES, GENDERS, SILLAGE } from '../data/taxonomy'

const ids = (list) => list.map((product) => product.id)
const search = (query) => ids(filterProducts(PRODUCTS, { query }))
const withNotes = (...notes) => ids(filterProducts(PRODUCTS, { notes }))
const carries = (product, noteId) =>
  [...product.topNotes, ...product.heartNotes, ...product.baseNotes].some((note) => note.id === noteId)

describe('normalizeText', () => {
  it('folds case and Latin accents', () => {
    expect(normalizeText('Cèdre Fumé')).toBe('cedre fume')
    expect(normalizeText('Rose IMPÉRIALE')).toBe('rose imperiale')
  })

  it('strips Arabic tashkeel and tatweel', () => {
    expect(normalizeText('عُودٌ مُعَتَّقٌ')).toBe('عود معتق')
    expect(normalizeText('عـــود')).toBe('عود')
  })

  it('unifies alef, taa marbuta, alef maqsura and the hamza seats', () => {
    expect(normalizeText('أإآٱ')).toBe('اااا')
    expect(normalizeText('قهوة')).toBe('قهوه')
    expect(normalizeText('موسى')).toBe('موسي')
    expect(normalizeText('لؤلؤ')).toBe('لولو')
    expect(normalizeText('طائفي')).toBe(normalizeText('طايفي'))
  })

  it('reads Arabic-Indic digits as Latin and punctuation as space', () => {
    expect(normalizeText('غورماند ٢٫٠')).toBe('غورماند 2 0')
    expect(normalizeText("Ta'if — Rose, & Oud")).toBe('taif rose oud')
    expect(normalizeText(null)).toBe('')
  })
})

describe('tokenize', () => {
  it('splits a query into folded words and drops the Arabic article', () => {
    expect(tokenize('  Oud   ROSE ')).toEqual(['oud', 'rose'])
    expect(tokenize('العود الأسود')).toEqual(['عود', 'اسود'])
    expect(tokenize('')).toEqual([])
  })
})

describe('search', () => {
  it('indexes both languages', () => {
    const words = searchIndex(PRODUCTS_BY_ID['oud-noir'])
    expect(words).toContain('oud')
    expect(words).toContain('عود')
    expect(words).toContain('كمبودي')
  })

  it("finds Arabic queries: 'عود', 'ورد طايفي', 'زعفران'", () => {
    const oud = search('عود')
    expect(oud).toEqual(expect.arrayContaining(['oud-noir', 'qahwa', 'dehn-al-oud']))
    for (const id of oud) expect(searchIndex(PRODUCTS_BY_ID[id]).some((w) => w.startsWith('عود'))).toBe(true)

    // ئ typed as ي, the way most keyboards and shoppers write it.
    expect(search('ورد طايفي')).toEqual(['ward-taifi'])
    expect(search('ورد طائفي')).toEqual(['ward-taifi'])

    const saffron = search('زعفران')
    expect(saffron).toEqual(expect.arrayContaining(['safran-imperial', 'ambre-royale', 'qahwa']))
    expect(saffron).toEqual(withNotes('saffron').filter((id) => saffron.includes(id)))
  })

  it('reads the article as optional: "العود" finds the same oud as "عود"', () => {
    expect(search('العود')).toEqual(search('عود'))
  })

  it("is accent-insensitive: 'cedre fume' finds Cèdre Fumé", () => {
    expect(search('cedre fume')).toEqual(['cedre-fume'])
    expect(search('rose imperiale')).toContain('rose-imperiale')
    expect(search('safran imperial')).toContain('safran-imperial')
  })

  it('matches every word anywhere, not as a phrase', () => {
    expect(search('rose oud')).toEqual(search('oud rose'))
    expect(search('oud rose')).toContain('oud-noir')
  })

  it('matches word starts, so "rose" does not find tuberose', () => {
    // A fragrance whose only "rose" is inside tuberose.
    const product = {
      ...PRODUCTS_BY_ID['nuit-de-jasmin'],
      name: { en: 'Test', ar: 'تجربة' },
      tagline: { en: 'Night flowers', ar: 'زهور الليل' },
      family: 'amber',
      topNotes: [NOTES.tuberose],
      heartNotes: [NOTES.jasmine],
      baseNotes: [NOTES.musk],
    }
    expect(carries(product, 'tuberose')).toBe(true)
    expect(matchesQuery(product, 'rose')).toBe(false)
    expect(matchesQuery(product, 'tuber')).toBe(true)
  })

  it('finds notes by alias and as you type', () => {
    expect(search('cambodian oud')).toEqual(withNotes('cambodi-oud'))
    expect(search('cam')).toEqual(expect.arrayContaining(['oud-noir', 'qahwa', 'dehn-al-oud']))
    expect(search('gahwa')).toEqual(['qahwa'])
  })

  it('finds a spray that also comes as oil by its attar', () => {
    const attar = search('attar')
    expect(attar).toEqual(expect.arrayContaining(['dehn-al-oud', 'ward-taifi', 'oud-noir']))
    expect(attar).not.toContain('rose-imperiale')
  })

  it('reads و ب ف ك and the article glued to a word: "والورد", "وعود", "بالورد"', () => {
    expect(search('عود والورد')).toEqual(search('عود ورد'))
    expect(search('عود والورد').length).toBeGreaterThan(0)
    expect(search('وعود')).toEqual(search('عود'))
    expect(search('زعفران وعود')).toEqual(search('زعفران عود'))
    expect(search('بالورد')).toEqual(search('ورد'))
    expect(search('ورد ومسك')).toEqual(search('ورد مسك'))
  })

  it('asks nothing of a joining "and" or "و", unless it is all that is typed', () => {
    expect(search('oud and rose')).toEqual(search('oud rose'))
    expect(search('عود و ورد')).toEqual(search('عود ورد'))
    // A lone "و" is the start of a word being typed, not a connector.
    const typed = search('و')
    expect(typed.length).toBeGreaterThan(0)
    expect(typed.sort()).toEqual(ids(PRODUCTS.filter((p) => searchIndex(p).some((w) => w.startsWith('و')))).sort())
  })

  it('does not cut a half-typed word down to the article: "والع" stays narrow', () => {
    expect(search('والع').length).toBeLessThan(10)
  })

  it('returns everything for an empty query and nothing for nonsense', () => {
    expect(search('   ')).toHaveLength(PRODUCTS.length)
    expect(search('zzqx')).toEqual([])
  })
})

describe('notes filter', () => {
  it.each(['taif-rose', 'cambodi-oud', 'vanilla', 'saffron'])('finds every fragrance with %s', (noteId) => {
    const found = withNotes(noteId)
    expect(found.length).toBeGreaterThan(0)
    for (const product of PRODUCTS) expect(found.includes(product.id)).toBe(hasNote(product, noteId))
  })

  it('pins the spec examples to the catalogue', () => {
    expect(withNotes('taif-rose')).toEqual(['ward-taifi'])
    expect(withNotes('cambodi-oud').sort()).toEqual(['dehn-al-oud', 'oud-noir', 'qahwa'])
    expect(withNotes('saffron').sort()).toEqual(['ambre-royale', 'qahwa', 'safran-imperial'])
  })

  it('reads a generic note as including its named varieties, never the reverse', () => {
    // Vanilla: Musc Blanc carries plain vanilla, Ambre Royale and Qahwa the Madagascan.
    expect(withNotes('vanilla').sort()).toEqual(['ambre-royale', 'musc-blanc', 'qahwa'])
    expect(withNotes('madagascan-vanilla')).not.toContain('musc-blanc')
  })

  it('requires ALL chosen notes', () => {
    expect(withNotes('saffron', 'cambodi-oud')).toEqual(['qahwa'])
    expect(withNotes('taif-rose', 'saffron')).toEqual([])
  })
})

describe('facet filters', () => {
  it('filters by primary family, either-or within the facet', () => {
    const found = filterProducts(PRODUCTS, { families: ['rose', 'gourmand'] })
    expect(found.length).toBeGreaterThan(0)
    for (const product of found) expect(['rose', 'gourmand']).toContain(product.family)
    expect(found).toHaveLength(PRODUCTS.filter((p) => ['rose', 'gourmand'].includes(p.family)).length)
  })

  it('matches a concentration on any format, so a quarter-tola oil makes a spray an attar', () => {
    const attar = ids(filterProducts(PRODUCTS, { concentrations: ['attar'] }))
    expect([...attar].sort()).toEqual(
      ids(PRODUCTS.filter((p) => p.formats.some((f) => concentrationFor(p, f.id) === 'attar'))).sort(),
    )
    expect(attar).toContain('oud-noir') // extrait spray with a quarter-tola oil
    expect(attar).toContain('dehn-al-oud')
    expect(ids(filterProducts(PRODUCTS, { concentrations: ['edt'] })).sort()).toEqual(['bergamote-dor', 'fleur-de-neroli'])
  })

  it('filters by projection and gender', () => {
    for (const product of filterProducts(PRODUCTS, { sillage: ['beast'] })) expect(product.projectionSillage).toBe('beast')
    for (const product of filterProducts(PRODUCTS, { genders: ['men'] })) expect(product.gender).toBe('men')
  })

  it('keeps a fragrance when any bottle or oil is in the price range, never on the sample', () => {
    const range = [24000, 30000]
    const found = filterProducts(PRODUCTS, { priceRange: range })
    expect(ids(found).sort()).toEqual(['oud-noir', 'ward-taifi'])
    for (const product of found) {
      expect(bottleFormats(product).some((f) => f.priceFils >= range[0] && f.priceFils <= range[1])).toBe(true)
    }
    // Every sample costs under 7 KWD; no fragrance qualifies on its sample alone.
    expect(PRODUCTS.filter((p) => matchesFilters(p, { priceRange: [3000, 7000] }))).toEqual([])
  })

  it('meets concentration and price with the same bottle', () => {
    // Oud Noir, Ambre Royale and Safran Imperial are extraits, but their only
    // bottles under 35 KWD are quarter-tola attars.
    expect(filterProducts(PRODUCTS, { concentrations: ['extrait'], priceRange: [24000, 35000] })).toEqual([])
    // Oud Noir's attar is 29 KWD; its 75 KWD bottle is an extrait spray.
    expect(ids(filterProducts(PRODUCTS, { concentrations: ['attar'], priceRange: [70000, 80000] }))).not.toContain('oud-noir')
    expect(facetCounts(PRODUCTS, { priceRange: [24000, 35000] }, 'concentrations').extrait).toBe(0)
  })

  it('finds exactly the fragrances with one bottle in both filters, for every concentration and range', () => {
    const prices = [...new Set(PRODUCTS.flatMap((p) => bottleFormats(p).map((f) => f.priceFils)))].sort((a, b) => a - b)
    const ranges = prices.flatMap((low, i) => prices.slice(i).map((high) => [low, high]))
    const meets = (product, id, [low, high]) =>
      bottleFormats(product).some(
        (f) => f.priceFils >= low && f.priceFils <= high && concentrationFor(product, f.id) === id,
      )
    for (const { id } of CONCENTRATIONS) {
      for (const range of ranges) {
        const found = filterProducts(PRODUCTS, { concentrations: [id], priceRange: range })
        for (const product of found) expect(meets(product, id, range)).toBe(true)
        expect(ids(found).sort()).toEqual(ids(PRODUCTS.filter((p) => meets(p, id, range))).sort())
        expect(facetCounts(PRODUCTS, { priceRange: range }, 'concentrations')[id]).toBe(found.length)
        for (const product of found) {
          expect(matchingFormats(product, { concentrations: [id], priceRange: range }).length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('combines facets with AND', () => {
    const found = filterProducts(PRODUCTS, { families: ['french-arabic'], genders: ['men'], query: 'cedre' })
    expect(ids(found)).toEqual(['cedre-fume'])
  })
})

describe('facetCounts', () => {
  it('counts each option with every other facet applied', () => {
    const filters = { families: ['rose'], genders: ['women'] }
    const counts = facetCounts(PRODUCTS, filters, 'families')
    expect(Object.keys(counts)).toEqual(FAMILIES.map((f) => f.id))
    for (const family of FAMILIES) {
      const expected = PRODUCTS.filter((p) => p.family === family.id && p.gender === 'women').length
      expect(counts[family.id]).toBe(expected)
    }
  })

  it('lists every option of each facet, zeros included', () => {
    expect(Object.keys(facetCounts(PRODUCTS, {}, 'concentrations'))).toEqual(CONCENTRATIONS.map((c) => c.id))
    expect(Object.keys(facetCounts(PRODUCTS, {}, 'sillage'))).toEqual(SILLAGE.map((s) => s.id))
    expect(Object.keys(facetCounts(PRODUCTS, {}, 'genders'))).toEqual(GENDERS.map((g) => g.id))
    expect(facetCounts(PRODUCTS, { query: 'zzqx' }, 'genders')).toEqual({ unisex: 0, men: 0, women: 0 })
  })

  it('counts notes inside the current results, since notes must all match', () => {
    const counts = facetCounts(PRODUCTS, { notes: ['saffron'] }, 'notes')
    expect(Object.keys(counts)).toHaveLength(Object.keys(NOTES).length)
    expect(counts.saffron).toBe(withNotes('saffron').length)
    expect(counts['cambodi-oud']).toBe(withNotes('saffron', 'cambodi-oud').length)
    expect(counts['taif-rose']).toBe(0)
  })

  it('agrees with filterProducts for every facet value', () => {
    for (const facet of FACETS.filter((f) => f !== 'notes')) {
      const counts = facetCounts(PRODUCTS, { query: 'oud' }, facet)
      for (const [id, count] of Object.entries(counts)) {
        expect(filterProducts(PRODUCTS, { query: 'oud', [facet]: [id] })).toHaveLength(count)
      }
    }
  })
})

describe('sorting', () => {
  it('offers rating only once something has been reviewed', () => {
    expect(availableSorts({}).map((s) => s.id)).not.toContain('rating')
    expect(availableSorts({ 'oud-noir': { count: 0, overall: null } }).map((s) => s.id)).not.toContain('rating')
    expect(availableSorts({ 'oud-noir': { count: 1, overall: 4 } })).toEqual(SORTS)
  })

  it('sorts by the cheapest bottle or oil, never the sample', () => {
    const asc = sortProducts(PRODUCTS, 'price-asc')
    const prices = asc.map(fromPriceFils)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
    expect(asc[0].id).toBe('ward-taifi')
    expect(sortProducts(PRODUCTS, 'price-desc').map(fromPriceFils)).toEqual([...prices].reverse())
  })

  it('sorts by the price each card shows under the filters', () => {
    const filters = { priceRange: [100000, 135000] }
    const asc = filterProducts(PRODUCTS, { ...filters, sort: 'price-asc' })
    expect(asc.map((p) => displayPriceFils(p, filters))).toEqual([105000, 108000, 119000, 120000, 125000, 129000, 135000])
    expect(ids(filterProducts(PRODUCTS, { ...filters, sort: 'price-desc' }))).toEqual(ids(asc).reverse())
    // Attar only: a spray's quarter-tola oil is the price it shows.
    const attar = { concentrations: ['attar'] }
    const oils = filterProducts(PRODUCTS, { ...attar, sort: 'price-asc' }).map((p) => displayPriceFils(p, attar))
    expect(oils).toEqual([...oils].sort((a, b) => a - b))
    expect(displayPriceFils(PRODUCTS_BY_ID['oud-noir'], attar)).toBe(29000)
  })

  it('sorts newest by year and featured by bestseller then new, keeping catalogue order on ties', () => {
    const years = sortProducts(PRODUCTS, 'newest').map((p) => p.year)
    expect(years).toEqual([...years].sort((a, b) => b - a))
    const featured = sortProducts(PRODUCTS, 'featured')
    const bestsellers = PRODUCTS.filter((p) => p.bestseller)
    expect(ids(featured.slice(0, bestsellers.length))).toEqual(ids(bestsellers))
  })

  it('sorts by real ratings, unreviewed fragrances last', () => {
    const aggregates = {
      'musc-blanc': { count: 2, overall: 4.5 },
      'qahwa': { count: 5, overall: 4.5 },
      'citron-de-mer': { count: 1, overall: 4.9 },
    }
    const sorted = ids(sortProducts(PRODUCTS, 'rating', { aggregates }))
    expect(sorted.slice(0, 3)).toEqual(['citron-de-mer', 'qahwa', 'musc-blanc'])
    expect(sorted.slice(3)).toEqual(ids(sortProducts(PRODUCTS, 'featured')).filter((id) => !(id in aggregates)))
    // No reviews at all: the rating sort falls back to featured.
    expect(ids(sortProducts(PRODUCTS, 'rating'))).toEqual(ids(sortProducts(PRODUCTS, 'featured')))
  })

  it('applies the sort inside filterProducts', () => {
    expect(ids(filterProducts(PRODUCTS, { sort: 'price-asc' }))).toEqual(ids(sortProducts(PRODUCTS, 'price-asc')))
  })
})

describe('sanitizeFilters', () => {
  it('fills defaults and keeps known ids only, each once', () => {
    expect(sanitizeFilters()).toEqual(DEFAULT_FILTERS)
    const clean = sanitizeFilters({
      families: ['rose', 'woody', 'rose', 'constructor'],
      notes: ['saffron', 'unicorn'],
      sort: 'cheapest',
      extra: 1,
    })
    expect(clean.families).toEqual(['rose'])
    expect(clean.notes).toEqual(['saffron'])
    expect(clean.sort).toBe('featured')
    expect(clean).not.toHaveProperty('extra')
  })

  it('clamps and orders the price range', () => {
    expect(FULL_RANGE).toEqual([PRICE_BOUNDS.minFils, PRICE_BOUNDS.maxFils])
    expect(sanitizeFilters({ priceRange: [90000, 40000] }).priceRange).toEqual([40000, 90000])
    expect(sanitizeFilters({ priceRange: [0, 1e9] }).priceRange).toEqual([...FULL_RANGE])
    expect(sanitizeFilters({ priceRange: ['x', null] }).priceRange).toEqual([...FULL_RANGE])
  })

  it('counts active filters', () => {
    expect(activeFilterCount(DEFAULT_FILTERS)).toBe(0)
    expect(activeFilterCount(sanitizeFilters({ query: ' oud ', families: ['rose', 'amber'], priceRange: [30000, 90000] }))).toBe(4)
  })
})

describe('noteSuggestions', () => {
  it('suggests in the active language, best match first', () => {
    expect(noteSuggestions('van', 'en').map((n) => n.id)).toEqual(['vanilla', 'vanilla-orchid', 'madagascan-vanilla'])
    expect(noteSuggestions('زعف', 'ar').map((n) => n.id)).toEqual(['saffron'])
    expect(noteSuggestions('العود', 'ar').map((n) => n.id).sort()).toEqual(['cambodi-oud', 'hindi-oud'])
  })

  it('finds by alias or the other language', () => {
    expect(noteSuggestions('cambodian', 'en').map((n) => n.id)).toEqual(['cambodi-oud'])
    expect(noteSuggestions('saffron', 'ar').map((n) => n.id)).toEqual(['saffron'])
    expect(noteSuggestions('ورد طايفي', 'ar').map((n) => n.id)).toEqual(['taif-rose'])
  })

  it('respects the limit and exclusions, and stays quiet for an empty query', () => {
    expect(noteSuggestions('a', 'en', 3)).toHaveLength(3)
    expect(noteSuggestions('saffron', 'en', 8, { exclude: ['saffron'] })).toEqual([])
    expect(noteSuggestions('  ', 'en')).toEqual([])
  })
})
