const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');

// Get all slots
router.get('/slots', parkingController.getSlots);

// Initial seeding of slots
router.post('/seed-slots', parkingController.seedSlots);

// A* pathfinding dummy route - could handle logic on backend if needed, 
// though usually A* visualizer does it on frontend
router.post('/find-path', parkingController.findPath);

// Occupy slot
router.put('/occupy-slot/:id', parkingController.occupySlot);

// Free slot
router.put('/free-slot/:id', parkingController.freeSlot);

// Get analytics
router.get('/analytics', parkingController.getAnalytics);

module.exports = router;
