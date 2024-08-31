var mongoose = require("mongoose");

var galleryVideoList = new mongoose.Schema(
    {
        title: { type: String },
        url: { type: String },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
        stall: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "stall"
        },
    },
    {
        timestamps: true,
    }
);

galleryVideoList.index({ url: 1 });

module.exports = mongoose.model("GalleryVideoList", galleryVideoList);
