/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        campus: {
          dark: '#1B3A5C',
          blue: '#4A7FB5',
          red: '#E8533F',
          green: '#4CAF50',
        },
      },
    },
  },
  plugins: [],
};
