import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import RatingBadge from './RatingBadge'
import ReviewForm from './ReviewForm'
import ReviewsSection from './ReviewsSection'
import StarInput from './StarInput'
import { TryFirstBanner } from '../trust/TryFirst'
import { PRODUCTS_BY_ID } from '../../data/products'
import { LocaleContext, translate, translateCount, translateValue } from '../../i18n/locale-context'

function render(lang, element) {
  const value = {
    lang,
    isRtl: lang === 'ar',
    t: (key, vars) => translate(lang, key, vars),
    tc: (key, count, vars) => translateCount(lang, key, count, vars),
    tr: (v) => translateValue(lang, v),
  }
  return renderToStaticMarkup(<LocaleContext.Provider value={value}>{element}</LocaleContext.Provider>)
}

const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const radios = (html) => [...html.matchAll(/<button[^>]*role="radio"[^>]*>/g)].map(([tag]) => tag)
const LABELS = ['Poor', 'Fair', 'Good', 'Very good', 'Excellent']

describe('StarInput', () => {
  it('is a required radiogroup of five named stars with one tab stop', () => {
    const html = render('en', <StarInput value={0} labels={LABELS} labelledBy="l" describedBy="h" />)
    expect(html).toMatch(/role="radiogroup"[^>]*aria-labelledby="l"[^>]*aria-describedby="h"[^>]*aria-required="true"/)
    const tags = radios(html)
    expect(tags).toHaveLength(5)
    expect(tags.filter((tag) => tag.includes('tabindex="0"'))).toHaveLength(1)
    expect(tags[0]).toContain('tabindex="0"')
    expect(tags[2]).toContain('aria-label="3 of 5 — Good"')
    expect(tags.some((tag) => tag.includes('aria-checked="true"'))).toBe(false)
    expect(text(html)).toBe('Not rated yet')
  })

  it('checks and focuses the chosen star, and says the choice in words', () => {
    const html = render('en', <StarInput value={4} labels={LABELS} invalid />)
    const tags = radios(html)
    expect(tags[3]).toContain('aria-checked="true"')
    expect(tags[3]).toContain('tabindex="0"')
    expect(tags.filter((tag) => tag.includes('aria-checked="true"'))).toHaveLength(1)
    expect(html).toContain('aria-invalid="true"')
    expect(text(html)).toBe('4 of 5 — Very good')
  })

  it('names the stars with Arabic-Indic digits in Arabic', () => {
    const html = render('ar', <StarInput value={2} labels={['ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز']} />)
    expect(radios(html)[4]).toContain('aria-label="٥ من ٥ — ممتاز"')
    expect(text(html)).toBe('٢ من ٥ — مقبول')
  })
})

describe('RatingBadge', () => {
  it('renders nothing for a fragrance without reviews', () => {
    expect(render('en', <RatingBadge productId="oud-noir" />)).toBe('')
    expect(render('en', <RatingBadge productId="oud-noir" onClick={() => {}} />)).toBe('')
  })
})

describe('ReviewsSection', () => {
  it('says plainly that there are no reviews yet, and offers the form', () => {
    const html = render('en', <ReviewsSection product={PRODUCTS_BY_ID['oud-noir']} />)
    expect(html).toContain('id="reviews"')
    expect(text(html)).toContain('No reviews yet. Be the first to review Oud Noir.')
    expect(html).toMatch(/aria-expanded="false"[^>]*>.*Write a review/)
    expect(html).not.toContain('role="meter"')
  })

  it('in Arabic, with the fragrance named in Arabic', () => {
    const html = render('ar', <ReviewsSection product={PRODUCTS_BY_ID['oud-noir']} />)
    expect(text(html)).toContain('لا توجد مراجعات بعد. كن أول من يكتب مراجعة عن العود الأسود.')
  })
})

describe('ReviewForm', () => {
  const form = (lang) => render(lang, <ReviewForm productName="Oud Noir" add={() => ({ ok: false, errors: {} })} />)

  it('marks the review text as required, as the name is', () => {
    const html = form('en')
    expect(html).toMatch(/<textarea[^>]*aria-required="true"/)
    expect(html).toMatch(/<input[^>]*aria-required="true"/)
  })

  it('says the review stays in this browser and is not sent to the house', () => {
    const en = text(form('en'))
    expect(en).toContain('Your review is saved in this browser only. It is not sent to Nafsah')
    expect(en).toContain('Save review')
    expect(en).not.toMatch(/publish/i)
    const ar = text(form('ar'))
    expect(ar).toContain('ولا تُرسل إلى نَفْسَة')
    expect(ar).toContain('احفظ المراجعة')
  })
})

describe('TryFirstBanner', () => {
  it('quotes the vial size from the data, in the active script', () => {
    expect(text(render('en', <TryFirstBanner variant="compact" />))).toContain(
      'Try First — a free 2 ml test vial comes with this bottle',
    )
    expect(text(render('ar', <TryFirstBanner variant="compact" />))).toContain('بحجم ٢ مل')
  })

  it('lists the formats that carry a vial and the return window', () => {
    const inline = text(render('en', <TryFirstBanner variant="inline" />))
    expect(inline).toContain('every Full Bottle, 50ml Spray, and Tola Oil')
    expect(inline).toContain('within 30 days')
    expect(text(render('ar', <TryFirstBanner variant="inline" />))).toContain('خلال ٣٠ يوماً')
  })

  it('opens its terms from a real button, and renders no dialog until asked', () => {
    for (const variant of ['compact', 'inline', 'band']) {
      const html = render('en', <TryFirstBanner variant={variant} />)
      expect(html).toMatch(/<button[^>]*aria-haspopup="dialog"/)
      expect(html).not.toContain('role="dialog"')
    }
  })
})
