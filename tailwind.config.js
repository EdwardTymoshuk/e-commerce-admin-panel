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
       "secondary-lighter-color": "var(--color-secondary-lighter)",
       "danger-color": "var(--color-danger)",
       "danger-lighter-color": "var(--color-danger-lighter)",
       "success-color": "var(--color-success)",
       "success-lighter-color": "var(--color-success-lighter)",
       "logo-color": "var(--color-logo)",
       "page-color": "var(--color-page)",
       "dark-text-color": "var(--dark-text-color)",
       "text-color": "var(--text-color)",
      },
      screens: {
        'sm-plus': '600px',
      },
    },
  },
  plugins: [],
  important: true,
}