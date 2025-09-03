/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'success-bounce': 'success-bounce 0.6s ease-out',
        'success-pulse': 'success-pulse 0.3s ease',
      }
    },
  },
  plugins: [],
}