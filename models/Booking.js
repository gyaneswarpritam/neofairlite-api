const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  visitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
  exhibitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exhibitor', required: true }, // Reference to Exhibitor collection
  slotTime: { type: Date, required: true },
  timeZone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'booked', 'rejected'], default: 'pending' },
  duration: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
