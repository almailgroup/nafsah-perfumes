/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm near-blacks. A neutral grey-black reads as "tech"; the warm
        // cast reads as paper stock and ink.
        ink: {
          950: '#0a0a09',
          900: '#0f0f0e',
          850: '#151413',
          800: '#1c1b19',
          700: '#292724',
          600: '#3a3733',
        },
        // The workhorse. Text, primary buttons, active states — everything the
        // old palette used gold for.
        bone: {
          50: '#faf8f4',
          100: '#efeae2',
          200: '#ddd6ca',
          300: '#b9b1a4',
          400: '#8b847a',
          500: '#625c54',
        },
        // Deliberately desaturated (24% vs the old gold's 47%) and rationed to
        // micro-labels, focus rings and the shipping meter. Nothing else.
        sand: {
          200: '#e0d5c4',
          300: '#c9bba6',
          400: '#ad9c85',
          500: '#8b7c68',
        },
      },
      fontFamily: {
        // A didone for display: the high stroke contrast reads couture rather
        // than wedding-invitation, and it holds up at large sizes on dark.
        display: ['"Bodoni Moda"', 'Didot', '"Times New Roman"', 'serif'],
        // Geometric sans for everything else — fashion-house UI voice.
        sans: ['Jost', 'Futura', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        luxe: '0.34em',
        wider2: '0.18em',
      },
      transitionDuration: {
        400: '400ms',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.97) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
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
