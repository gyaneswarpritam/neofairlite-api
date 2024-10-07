var mongoose = require("mongoose");

var TrackMeeting = new mongoose.Schema(
    {
        trackEventType: { type: String, required: true },
        data: { type: Object },
        visitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor"
        },
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor"
        },
        meetingId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        ip: { type: String },
    },
    {
        timestamps: true,
    }
);

TrackMeeting.index({ trackEvent: 1 });

module.exports = mongoose.model("trackMeeting", TrackMeeting);
