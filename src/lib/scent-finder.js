/**
 * The Scent Finder: five questions, and every fragrance in the house read
 * against the answers.
 *
 * Pure. recommend() takes the products it ranks and returns data — a score
 * out of 100 and the reasons behind it as dictionary keys ('finder.reason.*')
 * with language-neutral vars (a family id, a number of hours) that the page
 * localises. Nothing here knows which language is showing.
 *
 * The scoring reads only the house's own catalogue data: occasions, the family
 * profile and its notes, seasons with heat resistance, projection and gender.
 * There are no ratings in it, because the house has none to give.
 */
import { FAMILIES } from '../data/taxonomy'

/* ---------------------------------------------------------------------------
 * The questions
 * ------------------------------------------------------------------------- */

/**
 * Five questions in asking order. Each option is { id, en, ar, hint, icon };
 * icon is a lucide-react component name, mapped by the page.
 */
export const QUESTIONS = [
  {
    id: 'occasion',
    label: { en: 'Occasion', ar: 'المناسبة' },
    title: { en: 'Where will you wear it most?', ar: 'أين ستتعطّر به في الغالب؟' },
    hint: {
      en: 'Choose the moment that matters most. A good fragrance will manage the rest.',
      ar: 'اختر المناسبة الأهمّ لك، والعطر الجيد يتكفّل بالباقي.',
    },
    options: [
      {
        id: 'diwaniya',
        en: 'Diwaniya',
        ar: 'الديوانية',
        hint: { en: 'Evenings in the majlis, coffee and long conversation', ar: 'أمسيات المجلس، قهوة وأحاديث تطول' },
        icon: 'Coffee',
      },
      {
        id: 'office',
        en: 'Office',
        ar: 'العمل',
        hint: { en: 'Close quarters, all day, nobody overwhelmed', ar: 'مسافات قريبة طوال اليوم، دون أن يزعج أحداً' },
        icon: 'Briefcase',
      },
      {
        id: 'wedding',
        en: 'Weddings & occasions',
        ar: 'الأعراس والمناسبات',
        hint: { en: 'Evening dress and a hall full of people', ar: 'لباس السهرة وقاعة تغصّ بالمدعوّين' },
        icon: 'Gem',
      },
      {
        id: 'everyday',
        en: 'Everyday',
        ar: 'يومي',
        hint: { en: 'Errands, family, the mall: your daily signature', ar: 'المشاوير والعائلة والمجمّعات: بصمتك اليومية' },
        icon: 'CalendarDays',
      },
    ],
  },
  {
    id: 'vibe',
    label: { en: 'Character', ar: 'الطابع' },
    title: { en: 'Which character draws you in?', ar: 'أيّ طابع يشدّك أكثر؟' },
    hint: {
      en: 'Go with your first instinct. The family matters more than any single note.',
      ar: 'ثق بإحساسك الأول، فالعائلة العطرية أهمّ من أي نوتة بمفردها.',
    },
    options: [
      {
        id: 'heavy-oud',
        en: 'Heavy oud',
        ar: 'عود ثقيل',
        hint: { en: 'Agarwood, incense and resins, deep and smoky', ar: 'عود وبخور وراتنجات، عميق ومدخّن' },
        icon: 'Flame',
      },
      {
        id: 'fresh-blue',
        en: 'Fresh & blue',
        ar: 'منعش وبحري',
        hint: { en: 'Citrus, sea salt and clean air', ar: 'حمضيات وملح البحر وهواء نقي' },
        icon: 'Waves',
      },
      {
        id: 'floral',
        en: 'Floral',
        ar: 'زهري',
        hint: { en: 'Taif rose, jasmine and orange blossom', ar: 'ورد طائفي وياسمين وزهر البرتقال' },
        icon: 'Flower2',
      },
      {
        id: 'sweet-gourmand',
        en: 'Warm & sweet',
        ar: 'دافئ وحلو',
        hint: { en: 'Arabic coffee, dates, cardamom and vanilla', ar: 'قهوة عربية وتمر وهيل وفانيلا' },
        icon: 'Bean',
      },
    ],
  },
  {
    id: 'season',
    label: { en: 'Season', ar: 'الموسم' },
    title: { en: 'When will you wear it?', ar: 'في أيّ موسم ستضعه؟' },
    hint: {
      en: 'A Kuwaiti summer tests a perfume like nothing else.',
      ar: 'صيف الكويت يختبر العطر كما لا يختبره شيء آخر.',
    },
    options: [
      {
        id: 'summer',
        en: 'Kuwaiti summer',
        ar: 'صيف الكويت',
        hint: { en: 'Afternoons of 45°C and humid nights', ar: 'ظهيرة بحرارة ٤٥° وليالٍ رطبة' },
        icon: 'ThermometerSun',
      },
      {
        id: 'winter',
        en: 'Winter nights',
        ar: 'ليالي الشتاء',
        hint: { en: 'Cool evenings, desert camps and long gatherings', ar: 'أمسيات باردة ومخيّمات البرّ وسهرات طويلة' },
        icon: 'Moon',
      },
      {
        id: 'all-year',
        en: 'All year round',
        ar: 'طوال العام',
        hint: { en: 'One signature for every month', ar: 'بصمة واحدة لكل الشهور' },
        icon: 'SunMoon',
      },
    ],
  },
  {
    id: 'projection',
    label: { en: 'Projection', ar: 'الفوحان' },
    title: { en: 'How far should it carry?', ar: 'إلى أيّ مدى تريد أن يفوح؟' },
    hint: {
      en: 'Projection is how far the scent reaches; sillage is the trail it leaves.',
      ar: 'الفوحان هو المسافة التي يبلغها العطر، والأثر هو ما يتركه خلفك.',
    },
    options: [
      {
        id: 'soft',
        en: 'Close to the skin',
        ar: 'قريب من البشرة',
        hint: { en: 'Found only by someone who leans in', ar: 'لا يلحظه إلا من يقترب منك' },
        icon: 'SignalLow',
      },
      {
        id: 'noticeable',
        en: 'Noticed',
        ar: 'ملحوظ',
        hint: { en: 'A trail people remember, without shouting', ar: 'أثر يتذكّره الناس، بلا مبالغة' },
        icon: 'SignalMedium',
      },
      {
        id: 'beast',
        en: 'Beast mode',
        ar: 'فوّاح جداً',
        hint: { en: 'Fills the majlis and stays after you leave', ar: 'يملأ المجلس ويبقى بعد أن تغادر' },
        icon: 'SignalHigh',
      },
    ],
  },
  {
    id: 'wearer',
    label: { en: 'Wearer', ar: 'لمن' },
    title: { en: 'Who is it for?', ar: 'لمن هذا العطر؟' },
    hint: {
      en: 'Unisex compositions suit every answer.',
      ar: 'التركيبات المخصّصة للجنسين تناسب كل الإجابات.',
    },
    options: [
      {
        id: 'him',
        en: 'For him',
        ar: 'له',
        hint: { en: "Men's and unisex compositions", ar: 'تركيبات رجالية وللجنسين' },
        icon: 'User',
      },
      {
        id: 'her',
        en: 'For her',
        ar: 'لها',
        hint: { en: "Women's and unisex compositions", ar: 'تركيبات نسائية وللجنسين' },
        icon: 'UserRound',
      },
      {
        id: 'anyone',
        en: 'For anyone',
        ar: 'للجميع',
        hint: { en: 'Shared compositions first', ar: 'التركيبات المشتركة أولاً' },
        icon: 'Users',
      },
    ],
  },
]

