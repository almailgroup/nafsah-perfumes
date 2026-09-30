/**
 * Shipping and FAQ content. Like the legal pages, this is prose rather than
 * interface chrome, so it lives beside the catalogue data instead of in the
 * dictionary.
 *
 * {threshold} and {shipping} are filled from the cart's own constants at
 * render time, so neither page can promise a delivery charge the checkout
 * does not apply.
 */
export const SHIPPING_DOC = {
  "updated": "2026-09-30",
  "title": {
    "en": "Shipping & Returns",
    "ar": "الشحن والإرجاع"
  },
  "lede": {
    "en": "Where we deliver, what it costs, when it arrives, and how to send something back.",
    "ar": "إلى أين نوصّل، وبكم، ومتى يصل، وكيف تعيد شيئاً إلينا."
  },
  "sections": [
    {
      "heading": {
        "en": "Where we deliver",
        "ar": "إلى أين نوصّل"
      },
      "body": [
        {
          "en": "Every governorate in Kuwait, the GCC, and most of the world. Orders leave the Kuwait boutique; the compositions are made in Grasse and shipped here in batches.",
          "ar": "إلى كلّ محافظات الكويت، ودول الخليج، ومعظم دول العالم. تغادر الطلبات بوتيك الكويت، وتُركَّب العطور في غراس وتُشحن إلينا على دفعات."
        }
      ]
    },
    {
      "heading": {
        "en": "What delivery costs",
        "ar": "تكلفة التوصيل"
      },
      "table": {
        "head": [
          {
            "en": "Destination",
            "ar": "الوجهة"
          },
          {
            "en": "Time",
            "ar": "المدّة"
          },
          {
            "en": "Cost",
            "ar": "التكلفة"
          }
        ],
        "rows": [
          [
            {
              "en": "Kuwait",
              "ar": "الكويت"
            },
            {
              "en": "Next working day",
              "ar": "يوم العمل التالي"
            },
            {
              "en": "Complimentary over {threshold}, otherwise {shipping}",
              "ar": "مجاني فوق {threshold}، وإلّا {shipping}"
            }
          ],
          [
            {
              "en": "GCC",
              "ar": "دول الخليج"
            },
            {
              "en": "Two to four working days",
              "ar": "من يومين إلى أربعة أيام عمل"
            },
            {
              "en": "Quoted at checkout",
              "ar": "يُحتسب عند إتمام الطلب"
            }
          ],
          [
            {
              "en": "Rest of world",
              "ar": "بقيّة العالم"
            },
            {
              "en": "Five to eight working days",
              "ar": "من خمسة إلى ثمانية أيام عمل"
            },
            {
              "en": "Quoted at checkout",
              "ar": "يُحتسب عند إتمام الطلب"
            }
          ]
        ]
      },
      "after": [
        {
          "en": "Duties and import taxes outside Kuwait are the recipient’s, and are not collected by us.",
          "ar": "الرسوم الجمركية وضرائب الاستيراد خارج الكويت على المستلم، ولا نحصّلها نحن."
        }
      ]
    },
    {
      "heading": {
        "en": "When your order leaves",
        "ar": "متى يغادر طلبك"
      },
      "body": [
        {
          "en": "Orders placed before 14:00, Sunday to Thursday, are dispatched the same working day. Anything placed after that, or on Friday and Saturday, goes out on Sunday. Each order is packed by hand, and a flacon is checked for its seal before it is boxed.",
          "ar": "تُشحن الطلبات المنفّذة قبل الساعة ١٤:٠٠ من الأحد إلى الخميس في يوم العمل نفسه. وما يُنفَّذ بعد ذلك، أو يومي الجمعة والسبت، يغادر يوم الأحد. ويُعبَّأ كلّ طلب يدوياً، ويُفحص ختم القارورة قبل وضعها في العلبة."
        }
      ]
    },
    {
      "heading": {
        "en": "Tracking",
        "ar": "تتبّع الشحنة"
      },
      "body": [
        {
          "en": "A tracking number reaches you by email the moment the order is handed to the courier. If it has not arrived within a working day of your confirmation, write to us and we will chase it.",
          "ar": "يصلك رقم التتبّع بالبريد الإلكتروني لحظة تسليم الطلب لشركة الشحن. وإن لم يصلك خلال يوم عمل من تأكيد الطلب، فراسلنا ونتابعه."
        }
      ]
    },
    {
      "heading": {
        "en": "What you can return",
        "ar": "ما يمكن إرجاعه"
      },
      "body": [
        {
          "en": "An unopened flacon, within thirty days of delivery, for a full refund. Fragrance is a sealed product: once the seal is broken we cannot resell it, so an opened flacon can only come back if it is faulty. The two samples that ship with every order exist so that you can try before you break a seal.",
          "ar": "قارورة غير مفتوحة، خلال ثلاثين يوماً من التسليم، مع استرداد كامل. العطر منتج مختوم: فمتى كُسر الختم تعذّر بيعه، ولا تُقبل القارورة المفتوحة إلّا إذا كانت معيبة. والعيّنتان المرفقتان بكلّ طلب موجودتان كي تجرّب قبل أن تكسر ختماً."
        }
      ]
    },
    {
      "heading": {
        "en": "How to start a return",
        "ar": "كيف تبدأ الإرجاع"
      },
      "body": [
        {
          "en": "Write to us before you send anything back. We arrange the collection ourselves so a flacon is not couriered loose, and we pay for it when the whole order is going back or when something is faulty.",
          "ar": "راسلنا قبل إرسال أيّ شيء. نرتّب نحن عملية الاستلام كي لا تُشحن القارورة دون تغليف مناسب، ونتحمّل تكلفتها إذا أُعيد الطلب بأكمله أو كان المنتج معيباً."
        }
      ]
    },
    {
      "heading": {
        "en": "When you get your money",
        "ar": "متى يصلك المبلغ"
      },
      "body": [
        {
          "en": "Refunds go back to the method you paid with, within five working days of the flacon reaching us. KNET and card refunds can take a further few days to appear, depending on your bank.",
          "ar": "يُردّ المبلغ إلى الوسيلة التي دفعت بها، خلال خمسة أيام عمل من وصول القارورة إلينا. وقد يستغرق ظهور المبالغ المستردّة عبر «كي نت» والبطاقات أياماً إضافية بحسب بنكك."
        }
      ]
    },
    {
      "heading": {
        "en": "Damaged or wrong",
        "ar": "التالف أو الخاطئ"
      },
      "body": [
        {
          "en": "If a flacon arrives broken, or it is not what you ordered, tell us within fourteen days. We replace it or refund it and we pay the delivery both ways. A photograph helps but is not required.",
          "ar": "إذا وصلت القارورة مكسورة أو كانت غير ما طلبته، أخبرنا خلال أربعة عشر يوماً. نستبدلها أو نردّ قيمتها ونتحمّل التوصيل ذهاباً وإياباً. وصورة فوتوغرافية تساعد لكنّها ليست شرطاً."
        }
      ]
    }
  ]
}

