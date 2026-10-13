/**
 * The note dictionary. One entry per material, each with a single English
 * and a single Arabic name, so a note reads the same on every product and a
 * search in either language finds every fragrance that carries it.
 *
 * Names that are easily confused are kept apart on purpose:
 * amber (the warm accord, عنبر) is not ambergris (عنبر رمادي), amberwood or
 * ambroxan; neroli (نيرولي) is the distilled oil, orange blossom (زهر البرتقال)
 * the absolute. `aliases` are other spellings a customer might type.
 */

const ENTRIES = [
  // Rose & florals
  { id: 'taif-rose', en: 'Taif Rose', ar: 'ورد طائفي', aliases: ["Ta'if Rose", 'ورد الطائف'] },
  { id: 'damask-rose', en: 'Damask Rose', ar: 'ورد دمشقي' },
  { id: 'rose-absolute', en: 'Rose Absolute', ar: 'مطلق الورد' },
  { id: 'rose-leaf', en: 'Rose Leaf', ar: 'ورق الورد' },
  { id: 'peony', en: 'Peony', ar: 'فاوانيا' },
  { id: 'violet-leaf', en: 'Violet Leaf', ar: 'ورق البنفسج' },
  { id: 'jasmine', en: 'Jasmine', ar: 'ياسمين' },
  { id: 'jasmine-sambac', en: 'Jasmine Sambac', ar: 'ياسمين سمبك', aliases: ['Sambac Jasmine'] },
  { id: 'tuberose', en: 'Tuberose', ar: 'مسك الروم', aliases: ['تبروز'] },
  { id: 'ylang-ylang', en: 'Ylang-Ylang', ar: 'يلانغ يلانغ' },
  { id: 'neroli', en: 'Neroli', ar: 'نيرولي' },
  { id: 'orange-blossom', en: 'Orange Blossom', ar: 'زهر البرتقال' },
  { id: 'honeysuckle', en: 'Honeysuckle', ar: 'زهر العسل' },
  { id: 'iris', en: 'Iris', ar: 'سوسن' },
  { id: 'iris-pallida', en: 'Iris Pallida', ar: 'سوسن باليدا' },
  { id: 'orris-root', en: 'Orris Root', ar: 'جذر السوسن', aliases: ['Iris Root'] },
  { id: 'vanilla-orchid', en: 'Vanilla Orchid', ar: 'زهرة الفانيلا' },

  // Oud, musk & animalics
  { id: 'cambodi-oud', en: 'Cambodi Oud', ar: 'عود كمبودي', aliases: ['Cambodian Oud', 'Kambodi Oud', 'Oudh', 'Aoud', 'Agarwood'] },
  { id: 'hindi-oud', en: 'Hindi Oud', ar: 'عود هندي', aliases: ['Indian Oud', 'Oudh', 'Aoud', 'Agarwood'] },
  { id: 'musk', en: 'Musk', ar: 'مسك' },
  { id: 'white-musk', en: 'White Musk', ar: 'مسك أبيض' },
  { id: 'ambrette-seed', en: 'Ambrette Seed', ar: 'حبّ المسك', aliases: ['Ambrette'] },
  { id: 'cashmeran', en: 'Cashmeran', ar: 'كشميران' },
  { id: 'leather', en: 'Leather', ar: 'جلد' },

  // Amber, resins & incense
  { id: 'amber', en: 'Amber', ar: 'عنبر' },
  { id: 'amber-resin', en: 'Amber Resin', ar: 'راتنج العنبر' },
  { id: 'ambergris', en: 'Ambergris', ar: 'عنبر رمادي', aliases: ['Grey Amber', 'Ambre Gris', 'العنبر الخام'] },
  { id: 'ambroxan', en: 'Ambroxan', ar: 'أمبروكسان' },
  { id: 'amberwood', en: 'Amberwood', ar: 'خشب العنبر' },
  { id: 'labdanum', en: 'Labdanum', ar: 'لادن' },
  { id: 'benzoin', en: 'Benzoin', ar: 'لبان جاوي', aliases: ['جاوي', 'بنزوين'] },
  { id: 'frankincense', en: 'Frankincense', ar: 'لبان', aliases: ['Olibanum', 'Luban', 'لبان ظفاري'] },
  { id: 'birch-tar', en: 'Birch Tar', ar: 'قطران البتولا' },

  // Woods & earth
  { id: 'sandalwood', en: 'Sandalwood', ar: 'صندل' },
  { id: 'mysore-sandalwood', en: 'Mysore Sandalwood', ar: 'صندل ميسوري' },
  { id: 'cedar', en: 'Cedar', ar: 'خشب الأرز' },
  { id: 'atlas-cedar', en: 'Atlas Cedar', ar: 'أرز الأطلس' },
  { id: 'cashmere-wood', en: 'Cashmere Wood', ar: 'خشب الكشمير' },
  { id: 'guaiac-wood', en: 'Guaiac Wood', ar: 'خشب الغاياك' },
  { id: 'driftwood', en: 'Driftwood', ar: 'الخشب الطافي' },
  { id: 'blond-woods', en: 'Blond Woods', ar: 'أخشاب فاتحة' },
  { id: 'resinous-woods', en: 'Resinous Woods', ar: 'أخشاب راتنجية' },
  { id: 'vetiver', en: 'Vetiver', ar: 'نجيل الهند' },
  { id: 'haitian-vetiver', en: 'Haitian Vetiver', ar: 'نجيل الهند الهايتي' },
  { id: 'oakmoss', en: 'Oakmoss', ar: 'طحلب البلوط' },
  { id: 'patchouli', en: 'Patchouli', ar: 'باتشولي' },
  { id: 'tobacco', en: 'Tobacco Leaf', ar: 'ورق التبغ', aliases: ['Tobacco'] },

  // Spice
  { id: 'saffron', en: 'Saffron', ar: 'زعفران' },
  { id: 'cardamom', en: 'Cardamom', ar: 'هيل', aliases: ['Green Cardamom'] },
  { id: 'pink-pepper', en: 'Pink Pepper', ar: 'فلفل وردي', aliases: ['Pink Peppercorn'] },
  { id: 'black-pepper', en: 'Black Pepper', ar: 'فلفل أسود' },
  { id: 'nutmeg', en: 'Nutmeg', ar: 'جوزة الطيب' },
  { id: 'cinnamon-bark', en: 'Cinnamon Bark', ar: 'لحاء القرفة' },
  { id: 'juniper', en: 'Juniper', ar: 'عرعر' },
  { id: 'cypress', en: 'Cypress', ar: 'سرو' },

  // Gourmand
  { id: 'arabic-coffee', en: 'Arabic Coffee', ar: 'قهوة عربية', aliases: ['Qahwa', 'Gahwa'] },
  { id: 'dates', en: 'Dates', ar: 'تمر' },
  { id: 'vanilla', en: 'Vanilla', ar: 'فانيلا' },
  { id: 'madagascan-vanilla', en: 'Madagascan Vanilla', ar: 'فانيلا مدغشقرية' },
  { id: 'tonka', en: 'Tonka Bean', ar: 'حبّ التونكا', aliases: ['Tonka'] },
  { id: 'honey', en: 'Honey', ar: 'عسل', aliases: ['Honey Accord', 'Wild Honey'] },
  { id: 'dried-plum', en: 'Dried Plum', ar: 'برقوق مجفّف' },
  { id: 'lychee', en: 'Lychee', ar: 'ليتشي' },
  { id: 'green-fig', en: 'Green Fig', ar: 'تين أخضر' },

  // Citrus & fresh
  { id: 'bergamot', en: 'Bergamot', ar: 'برغموت' },
  { id: 'calabrian-bergamot', en: 'Calabrian Bergamot', ar: 'برغموت كالابري' },
  { id: 'sicilian-lemon', en: 'Sicilian Lemon', ar: 'ليمون صقلي' },
  { id: 'yuzu', en: 'Yuzu', ar: 'يوزو' },
  { id: 'blood-orange', en: 'Blood Orange', ar: 'برتقال دموي' },
  { id: 'mandarin', en: 'Mandarin', ar: 'يوسفي' },
  { id: 'green-mandarin', en: 'Green Mandarin', ar: 'يوسفي أخضر' },
  { id: 'grapefruit', en: 'Grapefruit', ar: 'جريب فروت' },
  { id: 'petitgrain', en: 'Petitgrain', ar: 'بتيتغرين' },
  { id: 'aldehydes', en: 'Aldehydes', ar: 'ألدهيدات' },
  { id: 'sea-salt', en: 'Sea Salt', ar: 'ملح البحر' },
  { id: 'marine-accord', en: 'Marine Accord', ar: 'أكورد بحري' },
]

/** Every note, keyed by id. Products hold these exact objects. */
export const NOTES = Object.fromEntries(ENTRIES.map((note) => [note.id, Object.freeze(note)]))

/** Every note, A–Z by English name — for search indexes and pickers. */
export const NOTE_LIST = Object.values(NOTES).sort((a, b) => a.en.localeCompare(b.en, 'en'))