export const QUESTION_IDS = QUESTIONS.map((question) => question.id)
export const QUESTION_BY_ID = Object.fromEntries(QUESTIONS.map((question) => [question.id, question]))

/** One option of one question, or null. Own properties only. */
export const optionOf = (questionId, optionId) =>
  (Object.hasOwn(QUESTION_BY_ID, questionId) &&
    QUESTION_BY_ID[questionId].options.find((option) => option.id === optionId)) ||
  null

/* ---------------------------------------------------------------------------
 * Answers
 * ------------------------------------------------------------------------- */

/** Only known questions with known options survive; everything else is dropped. */
export function sanitizeAnswers(input) {
  const answers = {}
  if (!input || typeof input !== 'object') return answers
  for (const id of QUESTION_IDS) {
    const value = Object.hasOwn(input, id) ? input[id] : undefined
    if (typeof value === 'string' && optionOf(id, value)) answers[id] = value
  }
  return answers
}

/** Every question answered. */
export const isComplete = (answers) => QUESTION_IDS.every((id) => Boolean(optionOf(id, answers?.[id])))

/** Answers read from a query string ('?occasion=office&vibe=floral…') or URLSearchParams. */
export function answersFromSearch(search) {
  const params = search instanceof URLSearchParams ? search : new URLSearchParams(String(search ?? ''))
  return sanitizeAnswers(Object.fromEntries(QUESTION_IDS.map((id) => [id, params.get(id)])))
}

