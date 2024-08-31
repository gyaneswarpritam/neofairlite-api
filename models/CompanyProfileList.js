var mongoose = require("mongoose");

var companyProfileList = new mongoose.Schema(
    {
        title: { type: String },
        url: { type: String },
        locked: { type: Boolean, default: false },
        active: { type: String, default: true },
        deleted: { type: String, default: false },
        stall: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "stall"
        },
    },
    {
        timestamps: true,
    }
);

companyProfileList.index({ url: 1 });

module.exports = mongoose.model("CompanyProfileList", companyProfileList);
