/**
 * Gift presentation. Every gift leaves the atelier in one of three boxes;
 * the signature box costs nothing. Prices are integer fils.
 */

import { byId } from './taxonomy'

export const GIFT_BOXES = [
  {
    id: 'signature',
    en: 'Signature box',
    ar: 'العلبة الخاصة',
    blurb: {
      en: 'Our green linen box, closed with the gold house seal. Included with every gift.',
      ar: 'علبتنا من الكتّان الأخضر، مغلقة بختم الدار الذهبي. تأتي مع كل هدية دون مقابل.',
    },
    priceFils: 0,
  },
  {
    id: 'sadu',
    en: 'Al Sadu keepsake box',
    ar: 'علبة السدو التذكارية',
    blurb: {
      en: 'The box wrapped in hand-woven Al Sadu, the Bedouin weave Kuwait keeps alive, to be kept long after the bottle is empty.',
      ar: 'العلبة ملفوفة بنسيج السدو المنسوج يدوياً، الحرفة البدوية التي تحفظها الكويت، لتبقى تذكاراً بعد أن تفرغ القارورة.',
    },
    priceFils: 4500,
  },
  {
    id: 'majlis',
    en: 'Majlis chest with bukhoor',
    ar: 'صندوق المجلس مع البخور',
    blurb: {
      en: 'A wooden chest that holds the bottle beside a small mabkhara and a tin of oud bukhoor, ready for the majlis.',
      ar: 'صندوق خشبي يضمّ القارورة إلى جانب مبخرة صغيرة وعلبة من بخور العود، جاهز للمجلس.',
    },
    priceFils: 12000,
  },
]

export const GIFT_BOX_BY_ID = byId(GIFT_BOXES)

/** Longest gift message, in characters, printed on the card inside the box. */
export const GIFT_MESSAGE_MAX = 200
