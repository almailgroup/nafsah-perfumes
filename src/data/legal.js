/**
 * The legal pages, kept out of the interface dictionary: strings.js is for
 * chrome, and this is prose that happens to be bilingual.
 *
 * The delivery clause interpolates {threshold} and {shipping} from the cart's
 * own constants rather than restating them, so the terms cannot quietly drift
 * out of step with what the checkout actually charges.
 */
export const LEGAL_NOTE = {
  "en": "Nafsah is a demonstration storefront. This text is a working template, not legal advice — have it reviewed before you trade on it.",
  "ar": "نَفْسَة متجر تجريبي. هذا النصّ نموذج عملي وليس استشارة قانونية — راجعه قبل الاعتماد عليه في البيع الفعلي."
}

export const LEGAL = {
  "privacy": {
    "updated": "2026-09-30",
    "title": {
      "en": "Privacy Policy",
      "ar": "سياسة الخصوصية"
    },
    "lede": {
      "en": "What Nafsah collects when you browse or buy, why we collect it, and what you can ask us to do about it. This covers nafsah.com and the order handling behind it.",
      "ar": "ما الذي تجمعه نَفْسَة عند التصفّح أو الشراء، ولماذا نجمعه، وما يمكنك أن تطلب منّا بشأنه. تشمل هذه السياسة موقع nafsah.com ومعالجة الطلبات خلفه."
    },
    "sections": [
      {
        "heading": {
          "en": "What we collect",
          "ar": "ما الذي نجمعه"
        },
        "body": [
          {
            "en": "Only what an order or a question actually needs.",
            "ar": "ما يحتاجه الطلب أو السؤال فعلاً، لا أكثر."
          }
        ],
        "list": [
          {
            "en": "Your name, email address and telephone number, when you place an order or write to us.",
            "ar": "اسمك وبريدك الإلكتروني ورقم هاتفك، عند تنفيذ طلب أو مراسلتنا."
          },
          {
            "en": "The delivery address for an order, and what the order contains.",
            "ar": "عنوان التوصيل ومحتويات الطلب."
          },
          {
            "en": "The correspondence you send us, so that a reply has context.",
            "ar": "المراسلات التي ترسلها إلينا، ليكون الردّ في سياقه."
          },
          {
            "en": "Basic technical information your browser sends — the page requested, an approximate region, the type of device.",
            "ar": "معلومات تقنية أساسية يرسلها متصفّحك — الصفحة المطلوبة، المنطقة التقريبية، نوع الجهاز."
          }
        ]
      },
      {
        "heading": {
          "en": "What stays on your device",
          "ar": "ما يبقى على جهازك"
        },
        "body": [
          {
            "en": "Your basket and your language choice are kept in your browser, not on our servers. They survive a refresh so you do not lose a basket, and clearing your browsing data removes them. This site sets no advertising or tracking cookies.",
            "ar": "تُحفظ سلّتك واختيارك للغة في متصفّحك، لا على خوادمنا. تبقى بعد تحديث الصفحة كي لا تفقد سلّتك، ويؤدّي مسح بيانات التصفّح إلى إزالتها. ولا يضع هذا الموقع أيّ ملفّات تتبّع أو إعلانات."
          }
        ]
      },
      {
        "heading": {
          "en": "Why we collect it",
          "ar": "لماذا نجمعه"
        },
        "list": [
          {
            "en": "To take, fulfil and deliver an order.",
            "ar": "لاستلام الطلب وتنفيذه وتوصيله."
          },
          {
            "en": "To answer a question and to advise on a fragrance.",
            "ar": "للردّ على سؤال وتقديم المشورة العطرية."
          },
          {
            "en": "To handle a return or a fault.",
            "ar": "لمعالجة إرجاع أو عيب."
          },
          {
            "en": "To keep the records a retailer is required to keep.",
            "ar": "للاحتفاظ بالسجلات المطلوبة من أيّ تاجر تجزئة."
          }
        ]
      },
      {
        "heading": {
          "en": "Payment",
          "ar": "الدفع"
        },
        "body": [
          {
            "en": "Card and KNET details are entered with our payment processor and are never seen or stored by Nafsah. We receive a confirmation that the payment succeeded and the last four digits, which is what reconciliation needs and no more.",
            "ar": "تُدخَل بيانات البطاقة و«كي نت» لدى مزوّد خدمة الدفع، ولا تطّلع عليها نَفْسَة ولا تحتفظ بها. يصلنا تأكيد نجاح الدفع وآخر أربعة أرقام فقط، وهو ما تحتاجه المطابقة المحاسبية لا أكثر."
          }
        ]
      },
      {
        "heading": {
          "en": "Who else sees it",
          "ar": "من يطّلع عليها غيرنا"
        },
        "body": [
          {
            "en": "Two parties, each for one purpose:",
            "ar": "جهتان، لكلٍّ منهما غرض واحد:"
          }
        ],
        "list": [
          {
            "en": "The courier carrying your order — your name, address and telephone number.",
            "ar": "شركة الشحن التي تحمل طلبك — اسمك وعنوانك ورقم هاتفك."
          },
          {
            "en": "The payment processor — what it needs to take the payment.",
            "ar": "مزوّد خدمة الدفع — ما يلزمه لتحصيل المبلغ."
          }
        ],
        "after": [
          {
            "en": "We do not sell your details and we do not share them for advertising.",
            "ar": "لا نبيع بياناتك ولا نشاركها لأغراض إعلانية."
          }
        ]
      },
      {
        "heading": {
          "en": "How long we keep it",
          "ar": "مدّة الاحتفاظ"
        },
        "list": [
          {
            "en": "Order records, for as long as tax and consumer-protection rules require.",
            "ar": "سجلات الطلبات، طوال المدّة التي تفرضها قواعد الضريبة وحماية المستهلك."
          },
          {
            "en": "Correspondence, for two years.",
            "ar": "المراسلات، لمدّة سنتين."
          },
          {
            "en": "A newsletter subscription, until you unsubscribe.",
            "ar": "الاشتراك في النشرة، حتى تلغيه."
          }
        ]
      },
      {
        "heading": {
          "en": "What you can ask for",
          "ar": "ما يمكنك طلبه"
        },
        "list": [
          {
            "en": "A copy of what we hold about you.",
            "ar": "نسخة ممّا نحتفظ به عنك."
          },
          {
            "en": "A correction, where something is wrong.",
            "ar": "تصحيح أيّ معلومة خاطئة."
          },
          {
            "en": "Deletion, where no legal duty requires us to keep it.",
            "ar": "الحذف، حيث لا يُلزمنا واجب قانوني بالاحتفاظ."
          },
          {
            "en": "To stop receiving the newsletter, at any time.",
            "ar": "إيقاف النشرة في أيّ وقت."
          }
        ],
        "after": [
          {
            "en": "Write to us and we will answer within one working day.",
            "ar": "راسلنا وسنردّ خلال يوم عمل واحد."
          }
        ]
      },
      {
        "heading": {
          "en": "Changes to this policy",
          "ar": "تعديلات هذه السياسة"
        },
        "body": [
          {
            "en": "If this policy changes in a way that matters, we will say so here and move the date at the top of the page.",
            "ar": "إذا تغيّرت هذه السياسة تغيّراً جوهرياً، سنوضّح ذلك هنا ونحدّث التاريخ أعلى الصفحة."
          }
        ]
      }
    ]
  },
  "terms": {
    "updated": "2026-09-30",
    "title": {
      "en": "Terms of Sale",
      "ar": "شروط البيع"
    },
    "lede": {
      "en": "The terms on which Nafsah sells through nafsah.com. Placing an order means you accept them.",
      "ar": "الشروط التي تبيع نَفْسَة بموجبها عبر nafsah.com. وتنفيذ الطلب يعني قبولك بها."
    },
    "sections": [
      {
        "heading": {
          "en": "Who you are dealing with",
          "ar": "مع من تتعامل"
        },
        "body": [
          {
            "en": "Nafsah is a maison de parfum founded in 1974, composing in Grasse and shipping from Kuwait. Our address, telephone number and email are on the contact page.",
            "ar": "نَفْسَة دار عطور تأسّست عام ١٩٧٤، تُركّب في غراس وتشحن من الكويت. عنواننا ورقم هاتفنا وبريدنا على صفحة الاتصال."
          }
        ]
      },
      {
        "heading": {
          "en": "Orders",
          "ar": "الطلبات"
        },
        "body": [
          {
            "en": "An order is an offer to buy. It is accepted when we send the confirmation email, and the contract forms at that moment. We may decline an order — if a fragrance has sold out, if we cannot reach the delivery address, or if payment cannot be authorised.",
            "ar": "الطلب عرض بالشراء. ويُقبَل عند إرسالنا بريد التأكيد، وعند تلك اللحظة ينعقد العقد. ويجوز لنا رفض الطلب — إذا نفد العطر، أو تعذّر الوصول إلى عنوان التوصيل، أو تعذّر اعتماد الدفع."
          }
        ]
      },
      {
        "heading": {
          "en": "Prices and payment",
          "ar": "الأسعار والدفع"
        },
        "body": [
          {
            "en": "Prices are in Kuwaiti dinar and shown to three decimal places, because the dinar divides into a thousand fils. They include any tax that applies. We accept KNET, Visa, Mastercard, American Express and Apple Pay, and payment is taken when the order is accepted.",
            "ar": "الأسعار بالدينار الكويتي وتُعرض بثلاث خانات عشرية، لأنّ الدينار ينقسم إلى ألف فلس. وهي شاملة لأيّ ضريبة مستحقّة. نقبل «كي نت» وفيزا وماستركارد وأمريكان إكسبريس وآبل باي، ويُحصَّل المبلغ عند قبول الطلب."
          }
        ]
      },
      {
        "heading": {
          "en": "Delivery",
          "ar": "التوصيل"
        },
        "body": [
          {
            "en": "Delivery within Kuwait is complimentary on orders over {threshold}, and {shipping} below that. Orders placed before 14:00, Sunday to Thursday, are dispatched the same working day. International delivery is quoted at checkout. Risk passes to you when the order is delivered.",
            "ar": "التوصيل داخل الكويت مجاني للطلبات التي تتجاوز {threshold}، و{shipping} لما دونها. تُشحن الطلبات المنفّذة قبل الساعة ١٤:٠٠ من الأحد إلى الخميس في يوم العمل نفسه. ويُحتسب الشحن الدولي عند إتمام الطلب. وتنتقل التبعة إليك عند التسليم."
          }
        ]
      },
      {
        "heading": {
          "en": "Returns and cancellation",
          "ar": "الإرجاع والإلغاء"
        },
        "body": [
          {
            "en": "You may return an unopened flacon within thirty days of delivery for a full refund, including the outbound delivery charge when the whole order goes back. Fragrance is a sealed product: once a flacon is opened we cannot accept it back unless it is faulty. Tell us before you send anything so we can arrange collection.",
            "ar": "يمكنك إرجاع قارورة غير مفتوحة خلال ثلاثين يوماً من التسليم واسترداد المبلغ كاملاً، شاملاً رسوم التوصيل إذا أُعيد الطلب بأكمله. العطر منتج مختوم: فمتى فُتحت القارورة تعذّر قبول إرجاعها ما لم تكن معيبة. أخبرنا قبل إرسال أيّ شيء لنرتّب استلامه."
          }
        ]
      },
      {
        "heading": {
          "en": "What we sell",
          "ar": "ما نبيعه"
        },
        "body": [
          {
            "en": "Every composition is listed with its concentration and its pyramid. Fragrance is read differently by different skin, so a note list describes a composition rather than promising an experience. The vials shown on this site are illustrations; glass and label may differ slightly from the flacon delivered.",
            "ar": "تُدرج كلّ تركيبة مع تركيزها وهرمها العطري. ويُقرأ العطر على كلّ بشرة قراءةً مختلفة، فقائمة النوتات تصف تركيبة ولا تَعِد بتجربة. والقوارير المعروضة هنا رسوم توضيحية، وقد يختلف الزجاج والملصق اختلافاً طفيفاً عن القارورة المسلّمة."
          }
        ]
      },
      {
        "heading": {
          "en": "Faulty or wrong goods",
          "ar": "السلع المعيبة أو الخاطئة"
        },
        "body": [
          {
            "en": "If something arrives damaged, or is not what you ordered, tell us within fourteen days. We will replace it or refund it, and we pay the delivery both ways.",
            "ar": "إذا وصل المنتج تالفاً أو مخالفاً لما طلبته، أخبرنا خلال أربعة عشر يوماً. وسنستبدله أو نردّ قيمته، ونتحمّل نحن تكلفة التوصيل ذهاباً وإياباً."
          }
        ]
      },
      {
        "heading": {
          "en": "Our content",
          "ar": "المحتوى"
        },
        "body": [
          {
            "en": "The name Nafsah, the compositions, the imagery, the text and the design of this site are ours. Please do not reproduce them commercially without our written agreement.",
            "ar": "اسم نَفْسَة والتركيبات والصور والنصوص وتصميم هذا الموقع ملك لنا. ويُرجى عدم استنساخها تجارياً دون موافقتنا الخطية."
          }
        ]
      },
      {
        "heading": {
          "en": "Liability",
          "ar": "المسؤولية"
        },
        "body": [
          {
            "en": "We are responsible for delivering what you ordered, in the condition described. We are not responsible for a reaction to a fragrance you have not tested, so take a sample if you are uncertain. Nothing here limits any right you hold under Kuwaiti consumer law.",
            "ar": "نحن مسؤولون عن تسليم ما طلبته بالحالة الموصوفة. ولسنا مسؤولين عن ردّ فعل تجاه عطر لم تجرّبه، فخذ عيّنة إن كنت متردّداً. ولا يحدّ أيّ ممّا ورد هنا من أيّ حقّ يكفله لك قانون حماية المستهلك الكويتي."
          }
        ]
      },
      {
        "heading": {
          "en": "Governing law",
          "ar": "القانون الواجب التطبيق"
        },
        "body": [
          {
            "en": "These terms are governed by the laws of the State of Kuwait, and the courts of Kuwait have jurisdiction over any dispute arising from them.",
            "ar": "تخضع هذه الشروط لقوانين دولة الكويت، وتختصّ محاكم الكويت بأيّ نزاع ينشأ عنها."
          }
        ]
      },
      {
        "heading": {
          "en": "Changes to these terms",
          "ar": "تعديلات هذه الشروط"
        },
        "body": [
          {
            "en": "We may revise these terms. The version that applies to your order is the one published at the moment you placed it.",
            "ar": "قد نراجع هذه الشروط. والنسخة السارية على طلبك هي المنشورة لحظة تنفيذه."
          }
        ]
      }
    ]
  }
}
