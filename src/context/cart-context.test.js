import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CART_KEY,
  cartReducer,
  cartTotals,
  detailLines,
  EMPTY_GIFT,
  GIFT_KEY,
  giftForCart,
  isLineFull,
  LEGACY_CART_KEY,
  MAX_QTY,
  migrateLegacyCart,
  parseStoredGift,
  parseStoredLines,
  readStoredCart,
  readStoredGift,
  sanitizeGift,
  sanitizeLines,
  toQty,
  writeStored,
} from './cart-context'
import { FREE_SHIPPING_FILS, REMOTE_SURCHARGE_FILS, SHIPPING_FILS } from '../data/delivery'
import { GIFT_BOX_BY_ID, GIFT_MESSAGE_MAX } from '../data/gifting'
import { PRODUCTS_BY_ID } from '../data/products'

const line = (productId, formatId, qty = 1) => ({ id: `${productId}__${formatId}`, productId, formatId, qty })

/** A Map-backed localStorage on a stub window. */
function stubStorage(initial = {}) {
  const map = new Map(Object.entries(initial))
  const localStorage = {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
  }
  vi.stubGlobal('window', { localStorage })
  return map
}

afterEach(() => vi.unstubAllGlobals())

describe('toQty', () => {
  it('keeps whole quantities from 1 to MAX_QTY', () => {
    expect(toQty(1)).toBe(1)
    expect(toQty(MAX_QTY)).toBe(MAX_QTY)
    expect(toQty('3')).toBe(3)
  })

  it('truncates fractions and clamps to MAX_QTY', () => {
    expect(toQty(2.7)).toBe(2)
    expect(toQty(50)).toBe(MAX_QTY)
  })

  it('rejects anything that is not a quantity', () => {
    for (const bad of [0, 0.5, -1, Number.NaN, Infinity, '', ' ', 'two', null, undefined, true, {}, []]) {
      expect(toQty(bad), String(bad)).toBe(0)
    }
  })
})

describe('sanitizeLines', () => {
  it('rebuilds clean lines and recomputes their ids', () => {
    expect(sanitizeLines([{ id: 'whatever', productId: 'oud-noir', formatId: 'spray50', qty: 2, price: 1 }])).toEqual([
      line('oud-noir', 'spray50', 2),
    ])
  })

  it('drops unknown fragrances, formats a fragrance is not sold in, and bad quantities', () => {
    expect(
      sanitizeLines([
        { productId: 'no-such-scent', formatId: 'full', qty: 1 },
        { productId: 'dehn-al-oud', formatId: 'full', qty: 1 }, // an oil has no spray bottle
        { productId: 'oud-noir', formatId: 'tola', qty: 1 },
        { productId: 'oud-noir', formatId: 'full', qty: 0 },
        { productId: 'constructor', formatId: 'full', qty: 1 },
        { productId: 'oud-noir', formatId: 'constructor', qty: 1 },
        null,
        'oud-noir',
        { productId: 'dehn-al-oud', formatId: 'tola', qty: 1 },
      ]),
    ).toEqual([line('dehn-al-oud', 'tola', 1)])
  })

  it('merges duplicates into one line, capped at MAX_QTY', () => {
    expect(
      sanitizeLines([
        line('oud-noir', 'full', 4),
        line('musc-blanc', 'sample', 1),
        { ...line('oud-noir', 'full', 9), id: 'stale' },
      ]),
    ).toEqual([line('oud-noir', 'full', MAX_QTY), line('musc-blanc', 'sample', 1)])
  })

  it('reads anything that is not a list as an empty cart', () => {
    for (const bad of [null, undefined, {}, 'x', 3]) expect(sanitizeLines(bad)).toEqual([])
    expect(parseStoredLines('{not json')).toEqual([])
    expect(parseStoredLines(null)).toEqual([])
  })
})

