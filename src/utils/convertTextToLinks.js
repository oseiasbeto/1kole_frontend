// arquivo: textProcessor.js
const processTextForLinksAndHashtags = (text) => {
    // Divide o texto em palavras, preservando espaços
    const parts = text.split(/(\s+)/);
  
    // Padrões para links e hashtags
    const linkPattern = /^(https?:\/\/[^\s]+|[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)$/i;
    const hashtagPattern = /^#\w+$/;
  
    // Processa cada parte
    const processedParts = parts.map((part) => {
      // Mantém espaços e quebras de linha intactos
      if (/\s+/.test(part)) {
        return part;
      }
  
      // Converte links
      if (linkPattern.test(part)) {
        const href = part.startsWith('http') ? part : `https://${part}`;
        return `<a href="${href}" target="_blank" class="text-primary hover:underline">${part}</a>`;
      }
  
      // Converte hashtags
      if (hashtagPattern.test(part)) {
        const tag = part.slice(1);
        return `<a href="/hashtag/${tag}" target="_blank" class="text-primary hover:underline">${part}</a>`;
      }
  
      // Retorna parte sem alteração se não for link ou hashtag
      return part;
    });
  
    // Junta tudo de volta
    return processedParts.join('');
  };
  
  module.exports = processTextForLinksAndHashtags;