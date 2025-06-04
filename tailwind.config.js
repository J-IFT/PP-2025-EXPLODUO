/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        reveal: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 }
        }
      },
      animation: {
        reveal: 'reveal 0.2s ease-out forwards'
      }
    },
  },
  plugins: [],
};