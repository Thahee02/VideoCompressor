/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#e6f3f8',
          100: '#b3dff0',
          200: '#80cbe7',
          300: '#4db7df',
          400: '#1aa3d7',
          500: '#005A85',
          600: '#005177',
          700: '#004363',
          800: '#00364f',
          900: '#00283b',
        },
        primary: '#005A85',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
