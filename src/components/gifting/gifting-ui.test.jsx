import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import CartDrawer from '../CartDrawer'
import GiftPanel from './GiftPanel'
import GiftCardPreview from './GiftCardPreview'
import { CartContext, cartTotals, detailLines, EMPTY_GIFT, MAX_QTY } from '../../context/cart-context'
import { LocaleContext, translate, translateCount, translateValue } from '../../i18n/locale-context'

const noop = () => {}

function render(lang, element, cart = {}) {
  const locale = {
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    isRtl: lang === 'ar',
    switching: false,
    t: (key, vars) => translate(lang, key, vars),
    tc: (key, count, vars) => translateCount(lang, key, count, vars),
    tr: (value) => translateValue(lang, value),
  }
  const gift = cart.gift ?? EMPTY_GIFT
  const lines = cart.lines ?? []
  const value = {
    lines,
    totals: cartTotals(lines, gift, cart.deliveryAreaId ?? null),
    maxQty: MAX_QTY,
    gift,
    setGift: noop,
    setQty: noop,
    removeItem: noop,
    openCheckout: noop,
    closeCart: noop,
    deliveryAreaId: cart.deliveryAreaId ?? null,
    isCartOpen: cart.isCartOpen ?? true,
    cartSection: cart.cartSection ?? null,
    lastAddedAt: 0,
  }
  return renderToStaticMarkup(
    <LocaleContext.Provider value={locale}>
      <CartContext.Provider value={value}>{element}</CartContext.Provider>
    </LocaleContext.Provider>,
  )
}

// What a reader sees: text outside SVGs, form controls and screen-reader-only spans.
const visibleText = (html) =>
  html
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<textarea[\s\S]*?<\/textarea>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')

const attr = (html, selector, name) => html.match(new RegExp(`${selector}[^>]*?${name}="([^"]*)"`))?.[1]

const GIFT_ON = { ...EMPTY_GIFT, enabled: true, boxId: 'sadu', message: 'Eid Mubarak', from: 'نورة' }

