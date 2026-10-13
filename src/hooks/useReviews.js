import { useCallback, useMemo, useSyncExternalStore } from 'react'
import { aggregate, reviewStore } from '../lib/reviews'

const EMPTY = Object.freeze([])
const NONE = Object.freeze({})

/**
 * One fragrance's reviews, live: every mounted badge and section re-renders
 * after a submission here or in another tab.
 *
 *   reviews   newest first
 *   summary   { count, overall, longevityHeat, sillage, compliment }
 *   add(draft) → { ok: true, review } | { ok: false, errors: { field: messageKey } }
 */
export function useReviews(productId) {
  const store = reviewStore()
  const all = useSyncExternalStore(store.subscribe, store.all, () => EMPTY)
  const reviews = useMemo(
    () => (productId ? all.filter((review) => review.productId === productId) : EMPTY),
    [all, productId],
  )
  const summary = useMemo(() => aggregate(reviews), [reviews])
  const add = useCallback((draft) => store.add({ ...draft, productId }), [store, productId])
  return { reviews, summary, add }
}

/** { [productId]: aggregate } for every reviewed fragrance, live — e.g. to sort by rating. */
export function useReviewAggregates() {
  const store = reviewStore()
  return useSyncExternalStore(store.subscribe, store.aggregates, () => NONE)
}
