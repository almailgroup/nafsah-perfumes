/*
 * Pure readings of a product for the product page: no React, no language,
 * so the tests can pin them down.
 */
import { PRODUCTS_BY_ID } from '../../data/products'
import { FAMILIES, LAYERING_KINDS, SEASONS } from '../../data/taxonomy'

/** The longevity meter runs over a full day. */
export const LONGEVITY_SCALE_HOURS = 24

const FAMILY_ORDER = Object.fromEntries(FAMILIES.map((family, index) => [family.id, index]))
const KIND_ORDER = Object.fromEntries(LAYERING_KINDS.map((kind, index) => [kind.id, index]))

/**
 * familyProfile as rows, largest share first. On a tie the product's own
 * family leads (it is the one printed on its plate), then the house's order.
 */
export const familyShares = (product) => {
  const rank = (id) => (id === product?.family ? -1 : (FAMILY_ORDER[id] ?? 99))
  return Object.entries(product?.familyProfile ?? {})
    .map(([id, share]) => ({ id, share }))
    .sort((a, b) => b.share - a.share || rank(a.id) - rank(b.id))
}

/** Worn in every season the house names, i.e. all year. */
export const isAllYear = (product) => SEASONS.every((season) => product?.seasons?.includes(season.id))

/**
 * The layering pairings in the order they go on — bukhoor smoke, then oil,
 * then spray — each with its catalogue partner resolved. A pairing that
 * names a product the catalogue no longer has is dropped rather than shown
 * with a dead link.
 */
export const layeringPairs = (product) =>
  (product?.layering ?? [])
    .map((pairing, index) => ({
      ...pairing,
      index,
      partner: pairing.productId ? (PRODUCTS_BY_ID[pairing.productId] ?? null) : null,
    }))
    .filter((pairing) => !pairing.productId || pairing.partner)
    .sort((a, b) => (KIND_ORDER[a.kind] ?? 99) - (KIND_ORDER[b.kind] ?? 99) || a.index - b.index)
