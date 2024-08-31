const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: false }
    // Add other fields as needed
});

module.exports = mongoose.model('Admin', adminSchema);