describe('the v1 → v2 migration', () => {
  const V1 = [{ id: 'oud-noir__100', productId: 'oud-noir', ml: 100, price: 119, qty: 2 }]

  it('maps 100 ml to the full bottle and 50 ml to the 50 ml spray', () => {
    expect(migrateLegacyCart(V1)).toEqual([line('oud-noir', 'full', 2)])
    expect(migrateLegacyCart([{ productId: 'musc-blanc', ml: 50, qty: 1 }])).toEqual([
      line('musc-blanc', 'spray50', 1),
    ])
  })

  it('drops sizes v2 no longer sells and qty it would not accept', () => {
    expect(
      migrateLegacyCart([
        { productId: 'oud-noir', ml: 30, qty: 1 },
        { productId: 'oud-noir', ml: '100', qty: 99 },
      ]),
    ).toEqual([line('oud-noir', 'full', MAX_QTY)])
  })

  it('runs once: writes the v2 cart, removes v1, and reads the same cart again', () => {
    const store = stubStorage({ [LEGACY_CART_KEY]: JSON.stringify(V1) })
    expect(readStoredCart()).toEqual([line('oud-noir', 'full', 2)])
    expect(store.has(LEGACY_CART_KEY)).toBe(false)
    expect(JSON.parse(store.get(CART_KEY))).toEqual([line('oud-noir', 'full', 2)])
    // StrictMode calls the reducer initialiser twice.
    expect(readStoredCart()).toEqual([line('oud-noir', 'full', 2)])
  })

  it('ignores a leftover v1 cart once a v2 cart exists', () => {
    stubStorage({ [CART_KEY]: JSON.stringify([line('musc-blanc', 'sample')]), [LEGACY_CART_KEY]: JSON.stringify(V1) })
    expect(readStoredCart()).toEqual([line('musc-blanc', 'sample')])
  })

  it('survives a corrupt store or no storage at all', () => {
    stubStorage({ [CART_KEY]: '[{"productId":' })
    expect(readStoredCart()).toEqual([])
    vi.unstubAllGlobals()
    expect(readStoredCart()).toEqual([])
  })
})

describe('writeStored', () => {
  it('writes only when the value changed', () => {
    const store = stubStorage()
    const setItem = vi.spyOn(window.localStorage, 'setItem')
    writeStored(CART_KEY, [line('oud-noir', 'full')])
    writeStored(CART_KEY, [line('oud-noir', 'full')])
    expect(setItem).toHaveBeenCalledTimes(1)
    expect(store.get(CART_KEY)).toBe(JSON.stringify([line('oud-noir', 'full')]))
  })
})

describe('sanitizeGift', () => {
  it('starts from the empty gift', () => {
    expect(sanitizeGift(null)).toEqual(EMPTY_GIFT)
    expect(parseStoredGift('nonsense')).toEqual(EMPTY_GIFT)
  })

  it('keeps a known box and falls back to the signature box otherwise', () => {
    expect(sanitizeGift({ boxId: 'sadu' }).boxId).toBe('sadu')
    expect(sanitizeGift({ boxId: 'gold-bar' }).boxId).toBe('signature')
    expect(sanitizeGift({ boxId: 'constructor' }).boxId).toBe('signature')
  })

  it('cuts the message to the card and keeps only the contract fields', () => {
    const gift = sanitizeGift({ enabled: true, message: 'x'.repeat(500), extra: 1, hidePrices: false })
    expect(gift.message).toHaveLength(GIFT_MESSAGE_MAX)
    expect(Object.keys(gift).sort()).toEqual(Object.keys(EMPTY_GIFT).sort())
    expect(gift.hidePrices).toBe(false)
    expect(gift.enabled).toBe(true)
  })

  it('never splits an emoji in half', () => {
    const message = `${'x'.repeat(GIFT_MESSAGE_MAX - 1)}🌹`
    expect(sanitizeGift({ message }).message).toBe('x'.repeat(GIFT_MESSAGE_MAX - 1))
  })

  it('reads the stored gift', () => {
    stubStorage({ [GIFT_KEY]: JSON.stringify({ enabled: true, boxId: 'majlis', message: 'Eid Mubarak' }) })
    expect(readStoredGift()).toMatchObject({ enabled: true, boxId: 'majlis', message: 'Eid Mubarak' })
  })
})

