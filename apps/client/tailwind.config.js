const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Ysabeau Office", ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        "8xl": "90rem",
      },
      colors: {
        black: "#1a1a1a",
        primary: {
          ...colors.cyan,
          DEFAULT: colors.cyan[500],
        },
        neutral: {
          ...colors.zinc,
          DEFAULT: colors.zinc[500],
        }
      }
    },
  },
  plugins: [],
}