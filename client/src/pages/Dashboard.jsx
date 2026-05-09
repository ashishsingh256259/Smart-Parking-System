import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, Car, CheckCircle, Clock, Percent, AlertCircle } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
    occupancyRate: 0,
    avgConfidence: 0,
    waitTime: '2 mins'
  });

  const fetchSlots = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/slots');
      const data = res.data;
      setSlots(data);
      
      const total = data.length;
      const available = data.filter(s => s.status === 'available').length;
      const occupied = data.filter(s => s.status === 'occupied').length;
      const reserved = data.filter(s => s.status === 'reserved').length;
      
      const confidences = data.filter(s => s.status === 'available').map(s => s.predictionPercentage);
      const avgConf = confidences.length ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length) : 0;
      
      setStats({
        total,
        available,
        occupied,
        reserved,
        occupancyRate: total ? Math.round(((occupied + reserved) / total) * 100) : 0,
        avgConfidence: avgConf,
        waitTime: available > 5 ? '1 min' : (available > 0 ? '3 mins' : '15+ mins')
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching slots', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // In a real app, use WebSockets. Here we poll every 5s for simulation
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSlotClick = async (slot) => {
    if (slot.status !== 'available') return;
    
    // Simulate booking/occupying
    try {
      await axios.put(`http://localhost:5000/api/occupy-slot/${slot.slotId}`);
      fetchSlots(); // Refresh data
    } catch (error) {
      console.error('Error occupying slot', error);
    }
  };

  const seedSlots = async () => {
    await axios.post('http://localhost:5000/api/seed-slots');
    fetchSlots();
  };

  if (loading && slots.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 md:px-12 pb-12 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-wider">Live <span className="text-gradient">Dashboard</span></h1>
          <p className="text-gray-400 mt-1">Real-time smart city parking status</p>
        </div>
        
        {slots.length === 0 && (
          <button onClick={seedSlots} className="px-4 py-2 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg hover:bg-white transition-colors">
            Initialize AI Grid
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-2xl border-t-2 border-t-[var(--color-neon-blue)]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Available Slots</h3>
            <CheckCircle className="text-[var(--color-neon-blue)]" size={20} />
          </div>
          <div className="text-4xl font-bold text-white">{stats.available} <span className="text-sm text-gray-500 font-normal">/ {stats.total}</span></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-2xl border-t-2 border-t-red-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Occupied</h3>
            <Car className="text-red-500" size={20} />
          </div>
          <div className="text-4xl font-bold text-white">{stats.occupied}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-2xl border-t-2 border-t-[var(--color-neon-green)]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">AI Confidence</h3>
            <Percent className="text-[var(--color-neon-green)]" size={20} />
          </div>
          <div className="text-4xl font-bold text-white">{stats.avgConfidence}%</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-2xl border-t-2 border-t-yellow-400">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Est. Wait Time</h3>
            <Clock className="text-yellow-400" size={20} />
          </div>
          <div className="text-4xl font-bold text-white">{stats.waitTime}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {slots.length > 0 ? (
            <InteractiveMap slots={slots} onSlotClick={handleSlotClick} />
          ) : (
            <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-center h-full border-dashed border-2 border-gray-700">
              <AlertCircle size={48} className="text-gray-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">No Sensor Data</h3>
              <p className="text-gray-400">Initialize the AI Grid to connect to parking sensors and run the simulation.</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity size={20} className="text-[var(--color-neon-blue)]" />
              System Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Overall Occupancy</span>
                  <span className="font-bold">{stats.occupancyRate}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className={`h-2 rounded-full ${stats.occupancyRate > 80 ? 'bg-red-500' : 'bg-[var(--color-neon-blue)]'}`} style={{ width: `${stats.occupancyRate}%` }}></div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">A* Pathfinding Node</span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">ONLINE</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Bayesian Predictor</span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">ONLINE</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-400">Vision Sensors</span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-2xl flex-grow">
            <h3 className="text-lg font-bold mb-4">Live Activity</h3>
            <div className="space-y-3">
              {/* Dummy live activity logs */}
              <div className="flex gap-3 items-start text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-[var(--color-neon-blue)]"></div>
                <div>
                  <p className="text-gray-300">Vehicle entry detected at Gate A</p>
                  <p className="text-xs text-gray-500">Just now</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-[var(--color-neon-green)]"></div>
                <div>
                  <p className="text-gray-300">A* optimal route calculated for EV slot A4</p>
                  <p className="text-xs text-gray-500">1 min ago</p>
                </div>
              </div>
              <div className="flex gap-3 items-start text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500"></div>
                <div>
                  <p className="text-gray-300">Slot A2 occupied</p>
                  <p className="text-xs text-gray-500">5 mins ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
