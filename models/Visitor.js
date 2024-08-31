const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    companyName: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    verification: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    loggedInTime: { type: String, default: '' },
    loggedInIP: { type: String, default: '' },
    deleted: { type: Boolean, default: false },
    loggedIn: { type: Boolean, default: false },
    active: { type: String, default: true },
    reject: { type: String, default: false },
    blocked: { type: String, default: false },
},
    {
        timestamps: true,
    });
visitorSchema.index({ email: 1, delete: 1 }, { unique: true });
visitorSchema.index({ phone: 1 });
visitorSchema.index({ name: 1 });
module.exports = mongoose.model('Visitor', visitorSchema);
