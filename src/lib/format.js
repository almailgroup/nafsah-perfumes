export const formatPrice = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)

export const formatPriceWithCents = (value) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

/** Stable identity for a cart line: one fragrance in one size. */
export const lineId = (productId, ml) => `${productId}__${ml}`

export const classNames = (...values) => values.filter(Boolean).join(' ')
