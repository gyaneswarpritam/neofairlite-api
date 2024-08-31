var mongoose = require("mongoose");

var activitySchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
    },
    {
        timestamps: true,
    }
);

activitySchema.index({ title: 1 });
activitySchema.index({ endTime: 1 });
activitySchema.index({ startTime: 1 });

module.exports = mongoose.model("Activity", activitySchema);
