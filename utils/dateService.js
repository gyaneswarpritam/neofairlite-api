const moment = require('moment');

function convertToUTC(dateString) {
    return moment.utc(dateString).format();
}

module.exports = { convertToUTC }