export const FAQ = {
  "groups": [
    {
      "group": {
        "en": "Ordering and payment",
        "ar": "الطلب والدفع"
      },
      "items": [
        {
          "q": {
            "en": "Do I need an account to order?",
            "ar": "هل أحتاج حساباً للطلب؟"
          },
          "a": {
            "en": "No. Checkout works as a guest. An account only saves your addresses so you do not retype them.",
            "ar": "لا. يمكنك إتمام الطلب كزائر. والحساب يحفظ عناوينك فقط كي لا تعيد كتابتها."
          }
        },
        {
          "q": {
            "en": "Which payment methods do you accept?",
            "ar": "ما وسائل الدفع المقبولة؟"
          },
          "a": {
            "en": "KNET, Visa, Mastercard, American Express and Apple Pay. Prices are in Kuwaiti dinar, shown to three decimal places because the dinar divides into a thousand fils.",
            "ar": "«كي نت» وفيزا وماستركارد وأمريكان إكسبريس وآبل باي. والأسعار بالدينار الكويتي، معروضة بثلاث خانات عشرية لأنّ الدينار ينقسم إلى ألف فلس."
          }
        },
        {
          "q": {
            "en": "Can I change or cancel an order after placing it?",
            "ar": "هل يمكن تعديل الطلب أو إلغاؤه بعد تنفيذه؟"
          },
          "a": {
            "en": "Until it is dispatched, yes. Write to us as soon as you can — most orders leave the same working day.",
            "ar": "نعم، ما دام لم يُشحن. راسلنا بأسرع ما يمكن، فمعظم الطلبات تغادر في يوم العمل نفسه."
          }
        },
        {
          "q": {
            "en": "Do you gift wrap?",
            "ar": "هل تقدّمون تغليف الهدايا؟"
          },
          "a": {
            "en": "Every order ships in the house box. Add a handwritten card at checkout and tell us what to write.",
            "ar": "يُشحن كلّ طلب في علبة الدار. أضف بطاقة مكتوبة بخطّ اليد عند إتمام الطلب وأخبرنا بما نكتبه."
          }
        }
      ]
    },
    {
      "group": {
        "en": "Delivery",
        "ar": "التوصيل"
      },
      "items": [
        {
          "q": {
            "en": "How long does delivery take in Kuwait?",
            "ar": "كم يستغرق التوصيل داخل الكويت؟"
          },
          "a": {
            "en": "Next working day for orders placed before 14:00, Sunday to Thursday. Delivery is complimentary over {threshold} and {shipping} below it.",
            "ar": "يوم العمل التالي للطلبات المنفّذة قبل الساعة ١٤:٠٠ من الأحد إلى الخميس. والتوصيل مجاني فوق {threshold} و{shipping} لما دونه."
          }
        },
        {
          "q": {
            "en": "Do you ship outside Kuwait?",
            "ar": "هل تشحنون خارج الكويت؟"
          },
          "a": {
            "en": "Yes — the GCC in two to four working days, the rest of the world in five to eight. The cost is quoted at checkout once we have the address.",
            "ar": "نعم — دول الخليج خلال يومين إلى أربعة أيام عمل، وبقيّة العالم خلال خمسة إلى ثمانية. وتُحتسب التكلفة عند إتمام الطلب بعد معرفة العنوان."
          }
        },
        {
          "q": {
            "en": "How do I track my order?",
            "ar": "كيف أتتبّع طلبي؟"
          },
          "a": {
            "en": "A tracking number is emailed the moment the order is handed to the courier.",
            "ar": "يُرسَل رقم التتبّع بالبريد لحظة تسليم الطلب لشركة الشحن."
          }
        }
      ]
    },
    {
      "group": {
        "en": "Returns",
        "ar": "الإرجاع"
      },
      "items": [
        {
          "q": {
            "en": "Can I return a fragrance I have opened?",
            "ar": "هل أستطيع إرجاع عطر فتحته؟"
          },
          "a": {
            "en": "Only if it is faulty. Fragrance is sold sealed, and a broken seal cannot be resold. Try the samples first — two ship with every order.",
            "ar": "فقط إذا كان معيباً. يُباع العطر مختوماً، ولا يمكن إعادة بيع قارورة كُسر ختمها. جرّب العيّنتين أولاً، فهما ترافقان كلّ طلب."
          }
        },
        {
          "q": {
            "en": "How long do I have to return something?",
            "ar": "كم لديّ من وقت للإرجاع؟"
          },
          "a": {
            "en": "Thirty days from delivery, for an unopened flacon, refunded in full.",
            "ar": "ثلاثون يوماً من التسليم، للقارورة غير المفتوحة، مع استرداد كامل."
          }
        },
        {
          "q": {
            "en": "Who pays to send it back?",
            "ar": "من يتحمّل تكلفة الإرجاع؟"
          },
          "a": {
            "en": "We do, when the whole order is going back or when something is faulty. Tell us before you send anything — we arrange the collection.",
            "ar": "نحن، إذا أُعيد الطلب بأكمله أو كان المنتج معيباً. أخبرنا قبل الإرسال، فنحن نرتّب الاستلام."
          }
        }
      ]
    },
    {
      "group": {
        "en": "Fragrance and care",
        "ar": "العطر والعناية به"
      },
      "items": [
        {
          "q": {
            "en": "What does extrait de parfum mean?",
            "ar": "ما معنى «عطر مركّز»؟"
          },
          "a": {
            "en": "Twenty-two to thirty per cent perfume oil, against the twelve that passes for eau de parfum elsewhere. Less alcohol, longer wear, quieter projection — it sits closer to the skin rather than filling a room.",
            "ar": "من ٢٢٪ إلى ٣٠٪ من الزيت العطري، مقابل ١٢٪ لما يُسمّى ماء عطر في أماكن أخرى. كحول أقلّ، وثبات أطول، وانتشار أهدأ — يلتصق بالبشرة أكثر ممّا يملأ الغرفة."
          }
        },
        {
          "q": {
            "en": "How should I store a flacon?",
            "ar": "كيف أحفظ القارورة؟"
          },
          "a": {
            "en": "Away from light and warmth, upright, in the box it came in. That is what the box is for. A bathroom shelf is the one place a fragrance should not live.",
            "ar": "بعيداً عن الضوء والحرارة، منتصبةً، في علبتها الأصلية. ولهذا وُجدت العلبة. ورفّ الحمّام هو المكان الوحيد الذي لا ينبغي أن يُحفظ فيه العطر."
          }
        },
        {
          "q": {
            "en": "How long does a bottle keep?",
            "ar": "كم تدوم القارورة؟"
          },
          "a": {
            "en": "About five years unopened, and two to three once it is open. Orientals and woods often improve for longer than that; citruses are the first to tire.",
            "ar": "نحو خمس سنوات وهي مغلقة، وسنتين إلى ثلاث بعد فتحها. والعطور الشرقية والخشبية تتحسّن غالباً لمدّة أطول، أمّا الحمضية فأوّل ما يخبو."
          }
        },
        {
          "q": {
            "en": "Can I try before I buy?",
            "ar": "هل يمكنني التجربة قبل الشراء؟"
          },
          "a": {
            "en": "Two 2ml samples ship with every order, chosen to sit alongside what you bought. For a recommendation before you order, write to the atelier and a perfumer will answer.",
            "ar": "ترافق كلّ طلب عيّنتان بسعة ٢ مل، تُختاران لتناسب ما اشتريته. وللحصول على توصية قبل الطلب، راسل المعمل وسيردّ عليك عطّار."
          }
        }
      ]
    }
  ]
}
