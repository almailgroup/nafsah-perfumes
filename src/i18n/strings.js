/**
 * UI dictionary. Product copy lives in src/data/products.js alongside the
 * English so the two can never drift apart.
 *
 * CORE holds the site-wide strings, including every claim the homepage makes
 * about the house (the hero slides, the story, the reading guide), so they can
 * be reviewed in one place. Each feature keeps its own dictionary in ./dict/,
 * with keys prefixed by its namespace ('checkout.err.required'), and STRINGS
 * merges them per language. A key may live in one place only.
 *
 * Policy figures are never typed in: {threshold}, {cutoff}, {vial} and the
 * like are filled from src/data by policyVars() in src/data/help.js.
 *
 * The imports carry their .js extension so plain Node can load this file for
 * `npm run check:i18n`.
 */
import catalogue from './dict/catalogue.js'
import checkout from './dict/checkout.js'
import delivery from './dict/delivery.js'
import finder from './dict/finder.js'
import gifting from './dict/gifting.js'
import product from './dict/product.js'
import reviews from './dict/reviews.js'
import trust from './dict/trust.js'

export const CORE = {
  en: {
    dir: 'ltr',
    localeTag: 'en-KW',
    brand: 'Nafsah',
    switchTo: 'العربية',
    // The announcement bar, in this order: AnnouncementBar.jsx pairs each
    // line with its icon by position. Placeholders come from policyVars().
    announce: [
      'Complimentary delivery on orders of {threshold} or more',
      'Same-day delivery before {cutoff} · except {restDays} and outlying areas',
      'Try First: a free {vial} test vial with every {tryFirstFormats}',
    ],
    announceLabel: 'Announcements',
    announcePause: 'Pause announcements',
    announcePlay: 'Play announcements',
    searchPlaceholder: 'Search by name, note or family…',
    searchShort: 'Search by name or note…',
    search: 'Search',
    openCart: 'Open cart',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    allPerfumes: 'All Perfumes',
    theHouse: 'The House',
    notes: 'Notes',
    contact: 'Contact',
    shopNow: 'Shop Now',
    from: 'from',
    shopByFamily: 'Shop by family',
    bestsellers: 'Bestsellers',
    bestsellersCaption: 'The house signatures',
    newArrivals: 'New Arrivals',
    newArrivalsCaption: 'Latest from the atelier',
    viewAll: 'View all',
    theCatalogue: 'The Catalogue',
    price: 'Price',
    sort: 'Sort',
    family: 'Family',
    reset: 'Reset',
    addToCart: 'Add to Cart',
    added: 'Added',
    newBadge: 'New',
    bestsellerBadge: 'Bestseller',
    top: 'Top',
    heart: 'Heart',
    base: 'Base',
    noMatch: 'Nothing matches that yet',
    sortFeatured: 'Featured',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRating: 'Top Rated',
    sortNewest: 'Newest',
    yourCart: 'Your Cart',
    cartEmpty: 'Your cart is empty',
    cartEmptyBody:
      'Every {tryFirstFormats} arrives with a free test vial of the same fragrance, so you can wear it before you break the seal.',
    browseCatalogue: 'Browse the Catalogue',
    awayFromFree: '{amount} away from complimentary delivery',
    freeUnlocked: 'Complimentary delivery unlocked',
    subtotal: 'Subtotal',
    shipping: 'Delivery',
    complimentary: 'Complimentary',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    securePayment: 'Secure payment · KNET, card, Apple Pay or cash',
    remove: 'Remove',
    orderSummary: 'Order summary',
    processing: 'Processing',
    order: 'Order',
    continueBrowsing: 'Continue Browsing',
    closeCart: 'Close cart',
    privateList: 'Private List',
    newsletterTitle: 'First access to every new composition',
    newsletterBody:
      'Two letters a year, no more: new compositions, the return of retired ones, and invitations to the atelier.',
    join: 'Join',
    subscribed: 'Subscribed',
    emailAddress: 'Email address',
    weAccept: 'We accept',
    privacy: 'Privacy',
    terms: 'Terms',
    rights: '© {year} Nafsah — A demonstration storefront',
    skipToCatalogue: 'Skip to catalogue',
    skipToContent: 'Skip to content',

    // Hero carousel. Slide copy is keyed by slide; headlines are three lines.
    heroLabel: 'Featured fragrances',
    heroSlide: '{index} of {total}: {name}',
    heroDot: 'Show slide {index}: {name}',
    heroPause: 'Pause the slideshow',
    heroPlay: 'Play the slideshow',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide',
    heroFinder: 'Find your scent',
    heroSignatureEyebrow: 'The house signature',
    heroSignatureHeadline: ['Scent is the', 'last thing', 'they forget'],
    heroSignatureBody:
      'Saffron and cardamom over labdanum and Madagascan vanilla — an extrait for winter nights and wedding halls.',
    heroOilEyebrow: 'New · Perfume oil',
    heroOilHeadline: ['Taif rose,', 'picked before', 'sunrise'],
    heroOilBody:
      'Taif rose oil with no alcohol, by the tola and the quarter tola. A drop on the pulse stays with you into the night.',
    heroHeatEyebrow: 'Built for the heat',
    heroHeatHeadline: ['Cold-pressed', 'lemon over', 'salt air'],
    heroHeatBody:
      'Sicilian lemon and yuzu against a mineral accord, settling into sun-bleached driftwood. Made to carry through a Kuwaiti summer afternoon.',

    // Reading a fragrance: the pyramid, then layering.
    readingFragrance: 'Reading a Fragrance',
    pyramidTitle: 'Top, heart and base',
    pyramidBody:
      'Every fragrance in the catalogue sets out its pyramid, the oils included. Here is how to read one before you buy.',
    notesTopWindow: 'The first {minutes} minutes',
    notesTopBody: 'The opening. Bright citrus, spice and saffron that announce the fragrance, then step aside.',
    notesHeartWindow: 'Hours {from} to {to}',
    notesHeartBody: 'The character of the composition — rose, jasmine, resins and oud that carry it through the day.',
    notesBaseWindow: 'From hour {hour} onward',
    notesBaseBody:
      'What remains on skin and fabric. Woods, musk and ambergris that fix the fragrance and give it a memory — in an attar, the base is most of the story.',
    layeringEyebrow: 'Layering',
    layeringTitle: 'Wear it the Gulf way',
    layeringBody:
      'In the Gulf, scent is worn in layers, each holding the next. Every fragrance page suggests pairings; this is the order they go on.',
    layeringBukhoorTitle: 'Bukhoor first',
    layeringBukhoorBody: 'Let the smoke pass through your clothes, your hair and the ghutra or shayla.',
    layeringOilTitle: 'Then the oil',
    layeringOilBody:
      'A touch of attar on the pulse points — the wrists, behind the ears, the base of the throat. It anchors everything above it.',
    layeringSprayTitle: 'The spray last',
    layeringSprayBody: 'Over the oil, never instead of it: on skin and on clothes, from arm’s length.',

    // The house.
    houseTitle: 'Between Grasse and the Gulf',
    houseLede:
      'Nafsah began in {founded} as a three-bench atelier supplying attars to the perfume sellers of the Gulf. The oils are still here — Taif rose and Cambodi oud, by the tola — beside the sprays we compose in Grasse: extraits for the majlis, lighter waters for the office and the heat. Small batches, long maceration, and formulas that are allowed to be difficult.',
    houseQuote: '“A perfume should be recognised before it is announced.”',
    founder: 'Yusuf Nafsah, founder',
    houseSourcesTitle: 'Single-origin materials',
    houseSourcesBody:
      'Taif rose from the terraces of Al Hada, Cambodi oud, jasmine sambac from Tamil Nadu, iris aged six years in Florence. We name every source on the carton.',
    houseGrasseTitle: 'Composed in Grasse, finished in Kuwait',
    houseGrasseBody:
      'Every spray is built by hand at the Grasse bench and left to macerate for four weeks before a bottle is filled. The oils are decanted by the tola at the Kuwait boutique, and the {vial} vials are filled and sealed there too.',
    houseStrengthTitle: 'Four concentrations, one standard',
    houseStrengthBody:
      'Extrait at {extraitOil} perfume oil for the majlis and the evening; eau de parfum at {edpOil} and eau de toilette at {edtOil} for the office and the heat; and attar, pure oil with no alcohol at all. Strength is chosen for how a fragrance should wear, never to rank one above another.',
    houseFormulaTitle: 'Never reformulated',
    houseFormulaBody:
      'A Nafsah bottled in {year} smells like one bottled today. We would rather retire a fragrance than cheapen its materials.',

    trustAuthentic: 'Guaranteed authentic',
    trustAuthenticBody: 'Sprays sealed in Grasse; oils and vials at our Kuwait boutique',
    trustAdvice: 'Fragrance consultation',
    trustAdviceBody: 'Speak to the atelier before you buy',
    viewDetails: 'View details',
    closeDetails: 'Close details',
    titleHome: 'Nafsah Perfumes In Kuwait',
    titleContact: 'Contact — Nafsah',
    titlePrivacy: 'Privacy Policy — Nafsah',
    titleTerms: 'Terms of Sale — Nafsah',
    titleShipping: 'Shipping & Returns — Nafsah',
    titleFaq: 'Frequently Asked — Nafsah',
    helpEyebrow: 'Help',
    faqHeading: 'Frequently asked',
    faqLede: 'The questions the atelier is asked most. If yours is not here, ask it — a perfumer answers.',
    shippingReturns: 'Shipping & Returns',
    faq: 'FAQ',
    moreHelpTitle: 'Not answered here?',
    moreHelpBody:
      'Delivery, Try First and returns are set out in full on their own page, and anything else reaches a perfumer directly.',
    legalEyebrow: 'Legal',
    lastUpdated: 'Last updated {date}',
    contents: 'Contents',
    legalQuestionsTitle: 'Still unsure?',
    legalQuestionsBody: 'If anything here is unclear, or you would like it in writing for a particular order, ask us.',
    contactEyebrow: 'Client care',
    contactHeading: 'Talk to the atelier',
    contactLede:
      'Questions about a composition, an order already placed, which fragrance suits someone you are buying for, or delivery outside Kuwait, which we arrange by request. A perfumer answers, not a script.',
    contactFormTitle: 'Send a message',
    contactDirect: 'Reach us directly',
    contactResponse: 'We answer within one working day, Sunday to Thursday.',
    fieldName: 'Full name',
    fieldEmail: 'Email address',
    fieldSubject: 'What is this about?',
    fieldMessage: 'Message',
    subjectGeneral: 'A general question',
    subjectOrder: 'An order I have placed',
    subjectConsultation: 'A fragrance consultation',
    subjectWholesale: 'Wholesale and press',
    sendMessage: 'Send message',
    messageSent: 'Not sent — demonstration storefront',
    messageSentBody:
      'This storefront is a demonstration, so your note has not been sent to anyone. To reach the house, email or WhatsApp the boutique directly using the details on this page.',
    sendAnother: 'Send another',
    required: 'This field is required',
    invalidEmail: 'Enter a valid email address',
    boutiqueTitle: 'Kuwait boutique',
    atelierTitle: 'Grasse atelier',
    hoursLabel: 'Hours',
    boutiqueHours: 'Sun–Thu, 10:00–21:00 · Sat, 14:00–21:00',
    atelierHours: 'Mon–Fri, 09:00–17:00 CET · By appointment',
    emailLabel: 'Email',
    phoneLabel: 'Telephone',
    whatsappLabel: 'WhatsApp',
  },
  ar: {
    dir: 'rtl',
    localeTag: 'ar-KW',
    brand: 'نَفْسَة',
    switchTo: 'English',
    announce: [
      'توصيل مجاني للطلبات من {threshold} فأكثر',
      'توصيل في اليوم نفسه للطلبات قبل {cutoff} · ما عدا {restDays} والمناطق البعيدة',
      'جرّب أولاً: عيّنة تجربة مجانية بحجم {vial} مع كلٍّ من {tryFirstFormats}',
    ],
    announceLabel: 'إعلانات الدار',
    announcePause: 'إيقاف الإعلانات مؤقتاً',
    announcePlay: 'تشغيل الإعلانات',
    searchPlaceholder: 'ابحث بالاسم أو النوتة أو العائلة…',
    searchShort: 'ابحث بالاسم أو النوتة…',
    search: 'بحث',
    openCart: 'فتح السلة',
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    allPerfumes: 'جميع العطور',
    theHouse: 'الدار',
    notes: 'النوتات',
    contact: 'اتصل بنا',
    shopNow: 'تسوّق الآن',
    from: 'يبدأ من',
    shopByFamily: 'تسوّق حسب العائلة',
    bestsellers: 'الأكثر مبيعاً',
    bestsellersCaption: 'توقيعات الدار',
    newArrivals: 'وصل حديثاً',
    newArrivalsCaption: 'أحدث ما في المعمل',
    viewAll: 'عرض الكل',
    theCatalogue: 'الفهرس',
    price: 'السعر',
    sort: 'الترتيب',
    family: 'العائلة',
    reset: 'إعادة',
    addToCart: 'أضف إلى السلة',
    added: 'أُضيف',
    newBadge: 'جديد',
    bestsellerBadge: 'الأكثر مبيعاً',
    top: 'المقدمة',
    heart: 'القلب',
    base: 'القاعدة',
    noMatch: 'لا نتائج مطابقة',
    sortFeatured: 'المميّزة',
    sortPriceAsc: 'السعر: من الأقل',
    sortPriceDesc: 'السعر: من الأعلى',
    sortRating: 'الأعلى تقييماً',
    sortNewest: 'الأحدث',
    yourCart: 'سلّتك',
    cartEmpty: 'سلّتك فارغة',
    cartEmptyBody:
      'تصل كلٌّ من {tryFirstFormats} مع عيّنة تجربة مجانية من العطر نفسه، لتجرّبه قبل أن تكسر الختم.',
    browseCatalogue: 'تصفّح الفهرس',
    awayFromFree: 'يفصلك {amount} عن التوصيل المجاني',
    freeUnlocked: 'حصلت على التوصيل المجاني',
    subtotal: 'المجموع الفرعي',
    shipping: 'التوصيل',
    complimentary: 'مجاني',
    total: 'الإجمالي',
    checkout: 'إتمام الطلب',
    securePayment: 'دفع آمن · كي نت أو بطاقة أو آبل باي أو نقداً',
    remove: 'إزالة',
    orderSummary: 'ملخص الطلب',
    processing: 'جارٍ المعالجة',
    order: 'الطلب',
    continueBrowsing: 'متابعة التصفّح',
    closeCart: 'إغلاق السلة',
    privateList: 'القائمة الخاصة',
    newsletterTitle: 'أسبقية الوصول إلى كل تركيبة جديدة',
    newsletterBody: 'رسالتان في السنة، لا أكثر: تركيبات جديدة، وعودة ما توقّف منها، ودعوات إلى المعمل.',
    join: 'اشترك',
    subscribed: 'تم الاشتراك',
    emailAddress: 'البريد الإلكتروني',
    weAccept: 'نقبل',
    privacy: 'الخصوصية',
    terms: 'الشروط',
    rights: '© {year} نَفْسَة — متجر تجريبي',
    skipToCatalogue: 'انتقل إلى الفهرس',
    skipToContent: 'انتقل إلى المحتوى',

    heroLabel: 'عطور مختارة',
    heroSlide: '{index} من {total}: {name}',
    heroDot: 'عرض الشريحة {index}: {name}',
    heroPause: 'إيقاف العرض مؤقتاً',
    heroPlay: 'تشغيل العرض',
    prevSlide: 'الشريحة السابقة',
    nextSlide: 'الشريحة التالية',
    heroFinder: 'اكتشف عطرك',
    heroSignatureEyebrow: 'توقيع الدار',
    heroSignatureHeadline: ['العطر', 'آخر ما', 'يُنسى'],
    heroSignatureBody: 'زعفران وهيل فوق اللادن والفانيلا المدغشقرية — خلاصة عطر لليالي الشتاء وقاعات الأعراس.',
    heroOilEyebrow: 'جديد · دهن عطري',
    heroOilHeadline: ['ورد طائفي', 'يُقطف قبل', 'الشروق'],
    heroOilBody: 'دهن ورد طائفي بلا كحول، بالتولة وربع التولة. قطرة على النبض تبقى معك حتى الليل.',
    heroHeatEyebrow: 'صُنع للحرّ',
    heroHeatHeadline: ['ليمون معصور', 'على البارد فوق', 'هواء مالح'],
    heroHeatBody:
      'ليمون صقلي ويوزو على أكورد معدني، يستقرّ في خشب طافٍ بيّضته الشمس. صُنع ليفوح في عزّ ظهيرة الصيف الكويتي.',

    readingFragrance: 'كيف تقرأ العطر',
    pyramidTitle: 'المقدمة والقلب والقاعدة',
    pyramidBody: 'لكلّ عطر في الفهرس هرمه العطري، والدهون كذلك. وهذه طريقة قراءته قبل الشراء.',
    notesTopWindow: 'أول {minutes} دقيقة',
    notesTopBody: 'الافتتاحية. حمضيات مشرقة وتوابل وزعفران تُعلن العطر ثم تنسحب.',
    notesHeartWindow: 'من الساعة {from} إلى الساعة {to}',
    notesHeartBody: 'شخصية التركيبة — ورد وياسمين وراتنجات وعود تحملها طوال اليوم.',
    notesBaseWindow: 'من الساعة {hour} فصاعداً',
    notesBaseBody:
      'ما يبقى على البشرة والقماش. أخشاب ومسك وعنبر رمادي تثبّت العطر وتمنحه ذاكرة — وفي الدهن العطري تكاد القاعدة تكون الحكاية كلّها.',
    layeringEyebrow: 'طبقات العطر',
    layeringTitle: 'تعطّر على الطريقة الخليجية',
    layeringBody:
      'في الخليج يُوضع العطر طبقاتٍ، تمسك كلّ طبقة بما بعدها. وفي صفحة كلّ عطر اقتراحات للجمع بينها، وهذا ترتيب وضعها.',
    layeringBukhoorTitle: 'البخور أولاً',
    layeringBukhoorBody: 'مرّر دخانه على ثيابك وشعرك والغترة أو الشيلة.',
    layeringOilTitle: 'ثم الدهن',
    layeringOilBody: 'لمسة من الدهن على مواضع النبض: المعصمين وخلف الأذنين وأسفل العنق. فهو يثبّت كلّ ما يأتي فوقه.',
    layeringSprayTitle: 'والبخاخ أخيراً',
    layeringSprayBody: 'فوق الدهن لا بدلاً منه، على البشرة والثياب، من مسافة ذراع.',

    houseTitle: 'بين غراس والخليج',
    houseLede:
      'بدأت نَفْسَة عام {founded} معملاً بثلاث طاولات يزوّد عطّاري الخليج بالدهون العطرية. وما زالت الدهون هنا — ورد طائفي وعود كمبودي بالتولة — إلى جانب البخاخات التي نركّبها في غراس: خلاصات للمجلس، وتركيزات أخفّ للعمل والحرّ. دفعات صغيرة، ونقع طويل، وتركيبات يُسمح لها أن تكون صعبة.',
    houseQuote: '«ينبغي أن يُعرف العطر قبل أن يُعلَن عنه.»',
    founder: 'يوسف نفسة، المؤسس',
    houseSourcesTitle: 'مواد أحادية المصدر',
    houseSourcesBody:
      'ورد طائفي من مدرّجات الهدا، وعود كمبودي، وياسمين سمبك من تاميل نادو، وسوسن معتّق ست سنوات في فلورنسا. نذكر كلّ مصدر على العلبة.',
    houseGrasseTitle: 'تُركَّب في غراس وتُستكمل في الكويت',
    houseGrasseBody:
      'يُبنى كلّ بخاخ يدوياً على طاولة المعمل في غراس، ويُترك للنقع أربعة أسابيع قبل تعبئة أيّ زجاجة. أمّا الدهون فتُعبّأ بالتولة في بوتيك الكويت، وهناك أيضاً تُملأ عيّنات {vial} وتُختم.',
    houseStrengthTitle: 'أربعة تركيزات ومعيار واحد',
    houseStrengthBody:
      'خلاصة العطر بنسبة {extraitOil} من الزيت العطري للمجلس والمساء، وماء العطر بنسبة {edpOil} وماء التواليت بنسبة {edtOil} للعمل والحرّ، والدهن العطري زيت صافٍ بلا كحول. نختار التركيز لما يناسب طريقة وضع العطر، لا لنفضّل عطراً على آخر.',
    houseFormulaTitle: 'لا تُعاد صياغتها أبداً',
    houseFormulaBody: 'عطر نَفْسَة المعبّأ عام {year} يشبه المعبّأ اليوم. نفضّل إيقاف العطر على أن نُرخص مواده.',

    trustAuthentic: 'أصالة مضمونة',
    trustAuthenticBody: 'البخاخات تُختم في غراس، والدهون والعيّنات في بوتيكنا بالكويت',
    trustAdvice: 'استشارة عطرية',
    trustAdviceBody: 'تحدّث إلى المعمل قبل الشراء',
    viewDetails: 'عرض التفاصيل',
    closeDetails: 'إغلاق التفاصيل',
    titleHome: 'Nafsah Perfumes In Kuwait',
    titleContact: 'اتصل بنا — نَفْسَة',
    titlePrivacy: 'سياسة الخصوصية — نَفْسَة',
    titleTerms: 'شروط البيع — نَفْسَة',
    titleShipping: 'الشحن والإرجاع — نَفْسَة',
    titleFaq: 'الأسئلة الشائعة — نَفْسَة',
    helpEyebrow: 'المساعدة',
    faqHeading: 'الأسئلة الشائعة',
    faqLede: 'أكثر ما يُسأل عنه المعمل. وإن لم يكن سؤالك هنا، فاسأله — يجيبك خبير عطور.',
    shippingReturns: 'الشحن والإرجاع',
    faq: 'الأسئلة الشائعة',
    moreHelpTitle: 'لم تجد الإجابة هنا؟',
    moreHelpBody: 'التوصيل و«جرّب أولاً» والإرجاع مشروحة بالكامل في صفحتها، وأيّ شيء آخر يصل إلى خبير عطور مباشرةً.',
    legalEyebrow: 'الشؤون القانونية',
    lastUpdated: 'آخر تحديث {date}',
    contents: 'المحتويات',
    legalQuestionsTitle: 'ما زال لديك سؤال؟',
    legalQuestionsBody: 'إن كان شيء هنا غير واضح، أو أردته كتابةً بخصوص طلب بعينه، فاسألنا.',
    contactEyebrow: 'خدمة العملاء',
    contactHeading: 'تحدّث إلى المعمل',
    contactLede:
      'أسئلة عن تركيبة، أو عن طلب تم تنفيذه، أو عن العطر الأنسب لمن تشتري له، أو عن التوصيل خارج الكويت الذي نرتّبه عند الطلب. يجيبك خبير عطور، لا نصٌّ جاهز.',
    contactFormTitle: 'أرسل رسالة',
    contactDirect: 'تواصل مباشرةً',
    contactResponse: 'نردّ خلال يوم عمل واحد، من الأحد إلى الخميس.',
    fieldName: 'الاسم الكامل',
    fieldEmail: 'البريد الإلكتروني',
    fieldSubject: 'ما موضوع الرسالة؟',
    fieldMessage: 'الرسالة',
    subjectGeneral: 'سؤال عام',
    subjectOrder: 'طلب قمت بتنفيذه',
    subjectConsultation: 'استشارة عطرية',
    subjectWholesale: 'الجملة والصحافة',
    sendMessage: 'إرسال الرسالة',
    messageSent: 'لم تُرسَل — متجر تجريبي',
    messageSentBody:
      'هذا متجر تجريبي، فلم تُرسَل ملاحظتك إلى أحد. للتواصل مع الدار، راسل البوتيك مباشرة بالبريد الإلكتروني أو واتساب من البيانات الموجودة في هذه الصفحة.',
    sendAnother: 'أرسل رسالة أخرى',
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'أدخل بريداً إلكترونياً صحيحاً',
    boutiqueTitle: 'بوتيك الكويت',
    atelierTitle: 'معمل غراس',
    hoursLabel: 'ساعات العمل',
    boutiqueHours: 'الأحد–الخميس ١٠:٠٠–٢١:٠٠ · السبت ١٤:٠٠–٢١:٠٠',
    atelierHours: 'الإثنين–الجمعة ٠٩:٠٠–١٧:٠٠ بتوقيت وسط أوروبا · بموعد مسبق',
    emailLabel: 'البريد الإلكتروني',
    phoneLabel: 'الهاتف',
    whatsappLabel: 'واتساب',
  },
}

/** Feature dictionaries by namespace; every key in dict/<name>.js starts with '<name>.'. */
export const DICTIONARIES = { catalogue, product, reviews, trust, finder, checkout, gifting, delivery }

export const LANGUAGES = ['en', 'ar']

// import.meta.env exists under Vite and Vitest; plain Node (the i18n check)
// has none and reports duplicates itself.
const DEV = Boolean(import.meta.env?.DEV)

/**
 * CORE plus every feature dictionary, per language. A key defined twice
 * throws in development (one copy would silently lose); in production the
 * first definition wins.
 */
export function mergeStrings(core, dictionaries, { strict = DEV } = {}) {
  const mergeLanguage = (lang) => {
    const merged = { ...core[lang] }
    for (const [name, dict] of Object.entries(dictionaries)) {
      for (const [key, value] of Object.entries(dict[lang] ?? {})) {
        if (!Object.hasOwn(merged, key)) merged[key] = value
        else if (strict) throw new Error(`i18n: "${key}" (${lang}) in dict/${name}.js is already defined`)
      }
    }
    return merged
  }
  return Object.fromEntries(LANGUAGES.map((lang) => [lang, mergeLanguage(lang)]))
}

export const STRINGS = mergeStrings(CORE, DICTIONARIES)
