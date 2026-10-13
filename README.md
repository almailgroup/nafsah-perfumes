# Nafsah — a perfume house storefront for Kuwait

A bilingual (English / Arabic, right-to-left) storefront for Nafsah, a perfume house that
composes its sprays in Grasse and sells from a boutique in Kuwait. Fifteen fragrances across
seven Gulf families, sold as full bottles, 50ml sprays, tola and quarter-tola oils and 2ml
sample vials; same-day delivery inside Kuwait; Try First test vials; gifting; real customer
reviews; and a Scent Finder.

It is a static site: React 18, Vite 5, Tailwind CSS 3.4 and lucide-react, published to GitHub
Pages. There is no backend yet — prices, the catalogue and every policy figure are data
modules, the checkout is a demonstration that transmits nothing, and `db/` holds the
PostgreSQL schema for the day a server arrives.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173/
npm run build        # production bundle in dist/, one HTML entry per route
npm run preview      # serve the production bundle
npm run lint         # ESLint over the whole repository
npm test             # Vitest: data, libraries, i18n, cart, components
npm run check:i18n   # English and Arabic dictionaries must match key for key
```

Node 18 or later (the project is developed on Node 22).

## Deployment

Published to **https://nafsah.com** by `.github/workflows/deploy.yml`, which builds and
deploys on every push to `main`. The repository's Pages source is **GitHub Actions**
(Settings → Pages → Source), not "Deploy from a branch" — the repo root holds Vite's source
`index.html`, which a browser cannot execute.

Two things the custom domain depends on:

- **`vite.config.js` sets `base: '/'`.** The site is served from the root of an apex
  domain. While it lived at the Pages project URL this was `'/nafsah-perfumes/'`; leaving
  that prefix on a custom domain makes every asset request `nafsah.com/nafsah-perfumes/…`,
  which 404s, so the bundle never loads and the page renders blank white.
- **`public/CNAME` contains `nafsah.com`.** Actions deploys a static artifact rather than a
  branch, so the domain is declared in the published output and cannot be dropped by a
  deploy.

DNS for the apex domain needs A records pointing at GitHub Pages
(`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), with `www`
as a CNAME to `almailgroup.github.io`. HTTPS only becomes available once GitHub has
provisioned a certificate for the domain, after which *Enforce HTTPS* can be enabled.

Only `dist/` is published; build output is never committed. A deploy can be re-run by hand
from the Actions tab via `workflow_dispatch`.

## What the site does

- **Catalogue.** Seven families — Oud & Musk, Amber, Rose & Florals, French-Arabic Hybrids,
  Bukhoor & Oils, Gourmand 2.0, Fresh & Aquatic Beast Mode — in the navigation, the category
  tiles and the filters. Search reads English and Arabic (diacritics, tashkeel and letter
  variants folded), and filters cover family, notes, concentration, projection, gender and
  price, with live counts.
- **Product page.** The vial, a format toggle (Full Bottle, 50ml Spray, Tola Oil, Quarter Tola
  Oil, 2ml Sample Vial) with its price, the facts strip, a visual olfactory pyramid, the scent
  profile (family shares, heat resistance, longevity, projection — every meter with its value
  in text), Gulf layering suggestions, and reviews.
- **Try First.** Every full bottle, 50ml spray and tola ships with a free 2ml test vial of the
  same fragrance; a sealed bottle can come back within the return window.
- **Delivery promise.** Worked out on Kuwait time: same-day before the cut-off, next delivery
  day after it, no deliveries on Fridays, outlying areas one delivery day later with a fee.
- **Gifting.** Three gift boxes, a printed message card, prices left off the packing slip,
  and delivery straight to the recipient.
- **Checkout.** A Kuwaiti address (governorate, area, block, street, avenue, building, floor,
  apartment), an 8-digit mobile, gift recipient details, and KNET / card / Apple Pay / cash on
  delivery. It is a demonstration: nothing is charged or sent.
- **Reviews.** Real customer reviews only, with four ratings (overall, longevity in the heat,
  projection, compliment factor). Until a review service is connected, a submitted review is
  kept in the visitor's browser and the page says so. Nothing is seeded.
- **Scent Finder** at `/scent-finder`: five questions, ranked matches, answers kept in the
  address so a result can be shared.
- **Help and legal pages**: Shipping & Returns, FAQ, Privacy Policy, Terms of Sale, Contact.

