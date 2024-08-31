var mongoose = require("mongoose");

var stallVideoSchema = new mongoose.Schema(
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
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

stallVideoSchema.index({ title: 1 });
stallVideoSchema.index({ exhibitor: 1 });



module.exports = mongoose.model("StallVideo", stallVideoSchema);
