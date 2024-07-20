/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '30p': '30%',
        '47p': '47.33%',
        '31p': '31%',
        '23p': '23%',
      }
    },
  },
  plugins: [],
}