var mongoose = require("mongoose");

var organizerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String },
        budget: { type: String, required: true },
        interest: { type: String, required: true },
        eventType: { type: String, required: true },
        deleted: { type: Boolean, default: false },
        active: { type: String, default: true },
    },
    {
        timestamps: true,
    }
);

organizerSchema.index({ email: 1, delete: 1 }, { unique: true });
organizerSchema.index({ phone: 1 });
organizerSchema.index({ type: 1 });
organizerSchema.index({ name: 1 });

module.exports = mongoose.model("Organizer", organizerSchema);
