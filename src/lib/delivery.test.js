import { describe, expect, it } from 'vitest'
import {
  FREE_SHIPPING_FILS,
  NO_DELIVERY_WEEKDAYS,
  REMOTE_EXTRA_DAYS,
  REMOTE_SURCHARGE_FILS,
  SAME_DAY_CUTOFF_HOUR,
  SHIPPING_FILS,
} from '../data/delivery'
import { deliveryPromise, deliveryVars, isDeliveryDay, kuwaitClock, shippingFor } from './delivery'

// Kuwait is UTC+3 all year: 10:00 in Kuwait is 07:00Z. October 2026:
// Sun 11, Mon 12, Tue 13, Wed 14, Thu 15, Fri 16, Sat 17, Sun 18.
const kw = (date, time) => new Date(`${date}T${time}:00+03:00`)
const SUN_10 = kw('2026-10-11', '10:00')
const SUN_15 = kw('2026-10-11', '15:00')
const THU_10 = kw('2026-10-15', '10:00')
const THU_15 = kw('2026-10-15', '15:00')
const FRI_10 = kw('2026-10-16', '10:00')
const SAT_10 = kw('2026-10-17', '10:00')

const weekdayOf = (dateISO) => new Date(`${dateISO}T00:00:00Z`).getUTCDay()

describe('policy constants', () => {
  it('match the contract', () => {
    expect(SAME_DAY_CUTOFF_HOUR).toBe(14)
    expect(NO_DELIVERY_WEEKDAYS).toEqual([5])
    expect(SHIPPING_FILS).toBe(5500)
    expect(FREE_SHIPPING_FILS).toBe(75000)
    expect(REMOTE_SURCHARGE_FILS).toBe(2000)
    expect(REMOTE_EXTRA_DAYS).toBe(1)
  })
})

