var mongoose = require("mongoose");

var webinarSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        url: { type: String, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

webinarSchema.index({ title: 1 });

module.exports = mongoose.model("Webinar", webinarSchema);
