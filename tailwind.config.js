/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%) skewX(-12deg)' },
          '100%': { transform: 'translateX(200%) skewX(-12deg)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1s ease-out'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 