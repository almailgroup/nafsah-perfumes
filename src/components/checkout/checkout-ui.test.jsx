import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { LocaleContext, translate, translateCount, translateValue } from '../../i18n/locale-context'
import { cartTotals, detailLines, EMPTY_GIFT } from '../../context/cart-context'
import { EMPTY_ADDRESS } from '../../lib/address'
import AddressFields from './AddressFields'
import Confirmation from './Confirmation'
import { GiftCard } from './GiftSummary'
import OrderSummary from './OrderSummary'
import StepRail from './StepRail'
import { buildReceipt, EMPTY_FORM } from './checkout-logic'

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

// Visible text, minus what is deliberately left to right (phone numbers, the
// reference, emails) and the SVG vial.
const arabicText = (html) =>
  html
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<(bdi|span|p)[^>]*dir="ltr"[^>]*>[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[⁦⁨][^⁩]*⁩/g, ' ')
    .replace(/name@example\.com/g, ' ')

const lines = detailLines([
  { id: 'oud-noir__full', productId: 'oud-noir', formatId: 'full', qty: 1 },
  { id: 'qahwa__sample', productId: 'qahwa', formatId: 'sample', qty: 2 },
])

const form = {
  ...EMPTY_FORM,
  name: 'نورة المطيري',
  email: 'noura@example.com',
  mobile: '99887766',
  recipientName: 'سارة',
  recipientMobile: '55551234',
  address: { ...EMPTY_ADDRESS, governorate: 'ahmadi', area: 'khiran', block: '3', street: '12', building: '18' },
}

describe('Confirmation', () => {
  const gift = { ...EMPTY_GIFT, enabled: true, boxId: 'sadu', message: 'عيد مبارك', from: 'نورة', deliverToRecipient: true }
  const receipt = buildReceipt({
    form,
    gift,
    lines,
    totals: cartTotals(lines, gift, 'khiran'),
    // Sunday morning in Kuwait: remote, so Tuesday.
    now: new Date('2026-10-11T10:00:00+03:00'),
    reference: 'NFS-7K3Q9M',
  })

  it('reads the order back in Arabic with Arabic-Indic digits', () => {
    const html = render('ar', <Confirmation receipt={receipt} onClose={() => {}} />)
    expect(html).toContain('NFS-7K3Q9M')
    expect(html).toContain('الثلاثاء')
    expect(html).toContain('منطقة بعيدة')
    expect(html).toContain('علبة السدو التذكارية')
    expect(html).toContain('عيد مبارك')
    expect(html).toContain('د.ك. ١٣٣٫٥٠٠')
    // The driver calls the recipient, not the buyer.
    expect(html).toContain('⁦+965 5555 1234⁩')
    expect(arabicText(html)).not.toMatch(/[0-9]/)
  })

  it('reads it back in English', () => {
    const html = render('en', <Confirmation receipt={receipt} onClose={() => {}} />)
    expect(html).toContain('Tuesday 13 October 2026 · outlying area')
    expect(html).toContain('KWD 133.500')
    expect(html).toContain('Prices left off the packing slip')
    expect(html).not.toMatch(/undefined|NaN|\{\w+\}/)
  })
})

describe('OrderSummary', () => {
  it('shows the vial, the gift box and the remote note until an area is chosen', () => {
    const gift = { ...EMPTY_GIFT, enabled: true, boxId: 'majlis' }
    const html = render('en', <OrderSummary lines={lines} totals={cartTotals(lines, gift)} gift={gift} areaChosen={false} />)
    expect(html).toContain('With a free 2 ml test vial')
    expect(html).toContain('Majlis chest with bukhoor')
    expect(html).toContain('KWD 12.000')
    expect(html).toContain('Outlying areas add KWD 2.000')
  })

  it('has no Latin digits in Arabic', () => {
    const html = render('ar', <OrderSummary lines={lines} totals={cartTotals(lines)} title="ملخص الطلب" headingId="s" />)
    expect(arabicText(html)).not.toMatch(/[0-9]/)
  })

  // A middle dot beside Arabic-Indic digits reads as a zero: "١٠٠٠ مل".
  it('joins the format and its volume with a comma, not a middle dot', () => {
    const ar = render('ar', <OrderSummary lines={lines} totals={cartTotals(lines)} />)
    expect(ar).toContain('الزجاجة الكاملة، ١٠٠ مل')
    expect(arabicText(ar)).not.toContain('·')
    expect(render('en', <OrderSummary lines={lines} totals={cartTotals(lines)} />)).toContain('Full Bottle, 100 ml')
  })
})

