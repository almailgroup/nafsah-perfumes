/**
 * Catalogue data for the Nafsah house.
 *
 * Every fragrance carries a `palette` used by <BottleVisual /> to render its
 * image placeholder, so the grid stays visually rich without binary assets.
 * Prices are integer fils (1 KWD = 1000 fils) on each entry of `formats`.
 * Ids are enumerated in ./taxonomy and notes come from ./notes; the shape is
 * checked by ./schema in the tests.
 *
 * Longevity, sillage and heat resistance are the house's own guidance, not
 * customer ratings. Ratings come only from real reviews.
 */

import { NOTES } from './notes'
import { byId, FORMAT_BY_ID } from './taxonomy'

/** Note objects from their ids. */
const notes = (...ids) => ids.map((id) => NOTES[id])

/** One entry of the size toggle, at the format's standard volume. */
const format = (id, priceFils) => ({ id, ml: FORMAT_BY_ID[id]?.ml, priceFils })

export const PRODUCTS = [
  {
    id: 'oud-noir',
    name: { en: 'Oud Noir', ar: 'العود الأسود' },
    tagline: { en: 'Smoked oud, ink-dark and unhurried', ar: 'عود مدخّن، حالك وغير متعجّل' },
    description: {
      en: 'A resinous oud aged eighteen months and lifted by rose absolute. Worn close to the skin it reads like warm leather in a dark room.',
      ar: 'عود راتنجي مُعتَّق ثمانية عشر شهراً، يرفعه مطلق الورد. على البشرة مباشرةً يُقرأ كجلدٍ دافئ في غرفة معتمة.',
    },
    family: 'oud-musk',
    familyProfile: { 'oud-musk': 60, rose: 20, amber: 20 },
    concentration: 'extrait',
    gender: 'unisex',
    longevity: 12,
    projectionSillage: 'strong',
    heatResistance: 3,
    seasons: ['winter'],
    occasions: ['diwaniya', 'wedding'],
    topNotes: notes('bergamot', 'pink-pepper'),
    heartNotes: notes('cambodi-oud', 'damask-rose'),
    baseNotes: notes('sandalwood', 'leather', 'vetiver'),
    layering: [
      {
        kind: 'bukhoor',
        name: { en: 'Oud bukhoor', ar: 'بخور العود' },
        how: {
          en: 'Hold the dishdasha or abaya over the mabkhara for a minute, then spray once the smoke has settled into the cloth.',
          ar: 'بخّر الدشداشة أو العباءة فوق المبخرة دقيقة، ثم رُشّ العطر بعد أن يستقرّ الدخان في القماش.',
        },
      },
      {
        kind: 'attar',
        productId: 'ward-taifi',
        how: {
          en: 'A drop of Taif rose oil on each wrist first, then Oud Noir over it to bring the rose in its heart forward.',
          ar: 'قطرة من دهن الورد الطائفي على كل معصم أولاً، ثم «العود الأسود» فوقها ليتقدّم الورد الذي في قلبه.',
        },
      },
      {
        kind: 'spray',
        productId: 'musc-blanc',
        how: {
          en: 'Musc Blanc on the neck before Oud Noir: musk under oud softens the smoke and carries it further into the night.',
          ar: '«المسك الأبيض» على الرقبة قبل «العود الأسود»: المسك تحت العود يليّن الدخان ويمدّ أثره إلى آخر الليل.',
        },
      },
    ],
    formats: [
      format('full', 119000),
      format('spray50', 75000),
      format('quarter-tola', 29000),
      format('sample', 4500),
    ],
    palette: { from: '#4a2c1a', via: '#8a5a2b', to: '#c9a961', glass: '#241611' },
    year: 2019,
    bestseller: true,
    isNew: false,
  },
  {
    id: 'rose-imperiale',
    name: { en: 'Rose Impériale', ar: 'الوردة الإمبراطورية' },
    tagline: { en: 'Damask rose at first light', ar: 'وردة دمشقية عند أول الضوء' },
    description: {
      en: 'Three thousand Damask roses distilled for a single flacon. Dewy and translucent at the top, powdery and quiet by the fourth hour.',
      ar: 'ثلاثة آلاف وردة دمشقية تُقطَّر لقارورة واحدة. نديٌّ شفيف في مطلعه، بودريٌّ هادئ عند الساعة الرابعة.',
    },
    family: 'rose',
    familyProfile: { rose: 75, 'oud-musk': 25 },
    concentration: 'edp',
    gender: 'women',
    longevity: 8,
    projectionSillage: 'moderate',
    heatResistance: 3,
    seasons: ['summer', 'winter'],
    occasions: ['wedding', 'everyday', 'office'],
    topNotes: notes('lychee', 'pink-pepper'),
    heartNotes: notes('damask-rose', 'peony', 'violet-leaf'),
    baseNotes: notes('white-musk', 'cashmere-wood'),
    layering: [
      {
        kind: 'bukhoor',
        name: { en: 'Rose bukhoor', ar: 'بخور الورد' },
        how: {
          en: 'Let the hair and shayla take in rose bukhoor smoke, then spray Rose Impériale on the ends of the hair.',
          ar: 'بخّري الشعر والشيلة ببخور الورد، ثم رُشّي «الوردة الإمبراطورية» على أطراف الشعر.',
        },
      },
      {
        kind: 'attar',
        productId: 'dehn-al-oud',
        how: {
          en: 'One drop of Dehn Al Oud on the pulse points underneath turns it into a classic rose and oud for the evening.',
          ar: 'قطرة واحدة من دهن العود على نقاط النبض تحته تحوّله إلى ورد وعود كلاسيكي للمساء.',
        },
      },
      {
        kind: 'spray',
        productId: 'musc-blanc',
        how: {
          en: 'Musc Blanc sprayed first keeps the rose soft and close for the office.',
          ar: 'رشّة من «المسك الأبيض» أولاً تُبقي الوردة ناعمة وقريبة من البشرة في العمل.',
        },
      },
    ],
    formats: [format('full', 105000), format('spray50', 65000), format('sample', 4000)],
    palette: { from: '#5c2438', via: '#b06a7d', to: '#f0cdd4', glass: '#2a1520' },
    year: 2021,
    bestseller: true,
    isNew: false,
  },
  {
    id: 'citron-de-mer',
    name: { en: 'Citron de Mer', ar: 'ليمون البحر' },
    tagline: { en: 'Sicilian lemon over cold salt air', ar: 'ليمون صقلي فوق هواء مالح بارد' },
    description: {
      en: 'Built for heat. Cold-pressed lemon and yuzu snap against a mineral salt accord, then settle into sun-bleached driftwood, with ambroxan underneath to carry it across a room at noon.',
      ar: 'صُنع للحرّ. ليمون معصور على البارد ويوزو ينقدحان على أكورد ملحي معدني، ثم يستقرّان على خشبٍ طافٍ بهتته الشمس، ومن تحتهما أمبروكسان يحمله عبر المكان في عزّ الظهيرة.',
    },
    family: 'fresh-aquatic',
    familyProfile: { 'fresh-aquatic': 80, amber: 20 },
    concentration: 'edp',
    gender: 'men',
    longevity: 7,
    projectionSillage: 'beast',
    heatResistance: 5,
    seasons: ['summer'],
    occasions: ['office', 'everyday'],
    topNotes: notes('sicilian-lemon', 'yuzu', 'sea-salt'),
    heartNotes: notes('neroli', 'marine-accord'),
    baseNotes: notes('driftwood', 'ambrette-seed', 'ambroxan'),
    layering: [
      {
        kind: 'spray',
        productId: 'musc-blanc',
        how: {
          en: 'Musc Blanc on the skin first, Citron de Mer over it: the musk holds the citrus past midday.',
          ar: '«المسك الأبيض» على البشرة أولاً ثم «ليمون البحر» فوقه: المسك يُمسك الحمضيات إلى ما بعد الظهر.',
        },
      },
      {
        kind: 'bukhoor',
        name: { en: 'Light sandalwood bukhoor', ar: 'بخور صندل خفيف' },
        how: {
          en: 'Pass the ghutra briefly over a light sandalwood bukhoor in the morning; the citrus sits on top of the smoke without fighting it.',
          ar: 'مرّر الغترة سريعاً فوق بخور صندل خفيف في الصباح، فتجلس الحمضيات فوق الدخان دون أن تتنازع معه.',
        },
      },
    ],
    formats: [format('full', 79500), format('spray50', 49500), format('sample', 3500)],
    palette: { from: '#1c4a4a', via: '#57a6a0', to: '#e6d98a', glass: '#10262a' },
    year: 2022,
    bestseller: false,
    isNew: false,
  },
  {
    id: 'ambre-royale',
    name: { en: 'Ambre Royale', ar: 'العنبر الملكي' },
    tagline: { en: 'Amber, vanilla and slow-burning resin', ar: 'عنبر وفانيلا وراتنج بطيء الاحتراق' },
    description: {
      en: 'The house signature. Saffron and cardamom open onto a bed of labdanum and vanilla that lingers on wool for days.',
      ar: 'توقيع الدار. زعفران وهيل ينفتحان على فراش من اللادن والفانيلا يبقى على الصوف أياماً.',
    },
    family: 'amber',
    familyProfile: { amber: 55, gourmand: 25, 'french-arabic': 20 },
    concentration: 'extrait',
    gender: 'unisex',
    longevity: 14,
    projectionSillage: 'strong',
    heatResistance: 2,
    seasons: ['winter'],
    occasions: ['wedding', 'diwaniya'],
    topNotes: notes('saffron', 'cardamom'),
    heartNotes: notes('amber-resin', 'labdanum', 'jasmine'),
    baseNotes: notes('madagascan-vanilla', 'benzoin', 'tonka'),
    layering: [
      {
        kind: 'bukhoor',
        name: { en: 'Amber bukhoor', ar: 'بخور العنبر' },
        how: {
          en: 'Perfume the bisht or abaya with amber bukhoor, then spray Ambre Royale on the wool where the smoke has been.',
          ar: 'بخّر البشت أو العباءة ببخور العنبر، ثم رُشّ «العنبر الملكي» على الصوف حيث مرّ الدخان.',
        },
      },
      {
        kind: 'attar',
        productId: 'dehn-al-oud',
        how: {
          en: 'A drop of Dehn Al Oud on the wrists under Ambre Royale lends the vanilla a dark edge of leather.',
          ar: 'قطرة من دهن العود على المعصمين تحت «العنبر الملكي» تمنح الفانيلا حافّة داكنة من الجلد.',
        },
      },
      {
        kind: 'spray',
        productId: 'qahwa',
        how: {
          en: 'Qahwa on the chest and Ambre Royale on the neck for a long winter diwaniya: saffron answers saffron.',
          ar: '«قهوة» على الصدر و«العنبر الملكي» على الرقبة لديوانية شتوية طويلة، فيلتقي الزعفران بالزعفران.',
        },
      },
    ],
    formats: [
      format('full', 135000),
      format('spray50', 89000),
      format('quarter-tola', 34000),
      format('sample', 5000),
    ],
    palette: { from: '#5a2f10', via: '#c07c2a', to: '#f2d79a', glass: '#2c1a08' },
    year: 2018,
    bestseller: true,
    isNew: false,
  },
  {
    id: 'santal-blanc',
    name: { en: 'Santal Blanc', ar: 'الصندل الأبيض' },
    tagline: { en: 'Creamy sandalwood, worn like linen', ar: 'صندل كريمي يُلبس كالكتّان' },
    description: {
      en: 'Sandalwood without the smoke. Iris gives it a powdery softness that makes it read closer to skin than to wood.',
      ar: 'خشب صندل بلا دخان. السوسن يمنحه نعومة بودرية تجعله أقرب إلى البشرة منه إلى الخشب.',
    },
    family: 'french-arabic',
    familyProfile: { 'french-arabic': 55, 'oud-musk': 25, rose: 20 },
    concentration: 'edp',
    gender: 'unisex',
    longevity: 9,
    projectionSillage: 'moderate',
    heatResistance: 4,
    seasons: ['summer', 'winter'],
    occasions: ['office', 'everyday'],
    topNotes: notes('violet-leaf', 'cardamom'),
    heartNotes: notes('mysore-sandalwood', 'iris'),
    baseNotes: notes('cedar', 'tonka', 'musk'),
    layering: [
      {
        kind: 'attar',
        productId: 'ward-taifi',
        how: {
          en: 'Taif rose oil on the pulse points under Santal Blanc: rose over sandalwood, a pairing older than the bottle.',
          ar: 'دهن الورد الطائفي على نقاط النبض تحت «الصندل الأبيض»: ورد فوق صندل، اقتران أقدم من القارورة نفسها.',
        },
      },
      {
        kind: 'bukhoor',
        name: { en: 'Sandalwood bukhoor', ar: 'بخور الصندل' },
        how: {
          en: 'Give the dishdasha a short pass of sandalwood bukhoor, then one light spray for the office.',
          ar: 'مرّر الدشداشة مروراً قصيراً فوق بخور الصندل، ثم رشّة خفيفة واحدة للعمل.',
        },
      },
    ],
    formats: [format('full', 95000), format('spray50', 59000), format('sample', 4000)],
    palette: { from: '#4c4132', via: '#a2907a', to: '#e8dcc6', glass: '#241f18' },
    year: 2020,
    bestseller: false,
    isNew: false,
  },
  {
    id: 'nuit-de-jasmin',
    name: { en: 'Nuit de Jasmin', ar: 'ليلة الياسمين' },
    tagline: { en: 'Night-blooming jasmine and tuberose', ar: 'ياسمين ليلي ومسك الروم' },
    description: {
      en: 'Jasmine picked between midnight and dawn, when the flower gives up its most indolic facets. Unapologetically nocturnal.',
      ar: 'ياسمين يُقطف بين منتصف الليل والفجر، حين تمنح الزهرة أكثر أوجهها عمقاً. ليليٌّ بلا اعتذار.',
    },
    family: 'rose',
    familyProfile: { rose: 70, amber: 30 },
    concentration: 'extrait',
    gender: 'women',
    longevity: 10,
    projectionSillage: 'strong',
    heatResistance: 3,
    seasons: ['winter'],
    occasions: ['wedding'],
    topNotes: notes('mandarin', 'green-fig'),
    heartNotes: notes('jasmine-sambac', 'tuberose', 'ylang-ylang'),
    baseNotes: notes('sandalwood', 'vanilla-orchid'),
    layering: [
      {
        kind: 'bukhoor',
        name: { en: 'Oud bukhoor', ar: 'بخور العود' },
        how: {
          en: 'Before a wedding, smoke the hair and abaya with oud bukhoor, then spray Nuit de Jasmin on the ends of the hair.',
          ar: 'قبل العرس، بخّري الشعر والعباءة ببخور العود، ثم رُشّي «ليلة الياسمين» على أطراف الشعر.',
        },
      },
      {
        kind: 'attar',
        productId: 'dehn-al-oud',
        how: {
          en: 'A drop of Dehn Al Oud behind the ears gives the jasmine a dark root that lasts until the last guest leaves.',
          ar: 'قطرة من دهن العود خلف الأذنين تمنح الياسمين جذراً داكناً يدوم حتى يغادر آخر الضيوف.',
        },
      },
    ],
    formats: [format('full', 125000), format('spray50', 79000), format('sample', 4500)],
    palette: { from: '#2b2350', via: '#6f6bb0', to: '#e9e2f5', glass: '#161238' },
    year: 2023,
    bestseller: false,
    isNew: true,
  },
  {
    id: 'bergamote-dor',
    name: { en: "Bergamote d'Or", ar: 'البرغموت الذهبي' },
    tagline: { en: 'Gilded bergamot with a honeyed finish', ar: 'برغموت مذهّب بنهاية عسلية' },
    description: {
      en: 'Calabrian bergamot rounded with a raw honey accord so the citrus never turns thin. Bright for an hour, golden for four more.',
      ar: 'برغموت كالابري يُدوَّر بأكورد عسل خام كي لا يرقّ الحمضي أبداً. ساطع لساعة، وذهبيّ لأربع ساعات بعدها.',
    },
    family: 'fresh-aquatic',
    familyProfile: { 'fresh-aquatic': 65, gourmand: 20, rose: 15 },
    concentration: 'edt',
    gender: 'unisex',
    longevity: 5,
    projectionSillage: 'moderate',
    heatResistance: 4,
    seasons: ['summer'],
    occasions: ['office', 'everyday'],
    topNotes: notes('calabrian-bergamot', 'blood-orange'),
    heartNotes: notes('orange-blossom', 'honey'),
    baseNotes: notes('amberwood', 'white-musk'),
    layering: [
      {
        kind: 'spray',
        productId: 'musc-blanc',
        how: {
          en: 'Musc Blanc underneath stretches the golden drydown through a summer working day.',
          ar: '«المسك الأبيض» تحته يُطيل الختام الذهبي طوال يوم عمل صيفي.',
        },
      },
      {
        kind: 'attar',
        productId: 'ward-taifi',
        how: {
          en: 'A dab of Taif rose oil on the wrists turns the orange blossom into a soft rose for the evening.',
          ar: 'لمسة من دهن الورد الطائفي على المعصمين تحوّل زهر البرتقال إلى وردة ناعمة للمساء.',
        },
      },
    ],
    formats: [format('full', 85000), format('spray50', 53000), format('sample', 3500)],
    palette: { from: '#6b4a10', via: '#d9a32c', to: '#f7e6a8', glass: '#2e2109' },
    year: 2022,
    bestseller: false,
    isNew: false,
  },
  {
    id: 'safran-imperial',
    name: { en: 'Safran Impérial', ar: 'الزعفران الإمبراطوري' },
    tagline: { en: 'Saffron threads over warm spice', ar: 'خيوط زعفران فوق توابل دافئة' },
    description: {
      en: 'Saffron at full strength, tempered by rose absolute and cinnamon bark. A cold-weather fragrance with a long, dry finish.',
      ar: 'زعفران بكامل قوّته، يلطّفه مطلق الورد ولحاء القرفة. عطر للطقس البارد بخاتمة جافّة طويلة.',
    },
    family: 'french-arabic',
    familyProfile: { 'french-arabic': 50, 'oud-musk': 30, rose: 20 },
    concentration: 'extrait',
    gender: 'unisex',
    longevity: 12,
    projectionSillage: 'beast',
    heatResistance: 3,
    seasons: ['winter'],
    occasions: ['diwaniya', 'wedding'],
    topNotes: notes('saffron', 'nutmeg', 'pink-pepper'),
    heartNotes: notes('rose-absolute', 'cinnamon-bark'),
    baseNotes: notes('hindi-oud', 'amber', 'patchouli'),
    layering: [
      {
        kind: 'bukhoor',
        name: { en: 'Oud bukhoor', ar: 'بخور العود' },
        how: {
          en: 'Smoke the dishdasha and ghutra over oud bukhoor, then spray Safran Impérial on the chest.',
          ar: 'بخّر الدشداشة والغترة ببخور العود، ثم رُشّ «الزعفران الإمبراطوري» على الصدر.',
        },
      },
      {
        kind: 'attar',
        productId: 'ward-taifi',
        how: {
          en: 'Taif rose oil on the pulse points draws the rose absolute forward through the saffron.',
          ar: 'دهن الورد الطائفي على نقاط النبض يُبرز مطلق الورد من خلال الزعفران.',
        },
      },
      {
        kind: 'spray',
        productId: 'musc-blanc',
        how: {
          en: 'Musc Blanc first on the skin rounds the spice for a wedding that runs past midnight.',
          ar: '«المسك الأبيض» أولاً على البشرة يليّن التوابل لعرسٍ يمتدّ إلى ما بعد منتصف الليل.',
        },
      },
    ],
    formats: [
      format('full', 129000),
      format('spray50', 83000),
      format('quarter-tola', 32000),
      format('sample', 5000),
    ],
    palette: { from: '#63200f', via: '#c2502a', to: '#f0b169', glass: '#2d0f08' },
    year: 2021,
    bestseller: false,
    isNew: false,
  },
  {
    id: 'cedre-fume',
    name: { en: 'Cèdre Fumé', ar: 'الأرز المدخّن' },
    tagline: { en: 'Atlas cedar drawn through woodsmoke', ar: 'أرز أطلسي مسحوب عبر دخان الحطب' },
    description: {
      en: 'Birch tar gives the cedar its smoke; oakmoss keeps it damp rather than ashen. Closer to a forest floor than a fireplace.',
      ar: 'قطران البتولا يمنح الأرز دخانه، وطحلب البلوط يبقيه رطباً لا رمادياً. أقرب إلى أرض الغابة منه إلى الموقد.',
    },
    family: 'french-arabic',
    familyProfile: { 'french-arabic': 45, 'oud-musk': 35, 'bukhoor-oils': 20 },
    concentration: 'edp',
    gender: 'men',
    longevity: 9,
    projectionSillage: 'strong',
    heatResistance: 3,
    seasons: ['winter'],
    occasions: ['diwaniya', 'everyday'],
    topNotes: notes('juniper', 'black-pepper'),
    heartNotes: notes('atlas-cedar', 'cypress', 'birch-tar', 'frankincense'),
    baseNotes: notes('vetiver', 'oakmoss', 'hindi-oud', 'ambergris'),
    layering: [
      {
        kind: 'bukhoor',
        name: { en: 'Frankincense (luban)', ar: 'بخور اللبان' },
        how: {
          en: 'Burn a few grains of frankincense and hold the dishdasha over the smoke; Cèdre Fumé picks up where the smoke leaves off.',
          ar: 'أحرق حبّات من اللبان وبخّر الدشداشة بدخانها، فيكمل «الأرز المدخّن» من حيث ينتهي الدخان.',
        },
      },
      {
        kind: 'attar',
        productId: 'dehn-al-oud',
        how: {
          en: 'A drop of Dehn Al Oud on the wrists makes the cedar darker and longer for an evening at the diwaniya.',
          ar: 'قطرة من دهن العود على المعصمين تجعل الأرز أعمق وأطول ثباتاً لسهرة في الديوانية.',
        },
      },
    ],
    formats: [format('full', 89500), format('spray50', 55500), format('sample', 4000)],
    palette: { from: '#23302a', via: '#5e7361', to: '#c3cbb8', glass: '#141c18' },
    year: 2023,
    bestseller: false,
    isNew: true,
  },
  {
    id: 'fleur-de-neroli',
    name: { en: 'Fleur de Néroli', ar: 'زهرة النيرولي' },
    tagline: { en: 'Orange blossom in full sun', ar: 'زهر البرتقال في شمس كاملة' },
    description: {
      en: 'Neroli distilled from Tunisian bitter orange flowers. Green and slightly bitter up top, soft and sunlit underneath.',
      ar: 'نيرولي مُقطَّر من زهر النارنج التونسي. أخضر ومرٌّ قليلاً في أعلاه، ناعم مشمس تحته.',
    },
    family: 'rose',
    familyProfile: { rose: 60, 'fresh-aquatic': 40 },
    concentration: 'edt',
    gender: 'women',
    longevity: 5,
    projectionSillage: 'intimate',
    heatResistance: 4,
    seasons: ['summer'],
    occasions: ['office', 'everyday'],
    topNotes: notes('petitgrain', 'green-mandarin'),
    heartNotes: notes('neroli', 'orange-blossom', 'honeysuckle'),
    baseNotes: notes('white-musk', 'blond-woods'),
    layering: [
      {
        kind: 'spray',
        productId: 'musc-blanc',
        how: {
          en: 'Musc Blanc underneath keeps the neroli on the skin well past lunchtime.',
          ar: '«المسك الأبيض» تحته يُبقي النيرولي على البشرة إلى ما بعد الغداء بكثير.',
        },
      },
      {
        kind: 'attar',
        productId: 'ward-taifi',
        how: {
          en: 'A touch of Taif rose oil on the wrists turns it into rose and blossom for a summer evening.',
          ar: 'لمسة من دهن الورد الطائفي على المعصمين تحوّله إلى ورد وزهر لأمسية صيفية.',
        },
      },
    ],
    formats: [format('full', 77000), format('spray50', 48000), format('sample', 3500)],
    palette: { from: '#4a4a22', via: '#a8b06a', to: '#f4efd0', glass: '#22240f' },
    year: 2020,
    bestseller: false,
    isNew: false,
  },
  {
    id: 'musc-blanc',
    name: { en: 'Musc Blanc', ar: 'المسك الأبيض' },
    tagline: { en: 'Skin musk, cashmere and clean iris', ar: 'مسك البشرة والكشمير والسوسن النقي' },
    description: {
      en: 'A second-skin musk built on ambrette and iris. Quiet enough for close quarters, persistent enough to notice at the end of the day.',
      ar: 'مسك كبشرة ثانية، مبنيٌّ على حبّ المسك والسوسن. هادئ بما يكفي للأماكن الضيّقة، وثابت بما يكفي ليُلاحَظ في آخر اليوم.',
    },
    family: 'oud-musk',
    familyProfile: { 'oud-musk': 65, rose: 20, gourmand: 15 },
    concentration: 'edp',
    gender: 'unisex',
    longevity: 8,
    projectionSillage: 'intimate',
    heatResistance: 5,
    seasons: ['summer', 'winter'],
    occasions: ['everyday', 'office'],
    topNotes: notes('aldehydes', 'bergamot'),
    heartNotes: notes('iris-pallida', 'cashmeran'),
    baseNotes: notes('white-musk', 'ambrette-seed', 'vanilla'),
    layering: [
      {
        kind: 'attar',
        productId: 'dehn-al-oud',
        how: {
          en: 'A single drop of Dehn Al Oud on the pulse points, then Musc Blanc sprayed over it: the musk softens the oud and carries it, the way the Gulf has always worn them.',
          ar: 'قطرة واحدة من دهن العود على مواضع النبض، ثم رُشّ «المسك الأبيض» فوقها: المسك يليّن العود ويحمله، كما لبسهما أهل الخليج دائماً.',
        },
      },
      {
        kind: 'attar',
        productId: 'ward-taifi',
        how: {
          en: 'A drop of Taif rose oil on the pulse points underneath makes a clean rose musk for every day.',
          ar: 'قطرة من دهن الورد الطائفي على مواضع النبض تحته تصنع مسكاً وردياً نقياً لكل يوم.',
        },
      },
      {
        kind: 'spray',
        productId: 'oud-noir',
        how: {
          en: 'Worn under Oud Noir, it softens the smoke and lengthens the trail.',
          ar: 'تحت «العود الأسود» يليّن الدخان ويُطيل الأثر.',
        },
      },
    ],
    formats: [format('full', 91000), format('spray50', 57500), format('sample', 3500)],
    palette: { from: '#3d3a3c', via: '#8f8a8c', to: '#efe9e6', glass: '#1c1a1b' },
    year: 2024,
    bestseller: false,
    isNew: true,
  },
  {
    id: 'vetiver-noir',
    name: { en: 'Vétiver Noir', ar: 'النجيل الأسود' },
    tagline: { en: 'Haitian vetiver, earth-damp and green', ar: 'نجيل هايتي، ندي التراب وأخضر' },
    description: {
      en: 'Vetiver kept rooty and green rather than smoked. Tobacco leaf and ambergris carry it into a dry, resinous close.',
      ar: 'نجيل الهند يبقى جذرياً أخضر لا مدخّناً. ورق التبغ والعنبر الرمادي يحملانه إلى خاتمة جافّة راتنجية.',
    },
    family: 'french-arabic',
    familyProfile: { 'french-arabic': 60, amber: 25, 'oud-musk': 15 },
    concentration: 'extrait',
    gender: 'men',
    longevity: 10,
    projectionSillage: 'moderate',
    heatResistance: 3,
    seasons: ['winter'],
    occasions: ['office', 'diwaniya'],
    topNotes: notes('grapefruit', 'cardamom'),
    heartNotes: notes('haitian-vetiver', 'orris-root'),
    baseNotes: notes('guaiac-wood', 'tobacco', 'ambergris'),
    layering: [
      {
        kind: 'bukhoor',
        name: { en: "Mu'attar bukhoor", ar: 'بخور معطّر' },
        how: {
          en: "Pass the dishdasha over mu'attar bukhoor before the diwaniya, then spray Vétiver Noir on the collar.",
          ar: 'بخّر الدشداشة بالبخور المعطّر قبل الديوانية، ثم رُشّ «النجيل الأسود» على الياقة.',
        },
      },
      {
        kind: 'attar',
        productId: 'dehn-al-oud',
        how: {
          en: 'Dehn Al Oud on the wrists and vetiver over it gives an earthy, resinous scent for winter evenings.',
          ar: 'دهن العود على المعصمين والنجيل فوقه يمنحان رائحة ترابية راتنجية لأمسيات الشتاء.',
        },
      },
    ],
    formats: [format('full', 108000), format('spray50', 67000), format('sample', 4500)],
    palette: { from: '#1f3326', via: '#4f7a52', to: '#cfd9b4', glass: '#0f1c14' },
    year: 2019,
    bestseller: false,
    isNew: false,
  },
  {
    id: 'qahwa',
    name: { en: 'Qahwa', ar: 'قهوة' },
    tagline: { en: 'Cardamom coffee, dates and dark vanilla', ar: 'قهوة بالهيل وتمر وفانيلا داكنة' },
    description: {
      en: 'Coffee as the diwaniya pours it: a light Arabic roast boiled with cardamom and a few threads of saffron, with a plate of dates beside it. Madagascan vanilla and tonka keep it warm rather than sweet, and a thread of Cambodi oud stops it short of dessert.',
      ar: 'القهوة كما تُصبّ في الديوانية: بنّ عربي خفيف التحميص يُغلى مع الهيل وشعيرات من الزعفران، وإلى جانبه صحن تمر. الفانيلا المدغشقرية والتونكا تمنحانه دفئاً لا حلاوة، وخيط من العود الكمبودي يمنعه أن يصير حلوى.',
    },
    family: 'gourmand',
    familyProfile: { gourmand: 60, amber: 25, 'oud-musk': 15 },
    concentration: 'edp',
    gender: 'unisex',
    longevity: 10,
    projectionSillage: 'strong',
    heatResistance: 2,
    seasons: ['winter'],
    occasions: ['diwaniya', 'everyday'],
    topNotes: notes('cardamom', 'saffron'),
    heartNotes: notes('arabic-coffee', 'dates'),
    baseNotes: notes('madagascan-vanilla', 'tonka', 'cambodi-oud'),
    layering: [
      {
        kind: 'bukhoor',
        name: { en: 'Oud bukhoor', ar: 'بخور العود' },
        how: {
          en: 'Coffee and bukhoor are the two scents of the diwaniya: smoke the dishdasha first, then spray Qahwa on the chest.',
          ar: 'القهوة والبخور رائحتا الديوانية: بخّر الدشداشة أولاً، ثم رُشّ «قهوة» على الصدر.',
        },
      },
      {
        kind: 'attar',
        productId: 'dehn-al-oud',
        how: {
          en: 'A drop of Dehn Al Oud on the wrists turns the thread of oud in the base into a full line.',
          ar: 'قطرة من دهن العود على المعصمين تحوّل خيط العود في القاعدة إلى حضور كامل.',
        },
      },
      {
        kind: 'spray',
        productId: 'ambre-royale',
        how: {
          en: 'Ambre Royale on the neck with Qahwa on the chest, for long winter nights.',
          ar: '«العنبر الملكي» على الرقبة و«قهوة» على الصدر، لليالي الشتاء الطويلة.',
        },
      },
    ],
    formats: [format('full', 98000), format('spray50', 62000), format('sample', 4000)],
    palette: { from: '#2b1611', via: '#7a3f2c', to: '#dcb48c', glass: '#160b08' },
    year: 2025,
    bestseller: false,
    isNew: true,
  },
  {
    id: 'dehn-al-oud',
    name: { en: 'Dehn Al Oud', ar: 'دهن العود' },
    tagline: { en: 'Cambodi oud oil, honeyed and resinous', ar: 'دهن عود كمبودي، عسليّ وراتنجي' },
    description: {
      en: 'Pure Cambodi oud oil, distilled from soaked agarwood and rested in glass for a year before it is bottled. Dried plum and wild honey at first, then soft leather and resin that stay on the skin well into the next day. One drop on each wrist is enough.',
      ar: 'دهن عود كمبودي صافٍ، مقطَّر من خشب عود منقوع، يرتاح في الزجاج عاماً كاملاً قبل تعبئته. برقوق مجفّف وعسل برّي في البداية، ثم جلد ناعم وراتنج يبقيان على البشرة حتى اليوم التالي. قطرة على كل معصم تكفي.',
    },
    family: 'bukhoor-oils',
    familyProfile: { 'bukhoor-oils': 55, 'oud-musk': 45 },
    concentration: 'attar',
    gender: 'unisex',
    longevity: 18,
    projectionSillage: 'strong',
    heatResistance: 4,
    seasons: ['summer', 'winter'],
    occasions: ['diwaniya', 'wedding'],
    topNotes: notes('dried-plum', 'honey'),
    heartNotes: notes('cambodi-oud'),
    baseNotes: notes('leather', 'resinous-woods'),
    layering: [
      {
        kind: 'bukhoor',
        name: { en: 'Oud bukhoor', ar: 'بخور العود' },
        how: {
          en: 'Smoke the dishdasha or abaya over oud bukhoor, then a drop of oil on the wrists and behind the ears.',
          ar: 'بخّر الدشداشة أو العباءة ببخور العود، ثم قطرة من الدهن على المعصمين وخلف الأذنين.',
        },
      },
      {
        kind: 'spray',
        productId: 'musc-blanc',
        how: {
          en: 'Put the oil on first and spray Musc Blanc over it: the musk carries the oud into the night.',
          ar: 'ضع الدهن أولاً ثم رُشّ «المسك الأبيض» فوقه: المسك يحمل العود إلى الليل.',
        },
      },
      {
        kind: 'attar',
        productId: 'ward-taifi',
        how: {
          en: 'One drop each of Dehn Al Oud and Taif rose oil on the same pulse point makes the classic ward and oud.',
          ar: 'قطرة من دهن العود وقطرة من دهن الورد الطائفي على نقطة النبض نفسها تصنعان الورد والعود الكلاسيكي.',
        },
      },
    ],
    formats: [format('tola', 120000), format('quarter-tola', 35000), format('sample', 6500)],
    palette: { from: '#120c0a', via: '#3f2a1e', to: '#9c7a52', glass: '#0a0605' },
    year: 2023,
    bestseller: false,
    isNew: false,
  },
  {
    id: 'ward-taifi',
    name: { en: 'Ward Taifi', ar: 'ورد طائفي' },
    tagline: { en: 'Taif rose, picked before sunrise', ar: 'ورد الطائف، يُقطف قبل الشروق' },
    description: {
      en: 'Rose oil from Taif, where the thirty-petal damask rose is picked before sunrise on the terraces of Al Hada and distilled in copper the same morning. Green and peppery as the vial opens, then honeyed and full, it settles on a little sandalwood and white musk that let it sit softly on the skin.',
      ar: 'دهن ورد من الطائف، حيث يُقطف الورد الدمشقي ذو الثلاثين بتلة قبل الشروق من مدرّجات الهدا، ويُقطَّر في قدور النحاس صباح اليوم نفسه. أخضر بلمسة فلفل عند فتح القارورة، ثم عسليّ ممتلئ، يستقرّ على قليل من الصندل والمسك الأبيض فيجلس ناعماً على البشرة.',
    },
    family: 'bukhoor-oils',
    familyProfile: { 'bukhoor-oils': 50, rose: 50 },
    concentration: 'attar',
    gender: 'unisex',
    longevity: 12,
    projectionSillage: 'moderate',
    heatResistance: 4,
    seasons: ['summer', 'winter'],
    occasions: ['wedding', 'everyday'],
    topNotes: notes('pink-pepper', 'rose-leaf'),
    heartNotes: notes('taif-rose'),
    baseNotes: notes('sandalwood', 'white-musk'),
    layering: [
      {
        kind: 'spray',
        productId: 'oud-noir',
        how: {
          en: 'A drop on the pulse points under Oud Noir brings the rose in its heart to the front.',
          ar: 'قطرة على نقاط النبض تحت «العود الأسود» تُقدّم الورد الذي في قلبه.',
        },
      },
      {
        kind: 'attar',
        productId: 'dehn-al-oud',
        how: {
          en: 'With a drop of Dehn Al Oud on the same wrist: rose and oud, the pairing every Gulf wedding knows.',
          ar: 'مع قطرة من دهن العود على المعصم نفسه: الورد والعود، الاقتران الذي يعرفه كل عرس خليجي.',
        },
      },
      {
        kind: 'bukhoor',
        name: { en: 'Rose bukhoor', ar: 'بخور الورد' },
        how: {
          en: 'Perfume the hair and shayla with rose bukhoor, then touch a drop of oil to the nape.',
          ar: 'بخّري الشعر والشيلة ببخور الورد، ثم ضعي قطرة من الدهن على مؤخرة العنق.',
        },
      },
    ],
    formats: [format('tola', 85000), format('quarter-tola', 24000), format('sample', 5000)],
    palette: { from: '#3f0f1d', via: '#b23a55', to: '#f3c9b9', glass: '#200810' },
    year: 2025,
    bestseller: false,
    isNew: true,
  },
]

