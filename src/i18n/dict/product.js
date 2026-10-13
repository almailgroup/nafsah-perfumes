// Product page: formats, pyramid, scent profile, layering (owner P1). Keys: 'product.*'
//
// Every number arrives already written in the active script: {no} through
// formatOrdinal, {year} {minutes} {from} {to} {value} {max} {min} through
// formatNumber, {hours} through formatHours, {volume} through formatMl.
// {name} is the fragrance, {format} a FORMATS label, {band} a LONGEVITY_BANDS
// label, {label} a HEAT_SCALE or SILLAGE label.
export default {
  en: {
    // The vial plate
    'product.catalogueNo': 'No. {no}',
    'product.introducedIn': 'Introduced {year}',

    // At a glance
    'product.facts': 'At a glance',
    'product.fact.concentration': 'Concentration',
    'product.fact.gender': 'Gender',
    'product.fact.longevity': 'Longevity',
    'product.fact.projection': 'Projection',
    'product.longevityValue': '{hours} · {band}',
    'product.oilShare': '{min}–{max}% perfume oil',
    'product.oilPure': 'Pure oil, alcohol-free',

    // Size and format, price and the two actions
    'product.formatHeading': 'Size & format',
    'product.formatLabel': 'Choose a size or format',
    'product.format.vial': 'with a free {volume} test vial',
    'product.selection': '{format}, {volume}',
    'product.gift': 'Send as a gift',

    'product.about': 'About the fragrance',

    // Olfactory pyramid
    'product.pyramid.title': 'The composition',
    'product.pyramid.lede': 'Read it from the top: what you smell first, what it becomes, and what stays.',
    'product.tier.top': 'Top notes',
    'product.tier.heart': 'Heart notes',
    'product.tier.base': 'Base notes',
    'product.tier.topWhen': 'First {minutes} minutes',
    'product.tier.heartWhen': 'Hours {from}–{to}',
    'product.tier.baseWhen': 'The dry-down, from hour {from}',

    // Scent profile
    'product.profile.title': 'Scent profile',
    'product.profile.lede': 'The house’s own guidance, from wearing it in Kuwait — not customer ratings.',
    'product.profile.families': 'Family character',
    'product.profile.share': '{value}%',
    'product.profile.heat': 'Heat resistance',
    'product.profile.longevity': 'Longevity on skin',
    'product.profile.projection': 'Projection & sillage',
    'product.profile.steps': '{value}/{max} · {label}',
    'product.profile.season': 'Season',
    'product.profile.allYear': 'All year',
    'product.profile.occasions': 'Occasions',

    // Layering guide
    'product.layering.title': 'Suggested layering',
    'product.layering.intro':
      'In the Gulf, scent is worn in layers: bukhoor smoke on clothes and hair first, a touch of oil on the pulse points, then the spray over both.',
    'product.layering.view': 'View',
    'product.layering.viewAria': 'View {name}',
  },
  ar: {
    'product.catalogueNo': 'رقم {no}',
    'product.introducedIn': 'أُطلق عام {year}',

    'product.facts': 'لمحة سريعة',
    'product.fact.concentration': 'التركيز',
    'product.fact.gender': 'النوع',
    'product.fact.longevity': 'الثبات',
    'product.fact.projection': 'الفوحان',
    'product.longevityValue': '{hours} · {band}',
    'product.oilShare': 'زيوت عطرية بنسبة {min}–{max}٪',
    'product.oilPure': 'زيت خالص بلا كحول',

    'product.formatHeading': 'الحجم والصيغة',
    'product.formatLabel': 'اختر الحجم أو الصيغة',
    'product.format.vial': 'مع عيّنة اختبار {volume} مجاناً',
    'product.selection': '{format}، {volume}',
    'product.gift': 'أرسله هدية',

    'product.about': 'عن العطر',

    'product.pyramid.title': 'التركيبة',
    'product.pyramid.lede': 'اقرأه من الأعلى: ما تشمّه أولاً، وما يتحوّل إليه، وما يبقى.',
    'product.tier.top': 'النفحات العليا',
    'product.tier.heart': 'نفحات القلب',
    'product.tier.base': 'نفحات القاعدة',
    'product.tier.topWhen': 'أول {minutes} دقيقة',
    'product.tier.heartWhen': 'من الساعة {from} إلى الساعة {to}',
    'product.tier.baseWhen': 'الختام، من الساعة {from} فصاعداً',

    'product.profile.title': 'ملامح العطر',
    'product.profile.lede': 'تقدير الدار نفسها بعد تجربته في أجواء الكويت، لا تقييمات العملاء.',
    'product.profile.families': 'العائلات العطرية',
    'product.profile.share': '{value}٪',
    'product.profile.heat': 'مقاومة الحرّ',
    'product.profile.longevity': 'الثبات على البشرة',
    'product.profile.projection': 'الفوحان والأثر',
    // An Arabic comma, not a middle dot: '·' beside ٣ reads as another digit (٣٠).
    'product.profile.steps': '{value} من {max}، {label}',
    'product.profile.season': 'الموسم',
    'product.profile.allYear': 'طوال العام',
    'product.profile.occasions': 'المناسبات',

    'product.layering.title': 'طبقات مقترحة',
    'product.layering.intro':
      'في الخليج يُلبس العطر طبقات: دخان البخور على الثياب والشعر أولاً، ثم لمسة دهن على مواضع النبض، ثم العطر البخاخ فوقهما.',
    'product.layering.view': 'عرض',
    'product.layering.viewAria': 'عرض {name}',
  },
}
