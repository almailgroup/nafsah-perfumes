/**
 * Kuwait's six governorates and their residential areas — the address the
 * checkout asks for and the area the delivery promise is worked out from.
 *
 * English follows the spelling Kuwaitis use on street signs and delivery
 * apps (Salmiya, Jabriya, Egaila), not a scholarly transliteration. Areas
 * that are mainly industrial, agricultural or offshore are left out; anyone
 * outside the list picks "Other" and types the area name.
 *
 * Remote areas (the far south, the far north and Failaka) never get
 * same-day delivery and carry a surcharge — see src/data/delivery.js.
 */

export const GOVERNORATES = [
  {
    id: 'capital',
    en: 'Al Asimah (Capital)',
    ar: 'العاصمة',
    // Inside an address line the parenthesis is noise.
    short: { en: 'Al Asimah', ar: 'العاصمة' },
  },
  { id: 'hawalli', en: 'Hawalli', ar: 'حولي' },
  { id: 'farwaniya', en: 'Farwaniya', ar: 'الفروانية' },
  { id: 'mubarak-al-kabeer', en: 'Mubarak Al-Kabeer', ar: 'مبارك الكبير' },
  { id: 'ahmadi', en: 'Ahmadi', ar: 'الأحمدي' },
  { id: 'jahra', en: 'Jahra', ar: 'الجهراء' },
]

/** The area value for an address outside the list; `areaOther` then holds its name. */
export const OTHER_AREA_ID = 'other'

const REMOTE = true

