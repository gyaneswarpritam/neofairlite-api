var mongoose = require("mongoose");

var visitorNotification = new mongoose.Schema(
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
        unread: { type: Boolean, default: false },
        ip: { type: String },
    },
    {
        timestamps: true,
    }
);

visitorNotification.index({ trackEvent: 1 });

module.exports = mongoose.model("VisitorNotification", visitorNotification);
