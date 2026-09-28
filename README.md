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

### Colour — Rolex brand palette

Two official brand values, used exactly:

| Name           | Hex       | RGB             | Pantone |
| -------------- | --------- | --------------- | ------- |
| **Arab Green** | `#006039` | `0, 96, 57`     | 3425 C  |
| **Boy Gold**   | `#A37E2C` | `163, 126, 44`  | 7754 C  |

| Token      | Role                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| `midnight` | `#08140f` → `#345548`. Surfaces, carrying the brand green's own 155.6° hue, so the ground reads as darkened Arab Green rather than grey. |
| `green`    | `600` **is** Arab Green. Tints 200–500 are derived. |
| `gold`     | `500` **is** Boy Gold. Tints 200–400 are derived. |
| `pearl`    | `#f6f2e9` → `#8b8e85`. All text. |

Two constraints govern how the brand values are allowed to be used:

**Arab Green is a fill, never text.** At `2.45:1` against the ground it cannot carry
type. It is the action fill — buttons, the cart badge, the full-bleed trust band — where
pearl on it measures `6.88:1`. Green *text* uses the derived tints (`green-300` at
`9.1:1`). The tints are also deliberately desaturated: at the brand's own 100% saturation
they render neon, which is the opposite of what this palette is for.

**Boy Gold is rationed.** `#A37E2C` is `4.99:1` on the ground — passing, but tight for an
11px label — so it is used for fills, borders and the vial's wax seal, while gold *text*
takes `gold-300` at `10.16:1`. Gold appears on eyebrow labels, the secondary button and the
seal, and nowhere else. This brand was rejected once for looking like a gold merchant;
green does the structural work and gold stays a punctuation mark.

### Type — four faces, two scripts

Chosen for legibility, measured rather than assumed. The ratio that matters is
x-height over cap-height: it governs how large a face *looks* at a given nominal size.

| Role         | Face                    | x/cap | Replaces                  |
| ------------ | ----------------------- | ----- | ------------------------- |
| Latin display| **Marcellus**           | 0.666 | Cormorant Garamond (0.618)|
| Latin UI/body| **Inter**               | 0.751 | Jost (0.657)              |
| Arabic display| **Reem Kufi**          | —     | —                         |
| Arabic UI    | **IBM Plex Sans Arabic**| —     | —                         |

Marcellus is Roman inscriptional — luxurious, but with an x-height 21% larger than
Cormorant's and far sturdier strokes, so it survives sizes where Cormorant disintegrated.
It has one weight and no italic, which the ramp treats as a discipline rather than a gap.
Inter is drawn specifically for interface legibility and is 19% larger on the eye than Jost
at the same setting.

Body weight is **400, not 300**. A hairline body weight reversed out of a dark ground was
the other half of why the previous type was hard to read. Prices use Inter rather than a
serif, with `lnum`/`tnum` so columns align.

Arabic sits lower and wider than Latin at the same nominal size, so every `.t-*` class in
`src/index.css` has a `[dir="rtl"]` block that re-tunes size and leading. Arabic has no
case, so `uppercase` and wide tracking are dropped under RTL — applied to Arabic they break
joined letterforms.

### Chrome — the white header

An Arab Green announcement strip sits above a warm-white header (`snow-50` `#fbfaf7`,
never pure white), closed with a Boy Gold hairline, over the dark page.

The inversion changes what the brand colours can do. On the dark ground Arab Green is
`2.45:1` and cannot carry text; **on white it is `7.36:1`**, so the header uses it directly
for the active category. Boy Gold runs the other way: `4.99:1` on dark but only `3.61:1` on
white, so on the header it is the hairline rule and nothing else — never small text.

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
