import { createContext, useContext } from 'react'
import { GIFT_BOX_BY_ID, GIFT_MESSAGE_MAX } from '../data/gifting'
import { formatOf, PRODUCTS_BY_ID } from '../data/products'
import { FORMAT_BY_ID } from '../data/taxonomy'
import { shippingFor } from '../lib/delivery'
import { lineId } from '../lib/format'

export const CartContext = createContext(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside a <CartProvider>')
  return context
}

/*
 * The cart's rules, kept outside the provider so they stay pure and testable:
 * what a stored line may be, how a v1 cart becomes a v2 one, and what an
 * order costs. Money is integer fils throughout.
 */

export const CART_KEY = 'nafsah.cart.v2'
export const LEGACY_CART_KEY = 'nafsah.cart.v1'
export const GIFT_KEY = 'nafsah.gift.v1'
export const MAX_QTY = 10

// v1 sold two sizes, keyed by volume.
const LEGACY_FORMATS = { 100: 'full', 50: 'spray50' }

// Own entries only, so a stored id like "constructor" is unknown, not a function.
const own = (table, key) =>
  typeof key === 'string' && Object.hasOwn(table, key) ? table[key] : undefined

export const productById = (id) => own(PRODUCTS_BY_ID, id)

/** A stored quantity as whole bottles, clamped to 1–MAX_QTY; 0 when it is not a quantity at all. */
export function toQty(value) {
  const numeric = typeof value === 'number' || (typeof value === 'string' && value.trim() !== '')
  if (!numeric) return 0
  const whole = Math.floor(Number(value))
  if (!Number.isFinite(whole) || whole < 1) return 0
  return Math.min(MAX_QTY, whole)
}

/**
 * Whatever came out of storage → clean `{ id, productId, formatId, qty }`
 * lines. Unknown fragrances and formats are dropped, ids are recomputed rather
 * than trusted, and two lines for the same item merge into one.
 */
export function sanitizeLines(stored) {
  if (!Array.isArray(stored)) return []
  const merged = new Map()
  for (const entry of stored) {
    if (!entry || typeof entry !== 'object') continue
    const product = productById(entry.productId)
    const formatId = typeof entry.formatId === 'string' ? entry.formatId : null
    if (!product || !formatOf(product, formatId)) continue
    const qty = toQty(entry.qty)
    if (!qty) continue
    const id = lineId(product.id, formatId)
    const before = merged.get(id)?.qty ?? 0
    merged.set(id, { id, productId: product.id, formatId, qty: Math.min(MAX_QTY, before + qty) })
  }
  return [...merged.values()]
}

/** A v1 cart (`{ productId, ml, qty }` lines) in v2 terms: 100 ml → full, 50 ml → spray50. */
export const migrateLegacyCart = (stored) =>
  sanitizeLines(
    Array.isArray(stored)
      ? stored.map((line) => ({
          productId: line?.productId,
          formatId: LEGACY_FORMATS[Number(line?.ml)] ?? null,
          qty: line?.qty,
        }))
      : [],
  )

export const EMPTY_GIFT = Object.freeze({
  enabled: false,
  boxId: 'signature',
  message: '',
  from: '',
  hidePrices: true,
  deliverToRecipient: false,
})

// Cut to length without splitting a surrogate pair in half.
const clip = (text, max) => {
  const cut = text.slice(0, max)
  return /[\uD800-\uDBFF]$/.test(cut) ? cut.slice(0, -1) : cut
}

/** Any stored or patched gift → the contract's shape, with a known box and a message that fits the card. */
export function sanitizeGift(stored) {
  const gift = stored && typeof stored === 'object' ? stored : {}
  return {
    enabled: gift.enabled === true,
    boxId: own(GIFT_BOX_BY_ID, gift.boxId) ? gift.boxId : EMPTY_GIFT.boxId,
    message: typeof gift.message === 'string' ? clip(gift.message, GIFT_MESSAGE_MAX) : '',
    from: typeof gift.from === 'string' ? clip(gift.from, GIFT_MESSAGE_MAX) : '',
    hidePrices: typeof gift.hidePrices === 'boolean' ? gift.hidePrices : EMPTY_GIFT.hidePrices,
    deliverToRecipient: gift.deliverToRecipient === true,
  }
}

