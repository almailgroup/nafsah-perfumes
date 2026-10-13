import { useId, useState } from 'react'
import { Gift } from 'lucide-react'
import GiftPanel from '../gifting/GiftPanel'
import { GIFT_BOX_BY_ID } from '../../data/gifting'
import { useCart } from '../../context/cart-context'
import { useLocale } from '../../i18n/locale-context'
import { formatPrice } from '../../lib/format'

// Typed by the shopper in either script: Jost for Latin, Plex for Arabic.
const TYPED = "font-['Jost','IBM_Plex_Sans_Arabic','Futura',system-ui,sans-serif]"

/**
 * The message card as it will sit in the box: paper, a green rule along the
 * top, the gold seal, the message and who it is from. Read-only; the gift
 * panel edits it.
 */
export function GiftCard({ message, from }) {
  const { t } = useLocale()
  return (
    <figure className="relative max-w-sm border border-snow-200 bg-snow-50 pb-5 pe-14 ps-6 pt-7 shadow-[0_24px_48px_-36px_rgba(8,20,15,0.55)]">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-green-600" />
      <span
        aria-hidden="true"
        className="absolute end-5 top-5 grid h-7 w-7 place-items-center rounded-full border border-gold-500"
      >
        <span className="h-3.5 w-3.5 rounded-full border border-gold-500/60" />
      </span>
      <blockquote
        dir="auto"
        className={`whitespace-pre-line break-words text-[16px] leading-relaxed text-ink-950 ${TYPED}`}
      >
        {message}
      </blockquote>
      {from && (
        <figcaption dir="auto" className={`mt-4 text-[13px] text-snow-600 ${TYPED}`}>
          {t('checkout.gift.from', { name: from })}
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
