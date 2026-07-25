/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EDF7F4',
          100: '#D5EDE6',
          200: '#A9DBCD',
          300: '#74C3B0',
          400: '#3FA48D',
          500: '#1B8571',
          600: '#0F6B5C',
          700: '#0C564A',
          800: '#0A443B',
          900: '#07332C',
          950: '#041F1B',
        },
        gold: {
          50: '#FBF7EC',
          100: '#F5EDD4',
          200: '#EADAA5',
          300: '#DCC272',
          400: '#CCA84A',
          500: '#B8903A',
          600: '#9C7530',
          700: '#7C5B28',
          800: '#5F4520',
          900: '#463317',
        },
        surface: '#FFFFFF',
        canvas: '#FAFAF8',
        ink: {
          DEFAULT: '#26272B',
          soft: '#52525B',
          muted: '#8E8E96',
          faint: '#B8B8BF',
        },
        line: '#E8E7E2',
        ai: {
          50: '#F6F3FC',
          100: '#EDE7F9',
          200: '#DBCEF2',
          300: '#BEA8E6',
          500: '#8B5CF6',
          600: '#7C4DE0',
          700: '#6636C4',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 24, 22, 0.04), 0 1px 6px rgba(20, 24, 22, 0.05)',
        raised: '0 2px 6px rgba(20, 24, 22, 0.06), 0 10px 28px rgba(20, 24, 22, 0.09)',
        overlay: '0 8px 16px rgba(15, 23, 20, 0.10), 0 24px 64px rgba(15, 23, 20, 0.18)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.45' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.25s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
        'slide-in-right': 'slide-in-right 0.28s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-soft': 'pulse-soft 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
