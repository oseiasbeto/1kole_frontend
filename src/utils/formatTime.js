const moment = require("moment")

function formatTime(date) {
    const now = moment();
    const duration = moment.duration(now.diff(date));

    // Verificando se a diferença é inferior a 1 minuto (caso em que é 'Agora')
    if (duration.asSeconds() < 60) {
        return 'Agora';
    }

    // Checando se a diferença é em minutos
    if (duration.asMinutes() < 60) {
        return `${Math.floor(duration.asMinutes())}m`; // Exemplo: "14m"
    }

    // Checando se a diferença é em horas
    if (duration.asHours() < 24) {
        return `${Math.floor(duration.asHours())}h`; // Exemplo: "14h"
    }

    // Checando se a diferença é em dias
    if (duration.asDays() < 30) {
        return `${Math.floor(duration.asDays())}d`; // Exemplo: "5d"
    }

    // Checando se a diferença é em meses
    if (duration.asMonths() < 12) {
        return `${Math.floor(duration.asMonths())}m`; // Exemplo: "3m"
    }

    // Caso a diferença seja em anos
    return `${Math.floor(duration.asYears())}a`; // Exemplo: "2a"
}

module.exports = formatTime