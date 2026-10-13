# Database — for when a backend arrives

The storefront is a static site today. There is no server and no database: the
catalogue and every policy figure are JavaScript modules in `src/data`, and
what a visitor does (cart, gift options, reviews they write) is kept in their
own browser. `schema.sql` is the PostgreSQL schema that mirrors that data model
one to one, so the move to a backend is a change of storage, not of shape.

```bash
createdb nafsah
psql -d nafsah -v ON_ERROR_STOP=1 -f db/schema.sql
```

PostgreSQL 13 or later. The file runs in one transaction and creates no data:
seed it from `src/data` (below) before pointing anything at it.

## How the tables map to the code

| Table | Source today | Notes |
| --- | --- | --- |
| `governorates`, `areas` | `src/data/kuwait.js` | Ids match (`hawalli`, `salmiya`). `areas.remote` drives the outlying-area fee and timing. |
| `fragrance_families`, `concentrations`, `sillage_levels`, `genders`, `seasons`, `occasions`, `formats`, `heat_scale` | `src/data/taxonomy.js` | One table per list. `sort_order` is the display order the code takes from array order. |
| `notes` | `src/data/notes.js` | `aliases` holds the alternative spellings search accepts. |
| `products` | `src/data/products.js` | `catalogue_no` replaces today's positional `CATALOGUE_NUMBERS`. `palette` is the bottle drawing's colours. |
| `product_family_profile` | `product.familyProfile` | 1–4 rows per product summing to 100, checked at commit by a deferred trigger. |
| `product_seasons`, `product_occasions` | `product.seasons`, `product.occasions` | Join tables rather than arrays, so the Scent Finder can query them. |
| `product_notes` | `topNotes`, `heartNotes`, `baseNotes` | `tier` + `position`; a note appears once per product. |
| `product_formats` | `product.formats` | `price_fils` is integer fils, as everywhere in the code. |
| `layering_suggestions` | `product.layering` | Bukhoor carries its own name; attar and spray partners point at a product. |
| `gift_boxes` | `src/data/gifting.js` | `price_fils = 0` is the complimentary Signature box. |
| `delivery_policy` | `src/data/delivery.js` | One row. Every figure the site quotes ({threshold}, {cutoff}, {returnPeriod}…) comes from here. |
| `customers`, `addresses` | `src/lib/address.js` (shape only) | Kuwaiti mobile as 8 digits (`^[4569][0-9]{7}$`); block 1–999; a listed area must belong to its governorate (composite foreign key). |
| `orders`, `order_items` | `src/context/cart-context.js`, `src/components/checkout/checkout-logic.js` | Totals in fils with `total = subtotal + gift + shipping + remote surcharge` enforced; the delivery promise is stored as it was made. Gift orders carry the box, the card message (≤ 200 characters), the hidden-prices flag and the recipient. Cash on delivery is refused for gifts sent straight to the recipient. |
| `try_first_returns` | the Try First terms | One Try First return per fragrance per customer, as a primary key. |
| `reviews`, `review_aggregates` | `src/lib/reviews.js` | Four 1–5 ratings, body 20–1000 characters, `pending` until moderated. The view gives the one-decimal averages the badge and the "Top rated" sort read. |

## What is static today, and what moves

- **Static, generated into the bundle**: everything in `src/data`. With a
  backend, a build step (or an API) would read these tables and emit the same
  modules, so components do not change.
- **In the visitor's browser** (`localStorage`): the cart (`nafsah.cart.v2`),
  gift options (`nafsah.gift.v1`), the language (`nafsah.lang.v1`) and reviews
  they have written (`nafsah.reviews.v1`). Reviews are the first thing to move:
  `createLocalReviewStore` in `src/lib/reviews.js` is the seam to swap for an
  API that inserts into `reviews` with `status = 'pending'`.
- **Not stored anywhere yet**: orders. Checkout is a demonstration and sends
  nothing; `buildReceipt()` already produces the fields `orders` and
  `order_items` need.

## Seeding

Insert in dependency order: governorates → areas → taxonomy tables → notes →
products → the product child tables → gift boxes → the delivery-policy row.
Each `src/data` module exports plain arrays and objects, so a small Node script
can import them and write `INSERT`s; keep ids exactly as they are in code.
