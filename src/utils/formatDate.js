const moment = require("moment");

function formatDate(date) {
    return moment(date).locale('pt-br').format('D [de] MMMM [de] YYYY [às] HH:mm');
 }

 module.exports = formatDate