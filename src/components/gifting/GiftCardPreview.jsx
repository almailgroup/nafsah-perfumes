import { useLocale } from '../../i18n/locale-context'
import { classNames } from '../../lib/format'

// Typed by the shopper in either script, whatever the page's language: Jost
// for Latin, Plex for Arabic (Arabic mode's own face already carries Latin).
export const TYPED_FONT = "font-['Jost','IBM_Plex_Sans_Arabic','Futura',system-ui,sans-serif] rtl:font-sans-ar"

/** The house seal in gold: a ring around the eight-point khatim of the mashrabiya. */
export function GiftSeal({ className }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 40 40" className={className}>
      <g fill="none" className="stroke-gold-500" strokeWidth="0.9">
        <circle cx="20" cy="20" r="18.5" />
        <circle cx="20" cy="20" r="15.5" strokeOpacity="0.6" />
        <path d="M13 13h14v14H13z" />
        <path d="M20 10.1l9.9 9.9-9.9 9.9-9.9-9.9z" />
      </g>
      <circle cx="20" cy="20" r="1.6" className="fill-gold-500" />
    </svg>
  )
}

/**
 * The message card as it will sit in the box: paper with the green rule, the
 * gold seal, the message and who it is from. It follows the fields as they
 * are typed. A picture of what the fields already say, so it is hidden from
 * screen readers, which read the fields themselves.
 */
export default function GiftCardPreview({ message = '', from = '', compact = false, className }) {
  const { t } = useLocale()
  const text = message.trim()
  const name = from.trim()
  // The sender's name sits inside the sentence isolated, so an Arabic name in
  // an English line (or the reverse) cannot pull the words around it.
  const [before, after] = t('gifting.preview.from').split('{name}')

  return (
    <div aria-hidden="true" className={classNames('bg-snow-100', compact ? 'p-4' : 'px-5 py-6', className)}>
      <p className="ticket text-snow-600">{t('gifting.preview.label')}</p>
      <div
        className={classNames(
          'relative mt-4 border border-snow-200 bg-snow-50 shadow-[0_24px_48px_-36px_rgba(8,20,15,0.55)]',
          compact ? 'min-h-[9.5rem] px-5 pb-5 pt-6' : 'min-h-[12rem] px-6 pb-6 pt-7',
        )}
      >
        <span className="absolute inset-x-0 top-0 h-[3px] bg-green-600" />
        <GiftSeal className={classNames('absolute end-4 top-4', compact ? 'h-8 w-8' : 'h-10 w-10')} />
        <p className="ticket pe-12 text-green-600">{t('brand')}</p>
        <p
          dir="auto"
          className={classNames(
            'mt-4 whitespace-pre-line break-words leading-relaxed',
            compact ? 'text-[15px]' : 'text-[16px]',
            TYPED_FONT,
            text ? 'text-ink-950' : 'text-snow-600',
          )}
        >
          {text || t('gifting.preview.empty')}
        </p>
        {name && (
          <p className={classNames('mt-4 break-words text-[14px] leading-snug text-snow-600', TYPED_FONT)}>
            {before}
            <bdi>{name}</bdi>
            {after}
          </p>
        )}
      </div>
    </div>
  )
}
