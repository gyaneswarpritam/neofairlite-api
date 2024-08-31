var mongoose = require("mongoose");

var visitedStallSchema = new mongoose.Schema(
    {
        stall: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stall"
        },
        exhibitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exhibitor"
        },
        visitor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Visitor"
        },
    },
    {
        timestamps: true,
    }
);

visitedStallSchema.index({ visitor: 1 });
visitedStallSchema.index({ exhibitor: 1 });

module.exports = mongoose.model("VisitedStall", visitedStallSchema);
