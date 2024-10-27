const mongoose = require("mongoose");

const singleSlotsSchema = new mongoose.Schema(
  {
    time: { type: Date },
    status: { type: String, required: true },
    durationInMinutes: { type: Number, required: true },
    visitorId: { type: String },
    visitorName: { type: String },
    timeZone: { type: String },
    slotId: { type: String },
    meetingLink: { type: String, default: "" }
  },
  {
    timestamps: true,
  }
);

const dateSchema = new mongoose.Schema({
  to: { type: Date, required: true },
  from: { type: Date, required: true },
  durationInMinutes: { type: String, required: true },
  slots: [singleSlotsSchema],
});

const SlotsSchema = new mongoose.Schema(
  {
    exhibitorId: { type: String, required: true },
    companyName: { type: String, required: true },
    dates: [dateSchema],
  },
  {
    collection: "slots",
  }
);

module.exports = mongoose.model("slots", SlotsSchema);