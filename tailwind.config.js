/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can add the specific grays from your design here
        brandGray: {
          light: '#E5E5E5', // Top of login
          dark: '#8E9091',  // Bottom of login
        }
      },
    },
  },
  plugins: [],
}
