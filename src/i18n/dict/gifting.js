// Gift boxes, message card and recipient delivery, and the cart drawer that
// carries them (owner P6). Keys: 'gifting.*'
//
// {box} is a GIFT_BOXES name, {price} {fee} {amount} {threshold} formatted
// prices, {item} a line's '{name}, {format}', {max} the card's length limit.
export default {
  en: {
    // The gift switch
    'gifting.switch': 'Send as a gift',
    'gifting.switchHint': 'A gift box, a message card and a packing slip without prices.',

    // The box
    'gifting.box.legend': 'The box',

    // The message card
    'gifting.message.label': 'Message card',
    'gifting.message.placeholder': 'A few words for them…',
    'gifting.message.help.one': 'Written on the card inside the box. Up to {count} character.',
    'gifting.message.help.other': 'Written on the card inside the box. Up to {count} characters.',
    'gifting.message.left.one': '{count} character left',
    'gifting.message.left.other': '{count} characters left',
    'gifting.from.label': 'From',
    'gifting.from.placeholder': 'Your name, as on the card',
    'gifting.optional': 'Optional',

    // The packing slip and the recipient
    'gifting.hidePrices': 'Hide prices on the packing slip',
    'gifting.hidePricesHint': 'The slip lists what is inside, never what it cost.',
    'gifting.toRecipient': 'Deliver directly to the recipient',
    'gifting.toRecipientHint': 'We ask for their name and mobile at checkout.',
    'gifting.toRecipientHintCheckout': 'Their name and mobile go in the Delivery step.',

    // The card preview
    'gifting.preview.label': 'The card, as it will read',
    'gifting.preview.empty': 'Your message will appear here.',
    'gifting.preview.from': 'From {name}',

    // The cart drawer
    'gifting.cart.items.one': '{count} piece',
    'gifting.cart.items.other': '{count} pieces',
    'gifting.cart.item': '{name}, {format}',
    'gifting.cart.remove': 'Remove {item}',
    'gifting.cart.removed': '{item} removed from your cart',
    'gifting.cart.quantity': 'Quantity of {item}',
    'gifting.cart.decrease': 'One fewer {item}',
    'gifting.cart.increase': 'One more {item}',
    'gifting.cart.each': '{price} each',
    'gifting.cart.vial': 'Includes a free {volume} test vial',
    'gifting.cart.howTryFirst': 'How Try First works',
    'gifting.cart.progress': 'Progress to complimentary delivery',
    'gifting.cart.progressValue': '{amount} of {threshold}',
    'gifting.cart.giftOptions': 'Gift options',
    'gifting.cart.giftOff': 'A gift box, a message card, delivery to the recipient',
    'gifting.cart.giftOnCard': '{box} · with a message card',
    'gifting.cart.giftOnNoCard': '{box} · no message card yet',
    'gifting.cart.giftBox': 'Gift box',
    'gifting.cart.delivery': 'Delivery',
    'gifting.cart.remoteLater': 'Outlying areas add {fee}, calculated at checkout',
  },
  ar: {
    'gifting.switch': 'أرسل الطلب هدية',
    'gifting.switchHint': 'علبة هدية، وبطاقة إهداء، وقسيمة شحن دون أسعار.',

    'gifting.box.legend': 'العلبة',

    'gifting.message.label': 'بطاقة الإهداء',
    'gifting.message.placeholder': 'كلمات قليلة لمن تُهديه…',
    'gifting.message.help.zero': 'تُكتب على البطاقة داخل العلبة.',
    'gifting.message.help.one': 'تُكتب على البطاقة داخل العلبة، بحرف واحد كحدّ أقصى.',
    'gifting.message.help.two': 'تُكتب على البطاقة داخل العلبة، بحرفين كحدّ أقصى.',
    'gifting.message.help.few': 'تُكتب على البطاقة داخل العلبة، بما لا يزيد على {count} أحرف.',
    'gifting.message.help.many': 'تُكتب على البطاقة داخل العلبة، بما لا يزيد على {count} حرفاً.',
    'gifting.message.help.other': 'تُكتب على البطاقة داخل العلبة، بما لا يزيد على {count} حرف.',
    'gifting.message.left.zero': 'لم يبقَ أي حرف',
    'gifting.message.left.one': 'بقي حرف واحد',
    'gifting.message.left.two': 'بقي حرفان',
    'gifting.message.left.few': 'بقيت {count} أحرف',
    'gifting.message.left.many': 'بقي {count} حرفاً',
    'gifting.message.left.other': 'بقي {count} حرف',
    'gifting.from.label': 'من',
    'gifting.from.placeholder': 'اسمك كما يُكتب على البطاقة',
    'gifting.optional': 'اختياري',

    'gifting.hidePrices': 'إخفاء الأسعار من قسيمة الشحن',
    'gifting.hidePricesHint': 'تذكر القسيمة محتويات العلبة دون أسعارها.',
    'gifting.toRecipient': 'التوصيل مباشرة إلى المستلم',
    'gifting.toRecipientHint': 'نطلب اسم المستلم ورقم هاتفه عند إتمام الطلب.',
    'gifting.toRecipientHintCheckout': 'أدخِل اسم المستلم ورقم هاتفه في خطوة التوصيل.',

    'gifting.preview.label': 'البطاقة كما ستصل',
    'gifting.preview.empty': 'ستظهر رسالتك هنا.',
    'gifting.preview.from': 'من {name}',

    'gifting.cart.items.zero': 'لا قطع',
    'gifting.cart.items.one': 'قطعة واحدة',
    'gifting.cart.items.two': 'قطعتان',
    'gifting.cart.items.few': '{count} قطع',
    'gifting.cart.items.many': '{count} قطعة',
    'gifting.cart.items.other': '{count} قطعة',
    'gifting.cart.item': '{name}، {format}',
    'gifting.cart.remove': 'إزالة {item}',
    'gifting.cart.removed': 'أُزيل {item} من سلّتك',
    'gifting.cart.quantity': 'كمية {item}',
    'gifting.cart.decrease': 'إنقاص كمية {item}',
    'gifting.cart.increase': 'زيادة كمية {item}',
    'gifting.cart.each': '{price} للقطعة',
    'gifting.cart.vial': 'مع عيّنة تجربة مجانية بحجم {volume}',
    'gifting.cart.howTryFirst': 'كيف تعمل خدمة «جرّب أولاً»',
    'gifting.cart.progress': 'التقدّم نحو التوصيل المجاني',
    'gifting.cart.progressValue': '{amount} من {threshold}',
    'gifting.cart.giftOptions': 'خيارات الهدية',
    'gifting.cart.giftOff': 'علبة هدية، وبطاقة إهداء، وتوصيل إلى المستلم',
    'gifting.cart.giftOnCard': '{box} · مع بطاقة إهداء',
    'gifting.cart.giftOnNoCard': '{box} · دون بطاقة إهداء بعد',
    'gifting.cart.giftBox': 'علبة الهدية',
    'gifting.cart.delivery': 'التوصيل',
    'gifting.cart.remoteLater': 'رسوم المناطق البعيدة {fee}، تُحتسب عند إتمام الطلب',
  },
}
