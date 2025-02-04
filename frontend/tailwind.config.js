

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode using class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily : {
         title : ["Bungee Hairline", "sans-serif"]
      },
      animation : {
        tilt : "tilt 10s infinite linear "
      },
      keyframes : {
        tilt : {
          "0% 50% 100%" : {
            transform : "rotate(0deg)"
          },
          "25%" : {
             transform : "rotate(1deg)"
          },
          "50%" : {
            transform : "rotate(-1deg)"
          }
        }
      }
    },
  },
  plugins: [],
}