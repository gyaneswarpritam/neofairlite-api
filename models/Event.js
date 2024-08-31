var mongoose = require("mongoose");

var EventSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        status: { type: String, required: true },
        startDateTime: { type: Date, required: true },
        endDateTime: { type: Date, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

EventSchema.index({ name: 1 });
EventSchema.index({ status: 1 });
EventSchema.index({ startDate: 1 });
EventSchema.index({ endDate: 1 });

module.exports = mongoose.model("event", EventSchema);
