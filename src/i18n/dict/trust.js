// Try First, trust badges and policies in brief (owner P2). Keys: 'trust.*'
//
// Filled in by the components, never typed here: {vial} is formatMl(2),
// {formats} / {others} the Try First formats from FORMATS as a list,
// {period} is trust.days with RETURN_WINDOW_DAYS, {cutoff} comes from
// deliveryVars(). The product card's own strings live under 'trust.card.*'.
export default {
  en: {
    'trust.tryFirst': 'Try First',
    'trust.howItWorks': 'How it works',
    'trust.days.one': '{count} day',
    'trust.days.other': '{count} days',
    'trust.newTab': '(opens in a new tab)',

    'trust.compactBody': 'a free {vial} test vial comes with this bottle',
    'trust.inlineTitle': 'Try First — wear it before you open it',
    'trust.inlineBody':
      'A free {vial} vial of the same fragrance comes with every {formats}. If it is not for you, return the bottle sealed within {period}.',
    'trust.bandTitle': 'Wear it before you break the seal',
    'trust.bandBody':
      'A free {vial} test vial of the same fragrance comes with every {formats}. Open the vial, wear it through a Kuwaiti day, and keep the bottle only if it earns its place.',
    'trust.bandStep1': 'Open the vial',
    'trust.bandStep2': 'Wear it in the heat',
    'trust.bandStep3': 'Keep it, or return it sealed',

    'trust.modal.eyebrow': 'The house promise',
    'trust.modal.lede':
      'Every {formats} comes with a free {vial} test vial of the same fragrance. Wear the vial first, and open the bottle only when you are sure.',
    'trust.modal.includedTitle': 'What comes with it',
    'trust.modal.included1': 'A {vial} test vial of the same fragrance, free of charge.',
    'trust.modal.included2': 'With every {formats} — one vial for each bottle you order.',
    'trust.modal.included3': 'A {others} is already a trial size, so it comes without one.',
    'trust.modal.howTitle': 'How it works',
    'trust.modal.step1Title': 'Open the vial first',
    'trust.modal.step1Body': 'Leave the bottle sealed in its cellophane.',
    'trust.modal.step2Title': 'Wear it for a day',
    'trust.modal.step2Body':
      'Outdoors, in the heat, at the diwaniya: see how long it lasts and how far it carries on you.',
    'trust.modal.step3Title': 'Then decide',
    'trust.modal.step3Body':
      'Love it? Open the bottle. Not for you? Return the sealed bottle within {period} for a full refund. The vial is yours to keep.',
    'trust.modal.conditionsTitle': 'Conditions',
    'trust.modal.condition1': 'The seal and the cellophane must be intact.',
    'trust.modal.condition2': 'One Try First return per fragrance, per customer.',
    'trust.modal.condition3': 'Write to us before sending anything back, and we will arrange the return.',
    'trust.modal.policyLink': 'Full shipping and returns policy',
    'trust.modal.close': 'Close',

    'trust.badges.heading': 'The house promises',
    'trust.badges.sameDay': 'Same-day delivery',
    'trust.badges.sameDayBody': 'Order before {cutoff}, Kuwait time, for delivery today. Fridays and outlying areas excepted.',
    'trust.badges.tryFirstBody': 'A free {vial} vial of the same scent with every bottle. Not for you? Return the bottle sealed.',

    'trust.card.number': 'No. {number}',
    'trust.card.formatLabel': 'Choose a size for {name}',
    'trust.card.addContext': '{name}, {format}',
    'trust.card.added': '{name}, {format}, added to your cart.',
  },
  ar: {
    'trust.tryFirst': 'جرّب أولاً',
    'trust.howItWorks': 'كيف تتم التجربة',
    'trust.days.zero': '{count} يوم',
    'trust.days.one': 'يوم واحد',
    'trust.days.two': 'يومين',
    'trust.days.few': '{count} أيام',
    'trust.days.many': '{count} يوماً',
    'trust.days.other': '{count} يوم',
    'trust.newTab': '(يُفتح في علامة تبويب جديدة)',

    'trust.compactBody': 'تصلك مع هذه الزجاجة عيّنة تجربة مجانية بحجم {vial}',
    'trust.inlineTitle': 'جرّب أولاً — ضعه قبل أن تفتح الزجاجة',
    'trust.inlineBody':
      'تصلك عيّنة مجانية بحجم {vial} من العطر نفسه مع كلٍّ من {formats}. وإن لم يناسبك فأعِد الزجاجة مختومة خلال {period}.',
    'trust.bandTitle': 'جرّبه قبل أن تكسر الختم',
    'trust.bandBody':
      'تصلك مع كلٍّ من {formats} عيّنة تجربة مجانية بحجم {vial} من العطر نفسه. افتح العيّنة وضعها طوال يوم كويتي، ولا تحتفظ بالزجاجة إلا إن استحقت مكانها.',
    'trust.bandStep1': 'افتح العيّنة',
    'trust.bandStep2': 'جرّبها في الحرّ',
    'trust.bandStep3': 'احتفظ بالزجاجة أو أعِدها مختومة',

    'trust.modal.eyebrow': 'وعد الدار',
    'trust.modal.lede':
      'تصلك مع كلٍّ من {formats} عيّنة تجربة مجانية بحجم {vial} من العطر نفسه. جرّب العيّنة أولاً، ولا تفتح الزجاجة إلا حين تتأكد.',
    'trust.modal.includedTitle': 'ما الذي يصلك معها',
    'trust.modal.included1': 'عيّنة تجربة بحجم {vial} من العطر نفسه، بلا مقابل.',
    'trust.modal.included2': 'مع كلٍّ من {formats}، عيّنة واحدة لكل زجاجة تطلبها.',
    'trust.modal.included3': '{others} بحجم التجربة أصلاً، لذا لا تصحبها عيّنة.',
    'trust.modal.howTitle': 'كيف تتم التجربة',
    'trust.modal.step1Title': 'افتح العيّنة أولاً',
    'trust.modal.step1Body': 'أبقِ الزجاجة مختومة داخل غلافها الشفاف.',
    'trust.modal.step2Title': 'ضعها يوماً كاملاً',
    'trust.modal.step2Body': 'في الخارج وتحت الحرّ وفي الديوانية، لترى كم يدوم العطر وإلى أي مدى يفوح منك.',
    'trust.modal.step3Title': 'ثم قرّر',
    'trust.modal.step3Body':
      'أعجبك؟ افتح الزجاجة. لم يناسبك؟ أعِد الزجاجة مختومة خلال {period} واسترد المبلغ كاملاً، وتبقى العيّنة لك.',
    'trust.modal.conditionsTitle': 'الشروط',
    'trust.modal.condition1': 'أن يكون الختم والغلاف الشفاف سليمين.',
    'trust.modal.condition2': 'إرجاع واحد عبر «جرّب أولاً» لكل عطر ولكل عميل.',
    'trust.modal.condition3': 'راسلنا قبل أن تعيد أي شيء، ونرتّب الإرجاع معك.',
    'trust.modal.policyLink': 'سياسة الشحن والإرجاع كاملة',
    'trust.modal.close': 'إغلاق',

    'trust.badges.heading': 'وعود الدار',
    'trust.badges.sameDay': 'توصيل في اليوم نفسه',
    'trust.badges.sameDayBody': 'اطلب قبل {cutoff} بتوقيت الكويت ليصلك اليوم، ما عدا الجمعة والمناطق البعيدة.',
    'trust.badges.tryFirstBody': 'عيّنة مجانية بحجم {vial} من العطر نفسه مع كل زجاجة. لم يناسبك؟ أعِد الزجاجة مختومة.',

    'trust.card.number': 'رقم {number}',
    'trust.card.formatLabel': 'اختر حجم {name}',
    'trust.card.addContext': '{name}، {format}',
    'trust.card.added': 'أُضيف {name} ({format}) إلى سلتك.',
  },
}
