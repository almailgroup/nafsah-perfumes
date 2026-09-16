# Nafsah — Luxury Perfume House

A storefront for a fictional luxury perfume house, built with React, Tailwind CSS and Lucide
icons. Dark, minimal and fully responsive: deep blacks, muted golds and warm off-whites.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173/nafsah-perfumes/
npm run build    # production bundle in dist/
npm run preview  # serve the production bundle
npm run lint     # ESLint
```

Node 18+ is required. The dev server is served under `/nafsah-perfumes/` rather than `/` because
`base` is set for GitHub Pages (see Deployment); Vite prints the full URL on start.

## Deployment

Published to GitHub Pages at **https://almailgroup.github.io/nafsah-perfumes/** by
`.github/workflows/deploy.yml`, which builds and deploys on every push to `main`. The repository's
Pages source must be set to **GitHub Actions** (Settings → Pages → Source), not "Deploy from a
branch" — the repo root holds Vite's source `index.html`, which a browser cannot execute.

Because this is a *project* page rather than a user page, `vite.config.js` sets
`base: '/nafsah-perfumes/'` so assets resolve under that prefix. Renaming the repository means
updating that value to match.

Only `dist/` is published; build output is never committed. A deploy can also be re-run by hand
from the Actions tab via `workflow_dispatch`.

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

The system is **dual-tone**, and that follows directly from the typeface.

Cormorant Garamond's thinnest serifs are 12/1000em, and browsers composite
antialiasing in gamma space rather than linear light. A serif covering 19% of a pixel
delivers ~38% of full luminance contrast on white but only ~4% reversed out of near-black —
a 9.5x asymmetry. The face literally loses its serifs on dark grounds at small sizes, and
no amount of `font-weight` fixes it: the 300→700 axis thickens stems by 100% but hairlines
by only 8%. So **warm paper is the primary reading surface** and noir is reserved for the
hero, the cart drawer and the footer, where Cormorant is only ever set at display size.

| Token     | Role                                                                  |
| --------- | --------------------------------------------------------------------- |
| `paper`   | `#faf7f1` → `#c4b9a3`. Primary surface, tints and rules.               |
| `noir`    | `#141210` → `#9c9384`. Text on paper, plus the immersive dark surfaces.|
| `oxblood` | `#5c2230` → `#c98c98`. Sealing-wax accent. No metal anywhere.          |

Every text pairing clears WCAG AA: `noir-950` on `paper-50` is 17.5:1, `noir-600` 7.4:1,
`noir-500` 5.6:1, `oxblood-600` 9.4:1.

### Type

Loaded from Google Fonts: Cormorant Garamond (400/500/600/700 + italic) and Jost
(300/400/500). Jost is the closest x-height match available — 0.460 against Cormorant's
0.386, where most modern sans-serifs sit at 0.72–0.77 and would tower over it.

Cormorant's x-height is 0.386em, so it must be set ~1.35x a sans to match apparent size:
Cormorant at 21px has the x-height of Inter at 15px. The ramp lives in `src/index.css` as
`.t-display`, `.t-display-sm`, `.t-title`, `.t-deck`, `.t-body`, `.t-body-noir`, `.t-figure`.

**Nothing in the Cormorant ramp drops below 20px.** Body is 21px / 500 / 1.38 leading /
+0.006em — reversed out it steps to weight 600 and +0.01em to counter halation. Tracking
flips sign at ~40px: positive below, negative at display size. Leading is *tighter* than
convention advises, because the 1.000em extender span already yields 65% more apparent
leading than a normal face at any given multiplier.

Every label, button, input and micro-string is Jost via `.t-label`, `.t-ui` and `.ticket`.
Cormorant is never asked to do UI work.

Two non-obvious rules the implementation depends on:

- **`body` must not carry `antialiased`.** `-webkit-font-smoothing: antialiased` switches
  macOS to grayscale AA and renders text thinner; on a face whose serifs already cover ~19%
  of a pixel it is the most destructive line of CSS available.
- **Figures need `lnum` + `tnum`** (the `.t-figure` class). Cormorant's default numerals are
  proportional oldstyle — the 6 ascends above cap height, 3/5/7/9 descend, and advances vary
  47% — so price columns jitter without them. `font-synthesis: none` is set globally because
  Google's CDN strips `smcp`, which would otherwise silently synthesize thin fake small caps.

### Geometry and signature

Square throughout; hairline rules at 14% do the structural work. The signature device is the
**apothecary catalogue**: every extrait carries a positional catalogue number (No. 01–12)
printed on its plate header and on the vial's own paper label, and the flacon is drawn as a
ground-glass vial with a wrapped label and an oxblood wax seal at the shoulder.

## Accessibility

Semantic landmarks and heading order, a skip link, labelled controls throughout, visible
gold focus rings, `aria-pressed` filter chips, a `radiogroup` size selector, `aria-live` quantity
readouts, focus moved into and restored out of overlays, and a `prefers-reduced-motion` block that
disables animation.

## Notes

This is a front-end demonstration. There is no backend: prices, inventory and orders are local
state, and the checkout is a mock that never transmits payment details.
