const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  slotId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['available', 'occupied', 'reserved'], default: 'available' },
  predictionPercentage: { type: Number, default: 100 }, // AI confidence / probability
  x: { type: Number, required: true }, // For map placement
  y: { type: Number, required: true },
  type: { type: String, enum: ['regular', 'ev', 'disabled'], default: 'regular' },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);
