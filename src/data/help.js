/**
 * Shipping & Returns and the FAQ. Like the legal pages, this is prose rather
 * than interface chrome, so it lives beside the catalogue data instead of in
 * the dictionary.
 *
 * No policy figure is typed into a sentence. {threshold}, {cutoff},
 * {returnPeriod} and the rest are filled at render time by fillPolicy(), from
 * the same constants the cart, the delivery badge and checkout read — so a
 * page cannot promise a fee, a cut-off or a return window the checkout does
 * not apply. Every placeholder is listed on policyVars() below.
 *
 * Each section and FAQ group carries an explicit `id`: it is the anchor in a
 * shared link (/shipping#try-first, /faq#gifting), so rewording a heading
 * never breaks one.
 */
import { CONTACT, SCENT_FINDER, SHIPPING } from '../router/routes'
import { deliveryVars } from '../lib/delivery'
import { formatMl, formatNumber, formatPrice, formatWeekday, pluralCategory } from '../lib/format'
import {
  FREE_SHIPPING_FILS,
  NO_DELIVERY_WEEKDAYS,
  REMOTE_EXTRA_DAYS,
  REMOTE_SURCHARGE_FILS,
  RETURN_WINDOW_DAYS,
  SHIPPING_FILS,
} from './delivery'
import { GIFT_BOX_BY_ID, GIFT_MESSAGE_MAX } from './gifting'
import { GOVERNORATES } from './kuwait'
import { CONCENTRATION_BY_ID, FORMAT_BY_ID, FORMATS } from './taxonomy'

/** The year the house was founded. Story, the terms and the README quote it. */
export const HOUSE_FOUNDED = 1974

const listFormats = new Map()
const joinList = (items, lang) => {
  const locale = lang === 'ar' ? 'ar' : 'en-GB'
  if (!listFormats.has(locale)) listFormats.set(locale, new Intl.ListFormat(locale, { type: 'conjunction' }))
  return listFormats.get(locale).format(items)
}

const label = (entry, lang) => entry?.[lang] ?? entry?.en ?? ''

/** "30 days" / "٣٠ يوماً" — Arabic agrees the noun with the number. */
const dayCount = (count, lang) => {
  const n = formatNumber(count, lang)
  if (lang !== 'ar') return count === 1 ? 'one day' : `${n} days`
  return {
    one: 'يوم واحد',
    two: 'يومين',
    few: `${n} أيام`,
    many: `${n} يوماً`,
  }[pluralCategory(count, 'ar')] ?? `${n} يوم`
}

/** How much longer an outlying area waits: "one extra delivery day" / "يوم توصيل إضافي". */
const extraDeliveryDays = (count, lang) => {
  const n = formatNumber(count, lang)
  if (lang !== 'ar') return count === 1 ? 'one extra delivery day' : `${n} extra delivery days`
  return {
    one: 'يوم توصيل إضافي',
    two: 'يومَي توصيل إضافيَّين',
    few: `${n} أيام توصيل إضافية`,
    many: `${n} يوماً إضافياً للتوصيل`,
  }[pluralCategory(count, 'ar')] ?? `${n} يوم توصيل إضافي`
}

// 4 January 2026 was a Sunday, so weekday d falls on the (4 + d)th.
const weekdayName = (weekday, lang) => formatWeekday(`2026-01-${String(4 + weekday).padStart(2, '0')}`, lang)

/** An oil range as a percentage: "20–30%" / "٢٠–٣٠٪". */
const oilRange = (id, lang) => {
  const [min, max] = CONCENTRATION_BY_ID[id].oilRange
  const top = formatNumber(max / 100, lang, { style: 'percent' })
  return min === max ? top : `${formatNumber(min, lang)}–${top}`
}

// A price never breaks across a line: "KWD" and its figure travel together.
const price = (fils, lang) => formatPrice(fils, lang).replace(' ', '\u00a0')

const policyCache = new Map()

/**
 * Every figure the help, legal and announcement copy may quote, formatted
 * for `lang`:
 *
 *   {threshold} {shipping} {remoteFee} {cutoff}   delivery fees and the same-day cut-off
 *   {restDays}          the weekdays without delivery ("Fridays" / "الجمعة")
 *   {remoteDelay}       how much longer outlying areas wait ("one extra delivery day")
 *   {returnPeriod}      the return window, with its noun ("30 days" / "٣٠ يوماً")
 *   {returnDays}        the same window as a bare number
 *   {governorates}      the six governorates as a list
 *   {vial} {tolaMl} {quarterTolaMl}               volumes ("2 ml" / "٢ مل")
 *   {tryFirstFormats}   the formats that ship with a test vial, as a list
 *   {formatFull} {formatSpray50}                  format names
 *   {extraitOil} {edpOil} {edtOil}                perfume-oil ranges
 *   {boxSignature} {boxSadu} {boxMajlis} {boxSaduPrice} {boxMajlisPrice}
 *   {giftMessageMax}    the longest message card, in characters
 *   {founded}           the house's founding year
 */
