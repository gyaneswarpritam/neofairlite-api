// models/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '15m' // OTP expires in 15 minutes
    }
});

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;