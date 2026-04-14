/** @type {import('tailwindcss').Config} */
module.exports = {
  // 🔥 DARK MODE ENABLED HERE
  darkMode: "class", 
  
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#1e293b",
        accent: "#f59e0b",
      },

      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.05)",
        strong: "0 20px 60px rgba(0,0,0,0.12)",
      },

      borderRadius: {
        xl2: "1.25rem",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },

      animation: {
        fadeIn: "fadeIn 0.4s ease-in-out",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};