## Architecture

```
index.html, contact/, faq/, privacy/, shipping/, terms/, scent-finder/
                         # one HTML entry per route (GitHub Pages has no server routing);
                         # each carries its own <title>, description and a pre-paint
                         # script that sets lang/dir before the first frame
src/
├── main.jsx, App.jsx    # providers, layout, the page for each route
├── router/              # routes.js (the route table, shared with vite.config.js),
│                        # a small pushState router with query and hash support
├── data/                # the catalogue and every policy figure — see "Data model"
├── lib/                 # pure logic, unit-tested: format, delivery, address,
│                        # catalogue (search, filters, sorts), reviews, scent-finder
├── context/             # the cart: reducer, persistence, totals, gift options
├── hooks/               # useCatalogue, useReviews, useOverlay (dialog stack,
│                        # focus trap, Escape, scroll lock), useReveal
├── i18n/                # strings.js (core copy) + dict/<feature>.js, LocaleProvider
├── components/          # page sections, plus feature folders:
│   ├── product/         #   format toggle, pyramid, scent profile, layering
│   ├── catalogue/       #   search, facets, price range, filter sheet
│   ├── reviews/         #   reviews section, form, star input, rating badge
│   ├── trust/           #   Try First banner and modal, delivery badge
│   ├── gifting/         #   gift panel, box swatches, card preview
│   ├── checkout/        #   steps, Kuwaiti address fields, order summary
│   └── finder/          #   Scent Finder page and homepage teaser
└── index.css            # Tailwind layers and the house type and button classes
db/                      # PostgreSQL schema for a future backend (see db/README.md)
scripts/check-i18n.mjs   # the dictionary audit behind npm run check:i18n
```

State is small and local: a cart context (lines, totals, gift options, which overlay is open)
and a locale context (language, direction, `t`, `tc`, `tr`). Everything a shopper sets that
must survive a refresh is in `localStorage`: `nafsah.cart.v2` (a v1 cart migrates once),
`nafsah.gift.v1`, `nafsah.lang.v1` and `nafsah.reviews.v1`.

## Data model

All in `src/data`, plain modules with no React, validated by `src/data/schema.js` in tests.

- **`taxonomy.js`** — every enumerated value as `{ id, en, ar, … }`: `FAMILIES` (display
  order), `CONCENTRATIONS` (extrait 20–30%, EDP 15–20%, EDT 5–15%, attar 100% oil),
  `SILLAGE` (intimate → beast mode, `level` 1–4), `GENDERS`, `SEASONS`, `OCCASIONS`,
  `FORMATS` (with `kind`, standard `ml` and the `tryFirst` flag), `HEAT_SCALE` (1–5),
  `LONGEVITY_BANDS`, `LAYERING_KINDS`, and `*_BY_ID` lookups.
- **`notes.js`** — one entry per material, one English and one Arabic name each, with
  search aliases (`Cambodian Oud`, `ورد الطائف`).
- **`products.js`** — the fifteen fragrances:

  ```js
  {
    id: 'oud-noir', name: { en, ar }, tagline: { en, ar }, description: { en, ar },
    family: 'oud-musk', familyProfile: { 'oud-musk': 60, rose: 20, amber: 20 },   // percents, sum 100
    concentration: 'extrait', gender: 'unisex',
    longevity: 12, projectionSillage: 'strong', heatResistance: 3,      // hours, SILLAGE id, 1–5
    seasons: ['winter'], occasions: ['diwaniya', 'wedding'],
    topNotes: [NOTES.bergamot, …], heartNotes: […], baseNotes: […],
    layering: [{ kind: 'bukhoor', name, how }, { kind: 'attar', productId: 'ward-taifi', how }],
    formats: [{ id: 'full', ml: 100, priceFils: 119000 }, …, { id: 'sample', ml: 2, priceFils: 4500 }],
    palette: { from, via, to, glass }, year: 2019, bestseller: true, isNew: false,
  }
  ```

  Helpers: `PRODUCTS_BY_ID`, `CATALOGUE_NUMBERS` (positional, `01`…), `PRICE_BOUNDS`,
  `bottleFormats`, `fromPriceFils`, `formatOf`, `concentrationFor` (oil formats are attar),
  `allNotes`. There are no rating fields: ratings come only from real reviews.
- **`kuwait.js`** — the six governorates and their residential areas in both languages;
  outlying areas carry `remote: true`. `areasIn(governorate, lang)`, `isRemoteArea(id)`.