/** The answers as a query string in asking order, '' when there are none. */
export function searchFromAnswers(answers) {
  const params = new URLSearchParams()
  for (const [id, value] of Object.entries(sanitizeAnswers(answers))) params.set(id, value)
  const query = params.toString()
  return query ? `?${query}` : ''
}

/* ---------------------------------------------------------------------------
 * How each answer reads the catalogue
 * ------------------------------------------------------------------------- */

/** Points per question; they sum to 100. The character of a scent counts most. */
export const WEIGHTS = { occasion: 20, vibe: 35, season: 15, projection: 15, wearer: 15 }

// How well a fragrance made for one occasion serves another: a Diwaniya scent
// is half-way to a wedding, an everyday one most of the way to the office.
const OCCASION_FIT = {
  diwaniya: { diwaniya: 1, wedding: 0.5, everyday: 0.3, office: 0.1 },
  office: { office: 1, everyday: 0.6, diwaniya: 0.2, wedding: 0 },
  wedding: { wedding: 1, diwaniya: 0.5, everyday: 0.2, office: 0 },
  everyday: { everyday: 1, office: 0.6, diwaniya: 0.3, wedding: 0.2 },
}

/**
 * Each character as families (weight of a family's share) and signature
 * notes (weight of each note found). A family share of 60% or more is a full
 * family match; notes confirm it, so a white musk is not read as heavy oud
 * just because the shelf files musk beside oud.
 */
const VIBES = {
  'heavy-oud': {
    families: { 'oud-musk': 1, 'bukhoor-oils': 1, 'french-arabic': 0.6, amber: 0.5 },
    notes: {
      'cambodi-oud': 1, 'hindi-oud': 1, frankincense: 0.5, 'birch-tar': 0.5,
      'resinous-woods': 0.5, leather: 0.5, 'amber-resin': 0.5, labdanum: 0.5,
    },
  },
  'fresh-blue': {
    families: { 'fresh-aquatic': 1 },
    notes: {
      'sea-salt': 1, 'marine-accord': 1, ambroxan: 0.5, neroli: 0.5, bergamot: 0.5,
      'calabrian-bergamot': 0.5, 'sicilian-lemon': 0.5, yuzu: 0.5, grapefruit: 0.5,
      'blood-orange': 0.5, mandarin: 0.5, 'green-mandarin': 0.5, petitgrain: 0.5,
    },
  },
  floral: {
    families: { rose: 1 },
    notes: {
      'taif-rose': 1, 'damask-rose': 1, 'rose-absolute': 1, 'jasmine-sambac': 1, tuberose: 1,
      jasmine: 0.5, 'orange-blossom': 0.5, neroli: 0.5, peony: 0.5, 'ylang-ylang': 0.5,
      honeysuckle: 0.5, 'rose-leaf': 0.5, iris: 0.5, 'iris-pallida': 0.5, 'orris-root': 0.5,
    },
  },
  'sweet-gourmand': {
    families: { gourmand: 1, amber: 0.7 },
    notes: {
      'arabic-coffee': 1, dates: 1, vanilla: 0.5, 'madagascan-vanilla': 0.5, tonka: 0.5,
      honey: 0.5, cardamom: 0.5, benzoin: 0.5, 'vanilla-orchid': 0.5, 'cinnamon-bark': 0.5,
      'dried-plum': 0.5,
    },
  },
}

