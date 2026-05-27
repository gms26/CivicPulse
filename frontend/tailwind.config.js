/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e40af', // deep blue
          light: '#3b82f6',
          dark: '#1e3a8a',
        },
        accent: {
          DEFAULT: '#f59e0b', // amber
          light: '#fbbf24',
          dark: '#d97706',
        },
        success: {
          DEFAULT: '#16a34a', // green
          light: '#22c55e',
          dark: '#15803d',
        },
        danger: {
          DEFAULT: '#dc2626', // red
          light: '#ef4444',
          dark: '#b91c1c',
        }
      }
    },
  },
  plugins: [],
}
