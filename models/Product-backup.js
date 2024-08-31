var mongoose = require("mongoose");

var productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        fileType: { type: String, enum: ['secured', 'downloadable'] },
        file: { type: String },
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "exhibitor",
            required: true,
        },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

productSchema.index({ title: 1 });
productSchema.index({ fileType: 1 });
productSchema.index({ exhibitor: 1 });



module.exports = mongoose.model("Product", productSchema);
