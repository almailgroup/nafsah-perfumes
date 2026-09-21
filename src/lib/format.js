/**
 * The Kuwaiti dinar is a three-decimal currency: 1 KD = 1000 fils. Every price
 * in the catalogue and the cart is therefore stored and shown to three places,
 * and there is no separate "with cents" formatter — 3dp is the only form.
 *
 * "KD" rather than the ISO "KWD" because that is how Kuwaiti retail writes it.
 */
const DINAR = new Intl.NumberFormat('en-KW', {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
})

export const formatPrice = (value) => `KD ${DINAR.format(value)}`

/** Stable identity for a cart line: one fragrance in one size. */
export const lineId = (productId, ml) => `${productId}__${ml}`

export const classNames = (...values) => values.filter(Boolean).join(' ')
