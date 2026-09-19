/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Primary reading surface. Cormorant Garamond's serifs are 12/1000em
        // and survive on light grounds but wash out reversed on dark, so paper
        // is the default and noir is the punctuating surface, not the reverse.
        paper: {
          50: '#faf7f1',
          100: '#f4efe5',
          200: '#ebe4d6',
          300: '#dcd3c1',
          400: '#c4b9a3',
        },
        // Immersive surfaces: hero, cart drawer, checkout. Warm, never pure
        // black — #f2efe9 on a warm near-black nearly doubles hairline survival
        // versus #fff on #000.
        noir: {
          950: '#141210',
          900: '#1c1916',
          800: '#26221d',
          700: '#3a352e',
          600: '#575046',
          500: '#6a6355',
          400: '#9c9384',
        },
        // Validation only. Distinct from oxblood (which is the brand accent)
        // and dark enough to clear AA on every paper tint — Tailwind's default
        // red-300 managed 1.8:1 here, i.e. invisible.
        alert: {
          600: '#9c3520',
          100: '#e9cfc6',
        },
        // Sealing-wax oxblood: the apothecary's label ink. Replaces metal
        // entirely — no gold, no bronze, no champagne.
        oxblood: {
          700: '#5c2230',
          600: '#6e2c3c',
          500: '#8a3a4c',
          300: '#c98c98',
        },
      },
      fontFamily: {
        // Display only, never below 20px. See src/index.css for the ramp.
        display: ['"Cormorant Garamond"', 'Garamond', 'Georgia', 'serif'],
        // x-height 0.460 against Cormorant's 0.386 — the closest match on
        // Google Fonts, so the two do not fight at adjacent sizes.
        sans: ['Jost', 'Futura', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        // Cormorant's caps are fitted for lowercase-adjacent use and need
        // opening up; below 0.08em all-caps settings read cramped.
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
