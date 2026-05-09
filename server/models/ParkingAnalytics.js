const mongoose = require('mongoose');

const parkingAnalyticsSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalOccupied: { type: Number, default: 0 },
  totalAvailable: { type: Number, default: 0 },
  totalReserved: { type: Number, default: 0 },
  revenueSimulation: { type: Number, default: 0 },
  peakUsageTime: { type: String, default: "14:00" },
  averageWaitTime: { type: Number, default: 0 } // minutes
});

module.exports = mongoose.model('ParkingAnalytics', parkingAnalyticsSchema);
