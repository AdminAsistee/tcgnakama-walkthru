/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#e8c06a',
          dark: '#9a7a30',
        },
        navy: {
          DEFAULT: '#0a0e1a',
          surface: '#0d1526',
          elevated: '#111d35',
          border: '#1e2d4a',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        foilSweep: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '400% center' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pulse_gold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(201,168,76,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(201,168,76,0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-2%, -3%)' },
          '20%': { transform: 'translate(3%, 1%)' },
          '30%': { transform: 'translate(-1%, 4%)' },
          '40%': { transform: 'translate(4%, -2%)' },
          '50%': { transform: 'translate(-3%, 2%)' },
          '60%': { transform: 'translate(1%, -4%)' },
          '70%': { transform: 'translate(-4%, 1%)' },
          '80%': { transform: 'translate(2%, 3%)' },
          '90%': { transform: 'translate(-1%, -2%)' },
        },
        ticker: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0%)', opacity: '1' },
        },
      },
      animation: {
        foilSweep: 'foilSweep 3s linear infinite',
        blink: 'blink 1s ease-in-out infinite',
        pulse_gold: 'pulse_gold 2s ease-in-out infinite',
        float: 'float 4s ease-in-out infinite',
        grain: 'grain 8s steps(10) infinite',
        ticker: 'ticker 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}
