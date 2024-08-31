var mongoose = require("mongoose");

var FlashMessageSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        userType: { type: String, required: true },
        status: { type: String, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

FlashMessageSchema.index({ title: 1 });

module.exports = mongoose.model("FlashMessage", FlashMessageSchema);
