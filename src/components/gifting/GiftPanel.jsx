import { useId } from 'react'
import { Check } from 'lucide-react'
import BoxSwatch from './BoxSwatch'
import GiftCardPreview, { TYPED_FONT } from './GiftCardPreview'
import { GIFT_BOXES, GIFT_MESSAGE_MAX } from '../../data/gifting'
import { useCart } from '../../context/cart-context'
import { useLocale } from '../../i18n/locale-context'
import { classNames, formatNumber, formatPrice } from '../../lib/format'

// A name for the card's signature, not a letter.
const FROM_MAX = 60
// The counter speaks up only near the end, not on every keystroke.
const NEAR_LIMIT = 20

// The selected choice: a green frame and green-ringed dot, as on the format
// toggle and the checkout's radio cards (7.4:1 against the page).
const CHECKED_CARD = 'border-green-600 bg-snow-100 shadow-[inset_0_0_0_1px_#006039]'
const IDLE_CARD = 'border-snow-300 bg-snow-50 hover:border-snow-600'
const FOCUS_WITHIN =
  'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-green-600 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-snow-50'
// The house field, its focus frame doubled to 2px, in a face for either script.
const FIELD = classNames('field focus:shadow-[inset_0_0_0_1px_#006039]', TYPED_FONT)

/** "Send as a gift": a switch the size of its whole row, square like everything else in the house. */
function GiftSwitch({ id, checked, onChange, compact }) {
  const { t } = useLocale()
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={`${id}-label`}
      aria-describedby={compact ? undefined : `${id}-hint`}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-start gap-4 text-start"
    >
      <span className="min-w-0 flex-1">
        <span
          id={`${id}-label`}
          className="block font-sans text-[15px] font-medium leading-snug text-ink-950 rtl:font-sans-ar"
        >
          {t('gifting.switch')}
        </span>
        {!compact && (
          <span
            id={`${id}-hint`}
            className="mt-1 block font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar"
          >
            {t('gifting.switchHint')}
          </span>
        )}
      </span>
      {/* Off: an ink-grey frame and thumb at the start. On: Arab Green, the thumb at the end. */}
      <span
        aria-hidden="true"
        className={classNames(
          'relative mt-0.5 h-[22px] w-10 shrink-0 border transition-colors duration-300',
          checked ? 'border-green-600 bg-green-600' : 'border-snow-600 bg-snow-50 group-hover:border-ink-950',
        )}
      >
        <span
          className={classNames(
            'absolute start-[3px] top-[3px] h-[14px] w-[14px] transition-[transform,background-color] duration-300',
            checked
              ? 'translate-x-[18px] bg-snow-50 rtl:-translate-x-[18px]'
              : 'bg-snow-600 group-hover:bg-ink-950',
          )}
        />
      </span>
    </button>
  )
}

/** The radio's visible dot; the native radio underneath does the work. */
function Dot({ checked }) {
  return (
    <span
      aria-hidden="true"
      className={classNames(
        'grid h-4 w-4 shrink-0 place-items-center rounded-full border',
        checked ? 'border-green-600' : 'border-snow-600',
      )}
    >
      {checked && <span className="h-2 w-2 rounded-full bg-green-600" />}
    </span>
  )
}

/**
 * The three boxes as radio cards: native radios, so there is one Tab stop and
 * the arrow keys move the choice (the browser mirrors them in Arabic). Each
 * card is named by the box and its price; its blurb describes it.
 */
