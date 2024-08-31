// middleware/mongoLogger.js
const fs = require('fs');
const path = require('path');
const Log = require('../models/Log');

const logDirectory = path.join(__dirname, '..', 'logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const mongoLogger = async (req, res, next) => {
    try {
        const logEntry = new Log({
            method: req.method,
            url: req.originalUrl,
            ip: req.ip,
        });

        await logEntry.save();
        next();
    } catch (error) {
        console.error('Error logging request:', error);
        next(error);
    }
};

module.exports = mongoLogger;