describe('kuwaitClock', () => {
  it('reads the wall clock in Kuwait', () => {
    expect(kuwaitClock(SUN_10)).toEqual({ dateISO: '2026-10-11', weekday: 0, hour: 10, minute: 0 })
    expect(kuwaitClock(FRI_10).weekday).toBe(5)
  })

  it('is already tomorrow in Kuwait late in the UTC evening', () => {
    expect(kuwaitClock(new Date('2026-10-14T22:30:00Z'))).toEqual({
      dateISO: '2026-10-15',
      weekday: 4,
      hour: 1,
      minute: 30,
    })
  })

  it('reports midnight as hour 0', () => {
    expect(kuwaitClock(kw('2026-10-12', '00:05'))).toMatchObject({ hour: 0, minute: 5 })
  })

  it('accepts a timestamp', () => {
    expect(kuwaitClock(SUN_10.getTime())).toEqual(kuwaitClock(SUN_10))
  })

  it('treats an invalid instant as now rather than throwing', () => {
    expect(() => kuwaitClock(new Date('nope'))).not.toThrow()
    expect(kuwaitClock('nope').dateISO).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('deliveryPromise — non-remote', () => {
  it('Sunday 10:00 → same day, four hours to the cut-off', () => {
    expect(deliveryPromise({ now: SUN_10 })).toEqual({
      type: 'same-day',
      dateISO: '2026-10-11',
      daysAway: 0,
      minutesToCutoff: 240,
      remote: false,
    })
  })

  it('Sunday 15:00 → next day', () => {
    expect(deliveryPromise({ now: SUN_15 })).toEqual({
      type: 'next-day',
      dateISO: '2026-10-12',
      daysAway: 1,
      minutesToCutoff: null,
      remote: false,
    })
  })

  it('Thursday 15:00 → Saturday, skipping Friday', () => {
    expect(deliveryPromise({ now: THU_15 })).toEqual({
      type: 'later',
      dateISO: '2026-10-17',
      daysAway: 2,
      minutesToCutoff: null,
      remote: false,
    })
  })

  it('Friday 10:00 → Saturday, never the same Friday', () => {
    expect(deliveryPromise({ now: FRI_10 })).toMatchObject({
      type: 'next-day',
      dateISO: '2026-10-17',
      daysAway: 1,
      minutesToCutoff: null,
    })
  })

  it('Saturday is a delivery day', () => {
    expect(deliveryPromise({ now: SAT_10 })).toMatchObject({ type: 'same-day', dateISO: '2026-10-17' })
  })

  it('switches exactly at the cut-off', () => {
    expect(deliveryPromise({ now: kw('2026-10-12', '13:59') })).toMatchObject({
      type: 'same-day',
      minutesToCutoff: 1,
    })
    expect(deliveryPromise({ now: kw('2026-10-12', '14:00') })).toMatchObject({
      type: 'next-day',
      dateISO: '2026-10-13',
    })
  })

  it('uses the Kuwait date for a UTC instant that is already tomorrow there', () => {
    // 22:30Z on Wednesday is 01:30 on Thursday in Kuwait.
    expect(deliveryPromise({ now: new Date('2026-10-14T22:30:00Z') })).toEqual({
      type: 'same-day',
      dateISO: '2026-10-15',
      daysAway: 0,
      minutesToCutoff: 750,
      remote: false,
    })
  })

  it('crosses a year end', () => {
    // Thursday 31 December 2026, after the cut-off → Saturday 2 January 2027.
    expect(deliveryPromise({ now: kw('2026-12-31', '16:00') })).toMatchObject({
      type: 'later',
      dateISO: '2027-01-02',
      daysAway: 2,
    })
  })

  it('treats an unknown area as non-remote', () => {
    expect(deliveryPromise({ now: SUN_10, areaId: 'other' }).type).toBe('same-day')
    expect(deliveryPromise({ now: SUN_10, areaId: 'salmiya' }).type).toBe('same-day')
  })
})

describe('deliveryPromise — remote', () => {
  it('Sunday 10:00 in Al Khiran → never same day; the next-day promise plus REMOTE_EXTRA_DAYS', () => {
    const local = deliveryPromise({ now: SUN_10 })
    const remote = deliveryPromise({ now: SUN_10, areaId: 'khiran' })
    expect(remote).toEqual({
      type: 'remote',
      dateISO: '2026-10-13',
      daysAway: 1 + REMOTE_EXTRA_DAYS,
      minutesToCutoff: null,
      remote: true,
    })
    expect(remote.daysAway).toBeGreaterThan(local.daysAway)
  })

  it('Sunday 15:00 in Al Wafra → REMOTE_EXTRA_DAYS after the non-remote next-day promise', () => {
    const local = deliveryPromise({ now: SUN_15 })
    const remote = deliveryPromise({ now: SUN_15, areaId: 'wafra' })
    expect(remote.daysAway - local.daysAway).toBe(REMOTE_EXTRA_DAYS)
    expect(remote).toMatchObject({ type: 'remote', dateISO: '2026-10-13' })
  })

  it('skips Friday for remote areas too', () => {
    // Thursday → next-day promise Saturday → one more delivery day: Sunday.
    expect(deliveryPromise({ now: THU_10, areaId: 'sabah-al-ahmad' })).toMatchObject({
      type: 'remote',
      dateISO: '2026-10-18',
      daysAway: 3,
    })
    // Wednesday evening → Thursday → Friday rests → Saturday.
    expect(deliveryPromise({ now: kw('2026-10-14', '18:00'), areaId: 'mutlaa' })).toMatchObject({
      dateISO: '2026-10-17',
    })
  })
})

describe('deliveryPromise — invariants over a fortnight, hour by hour', () => {
  const start = kw('2026-10-11', '00:00').getTime()
  const instants = Array.from({ length: 14 * 24 }, (_, h) => new Date(start + h * 3_600_000 + 17 * 60_000))

  it('never promises a rest day, and remote is always later and never same-day', () => {
    for (const now of instants) {
      const local = deliveryPromise({ now })
      const remote = deliveryPromise({ now, areaId: 'subiya' })
      expect(isDeliveryDay(weekdayOf(local.dateISO))).toBe(true)
      expect(isDeliveryDay(weekdayOf(remote.dateISO))).toBe(true)
      expect(remote.type).toBe('remote')
      expect(remote.minutesToCutoff).toBeNull()
      expect(remote.daysAway).toBeGreaterThan(local.daysAway)
      expect(local.daysAway).toBeLessThanOrEqual(2)
      if (local.type === 'same-day') {
        expect(local.minutesToCutoff).toBeGreaterThan(0)
        expect(local.minutesToCutoff).toBeLessThanOrEqual(SAME_DAY_CUTOFF_HOUR * 60)
      } else {
        expect(local.minutesToCutoff).toBeNull()
      }
    }
  })
})

describe('shippingFor', () => {
  it('charges the flat fee below the threshold and says how far is left', () => {
    expect(shippingFor({ subtotalFils: 29000 })).toEqual({
      shippingFils: SHIPPING_FILS,
      remoteSurchargeFils: 0,
      freeShipping: false,
      remainingForFreeFils: 46000,
    })
    expect(shippingFor({ subtotalFils: 74999 })).toMatchObject({
      shippingFils: 5500,
      freeShipping: false,
      remainingForFreeFils: 1,
    })
  })

  it('is free from exactly KWD 75.000 (subtotal >= threshold)', () => {
    expect(shippingFor({ subtotalFils: 75000 })).toEqual({
      shippingFils: 0,
      remoteSurchargeFils: 0,
      freeShipping: true,
      remainingForFreeFils: 0,
    })
    expect(shippingFor({ subtotalFils: 119000 }).freeShipping).toBe(true)
  })

  it('always adds the remote surcharge, even when delivery is free', () => {
    expect(shippingFor({ subtotalFils: 29000, areaId: 'khiran' })).toMatchObject({
      shippingFils: 5500,
      remoteSurchargeFils: 2000,
    })
    expect(shippingFor({ subtotalFils: 119000, areaId: 'failaka' })).toMatchObject({
      shippingFils: 0,
      remoteSurchargeFils: REMOTE_SURCHARGE_FILS,
      freeShipping: true,
    })
    expect(shippingFor({ subtotalFils: 29000, areaId: 'salmiya' }).remoteSurchargeFils).toBe(0)
  })

  it('costs nothing for an empty or invalid cart', () => {
    const empty = {
      shippingFils: 0,
      remoteSurchargeFils: 0,
      freeShipping: false,
      remainingForFreeFils: FREE_SHIPPING_FILS,
    }
    expect(shippingFor({ subtotalFils: 0, areaId: 'khiran' })).toEqual(empty)
    expect(shippingFor({ subtotalFils: NaN })).toEqual(empty)
    expect(shippingFor({ subtotalFils: -5 })).toEqual(empty)
    expect(shippingFor()).toEqual(empty)
  })
})

describe('deliveryVars', () => {
  it('formats the policy for copy in both languages', () => {
    expect(deliveryVars('en')).toEqual({
      threshold: 'KWD 75.000',
      shipping: 'KWD 5.500',
      surcharge: 'KWD 2.000',
      cutoff: '14:00',
      returnDays: '30',
      remoteDays: '1',
    })
    expect(deliveryVars('ar')).toEqual({
      threshold: 'د.ك. ٧٥٫٠٠٠',
      shipping: 'د.ك. ٥٫٥٠٠',
      surcharge: 'د.ك. ٢٫٠٠٠',
      cutoff: '١٤:٠٠',
      returnDays: '٣٠',
      remoteDays: '١',
    })
  })
})
