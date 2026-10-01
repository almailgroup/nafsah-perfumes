"""
Derive every logo asset the site serves from the one official file:

    assets/website-logo/NafsahLogo.png

and the flag edition, when it is present:

    assets/website-logo/NAFSAHKuwaitFlagRibbonLogo.png

Which one the header shows is a single constant in src/brand.js.

Run from the repo root after replacing either file:

    python3 scripts/logo.py

The source is never served. It is 2172x724 with generous transparent margins,
so it is trimmed to its ink, scaled to what the page actually needs, and
written out in the two colours the page actually uses. The tab icons are
built from the logo's own N, because a 4.4:1 wordmark at 16px is five pixels
tall and unreadable.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / 'assets' / 'website-logo' / 'NafsahLogo.png'
RIBBON = ROOT / 'assets' / 'website-logo' / 'NAFSAHKuwaitFlagRibbonLogo.png'
LOGO_OUT = ROOT / 'src' / 'assets' / 'logo'
ICON_OUT = ROOT / 'public'

INK = (0, 0, 0)  # the logo exactly as supplied
PAPER = (251, 250, 247)  # snow-50: the reversed logo for the green footer
GREEN = (0, 96, 57)  # green-600, Arab Green: the tab icon's ground

# The largest any logo is drawn is 40px tall (the flag edition, in the
# desktop header). 120px covers that at 3x device pixel ratio, which is the
# densest phone screen in use.
LOGO_HEIGHT = 120


def trim(im):
    """Crop to the visible ink, dropping the supplied transparent margins."""
    return im.crop(im.getchannel('A').getbbox())


def tint(im, rgb):
    """Recolour a single-colour mark. Alpha is kept as-is, so the antialiased
    edge survives the colour change instead of being re-thresholded."""
    out = Image.new('RGBA', im.size, rgb + (0,))
    out.putalpha(im.getchannel('A'))
    return out


def first_glyph(im, threshold=24):
    """The first letter: everything left of the first empty column of ink."""
    alpha = im.getchannel('A')
    width, height = im.size
    inked = False
    for x in range(width):
        column = any(alpha.getpixel((x, y)) > threshold for y in range(height))
        if column:
            inked = True
        elif inked:
            return trim(im.crop((0, 0, x, height)))
    return im


def scaled(im, height):
    width = round(im.width * height / im.height)
    return im.resize((width, height), Image.LANCZOS)


def tab_icon(glyph, size, *, rounded, thicken=0):
    """The N, in paper on Arab Green. Drawn at 8x and reduced, so the edges
    are antialiased by the downscale rather than by the browser.

    `thicken` is a MaxFilter size applied at the 8x working size, so it is
    measured in output sub-pixels rather than source pixels — 9 adds half an
    output pixel to each side of every stroke. This N is high-contrast: a
    heavy diagonal between hairline verticals. At 16px those verticals fall
    to under half a pixel and go grey, so the smallest size gets the weight
    it needs to stay an N."""
    big = size * 8
    canvas = Image.new('RGBA', (big, big), GREEN + (255,))
    mark = scaled(glyph, round(big * 0.62))
    if thicken:
        mark.putalpha(mark.getchannel('A').filter(ImageFilter.MaxFilter(thicken)))
    mark = tint(mark, PAPER)
    canvas.alpha_composite(mark, ((big - mark.width) // 2, (big - mark.height) // 2))
    if rounded:
        mask = Image.new('L', canvas.size, 0)
        ImageDraw.Draw(mask).rounded_rectangle(
            (0, 0, big - 1, big - 1), radius=round(big * 0.18), fill=255
        )
        canvas.putalpha(mask)
    return canvas.resize((size, size), Image.LANCZOS)


def main():
    source = Image.open(SOURCE).convert('RGBA')
    ink = trim(source)

    LOGO_OUT.mkdir(parents=True, exist_ok=True)
    logo = scaled(ink, LOGO_HEIGHT)
    tint(logo, INK).save(LOGO_OUT / 'logo-ink.png', optimize=True)
    tint(logo, PAPER).save(LOGO_OUT / 'logo-paper.png', optimize=True)

    glyph = first_glyph(ink)
    # Browsers do not round a tab icon, so the small ones are rounded here.
    # iOS masks the touch icon itself, so that one stays a full square.
    tab_icon(glyph, 16, rounded=True, thicken=9).save(ICON_OUT / 'favicon-16.png', optimize=True)
    tab_icon(glyph, 32, rounded=True, thicken=5).save(ICON_OUT / 'favicon-32.png', optimize=True)
    tab_icon(glyph, 180, rounded=False).save(ICON_OUT / 'apple-touch-icon.png', optimize=True)

    # The flag edition is photographic and multicoloured, so it is neither
    # tinted nor reversed — it is only ever drawn on the warm white header.
    # It is stored as lossless WebP: lossy WebP subsamples colour, which
    # fringes the hard red, green and black edges where the ribbon crosses
    # the letters, and those edges are the whole design.
    if RIBBON.exists():
        ribbon = scaled(trim(Image.open(RIBBON).convert('RGBA')), LOGO_HEIGHT)
        ribbon.save(LOGO_OUT / 'logo-ribbon.webp', 'WEBP', lossless=True, method=6)
        print(f'ribbon  {ribbon.width}x{ribbon.height}  ->  logo-ribbon.webp')

    print(f'source  {source.width}x{source.height}  ink {ink.width}x{ink.height}')
    print(f'logo    {logo.width}x{logo.height}  ->  logo-ink.png, logo-paper.png')
    print(f'glyph   {glyph.width}x{glyph.height}  ->  favicon-16, favicon-32, apple-touch-icon')


if __name__ == '__main__':
    main()
