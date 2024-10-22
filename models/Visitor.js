const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        validate: {
            validator: function (value) {
                // If verification is "email", then email is required
                return this.verification === 'email' ? !!value && value.trim() !== '' : true;
            },
            message: 'Email is required and cannot be empty when verification method is email.'
        },
        default: ''
    },
    companyName: { type: String, required: true },
    phone: {
        type: String,
        validate: {
            validator: function (value) {
                // If verification is "sms", then phone is required
                return this.verification === 'sms' ? !!value && value.trim() !== '' : true;
            },
            message: 'Phone number is required and cannot be empty when verification method is Whatsapp.'
        },
        default: ''
    },
    password: {
        type: String,
        validate: {
            validator: function (value) {
                // If verification is "email", password is required
                return this.verification === 'email' ? !!value && value.trim() !== '' : true;
            },
            message: 'Password is required and cannot be empty when verification method is email.'
        },
        default: ''
    },
    verification: { type: String, required: true }, // 'sms' or 'email'
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    phoneVerified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    loggedInTime: { type: String, default: '' },
    loggedInIP: { type: String, default: '' },
    deleted: { type: Boolean, default: false },
    loggedIn: { type: Boolean, default: false },
    active: { type: String, default: 'true' },
    reject: { type: String, default: 'false' },
    blocked: { type: String, default: 'false' },
}, {
    timestamps: true,
});



module.exports = mongoose.model('Visitor', visitorSchema);
