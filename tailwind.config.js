/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.vue"],
  darkMode: 'class', // Telegram usa 'class' (muda manualmente no app)

  theme: {
    extend: {
      colors: {
        // Primária (botões principais, links destacados, ícones ativos)
        primary: {
          50: '#f0f5ff',
          100: '#e5ecff',
          200: '#cddfff',
          300: '#a6c1ff',
          400: '#7a9fff',
          500: '#4d7dff',   // ← cor principal (use como base)
          600: '#3a66e6',
          700: '#2e52cc',
          800: '#2540a3',
          900: '#1f347a',
        },

        // Secundária (destaques secundários, hover em alguns elementos)
        secondary: {
          500: '#f7f7f8',
          600: '#7c3aed',
        },

        // Acentos (notificações, likes, success)
        accent: {
          500: '#ec4899',   // Pink/magenta vibrante
        },

        // Neutros – muito importantes para dark/light
        surface: {
          0: '#ffffff',     // Light: fundo principal
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          800: '#1f2937',
          900: '#111827',
          950: '#0b0f19',    // Dark: fundo principal quase preto
        },

        // Textos
        text: {
          primary: '#0f172a',     // Light mode
          secondary: '#636466',
          muted: '#636466',
          inverse: '#f1f5f9',     // Para usar em fundos escuros
        },

        // Bordas / Divisores
        border: {
          light: '#dee0e1',
          dark: '#334155',
        },
      },
      fontFamily: {
        primary: ['Roboto', 'sans-serif'], // Fonte principal
      }
    },
  }
}

