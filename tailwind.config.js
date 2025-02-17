/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.vue"],
  theme: {
    extend: {
      colors: {
        primary: "#1d9bf0",
        border: "rgb(207, 217, 222)",
        light: "rgba(0,0,0,0.04)",
        title: "rgb(15, 20, 25)",
        muted: "#536471",
        liked: "#f91880",
        reKooled: "#00ba7c"
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'], // Fonte principal
      },
      screens: {
        'zoom-110': { max: '1745px' }, // Tamanho aproximado para 110% no zoom
      },
    },
  }
}

