/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
       "primary-color": "var(--color-primary)",
       "secondary-color": "var(--color-secondary)",
       "danger-color": "var(--color-danger)",
       "success-color": "var(--color-success)",
       "logo-color": "var(--color-logo)",
       "page-color": "var(--color-page)"
      },
      screens: {
        'sm-plus': '600px',
      },
    },
  },
  plugins: [],
}