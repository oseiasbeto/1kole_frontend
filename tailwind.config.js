/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.vue"],
  theme: {
    extend: {
      colors: {
        primary: "#5448ee",
        border: "rgb(207, 217, 222)",
        light: "rgba(0,0,0,0.04)",
        title: "rgb(8 5 27)",
        gray: "rgb(101 97 117)",
        verified: "rgb(255 71 117)",
        liked: "rgb(255 95 135)",
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