describe('GiftCard', () => {
  it('draws the cart preview’s card and keeps the message readable', () => {
    const html = render('ar', <GiftCard message="عيد مبارك يا ماما" from="Noura" />)
    expect(html).toMatch(/<p aria-hidden="true"[^>]*>نَفْسَة<\/p>/)
    expect(html).toMatch(/<blockquote dir="auto"[^>]*rtl:font-sans-ar[^>]*>عيد مبارك يا ماما<\/blockquote>/)
    expect(html).toContain('<figcaption')
    expect(html).toContain('من <bdi>Noura</bdi>')
    expect(html).not.toMatch(/<figure[^>]*aria-hidden/)
  })
})

describe('AddressFields', () => {
  const noop = () => {}

  it('lists the governorate’s areas, an Other option, and the remote note', () => {
    const html = render(
      'ar',
      <AddressFields address={form.address} buildingType="house" onChange={noop} onBuildingType={noop} />,
    )
    expect(html).toContain('الخيران')
    expect(html).toContain('منطقة أخرى…')
    expect(html).toContain('من المناطق البعيدة')
    // Never same-day, then next-day timing plus the policy's extra day.
    expect(html).toContain('لا توصيل في اليوم نفسه')
    expect(html).toContain('يوم توصيل إضافي')
    // A house asks for no floor or apartment.
    expect(html).not.toContain('id="checkout-floor"')
  })

  it('says an outlying area is never same-day, as the policy does', () => {
    const html = render('en', <AddressFields address={form.address} buildingType="house" onChange={noop} onBuildingType={noop} />)
    expect(html).toContain(
      'Al Khiran is an outlying area: no same-day delivery — it arrives on next-day timing plus one extra delivery day — and KWD 2.000 is added.',
    )
    expect(html).not.toMatch(/1 extra day/)
  })

  it('wires errors to their fields', () => {
    const html = render(
      'en',
      <AddressFields
        address={{ ...EMPTY_ADDRESS }}
        buildingType="apartment"
        errors={{ block: 'checkout.err.block' }}
        onChange={noop}
        onBuildingType={noop}
      />,
    )
    expect(html).toMatch(/id="checkout-block"[^>]*aria-describedby="checkout-block-error checkout-block-help"/)
    expect(html).toMatch(/id="checkout-block"[^>]*aria-invalid="true"/)
    expect(html).toContain('Enter the block number, from 1 to 999.')
    expect(html).toContain('id="checkout-floor"')
    // No area list before a governorate.
    expect(html).toMatch(/<select[^>]*disabled=""[^>]*id="checkout-area"|<select[^>]*id="checkout-area"[^>]*disabled=""/)
  })
})

describe('StepRail', () => {
  it('marks the current step and offers the finished ones', () => {
    const steps = [
      { id: 'details', label: 'Details' },
      { id: 'delivery', label: 'Delivery' },
      { id: 'review', label: 'Review' },
    ]
    const html = render('en', <StepRail steps={steps} current={1} onSelect={() => {}} />)
    expect(html.match(/aria-current="step"/g)).toHaveLength(1)
    expect(html).toContain('aria-label="Back to Details"')
    expect(html).toContain('Step 2 of 3')
  })
})