/** Stored lines joined to the live catalogue, so a price change never leaves a stale line behind. */
export function detailLines(lines) {
  return lines.flatMap((line) => {
    const product = productById(line.productId)
    const format = formatOf(product, line.formatId)
    if (!product || !format) return []
    return [
      {
        ...line,
        product,
        format,
        unitFils: format.priceFils,
        subtotalFils: format.priceFils * line.qty,
        // Try First: full bottles and tolas travel with a free 2 ml vial of the same scent.
        includesTestVial: Boolean(FORMAT_BY_ID[line.formatId]?.tryFirst),
      },
    ]
  })
}

/**
 * What the order costs. Free delivery is judged on the merchandise subtotal
 * alone; the gift box and the remote-area surcharge are added on top. No
 * sales tax line: Kuwait has not implemented VAT, and its 2026–2030 fiscal
 * plan excludes it before 2028.
 */
export function cartTotals(detailed, gift = EMPTY_GIFT, areaId = null) {
  const count = detailed.reduce((sum, line) => sum + line.qty, 0)
  const subtotalFils = detailed.reduce((sum, line) => sum + line.subtotalFils, 0)
  // An empty cart has nothing to wrap.
  const giftFils = gift.enabled && count > 0 ? (own(GIFT_BOX_BY_ID, gift.boxId)?.priceFils ?? 0) : 0
  const { shippingFils, remoteSurchargeFils, freeShipping, remainingForFreeFils } = shippingFor({
    subtotalFils,
    areaId,
  })
  return {
    count,
    subtotalFils,
    giftFils,
    shippingFils,
    remoteSurchargeFils,
    totalFils: subtotalFils + giftFils + shippingFils + remoteSurchargeFils,
    freeShipping,
    remainingForFreeFils,
  }
}

const sameLines = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/**
 * Lines are stored as the minimum needed to rebuild a cart row
 * ({ id, productId, formatId, qty }); prices, labels and totals are derived
 * from the catalogue at render time.
 */
export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { productId, formatId, qty } = action
      const id = lineId(productId, formatId)
      if (state.some((line) => line.id === id)) {
        return state.map((line) =>
          line.id === id ? { ...line, qty: Math.min(MAX_QTY, line.qty + qty) } : line,
        )
      }
      return [...state, { id, productId, formatId, qty: Math.min(MAX_QTY, qty) }]
    }

    case 'setQty': {
      const value = Number(action.qty)
      if (!Number.isFinite(value)) return state
      if (value < 1) return state.filter((line) => line.id !== action.id)
      const qty = Math.min(MAX_QTY, Math.floor(value))
      return state.map((line) => (line.id === action.id ? { ...line, qty } : line))
    }

    case 'remove':
      return state.filter((line) => line.id !== action.id)

    case 'clear':
      return state.length === 0 ? state : []

    // Another tab changed the saved cart.
    case 'replace':
      return sameLines(state, action.lines) ? state : action.lines

    default:
      return state
  }
}

const parse = (raw) => {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

// localStorage can be missing, blocked or full; the storefront works without it.
const storage = () => {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

/**
 * The saved cart. A v1 cart is migrated once: the v2 copy is written before
 * the v1 key is dropped, so a second read (StrictMode runs initialisers
 * twice) finds the migrated cart rather than nothing.
 */
export function readStoredCart() {
  const store = storage()
  if (!store) return []
  let raw
  let legacy
  try {
    raw = store.getItem(CART_KEY)
    legacy = raw === null ? store.getItem(LEGACY_CART_KEY) : null
  } catch {
    return []
  }
  if (raw !== null) return sanitizeLines(parse(raw))
  if (legacy === null) return []
  const lines = migrateLegacyCart(parse(legacy))
  try {
    store.setItem(CART_KEY, JSON.stringify(lines))
    store.removeItem(LEGACY_CART_KEY)
  } catch {
    // Migrate again next visit rather than lose the cart.
  }
  return lines
}

export function readStoredGift() {
  try {
    return sanitizeGift(parse(storage()?.getItem(GIFT_KEY) ?? null))
  } catch {
    return sanitizeGift(null)
  }
}

/** Parse a raw stored value (e.g. from a 'storage' event) as cart lines or a gift. */
export const parseStoredLines = (raw) => (raw == null ? [] : sanitizeLines(parse(raw)))
export const parseStoredGift = (raw) => sanitizeGift(raw == null ? null : parse(raw))

/** Write only when the value changed, so two tabs echoing each other settle at once. */
export function writeStored(key, value) {
  const store = storage()
  if (!store) return
  try {
    const json = JSON.stringify(value)
    if (store.getItem(key) !== json) store.setItem(key, json)
  } catch {
    // A full or unavailable localStorage should never break the storefront.
  }
}
