// models/Log.js
const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    method: String,
    url: String,
    ip: String,
});

module.exports = mongoose.model('Log', logSchema);
