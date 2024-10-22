var mongoose = require("mongoose");

var exhibitorSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        companyName: { type: String, required: true },
        companyAddress: { type: String, required: true },
        phone: { type: String, required: true },
        password: { type: String, required: true },
        loggedInTime: { type: String, default: '' },
        loggedInIP: { type: String, default: '' },
        deleted: { type: Boolean, default: false },
        active: { type: Boolean, default: false },
        reject: { type: Boolean, default: false },
        blocked: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

exhibitorSchema.index({ email: 1, delete: 1 }, { unique: true });
exhibitorSchema.index({ phone: 1 });
exhibitorSchema.index({ name: 1 });

module.exports = mongoose.model("Exhibitor", exhibitorSchema);
