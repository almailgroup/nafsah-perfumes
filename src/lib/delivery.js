/**
 * The delivery promise and the delivery fee, worked out on Kuwait time.
 *
 * Pure: nothing here reads the clock itself. Every function takes `now`, so
 * the badge can tick and the tests can stand on a fixed Thursday afternoon.
 * The visitor's own time zone never matters — a shopper in London at 23:30
 * is already ordering on tomorrow's date in Kuwait.
 */
import {
  FREE_SHIPPING_FILS,
  KUWAIT_TZ,
  NO_DELIVERY_WEEKDAYS,
  REMOTE_EXTRA_DAYS,
  REMOTE_SURCHARGE_FILS,
  RETURN_WINDOW_DAYS,
  SAME_DAY_CUTOFF_HOUR,
  SHIPPING_FILS,
} from '../data/delivery'
import { isRemoteArea } from '../data/kuwait'
import { formatNumber, formatPrice } from './format'

const WEEKDAY = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
const DAY_MS = 24 * 60 * 60 * 1000

let clockFormat
const kuwaitFormat = () =>
  (clockFormat ??= new Intl.DateTimeFormat('en-US', {
    timeZone: KUWAIT_TZ,
    hourCycle: 'h23',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }))

// A bad `now` must not take the page down with it; it means "now".
const toDate = (now) => {
  const date = now instanceof Date ? now : new Date(now ?? Date.now())
  return Number.isNaN(date.getTime()) ? new Date() : date
}

/** The wall clock in Kuwait: { dateISO: 'YYYY-MM-DD', weekday: 0 (Sun)–6, hour, minute }. */
export function kuwaitClock(now = new Date()) {
  const parts = Object.fromEntries(
    kuwaitFormat()
      .formatToParts(toDate(now))
      .map(({ type, value }) => [type, value]),
  )
  return {
    dateISO: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: WEEKDAY[parts.weekday],
    // Some engines still say 24 for midnight even with h23.
    hour: Number(parts.hour) % 24,
    minute: Number(parts.minute),
  }
}

export const isDeliveryDay = (weekday) => !NO_DELIVERY_WEEKDAYS.includes(weekday)

// Calendar arithmetic on a plain date, in UTC so no local offset can shift it.
const addDays = (dateISO, days) =>
  new Date(Date.parse(`${dateISO}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10)

/**
 * When an order placed at `now` arrives.
 *
 *   same-day  today is a delivery day and it is before the cut-off
 *   next-day  the first delivery day after today is tomorrow
 *   later     a rest day sits in between (Thursday evening → Saturday)
 *   remote    remote areas: the next-day promise plus REMOTE_EXTRA_DAYS
 *             delivery days, never same-day
 *
 * → { type, dateISO, daysAway, minutesToCutoff (same-day only, else null), remote }
 */
export function deliveryPromise({ now = new Date(), areaId = null } = {}) {
  const clock = kuwaitClock(now)
  const remote = isRemoteArea(areaId)
  const deliversOn = (offset) => isDeliveryDay((clock.weekday + offset) % 7)

  if (!remote && deliversOn(0) && clock.hour < SAME_DAY_CUTOFF_HOUR) {
    return {
      type: 'same-day',
      dateISO: clock.dateISO,
      daysAway: 0,
      minutesToCutoff: SAME_DAY_CUTOFF_HOUR * 60 - (clock.hour * 60 + clock.minute),
      remote: false,
    }
  }

  // The first delivery day strictly after `offset`. A week always has one
  // unless every day is switched off, which the bound stops from spinning.
  const nextAfter = (offset) => {
    let day = offset + 1
    while (!deliversOn(day) && day < offset + 7) day += 1
    return day
  }

  let daysAway = nextAfter(0)
  if (remote) for (let i = 0; i < REMOTE_EXTRA_DAYS; i += 1) daysAway = nextAfter(daysAway)

  return {
    type: remote ? 'remote' : daysAway === 1 ? 'next-day' : 'later',
    dateISO: addDays(clock.dateISO, daysAway),
    daysAway,
    minutesToCutoff: null,
    remote,
  }
}

/**
 * What delivery costs for a merchandise subtotal (fils) and area.
 * Free from FREE_SHIPPING_FILS upwards (subtotal >= threshold, so copy says
 * "from" or "of … or more", not "over"). The remote surcharge applies even
 * when delivery is free. An empty cart costs nothing.
 *
 * → { shippingFils, remoteSurchargeFils, freeShipping, remainingForFreeFils }
 */
export function shippingFor({ subtotalFils = 0, areaId = null } = {}) {
  const subtotal = Number.isFinite(subtotalFils) ? Math.max(0, subtotalFils) : 0
  if (subtotal === 0) {
    return {
      shippingFils: 0,
      remoteSurchargeFils: 0,
      freeShipping: false,
      remainingForFreeFils: FREE_SHIPPING_FILS,
    }
  }
  const freeShipping = subtotal >= FREE_SHIPPING_FILS
  return {
    shippingFils: freeShipping ? 0 : SHIPPING_FILS,
    remoteSurchargeFils: isRemoteArea(areaId) ? REMOTE_SURCHARGE_FILS : 0,
    freeShipping,
    remainingForFreeFils: freeShipping ? 0 : FREE_SHIPPING_FILS - subtotal,
  }
}

/**
 * The policy figures, formatted for copy: pass straight to t() so the
 * announcement bar, trust badges and help pages quote the same numbers as
 * the cart. {threshold} {shipping} {surcharge} {cutoff} {returnDays} {remoteDays}
 */
export const deliveryVars = (lang = 'en') => ({
  threshold: formatPrice(FREE_SHIPPING_FILS, lang),
  shipping: formatPrice(SHIPPING_FILS, lang),
  surcharge: formatPrice(REMOTE_SURCHARGE_FILS, lang),
  cutoff: `${formatNumber(SAME_DAY_CUTOFF_HOUR, lang, { minimumIntegerDigits: 2 })}:${formatNumber(0, lang, { minimumIntegerDigits: 2 })}`,
  returnDays: formatNumber(RETURN_WINDOW_DAYS, lang),
  remoteDays: formatNumber(REMOTE_EXTRA_DAYS, lang),
})