- **`delivery.js`** — the policy: `SAME_DAY_CUTOFF_HOUR` (14), `NO_DELIVERY_WEEKDAYS`
  (Friday), `SHIPPING_FILS`, `FREE_SHIPPING_FILS` (free when the fragrances come to this or
  more), `REMOTE_SURCHARGE_FILS`, `REMOTE_EXTRA_DAYS`, `RETURN_WINDOW_DAYS`.
- **`gifting.js`** — `GIFT_BOXES` (Signature, complimentary; Al Sadu keepsake; Majlis chest
  with bukhoor) and `GIFT_MESSAGE_MAX`.
- **`help.js`, `legal.js`** — the Shipping & Returns page, the FAQ and the legal pages as
  bilingual prose. No figure is typed into a sentence: `{threshold}`, `{cutoff}`,
  `{returnPeriod}`, `{remoteFee}`, `{vial}` and the rest are filled by `fillPolicy()` from the
  modules above, so the pages cannot promise anything the checkout does not apply.

Reviews are not data: `src/lib/reviews.js` keeps them in the browser behind a small store
(`createLocalReviewStore`) that a real review service can replace.

**Money** is integer fils everywhere (1 KWD = 1000 fils). `formatPrice(fils, lang)` prints
`KWD 75.000` and `د.ك. ٧٥٫٠٠٠`; `ARABIC_DIGITS` in `src/lib/format.js` switches Arabic mode to
Latin digits if the house prefers.

## Language and direction

- Arabic and English are peers. `LocaleProvider` sets `lang` and `dir` on the document; every
  HTML entry also sets them before the first paint for a returning Arabic visitor.
- Interface copy lives in dictionaries: `src/i18n/strings.js` holds the site-wide core and
  each feature has `src/i18n/dict/<feature>.js` with keys prefixed by its namespace
  (`checkout.err.required`). English and Arabic must have the same keys and the same
  `{placeholders}`; `npm run check:i18n` and the tests enforce it, and a key defined twice
  throws in development.
- Catalogue text is `{ en, ar }` data rendered with `tr()`. Counts use `tc(key, n)` with
  `.one/.other` in English and `.zero/.one/.two/.few/.many/.other` in Arabic.
- Every number shown goes through `formatNumber`, `formatPrice`, `formatMl`, `formatHours`
  or `formatDate`, so Arabic mode shows Arabic-Indic digits.
- Layout uses logical utilities (`ms/me`, `ps/pe`, `start/end`, `border-s`, `text-start`);
  directional icons carry `rtl:rotate-180` or are swapped; Arabic drops uppercase and wide
  tracking (the `.t-*` and `.ticket` classes do this for you).

## Changing things

- **A fragrance.** Edit `src/data/products.js`. Keep the id once published (carts and links use
  it), use note objects from `notes.js` (add the note there first), make `familyProfile` sum to
  100 with `family` as its largest share, and give every product a `sample` format. Sprays
  offer `full`, `spray50` and `sample` (signature extraits may add `quarter-tola`); attars
  offer `tola`, `quarter-tola` and `sample`. `npm test` runs the catalogue validator. New
  products are appended, because catalogue numbers are positional.
- **Delivery fees, the cut-off, rest days, the return window.** Change the constant in
  `src/data/delivery.js`. The delivery badge, cart, checkout, announcement bar, FAQ, Shipping
  & Returns page and terms all follow. The `*/index.html` meta descriptions carry no policy
  figures, apart from `index.html`'s "since 1974".
- **Areas.** `src/data/kuwait.js`: add a row under its governorate as `[id, English, Arabic]`,
  with `REMOTE` as a fourth value for an outlying area.
- **Gift boxes.** `src/data/gifting.js`: name, blurb and price in fils; the FAQ quotes them.
- **Copy.** Core interface copy and the homepage's house story, hero and reading guide are in
  `src/i18n/strings.js`; feature copy is in `src/i18n/dict/`; policy prose in
  `src/data/help.js` and `src/data/legal.js`; meta descriptions in each `*/index.html`.

## Design system

Paper, ink, Arab Green and a little gold. Square corners, hairline rules, generous space.

