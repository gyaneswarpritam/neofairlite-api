var mongoose = require("mongoose");

var instantMeetingSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        stallId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stall",
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
        approve: { type: Boolean, default: false },
        cancelled: { type: Boolean, default: false },
        rejected: { type: Boolean, default: false },
        completed: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("InstantMeeting", instantMeetingSchema);