/** Fast lookup used by the cart to re-hydrate line items. */
export const PRODUCTS_BY_ID = byId(PRODUCTS)

/**
 * Catalogue numbers are positional and stable: the house numbers its
 * fragrances in the order they joined the collection, and the number is
 * printed on every label. New fragrances are appended, never inserted.
 */
export const CATALOGUE_NUMBERS = Object.fromEntries(
  PRODUCTS.map((product, index) => [product.id, String(index + 1).padStart(2, '0')]),
)

/** The bottles and oils of a fragrance — every format except the sample vial. */
export const bottleFormats = (product) =>
  product.formats.filter((entry) => FORMAT_BY_ID[entry.id]?.kind !== 'sample')

/** The "from" price: the cheapest bottle or oil, never the sample. */
export const fromPriceFils = (product) =>
  Math.min(...bottleFormats(product).map((entry) => entry.priceFils))

/** One format of a fragrance, or null when it is not offered. */
export const formatOf = (product, formatId) =>
  product?.formats.find((entry) => entry.id === formatId) ?? null

/** Oils are always attar; every other format is the fragrance's own concentration. */
export const concentrationFor = (product, formatId) =>
  FORMAT_BY_ID[formatId]?.kind === 'oil' ? 'attar' : product.concentration

/** Top, heart and base notes in pyramid order. */
export const allNotes = (product) => [
  ...product.topNotes,
  ...product.heartNotes,
  ...product.baseNotes,
]

/**
 * Price filter bounds across every bottle and oil (samples excluded), in fils,
 * rounded out to whole dinars so a one-dinar slider step lands on both ends.
 */
const BOTTLE_PRICES = PRODUCTS.flatMap((product) =>
  bottleFormats(product).map((entry) => entry.priceFils),
)

export const PRICE_BOUNDS = {
  minFils: Math.floor(Math.min(...BOTTLE_PRICES) / 1000) * 1000,
  maxFils: Math.ceil(Math.max(...BOTTLE_PRICES) / 1000) * 1000,
}
