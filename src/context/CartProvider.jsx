import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { CartContext } from './cart-context'
import { PRODUCTS_BY_ID } from '../data/products'
import { lineId } from '../lib/format'

const STORAGE_KEY = 'nafsah.cart.v1'
const MAX_QTY = 10
/** Order value above which express shipping is complimentary, in KD. */
export const FREE_SHIPPING_KD = 75

/**
 * Lines are stored as the minimum needed to rebuild a cart row
 * ({ id, productId, ml, price, qty }); everything else is derived from the
 * catalogue at render time so a price change never leaves a stale line behind.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { productId, ml, price, qty = 1 } = action
      const id = lineId(productId, ml)
      const existing = state.find((line) => line.id === id)

      if (existing) {
        return state.map((line) =>
          line.id === id ? { ...line, qty: Math.min(MAX_QTY, line.qty + qty) } : line,
        )
      }

      return [...state, { id, productId, ml, price, qty: Math.min(MAX_QTY, qty) }]
    }

    case 'setQty': {
      if (action.qty <= 0) return state.filter((line) => line.id !== action.id)
      return state.map((line) =>
        line.id === action.id ? { ...line, qty: Math.min(MAX_QTY, action.qty) } : line,
      )
    }

    case 'remove':
      return state.filter((line) => line.id !== action.id)

    case 'clear':
      return []

    default:
      return state
  }
}

function readStoredCart() {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    // Drop anything that no longer matches the live catalogue.
    return parsed.filter(
      (line) =>
        line &&
        PRODUCTS_BY_ID[line.productId]?.sizes.some((size) => size.ml === line.ml) &&
        Number.isFinite(line.qty) &&
        line.qty > 0,
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(reducer, undefined, readStoredCart)
  const [isCartOpen, setCartOpen] = useState(false)
  const [isCheckoutOpen, setCheckoutOpen] = useState(false)
  /** Bumped on every add so the header badge can pulse. */
  const [lastAddedAt, setLastAddedAt] = useState(0)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // A full or unavailable localStorage should never break the storefront.
    }
  }, [lines])

  const addItem = useCallback((product, size, qty = 1) => {
    dispatch({ type: 'add', productId: product.id, ml: size.ml, price: size.price, qty })
    setLastAddedAt(Date.now())
    setCartOpen(true)
  }, [])

  const setQty = useCallback((id, qty) => dispatch({ type: 'setQty', id, qty }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'remove', id }), [])
  const clearCart = useCallback(() => dispatch({ type: 'clear' }), [])

  const openCart = useCallback(() => setCartOpen(true), [])
  const closeCart = useCallback(() => setCartOpen(false), [])
  const closeCheckout = useCallback(() => setCheckoutOpen(false), [])

  const openCheckout = useCallback(() => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }, [])

  const detailedLines = useMemo(
    () =>
      lines
        .map((line) => {
          const product = PRODUCTS_BY_ID[line.productId]
          if (!product) return null
          const size = product.sizes.find((s) => s.ml === line.ml)
          if (!size) return null
          return { ...line, price: size.price, product, subtotal: size.price * line.qty }
        })
        .filter(Boolean),
    [lines],
  )

  const totals = useMemo(() => {
    const subtotal = detailedLines.reduce((sum, line) => sum + line.subtotal, 0)
    const count = detailedLines.reduce((sum, line) => sum + line.qty, 0)
    // Complimentary express shipping above the house threshold, in dinar.
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_KD ? 0 : 5.5
    // No sales tax line: Kuwait has not implemented VAT, and its 2026-2030
    // fiscal plan excludes it before 2028.
    return { subtotal, count, shipping, total: subtotal + shipping }
  }, [detailedLines])

  const value = useMemo(
    () => ({
      lines: detailedLines,
      totals,
      maxQty: MAX_QTY,
      lastAddedAt,
      isCartOpen,
      isCheckoutOpen,
      openCart,
      closeCart,
      closeCheckout,
      openCheckout,
      addItem,
      setQty,
      removeItem,
      clearCart,
    }),
    [
      detailedLines,
      totals,
      lastAddedAt,
      isCartOpen,
      isCheckoutOpen,
      openCart,
      closeCart,
      closeCheckout,
      openCheckout,
      addItem,
      setQty,
      removeItem,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
