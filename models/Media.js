var mongoose = require("mongoose");

var mediaSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        media: { type: String, required: true },
        description: { type: String, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

mediaSchema.index({ title: 1 });

module.exports = mongoose.model("Media", mediaSchema);
