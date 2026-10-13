import { forwardRef } from 'react'
import { BadgeCheck, Info } from 'lucide-react'
import { GIFT_BOX_BY_ID } from '../../data/gifting'
import { useLocale } from '../../i18n/locale-context'
import { formatDate, formatMobile, formatPrice, formatWeekday } from '../../lib/format'
import { GiftCard } from './GiftSummary'
import OrderSummary from './OrderSummary'
import { AddressLine, Typed } from './fields'

// Unicode isolates keep an email or a +965 number whole inside an Arabic sentence.
const isolate = (text) => `\u2068${text}\u2069`
// A phone number also keeps its groups together on one line.
const ltr = (text) => `\u2066${text.replace(/ /g, '\u00a0')}\u2069`

const PAYMENT_LABELS = {
  knet: 'checkout.pay.knet',
  card: 'checkout.pay.card',
  'apple-pay': 'checkout.pay.applePay',
  cod: 'checkout.pay.cod',
}

function Row({ label, children }) {
  return (
    <div className="grid gap-1 border-b border-snow-200 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
      <dt className="ticket pt-0.5 text-snow-600">{label}</dt>
      <dd className="font-sans text-[15px] leading-relaxed text-ink-950 rtl:font-sans-ar">{children}</dd>
    </div>
  )
}

/**
 * The placed order, read back from its receipt: reference, when it arrives,
 * who receives it and where, how it is paid, the gift, the lines and the
 * total. The cart has already been emptied behind it.
 */
const Confirmation = forwardRef(function Confirmation({ receipt, onClose }, headingRef) {
  const { lang, t, tr } = useLocale()
  const { promise, customer, recipient, gift } = receipt

  const when = t('checkout.promise.date', {
    weekday: formatWeekday(promise.dateISO, lang),
    date: formatDate(promise.dateISO, lang),
  })
  const body = recipient
    ? t('checkout.done.bodyRecipient', {
        email: isolate(customer.email),
        recipient: isolate(recipient.name),
        mobile: ltr(formatMobile(recipient.mobile)),
      })
    : t('checkout.done.body', { email: isolate(customer.email), mobile: ltr(formatMobile(customer.mobile)) })
  const receiver = recipient ?? customer
  // The name is the shopper's own text: set it apart from the sentence around it.
  const [titleBefore, titleAfter = ''] = t('checkout.done.title', { name: '\u0000' }).split('\u0000')
  const box = gift ? GIFT_BOX_BY_ID[gift.boxId] : null

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-12 sm:px-10 sm:py-14">
      <div className="text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-green-600/40 bg-green-700/[0.06]">
          <BadgeCheck aria-hidden="true" className="h-9 w-9 text-green-600" strokeWidth={1.25} />
        </span>
        <p className="ticket mt-7 text-green-600">{t('checkout.done.eyebrow')}</p>
        <h2
          ref={headingRef}
          id="checkout-title"
          tabIndex={-1}
          className="t-h2 mt-3 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          {titleBefore}
          <Typed>{customer.name}</Typed>
          {titleAfter}
        </h2>
        <p className="t-body mx-auto mt-4 max-w-md text-snow-600">{body}</p>
      </div>

      <dl className="mt-10 border-t border-gold-500/60">
        <Row label={t('checkout.done.reference')}>
          <span dir="ltr" className="t-figure text-[1.15rem] tracking-[0.06em]">
            {receipt.reference}
          </span>
        </Row>
        <Row label={t('checkout.done.arrives')}>{t(`checkout.promise.${promise.type}`, { when })}</Row>
        <Row label={t('checkout.done.deliverTo')}>
          <Typed>{receiver.name}</Typed>
          <span className="text-snow-600">
            {' · '}
            <bdi dir="ltr">{formatMobile(receiver.mobile)}</bdi>
          </span>
          <span className="block text-snow-600">
            <AddressLine address={receipt.address} />
          </span>
        </Row>
        <Row label={t('checkout.done.payment')}>{t(PAYMENT_LABELS[receipt.payment] ?? 'checkout.pay.knet')}</Row>
        {gift && (
          <Row label={t('checkout.gift.title')}>
            {tr(box)}
            <span className="text-snow-600">
              {' · '}
              {receipt.totals.giftFils > 0 ? formatPrice(receipt.totals.giftFils, lang) : t('complimentary')}
            </span>
            <span className="block text-snow-600">
              {t(gift.hidePrices ? 'checkout.gift.slipHidden' : 'checkout.gift.slipShown')}
            </span>
            {gift.message.trim() && (
              <span className="mt-4 block">
                <GiftCard message={gift.message} from={gift.from.trim()} />
              </span>
            )}
          </Row>
        )}
      </dl>

      <OrderSummary
        title={t('checkout.done.items')}
        headingId="checkout-done-items"
        lines={receipt.lines}
        totals={receipt.totals}
        gift={gift}
        className="mt-10"
      />

      <p className="mt-8 flex items-start gap-3 border border-snow-200 bg-snow-100 px-5 py-4 font-sans text-[13px] leading-relaxed text-snow-600 rtl:font-sans-ar">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={1.5} />
        {t('checkout.done.demo')}
      </p>

      <div className="mt-10 text-center">
        <button type="button" onClick={onClose} className="btn-green">
          {t('continueBrowsing')}
        </button>
      </div>
    </div>
  )
})

export default Confirmation
