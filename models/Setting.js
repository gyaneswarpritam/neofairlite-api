var mongoose = require("mongoose");

var settingSchema = new mongoose.Schema(
    {
        location: { type: String, required: true },
        country: { type: String, required: true },
        fairName: { type: String, required: true },
        startDateTime: { type: String, required: true },
        endDateTime: { type: String, required: true },
        timezone: { type: String, required: true },
        duration: { type: String, required: true },
        isPayment: { type: Boolean, default: false },
        blockVisitorLogin: { type: Boolean, default: false },
        blockExhibitorLogin: { type: Boolean, default: false },
        blockMessage: { type: Object },
        inauguration: { type: Boolean, default: false },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

settingSchema.index({ startDateTime: 1 });
settingSchema.index({ endDateTime: 1 });

module.exports = mongoose.model("Setting", settingSchema);
