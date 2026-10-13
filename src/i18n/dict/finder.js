// Scent Finder, and the site chrome the same owner keeps (owner P4). Keys: 'finder.*'
//
// finder.*          the quiz page, its results and the homepage teaser. The
//                   questions and options themselves are catalogue data in
//                   src/lib/scent-finder.js, rendered with tr().
// finder.reason.*   why a fragrance suits the answers; keys returned by
//                   recommend(). {family} and {note} arrive as labels in the
//                   active language, {hours} as formatHours(), {temp} as
//                   formatNumber().
// finder.footer.*   the footer; finder.row.* the merchandised rows;
//                   finder.contact.* and finder.site.* the contact page and
//                   the addresses it shares with the footer.
//
// {step} {total} {percent} {count} {year} are numbers already written in the
// active script; {name} a fragrance, {format} a format label.
export default {
  en: {
    'finder.pageTitle': 'Scent Finder — Nafsah',
    'finder.name': 'Scent Finder',

    // Intro
    'finder.intro.title': 'Five questions to your signature',
    'finder.intro.body':
      'Tell us where you will wear it, the character that draws you in, the season and how far it should carry. We read every fragrance in the house against your answers and show you the closest.',
    'finder.intro.note': 'About a minute. Your answers are kept in this page’s address and nowhere else.',
    'finder.intro.start': 'Begin',
    'finder.intro.questions': 'The five questions',

    // Steps
    'finder.step': 'Step {step} of {total}',
    'finder.progress': 'Your progress',
    'finder.back': 'Back',
    'finder.next': 'Next',
    'finder.seeMatches': 'See my matches',
    'finder.chooseOne': 'Choose one to continue.',

    // Results
    'finder.results.eyebrow': 'Your matches',
    'finder.results.title': 'Chosen for your answers',
    'finder.results.body':
      'The three closest to what you told us, then three more worth trying. Change any answer and the list moves with it.',
    'finder.results.answers': 'Your answers',
    'finder.results.change': 'Change {question}: {answer}',
    'finder.results.match': '{percent} match',
    'finder.results.matchLabel': 'Match with your answers',
    'finder.results.why': 'Why it suits you',
    'finder.results.added': '{name}, {format}, is in your cart',
    'finder.results.sample': 'Or try the {format} first',
    // Between the sample offer and its price. Arabic takes a comma: a middle dot beside a price reads as a zero.
    'finder.results.priceSeparator': ' · ',
    'finder.results.more': 'Also worth trying',
    'finder.results.seeAll': 'See your top matches in the catalogue',
    'finder.results.seeAllHint': 'Opens the catalogue on {families}, the families of your three closest matches.',
    'finder.results.startAgain': 'Start again',
    'finder.results.copyLink': 'Copy the link to these matches',
    'finder.results.copied': 'Link copied',
    'finder.results.shareNote': 'The address of this page keeps your answers, so the link brings these matches back.',

    // Reasons
    'finder.reason.familyMain': 'Built around {family}',
    'finder.reason.familyAccent': 'With a thread of {family}',
    'finder.reason.note': 'Carries {note}',
    'finder.reason.occasion.diwaniya': 'Made for the Diwaniya',
    'finder.reason.occasion.office': 'Polite enough for the office',
    'finder.reason.occasion.wedding': 'Made for weddings and occasions',
    'finder.reason.occasion.everyday': 'Easy to wear every day',
    'finder.reason.heatThrives': 'Holds up in {temp}°C heat',
    'finder.reason.heatHolds': 'Comfortable in a Kuwaiti summer',
    'finder.reason.winter': 'Warm enough for winter nights',
    'finder.reason.allYear': 'Right in summer and in winter',
    'finder.reason.projection.intimate': 'Stays close to the skin',
    'finder.reason.projection.moderate': 'Projects without shouting',
    'finder.reason.projection.strong': 'Carries across a majlis',
    'finder.reason.projection.beast': 'Beast-mode projection',
    'finder.reason.unisex': 'Made to be shared',
    'finder.reason.longevity': 'Lasts {hours} on skin',

    // Homepage teaser
    'finder.teaser.eyebrow': 'Not sure where to begin?',
    'finder.teaser.title': 'Find your scent in five questions',
    'finder.teaser.body':
      'Diwaniya or office, heavy oud or sea air, a Kuwaiti summer or winter nights. Answer five questions and we will read the whole house against them.',
    'finder.teaser.cta': 'Start the Scent Finder',
    'finder.teaser.duration': 'About a minute',

    // Merchandised rows
    'finder.row.allTitle': 'The whole catalogue',
    'finder.row.count.one': '{count} fragrance',
    'finder.row.count.other': '{count} fragrances',

    // Footer
    'finder.footer.tagline':
      'Maison de parfum, founded {year}. Sprays composed in Grasse, perfume oils in the Gulf tradition, delivered across Kuwait.',
    'finder.footer.col.catalogue': 'Catalogue',
    'finder.footer.col.house': 'The House',
    'finder.footer.col.care': 'Client Care',
    'finder.footer.link.catalogue': 'The Catalogue',
    'finder.footer.link.newArrivals': 'New Arrivals',
    'finder.footer.link.bestsellers': 'Bestsellers',
    'finder.footer.link.scentFinder': 'Scent Finder',
    'finder.footer.link.gifting': 'Gifting',
    'finder.footer.link.story': 'Our Story',
    'finder.footer.link.sourcing': 'Sourcing',
    'finder.footer.link.reading': 'Reading a Fragrance',
    'finder.footer.link.shipping': 'Shipping & Returns',
    'finder.footer.link.faq': 'FAQ',
    'finder.footer.link.track': 'Track an Order',
    'finder.footer.link.consultation': 'Consultation',
    'finder.footer.link.international': 'GCC & International Orders',
    'finder.footer.emailPlaceholder': 'you@example.com',
    'finder.footer.subscribedNote': 'Demonstration storefront: no subscription was saved.',
    'finder.footer.cod': 'Cash on delivery',

    // Contact page and shared addresses
    'finder.site.boutiqueAddress': 'Arabian Gulf Street, Kuwait City',
    'finder.site.atelierAddress': '12 Boulevard du Jeu de Ballon, Grasse',
    'finder.contact.subjectInternational': 'A GCC or international order',
    'finder.contact.international':
      'Checkout delivers within Kuwait. For the GCC or further afield, write to us and we will arrange the order by hand.',
  },
  ar: {
    'finder.pageTitle': 'اكتشف عطرك — نَفْسَة',
    'finder.name': 'اكتشف عطرك',

    'finder.intro.title': 'خمسة أسئلة تقودك إلى بصمتك العطرية',
    'finder.intro.body':
      'أخبرنا أين ستتعطّر، وأيّ طابع يشدّك، وفي أيّ موسم، وإلى أيّ مدى تريده أن يفوح. نقرأ كل عطر في الدار على ضوء إجاباتك، ونعرض عليك الأقرب إليك.',
    'finder.intro.note': 'يستغرق دقيقة تقريباً. تبقى إجاباتك في عنوان هذه الصفحة فقط، ولا تُحفظ في أي مكان آخر.',
    'finder.intro.start': 'ابدأ',
    'finder.intro.questions': 'الأسئلة الخمسة',

    'finder.step': 'الخطوة {step} من {total}',
    'finder.progress': 'مدى تقدّمك',
    'finder.back': 'السابق',
    'finder.next': 'التالي',
    'finder.seeMatches': 'اعرض ما يناسبني',
    'finder.chooseOne': 'اختر إجابة للمتابعة.',

    'finder.results.eyebrow': 'ما يناسبك',
    'finder.results.title': 'اختيارات على ضوء إجاباتك',
    'finder.results.body':
      'الثلاثة الأقرب إلى ما أخبرتنا به، ثم ثلاثة أخرى تستحق التجربة. غيّر أيّ إجابة وسيتغيّر الترتيب معها.',
    'finder.results.answers': 'إجاباتك',
    'finder.results.change': 'غيّر {question}: {answer}',
    'finder.results.match': 'توافق {percent}',
    'finder.results.matchLabel': 'التوافق مع إجاباتك',
    'finder.results.why': 'لماذا يناسبك',
    'finder.results.added': '{name}، {format}، في سلّتك الآن',
    'finder.results.sample': 'أو جرّب {format} أولاً',
    'finder.results.priceSeparator': '، ',
    'finder.results.more': 'تستحق التجربة أيضاً',
    'finder.results.seeAll': 'اعرض أفضل اختياراتك في الفهرس',
    'finder.results.seeAllHint': 'يفتح الفهرس على {families}، وهي عائلات أقرب ثلاثة اختيارات إليك.',
    'finder.results.startAgain': 'ابدأ من جديد',
    'finder.results.copyLink': 'انسخ رابط هذه النتائج',
    'finder.results.copied': 'تم نسخ الرابط',
    'finder.results.shareNote': 'يحتفظ عنوان هذه الصفحة بإجاباتك، فيعيدك الرابط إلى هذه النتائج نفسها.',

    'finder.reason.familyMain': 'مبنيّ على {family}',
    'finder.reason.familyAccent': 'تسري فيه لمسة من {family}',
    'finder.reason.note': 'يحمل نفحة من {note}',
    'finder.reason.occasion.diwaniya': 'صُنع للديوانية',
    'finder.reason.occasion.office': 'هادئ بما يليق بأجواء العمل',
    'finder.reason.occasion.wedding': 'صُنع للأعراس والمناسبات',
    'finder.reason.occasion.everyday': 'يسهل وضعه كل يوم',
    'finder.reason.heatThrives': 'يصمد في حرّ {temp}°',
    'finder.reason.heatHolds': 'مريح في صيف الكويت',
    'finder.reason.winter': 'دافئ بما يكفي لليالي الشتاء',
    'finder.reason.allYear': 'يناسب الصيف والشتاء معاً',
    'finder.reason.projection.intimate': 'يبقى قريباً من البشرة',
    'finder.reason.projection.moderate': 'يفوح دون مبالغة',
    'finder.reason.projection.strong': 'يصل أثره إلى أرجاء المجلس',
    'finder.reason.projection.beast': 'فوحان طاغٍ',
    'finder.reason.unisex': 'صُنع ليتشاركه الجميع',
    'finder.reason.longevity': 'يدوم {hours} على البشرة',

    'finder.teaser.eyebrow': 'لا تعرف من أين تبدأ؟',
    'finder.teaser.title': 'اكتشف عطرك في خمسة أسئلة',
    'finder.teaser.body':
      'الديوانية أم العمل، عود ثقيل أم نسيم البحر، صيف الكويت أم ليالي الشتاء. أجب عن خمسة أسئلة ونقرأ لك عطور الدار كلها على ضوء إجاباتك.',
    'finder.teaser.cta': 'ابدأ اكتشاف عطرك',
    'finder.teaser.duration': 'دقيقة تقريباً',

    'finder.row.allTitle': 'الفهرس كاملاً',
    'finder.row.count.zero': 'لا عطور',
    'finder.row.count.one': 'عطر واحد',
    'finder.row.count.two': 'عطران',
    'finder.row.count.few': '{count} عطور',
    'finder.row.count.many': '{count} عطراً',
    'finder.row.count.other': '{count} عطر',

    'finder.footer.tagline':
      'دار عطور تأسست عام {year}. بخاخات تُركَّب في غراس، ودهون عطرية على الطريقة الخليجية، تصلك في أنحاء الكويت.',
    'finder.footer.col.catalogue': 'الفهرس',
    'finder.footer.col.house': 'الدار',
    'finder.footer.col.care': 'خدمة العملاء',
    'finder.footer.link.catalogue': 'الفهرس الكامل',
    'finder.footer.link.newArrivals': 'وصل حديثاً',
    'finder.footer.link.bestsellers': 'الأكثر مبيعاً',
    'finder.footer.link.scentFinder': 'اكتشف عطرك',
    'finder.footer.link.gifting': 'الهدايا',
    'finder.footer.link.story': 'قصتنا',
    'finder.footer.link.sourcing': 'مصادر المواد',
    'finder.footer.link.reading': 'كيف تقرأ العطر',
    'finder.footer.link.shipping': 'الشحن والإرجاع',
    'finder.footer.link.faq': 'الأسئلة الشائعة',
    'finder.footer.link.track': 'تتبّع الطلب',
    'finder.footer.link.consultation': 'استشارة',
    'finder.footer.link.international': 'طلبات الخليج والطلبات الدولية',
    'finder.footer.emailPlaceholder': 'بريدك الإلكتروني',
    'finder.footer.subscribedNote': 'متجر تجريبي: لم يُحفَظ أي اشتراك.',
    'finder.footer.cod': 'الدفع عند الاستلام',

    'finder.site.boutiqueAddress': 'شارع الخليج العربي، مدينة الكويت',
    'finder.site.atelierAddress': '١٢ شارع جو دو بالون، غراس',
    'finder.contact.subjectInternational': 'طلب إلى دول الخليج أو خارجها',
    'finder.contact.international':
      'يقتصر التوصيل عند إتمام الطلب على الكويت. للطلبات إلى دول الخليج أو خارجها، راسلنا وسنرتّبها لك مباشرة.',
  },
}
