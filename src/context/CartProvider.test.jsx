import { renderToStaticMarkup } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CartProvider } from './CartProvider'
import { CART_KEY, EMPTY_GIFT, GIFT_KEY, MAX_QTY, useCart } from './cart-context'
import { PRODUCTS_BY_ID } from '../data/products'

/*
 * The provider as a page first sees it: state read from storage, and the
 * functions it hands out. Rendered on the server (no DOM in this test run), so
 * effects do not run and state setters called afterwards change nothing; what
 * an add returns is decided before any of them.
 */

function stubStorage(initial = {}) {
  const map = new Map(Object.entries(initial))
  const localStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  }
  vi.stubGlobal('window', { localStorage })
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

function mountCart() {
  let cart
  function Probe() {
    cart = useCart()
    return null
  }
  renderToStaticMarkup(
    <CartProvider>
      <Probe />
    </CartProvider>,
  )
  return cart
}

const STORED_GIFT = JSON.stringify({
  enabled: true,
  boxId: 'majlis',
  message: 'Eid Mubarak',
  deliverToRecipient: true,
})
const storedLine = (productId, formatId, qty) =>
  JSON.stringify([{ id: `${productId}__${formatId}`, productId, formatId, qty }])

describe('CartProvider: a gift saved beside an empty cart', () => {
  it('starts from the empty gift', () => {
    stubStorage({ [GIFT_KEY]: STORED_GIFT, [CART_KEY]: '[]' })
    const cart = mountCart()
    expect(cart.gift).toEqual(EMPTY_GIFT)
    expect(cart.totals.giftFils).toBe(0)
  })

  it('keeps a gift that still has its order', () => {
    stubStorage({ [GIFT_KEY]: STORED_GIFT, [CART_KEY]: storedLine('oud-noir', 'full', 1) })
    const cart = mountCart()
    expect(cart.gift).toMatchObject({ enabled: true, boxId: 'majlis', deliverToRecipient: true })
    expect(cart.totals.giftFils).toBe(12000)
  })
})

describe('CartProvider: addItem', () => {
  it('reports false when the line already holds MAX_QTY bottles', () => {
    stubStorage({ [CART_KEY]: storedLine('oud-noir', 'full', MAX_QTY) })
    const cart = mountCart()
    expect(cart.addItem(PRODUCTS_BY_ID['oud-noir'], 'full')).toBe(false)
  })

  it('reports true when a bottle goes in', () => {
    stubStorage({ [CART_KEY]: storedLine('oud-noir', 'full', MAX_QTY - 1) })
    const cart = mountCart()
    expect(cart.addItem(PRODUCTS_BY_ID['oud-noir'], 'full')).toBe(true)
    expect(cart.addItem(PRODUCTS_BY_ID['oud-noir'], 'sample')).toBe(true)
  })

  it('reports false for a fragrance or format the catalogue does not sell', () => {
    stubStorage()
    const cart = mountCart()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(cart.addItem({ id: 'no-such-scent' }, 'full')).toBe(false)
    expect(cart.addItem(PRODUCTS_BY_ID['dehn-al-oud'], 'spray50')).toBe(false)
  })
})
