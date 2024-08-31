var mongoose = require("mongoose");

var hallSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

hallSchema.index({ name: 1 });

module.exports = mongoose.model("Hall", hallSchema);
