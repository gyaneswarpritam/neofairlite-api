var mongoose = require("mongoose");

var brochureSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        media: { type: String, required: true },
        url: { type: String, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

brochureSchema.index({ title: 1 });

module.exports = mongoose.model("Brochure", brochureSchema);
