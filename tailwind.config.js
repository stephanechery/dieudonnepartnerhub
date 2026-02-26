/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 10px 30px -16px rgb(15 23 42 / 0.25)"
      }
    }
  },
  plugins: []
};
