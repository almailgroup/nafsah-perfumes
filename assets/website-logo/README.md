# Website logo

**`NafsahLogo.png`** is the official logo — the one source every logo on the
site is made from. It is never served to visitors as-is.

`scripts/logo.py` derives what the site actually uses:

| File | Size | Used for |
|---|---|---|
| `src/assets/logo/logo-ink.png` | 528 × 120 | Header, on the warm white |
| `src/assets/logo/logo-paper.png` | 528 × 120 | Footer, reversed for the green |
| `public/favicon-32.png` · `favicon-16.png` | 32 · 16 | Browser tab |
| `public/apple-touch-icon.png` | 180 | iPhone and iPad home screen |

The logo files are trimmed to the ink and sized for 3× screens at the largest
size they are drawn (36px). The tab icons use the logo's own **N**, because
the full wordmark is five pixels tall at 16px.

To change the logo, replace `NafsahLogo.png` here and run:

```
python3 scripts/logo.py
```

A transparent background and 512px or more on the longest side work best.
