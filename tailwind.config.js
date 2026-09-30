/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * PRIMARY — paper. The header's warm white, promoted to the whole
         * site. Never pure #fff: against ink it reads as paper rather than
         * as a hole, and it is the ground everything else is measured on.
         */
        snow: {
          50: '#fbfaf7', // the page
          100: '#f3f1ea', // tinted panel — vial plates, raised blocks
          200: '#e6e2d8', // hairline
          300: '#cfcabb', // strong hairline on paper; muted text on green
          600: '#4a5550', // muted text on paper — 7.34:1
        },
        // Ink. Near-black carrying the brand green's hue (155.6deg), so type
        // sits in the same family as the greens rather than reading as grey.
        ink: {
          950: '#08140f', // 18.0:1 on paper
        },
        /*
         * SECONDARY — Rolex "Arab Green". 600 is the exact brand value and,
         * unlike on the old dark ground, it carries text here: 7.36:1 on
         * paper. 700 is the deep ground for the bands that break up the
         * white; 300 is the only accent allowed on top of those bands.
         */
        green: {
          300: '#79c3a5', // 4.84:1 on green-700
          600: '#006039', // BRAND
          700: '#004d2e', // deep ground — the mid-page band and the footer
        },
        /*
         * Rolex "Boy Gold". The header's discipline, applied everywhere: gold
         * is a hairline, a seal and a rule — never text on paper, where the
         * brand value manages only 3.61:1 and no lighter tint can pass. 300
         * is for gold text on a green ground only (5.37:1 on green-700).
         */
        gold: {
          300: '#dabb77',
          500: '#a37e2c', // BRAND
        },
        alert: {
          600: '#b0452f', // 5.42:1 on paper
        },
      },
      fontFamily: {
        // Jost carries the whole Latin side, display and UI alike. Measured at
        // 100px: cap 0.700 against Marcellus' 0.710, so it takes over the
        // display sizes unchanged; x-height 0.460 against Inter's 0.550, so
        // lowercase UI text is set a step larger to hold its apparent size.
        // Being 11% narrower than Inter, that step costs almost no width.
        display: ['Jost', 'Futura', 'Century Gothic', 'sans-serif'],
        sans: ['Jost', 'Futura', 'system-ui', '-apple-system', 'sans-serif'],
        // Jost has no Arabic, so the Arabic side keeps its own pair. Reem Kufi
        // is geometric Kufi, which now sits closer to the Latin than the
        // inscriptional serif it replaced.
        'display-ar': ['"Reem Kufi"', '"Noto Kufi Arabic"', 'sans-serif'],
        'sans-ar': ['"IBM Plex Sans Arabic"', '"Noto Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.16em',
        wide2: '0.1em',
      },
      transitionDuration: { 400: '400ms' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.98) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
