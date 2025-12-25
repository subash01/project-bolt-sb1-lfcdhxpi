/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#EE4961',
        'primary-dark': '#45546E',
        'secondary-gray': '#8B95A5',
        'secondary-amber': '#F7A713',
        'secondary-purple': '#6764AB',
        'secondary-coral': '#EC5F6E',
        'secondary-light': '#C1C1BF',
        'sidebar-dark': '#1E2A3B',
        'sidebar-hover': '#2A3A4E',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