export function policyVars(lang = 'en') {
  if (policyCache.has(lang)) return policyCache.get(lang)
  const delivery = deliveryVars(lang)
  const rest = NO_DELIVERY_WEEKDAYS.map((day) => weekdayName(day, lang))
  const vars = {
    ...delivery,
    threshold: price(FREE_SHIPPING_FILS, lang),
    shipping: price(SHIPPING_FILS, lang),
    surcharge: price(REMOTE_SURCHARGE_FILS, lang),
    remoteFee: price(REMOTE_SURCHARGE_FILS, lang),
    // English says "except Fridays"; Arabic says "ما عدا الجمعة".
    restDays: joinList(lang === 'ar' ? rest : rest.map((name) => `${name}s`), lang),
    remoteDelay: extraDeliveryDays(REMOTE_EXTRA_DAYS, lang),
    returnPeriod: dayCount(RETURN_WINDOW_DAYS, lang),
    governorates: joinList(
      GOVERNORATES.map((g) => label(g.short, lang) || label(g, lang)),
      lang,
    ),
    vial: formatMl(FORMAT_BY_ID.sample.ml, lang),
    tolaMl: formatMl(FORMAT_BY_ID.tola.ml, lang),
    quarterTolaMl: formatMl(FORMAT_BY_ID['quarter-tola'].ml, lang),
    tryFirstFormats: joinList(
      FORMATS.filter((format) => format.tryFirst).map((format) => label(format, lang)),
      lang,
    ),
    formatFull: label(FORMAT_BY_ID.full, lang),
    formatSpray50: label(FORMAT_BY_ID.spray50, lang),
    extraitOil: oilRange('extrait', lang),
    edpOil: oilRange('edp', lang),
    edtOil: oilRange('edt', lang),
    boxSignature: label(GIFT_BOX_BY_ID.signature, lang),
    boxSadu: label(GIFT_BOX_BY_ID.sadu, lang),
    boxMajlis: label(GIFT_BOX_BY_ID.majlis, lang),
    boxSaduPrice: price(GIFT_BOX_BY_ID.sadu.priceFils, lang),
    boxMajlisPrice: price(GIFT_BOX_BY_ID.majlis.priceFils, lang),
    giftMessageMax: formatNumber(GIFT_MESSAGE_MAX, lang),
    founded: formatNumber(HOUSE_FOUNDED, lang, { useGrouping: false }),
  }
  policyCache.set(lang, vars)
  return vars
}

/** Fill every {placeholder} in a policy sentence. An unknown one stays visible. */
export const fillPolicy = (text, lang = 'en') => {
  const vars = policyVars(lang)
  return String(text ?? '').replace(/\{(\w+)\}/g, (match, name) =>
    Object.hasOwn(vars, name) ? vars[name] : match,
  )
}

