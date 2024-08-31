var mongoose = require("mongoose");

var directorySchema = new mongoose.Schema(
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

directorySchema.index({ title: 1 });

module.exports = mongoose.model("Directory", directorySchema);
