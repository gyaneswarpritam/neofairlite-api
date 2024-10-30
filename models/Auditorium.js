var mongoose = require("mongoose");

var auditoriumSchema = new mongoose.Schema(
    {
        url: { type: String, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

auditoriumSchema.index({ url: 1 });

module.exports = mongoose.model("Auditorium", auditoriumSchema);
