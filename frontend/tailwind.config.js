/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#3A0088",        // deep purple
        secondary: "#121212",      // dark background base
        surface: "#1E1E1E",        // panels / cards
        accent: "#FFFFFF",          // text/icons highlights
        neutral: "#E0E0E0",         // brighter gray for readability
        highlight: "#9B59B6",       // hover/glow purple
        gradientStart: "#3A0088",   // for background gradients
        gradientEnd: "#9B59B6",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(58, 0, 136, 0.6)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #3A0088 0%, #9B59B6 100%)",
        "panel-gradient": "linear-gradient(180deg, #1E1E1E 0%, #121212 100%)",
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
    },
  },
  plugins: [],
};
