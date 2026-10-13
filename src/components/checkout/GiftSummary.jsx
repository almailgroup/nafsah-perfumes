import { useId, useState } from 'react'
import { Gift } from 'lucide-react'
import { GiftSeal, TYPED_FONT } from '../gifting/GiftCardPreview'
import GiftPanel from '../gifting/GiftPanel'
import { GIFT_BOX_BY_ID } from '../../data/gifting'
import { useCart } from '../../context/cart-context'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatPrice } from '../../lib/format'

/**
 * The message card as it will sit in the box, drawn as the cart's preview
 * draws it: paper, the green rule, the gold seal, the house's name, the
 * message and who it is from. Read-only; the gift panel edits it. Unlike the
 * preview it is read aloud: here it is the only place the message appears.
 */
export function GiftCard({ message, from }) {
  const { t } = useLocale()
  // The sender's name sits inside the sentence isolated, so an Arabic name in
  // an English line (or the reverse) cannot pull the words around it.
  const [before, after] = t('gifting.preview.from').split('{name}')
  return (
    <figure className="relative max-w-sm border border-snow-200 bg-snow-50 px-6 pb-6 pt-7 shadow-[0_24px_48px_-36px_rgba(8,20,15,0.55)]">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-green-600" />
      <GiftSeal className="absolute end-4 top-4 h-10 w-10" />
      <p aria-hidden="true" className="ticket pe-12 text-green-600">
        {t('brand')}
      </p>
      <blockquote
        dir="auto"
        className={classNames('mt-4 whitespace-pre-line break-words text-[16px] leading-relaxed text-ink-950', TYPED_FONT)}
      >
        {message}
      </blockquote>
      {from && (
        <figcaption className={classNames('mt-4 break-words text-[14px] leading-snug text-snow-600', TYPED_FONT)}>
          {before}
          <bdi>{from}</bdi>
          {after}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * The gift, at review: box, message card, packing slip and who receives it,
 * with the compact gift panel to change any of it. Without a gift, a quiet
 * offer to make it one.
 */
export default function GiftSummary() {
  const { gift, totals } = useCart()
  const { lang, t, tr } = useLocale()
  const [editing, setEditing] = useState(false)
  const headingId = useId()
  const panelId = useId()
  const box = GIFT_BOX_BY_ID[gift.boxId]

  const toggle = (
    <button
      type="button"
      aria-expanded={editing}
      aria-controls={panelId}
      onClick={() => setEditing((open) => !open)}
      className="ticket shrink-0 text-green-600 underline decoration-green-600/40 underline-offset-4 transition-colors duration-300 hover:text-ink-950 hover:decoration-ink-950"
    >
      {editing ? t('checkout.gift.done') : t(gift.enabled ? 'checkout.gift.edit' : 'checkout.gift.add')}
    </button>
  )

  return (
    <section aria-labelledby={headingId} className="border-b border-snow-200 py-6">
      <div className="flex items-center justify-between gap-4">
        <h4 id={headingId} className="ticket flex items-center gap-2 text-snow-600">
          <Gift aria-hidden="true" className="h-3.5 w-3.5 text-green-600" strokeWidth={1.5} />
          {t('checkout.gift.title')}
        </h4>
        {toggle}
      </div>

      <div id={panelId} className="mt-4">
        {editing ? (
          <div className="animate-fade-in">
            <GiftPanel compact />
          </div>
        ) : gift.enabled ? (
          <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start">
            <ul className="space-y-2 font-sans text-[14px] leading-snug text-snow-600 rtl:font-sans-ar">
              <li>
                <span className="text-ink-950">{tr(box)}</span>
                {' · '}
                {totals.giftFils > 0 ? formatPrice(totals.giftFils, lang) : t('complimentary')}
              </li>
              <li>{t(gift.hidePrices ? 'checkout.gift.slipHidden' : 'checkout.gift.slipShown')}</li>
              {gift.deliverToRecipient && <li>{t('checkout.gift.toRecipient')}</li>}
            </ul>
            {gift.message.trim() ? (
              <GiftCard message={gift.message} from={gift.from.trim()} />
            ) : (
              <p className="font-sans text-[14px] text-snow-600 rtl:font-sans-ar">{t('checkout.gift.noCard')}</p>
            )}
          </div>
        ) : (
          <p className="font-sans text-[14px] leading-snug text-snow-600 rtl:font-sans-ar">{t('checkout.gift.offer')}</p>
        )}
      </div>
    </section>
  )
}
