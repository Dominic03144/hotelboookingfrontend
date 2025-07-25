/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lightBlue: {
          DEFAULT: "#3ABAFD", // Use this instead of dark blue
          dark: "#0284c7",
        },
        sectionGray: "#f3f4f6", // Light gray for "How it works" section
      },
      backgroundImage: {
        'find-stay-pattern': "url('/src/assets/home/find-stay-bg.jpg')", // customize your path
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
