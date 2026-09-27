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

A bilingual Gulf identity. The house is named Nafsah, ships from Kuwait and prices in
dinar, so the design says so: Arabic and English are peers, not a translation layer bolted
on afterwards.

### Colour

| Token      | Role                                                                   |
| ---------- | ---------------------------------------------------------------------- |
| `midnight` | `#08130f` → `#2b5144`. Deep green-black ground, panels and rules.       |
| `pearl`    | `#f6f2e9` → `#8b8e85`. All text.                                        |
| `jade`     | `#b6e3d2` → `#1f6f5c`. The accent: actions, active states, badges.      |
| `saffron`  | `#e4b35f`, `#c8862a`. Rationed to eyebrow labels and the vial's seal.   |
| `lapis`    | Decorative only — 3.8:1 on the ground, so never used for text.          |
| `alert`    | Validation only.                                                        |

Jade rather than gold is deliberate: this brand was already rejected once for looking like
a gold merchant, and a green ground lets the warm note stay a fragrance reference rather
than a metal.

### Type — four faces, two scripts

Latin display is **Cormorant Garamond**, as requested by name. Its thinnest serifs are
12/1000em and effectively vanish reversed out of a dark ground below ~24px, so on this
palette it is **display only** — every body string, label, button and input is a sans.
That single constraint is what makes a dark site possible with this face at all.

Arabic display is **Reem Kufi**, a geometric Kufi drawn from the same shape language as the
mashrabiya lattice. Arabic UI is **IBM Plex Sans Arabic**, which holds up small on dark
where Cormorant cannot. Latin UI stays **Jost**.

Arabic sits lower and wider than Latin at the same nominal size, so the ramp does not reuse
the Latin numbers: every `.t-*` class in `src/index.css` has a `[dir="rtl"]` block that
re-tunes size and leading. Arabic has no case, so `uppercase` and wide tracking are dropped
under RTL — applied to Arabic they break joined letterforms.

### Direction

`LocaleProvider` sets `lang` and `dir` on the document element and persists the choice.
Layout is written in **logical properties** (`ms/me`, `ps/pe`, `start/end`, `border-s/e`)
rather than left/right, so the whole page mirrors from that one attribute. Directional
glyphs — carousel chevrons, the arrow in a button — carry `rtl:rotate-180` or a swapped
icon. The price rail's fill is computed per direction, since it is drawn from the logical
start.

Numbers follow the script: `formatPrice` gives `KD 75.000` in English and `‏٧٥٫٠٠٠ د.ك` in
Arabic, and catalogue numbers render as `04` or `٠٤`.

### Signature

The **mashrabiya** — the eight-point khatim star, two overlapping squares on a 56px tile —
replaces the hairline rule as the structural motif. It appears as a masked 5% watermark on
panels and bands, never behind body copy.

Every UI string lives in `src/i18n/strings.js` with full key parity between the two
languages; product names, taglines and all fragrance notes carry an `ar` counterpart in
`src/data/products.js` so the two can never drift apart.

## Accessibility

Semantic landmarks and heading order, a skip link, labelled controls throughout, visible
gold focus rings, `aria-pressed` filter chips, a `radiogroup` size selector, `aria-live` quantity
readouts, focus moved into and restored out of overlays, and a `prefers-reduced-motion` block that
disables animation.

## Notes

This is a front-end demonstration. There is no backend: prices, inventory and orders are local
state, and the checkout is a mock that never transmits payment details.