describe('GiftPanel', () => {
  it('is only the switch while the order is not a gift', () => {
    const html = render('en', <GiftPanel />)
    expect(html).toContain('role="switch"')
    expect(html).toContain('aria-checked="false"')
    expect(html).not.toContain('type="radio"')
    expect(html).not.toContain('<textarea')
  })

  it('offers the three boxes, priced, with the chosen one checked', () => {
    const html = render('en', <GiftPanel />, { gift: GIFT_ON })
    expect(html).toContain('aria-checked="true"')
    expect(html.match(/type="radio"/g)).toHaveLength(3)
    const radios = html.match(/<input type="radio"[^>]*>/g)
    expect(radios.filter((tag) => tag.includes('checked=""'))).toEqual([expect.stringContaining('value="sadu"')])
    expect(html).toContain('Complimentary')
    expect(html).toContain('KWD 4.500')
    expect(html).toContain('KWD 12.000')
    // Full panel: each box's blurb describes it.
    expect(html).toContain('hand-woven Al Sadu')
  })

  it('limits the card to GIFT_MESSAGE_MAX, counts as you type and keeps the text bidi-safe', () => {
    const html = render('en', <GiftPanel />, { gift: GIFT_ON })
    expect(html).toMatch(/<textarea[^>]*dir="auto"[^>]*maxLength="200"/)
    expect(html).toContain('11 / 200')
    expect(html).toContain('Up to 200 characters')
    expect(html).toContain('We ask for their name and mobile at checkout.')
  })

  it('previews the card live, the sender isolated inside the sentence', () => {
    const html = render('en', <GiftPanel />, { gift: GIFT_ON })
    expect(html).toContain('Eid Mubarak')
    expect(html).toContain('From <bdi>نورة</bdi>')
  })

  it('writes every figure in Arabic-Indic digits in Arabic', () => {
    const html = render('ar', <GiftPanel />, { gift: GIFT_ON })
    const text = visibleText(html)
    expect(text).not.toMatch(/[0-9]/)
    expect(text).toContain('د.ك. ٤٫٥٠٠')
    expect(text).toContain('١١ / ٢٠٠')
    expect(text).toContain('مجاني')
  })

  it('condenses for checkout: no blurbs, the recipient hint points at the Delivery step', () => {
    const html = render('en', <GiftPanel compact />, { gift: GIFT_ON })
    expect(html.match(/type="radio"/g)).toHaveLength(3)
    expect(html).not.toContain('hand-woven Al Sadu')
    expect(html).toContain('Their name and mobile go in the Delivery step.')
  })

  it('gives each mounted panel its own radio group', () => {
    const html = render(
      'en',
      <>
        <GiftPanel />
        <GiftPanel compact />
      </>,
      { gift: GIFT_ON },
    )
    const names = new Set([...html.matchAll(/type="radio" name="([^"]+)"/g)].map((m) => m[1]))
    expect(names.size).toBe(2)
  })
})

describe('GiftCardPreview', () => {
  it('shows a placeholder until there is a message, and is hidden from screen readers', () => {
    const html = render('en', <GiftCardPreview message="  " from="" />)
    expect(html).toContain('Your message will appear here.')
    expect(html.startsWith('<div aria-hidden="true"')).toBe(true)
    expect(html).not.toContain('From')
  })
})

describe('CartDrawer', () => {
  const lines = detailLines([
    { id: 'oud-noir__full', productId: 'oud-noir', formatId: 'full', qty: 1 },
    { id: 'qahwa__sample', productId: 'qahwa', formatId: 'sample', qty: 2 },
  ])

  it('labels every control with the fragrance and its format', () => {
    const html = render('en', <CartDrawer />, { lines })
    expect(html).toContain('aria-label="Remove Oud Noir, Full Bottle"')
    expect(html).toContain('aria-label="One more Qahwa, 2ml Sample Vial"')
    expect(html).toContain('aria-label="Quantity of Qahwa, 2ml Sample Vial"')
    // At one bottle the minus stays focusable but does nothing.
    expect(html).toMatch(/aria-disabled="true" aria-label="One fewer Oud Noir, Full Bottle"/)
    expect(html).toContain('KWD 4.000 each')
  })

  it('marks Try First bottles with their vial, and only those', () => {
    const html = render('en', <CartDrawer />, { lines })
    expect(html.match(/Includes a free 2 ml test vial/g)).toHaveLength(1)
    expect(html).toContain('How Try First works')
  })

  it('reports the way to free delivery as a progress bar with a spoken value', () => {
    const small = detailLines([{ id: 'qahwa__sample', productId: 'qahwa', formatId: 'sample', qty: 1 }])
    const html = render('en', <CartDrawer />, { lines: small })
    expect(attr(html, 'role="progressbar"', 'aria-valuenow')).toBe('4')
    expect(attr(html, 'role="progressbar"', 'aria-valuemax')).toBe('75')
    expect(attr(html, 'role="progressbar"', 'aria-valuetext')).toBe('KWD 4.000 of KWD 75.000')
    expect(html).toContain('KWD 71.000 away from complimentary delivery')
  })

  it('adds the gift box to the totals and says the outlying-area fee comes at checkout', () => {
    const gift = { ...EMPTY_GIFT, enabled: true, boxId: 'majlis' }
    const html = render('en', <CartDrawer />, { lines, gift })
    expect(html).toContain('Gift box')
    expect(html).toContain('Majlis chest with bukhoor')
    expect(html).toContain('Outlying areas add KWD 2.000, calculated at checkout')
    expect(html).toContain('KWD 139.000') // 127 + 12, delivery free
    expect(html).toContain('Majlis chest with bukhoor · no message card yet')
  })

  it('shows the surcharge itself once checkout has a remote area', () => {
    const html = render('en', <CartDrawer />, { lines, deliveryAreaId: 'khiran' })
    expect(html).toContain('Outlying-area delivery')
    expect(html).not.toContain('calculated at checkout')
    expect(html).toContain('KWD 129.000')
  })

  it('reads in Arabic with Arabic-Indic digits and a forward arrow that points left', () => {
    const html = render('ar', <CartDrawer />, { lines, gift: GIFT_ON })
    expect(visibleText(html)).not.toMatch(/[0-9]/)
    expect(html).toContain('lucide-arrow-left')
    expect(html).not.toContain('lucide-arrow-right')
    expect(html).toContain('aria-label="إزالة العود الأسود، الزجاجة الكاملة"')
  })

  it('opens on the gift when asked to, focus landing on it rather than on close', () => {
    const html = render('en', <CartDrawer />, { lines, cartSection: 'gift' })
    expect(html).toMatch(/aria-expanded="false"[^>]*data-autofocus="true"/)
    expect(html).not.toMatch(/data-autofocus="true"[^>]*aria-label="Close cart"/)
  })
})
