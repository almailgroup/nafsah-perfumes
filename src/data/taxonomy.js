/**
 * The house taxonomy: every enumerated value the catalogue, the filters, the
 * scent finder and the product page share. Products store ids only; the
 * labels live here, in both languages, so a rename touches one line.
 */

/** Index a list of `{ id, … }` entries by id. */
export const byId = (list) => Object.fromEntries(list.map((x) => [x.id, x]))

/** Scent families as the Gulf shelves them. Order is display order. */
export const FAMILIES = [
  {
    id: 'oud-musk',
    en: 'Oud & Musk',
    ar: 'عود ومسك',
    short: { en: 'Oud & Musk', ar: 'عود ومسك' },
    blurb: {
      en: 'Agarwood and musk, the backbone of every Gulf majlis.',
      ar: 'العود والمسك، عماد كل مجلس خليجي.',
    },
  },
  {
    id: 'amber',
    en: 'Amber',
    ar: 'عنبر',
    short: { en: 'Amber', ar: 'عنبر' },
    blurb: {
      en: 'Labdanum, resins and vanilla, warm enough for winter nights.',
      ar: 'لادن وراتنجات وفانيلا، دافئة بما يكفي لليالي الشتاء.',
    },
  },
  {
    id: 'rose',
    en: 'Rose & Florals',
    ar: 'ورد وزهور',
    short: { en: 'Rose', ar: 'ورد' },
    blurb: {
      en: 'Taif and Damask rose, jasmine and orange blossom.',
      ar: 'ورد طائفي ودمشقي، وياسمين وزهر البرتقال.',
    },
  },
  {
    id: 'french-arabic',
    en: 'French-Arabic Hybrids',
    ar: 'هجين فرنسي عربي',
    short: { en: 'French-Arabic', ar: 'فرنسي عربي' },
    blurb: {
      en: 'Grasse technique with Gulf materials: saffron, sandalwood and oud in a modern cut.',
      ar: 'صنعة غراس بمواد الخليج: زعفران وصندل وعود بقصّة حديثة.',
    },
  },
  {
    id: 'bukhoor-oils',
    en: 'Bukhoor & Oils',
    ar: 'بخور ودهن',
    short: { en: 'Bukhoor & Oils', ar: 'بخور ودهن' },
    blurb: {
      en: "Pure oils and incense smoke, the Gulf's oldest ways to wear scent.",
      ar: 'دهون صافية ودخان البخور، أقدم طرق الخليج في التعطّر.',
    },
  },
  {
    id: 'gourmand',
    en: 'Gourmand 2.0',
    ar: 'غورماند ٢٫٠',
    short: { en: 'Gourmand', ar: 'غورماند' },
    blurb: {
      en: 'Coffee, dates and cardamom: warmth without the sugar.',
      ar: 'قهوة وتمر وهيل: دفء بلا سكّر.',
    },
  },
  {
    id: 'fresh-aquatic',
    en: 'Fresh & Aquatic Beast Mode',
    ar: 'منعش ومائي فوّاح',
    short: { en: 'Fresh & Aquatic', ar: 'منعش ومائي' },
    blurb: {
      en: 'Citrus and sea air, built to project through a 45°C afternoon.',
      ar: 'حمضيات ونسيم بحر، صُنعت لتفوح في عزّ ظهيرة حرّها ٤٥°.',
    },
  },
]

/**
 * Concentrations, strongest first. `oilPercent` is the label; `oilRange`
 * carries the same figures as numbers so Arabic can print them in its own
 * digits. `abbr` is the Latin word printed on the glass.
 */
export const CONCENTRATIONS = [
  {
    id: 'extrait',
    en: 'Extrait de Parfum',
    ar: 'خلاصة العطر',
    short: { en: 'Extrait', ar: 'خلاصة' },
    abbr: 'EXTRAIT',
    oilPercent: '20–30%',
    oilRange: [20, 30],
  },
  {
    id: 'edp',
    en: 'Eau de Parfum',
    ar: 'ماء العطر',
    short: { en: 'EDP', ar: 'ماء العطر' },
    abbr: 'EDP',
    oilPercent: '15–20%',
    oilRange: [15, 20],
  },
  {
    id: 'edt',
    en: 'Eau de Toilette',
    ar: 'ماء التواليت',
    short: { en: 'EDT', ar: 'ماء التواليت' },
    abbr: 'EDT',
    oilPercent: '5–15%',
    oilRange: [5, 15],
  },
  {
    id: 'attar',
    en: 'Perfume Oil · Attar',
    ar: 'دهن عطري',
    short: { en: 'Attar', ar: 'دهن' },
    abbr: 'ATTAR',
    oilPercent: '100%',
    oilRange: [100, 100],
  },
]