describe('detailLines', () => {
  it('joins lines to the live catalogue in fils', () => {
    const [full] = detailLines([line('oud-noir', 'full', 2)])
    const price = PRODUCTS_BY_ID['oud-noir'].formats.find((f) => f.id === 'full').priceFils
    expect(full.product).toBe(PRODUCTS_BY_ID['oud-noir'])
    expect(full.format.id).toBe('full')
    expect(full.unitFils).toBe(price)
    expect(full.subtotalFils).toBe(price * 2)
  })

  it('marks Try First formats as travelling with a test vial', () => {
    const vial = (formatId, productId = 'oud-noir') => detailLines([line(productId, formatId)])[0].includesTestVial
    expect(vial('full')).toBe(true)
    expect(vial('spray50')).toBe(true)
    expect(vial('tola', 'dehn-al-oud')).toBe(true)
    expect(vial('quarter-tola')).toBe(false)
    expect(vial('sample')).toBe(false)
  })

  it('skips lines the catalogue no longer has', () => {
    expect(detailLines([line('gone', 'full')])).toEqual([])
  })
})

describe('cartTotals', () => {
  const lines = (...entries) => detailLines(entries.map((args) => line(...args)))

  it('charges delivery below the threshold and nothing from it upwards', () => {
    const small = cartTotals(lines(['musc-blanc', 'sample', 1]))
    expect(small.shippingFils).toBe(SHIPPING_FILS)
    expect(small.freeShipping).toBe(false)
    expect(small.remainingForFreeFils).toBe(FREE_SHIPPING_FILS - small.subtotalFils)
    expect(small.totalFils).toBe(small.subtotalFils + SHIPPING_FILS)

    const big = cartTotals(lines(['oud-noir', 'full', 1]))
    expect(big.shippingFils).toBe(0)
    expect(big.freeShipping).toBe(true)
    expect(big.remainingForFreeFils).toBe(0)
  })

  it('treats exactly the threshold as free (oud-noir 50 ml is KWD 75.000)', () => {
    const totals = cartTotals(lines(['oud-noir', 'spray50', 1]))
    expect(totals.subtotalFils).toBe(FREE_SHIPPING_FILS)
    expect(totals.shippingFils).toBe(0)
  })

  it('adds the remote surcharge even when delivery is free', () => {
    const totals = cartTotals(lines(['oud-noir', 'full', 1]), EMPTY_GIFT, 'khiran')
    expect(totals.remoteSurchargeFils).toBe(REMOTE_SURCHARGE_FILS)
    expect(totals.totalFils).toBe(totals.subtotalFils + REMOTE_SURCHARGE_FILS)
  })

  it('adds the gift box only when gift mode is on and there is something to wrap', () => {
    const sadu = sanitizeGift({ enabled: true, boxId: 'sadu' })
    const totals = cartTotals(lines(['oud-noir', 'full', 2]), sadu)
    expect(totals.giftFils).toBe(GIFT_BOX_BY_ID.sadu.priceFils)
    expect(totals.count).toBe(2)
    expect(totals.totalFils).toBe(totals.subtotalFils + totals.giftFils)
    expect(cartTotals(lines(['oud-noir', 'full', 2]), { ...sadu, enabled: false }).giftFils).toBe(0)
    expect(cartTotals([], sadu)).toMatchObject({ giftFils: 0, totalFils: 0, count: 0 })
  })

  it('keeps every figure an integer number of fils', () => {
    const totals = cartTotals(
      lines(['oud-noir', 'full', 3], ['musc-blanc', 'sample', 7], ['dehn-al-oud', 'quarter-tola', 2]),
      sanitizeGift({ enabled: true, boxId: 'majlis' }),
      'wafra',
    )
    for (const [key, value] of Object.entries(totals)) {
      if (typeof value === 'number') expect(Number.isInteger(value), key).toBe(true)
    }
  })
})

