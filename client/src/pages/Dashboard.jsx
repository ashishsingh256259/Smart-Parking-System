import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Car, CheckCircle, Clock, Percent, AlertCircle, Zap, Cpu, Search, TrendingUp, Play, Pause, Lightbulb } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import toast, { Toaster } from 'react-hot-toast';
import { CloudSun, Sun } from 'lucide-react';

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [autoNavigateTarget, setAutoNavigateTarget] = useState(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [insights, setInsights] = useState([
    { id: 1, text: "AI predicts 85% occupancy by 14:00.", type: "info" },
    { id: 2, text: "Routing efficiency up 12% today.", type: "success" }
  ]);
  
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    reserved: 0,
    occupancyRate: 0,
    avgConfidence: 0,
    waitTime: '2 mins'
  });
  const [time, setTime] = useState(new Date());

  const playSound = (type) => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      if (type === 'scan') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else if (type === 'arrive') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
      }
    } catch(e) {}
  };

  const addLog = (message, type = 'info') => {
    setLogs(prev => {
      const newLogs = [{ id: Date.now(), message, type, time: new Date() }, ...prev];
      return newLogs.slice(0, 5); // Keep last 5 logs
    });
  };

  const fetchSlots = async (isBackground = false) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API_URL}/api/slots`);
      const data = res.data;
      
      // Detect changes for logs if not first load
      if (slots.length > 0 && isBackground) {
        data.forEach(newSlot => {
          const oldSlot = slots.find(s => s.slotId === newSlot.slotId);
          if (oldSlot && oldSlot.status !== newSlot.status) {
            if (newSlot.status === 'occupied') addLog(`Slot ${newSlot.slotId} occupied`, 'error');
            else if (newSlot.status === 'available') addLog(`Slot ${newSlot.slotId} freed`, 'success');
          }
        });
      }

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
      
      if (!isBackground && data.length > 0) {
        addLog('AI Grid Synced with Sensors', 'info');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching slots', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(() => fetchSlots(true), 5000);
    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    
    // Initial logs
    addLog('System initialized. Awaiting sensor input.', 'info');
    
    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  // Dynamic Traffic Simulation
  useEffect(() => {
    if (slots.length === 0 || !isSimulationActive) return;
    const trafficInterval = setInterval(async () => {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      // Simulate random cars entering/leaving
      if (Math.random() > 0.6) {
        const availableSlots = slots.filter(s => s.status === 'available');
        if (availableSlots.length > 0) {
          const randomSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
          setAutoNavigateTarget(randomSlot);
          addLog(`Vehicle entered Gate A. AI routing to ${randomSlot.slotId}`, 'info');
          
          if (availableSlots.length < 5) {
            setInsights(prev => [{ id: Date.now(), text: "High congestion predicted in 5 mins. Recommend rerouting to overflow zone.", type: "warning" }, ...prev].slice(0,3));
          }
        }
      } else if (Math.random() > 0.7) {
        const occupiedSlots = slots.filter(s => s.status === 'occupied');
        if (occupiedSlots.length > 0) {
          const randomSlot = occupiedSlots[Math.floor(Math.random() * occupiedSlots.length)];
          try {
            await axios.put(`${API_URL}/api/free-slot/${randomSlot.slotId}`);
            addLog(`Vehicle exited ${randomSlot.slotId}. Sensor updated.`, 'info');
            fetchSlots(true);
          } catch (e) {}
        }
      }
    }, 12000);
    return () => clearInterval(trafficInterval);
  }, [slots]);

  const handleSlotClick = async (slot) => {
    if (slot.status === 'reserved') {
      toast.error(`Slot ${slot.slotId} is reserved for VIP/Disabled parking.`);
      return;
    }
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      if (slot.status === 'available') {
        toast.success(`Navigating to Slot ${slot.slotId}...`, { icon: '🤖' });
        addLog(`A* route calculated for ${slot.slotId}`, 'info');
        await axios.put(`${API_URL}/api/occupy-slot/${slot.slotId}`);
      } else if (slot.status === 'occupied') {
        toast('Vehicle exited. Freeing slot...', { icon: '👋' });
        await axios.put(`${API_URL}/api/free-slot/${slot.slotId}`);
      }
      fetchSlots(true);
    } catch (error) {
      console.error('Error updating slot', error);
      toast.error('Connection error. Try again.');
    }
  };

  const findBestSlot = () => {
    const availableSlots = slots.filter(s => s.status === 'available');
    if (availableSlots.length === 0) {
      toast.error('No slots available!');
      return;
    }
    
    // AI Logic: Sort by prediction percentage (descending), then by distance to entry gate (0,0)
    const bestSlot = availableSlots.sort((a, b) => {
      if (b.predictionPercentage !== a.predictionPercentage) {
        return b.predictionPercentage - a.predictionPercentage;
      }
      const distA = Math.abs(a.x) + Math.abs(a.y);
      const distB = Math.abs(b.x) + Math.abs(b.y);
      return distA - distB;
    })[0];

    addLog(`AI recommended ${bestSlot.slotId} (${bestSlot.predictionPercentage}% confidence)`, 'success');
    playSound('scan');
    
    setAutoNavigateTarget(bestSlot);
    toast.success(`AI Navigating to Best Slot: ${bestSlot.slotId}...`, {
      icon: '🧠',
      duration: 4000,
      style: { background: 'rgba(57, 255, 20, 0.1)', border: '1px solid #39ff14' }
    });
  };

  const seedSlots = async () => {
    toast.loading('Initializing AI Grid...', { id: 'seed' });
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    await axios.post(`${API_URL}/api/seed-slots`);
    fetchSlots();
    toast.success('AI Grid Initialized!', { id: 'seed' });
    addLog('Grid seeded with AI simulation data', 'info');
  };

  if (loading && slots.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-[var(--color-neon-blue)] border-t-transparent rounded-full animate-spin shadow-[0_0_20px_var(--color-neon-blue)]"></div>
            <div className="absolute inset-2 border-4 border-[var(--color-neon-green)] border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse] shadow-[0_0_15px_var(--color-neon-green)]"></div>
            <Cpu className="absolute inset-0 m-auto text-[var(--color-neon-blue)] animate-pulse" size={32} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[var(--color-neon-blue)] font-black text-xl tracking-widest animate-pulse">BOOTING AI CORE</span>
            <span className="text-gray-400 text-xs font-mono tracking-widest mt-1">ESTABLISHING SENSOR UPLINK...</span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="pt-24 px-6 md:px-12 pb-12 max-w-7xl mx-auto relative">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-[10%] w-2 h-2 bg-[var(--color-neon-blue)] rounded-full shadow-[0_0_10px_var(--color-neon-blue)] animate-ping" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-[60%] right-[15%] w-2 h-2 bg-[var(--color-neon-green)] rounded-full shadow-[0_0_10px_var(--color-neon-green)] animate-ping" style={{ animationDuration: '4s' }}></div>
      </div>

      <Toaster position="top-right" toastOptions={{
        style: { background: 'rgba(10, 10, 15, 0.95)', color: '#fff', border: '1px solid rgba(0, 243, 255, 0.3)', backdropFilter: 'blur(10px)' }
      }} />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 relative z-10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-wider flex items-center gap-3">
            Live <span className="text-gradient">Dashboard</span>
            {isSimulationActive && (
              <span className="px-2 py-0.5 text-[10px] bg-red-500/20 text-red-400 border border-red-500/50 rounded flex items-center gap-1 animate-pulse"><div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> LIVE SIM</span>
            )}
          </h1>
          <p className="text-gray-400 mt-1">Real-time smart city parking simulation</p>
        </div>
        
        <div className="flex gap-4">
          {slots.length > 0 && (
            <>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => setIsSimulationActive(!isSimulationActive)} 
                className={`px-6 py-2.5 glass-panel text-white font-bold rounded-xl transition-colors flex items-center gap-2 border-gray-700 ${isSimulationActive ? 'bg-red-500/20 border-red-500/50 hover:bg-red-500/30' : 'hover:bg-white/10'}`}
              >
                {isSimulationActive ? <Pause size={18} className="text-red-400" /> : <Play size={18} className="text-gray-300" />}
                {isSimulationActive ? 'Stop Simulation' : 'Start Simulation'}
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={findBestSlot} 
                className="px-6 py-2.5 glass-panel text-white font-bold rounded-xl hover:bg-[rgba(57,255,20,0.1)] hover:border-[var(--color-neon-green)] transition-colors flex items-center gap-2 border-[var(--color-neon-green)]/30"
              >
                <Search size={18} className="text-[var(--color-neon-green)]" />
                Find Best Slot
              </motion.button>
            </>
          )}
          {slots.length === 0 && (
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={seedSlots} 
              className="px-6 py-2.5 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-green)] text-black font-extrabold rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(0,243,255,0.4)]"
            >
              Initialize AI Grid
            </motion.button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 rounded-3xl border-b-2 border-b-[var(--color-neon-blue)] hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Available Slots</h3>
            <div className="p-2 bg-[rgba(0,243,255,0.1)] rounded-lg group-hover:bg-[rgba(0,243,255,0.2)] transition-colors">
              <CheckCircle className="text-[var(--color-neon-blue)]" size={20} />
            </div>
          </div>
          <div className="text-5xl font-black text-white tracking-tighter">{stats.available} <span className="text-lg text-gray-600 font-normal tracking-normal">/ {stats.total}</span></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-3xl border-b-2 border-b-red-500 hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Occupied</h3>
            <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <Car className="text-red-500" size={20} />
            </div>
          </div>
          <div className="text-5xl font-black text-white tracking-tighter">{stats.occupied}</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl border-b-2 border-b-[var(--color-neon-green)] hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">AI Confidence</h3>
            <div className="p-2 bg-[rgba(57,255,20,0.1)] rounded-lg group-hover:bg-[rgba(57,255,20,0.2)] transition-colors">
              <Cpu className="text-[var(--color-neon-green)]" size={20} />
            </div>
          </div>
          <div className="text-5xl font-black text-white tracking-tighter">{stats.avgConfidence}%</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-3xl border-b-2 border-b-yellow-400 hover:-translate-y-1 transition-transform group">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Est. Wait Time</h3>
            <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20 transition-colors">
              <Clock className="text-yellow-400" size={20} />
            </div>
          </div>
          <div className="text-5xl font-black text-white tracking-tighter">{stats.waitTime}</div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <div className="lg:col-span-2 flex flex-col">
          {slots.length > 0 ? (
            <InteractiveMap slots={slots} onSlotClick={handleSlotClick} autoNavigateTarget={autoNavigateTarget} />
          ) : (
            <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center h-full border-dashed border-2 border-gray-700/50 backdrop-blur-md">
              <div className="p-6 bg-gray-900/50 rounded-full mb-6">
                <AlertCircle size={64} className="text-gray-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Grid Offline</h3>
              <p className="text-gray-400 max-w-md mx-auto">Sensors are currently disconnected. Initialize the AI Grid to boot up the system and connect to parking node endpoints.</p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Smart City Weather & AI Panel */}
          <div className="glass-panel p-6 rounded-3xl bg-gradient-to-br from-[rgba(20,20,30,0.9)] to-[rgba(0,243,255,0.05)] border-[rgba(0,243,255,0.2)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-neon-blue)] blur-[100px] opacity-20 rounded-full pointer-events-none"></div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-[var(--color-neon-blue)] text-xs font-bold tracking-widest uppercase mb-1">{time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <h2 className="text-4xl font-black tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </h2>
              </div>
              <div className="text-right flex flex-col items-end">
                <Sun size={36} className="text-yellow-400 mb-2 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-[pulse_4s_ease-in-out_infinite]" />
                <p className="text-2xl font-black">24°C</p>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Clear Sky</p>
              </div>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-gray-800 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-1.5 bg-[var(--color-neon-green)]/20 rounded text-[var(--color-neon-green)]">
                  <TrendingUp size={16} />
                </div>
                <h4 className="font-bold text-sm text-gray-300">AI Traffic Prediction</h4>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Current Congestion</span>
                <span className="font-bold text-white">{stats.occupancyRate}%</span>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-1.5 mb-3 overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${stats.occupancyRate > 80 ? 'bg-red-500 shadow-[0_0_10px_red]' : 'bg-[var(--color-neon-green)] shadow-[0_0_10px_var(--color-neon-green)]'}`} style={{ width: `${stats.occupancyRate}%` }}></div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                {stats.occupancyRate > 80 ? "High congestion detected. Routing vehicles to alternate zones." : "Optimal traffic flow. Average fuel savings: 12%."}
              </p>
            </div>
          {/* AI Insights Panel */}
          <div className="glass-panel p-6 rounded-3xl border-purple-500/20 bg-gradient-to-br from-[rgba(20,20,30,0.9)] to-purple-900/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-gray-800 pb-3">
              <Lightbulb size={20} className="text-purple-400" />
              Intelligent AI Insights
            </h3>
            <div className="space-y-3">
              <AnimatePresence>
                {insights.map(insight => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-3 rounded-xl border flex items-start gap-3 backdrop-blur-md
                      ${insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' : 
                        insight.type === 'success' ? 'bg-[var(--color-neon-green)]/10 border-[var(--color-neon-green)]/30' :
                        'bg-[var(--color-neon-blue)]/10 border-[var(--color-neon-blue)]/30'}
                    `}
                  >
                    <Cpu size={16} className={`mt-0.5 flex-shrink-0
                      ${insight.type === 'warning' ? 'text-yellow-400' : 
                        insight.type === 'success' ? 'text-[var(--color-neon-green)]' :
                        'text-[var(--color-neon-blue)]'}
                    `} />
                    <p className="text-sm text-gray-200">{insight.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="glass-panel p-6 rounded-3xl flex-grow flex flex-col border-[rgba(255,255,255,0.05)]">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
              <Activity size={20} className="text-[var(--color-neon-blue)] animate-pulse" />
              Live Activity Logs
            </h3>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-grow">
              <AnimatePresence>
                {logs.length === 0 && <p className="text-sm text-gray-500 italic">No recent activity...</p>}
                {logs.map((log) => (
                  <motion.div 
                    key={log.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex gap-4 items-start text-sm group"
                  >
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 mt-1 rounded-full shadow-[0_0_8px_currentColor]
                        ${log.type === 'error' ? 'text-red-500 bg-red-500' : log.type === 'success' ? 'text-[var(--color-neon-green)] bg-[var(--color-neon-green)]' : 'text-[var(--color-neon-blue)] bg-[var(--color-neon-blue)]'}
                      `}></div>
                      <div className="w-px h-8 bg-gray-800 group-last:hidden mt-1"></div>
                    </div>
                    <div className="pb-2">
                      <p className="text-gray-200 font-medium">{log.message}</p>
                      <p className="text-[10px] text-gray-500 font-mono tracking-wider mt-1">{log.time.toLocaleTimeString()}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
