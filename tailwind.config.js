/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep green-black. Gulf perfumery packaging lives in this register,
        // and it lets the accent be jade rather than metal — the failure mode
        // this brand has already been through once.
        midnight: {
          950: '#08130f',
          900: '#0c1a15',
          850: '#10211b',
          800: '#152a22',
          700: '#1e3a2f',
          600: '#2b5144',
        },
        jade: {
          200: '#b6e3d2',
          300: '#7fc9b0',
          400: '#4ea88c',
          500: '#2f8a6e',
          600: '#1f6f5c',
        },
        // Decorative only — 3.8:1 on the ground, so never used for text.
        lapis: {
          400: '#4a6fb5',
          600: '#26467f',
        },
        // The warm note, rationed hard. Saffron is a fragrance in the
        // catalogue, not a metal.
        saffron: {
          300: '#e4b35f',
          500: '#c8862a',
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
