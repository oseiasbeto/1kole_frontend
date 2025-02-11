/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.vue"],
  theme: {
    extend: {
      colors: {
        primary: "#1d9bf0",
        liked: "#ec4899",
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

