const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
    {
        location: { type: String, required: true },
        country: { type: String, required: true },
        fairName: { type: String, required: true },
        startDateTime: { type: Date, required: true }, // Date fields automatically store in UTC
        endDateTime: { type: Date, required: true },   // Date fields automatically store in UTC
        timezone: { type: String, required: true },
        duration: { type: String, required: true },
        blockVisitorLogin: { type: Boolean, default: false },
        blockExhibitorLogin: { type: Boolean, default: false },
        blockMessage: { type: Object },
        inauguration: { type: Boolean, default: false },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields in UTC
    }
);

// Add indexes for startDateTime and endDateTime
settingSchema.index({ startDateTime: 1 });
settingSchema.index({ endDateTime: 1 });

module.exports = mongoose.model("Setting", settingSchema);
