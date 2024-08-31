var mongoose = require("mongoose");

var FaqSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

FaqSchema.index({ title: 1 });

module.exports = mongoose.model("Faq", FaqSchema);
