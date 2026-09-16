/**
 * Catalogue data for the Nafsah house.
 *
 * Every fragrance carries a `palette` used by <BottleVisual /> to render its
 * image placeholder, so the grid stays visually rich without binary assets.
 * Prices are keyed by size (in ml) and expressed in whole USD.
 */

export const SCENT_FAMILIES = ['Woody', 'Floral', 'Citrus', 'Oriental']

export const PRODUCTS = [
  {
    id: 'oud-noir',
    name: 'Oud Noir',
    tagline: 'Smoked oud, ink-dark and unhurried',
    family: 'Woody',
    concentration: 'Extrait de Parfum',
    intensity: 'Intense',
    year: 2019,
    rating: 4.9,
    reviews: 412,
    bestseller: true,
    notes: {
      top: ['Bergamot', 'Pink Pepper'],
      heart: ['Cambodian Oud', 'Damask Rose'],
      base: ['Sandalwood', 'Leather', 'Vetiver'],
    },
    sizes: [
      { ml: 50, price: 245 },
      { ml: 100, price: 395 },
    ],
    palette: { from: '#4a2c1a', via: '#8a5a2b', to: '#c9a961', glass: '#241611' },
    description:
      'A resinous oud aged eighteen months and lifted by rose absolute. Worn close to the skin it reads like warm leather in a dark room.',
  },
  {
    id: 'rose-imperiale',
    name: 'Rose Impériale',
    tagline: 'Damask rose at first light',
    family: 'Floral',
    concentration: 'Eau de Parfum',
    intensity: 'Moderate',
    year: 2021,
    rating: 4.8,
    reviews: 328,
    bestseller: true,
    notes: {
      top: ['Lychee', 'Pink Peppercorn'],
      heart: ['Damask Rose', 'Peony', 'Violet Leaf'],
      base: ['White Musk', 'Cashmere Wood'],
    },
    sizes: [
      { ml: 50, price: 210 },
      { ml: 100, price: 340 },
    ],
    palette: { from: '#5c2438', via: '#b06a7d', to: '#f0cdd4', glass: '#2a1520' },
    description:
      'Three thousand Damask roses distilled for a single flacon. Dewy and translucent at the top, powdery and quiet by the fourth hour.',
  },
  {
    id: 'citron-de-mer',
    name: 'Citron de Mer',
    tagline: 'Sicilian lemon over cold salt air',
    family: 'Citrus',
    concentration: 'Eau de Parfum',
    intensity: 'Fresh',
    year: 2022,
    rating: 4.6,
    reviews: 265,
    notes: {
      top: ['Sicilian Lemon', 'Yuzu', 'Sea Salt'],
      heart: ['Neroli', 'Marine Accord'],
      base: ['Driftwood', 'Ambrette'],
    },
    sizes: [
      { ml: 50, price: 165 },
      { ml: 100, price: 265 },
    ],
    palette: { from: '#1c4a4a', via: '#57a6a0', to: '#e6d98a', glass: '#10262a' },
    description:
      'Built for heat. Cold-pressed lemon and yuzu snap against a mineral salt accord, then settle into sun-bleached driftwood.',
  },
  {
    id: 'ambre-royale',
    name: 'Ambre Royale',
    tagline: 'Amber, vanilla and slow-burning resin',
    family: 'Oriental',
    concentration: 'Extrait de Parfum',
    intensity: 'Intense',
    year: 2018,
    rating: 4.9,
    reviews: 501,
    bestseller: true,
    notes: {
      top: ['Saffron', 'Cardamom'],
      heart: ['Amber Resin', 'Labdanum', 'Jasmine'],
      base: ['Madagascan Vanilla', 'Benzoin', 'Tonka Bean'],
    },
    sizes: [
      { ml: 50, price: 290 },
      { ml: 100, price: 445 },
    ],
    palette: { from: '#5a2f10', via: '#c07c2a', to: '#f2d79a', glass: '#2c1a08' },
    description:
      'The house signature. Saffron and cardamom open onto a bed of labdanum and vanilla that lingers on wool for days.',
  },
  {
    id: 'santal-blanc',
    name: 'Santal Blanc',
    tagline: 'Creamy sandalwood, worn like linen',
    family: 'Woody',
    concentration: 'Eau de Parfum',
    intensity: 'Moderate',
    year: 2020,
    rating: 4.7,
    reviews: 298,
    notes: {
      top: ['Violet Leaf', 'Cardamom'],
      heart: ['Mysore Sandalwood', 'Iris'],
      base: ['Cedar', 'Tonka Bean', 'Musk'],
    },
    sizes: [
      { ml: 50, price: 195 },
      { ml: 100, price: 310 },
    ],
    palette: { from: '#4c4132', via: '#a2907a', to: '#e8dcc6', glass: '#241f18' },
    description:
      'Sandalwood without the smoke. Iris gives it a powdery softness that makes it read closer to skin than to wood.',
  },
  {
    id: 'nuit-de-jasmin',
    name: 'Nuit de Jasmin',
    tagline: 'Night-blooming jasmine and tuberose',
    family: 'Floral',
    concentration: 'Extrait de Parfum',
    intensity: 'Intense',
    year: 2023,
    rating: 4.8,
    reviews: 187,
    isNew: true,
    notes: {
      top: ['Mandarin', 'Green Fig'],
      heart: ['Sambac Jasmine', 'Tuberose', 'Ylang-Ylang'],
      base: ['Sandalwood', 'Vanilla Orchid'],
    },
    sizes: [
      { ml: 50, price: 260 },
      { ml: 100, price: 410 },
    ],
    palette: { from: '#2b2350', via: '#6f6bb0', to: '#e9e2f5', glass: '#161238' },
    description:
      'Jasmine picked between midnight and dawn, when the flower gives up its most indolic facets. Unapologetically nocturnal.',
  },
  {
    id: 'bergamote-dor',
    name: "Bergamote d'Or",
    tagline: 'Gilded bergamot with a honeyed finish',
    family: 'Citrus',
    concentration: 'Eau de Parfum',
    intensity: 'Fresh',
    year: 2022,
    rating: 4.5,
    reviews: 221,
    notes: {
      top: ['Calabrian Bergamot', 'Blood Orange'],
      heart: ['Orange Blossom', 'Honey Accord'],
      base: ['Amberwood', 'White Musk'],
    },
    sizes: [
      { ml: 50, price: 175 },
      { ml: 100, price: 280 },
    ],
    palette: { from: '#6b4a10', via: '#d9a32c', to: '#f7e6a8', glass: '#2e2109' },
    description:
      'Calabrian bergamot rounded with a raw honey accord so the citrus never turns thin. Bright for an hour, golden for six.',
  },
  {
    id: 'safran-imperial',
    name: 'Safran Impérial',
    tagline: 'Saffron threads over warm spice',
    family: 'Oriental',
    concentration: 'Extrait de Parfum',
    intensity: 'Intense',
    year: 2021,
    rating: 4.7,
    reviews: 243,
    notes: {
      top: ['Saffron', 'Nutmeg', 'Pink Pepper'],
      heart: ['Rose Absolute', 'Cinnamon Bark'],
      base: ['Oud', 'Amber', 'Patchouli'],
    },
    sizes: [
      { ml: 50, price: 275 },
      { ml: 100, price: 420 },
    ],
    palette: { from: '#63200f', via: '#c2502a', to: '#f0b169', glass: '#2d0f08' },
    description:
      'Saffron at full strength, tempered by rose absolute and cinnamon bark. A cold-weather fragrance with a long, dry finish.',
  },
  {
    id: 'cedre-fume',
    name: 'Cèdre Fumé',
    tagline: 'Atlas cedar drawn through woodsmoke',
    family: 'Woody',
    concentration: 'Eau de Parfum',
    intensity: 'Moderate',
    year: 2023,
    rating: 4.6,
    reviews: 154,
    isNew: true,
    notes: {
      top: ['Juniper', 'Black Pepper'],
      heart: ['Atlas Cedar', 'Cypress', 'Birch Tar'],
      base: ['Vetiver', 'Oakmoss', 'Grey Amber'],
    },
    sizes: [
      { ml: 50, price: 185 },
      { ml: 100, price: 295 },
    ],
    palette: { from: '#23302a', via: '#5e7361', to: '#c3cbb8', glass: '#141c18' },
    description:
      'Birch tar gives the cedar its smoke; oakmoss keeps it damp rather than ashen. Closer to a forest floor than a fireplace.',
  },
  {
    id: 'fleur-de-neroli',
    name: 'Fleur de Néroli',
    tagline: 'Orange blossom in full sun',
    family: 'Floral',
    concentration: 'Eau de Parfum',
    intensity: 'Fresh',
    year: 2020,
    rating: 4.5,
    reviews: 176,
    notes: {
      top: ['Petitgrain', 'Green Mandarin'],
      heart: ['Neroli', 'Orange Blossom', 'Honeysuckle'],
      base: ['White Musk', 'Blond Woods'],
    },
    sizes: [
      { ml: 50, price: 160 },
      { ml: 100, price: 255 },
    ],
    palette: { from: '#4a4a22', via: '#a8b06a', to: '#f4efd0', glass: '#22240f' },
    description:
      'Neroli distilled from Tunisian bitter orange flowers. Green and slightly bitter up top, soft and sunlit underneath.',
  },
  {
    id: 'musc-blanc',
    name: 'Musc Blanc',
    tagline: 'Skin musk, cashmere and clean iris',
    family: 'Oriental',
    concentration: 'Eau de Parfum',
    intensity: 'Soft',
    year: 2024,
    rating: 4.8,
    reviews: 132,
    isNew: true,
    notes: {
      top: ['Aldehydes', 'Bergamot'],
      heart: ['Iris Pallida', 'Cashmeran'],
      base: ['White Musk', 'Ambrette Seed', 'Vanilla'],
    },
    sizes: [
      { ml: 50, price: 190 },
      { ml: 100, price: 300 },
    ],
    palette: { from: '#3d3a3c', via: '#8f8a8c', to: '#efe9e6', glass: '#1c1a1b' },
    description:
      'A second-skin musk built on ambrette and iris. Quiet enough for close quarters, persistent enough to notice at the end of the day.',
  },
  {
    id: 'vetiver-noir',
    name: 'Vétiver Noir',
    tagline: 'Haitian vetiver, earth-damp and green',
    family: 'Woody',
    concentration: 'Extrait de Parfum',
    intensity: 'Moderate',
    year: 2019,
    rating: 4.6,
    reviews: 209,
    notes: {
      top: ['Grapefruit', 'Green Cardamom'],
      heart: ['Haitian Vetiver', 'Iris Root'],
      base: ['Guaiac Wood', 'Tobacco Leaf', 'Ambergris'],
    },
    sizes: [
      { ml: 50, price: 220 },
      { ml: 100, price: 355 },
    ],
    palette: { from: '#1f3326', via: '#4f7a52', to: '#cfd9b4', glass: '#0f1c14' },
    description:
      'Vetiver kept rooty and green rather than smoked. Tobacco leaf and ambergris carry it into a dry, resinous close.',
  },
]

/**
 * Catalogue numbers are positional and stable: the house numbers its extraits
 * in the order they were composed, and the number is printed on every label.
 */
export const CATALOGUE_NUMBERS = Object.fromEntries(
  PRODUCTS.map((product, index) => [product.id, String(index + 1).padStart(2, '0')]),
)

/** Fast lookup used by the cart to re-hydrate line items. */
export const PRODUCTS_BY_ID = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]))

/** Inclusive price bounds across every size of every fragrance. */
export const PRICE_BOUNDS = PRODUCTS.reduce(
  (acc, product) => {
    for (const size of product.sizes) {
      acc.min = Math.min(acc.min, size.price)
      acc.max = Math.max(acc.max, size.price)
    }
    return acc
  },
  { min: Infinity, max: 0 },
)