// [id, English, Arabic, remote?] per governorate, alphabetical by English.
const ROWS = {
  capital: [
    ['abdullah-al-salem', 'Abdullah Al-Salem', 'ضاحية عبدالله السالم'],
    ['adailiya', 'Adailiya', 'العديلية'],
    ['bneid-al-gar', 'Bneid Al-Gar', 'بنيد القار'],
    ['daiya', 'Daiya', 'الدعية'],
    ['dasma', 'Dasma', 'الدسمة'],
    ['dasman', 'Dasman', 'دسمان'],
    ['doha', 'Doha', 'الدوحة'],
    ['faiha', 'Faiha', 'الفيحاء'],
    ['failaka', 'Failaka Island', 'جزيرة فيلكا', REMOTE],
    ['granada', 'Granada', 'غرناطة'],
    ['jaber-al-ahmad', 'Jaber Al-Ahmad City', 'مدينة جابر الأحمد'],
    ['kaifan', 'Kaifan', 'كيفان'],
    ['khaldiya', 'Khaldiya', 'الخالدية'],
    ['mansouriya', 'Mansouriya', 'المنصورية'],
    ['mirqab', 'Mirqab', 'المرقاب'],
    ['north-west-sulaibikhat', 'North West Sulaibikhat', 'شمال غرب الصليبيخات'],
    ['nuzha', 'Nuzha', 'النزهة'],
    ['qadsiya', 'Qadsiya', 'القادسية'],
    ['qibla', 'Qibla', 'القبلة'],
    ['qurtuba', 'Qurtuba', 'قرطبة'],
    ['rawda', 'Rawda', 'الروضة'],
    ['shamiya', 'Shamiya', 'الشامية'],
    ['sharq', 'Sharq', 'شرق'],
    ['shuwaikh', 'Shuwaikh Residential', 'الشويخ السكني'],
    ['sulaibikhat', 'Sulaibikhat', 'الصليبيخات'],
    ['surra', 'Surra', 'السرة'],
    ['yarmouk', 'Yarmouk', 'اليرموك'],
  ],
  hawalli: [
    ['bayan', 'Bayan', 'بيان'],
    ['bidaa', "Bida'a", 'البدع'],
    ['hawalli', 'Hawalli', 'حولي'],
    ['hitteen', 'Hitteen', 'حطين'],
    ['jabriya', 'Jabriya', 'الجابرية'],
    ['maidan-hawalli', 'Maidan Hawalli', 'ميدان حولي'],
    ['mishref', 'Mishref', 'مشرف'],
    ['mubarak-al-abdullah', 'Mubarak Al-Abdullah (West Mishref)', 'مبارك العبدالله (غرب مشرف)'],
    ['rumaithiya', 'Rumaithiya', 'الرميثية'],
    ['salam', 'Salam', 'السلام'],
    ['salmiya', 'Salmiya', 'السالمية'],
    ['salwa', 'Salwa', 'سلوى'],
    ['shaab', 'Shaab', 'الشعب'],
    ['shuhada', 'Shuhada', 'الشهداء'],
    ['siddiq', 'Siddiq', 'الصديق'],
    ['zahra', 'Zahra', 'الزهراء'],
  ],
  farwaniya: [
    ['abbasiya', 'Abbasiya', 'العباسية'],
    ['abdullah-al-mubarak', 'Abdullah Al-Mubarak (West Jleeb)', 'عبدالله المبارك (غرب الجليب)'],
    ['abraq-khaitan', 'Abraq Khaitan', 'أبرق خيطان'],
    ['andalous', 'Andalous', 'الأندلس'],
    ['ardiya', 'Ardiya', 'العارضية'],
    ['farwaniya', 'Farwaniya', 'الفروانية'],
    ['firdous', 'Firdous', 'الفردوس'],
    ['hasawi', 'Hasawi', 'الحساوي'],
    ['ishbiliya', 'Ishbiliya', 'إشبيلية'],
    ['jleeb-al-shuyoukh', 'Jleeb Al-Shuyoukh', 'جليب الشيوخ'],
    ['khaitan', 'Khaitan', 'خيطان'],
    ['omariya', 'Omariya', 'العمرية'],
    ['rabiya', 'Rabiya', 'الرابية'],
    ['rehab', 'Rehab', 'الرحاب'],
    ['riggae', 'Riggae', 'الرقعي'],
    ['sabah-al-nasser', 'Sabah Al-Nasser', 'صباح الناصر'],
    ['west-abdullah-al-mubarak', 'West Abdullah Al-Mubarak', 'غرب عبدالله المبارك'],
  ],
  'mubarak-al-kabeer': [
    ['abu-al-hasaniya', 'Abu Al-Hasaniya', 'أبو الحصانية'],
    ['abu-fatira', 'Abu Fatira', 'أبو فطيرة'],
    ['adan', 'Adan', 'العدان'],
    ['fnaitees', 'Fnaitees', 'الفنيطيس'],
    ['masayel', 'Masayel', 'المسايل'],
    ['messila', 'Messila', 'المسيلة'],
    ['mubarak-al-kabeer', 'Mubarak Al-Kabeer', 'مبارك الكبير'],
    ['qurain', 'Qurain', 'القرين'],
    ['qusour', 'Qusour', 'القصور'],
    ['sabah-al-salem', 'Sabah Al-Salem', 'صباح السالم'],
    ['wista', 'Wista', 'الوسطى'],
  ],
  ahmadi: [
    ['abu-halifa', 'Abu Halifa', 'أبو حليفة'],
    ['ahmadi', 'Ahmadi', 'الأحمدي'],
    ['ali-sabah-al-salem', 'Ali Sabah Al-Salem (Umm Al-Hayman)', 'علي صباح السالم (أم الهيمان)'],
    ['bneider', 'Bneider', 'بنيدر', REMOTE],
    ['dhaher', 'Dhaher', 'الظهر'],
    ['egaila', 'Egaila', 'العقيلة'],
    ['fahad-al-ahmad', 'Fahad Al-Ahmad', 'فهد الأحمد'],
    ['fahaheel', 'Fahaheel', 'الفحيحيل'],
    ['fintas', 'Fintas', 'الفنطاس'],
    ['hadiya', 'Hadiya', 'هدية'],
    ['jaber-al-ali', 'Jaber Al-Ali', 'جابر العلي'],
    ['julaia', "Al Julaia'a", 'الجليعة', REMOTE],
    ['khiran', 'Al Khiran', 'الخيران', REMOTE],
    ['mahboula', 'Mahboula', 'المهبولة'],
    ['mangaf', 'Mangaf', 'المنقف'],
    ['nuwaiseeb', 'Al Nuwaiseeb', 'النويصيب', REMOTE],
    ['riqqa', 'Riqqa', 'الرقة'],
    ['sabah-al-ahmad', 'Sabah Al-Ahmad Residential City', 'مدينة صباح الأحمد السكنية', REMOTE],
    ['sabah-al-ahmad-sea-city', 'Sabah Al-Ahmad Sea City', 'مدينة صباح الأحمد البحرية', REMOTE],
    ['sabahiya', 'Sabahiya', 'الصباحية'],
    ['wafra', 'Al Wafra', 'الوفرة', REMOTE],
    ['zour', 'Al Zour', 'الزور', REMOTE],
  ],
  jahra: [
    ['abdali', 'Al Abdali', 'العبدلي', REMOTE],
    ['jahra', 'Jahra', 'الجهراء'],
    ['kabd', 'Kabd', 'كبد', REMOTE],
    ['mutlaa', "Al Mutla'a", 'المطلاع', REMOTE],
    ['naeem', 'Naeem', 'النعيم'],
    ['nahdha', 'Nahdha', 'النهضة'],
    ['nasseem', 'Nasseem', 'النسيم'],
    ['oyoun', 'Oyoun', 'العيون'],
    ['qairawan', 'Qairawan', 'القيروان'],
    ['qasr', 'Qasr', 'القصر'],
    ['rawdatain', 'Al Rawdatain', 'الروضتين', REMOTE],
    ['saad-al-abdullah', 'Saad Al-Abdullah', 'سعد العبدالله'],
    ['salmi', 'Al Salmi', 'السالمي', REMOTE],
    ['subiya', 'Al Subiya', 'الصبية', REMOTE],
    ['sulaibiya', 'Sulaibiya', 'الصليبية'],
    ['taima', 'Taima', 'تيماء'],
    ['waha', 'Waha', 'الواحة'],
  ],
}

