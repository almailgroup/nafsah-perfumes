/**
 * The logo. Every file here is derived by scripts/logo.py from the uploads in
 * assets/website-logo/; this module only decides which one the header shows.
 *
 * To switch, change ACTIVE_LOGO. Nothing else needs to move.
 */
import plainLogo from './assets/logo/logo-ink.png'
import ribbonLogo from './assets/logo/logo-ribbon.webp'
import reversedLogo from './assets/logo/logo-paper.png'

const HEADER_LOGOS = {
  // NafsahLogo.png — the plain wordmark, 4.4:1.
  plain: { src: plainLogo, width: 528, height: 120, className: 'h-[26px] sm:h-8' },
  // NAFSAHKuwaitFlagRibbonLogo.png — the flag edition, 3.68:1. Drawn a little
  // taller than the plain mark so it takes the same width in the header, and
  // so the three stripes stay readable rather than collapsing into a smudge.
  ribbon: { src: ribbonLogo, width: 441, height: 120, className: 'h-8 sm:h-10' },
}

/** 'plain' or 'ribbon'. */
export const ACTIVE_LOGO = 'ribbon'

export const HEADER_LOGO = HEADER_LOGOS[ACTIVE_LOGO]

/*
 * The footer is Arab Green. The flag edition cannot sit on it: its black
 * lettering drops to about 2:1 there, and the flag's own green stripe and
 * black hoist dissolve into the ground. Recolouring the letters would recolour
 * the hoist with them, since the N overlaps it. So the footer always carries
 * the plain wordmark, reversed out in paper, whichever logo the header shows.
 */
export const FOOTER_LOGO = { src: reversedLogo, width: 528, height: 120 }