| Token | Value | Use |
| --- | --- | --- |
| `snow-50` | `#fbfaf7` | the page |
| `snow-100` / `200` / `300` | panels / hairlines / strong hairlines | |
| `snow-600` | `#4a5550` | muted text on paper (7.3:1) |
| `ink-950` | `#08140f` | type (18:1 on paper) |
| `green-600` | `#006039` | Arab Green: actions, links, the announcement strip; carries text on paper (7.4:1) |
| `green-700` | `#004d2e` | the deep bands and the footer |
| `green-300` | `#79c3a5` | the only accent on green-700 |
| `gold-500` | `#a37e2c` | Boy Gold: hairlines, rules and seals only — never text on paper |
| `gold-300` | `#dabb77` | gold text, on green-700 only |
| `alert-600` | `#b0452f` | errors |

Type: **Jost** for Latin display and interface, **Reem Kufi** for Arabic display and **IBM Plex
Sans Arabic** for Arabic text. The classes `.t-display .t-h2 .t-title .t-body .t-label
.ticket .t-figure` and the buttons `.btn-green .btn-ink .btn-outline .btn-paper` re-tune size,
leading and tracking for Arabic under `[dir="rtl"]`. Icons are lucide-react at a 1.25–1.75
stroke. The mashrabiya star is the house motif, used as a faint watermark behind the vials
and the green bands, never behind copy.

Bottles are drawn, not photographed: `BottleVisual` renders each as an SVG tinted from the
product's `palette` with its concentration on the label. To use photography, replace it
with an `<img>` and add an image field to each product.

## Accessibility

Landmarks and a skip link on every route; real buttons and labels; radio groups (the format
toggle, star ratings, Scent Finder answers) with arrow keys and a single tab stop, mirrored in
Arabic; every meter has its value in text; dialogs trap focus, close on Escape from the top
of a stack and restore focus and scroll; the hero carousel and the announcement strip stop on
hover and focus and have a pause control; reduced-motion preferences are honoured; visible
green focus rings throughout.

## Tests

`npm test` runs Vitest over the catalogue validator, Kuwait data, formatting, the delivery
promise (on fixed Kuwait clocks), address validation, search and filters, reviews, the Scent
Finder ranking, the cart reducer and migration, the dictionaries, and the main interactive
components.

## Placeholders the owner must replace

This storefront is a working template. Before trading on it, replace or confirm:

- **Heritage story** — Yusuf Nafsah, the three-bench atelier, the Grasse bench, four-week
  maceration, the named material sources (Al Hada, Tamil Nadu, Florence), "never
  reformulated", and the Kuwait boutique decanting oils and vials (`src/i18n/strings.js`,
  the terms' "Who you are dealing with"). The founding year, 1974, is `HOUSE_FOUNDED` in
  `src/data/help.js`, which the story, footer and terms read; it is also written out as
  "since 1974" in `index.html`'s meta description, as `FIRST_YEAR` in `src/data/schema.js`
  and in the `year` check in `db/schema.sql`.
- **Contact details** — the boutique address, `+965 2200 0000`, `atelier@nafsah.example`,
  WhatsApp, opening hours and the Grasse atelier (`ContactPage.jsx`, `Footer.jsx`,
  `strings.js`).
- **Prices** — every format price and the gift box prices (`products.js`, `gifting.js`).
- **Product facts** — notes, longevity, projection, heat resistance, seasons, occasions,
  layering pairings and the descriptions' claims ("rested in glass for a year", "distilled
  in copper the same morning") (`products.js`).
- **Delivery policy** — the fee, the free-delivery threshold, the outlying-area fee and
  extra day, the 14:00 cut-off, Friday rest, which areas are outlying (`delivery.js`,
  `kuwait.js`), plus refund timings (five working days) and the fourteen-day damage window
  in the help and terms prose.
- **Legal templates** — the privacy policy and terms of sale are drafts, not legal advice;
  have them reviewed under Kuwaiti law (`legal.js`).
- **Services not yet connected** — payments (KNET, cards, Apple Pay), order handling, the
  review service, the newsletter and the contact form, through which returns, Try First
  returns and GCC/international order requests all arrive. Checkout, the contact form and the
  newsletter are demonstrations.
- **Arabic copy and the area list** — have a native copy editor review the Arabic, and check
  the residential area names and governorate assignments in `kuwait.js`.

## Notes

This is a front-end demonstration. There is no backend: prices, inventory and orders are local
state, and the checkout never transmits payment details. `db/schema.sql` describes the
database it would use.
