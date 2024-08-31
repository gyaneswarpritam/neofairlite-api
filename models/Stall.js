var mongoose = require("mongoose");

var stallSchema = new mongoose.Schema(
    {
        stallName: { type: String, required: true },
        stallDescription: { type: String },
        certifications: { type: Object },
        visitng_card_details: { type: Object },
        stall_details: { type: Object },
        social_media: { type: Object },
        stallImage: { type: String },
        stallLogo: { type: String },
        companyLogo: { type: String },
        position: { type: String, default: "" },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor"
        },
    },
    {
        timestamps: true,
    }
);

stallSchema.index({ exhibitor: 1 });
stallSchema.index({ stallName: 1 });

module.exports = mongoose.model("Stall", stallSchema);
