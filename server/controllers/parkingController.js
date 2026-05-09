const ParkingSlot = require('../models/ParkingSlot');
const ParkingAnalytics = require('../models/ParkingAnalytics');

exports.getSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find();
    res.json(slots);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.seedSlots = async (req, res) => {
  try {
    await ParkingSlot.deleteMany();
    // Create a 5x5 grid of slots for demo purposes
    const slots = [];
    let idCounter = 1;
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        // Leave some empty space (e.g. aisles)
        if (x % 2 !== 0) continue; 
        
        let status = 'available';
        let type = 'regular';
        let rand = Math.random();
        if (rand < 0.4) status = 'occupied';
        else if (rand < 0.5) status = 'reserved';

        if (idCounter <= 2) type = 'disabled';
        else if (idCounter <= 5) type = 'ev';

        slots.push({
          slotId: `A${idCounter}`,
          status,
          predictionPercentage: Math.floor(Math.random() * 40) + 60, // 60-100%
          x,
          y,
          type
        });
        idCounter++;
      }
    }
    await ParkingSlot.insertMany(slots);
    res.json({ message: 'Slots seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.findPath = async (req, res) => {
  try {
    const { start, target } = req.body;
    // Backend pathfinding logic could go here
    // For now, we will do it on frontend A* visualizer, but this endpoint acknowledges the request.
    res.json({ message: 'Pathfinding computed', route: [start, target] });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.occupySlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findOneAndUpdate(
      { slotId: req.params.id },
      { status: 'occupied', lastUpdated: Date.now() },
      { new: true }
    );
    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.freeSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findOneAndUpdate(
      { slotId: req.params.id },
      { status: 'available', lastUpdated: Date.now() },
      { new: true }
    );
    res.json(slot);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    // Return dummy analytics if none found
    let analytics = await ParkingAnalytics.findOne().sort({ date: -1 });
    if (!analytics) {
      analytics = {
        totalOccupied: 45,
        totalAvailable: 25,
        totalReserved: 5,
        revenueSimulation: 1250,
        peakUsageTime: '14:00',
        averageWaitTime: 3.5
      };
    }
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
