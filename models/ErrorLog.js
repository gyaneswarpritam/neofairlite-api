// models/ErrorLog.js
const mongoose = require('mongoose');

const errorLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    message: { type: String, required: true },
    stack: { type: String }
});

module.exports = mongoose.model('ErrorLog', errorLogSchema);
