// Catalogue filtering, sorting, grid, family tiles and the header's family row (owner P3). Keys: 'catalogue.*'
//
// {count} is filled by tc() in the active script. {shown} and {total} are
// formatNumber()s, {min} and {max} formatPrice()s, {label} a taxonomy or
// note label, {query} what the shopper typed.
export default {
  en: {
    // Counted nouns
    'catalogue.count.one': '{count} fragrance',
    'catalogue.count.other': '{count} fragrances',
    'catalogue.meta.one': '{count} fragrance · sprays, oils and 2ml samples · delivered across Kuwait',
    'catalogue.meta.other': '{count} fragrances · sprays, oils and 2ml samples · delivered across Kuwait',

    // Family tiles
    'catalogue.tiles.all': 'All fragrances',
    'catalogue.tiles.empty': 'Not in the catalogue yet',

    // Filter bar
    'catalogue.filters': 'Filters',
    'catalogue.sheetTitle': 'Filter the catalogue',
    'catalogue.closeFilters': 'Close filters',
    'catalogue.facet.families': 'Family',
    'catalogue.facet.notes': 'Notes',
    'catalogue.facet.concentrations': 'Concentration',
    'catalogue.facet.sillage': 'Projection',
    'catalogue.facet.genders': 'Gender',
    'catalogue.priceMin': 'Minimum price',
    'catalogue.priceMax': 'Maximum price',
    'catalogue.notes.label': 'Find a note',
    'catalogue.notes.placeholder': 'Taif rose, Cambodi oud, saffron…',
    'catalogue.notes.hint': 'Shows fragrances that carry every note you choose.',
    'catalogue.notes.common': 'Most present in these fragrances',
    'catalogue.notes.none': 'No note by that name',
    'catalogue.showing': '{shown} of {total}',
    'catalogue.showResults.one': 'Show {count} fragrance',
    'catalogue.showResults.other': 'Show {count} fragrances',

    // Active filters
    'catalogue.active': 'Active filters',
    'catalogue.chip.query': 'Search: “{query}”',
    'catalogue.chip.price': 'Price {min} – {max}',
    'catalogue.remove': 'Remove {label}',
    'catalogue.clearAll': 'Clear all',

    // Nothing found
    'catalogue.empty.body': 'No fragrance meets all of these at once. Remove one, or clear them all.',
    'catalogue.empty.finder': 'Not sure where to begin? Let us suggest a fragrance',
  },
  ar: {
    'catalogue.count.zero': 'لا عطور',
    'catalogue.count.one': 'عطر واحد',
    'catalogue.count.two': 'عطران',
    'catalogue.count.few': '{count} عطور',
    'catalogue.count.many': '{count} عطراً',
    'catalogue.count.other': '{count} عطر',
    'catalogue.meta.zero': 'لا عطور · بخاخات ودهون وعيّنات ٢ مل · توصيل إلى جميع مناطق الكويت',
    'catalogue.meta.one': 'عطر واحد · بخاخات ودهون وعيّنات ٢ مل · توصيل إلى جميع مناطق الكويت',
    'catalogue.meta.two': 'عطران · بخاخات ودهون وعيّنات ٢ مل · توصيل إلى جميع مناطق الكويت',
    'catalogue.meta.few': '{count} عطور · بخاخات ودهون وعيّنات ٢ مل · توصيل إلى جميع مناطق الكويت',
    'catalogue.meta.many': '{count} عطراً · بخاخات ودهون وعيّنات ٢ مل · توصيل إلى جميع مناطق الكويت',
    'catalogue.meta.other': '{count} عطر · بخاخات ودهون وعيّنات ٢ مل · توصيل إلى جميع مناطق الكويت',

    'catalogue.tiles.all': 'جميع العطور',
    'catalogue.tiles.empty': 'لم يُضَف إلى الفهرس بعد',

    'catalogue.filters': 'التصفية',
    'catalogue.sheetTitle': 'تصفية الفهرس',
    'catalogue.closeFilters': 'إغلاق التصفية',
    'catalogue.facet.families': 'العائلة',
    'catalogue.facet.notes': 'النوتات',
    'catalogue.facet.concentrations': 'التركيز',
    'catalogue.facet.sillage': 'الفوحان',
    'catalogue.facet.genders': 'النوع',
    'catalogue.priceMin': 'أدنى سعر',
    'catalogue.priceMax': 'أعلى سعر',
    'catalogue.notes.label': 'ابحث عن نوتة',
    'catalogue.notes.placeholder': 'ورد طائفي، عود كمبودي، زعفران…',
    'catalogue.notes.hint': 'تظهر العطور التي تجمع كل النوتات التي تختارها.',
    'catalogue.notes.common': 'الأكثر حضوراً في هذه العطور',
    'catalogue.notes.none': 'لا توجد نوتة بهذا الاسم',
    'catalogue.showing': '{shown} من أصل {total}',
    'catalogue.showResults.zero': 'لا توجد عطور مطابقة',
    'catalogue.showResults.one': 'عرض عطر واحد',
    'catalogue.showResults.two': 'عرض عطرين',
    'catalogue.showResults.few': 'عرض {count} عطور',
    'catalogue.showResults.many': 'عرض {count} عطراً',
    'catalogue.showResults.other': 'عرض {count} عطر',

    'catalogue.active': 'عوامل التصفية المفعّلة',
    'catalogue.chip.query': 'بحث: «{query}»',
    'catalogue.chip.price': 'السعر {min} – {max}',
    'catalogue.remove': 'إزالة {label}',
    'catalogue.clearAll': 'مسح الكل',

    'catalogue.empty.body': 'لا يوجد عطر يجمع كل هذه الشروط معاً. أزِل أحدها أو امسحها كلها.',
    'catalogue.empty.finder': 'لست متأكداً من أين تبدأ؟ دعنا نقترح عليك عطراً',
  },
}