export const SHIPPING_DOC = {
  updated: '2026-10-13',
  title: { en: 'Shipping & Returns', ar: 'الشحن والإرجاع' },
  lede: {
    en: 'Where we deliver, what it costs, when it arrives, how Try First works, and how to send something back.',
    ar: 'إلى أين نوصّل، وبكم، ومتى يصل طلبك، وكيف تعمل «جرّب أولاً»، وكيف تعيد شيئاً إلينا.',
  },
  sections: [
    {
      id: 'where-we-deliver',
      heading: { en: 'Where we deliver', ar: 'إلى أين نوصّل' },
      body: [
        {
          en: 'To every governorate in Kuwait: {governorates}. Orders leave our Kuwait boutique. The sprays are composed in Grasse and reach us sealed; the oils and the sample vials are decanted and sealed at the boutique.',
          ar: 'إلى جميع محافظات الكويت: {governorates}. تغادر الطلبات بوتيكنا في الكويت. تُركَّب البخاخات في غراس وتصلنا مختومة، أمّا الدهون العطرية والعيّنات فتُعبّأ وتُختم في البوتيك.',
        },
        {
          en: 'Checkout takes addresses in Kuwait only. For delivery elsewhere in the GCC, or further afield, write to us before you order: we quote the delivery and arrange it by hand.',
          ar: 'لا يقبل نموذج الطلب إلا العناوين داخل الكويت. وللتوصيل إلى دول الخليج الأخرى أو أبعد منها، راسلنا قبل الطلب، فنحدّد لك تكلفة التوصيل ونرتّبه بأنفسنا.',
        },
      ],
      link: { to: CONTACT, label: { en: 'Ask about delivery outside Kuwait', ar: 'اسأل عن التوصيل خارج الكويت' } },
    },
    {
      id: 'what-delivery-costs',
      heading: { en: 'When it arrives, and what it costs', ar: 'متى يصل طلبك، وبكم' },
      table: {
        head: [
          { en: 'Order', ar: 'الطلب' },
          { en: 'Arrives', ar: 'موعد الوصول' },
          { en: 'Cost', ar: 'التكلفة' },
        ],
        rows: [
          [
            { en: 'Kuwait, before {cutoff}', ar: 'داخل الكويت، قبل {cutoff}' },
            { en: 'The same day', ar: 'في اليوم نفسه' },
            {
              en: 'Complimentary from {threshold}; otherwise {shipping}',
              ar: 'مجاني للطلبات من {threshold} فأكثر، وإلّا {shipping}',
            },
          ],
          [
            { en: 'Kuwait, after {cutoff}', ar: 'داخل الكويت، بعد {cutoff}' },
            { en: 'The next delivery day', ar: 'في يوم التوصيل التالي' },
            {
              en: 'Complimentary from {threshold}; otherwise {shipping}',
              ar: 'مجاني للطلبات من {threshold} فأكثر، وإلّا {shipping}',
            },
          ],
          [
            { en: 'Outlying areas', ar: 'المناطق البعيدة' },
            {
              en: 'Next-day timing plus {remoteDelay}; never the same day',
              ar: 'موعد اليوم التالي مع {remoteDelay}، ولا توصيل في اليوم نفسه',
            },
            { en: 'As above, plus {remoteFee}', ar: 'كما سبق، مضافاً إليها {remoteFee}' },
          ],
          [
            { en: 'Elsewhere in the GCC', ar: 'دول الخليج الأخرى' },
            { en: 'By arrangement', ar: 'بالاتفاق' },
            { en: 'Quoted before you order', ar: 'نحدّدها قبل الطلب' },
          ],
        ],
      },
      after: [
        {
          en: 'We deliver every day except {restDays}. The cut-off is {cutoff}, Kuwait time, wherever you happen to be ordering from.',
          ar: 'نوصّل كلّ يوم ما عدا {restDays}. والموعد النهائي للطلب {cutoff} بتوقيت الكويت، أينما كنت حين تطلب.',
        },
        {
          en: 'Outlying areas include Al Khiran, Al Wafra and the Sabah Al-Ahmad cities; checkout tells you when your area is one of them. The free-delivery threshold counts the fragrances in your order, not the gift box, and the outlying-area fee applies whatever the total.',
          ar: 'من المناطق البعيدة الخيران والوفرة ومدينتا صباح الأحمد، ويُعلمك نموذج الطلب إن كانت منطقتك منها. ويُحتسب حدّ التوصيل المجاني على قيمة العطور في طلبك دون علبة الهدية، أمّا رسوم المناطق البعيدة فتُضاف أيّاً كان المجموع.',
        },
      ],
    },
    {
      id: 'packing',
      heading: { en: 'How it is packed', ar: 'كيف يُغلَّف طلبك' },
      body: [
        {
          en: 'Every order is packed by hand at the boutique. Each bottle is checked for its seal and its cellophane before it is boxed, and every {tryFirstFormats} goes in with its Try First test vial.',
          ar: 'يُغلَّف كلّ طلب يدوياً في البوتيك. ونتحقّق من ختم كلّ زجاجة وغلافها الشفاف قبل وضعها في العلبة، وترافق كلّاً من {tryFirstFormats} عيّنةُ التجربة الخاصة بها ضمن «جرّب أولاً».',
        },
        {
          en: 'A gift goes into the box you chose, with your message card on top. Unless you ask otherwise, the packing slip carries no prices.',
          ar: 'وتوضع الهدية في العلبة التي اخترتها، وبطاقة رسالتك في أعلاها. ولا تظهر الأسعار على قسيمة التغليف ما لم تطلب ذلك.',
        },
      ],
    },
    {
      id: 'tracking',
      heading: { en: 'Delivery updates', ar: 'متابعة التوصيل' },
      body: [
        {
          en: 'Your confirmation arrives by email as soon as the order is placed. On the day, the driver sends updates to the mobile number you gave at checkout and calls before arriving. A gift sent straight to its recipient is arranged with the recipient, on their own mobile.',
          ar: 'يصلك تأكيد الطلب بالبريد الإلكتروني فور تنفيذه. وفي يوم التوصيل يرسل السائق المستجدات إلى رقم الهاتف الذي أدخلته عند الطلب، ويتصل بك قبل وصوله. أمّا الهدية المرسلة إلى مستلمها مباشرةً فيرتّب السائق تسليمها مع المستلم على رقم هاتفه.',
        },
      ],
    },
    {
      id: 'try-first',
      heading: { en: 'Try First', ar: 'جرّب أولاً' },
      body: [
        {
          en: 'Every {tryFirstFormats} arrives with a free {vial} test vial of the same fragrance. Open the vial first and leave the bottle sealed in its cellophane. Wear it for a day — outdoors, in the heat — and see how long it lasts and how far it carries on you.',
          ar: 'تصلك مع كلٍّ من {tryFirstFormats} عيّنة تجربة مجانية بحجم {vial} من العطر نفسه. افتح العيّنة أولاً وأبقِ الزجاجة مختومة في غلافها الشفاف. ضعها يوماً كاملاً، في الخارج وتحت الحرّ، لترى كم يدوم العطر وإلى أيّ مدى يفوح منك.',
        },
        {
          en: 'If it is not for you, return the sealed bottle within {returnPeriod} of delivery for a full refund. The vial is yours to keep.',
          ar: 'وإن لم يناسبك، فأعِد الزجاجة مختومة خلال {returnPeriod} من التسليم واسترد المبلغ كاملاً. وتبقى العيّنة لك.',
        },
      ],
      list: [
        { en: 'The seal and the cellophane must be intact.', ar: 'أن يكون الختم والغلاف الشفاف سليمين.' },
        {
          en: 'One Try First return per fragrance, per customer.',
          ar: 'إرجاع واحد عبر «جرّب أولاً» لكلّ عطر ولكلّ عميل.',
        },
        {
          en: 'A quarter tola or a {vial} sample vial is a trial size already, so it comes without a test vial.',
          ar: 'ربع التولة وعيّنة {vial} بحجم التجربة أصلاً، لذا لا ترافقهما عيّنة.',
        },
      ],
    },
    {
      id: 'what-you-can-return',
      heading: { en: 'What you can return', ar: 'ما يمكن إرجاعه' },
      body: [
        {
          en: 'Anything still sealed — a full bottle, a spray, a tola or quarter tola of oil, a sample vial — can come back within {returnPeriod} of delivery for a full refund, and a gift box comes back with the bottle it holds. Fragrance is a sealed product: once a seal is broken we cannot sell it again, so an opened item can come back only if it is faulty. That is what the Try First vial is for.',
          ar: 'كلّ ما زال مختوماً — زجاجة كاملة أو بخاخ أو تولة أو ربع تولة من الدهن أو عيّنة — يمكن إرجاعه خلال {returnPeriod} من التسليم مع استرداد كامل، وتُعاد علبة الهدية مع الزجاجة التي تضمّها. العطر منتج مختوم: فمتى كُسر الختم تعذّر بيعه من جديد، ولا يُقبل المفتوح إلا إذا كان معيباً. ولهذا وُجدت عيّنة «جرّب أولاً».',
        },
      ],
    },
    {
      id: 'how-to-start-a-return',
      heading: { en: 'How to start a return', ar: 'كيف تبدأ الإرجاع' },
      body: [
        {
          en: 'Write to us before you send anything back. We collect it ourselves, anywhere we deliver and at no charge, so a bottle is never couriered loose. When the whole order comes back, the delivery fee is refunded too.',
          ar: 'راسلنا قبل أن تعيد أيّ شيء. نستلمه بأنفسنا ودون مقابل أينما نوصّل، كي لا تُنقل الزجاجة دون تغليف مناسب. وإذا أُعيد الطلب كاملاً رددنا رسوم التوصيل أيضاً.',
        },
      ],
      link: { to: CONTACT, label: { en: 'Start a return', ar: 'ابدأ الإرجاع' } },
    },
    {
      id: 'gifts',
      heading: { en: 'Returning a gift', ar: 'إرجاع الهدية' },
      body: [
        {
          en: 'A gift can be returned by the person who received it, on the same terms and without the price ever being shown to them. The refund goes to whoever paid, by the method they paid with; the recipient may ask for an exchange instead.',
          ar: 'يمكن لمن تلقّى الهدية أن يعيدها بالشروط نفسها، دون أن يُطلَع على سعرها. ويُردّ المبلغ إلى من دفع، بالوسيلة التي دفع بها، وللمستلم أن يطلب الاستبدال بدلاً من ذلك.',
        },
      ],
    },
    {
      id: 'when-you-get-your-money',
      heading: { en: 'When you get your money', ar: 'متى يصلك المبلغ' },
      body: [
        {
          en: 'Refunds go back to the method you paid with, within five working days of the item reaching us. KNET and card refunds can take a few more days to appear, depending on your bank. An order paid in cash on delivery is refunded by bank transfer.',
          ar: 'يُردّ المبلغ إلى الوسيلة التي دفعت بها، خلال خمسة أيام عمل من وصول المنتج إلينا. وقد يستغرق ظهور المبالغ المستردّة عبر «كي نت» والبطاقات أياماً إضافية بحسب بنكك. أمّا الطلب المدفوع نقداً عند التسليم فتُردّ قيمته بتحويل بنكي.',
        },
      ],
    },
    {
      id: 'damaged-or-wrong',
      heading: { en: 'Damaged or wrong', ar: 'التالف أو الخاطئ' },
      body: [
        {
          en: 'If something arrives broken, or is not what you ordered, tell us within fourteen days. We replace it or refund it, and we collect it at our cost. A photograph helps but is not required.',
          ar: 'إذا وصل شيء مكسوراً أو مخالفاً لما طلبته، أخبرنا خلال أربعة عشر يوماً. نستبدله أو نردّ قيمته، ونستلمه على نفقتنا. والصورة تساعد لكنّها ليست شرطاً.',
        },
      ],
    },
  ],
}