describe('cartReducer', () => {
  it('adds, and merges a repeat add into the same line up to MAX_QTY', () => {
    let state = cartReducer([], { type: 'add', productId: 'oud-noir', formatId: 'full', qty: 6 })
    state = cartReducer(state, { type: 'add', productId: 'oud-noir', formatId: 'full', qty: 6 })
    state = cartReducer(state, { type: 'add', productId: 'oud-noir', formatId: 'sample', qty: 1 })
    expect(state).toEqual([line('oud-noir', 'full', MAX_QTY), line('oud-noir', 'sample', 1)])
  })

  it('sets whole quantities, removes at zero and ignores nonsense', () => {
    const start = [line('oud-noir', 'full', 2)]
    expect(cartReducer(start, { type: 'setQty', id: 'oud-noir__full', qty: 3.9 })).toEqual([line('oud-noir', 'full', 3)])
    expect(cartReducer(start, { type: 'setQty', id: 'oud-noir__full', qty: 0 })).toEqual([])
    expect(cartReducer(start, { type: 'setQty', id: 'oud-noir__full', qty: 'x' })).toBe(start)
  })

  it('keeps the same state when another tab sends the same cart', () => {
    const start = [line('oud-noir', 'full', 2)]
    expect(cartReducer(start, { type: 'replace', lines: [line('oud-noir', 'full', 2)] })).toBe(start)
    expect(cartReducer(start, { type: 'replace', lines: [] })).toEqual([])
  })
})

describe('an emptied cart and its gift', () => {
  const majlis = sanitizeGift({ enabled: true, boxId: 'majlis', message: 'Eid Mubarak', from: 'Noura', deliverToRecipient: true })

  it('keeps the gift while there is something to wrap', () => {
    expect(giftForCart(majlis, 1)).toBe(majlis)
  })

  it('drops box, card and recipient delivery once the last line goes', () => {
    expect(giftForCart(majlis, 0)).toEqual(EMPTY_GIFT)
    // A gift switched off but still holding a card is reset too, so it cannot return later.
    expect(giftForCart({ ...majlis, enabled: false }, 0)).toEqual(EMPTY_GIFT)
    const empty = sanitizeGift(null)
    expect(giftForCart(empty, 0)).toBe(empty)
  })

  it('does not carry an abandoned gift into the next order', () => {
    // What the provider does: remove the only line, the gift follows, then a plain add.
    let lines = cartReducer([], { type: 'add', productId: 'oud-noir', formatId: 'full', qty: 1 })
    let gift = giftForCart(majlis, lines.length)
    lines = cartReducer(lines, { type: 'remove', id: 'oud-noir__full' })
    gift = giftForCart(gift, lines.length)
    lines = cartReducer(lines, { type: 'add', productId: 'ambre-royale', formatId: 'full', qty: 1 })
    expect(cartTotals(detailLines(lines), gift).giftFils).toBe(0)
    expect(gift).toMatchObject({ enabled: false, deliverToRecipient: false, message: '', from: '', boxId: 'signature' })
  })
})

describe('isLineFull', () => {
  it('is true only for a line already at MAX_QTY', () => {
    const lines = [line('oud-noir', 'full', MAX_QTY), line('oud-noir', 'sample', MAX_QTY - 1)]
    expect(isLineFull(lines, 'oud-noir__full')).toBe(true)
    expect(isLineFull(lines, 'oud-noir__sample')).toBe(false)
    expect(isLineFull(lines, 'qahwa__full')).toBe(false)
    expect(isLineFull([], 'oud-noir__full')).toBe(false)
  })
})
