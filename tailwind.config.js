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
          0: '#ffffff',      // Fundo principal em light mode (páginas, cards brancos puros, telas limpas). 
          // Use em: body principal light, cards elevados, modais light, áreas de destaque branco.

          50: '#f9fafb',     // Fundo muito claro / "quase branco" – ideal para hover states sutis, 
          // secondary backgrounds ou camadas leves em light mode.
          // Use em: hover em cards, input backgrounds, subtle dividers em light.

          100: '#f3f4f6',     // Cinza bem claro – o mais usado para fundos secundários em light mode.
          // Use em: feed background, navbar light, cards com leve elevação, listas.

          200: '#e5e7eb',     // Cinza médio-claro – ótimo para bordas, divisores e fundos terciários.
          // Use em: border-light, separadores entre posts, input borders em light.

          300: '#d1d5db',     // Cinza médio – usado em textos muted, ícones inativos, bordas mais visíveis.
          // Use em: texto secundário claro, ícones desabilitados, linhas de separação fortes.

          // ------------------------------------------------------
          // A partir daqui começam os tons escuros (para dark mode)
          // ------------------------------------------------------

          800: '#1f2937',     // Cinza escuro médio-alto – fundo de cards, navbar ou elementos elevados em dark mode.
          // Use em: cards dark, modais dark, header/footer dark, áreas destacadas.

          900: '#111827',     // Cinza muito escuro – fundo principal em dark mode (quase preto, mas com calor).
          // Use em: body principal dark, feed background dark, telas principais.

          950: '#0b0f19',     // Quase preto puro (off-black) – o mais escuro da paleta.
          // Use em: fundo de modals/bottom sheets em dark, overlays escuros, 
          // áreas de alto contraste (ex: player de vídeo full-screen, drawer fundo).
          // Dá sensação de profundidade e economiza bateria em OLED/AMOLED.
        },

        // Textos
        text: {
          primary: '#0f172a',     // Light mode
          secondary: '#636466',
          gray: '#282829',
          light: '#939598',       // Para usar em fundos escuros
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

