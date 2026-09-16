# Nafsah — Luxury Perfume House

A storefront for a fictional luxury perfume house, built with React, Tailwind CSS and Lucide
icons. Dark, minimal and fully responsive: deep blacks, muted golds and warm off-whites.

![Twelve fragrances across four scent families](https://img.shields.io/badge/catalogue-12%20fragrances-c9a961?style=flat-square)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production bundle
npm run lint     # ESLint
```

Node 18+ is required.

## Features

**Hero.** Layered radial washes over a masked grid, a gilded headline treatment, house statistics
and a `Shop Now` call-to-action that scrolls to the catalogue.

**Product catalogue.** Twelve fragrances in a responsive grid — one column on mobile, two on
tablet, three on wide screens. Each card carries the full fragrance pyramid (top, heart and base
notes), concentration and intensity, a rating, 50ml / 100ml size toggle with live price, and an
add-to-cart button.

**Filter and search.** Search matches names, taglines, descriptions and any individual note, so
typing `bergamot` or `oud` finds every composition carrying it. Filter by scent family (Woody,
Floral, Citrus, Oriental — multi-select), narrow a dual-thumb price range, and sort by featured,
price, rating or release year. An empty state offers a one-click reset.

**Cart drawer.** A slide-out panel with quantity steppers, per-line removal, a free-shipping
progress meter, and a running subtotal, shipping, tax and total. The cart persists to
`localStorage` and rehydrates against the live catalogue, so stale lines are dropped rather than
resurrected. Escape closes it; while closed it is `inert`, keeping its controls out of the tab
order.

**Checkout.** A three-step modal — contact, shipping, payment — with per-step validation, card
number and expiry formatting, a live order summary, a mock authorisation delay and a confirmation
screen with an order reference. No network request is made and no card is charged.

## Product imagery

The catalogue ships no binary image assets. `BottleVisual` renders each flacon as an SVG tinted
from the fragrance's own `palette` — glass shell, clipped liquid fill with a meniscus, catch-light,
embossed house mark and a surface reflection. Every product therefore gets a distinct, high-quality
placeholder that scales cleanly from a 64px cart thumbnail to the 520px hero.

To swap in real photography, replace `BottleVisual` with an `<img>` and add an image field to each
entry in `src/data/products.js`.

## Project structure

```
src/
├── App.jsx                     # Layout, skip link, scroll/focus wiring
├── components/
│   ├── BottleVisual.jsx        # SVG flacon used as the image placeholder
│   ├── Navbar.jsx              # Sticky header, cart badge, mobile menu
│   ├── Hero.jsx                # Landing section and Shop Now CTA
│   ├── Collection.jsx          # Filter/sort state and the product grid
│   ├── Filters.jsx             # Search, scent family, price range, sort
│   ├── ProductCard.jsx         # Notes pyramid, size toggle, add to cart
│   ├── CartDrawer.jsx          # Slide-out cart
│   ├── CheckoutModal.jsx       # Three-step checkout
│   ├── Story.jsx               # House narrative
│   ├── NotesGuide.jsx          # How to read a fragrance pyramid
│   └── Footer.jsx              # Newsletter, contact, site links
├── context/
│   ├── cart-context.js         # Context object and useCart hook
│   └── CartProvider.jsx        # Cart reducer, totals, persistence
├── data/products.js            # Catalogue, scent families, price bounds
├── hooks/
│   ├── useOverlay.js           # Scroll lock, Escape, focus management
│   └── useReveal.js            # Scroll-triggered section reveals
├── lib/format.js               # Currency formatting and small helpers
└── index.css                   # Tailwind layers, component classes, slider
```

## Design system

Palette and type scale live in `tailwind.config.js`:

| Token    | Role                                             |
| -------- | ------------------------------------------------ |
| `ink`    | Backgrounds, from `#07070a` to `#2b2b38`         |
| `gold`   | Accents and calls to action, anchored on `#c9a961` |
| `cream`  | Text, from `#fbf8f3` down to muted `#a89e8e`    |

Headings use Cormorant Garamond, body copy uses Inter, both loaded from Google Fonts with system
serif and sans fallbacks. Reusable classes — `.btn-gold`, `.btn-ghost`, `.field`, `.eyebrow`,
`.text-gilded` — are defined in the `@layer components` block of `src/index.css`.

## Accessibility

Semantic landmarks and heading order, a skip link, labelled controls throughout, visible
gold focus rings, `aria-pressed` filter chips, a `radiogroup` size selector, `aria-live` quantity
readouts, focus moved into and restored out of overlays, and a `prefers-reduced-motion` block that
disables animation.

## Notes

This is a front-end demonstration. There is no backend: prices, inventory and orders are local
state, and the checkout is a mock that never transmits payment details.
