import { TestTube } from 'lucide-react'
import BottleVisual from '../BottleVisual'
import { REMOTE_SURCHARGE_FILS } from '../../data/delivery'
import { GIFT_BOX_BY_ID } from '../../data/gifting'
import { concentrationFor } from '../../data/products'
import { CONCENTRATION_BY_ID, FORMAT_BY_ID } from '../../data/taxonomy'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatMl, formatNumber, formatPrice } from '../../lib/format'

/**
 * What is being bought and what it costs: one row per line with its vial,
 * format and quantity, then subtotal, gift box, delivery, the outlying-area
 * fee and the total. Used beside the form, inline on phones at review, and
 * on the confirmation (with the order's own lines and totals).
 *
 * `areaChosen` false adds the outlying-area fee as a note, since the area —
 * and so the fee — is not known yet.
 */
export default function OrderSummary({ lines, totals, gift, areaChosen = true, title, headingId, className }) {
  const { lang, t, tr } = useLocale()
  const price = (fils) => formatPrice(fils, lang)
  const box = gift?.enabled ? GIFT_BOX_BY_ID[gift.boxId] : null

  return (
    <section aria-labelledby={headingId} className={className}>
      {title && (
        <h3 id={headingId} className="ticket text-green-600">
          {title}
        </h3>
      )}

      <ul className={classNames('divide-y divide-snow-200 border-b border-snow-200', title && 'mt-4 border-t')}>
        {lines.map((line) => (
          <li key={line.id} className="flex gap-4 py-4">
            <div aria-hidden="true" className="h-[72px] w-12 shrink-0 overflow-hidden border border-snow-200 bg-snow-50">
              <BottleVisual
                palette={line.product.palette}
                label={CONCENTRATION_BY_ID[concentrationFor(line.product, line.formatId)]?.abbr}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="min-w-0 font-display text-[1.15rem] font-medium leading-tight text-ink-950 rtl:font-display-ar rtl:text-[1.05rem]">
                  {tr(line.product.name)}
                </p>
                <span className="t-figure shrink-0 text-[15px] text-ink-950">{price(line.subtotalFils)}</span>
              </div>
              <p className="ticket mt-1.5 text-snow-600">
                {t('product.selection', { format: tr(FORMAT_BY_ID[line.formatId]), volume: formatMl(line.format.ml, lang) })}
                <span className="whitespace-nowrap">
                  {' × '}
                  {formatNumber(line.qty, lang)}
                </span>
              </p>
              {line.includesTestVial && (
                <p className="mt-1.5 flex items-center gap-1.5 font-sans text-[12px] leading-snug text-snow-600 rtl:font-sans-ar">
                  <TestTube aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-green-600" strokeWidth={1.5} />
                  {t('checkout.summary.vial', { volume: formatMl(FORMAT_BY_ID.sample.ml, lang) })}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <dl className="mt-4 space-y-2 font-sans text-[14px] leading-snug rtl:font-sans-ar">
        <div className="flex justify-between gap-4 text-snow-600">
          <dt>{t('subtotal')}</dt>
          <dd className="tabular-nums text-ink-950">{price(totals.subtotalFils)}</dd>
        </div>
        {box && (
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 text-snow-600">
            <dt>{t('checkout.summary.giftBox')}</dt>
            <dd className="tabular-nums text-ink-950">
              {totals.giftFils > 0 ? price(totals.giftFils) : t('complimentary')}
            </dd>
            <dd className="col-span-2 mt-0.5 text-[12px]">{tr(box)}</dd>
          </div>
        )}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 text-snow-600">
          <dt>{t('checkout.summary.delivery')}</dt>
          <dd className="tabular-nums text-ink-950">
            {totals.shippingFils === 0 ? t('complimentary') : price(totals.shippingFils)}
          </dd>
          {totals.shippingFils > 0 && totals.remainingForFreeFils > 0 && (
            <dd className="col-span-2 mt-1 text-[12px]">
              {t('awayFromFree', { amount: price(totals.remainingForFreeFils) })}
            </dd>
          )}
          {!areaChosen && totals.remoteSurchargeFils === 0 && (
            <dd className="col-span-2 mt-1 text-[12px]">
              {t('checkout.summary.remoteLater', { fee: price(REMOTE_SURCHARGE_FILS) })}
            </dd>
          )}
        </div>
        {totals.remoteSurchargeFils > 0 && (
          <div className="flex justify-between gap-4 text-snow-600">
            <dt>{t('delivery.remoteSurcharge')}</dt>
            <dd className="tabular-nums text-ink-950">{price(totals.remoteSurchargeFils)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between gap-4 border-t border-snow-200 pt-3">
          <dt className="ticket text-ink-950">{t('total')}</dt>
          <dd className="t-figure text-[1.6rem] leading-none text-ink-950">{price(totals.totalFils)}</dd>
        </div>
      </dl>
    </section>
  )
}
