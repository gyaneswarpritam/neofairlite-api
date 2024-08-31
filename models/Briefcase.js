var mongoose = require("mongoose");

var briefcaseSchema = new mongoose.Schema(
    {
        stall: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stall",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProductsList",
            required: true,
        },
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor",
            required: true,
        },
        visitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor",
            required: true,
        },
        catalog: { type: Boolean, default: false },
        catalogApprove: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

briefcaseSchema.index({ exhibitor: 1 });
briefcaseSchema.index({ product: 1 });
briefcaseSchema.index({ visitor: 1 });

module.exports = mongoose.model("Briefcase", briefcaseSchema);
