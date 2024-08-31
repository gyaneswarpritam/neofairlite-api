var mongoose = require("mongoose");

var locationChargesSchema = new mongoose.Schema(
    {
        location: { type: String, required: true },
        price: { type: String, required: true },
        currency: { type: String, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

locationChargesSchema.index({ location: 1 });
locationChargesSchema.index({ price: 1 });

module.exports = mongoose.model("LocationCharges", locationChargesSchema);
