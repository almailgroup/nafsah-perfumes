import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import {
  CART_KEY,
  CartContext,
  cartReducer,
  cartTotals,
  detailLines,
  GIFT_KEY,
  MAX_QTY,
  parseStoredGift,
  parseStoredLines,
  productById,
  readStoredCart,
  readStoredGift,
  sanitizeGift,
  toQty,
  writeStored,
} from './cart-context'
import { formatOf } from '../data/products'

const DEV = Boolean(import.meta.env?.DEV)

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, readStoredCart)
  const [gift, setGiftState] = useState(readStoredGift)
  /** The checkout's delivery area; a remote one adds the surcharge to the totals. */
  const [deliveryAreaId, setAreaState] = useState(null)
  const [isCartOpen, setCartOpen] = useState(false)
  /** Which part of the drawer to bring forward when it opens ('gift', or null). */
  const [cartSection, setCartSection] = useState(null)
  const [isCheckoutOpen, setCheckoutOpen] = useState(false)
  /** Bumped on every add so the header badge can pulse. */
  const [lastAddedAt, setLastAddedAt] = useState(0)

  useEffect(() => writeStored(CART_KEY, lines), [lines])
  useEffect(() => writeStored(GIFT_KEY, gift), [gift])

  // Keep every open tab on the same cart. Without this, a cart emptied by a
  // finished checkout in one tab is written back by the next change in another.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.storageArea && event.storageArea !== window.localStorage) return
      // key === null: the whole store was cleared.
      if (event.key === CART_KEY || event.key === null) {
        dispatch({ type: 'replace', lines: parseStoredLines(event.key === null ? null : event.newValue) })
      }
      if (event.key === GIFT_KEY || event.key === null) {
        const next = parseStoredGift(event.key === null ? null : event.newValue)
        setGiftState((current) => (JSON.stringify(current) === JSON.stringify(next) ? current : next))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  /**
   * addItem(product, formatId, { qty = 1, gift = false }). `gift: true` also
   * switches gift mode on and opens the drawer on its gift panel.
   */
  const addItem = useCallback((product, formatId, { qty = 1, gift: asGift = false } = {}) => {
    const known = productById(product?.id)
    if (!known || !formatOf(known, formatId)) {
      if (DEV) console.warn(`[cart] ${product?.id} has no format "${formatId}"`)
      return
    }
    dispatch({ type: 'add', productId: known.id, formatId, qty: toQty(qty) || 1 })
    setLastAddedAt(Date.now())
    if (asGift) setGiftState((current) => sanitizeGift({ ...current, enabled: true }))
    setCartSection(asGift ? 'gift' : null)
    setCartOpen(true)
  }, [])

  const setQty = useCallback((id, qty) => dispatch({ type: 'setQty', id, qty }), [])
  const removeItem = useCallback((id) => dispatch({ type: 'remove', id }), [])

  /** Empties the order: its lines and its gift details, which belong to that order. */
  const clearCart = useCallback(() => {
    dispatch({ type: 'clear' })
    setGiftState(sanitizeGift(null))
  }, [])

  /** setGift(patch) merges; a function patch receives the current gift. */
  const setGift = useCallback(
    (patch) =>
      setGiftState((current) =>
        sanitizeGift({ ...current, ...(typeof patch === 'function' ? patch(current) : patch) }),
      ),
    [],
  )

  const setDeliveryAreaId = useCallback(
    (areaId) => setAreaState(typeof areaId === 'string' && areaId !== '' ? areaId : null),
    [],
  )

  // Also used directly as an onClick handler, so the argument may be an event.
  const openCart = useCallback((options) => {
    setCartSection(typeof options?.section === 'string' ? options.section : null)
    setCartOpen(true)
  }, [])
  const closeCart = useCallback(() => setCartOpen(false), [])

  const openCheckout = useCallback(() => {
    setCartOpen(false)
    setCheckoutOpen(true)
  }, [])
  const closeCheckout = useCallback(() => setCheckoutOpen(false), [])

  const detailed = useMemo(() => detailLines(lines), [lines])
  const totals = useMemo(() => cartTotals(detailed, gift, deliveryAreaId), [detailed, gift, deliveryAreaId])

  const value = useMemo(
    () => ({
      lines: detailed,
      totals,
      maxQty: MAX_QTY,
      addItem,
      setQty,
      removeItem,
      clearCart,
      gift,
      setGift,
      deliveryAreaId,
      setDeliveryAreaId,
      isCartOpen,
      openCart,
      closeCart,
      cartSection,
      isCheckoutOpen,
      openCheckout,
      closeCheckout,
      lastAddedAt,
    }),
    [
      detailed,
      totals,
      addItem,
      setQty,
      removeItem,
      clearCart,
      gift,
      setGift,
      deliveryAreaId,
      setDeliveryAreaId,
      isCartOpen,
      openCart,
      closeCart,
      cartSection,
      isCheckoutOpen,
      openCheckout,
      closeCheckout,
      lastAddedAt,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

