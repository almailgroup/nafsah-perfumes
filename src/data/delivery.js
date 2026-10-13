/**
 * Delivery policy. Every figure here is a placeholder the owner tunes; the
 * badge, the cart, checkout and the help pages all read them from this one
 * file, so changing a number here changes the promise everywhere at once.
 *
 * Money is in integer fils (1 KWD = 1000 fils).
 */

/** Kuwait keeps UTC+3 all year, with no daylight saving. */
export const KUWAIT_TZ = 'Asia/Kuwait'

/** Orders placed before 2 PM Kuwait time go out the same day. */
export const SAME_DAY_CUTOFF_HOUR = 14

/** Weekdays without delivery, 0 = Sunday … 6 = Saturday. Friday rests. */
export const NO_DELIVERY_WEEKDAYS = [5]

/** Flat delivery fee inside Kuwait, below the free-delivery threshold. */
export const SHIPPING_FILS = 5500

/** Delivery is free from this merchandise subtotal upwards (subtotal >= threshold). */
export const FREE_SHIPPING_FILS = 75000

/** Added for remote areas, whether or not delivery itself is free. */
export const REMOTE_SURCHARGE_FILS = 2000

/** Remote areas: the next-day promise plus this many delivery days. Never same-day. */
export const REMOTE_EXTRA_DAYS = 1

/** Try First returns on sealed bottles. */
export const RETURN_WINDOW_DAYS = 30
