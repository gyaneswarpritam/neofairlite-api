var mongoose = require("mongoose");

var visualSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: { type: String, enum: ["pdf", "video"], required: true },
        media: { type: String },
        url: { type: String },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

visualSchema.index({ title: 1 });
visualSchema.index({ type: 1 });

module.exports = mongoose.model("Visual", visualSchema);
