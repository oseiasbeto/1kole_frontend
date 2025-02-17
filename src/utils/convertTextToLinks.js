const convertTextToLinks = (text) => {
    return text.replace(/((?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[\w\d%#.&=~-]*)?|(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?)/g, match => {
        const url = match.startsWith('http') ? match : `https://${match}`;
        return `<a href="${url}" target="_blank" class="text-primary hover:underline" onclick="event.stopPropagation()">${match}</a>`;
    }).replace(/(#\w+|@\w+)/g, match => {
        return `<a href="#" class="text-primary hover:underline" onclick="event.stopPropagation()">${match}</a>`;
    });
}

module.exports = convertTextToLinks