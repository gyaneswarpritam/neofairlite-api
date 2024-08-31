var mongoose = require("mongoose");

var exhibitorNotification = new mongoose.Schema(
    {
        notificationType: { type: String, required: true },
        data: { type: Object },
        visitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor"
        },
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor"
        },
        ip: { type: String },
        unread: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

exhibitorNotification.index({ trackEvent: 1 });

module.exports = mongoose.model("ExhibitorNotification", exhibitorNotification);
