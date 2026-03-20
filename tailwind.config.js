/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg:      "#000000",
        bg1:     "#0d0d0f",
        bg2:     "#1c1c1e",
        bg3:     "#2c2c2e",
        bg4:     "#3a3a3c",
        blue:    "#0A84FF",
        green:   "#30D158",
        orange:  "#FF9F0A",
        red:     "#FF453A",
        teal:    "#5AC8F5",
        purple:  "#BF5AF2",
        yellow:  "#FFD60A",
        pink:    "#FF375F",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans","Helvetica Neue","Arial","sans-serif"],
        mono: ["JetBrains Mono","SF Mono","Menlo","monospace"],
      },
      backdropBlur: { glass: "20px" },
    },
  },
  plugins: [],
}

