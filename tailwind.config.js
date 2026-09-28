/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Surfaces: near-black carrying the brand green's own hue (155.6deg),
        // so the ground reads as a darkened Arab Green rather than a grey.
        midnight: {
          950: '#08140f',
          900: '#0b1b15',
          850: '#0f211a',
          800: '#152b22',
          700: '#233e33',
          600: '#345548',
        },
        // Rolex "Arab Green". 600 is the exact brand value and is a FILL only:
        // at 2.45:1 on the ground it cannot carry text. The lighter tints are
        // desaturated derivations — at full saturation they go neon, which is
        // the opposite of what this brand is.
        green: {
          200: '#a6d3c1',
          300: '#79c3a5',
          400: '#43b185',
          500: '#218c61',
          600: '#006039',
          700: '#004d2e',
        },
        // Rolex "Boy Gold". 500 is the exact brand value, used for fills,
        // borders and the vial's seal; 300 carries gold TEXT, where 500 is
        // only 4.99:1 and too tight for an 11px label.
        gold: {
          200: '#e7d3a7',
          300: '#dabb77',
          400: '#cda347',
          500: '#a37e2c',
        },
        pearl: {
          50: '#f6f2e9',
          100: '#ebe5d8',
          200: '#d6cfbe',
          300: '#a9a696',
          400: '#8b8e85',
        },
        alert: {
          400: '#e98c7a',
          600: '#c2503a',
        },
      },
      fontFamily: {
        // Latin display stays Cormorant Garamond, as asked for by name.
        display: ['"Cormorant Garamond"', 'Garamond', 'Georgia', 'serif'],
        // Geometric Kufi: the Arabic counterpart to a display serif, and the
        // shape language the mashrabiya lattice is drawn from.
        'display-ar': ['"Reem Kufi"', '"Noto Kufi Arabic"', 'serif'],
        sans: ['Jost', 'Futura', 'system-ui', '-apple-system', 'sans-serif'],
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
