/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef0ff",
          100: "#e0e2ff",
          200: "#c7c9ff",
          300: "#a5a4ff",
          400: "#8a80ff",
          500: "#6359ff",
          600: "#5346f5",
          700: "#4536d8",
          800: "#392eae",
          900: "#332c89",
        },
        ink: {
          DEFAULT: "#0f172a",
          soft: "#334155",
          faint: "#64748b",
        },
        accent: {
          DEFAULT: "#facc15",
          600: "#eab308",
        },
        surface: "#eef0f9",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