const FULL_FAMILY_SHARE = 0.6
const FAMILY_PART = 0.7 // the rest of a character match comes from its notes

// Projection asked for → how well each SILLAGE level answers it.
const PROJECTION_FIT = {
  soft: { intimate: 1, moderate: 0.7, strong: 0.2, beast: 0 },
  noticeable: { intimate: 0.3, moderate: 0.9, strong: 1, beast: 0.5 },
  beast: { intimate: 0, moderate: 0.25, strong: 0.7, beast: 1 },
}

// Unisex fits every answer; a gendered composition fits its own fully and a
// shared request in part. One cut for the other wearer keeps only part of its
// whole score, so it surfaces only when nothing else comes close.
const OTHER_WEARER_FACTOR = 0.6
const WEARER_FIT = {
  him: { men: 1, unisex: 1, women: 0 },
  her: { women: 1, unisex: 1, men: 0 },
  anyone: { unisex: 1, men: 0.4, women: 0.4 },
}

const clamp01 = (n) => Math.min(1, Math.max(0, n))
const heatShare = (product) => clamp01(((product.heatResistance ?? 1) - 1) / 4)

/** In season, and how well it stands the heat: a summer answer weighs heat more than the calendar. */
const summerFit = (product) => (product.seasons.includes('summer') ? 0.4 : 0) + 0.6 * heatShare(product)
const winterFit = (product) => (product.seasons.includes('winter') ? 1 : 0.3)

const SEASON_FIT = {
  summer: summerFit,
  winter: winterFit,
  'all-year': (product) => (summerFit(product) + winterFit(product)) / 2,
}

// A family that can be named as the character itself ("built around Amber"
// answers "warm & sweet", not "heavy oud").
const NAMEABLE_WEIGHT = 0.7

/**
 * The character answer read against one product: the overall fit, the family
 * that carries it (largest share among the families that name the
 * character) and the first signature note it wears.
 */
function vibeMatch(product, vibeId) {
  const vibe = VIBES[vibeId]
  let share = 0
  let lead = null
  for (const [family, weight] of Object.entries(vibe.families)) {
    const percent = product.familyProfile?.[family] ?? 0
    share += (percent / 100) * weight
    if (weight >= NAMEABLE_WEIGHT && percent > 0 && (!lead || percent > lead.percent)) lead = { family, percent }
  }
  const notes = [...product.topNotes, ...product.heartNotes, ...product.baseNotes]
  const noteScore = notes.reduce((sum, note) => sum + (vibe.notes[note?.id] ?? 0), 0)
  const signature = notes.find((note) => vibe.notes[note?.id] === 1) ?? null
  const familyFit = clamp01(share / FULL_FAMILY_SHARE)
  const fit = FAMILY_PART * familyFit + (1 - FAMILY_PART) * clamp01(noteScore)
  return { fit, lead, signature }
}

/** How well a product answers each question, 0–1, keyed by question. Unanswered → absent. */
function fitsFor(product, answers) {
  const fits = {}
  if (answers.occasion) {
    const table = OCCASION_FIT[answers.occasion]
    fits.occasion = Math.max(0, ...product.occasions.map((id) => table[id] ?? 0))
  }
  if (answers.vibe) fits.vibe = vibeMatch(product, answers.vibe).fit
  if (answers.season) fits.season = SEASON_FIT[answers.season](product)
  if (answers.projection) fits.projection = PROJECTION_FIT[answers.projection][product.projectionSillage] ?? 0
  if (answers.wearer) fits.wearer = WEARER_FIT[answers.wearer][product.gender] ?? 0
  return fits
}

/* ---------------------------------------------------------------------------
 * Reasons
 * ------------------------------------------------------------------------- */