/** Every residential area: { id, governorate, en, ar, remote }. */
export const AREAS = Object.entries(ROWS).flatMap(([governorate, rows]) =>
  rows.map(([id, en, ar, remote = false]) => ({ id, governorate, en, ar, remote })),
)

export const GOVERNORATE_BY_ID = Object.fromEntries(GOVERNORATES.map((g) => [g.id, g]))
export const AREA_BY_ID = Object.fromEntries(AREAS.map((a) => [a.id, a]))

// "Al Khiran" belongs under K and "الخيران" under خ, as a Kuwaiti looks for them.
const ARTICLE = { en: /^al[\s-]+/i, ar: /^ال/ }
const collators = {}
const sortedCache = new Map()

/**
 * The areas of one governorate, alphabetical in the given language (English
 * by default), ignoring a leading "Al" / "ال". Unknown governorate → [].
 */
export const areasIn = (governorateId, lang = 'en') => {
  const key = `${governorateId}|${lang}`
  if (!sortedCache.has(key)) {
    const field = lang === 'ar' ? 'ar' : 'en'
    collators[field] ??= new Intl.Collator(field)
    const bare = (area) => area[field].replace(ARTICLE[field], '')
    const list = AREAS.filter((a) => a.governorate === governorateId).sort((a, b) =>
      collators[field].compare(bare(a), bare(b)),
    )
    // Shared between callers, so nobody may sort it in place.
    sortedCache.set(key, Object.freeze(list))
  }
  return sortedCache.get(key)
}

export const isRemoteArea = (areaId) => Boolean(AREA_BY_ID[areaId]?.remote)
