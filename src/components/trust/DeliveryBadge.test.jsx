import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DeliveryBadge from './DeliveryBadge'
import { LocaleContext, translate, translateCount, translateValue } from '../../i18n/locale-context'

// Kuwait is UTC+3: 07:48Z on Sunday 11 October 2026 is 10:48 in Kuwait.
const kuwait = (day, time) => new Date(`2026-10-${day}T${time}:00+03:00`)
const SUNDAY = '11'
const THURSDAY = '15'

function render(lang, props = {}) {
  const value = {
    lang,
    t: (key, vars) => translate(lang, key, vars),
    tc: (key, count, vars) => translateCount(lang, key, count, vars),
    tr: (v) => translateValue(lang, v),
  }
  const html = renderToStaticMarkup(
    <LocaleContext.Provider value={value}>
      <DeliveryBadge {...props} />
    </LocaleContext.Provider>,
  )
  // Text only, one space between blocks.
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

const at = (date) => vi.setSystemTime(date)

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('DeliveryBadge', () => {
  it('counts down to the 2 PM cut-off in hours and minutes', () => {
    at(kuwait(SUNDAY, '10:48'))
    expect(render('en', { variant: 'compact' })).toBe(
      'Same-day delivery — order within 3 h 12 min · outlying areas excepted',
    )
    expect(render('ar', { variant: 'compact' })).toBe(
      'توصيل في اليوم نفسه — اطلب خلال ٣ ساعات و١٢ دقيقة، ما عدا المناطق البعيدة',
    )
  })

  it('agrees the Arabic nouns with the number', () => {
    // A chosen city area: the countdown alone.
    const salmiya = { variant: 'compact', areaId: 'salmiya' }
    at(kuwait(SUNDAY, '12:00'))
    expect(render('ar', salmiya)).toMatch(/اطلب خلال ساعتين$/)
    at(kuwait(SUNDAY, '12:58'))
    expect(render('ar', salmiya)).toMatch(/اطلب خلال ساعة ودقيقتين$/)
    at(kuwait(SUNDAY, '13:55'))
    expect(render('ar', salmiya)).toMatch(/اطلب خلال ٥ دقائق$/)
    expect(render('en', salmiya)).toMatch(/order within 5 min$/)
    at(kuwait(SUNDAY, '13:59'))
    expect(render('ar', salmiya)).toMatch(/اطلب خلال دقيقة$/)
  })

  it('promises tomorrow after the cut-off and skips the Friday rest', () => {
    at(kuwait(SUNDAY, '14:00'))
    expect(render('en', { variant: 'compact' })).toBe('Order now for delivery tomorrow · outlying areas excepted')
    expect(render('ar', { variant: 'compact' })).toBe('اطلب الآن ليصلك طلبك غداً، ما عدا المناطق البعيدة')
    at(kuwait(THURSDAY, '15:00'))
    expect(render('en', { variant: 'compact' })).toBe('Order now for delivery on Saturday · outlying areas excepted')
    expect(render('ar', { variant: 'compact' })).toBe('اطلب الآن ليصلك طلبك يوم السبت، ما عدا المناطق البعيدة')
    expect(render('en', { variant: 'compact', areaId: 'salmiya' })).toBe('Order now for delivery on Saturday')
  })

  it('adds the outlying-area terms on the inline badge', () => {
    at(kuwait(SUNDAY, '10:48'))
    expect(render('en')).toBe(
      'Same-day delivery — order within 3 h 12 min Al Khiran, Al Wafra, Sabah Al-Ahmad and other outlying areas: delivery in 2 days, +KWD 2.000',
    )
    expect(render('ar')).toMatch(/التوصيل خلال يومين برسوم إضافية د\.ك\. ٢٫٠٠٠$/)
  })

  it('names a chosen remote area, its day and its fee — never same-day', () => {
    at(kuwait(SUNDAY, '10:48'))
    expect(render('en', { areaId: 'khiran' })).toBe('Delivery to Al Khiran on Tuesday Outlying-area fee: +KWD 2.000')
    expect(render('ar', { areaId: 'khiran' })).toBe(
      'التوصيل إلى الخيران يوم الثلاثاء رسوم إضافية للمناطق البعيدة: د.ك. ٢٫٠٠٠',
    )
  })

  it('excepts outlying areas on the one-line badge only until an area is chosen', () => {
    at(kuwait(SUNDAY, '10:48'))
    expect(render('en', { variant: 'compact' })).toMatch(/outlying areas excepted$/)
    expect(render('ar', { variant: 'compact' })).toMatch(/، ما عدا المناطق البعيدة$/)
    expect(render('en', { variant: 'compact', areaId: 'khiran' })).toBe('Delivery to Al Khiran on Tuesday')
    expect(render('ar', { variant: 'compact', areaId: 'khiran' })).toBe('التوصيل إلى الخيران يوم الثلاثاء')
    expect(render('en', { variant: 'compact', areaId: 'salmiya' })).toBe('Same-day delivery — order within 3 h 12 min')
  })
})
