import { useEffect, useState } from 'react'
import { Clock, Truck } from 'lucide-react'
import { REMOTE_SURCHARGE_FILS } from '../../data/delivery'
import { AREA_BY_ID, AREAS } from '../../data/kuwait'
import { useLocale } from '../../i18n/locale-context'
import { deliveryPromise } from '../../lib/delivery'
import { formatPrice, formatWeekday } from '../../lib/format'

const MINUTE = 60 * 1000

// Any remote area stands in for all of them in the general note.
const A_REMOTE_AREA = AREAS.find((area) => area.remote)?.id ?? null

/** The current time, refreshed on each minute boundary and when the tab comes back. */
function useMinuteClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const tick = () => setNow(new Date())
    let interval = null
    // Kuwait is a whole number of hours from UTC, so its minutes turn when UTC's do.
    const align = setTimeout(() => {
      tick()
      interval = setInterval(tick, MINUTE)
    }, MINUTE - (Date.now() % MINUTE))
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearTimeout(align)
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  return now
}

/**
 * When an order placed now arrives, on Kuwait time: same-day with a countdown
 * to the 2 PM cut-off, tomorrow, or the next delivery day after the Friday
 * rest. `compact` is one line for cards and the cart; `inline` adds the
 * outlying-area terms underneath.
 */
export default function DeliveryBadge({ areaId = null, variant = 'inline' }) {
  const { lang, t, tc, tr } = useLocale()
  const now = useMinuteClock()
  const promise = deliveryPromise({ now, areaId })
  const day = formatWeekday(promise.dateISO, lang)
  const fee = formatPrice(REMOTE_SURCHARGE_FILS, lang)

  let headline
  if (promise.type === 'same-day') {
    const h = Math.floor(promise.minutesToCutoff / 60)
    const m = promise.minutesToCutoff % 60
    const hours = h > 0 ? tc('delivery.hours', h) : ''
    const minutes = m > 0 ? tc('delivery.minutes', m) : ''
    const time = hours && minutes ? t('delivery.hoursMinutes', { hours, minutes }) : hours || minutes
    headline = t('delivery.sameDay', { time })
  } else if (promise.type === 'remote') {
    headline = t('delivery.remote', { area: tr(AREA_BY_ID[areaId]), day })
  } else if (promise.type === 'next-day') {
    headline = t('delivery.nextDay')
  } else {
    headline = t('delivery.later', { day })
  }

  const Icon = promise.type === 'same-day' ? Clock : Truck

  if (variant === 'compact') {
    return (
      <p className="flex items-start gap-2 font-sans text-[13px] font-normal leading-snug text-ink-950 rtl:font-sans-ar">
        <Icon aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-600" strokeWidth={1.5} />
        <span>{headline}</span>
      </p>
    )
  }

  // The terms for outlying areas: their own fee once one is chosen, else the general note.
  const detail = promise.remote
    ? t('delivery.remoteFee', { fee })
    : tc('delivery.remoteNote', deliveryPromise({ now, areaId: A_REMOTE_AREA }).daysAway, { fee })

  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={1.5} />
      <div className="min-w-0">
        <p className="font-sans text-[14px] font-medium leading-snug text-ink-950 rtl:font-sans-ar">{headline}</p>
        <p className="mt-1 font-sans text-[13px] font-normal leading-snug text-snow-600 rtl:font-sans-ar">
          {detail}
        </p>
      </div>
    </div>
  )
}