export const FAQ = {
  groups: [
    {
      id: 'ordering',
      group: { en: 'Ordering and payment', ar: 'الطلب والدفع' },
      items: [
        {
          q: { en: 'Which payment methods do you accept?', ar: 'ما وسائل الدفع المقبولة؟' },
          a: {
            en: 'KNET, Visa, Mastercard and Apple Pay, or cash on delivery — except when a gift goes straight to its recipient. Prices are in Kuwaiti dinar, shown to three decimal places because the dinar divides into a thousand fils.',
            ar: '«كي نت» وفيزا وماستركارد وآبل باي، أو الدفع نقداً عند التسليم، إلّا إذا أُرسلت الهدية إلى مستلمها مباشرةً. والأسعار بالدينار الكويتي، معروضة بثلاث خانات عشرية لأنّ الدينار ينقسم إلى ألف فلس.',
          },
        },
        {
          q: { en: 'Which sizes can I buy?', ar: 'ما الأحجام المتوفّرة؟' },
          a: {
            en: 'Sprays come in two sizes, the {formatFull} and the {formatSpray50}, and some of the extraits are also poured as a quarter tola of oil. Attars come by the tola and the quarter tola. Every fragrance is also sold as a {vial} sample vial — the inexpensive way to meet a scent before you commit to a bottle.',
            ar: 'تتوفّر البخاخات بحجمين: {formatFull} و{formatSpray50}، وتُعبّأ بعض الخلاصات كذلك دهناً بربع تولة. أمّا الدهون العطرية فتُباع بالتولة وربع التولة. ولكلّ عطر كذلك عيّنة بحجم {vial}، وهي الطريقة الأقلّ كلفة للتعرّف إلى العطر قبل شراء زجاجته.',
          },
        },
        {
          q: { en: 'Can I change or cancel an order after placing it?', ar: 'هل يمكن تعديل الطلب أو إلغاؤه بعد تنفيذه؟' },
          a: {
            en: 'Until it leaves the boutique, yes. Write to us as soon as you can: an order placed before {cutoff} may already be on its way that afternoon.',
            ar: 'نعم، ما دام لم يغادر البوتيك. راسلنا بأسرع ما يمكن، فالطلب المنفّذ قبل {cutoff} قد يكون في طريقه إليك بعد ظهر اليوم نفسه.',
          },
        },
        {
          q: { en: 'Are the reviews real?', ar: 'هل المراجعات حقيقية؟' },
          a: {
            en: 'Every review is written by a customer; none is invented or seeded by the house. Until the house connects its review service, a review you write is kept in your own browser, so for now only you can see it.',
            ar: 'كلّ مراجعة يكتبها عميل، ولا تختلق الدار مراجعات ولا تضيفها من عندها. وإلى أن تربط الدار خدمة المراجعات، تُحفظ مراجعتك في متصفّحك، فلا يراها الآن أحد سواك.',
          },
        },
      ],
    },
    {
      id: 'delivery',
      group: { en: 'Delivery', ar: 'التوصيل' },
      items: [
        {
          q: { en: 'How long does delivery take in Kuwait?', ar: 'كم يستغرق التوصيل داخل الكويت؟' },
          a: {
            en: 'Order before {cutoff}, Kuwait time, and it arrives the same day; after that, on the next delivery day. We deliver every day except {restDays}. Outlying areas such as Al Khiran, Al Wafra and the Sabah Al-Ahmad cities are never same-day: they take {remoteDelay} beyond next-day delivery.',
            ar: 'اطلب قبل {cutoff} بتوقيت الكويت ليصلك طلبك في اليوم نفسه، وبعد ذلك يصلك في يوم التوصيل التالي. نوصّل كلّ يوم ما عدا {restDays}. أمّا المناطق البعيدة مثل الخيران والوفرة ومدينتي صباح الأحمد فلا يصلها التوصيل في اليوم نفسه، وتحتاج إلى {remoteDelay} بعد موعد اليوم التالي.',
          },
        },
        {
          q: { en: 'What does delivery cost?', ar: 'كم تكلفة التوصيل؟' },
          a: {
            en: 'Delivery is complimentary on orders of {threshold} or more, and {shipping} below that. The threshold counts the fragrances, not the gift box. Outlying areas add {remoteFee}, whatever the total.',
            ar: 'التوصيل مجاني للطلبات من {threshold} فأكثر، و{shipping} لما دون ذلك. ويُحتسب الحدّ على قيمة العطور دون علبة الهدية. وتُضاف للمناطق البعيدة رسوم قدرها {remoteFee} أيّاً كان المجموع.',
          },
        },
        {
          q: { en: 'Do you deliver outside Kuwait?', ar: 'هل توصلون خارج الكويت؟' },
          a: {
            en: 'Checkout delivers within Kuwait only. For the rest of the GCC, or further afield, write to us before you order: we quote the delivery and arrange it by hand.',
            ar: 'يقتصر نموذج الطلب على التوصيل داخل الكويت. وللتوصيل إلى بقيّة دول الخليج أو أبعد منها، راسلنا قبل الطلب، فنحدّد التكلفة ونرتّب التوصيل بأنفسنا.',
          },
          link: { to: CONTACT, label: { en: 'Write to us', ar: 'راسلنا' } },
        },
        {
          q: { en: 'How will I know when it is coming?', ar: 'كيف أعرف موعد وصول طلبي؟' },
          a: {
            en: 'Your confirmation arrives by email straight away. On the day, the driver sends updates to the mobile you gave at checkout and calls before arriving.',
            ar: 'يصلك تأكيد الطلب بالبريد الإلكتروني فوراً. وفي يوم التوصيل يرسل السائق المستجدات إلى رقم الهاتف الذي أدخلته عند الطلب، ويتصل بك قبل وصوله.',
          },
        },
      ],
    },
    {
      id: 'returns',
      group: { en: 'Try First and returns', ar: '«جرّب أولاً» والإرجاع' },
      items: [
        {
          q: { en: 'What is Try First?', ar: 'ما هي «جرّب أولاً»؟' },
          a: {
            en: 'Every {tryFirstFormats} comes with a free {vial} test vial of the same fragrance. Wear the vial first and keep the bottle sealed. If the scent is not for you, return the sealed bottle within {returnPeriod} for a full refund, and keep the vial.',
            ar: 'تصلك مع كلٍّ من {tryFirstFormats} عيّنة تجربة مجانية بحجم {vial} من العطر نفسه. جرّب العيّنة أولاً وأبقِ الزجاجة مختومة، وإن لم يناسبك العطر فأعِد الزجاجة مختومة خلال {returnPeriod} واسترد المبلغ كاملاً، وتبقى العيّنة لك.',
          },
          link: { to: `${SHIPPING}#try-first`, label: { en: 'Try First in full', ar: '«جرّب أولاً» بالتفصيل' } },
        },
        {
          q: { en: 'Can I return a fragrance I have opened?', ar: 'هل أستطيع إرجاع عطر فتحته؟' },
          a: {
            en: 'Only if it is faulty. A broken seal cannot be sold again, which is why a full bottle, spray or tola arrives with a test vial: wear that first.',
            ar: 'فقط إذا كان معيباً. لا يمكن بيع زجاجة كُسر ختمها من جديد، ولهذا تصل الزجاجة الكاملة والبخاخ والتولة مع عيّنة تجربة: جرّبها أولاً.',
          },
        },
        {
          q: { en: 'How long do I have to return something?', ar: 'كم لديّ من وقت للإرجاع؟' },
          a: {
            en: '{returnPeriod} from delivery, for anything still sealed, refunded in full.',
            ar: '{returnPeriod} من التسليم، لكلّ ما زال مختوماً، مع استرداد كامل.',
          },
        },
        {
          q: { en: 'Who pays to send it back?', ar: 'من يتحمّل تكلفة الإرجاع؟' },
          a: {
            en: 'We do. Write to us before you send anything, and we collect it from you, anywhere we deliver.',
            ar: 'نحن. راسلنا قبل أن تعيد أيّ شيء، ونستلمه منك أينما نوصّل.',
          },
        },
      ],
    },
    {
      id: 'gifting',
      group: { en: 'Gifting', ar: 'الهدايا' },
      items: [
        {
          q: { en: 'Do you gift wrap?', ar: 'هل تغلّفون الهدايا؟' },
          a: {
            en: 'Yes. Send any fragrance as a gift from its page or from your cart. Every gift goes in our {boxSignature} at no charge; for an occasion, there is the {boxSadu} ({boxSaduPrice}) or the {boxMajlis} ({boxMajlisPrice}).',
            ar: 'نعم. يمكنك إرسال أيّ عطر هديةً من صفحته أو من سلّتك. وتوضع كلّ هدية في {boxSignature} دون مقابل، وللمناسبات هناك {boxSadu} ({boxSaduPrice}) أو {boxMajlis} ({boxMajlisPrice}).',
          },
        },
        {
          q: { en: 'Can I add a message?', ar: 'هل يمكنني إضافة رسالة؟' },
          a: {
            en: 'Yes: a message card of up to {giftMessageMax} characters, in English or Arabic, signed with the name you choose. You see it on screen as it will be printed.',
            ar: 'نعم، بطاقة برسالة تصل إلى {giftMessageMax} حرف، بالعربية أو الإنجليزية، تُوقَّع بالاسم الذي تختاره. وتراها على الشاشة كما ستُطبع.',
          },
        },
        {
          q: { en: 'Can you deliver straight to the person?', ar: 'هل توصلون الهدية إلى صاحبها مباشرةً؟' },
          a: {
            en: 'Yes. Choose to deliver directly to the recipient, and checkout asks for their name, mobile and address in Kuwait. The driver arranges the hand-over with them, not with you. Cash on delivery is not available for these orders.',
            ar: 'نعم. اختر التوصيل إلى المستلم مباشرةً، وسيطلب منك نموذج الطلب اسمه ورقم هاتفه وعنوانه في الكويت. ويرتّب السائق موعد التسليم معه لا معك. ولا يتوفّر الدفع نقداً عند التسليم لهذه الطلبات.',
          },
        },
        {
          q: { en: 'Will they see what I paid?', ar: 'هل سيرى المستلم السعر؟' },
          a: {
            en: 'Not unless you want them to. The packing slip leaves prices off unless you ask for them, and your receipt goes to your email, not into the box.',
            ar: 'لا، إلّا إذا أردت ذلك. فقسيمة التغليف تخلو من الأسعار ما لم تطلبها، ويصل إيصالك إلى بريدك الإلكتروني لا إلى داخل العلبة.',
          },
        },
        {
          q: { en: 'Can they return or exchange it?', ar: 'هل يمكن للمستلم إرجاعها أو استبدالها؟' },
          a: {
            en: 'Yes, on the same terms as any order: anything still sealed, within {returnPeriod}. The refund goes to whoever paid; the recipient can ask for an exchange instead.',
            ar: 'نعم، بشروط أيّ طلب آخر: كلّ ما زال مختوماً، خلال {returnPeriod}. ويُردّ المبلغ إلى من دفع، وللمستلم أن يطلب الاستبدال بدلاً من ذلك.',
          },
        },
      ],
    },
    {
      id: 'fragrance',
      group: { en: 'Fragrance and care', ar: 'العطر والعناية به' },
      items: [
        {
          q: { en: 'What do the concentrations mean?', ar: 'ما الفرق بين التركيزات؟' },
          a: {
            en: 'Extrait de parfum is the richest, at {extraitOil} perfume oil — for the majlis and the evening. Eau de parfum, at {edpOil}, is the everyday strength; eau de toilette, at {edtOil}, is lighter, for the office and the hottest afternoons. An attar is pure perfume oil with no alcohol at all: a touch on the pulse points lasts for hours. None is better than another; each suits a different moment.',
            ar: 'خلاصة العطر أغناها، بنسبة {extraitOil} من الزيت العطري، وهي للمجلس والمساء. وماء العطر بنسبة {edpOil} هو تركيز الاستعمال اليومي، أمّا ماء التواليت بنسبة {edtOil} فأخفّ، للعمل ولأشدّ ساعات الظهيرة حرّاً. والدهن العطري زيت صافٍ بلا كحول، تكفي منه لمسة على مواضع النبض لتدوم ساعات. وليس تركيز أفضل من آخر، فلكلٍّ منها وقته.',
          },
        },
        {
          q: { en: 'What are a tola and a quarter tola?', ar: 'ما التولة وربع التولة؟' },
          a: {
            en: 'The Gulf’s traditional measures for perfume oil. A tola is about {tolaMl} — once the weight of a silver rupee — and a quarter tola about {quarterTolaMl}. Oil is worn a drop at a time, so a tola lasts a long while.',
            ar: 'مقاييس الخليج التقليدية للدهن العطري. التولة نحو {tolaMl}، وكانت في الأصل وزن روبية فضية، وربع التولة نحو {quarterTolaMl}. ويُستعمل الدهن قطرةً قطرة، فتدوم التولة طويلاً.',
          },
        },
        {
          q: { en: 'How do I layer bukhoor, oil and spray?', ar: 'كيف أجمع بين البخور والدهن والبخاخ؟' },
          a: {
            en: 'The Gulf way, in three steps: bukhoor smoke through your clothes and hair, then a touch of oil on the pulse points, then the spray over it. Each fragrance page suggests pairings that work together.',
            ar: 'على الطريقة الخليجية، في ثلاث خطوات: دخان البخور على ثيابك وشعرك، ثم لمسة من الدهن على مواضع النبض، ثم البخاخ فوقه. وفي صفحة كلّ عطر اقتراحات لما يتناغم معه.',
          },
        },
        {
          q: {
            en: 'What do longevity, projection and heat resistance mean?',
            ar: 'ما المقصود بالثبات والفوحان ومقاومة الحرارة؟',
          },
          a: {
            en: 'They are the house’s own guide. Longevity is how many hours a fragrance typically lasts on skin; projection is how far it carries from you; heat resistance, out of five, is how it holds up in a Kuwaiti summer. Skin, clothes and weather change all three, so read them as a description, not a promise.',
            ar: 'هي دليل الدار الخاص. فالثبات عدد الساعات التي يدومها العطر عادةً على البشرة، والفوحان مدى انتشاره من حولك، ومقاومة الحرارة تقييم من خمسة لأدائه في صيف الكويت. وتتأثّر الثلاثة بالبشرة والثياب والطقس، فاقرأها وصفاً لا وعداً.',
          },
        },
        {
          q: { en: 'How should I store a bottle?', ar: 'كيف أحفظ العطر؟' },
          a: {
            en: 'Away from light and heat, upright, in its box — and never in the car. A car parked in a Kuwaiti summer can pass sixty degrees inside, which spoils a fragrance in an afternoon. A bathroom shelf is the other place it should not live.',
            ar: 'بعيداً عن الضوء والحرارة، قائماً، في علبته، ولا تتركه في السيارة أبداً. فالسيارة المتوقّفة في صيف الكويت قد تتجاوز حرارتها من الداخل ستين درجة، وهذا يُفسد العطر في ظهيرة واحدة. ورفّ الحمّام هو المكان الآخر الذي لا ينبغي أن يُحفظ فيه.',
          },
        },
        {
          q: { en: 'How long does a bottle keep?', ar: 'كم يدوم العطر؟' },
          a: {
            en: 'About five years unopened, and two to three once a spray is open. Attars, with no alcohol to fade, keep longer still, and oud, amber and resins often deepen with age; the brightest citrus notes are the first to tire.',
            ar: 'نحو خمس سنوات وهو مغلق، وسنتين إلى ثلاث بعد فتح البخاخ. أمّا الدهون العطرية، وليس فيها كحول يتطاير، فتدوم أطول من ذلك، وكثيراً ما يزداد العود والعنبر والراتنجات عمقاً مع الوقت، فيما تكون النفحات الحمضية المشرقة أوّل ما يخبو.',
          },
        },
        {
          q: { en: 'Can I try before I buy?', ar: 'هل يمكنني التجربة قبل الشراء؟' },
          a: {
            en: 'Two ways. Every fragrance comes as a {vial} sample vial for a few dinars, and every {tryFirstFormats} arrives with a free test vial of the same scent, so you can wear it before you break the seal. Not sure where to start? The Scent Finder suggests three fragrances from five questions.',
            ar: 'بطريقتين. فلكلّ عطر عيّنة بحجم {vial} ببضعة دنانير، وتصلك مع كلٍّ من {tryFirstFormats} عيّنة تجربة مجانية من العطر نفسه لتجرّبه قبل أن تكسر الختم. ولا تعرف من أين تبدأ؟ جرّب «اكتشف عطرك»: خمسة أسئلة تقترح عليك ثلاثة عطور.',
          },
          link: { to: SCENT_FINDER, label: { en: 'Open the Scent Finder', ar: 'افتح «اكتشف عطرك»' } },
        },
      ],
    },
  ],
}
