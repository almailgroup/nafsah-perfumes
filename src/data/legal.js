/**
 * The legal pages, kept out of the interface dictionary: strings.js is for
 * chrome, and this is prose that happens to be bilingual.
 *
 * Policy figures are placeholders — {threshold}, {cutoff}, {returnPeriod} and
 * the rest, listed on policyVars() in ./help.js — filled from the same
 * constants the cart and checkout apply, so the terms cannot quietly drift
 * out of step with what an order actually costs or when it arrives.
 *
 * Section ids are the anchors in a shared link (/terms#returns-and-cancellation),
 * so they stay put when a heading is reworded.
 */
export const LEGAL_NOTE = {
  en: 'Nafsah is a demonstration storefront. This text is a working template, not legal advice — have it reviewed before you trade on it.',
  ar: 'نَفْسَة متجر تجريبي. هذا النصّ نموذج عملي وليس استشارة قانونية — راجعه قبل الاعتماد عليه في البيع الفعلي.',
}

export const LEGAL = {
  privacy: {
    updated: '2026-10-13',
    title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    lede: {
      en: 'What Nafsah collects when you browse, buy or send a gift, why we collect it, and what you can ask us to do about it. This covers nafsah.com and the order handling behind it.',
      ar: 'ما الذي تجمعه نَفْسَة حين تتصفّح أو تشتري أو ترسل هدية، ولماذا نجمعه، وما يمكنك أن تطلب منّا بشأنه. تشمل هذه السياسة موقع nafsah.com ومعالجة الطلبات خلفه.',
    },
    sections: [
      {
        id: 'what-we-collect',
        heading: { en: 'What we collect', ar: 'ما الذي نجمعه' },
        body: [{ en: 'Only what an order or a question actually needs.', ar: 'ما يحتاجه الطلب أو السؤال فعلاً، لا أكثر.' }],
        list: [
          {
            en: 'Your name, email address and Kuwaiti mobile number, when you place an order or write to us.',
            ar: 'اسمك وبريدك الإلكتروني ورقم هاتفك الكويتي، عند تنفيذ طلب أو مراسلتنا.',
          },
          {
            en: 'The delivery address for an order — governorate, area, block, street and building — and what the order contains.',
            ar: 'عنوان التوصيل — المحافظة والمنطقة والقطعة والشارع والمبنى — ومحتويات الطلب.',
          },
          {
            en: 'For a gift sent straight to its recipient: their name, mobile and address, and the message you write for the card. We use them for that delivery and nothing else.',
            ar: 'للهدية المرسلة إلى مستلمها مباشرةً: اسمه ورقم هاتفه وعنوانه، والرسالة التي تكتبها على البطاقة. نستعملها لذلك التوصيل وحده.',
          },
          {
            en: 'The correspondence you send us, so that a reply has context.',
            ar: 'المراسلات التي ترسلها إلينا، ليكون الردّ في سياقه.',
          },
          {
            en: 'Basic technical information your browser sends — the page requested, an approximate region, the type of device.',
            ar: 'معلومات تقنية أساسية يرسلها متصفّحك — الصفحة المطلوبة، المنطقة التقريبية، نوع الجهاز.',
          },
        ],
      },
      {
        id: 'what-stays-on-your-device',
        heading: { en: 'What stays on your device', ar: 'ما يبقى على جهازك' },
        body: [
          {
            en: 'Your basket, your gift options (a message card in progress included), your language choice and any review you write are kept in your browser, not on our servers. They survive a refresh so that nothing is lost, and clearing your browsing data removes them. Scent Finder answers live only in the address of the page. This site sets no advertising or tracking cookies.',
            ar: 'تُحفظ سلّتك وخيارات الهدية (ومنها بطاقة رسالة لم تكتمل بعد) واختيارك للغة وأيّ مراجعة تكتبها في متصفّحك، لا على خوادمنا. وتبقى بعد تحديث الصفحة كي لا تضيع، ويؤدّي مسح بيانات التصفّح إلى إزالتها. أمّا إجابات «اكتشف عطرك» فتبقى في عنوان الصفحة وحده. ولا يضع هذا الموقع أيّ ملفّات تتبّع أو إعلانات.',
          },
        ],
      },
      {
        id: 'why-we-collect-it',
        heading: { en: 'Why we collect it', ar: 'لماذا نجمعه' },
        list: [
          { en: 'To take, fulfil and deliver an order.', ar: 'لاستلام الطلب وتنفيذه وتوصيله.' },
          {
            en: 'To let the driver reach you, or your gift’s recipient, on the day.',
            ar: 'ليتمكّن السائق من التواصل معك، أو مع مستلم هديتك، يوم التوصيل.',
          },
          {
            en: 'To answer a question and to advise on a fragrance.',
            ar: 'للردّ على سؤال وتقديم المشورة العطرية.',
          },
          { en: 'To handle a return or a fault.', ar: 'لمعالجة إرجاع أو عيب.' },
          {
            en: 'To keep the records a retailer is required to keep.',
            ar: 'للاحتفاظ بالسجلات المطلوبة من أيّ تاجر تجزئة.',
          },
        ],
      },
      {
        id: 'payment',
        heading: { en: 'Payment', ar: 'الدفع' },
        body: [
          {
            en: 'KNET, card and Apple Pay details are entered with our payment processor and are never seen or stored by Nafsah. We receive a confirmation that the payment succeeded and the last four digits, which is what reconciliation needs and no more. Cash on delivery involves no payment details at all.',
            ar: 'تُدخَل بيانات «كي نت» والبطاقات وآبل باي لدى مزوّد خدمة الدفع، ولا تطّلع عليها نَفْسَة ولا تحتفظ بها. يصلنا تأكيد نجاح الدفع وآخر أربعة أرقام فقط، وهو ما تحتاجه المطابقة المحاسبية لا أكثر. أمّا الدفع نقداً عند التسليم فلا يتطلّب أيّ بيانات دفع.',
          },
        ],
      },
      {
        id: 'who-else-sees-it',
        heading: { en: 'Who else sees it', ar: 'من يطّلع عليها غيرنا' },
        body: [
          {
            en: 'Only those who need it to complete an order, each for one purpose:',
            ar: 'من يحتاج إليها لإتمام الطلب فقط، ولكلٍّ غرض واحد:',
          },
        ],
        list: [
          {
            en: 'The driver delivering your order — the name, address and mobile on it, which for a gift sent straight to its recipient are the recipient’s.',
            ar: 'السائق الذي يوصل طلبك — الاسم والعنوان ورقم الهاتف المدوّنة عليه، وهي للهدية المرسلة مباشرةً بيانات مستلمها.',
          },
          {
            en: 'The payment processor — what it needs to take the payment.',
            ar: 'مزوّد خدمة الدفع — ما يلزمه لتحصيل المبلغ.',
          },
        ],
        after: [
          {
            en: 'Reviews are not sent anywhere yet: they stay in your browser until the house connects a review service, and this policy will name that service when it does. We do not sell your details and we do not share them for advertising.',
            ar: 'لا تُرسَل المراجعات إلى أيّ جهة حتى الآن: تبقى في متصفّحك إلى أن تربط الدار خدمة للمراجعات، وستسمّي هذه السياسة تلك الخدمة حين يحدث ذلك. ولا نبيع بياناتك ولا نشاركها لأغراض إعلانية.',
          },
        ],
      },
      {
        id: 'how-long-we-keep-it',
        heading: { en: 'How long we keep it', ar: 'مدّة الاحتفاظ' },
        list: [
          {
            en: 'Order records, for as long as tax and consumer-protection rules require.',
            ar: 'سجلات الطلبات، طوال المدّة التي تفرضها قواعد الضريبة وحماية المستهلك.',
          },
          {
            en: 'A gift recipient’s details and the card message, until the order can no longer be returned.',
            ar: 'بيانات مستلم الهدية ورسالة البطاقة، إلى أن تنقضي مدّة إرجاع الطلب.',
          },
          { en: 'Correspondence, for two years.', ar: 'المراسلات، لمدّة سنتين.' },
          {
            en: 'A newsletter subscription, until you unsubscribe.',
            ar: 'الاشتراك في النشرة، حتى تلغيه.',
          },
        ],
      },
      {
        id: 'what-you-can-ask-for',
        heading: { en: 'What you can ask for', ar: 'ما يمكنك طلبه' },
        list: [
          { en: 'A copy of what we hold about you.', ar: 'نسخة ممّا نحتفظ به عنك.' },
          { en: 'A correction, where something is wrong.', ar: 'تصحيح أيّ معلومة خاطئة.' },
          {
            en: 'Deletion, where no legal duty requires us to keep it.',
            ar: 'الحذف، حيث لا يُلزمنا واجب قانوني بالاحتفاظ.',
          },
          { en: 'To stop receiving the newsletter, at any time.', ar: 'إيقاف النشرة في أيّ وقت.' },
        ],
        after: [
          {
            en: 'Write to us and we will answer within one working day.',
            ar: 'راسلنا وسنردّ خلال يوم عمل واحد.',
          },
        ],
      },
      {
        id: 'changes-to-this-policy',
        heading: { en: 'Changes to this policy', ar: 'تعديلات هذه السياسة' },
        body: [
          {
            en: 'If this policy changes in a way that matters, we will say so here and move the date at the top of the page.',
            ar: 'إذا تغيّرت هذه السياسة تغيّراً جوهرياً، سنوضّح ذلك هنا ونحدّث التاريخ أعلى الصفحة.',
          },
        ],
      },
    ],
  },
  terms: {
    updated: '2026-10-13',
    title: { en: 'Terms of Sale', ar: 'شروط البيع' },
    lede: {
      en: 'The terms on which Nafsah sells through nafsah.com. Placing an order means you accept them.',
      ar: 'الشروط التي تبيع نَفْسَة بموجبها عبر nafsah.com. وتنفيذ الطلب يعني قبولك بها.',
    },
    sections: [
      {
        id: 'who-you-are-dealing-with',
        heading: { en: 'Who you are dealing with', ar: 'مع من تتعامل' },
        body: [
          {
            en: 'Nafsah is a perfume house founded in {founded}. Its sprays are composed in Grasse; it sells from its boutique in Kuwait, where the oils and sample vials are decanted and sealed. Our address, telephone number and email are on the contact page.',
            ar: 'نَفْسَة دار عطور تأسّست عام {founded}. تُركَّب بخاخاتها في غراس، وتبيع من بوتيكها في الكويت حيث تُعبّأ الدهون العطرية والعيّنات وتُختم. عنواننا ورقم هاتفنا وبريدنا على صفحة الاتصال.',
          },
        ],
      },
      {
        id: 'orders',
        heading: { en: 'Orders', ar: 'الطلبات' },
        body: [
          {
            en: 'An order is an offer to buy. It is accepted when we send the confirmation email, and the contract forms at that moment. We may decline an order — if a fragrance has sold out, if we cannot reach the delivery address, or if payment cannot be authorised.',
            ar: 'الطلب عرض بالشراء. ويُقبَل عند إرسالنا بريد التأكيد، وعند تلك اللحظة ينعقد العقد. ويجوز لنا رفض الطلب — إذا نفد العطر، أو تعذّر الوصول إلى عنوان التوصيل، أو تعذّر اعتماد الدفع.',
          },
        ],
      },
      {
        id: 'prices-and-payment',
        heading: { en: 'Prices and payment', ar: 'الأسعار والدفع' },
        body: [
          {
            en: 'Prices are in Kuwaiti dinar and shown to three decimal places, because the dinar divides into a thousand fils. They include any tax that applies. We accept KNET, Visa, Mastercard and Apple Pay, taken when the order is accepted, and cash on delivery, paid to the driver — except for a gift delivered straight to its recipient.',
            ar: 'الأسعار بالدينار الكويتي وتُعرض بثلاث خانات عشرية، لأنّ الدينار ينقسم إلى ألف فلس. وهي شاملة لأيّ ضريبة مستحقّة. نقبل «كي نت» وفيزا وماستركارد وآبل باي، ويُحصَّل المبلغ عند قبول الطلب، كما نقبل الدفع نقداً للسائق عند التسليم، إلّا للهدية المرسلة إلى مستلمها مباشرةً.',
          },
        ],
      },
      {
        id: 'delivery',
        heading: { en: 'Delivery', ar: 'التوصيل' },
        body: [
          {
            en: 'We deliver within Kuwait only; delivery elsewhere in the GCC is arranged in writing before you order. Delivery is complimentary when the fragrances in an order come to {threshold} or more, and {shipping} below that. Orders placed before {cutoff}, Kuwait time, are delivered the same day, and later orders on the next delivery day; we do not deliver on {restDays}.',
            ar: 'نوصّل داخل الكويت فقط، ويُتّفق كتابةً قبل الطلب على التوصيل إلى دول الخليج الأخرى. والتوصيل مجاني متى بلغت قيمة العطور في الطلب {threshold} فأكثر، و{shipping} لما دون ذلك. وتُوصَّل الطلبات المنفّذة قبل {cutoff} بتوقيت الكويت في اليوم نفسه، وما بعد ذلك في يوم التوصيل التالي، ولا نوصّل يوم {restDays}.',
          },
          {
            en: 'Outlying areas, named at checkout, carry a {remoteFee} fee whatever the total and are delivered on next-day timing plus {remoteDelay}, never the same day. A delivery date is our promise at the moment you order, not a guarantee against events outside our control. Risk passes to you — or to the recipient of a gift — when the order is handed over.',
            ar: 'وتُضاف رسوم قدرها {remoteFee} للمناطق البعيدة المحدّدة في نموذج الطلب أيّاً كان المجموع، ويصلها الطلب في موعد اليوم التالي مع {remoteDelay}، ولا يصلها في اليوم نفسه. وموعد التوصيل وعدٌ منّا لحظة الطلب، لا ضمانٌ في وجه ظروف خارجة عن إرادتنا. وتنتقل التبعة إليك — أو إلى مستلم الهدية — عند تسليم الطلب.',
          },
        ],
      },
      {
        id: 'returns-and-cancellation',
        heading: { en: 'Returns and cancellation', ar: 'الإرجاع والإلغاء' },
        body: [
          {
            en: 'Anything still sealed may be returned within {returnPeriod} of delivery for a full refund, including the delivery fee when the whole order comes back. Under Try First, every {tryFirstFormats} comes with a free {vial} test vial of the same fragrance, so that you can wear it before opening the bottle; the vial is yours to keep, and Try First allows one return per fragrance per customer.',
            ar: 'يجوز إرجاع كلّ ما زال مختوماً خلال {returnPeriod} من التسليم مع استرداد كامل، شاملاً رسوم التوصيل إذا أُعيد الطلب كاملاً. وبموجب «جرّب أولاً» تصلك مع كلٍّ من {tryFirstFormats} عيّنة تجربة مجانية بحجم {vial} من العطر نفسه، لتجرّبه قبل فتح الزجاجة، وتبقى العيّنة لك، ويُسمح عبر «جرّب أولاً» بإرجاع واحد لكلّ عطر ولكلّ عميل.',
          },
          {
            en: 'Once a seal or its cellophane is broken we cannot accept an item back unless it is faulty. A gift may be returned by its recipient on the same terms; the refund goes to the purchaser. You may cancel an order until it leaves the boutique. Tell us before you send anything, so that we can arrange collection.',
            ar: 'ومتى كُسر الختم أو غلافه الشفاف تعذّر قبول الإرجاع ما لم يكن المنتج معيباً. ويجوز لمستلم الهدية إرجاعها بالشروط نفسها، ويُردّ المبلغ إلى المشتري. ويمكنك إلغاء الطلب ما دام لم يغادر البوتيك. وأخبرنا قبل إرسال أيّ شيء لنرتّب استلامه.',
          },
        ],
      },
      {
        id: 'gift-orders',
        heading: { en: 'Gift orders', ar: 'طلبات الهدايا' },
        body: [
          {
            en: 'The purchaser is our customer: the order, the payment and any refund are theirs. When a gift is delivered straight to its recipient, you confirm that you give us their details with their knowledge. The message card is printed exactly as you write it, and a gift box is refunded with the item it holds.',
            ar: 'المشتري هو عميلنا: فالطلب والدفع وأيّ مبلغ مستردّ تعود إليه. وحين تُوصَل الهدية إلى مستلمها مباشرةً، فإنك تؤكّد أنك تزوّدنا ببياناته بعلمه. وتُطبع بطاقة الرسالة كما كتبتها تماماً، وتُردّ قيمة علبة الهدية مع المنتج الذي تضمّه.',
          },
        ],
      },
      {
        id: 'what-we-sell',
        heading: { en: 'What we sell', ar: 'ما نبيعه' },
        body: [
          {
            en: 'Every fragrance is listed with its concentration, its formats and its pyramid. Longevity, projection, heat resistance and the layering suggestions are the house’s own guidance: fragrance reads differently on different skin and in different weather, a Kuwaiti summer included, so they describe a composition rather than promise an experience. The bottles shown on this site are illustrations; glass and label may differ slightly from what is delivered.',
            ar: 'يُدرج كلّ عطر مع تركيزه وأحجامه وهرمه العطري. أمّا الثبات والفوحان ومقاومة الحرارة واقتراحات الطبقات فهي إرشاد الدار الخاص: يُقرأ العطر قراءةً مختلفة على كلّ بشرة وفي كلّ طقس، وصيف الكويت منه، فهي تصف تركيبة ولا تَعِد بتجربة. والزجاجات المعروضة هنا رسوم توضيحية، وقد يختلف الزجاج والملصق اختلافاً طفيفاً عمّا يُسلَّم.',
          },
        ],
      },
      {
        id: 'faulty-or-wrong-goods',
        heading: { en: 'Faulty or wrong goods', ar: 'السلع المعيبة أو الخاطئة' },
        body: [
          {
            en: 'If something arrives damaged, or is not what you ordered, tell us within fourteen days. We will replace it or refund it, and we collect it at our cost.',
            ar: 'إذا وصل المنتج تالفاً أو مخالفاً لما طلبته، أخبرنا خلال أربعة عشر يوماً. وسنستبدله أو نردّ قيمته، ونستلمه على نفقتنا.',
          },
        ],
      },
      {
        id: 'our-content',
        heading: { en: 'Our content', ar: 'المحتوى' },
        body: [
          {
            en: 'The name Nafsah, the compositions, the imagery, the text and the design of this site are ours. Please do not reproduce them commercially without our written agreement.',
            ar: 'اسم نَفْسَة والتركيبات والصور والنصوص وتصميم هذا الموقع ملك لنا. ويُرجى عدم استنساخها تجارياً دون موافقتنا الخطية.',
          },
        ],
      },
      {
        id: 'liability',
        heading: { en: 'Liability', ar: 'المسؤولية' },
        body: [
          {
            en: 'We are responsible for delivering what you ordered, in the condition described. We are not responsible for a reaction to a fragrance you have not tested, so wear a {vial} sample vial, or the Try First test vial, before you open a bottle. Nothing here limits any right you hold under Kuwaiti consumer law.',
            ar: 'نحن مسؤولون عن تسليم ما طلبته بالحالة الموصوفة. ولسنا مسؤولين عن ردّ فعل تجاه عطر لم تجرّبه، فجرّب عيّنة {vial} أو عيّنة «جرّب أولاً» قبل أن تفتح الزجاجة. ولا يحدّ أيّ ممّا ورد هنا من أيّ حقّ يكفله لك قانون حماية المستهلك الكويتي.',
          },
        ],
      },
      {
        id: 'governing-law',
        heading: { en: 'Governing law', ar: 'القانون الواجب التطبيق' },
        body: [
          {
            en: 'These terms are governed by the laws of the State of Kuwait, and the courts of Kuwait have jurisdiction over any dispute arising from them.',
            ar: 'تخضع هذه الشروط لقوانين دولة الكويت، وتختصّ محاكم الكويت بأيّ نزاع ينشأ عنها.',
          },
        ],
      },
      {
        id: 'changes-to-these-terms',
        heading: { en: 'Changes to these terms', ar: 'تعديلات هذه الشروط' },
        body: [
          {
            en: 'We may revise these terms. The version that applies to your order is the one published at the moment you placed it.',
            ar: 'قد نراجع هذه الشروط. والنسخة السارية على طلبك هي المنشورة لحظة تنفيذه.',
          },
        ],
      },
    ],
  },
}