function BoxChoice({ id, value, onChange, compact }) {
  const { lang, t, tr } = useLocale()
  const name = `${id}-box`

  return (
    <fieldset className="min-w-0">
      <legend className="ticket mb-3 text-snow-600">{t('gifting.box.legend')}</legend>
      <div className={classNames('grid gap-2', compact && 'grid-cols-3')}>
        {GIFT_BOXES.map((box) => {
          const checked = box.id === value
          const optionId = `${name}-${box.id}`
          const free = box.priceFils <= 0
          const price = (
            <span
              id={`${optionId}-price`}
              className={classNames(
                'shrink-0 leading-snug',
                free ? 'font-sans text-[13px] text-green-600 rtl:font-sans-ar' : 't-figure text-[14px] text-ink-950',
              )}
            >
              {free ? t('complimentary') : formatPrice(box.priceFils, lang)}
            </span>
          )
          const input = (
            <input
              type="radio"
              name={name}
              value={box.id}
              checked={checked}
              onChange={() => onChange(box.id)}
              aria-labelledby={`${optionId}-name ${optionId}-price`}
              aria-describedby={compact ? undefined : `${optionId}-blurb`}
              className="sr-only"
            />
          )
          const boxName = (
            <span
              id={`${optionId}-name`}
              className={classNames(
                'block font-sans font-medium leading-snug text-ink-950 rtl:font-sans-ar',
                compact ? 'text-[13px]' : 'text-[15px]',
              )}
            >
              {tr(box)}
            </span>
          )

          if (compact) {
            return (
              <label
                key={box.id}
                className={classNames(
                  'relative flex min-w-0 cursor-pointer flex-col gap-2.5 border p-3 transition-colors duration-300',
                  FOCUS_WITHIN,
                  checked ? CHECKED_CARD : IDLE_CARD,
                )}
              >
                {input}
                <span className="flex items-start justify-between gap-2">
                  <BoxSwatch boxId={box.id} className="h-9 w-9" />
                  <Dot checked={checked} />
                </span>
                <span className="min-w-0">
                  {boxName}
                  <span className="mt-1 block">{price}</span>
                </span>
              </label>
            )
          }

          return (
            <label
              key={box.id}
              className={classNames(
                'relative flex cursor-pointer items-start gap-3.5 border px-4 py-4 transition-colors duration-300',
                FOCUS_WITHIN,
                checked ? CHECKED_CARD : IDLE_CARD,
              )}
            >
              {input}
              <span className="mt-[3px]">
                <Dot checked={checked} />
              </span>
              <BoxSwatch boxId={box.id} className="h-12 w-12" />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  {boxName}
                  {price}
                </span>
                <span
                  id={`${optionId}-blurb`}
                  className="mt-1 block font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar"
                >
                  {tr(box.blurb)}
                </span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** A field's label row: the label, and "Optional" on the logical end. */
function FieldLabel({ htmlFor, children }) {
  const { t } = useLocale()
  return (
    <label htmlFor={htmlFor} className="mb-2 flex h-5 items-end justify-between gap-3">
      <span className="ticket truncate leading-5 text-snow-600">{children}</span>
      <span className="shrink-0 font-sans text-[12px] leading-5 text-snow-600 rtl:font-sans-ar">
        {t('gifting.optional')}
      </span>
    </label>
  )
}

/** The message card's text, with its limit and a running count. */
function MessageField({ id, value, onChange, compact }) {
  const { lang, t, tc } = useLocale()
  const used = value.length
  const left = Math.max(0, GIFT_MESSAGE_MAX - used)
  const near = left <= NEAR_LIMIT

  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={`${id}-message`}>{t('gifting.message.label')}</FieldLabel>
      <textarea
        id={`${id}-message`}
        // dir="auto" takes the direction of what is typed; empty, the placeholder follows the page.
        dir={value ? 'auto' : undefined}
        rows={compact ? 3 : 4}
        maxLength={GIFT_MESSAGE_MAX}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('gifting.message.placeholder')}
        aria-describedby={`${id}-message-help`}
        className={classNames(FIELD, 'resize-y leading-relaxed')}
      />
      <div className="mt-2 flex items-start justify-between gap-4">
        <p id={`${id}-message-help`} className="font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">
          {tc('gifting.message.help', GIFT_MESSAGE_MAX)}
        </p>
        <p
          aria-hidden="true"
          className={classNames('t-figure shrink-0 text-[12px] leading-snug', near ? 'text-ink-950' : 'text-snow-600')}
        >
          {formatNumber(used, lang)} / {formatNumber(GIFT_MESSAGE_MAX, lang)}
        </p>
      </div>
      <p aria-live="polite" className="sr-only">
        {near ? tc('gifting.message.left', left) : ''}
      </p>
    </div>
  )
}

function FromField({ id, value, onChange }) {
  const { t } = useLocale()
  return (
    <div className="min-w-0">
      <FieldLabel htmlFor={`${id}-from`}>{t('gifting.from.label')}</FieldLabel>
      <input
        id={`${id}-from`}
        type="text"
        dir={value ? 'auto' : undefined}
        autoComplete="name"
        maxLength={FROM_MAX}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t('gifting.from.placeholder')}
        className={FIELD}
      />
    </div>
  )
}

/** A house checkbox: a native one under a square box, with its hint beneath the label. */
function CheckRow({ id, checked, onChange, label, hint }) {
  return (
    <label htmlFor={id} className="group relative flex cursor-pointer items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={classNames(
          'mt-[2px] grid h-[18px] w-[18px] shrink-0 place-items-center border transition-colors duration-300',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-green-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-snow-50',
          checked ? 'border-green-600 bg-green-600 text-snow-50' : 'border-snow-600 bg-snow-50 group-hover:border-ink-950',
        )}
      >
        {checked && <Check className="h-3 w-3" strokeWidth={1.75} />}
      </span>
      <span className="min-w-0">
        <span className="block font-sans text-[15px] leading-snug text-ink-950 rtl:font-sans-ar">{label}</span>
        {hint && (
          <span id={`${id}-hint`} className="mt-0.5 block font-sans text-[13px] leading-snug text-snow-600 rtl:font-sans-ar">
            {hint}
          </span>
        )}
      </span>
    </label>
  )
}

/**
 * The gift: a switch, then — once it is on — the box, the message card and
 * who signs it, a live preview of the card, the packing slip without prices
 * and delivery straight to the recipient. Everything reads and writes
 * useCart().gift, so the cart drawer and checkout always show the same gift.
 *
 * `compact` is the same set of controls condensed for the checkout's review
 * step: boxes three across without their blurbs, the fields beside the card.
 */
export default function GiftPanel({ compact = false }) {
  const { gift, setGift } = useCart()
  const { t } = useLocale()
  // Ids per instance: the drawer and checkout can both hold a panel at once,
  // and their radios must not join one group.
  const id = useId()

  const message = (
    <MessageField id={id} value={gift.message} onChange={(text) => setGift({ message: text })} compact={compact} />
  )
  const from = <FromField id={id} value={gift.from} onChange={(text) => setGift({ from: text })} />
  const preview = <GiftCardPreview message={gift.message} from={gift.from} compact={compact} />
  const checks = (
    <>
      <CheckRow
        id={`${id}-hide-prices`}
        checked={gift.hidePrices}
        onChange={(value) => setGift({ hidePrices: value })}
        label={t('gifting.hidePrices')}
        hint={t('gifting.hidePricesHint')}
      />
      <CheckRow
        id={`${id}-recipient`}
        checked={gift.deliverToRecipient}
        onChange={(value) => setGift({ deliverToRecipient: value })}
        label={t('gifting.toRecipient')}
        hint={t(compact ? 'gifting.toRecipientHintCheckout' : 'gifting.toRecipientHint')}
      />
    </>
  )

  return (
    <div className={compact ? 'space-y-5' : 'space-y-6'}>
      <GiftSwitch id={id} checked={gift.enabled} onChange={(on) => setGift({ enabled: on })} compact={compact} />

      {gift.enabled &&
        (compact ? (
          <div className="animate-fade-in space-y-6">
            <BoxChoice id={id} value={gift.boxId} onChange={(boxId) => setGift({ boxId })} compact />
            <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start">
              <div className="space-y-5">
                {message}
                {from}
              </div>
              {/* Phones see the card on the review itself once this closes. */}
              <div className="hidden sm:block">{preview}</div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">{checks}</div>
          </div>
        ) : (
          <div className="animate-fade-in space-y-7 border-t border-snow-200 pt-6">
            <BoxChoice id={id} value={gift.boxId} onChange={(boxId) => setGift({ boxId })} />
            <div className="space-y-5">
              {message}
              {from}
            </div>
            {preview}
            <div className="space-y-4 border-t border-snow-200 pt-6">{checks}</div>
          </div>
        ))}
    </div>
  )
}
