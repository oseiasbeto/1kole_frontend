/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.vue"],
  darkMode: 'class', // Telegram usa 'class' (muda manualmente no app)
  theme: {
    extend: {
      colors: {
        primary: "#1d9bf0",
        border: "rgb(119 119 119)",
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