/** Projection and sillage, weakest first. `level` 1–4 drives the meters. */
export const SILLAGE = [
  { id: 'intimate', level: 1, en: 'Intimate', ar: 'قريب من البشرة' },
  { id: 'moderate', level: 2, en: 'Moderate', ar: 'معتدل' },
  { id: 'strong', level: 3, en: 'Strong', ar: 'قوي' },
  { id: 'beast', level: 4, en: 'Nuclear · Beast Mode', ar: 'فوّاح جداً' },
]

export const GENDERS = [
  { id: 'unisex', en: 'Unisex', ar: 'للجنسين' },
  { id: 'men', en: 'Men', ar: 'رجالي' },
  { id: 'women', en: 'Women', ar: 'نسائي' },
]

/** Kuwait has two seasons that matter to perfume. A product in both is worn all year. */
export const SEASONS = [
  { id: 'summer', en: 'Kuwaiti summer', ar: 'صيف الكويت' },
  { id: 'winter', en: 'Winter nights', ar: 'ليالي الشتاء' },
]

export const OCCASIONS = [
  { id: 'diwaniya', en: 'Diwaniya', ar: 'الديوانية' },
  { id: 'office', en: 'Office', ar: 'العمل' },
  { id: 'wedding', en: 'Weddings & occasions', ar: 'الأعراس والمناسبات' },
  { id: 'everyday', en: 'Everyday', ar: 'يومي' },
]

/**
 * The size and sample toggle, in display order. `kind` separates bottles of
 * spray from oils and samples; `tryFirst` formats ship with a free 2 ml vial
 * of the same scent; `ml` is the standard volume of each format.
 * A tola is 12 ml (11.66 g); a quarter tola is 3 ml.
 */
export const FORMATS = [
  { id: 'full', en: 'Full Bottle', ar: 'الزجاجة الكاملة', kind: 'spray', tryFirst: true, ml: 100 },
  { id: 'spray50', en: '50ml Spray', ar: 'بخاخ ٥٠ مل', kind: 'spray', tryFirst: true, ml: 50 },
  { id: 'tola', en: 'Tola Oil', ar: 'تولة دهن', kind: 'oil', tryFirst: true, ml: 12 },
  { id: 'quarter-tola', en: 'Quarter Tola Oil', ar: 'ربع تولة دهن', kind: 'oil', tryFirst: false, ml: 3 },
  { id: 'sample', en: '2ml Sample Vial', ar: 'عيّنة ٢ مل', kind: 'sample', tryFirst: false, ml: 2 },
]

/** How a scent holds up in Kuwait's summer, 1–5. */
export const HEAT_SCALE = [
  { value: 1, en: 'Wilts in the heat', ar: 'يذبل في الحرّ' },
  { value: 2, en: 'Best kept for cool evenings', ar: 'الأنسب للأمسيات الباردة' },
  { value: 3, en: 'Holds up in mild heat', ar: 'يصمد في الحرّ المعتدل' },
  { value: 4, en: 'Comfortable in summer heat', ar: 'مريح في حرّ الصيف' },
  { value: 5, en: 'Thrives at 45°C+', ar: 'يتألّق في ٤٥° فما فوق' },
]

/** Longevity in words. A band covers every hour up to and including `maxHours`. */
export const LONGEVITY_BANDS = [
  { id: 'moderate', maxHours: 5, en: 'Moderate', ar: 'ثبات معتدل' },
  { id: 'long', maxHours: 9, en: 'Long-lasting', ar: 'ثبات طويل' },
  { id: 'very-long', maxHours: 14, en: 'Very long', ar: 'ثبات طويل جداً' },
  { id: 'all-day', maxHours: Infinity, en: 'All day and night', ar: 'يدوم نهاراً وليلاً' },
]

/** The three ways the house layers a scent, as listed under each product. */
export const LAYERING_KINDS = [
  { id: 'bukhoor', en: 'Bukhoor', ar: 'بخور' },
  { id: 'attar', en: 'Perfume oil', ar: 'دهن عطري' },
  { id: 'spray', en: 'Spray', ar: 'عطر بخاخ' },
]

export const FAMILY_BY_ID = byId(FAMILIES)
export const CONCENTRATION_BY_ID = byId(CONCENTRATIONS)
export const SILLAGE_BY_ID = byId(SILLAGE)
export const GENDER_BY_ID = byId(GENDERS)
export const FORMAT_BY_ID = byId(FORMATS)
export const OCCASION_BY_ID = byId(OCCASIONS)
export const SEASON_BY_ID = byId(SEASONS)
export const LAYERING_KIND_BY_ID = byId(LAYERING_KINDS)

/** The longevity band for a number of hours on skin. */
export const longevityBand = (hours) => LONGEVITY_BANDS.find((band) => hours <= band.maxHours)
