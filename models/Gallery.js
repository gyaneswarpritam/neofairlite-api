var mongoose = require("mongoose");

var gallerySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        url: { type: String },
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "exhibitor",
            required: true,
        },
        active: { type: String, default: true },
        type: { type: String, default: "video", enum: ['video', "image"] },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

gallerySchema.index({ title: 1 });
gallerySchema.index({ exhibitor: 1 });



module.exports = mongoose.model("Gallery", gallerySchema);
