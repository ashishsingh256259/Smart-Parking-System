const mongoose = require('mongoose');

const vehicleEntrySchema = new mongoose.Schema({
  licensePlate: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  assignedSlot: { type: String },
  status: { type: String, enum: ['parked', 'exited'], default: 'parked' }
});

module.exports = mongoose.model('VehicleEntry', vehicleEntrySchema);