// Hours on skin from which longevity is worth saying out loud.
const LONG_WEAR_HOURS = 12

/**
 * Why a fragrance suits the answers, strongest first, at most three. Each is
 * { key, vars } for the finder dictionary; only matches that fully hold are
 * claimed, so a reason is never a stretch.
 */
function reasonsFor(product, answers, fits) {
  const found = []
  const add = (points, key, vars) => found.push({ points, key, vars, order: found.length })

  // The character, said the most specific true way: the family when it leads
  // the composition, else the signature note, else the family as an accent.
  if (answers.vibe && fits.vibe >= 0.6) {
    const { lead, signature } = vibeMatch(product, answers.vibe)
    const points = WEIGHTS.vibe * fits.vibe
    if (lead && lead.percent >= 50) add(points, 'finder.reason.familyMain', { family: lead.family })
    else if (signature) add(points, 'finder.reason.note', { note: signature.id })
    else if (lead && lead.percent >= 20) add(points, 'finder.reason.familyAccent', { family: lead.family })
  }
  if (answers.occasion && fits.occasion === 1) {
    add(WEIGHTS.occasion, `finder.reason.occasion.${answers.occasion}`)
  }
  if (answers.season) {
    const heat = product.heatResistance
    if (answers.season !== 'winter' && heat >= 4) {
      add(WEIGHTS.season * fits.season, heat >= 5 ? 'finder.reason.heatThrives' : 'finder.reason.heatHolds')
    } else if (answers.season === 'winter' && product.seasons.includes('winter')) {
      add(WEIGHTS.season, 'finder.reason.winter')
    } else if (answers.season === 'all-year' && product.seasons.length > 1) {
      add(WEIGHTS.season * fits.season, 'finder.reason.allYear')
    }
  }
  if (answers.projection && fits.projection >= 0.9) {
    add(WEIGHTS.projection * fits.projection, `finder.reason.projection.${product.projectionSillage}`)
  }
  if (answers.wearer === 'anyone' && product.gender === 'unisex') {
    add(WEIGHTS.wearer / 2, 'finder.reason.unisex')
  }
  if (product.longevity >= LONG_WEAR_HOURS) {
    add(8, 'finder.reason.longevity', { hours: product.longevity })
  }

  return found
    .sort((a, b) => b.points - a.points || a.order - b.order)
    .slice(0, 3)
    .map(({ key, vars }) => (vars ? { key, vars } : { key }))
}

/* ---------------------------------------------------------------------------
 * Ranking
 * ------------------------------------------------------------------------- */

/**
 * Every product, best match first: [{ product, score, reasons }]. score is an
 * integer 0–100 over the questions answered (all five for a full result).
 * Ties keep catalogue order, so the same answers always give the same list.
 */
export function recommend(answers, products) {
  const clean = sanitizeAnswers(answers)
  const asked = Object.keys(clean)
  const possible = asked.reduce((sum, id) => sum + WEIGHTS[id], 0)

  return products
    .map((product, index) => {
      const fits = fitsFor(product, clean)
      const earned = asked.reduce((sum, id) => sum + WEIGHTS[id] * fits[id], 0)
      const factor = fits.wearer === 0 ? OTHER_WEARER_FACTOR : 1
      const exact = possible ? (100 * earned * factor) / possible : 0
      return { product, index, exact, score: Math.round(exact), reasons: reasonsFor(product, clean, fits) }
    })
    .sort((a, b) => b.exact - a.exact || a.index - b.index)
    .map(({ product, score, reasons }) => ({ product, score, reasons }))
}

/**
 * The families a character answer points at, in display order, for "see all
 * matches in the catalogue". Families that only colour a character (weight
 * under one half) are left out. No character answered → [].
 */
export function familiesFor(answers) {
  const vibe = VIBES[sanitizeAnswers(answers).vibe]
  if (!vibe) return []
  return FAMILIES.map((family) => family.id).filter((id) => (vibe.families[id] ?? 0) >= 0.5)
}
