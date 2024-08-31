var mongoose = require("mongoose");

var TrackExhibitor = new mongoose.Schema(
    {
        trackEventType: { type: String, required: true },
        data: { type: Object },
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor"
        },
    },
    {
        timestamps: true,
    }
);

TrackExhibitor.index({ trackEvent: 1 });

module.exports = mongoose.model("trackExhibitor", TrackExhibitor);
