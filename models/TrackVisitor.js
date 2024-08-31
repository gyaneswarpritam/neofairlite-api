var mongoose = require("mongoose");

var TrackVisitor = new mongoose.Schema(
    {
        trackEventType: { type: String, required: true },
        data: { type: Object },
        visitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor"
        },
        ip: { type: String },
    },
    {
        timestamps: true,
    }
);

TrackVisitor.index({ trackEvent: 1 });

module.exports = mongoose.model("trackVisitor", TrackVisitor);
