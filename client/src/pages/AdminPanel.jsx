import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, LineChart, Line } from 'recharts';
import { Zap, TrendingUp, Users, Clock, Activity, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState(null);
  const [uptime, setUptime] = useState(99.98);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${API_URL}/api/analytics`);
        setAnalytics(res.data);
      } catch (error) {
        console.error('Error fetching analytics', error);
      }
    };
    fetchAnalytics();
    
    // Simulate slight uptime fluctuations
    const interval = setInterval(() => {
      setUptime(prev => +(prev + (Math.random() > 0.5 ? 0.01 : -0.01)).toFixed(2));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Dummy data for charts
  const hourlyData = [
    { time: '08:00', occupancy: 30, prediction: 35 },
    { time: '10:00', occupancy: 55, prediction: 50 },
    { time: '12:00', occupancy: 85, prediction: 90 },
    { time: '14:00', occupancy: 95, prediction: 95 },
    { time: '16:00', occupancy: 75, prediction: 80 },
    { time: '18:00', occupancy: 60, prediction: 65 },
    { time: '20:00', occupancy: 40, prediction: 45 },
  ];

  const typeData = [
    { name: 'Regular', used: 45, total: 60 },
    { name: 'EV', used: 12, total: 15 },
    { name: 'Disabled', used: 2, total: 5 },
  ];

  const accuracyData = [
    { day: 'Mon', accuracy: 94 },
    { day: 'Tue', accuracy: 96 },
    { day: 'Wed', accuracy: 95 },
    { day: 'Thu', accuracy: 98 },
    { day: 'Fri', accuracy: 92 },
    { day: 'Sat', accuracy: 99 },
    { day: 'Sun', accuracy: 97 },
  ];

  return (
    <div className="pt-24 px-6 md:px-12 pb-12 max-w-7xl mx-auto relative">
      {/* Background Particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-blue)] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-neon-green)] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      </div>

      <div className="mb-8 relative z-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-wider flex items-center gap-4">
            AI <span className="text-gradient">COMMAND CENTER</span>
            <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full text-xs flex items-center gap-2 tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div> LIVE
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg tracking-wide">Enterprise smart mobility monitoring and predictive analytics</p>
        </div>
      </div>

      {/* AI Health Monitoring */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
        <div className="glass-panel p-4 rounded-2xl bg-black/40 border border-gray-800 flex items-center gap-4">
          <Activity className="text-[var(--color-neon-blue)] animate-pulse" size={28} />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">AI Engine</p>
            <p className="text-lg font-bold text-white">OPTIMAL</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl bg-black/40 border border-gray-800 flex items-center gap-4">
          <Activity className="text-[var(--color-neon-green)]" size={28} />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">System Uptime</p>
            <p className="text-lg font-bold text-white">{uptime}%</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl bg-black/40 border border-gray-800 flex items-center gap-4">
          <Activity className="text-purple-400" size={28} />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Sensor Nodes</p>
            <p className="text-lg font-bold text-white">25 / 25 <span className="text-xs text-green-500 ml-1">LIVE</span></p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-2xl bg-black/40 border border-gray-800 flex items-center gap-4">
          <Activity className="text-yellow-400" size={28} />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Active Vehicles</p>
            <p className="text-lg font-bold text-white">142/hr</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 rounded-3xl border-t-2 border-t-[var(--color-neon-blue)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[var(--color-neon-blue)]/10 rounded-bl-full"></div>
          <div className="p-4 bg-[rgba(0,243,255,0.1)] rounded-2xl text-[var(--color-neon-blue)] inline-block mb-4 relative z-10">
            <Zap size={24} />
          </div>
          <p className="text-sm text-gray-400 uppercase tracking-wider relative z-10">Parking Efficiency</p>
          <p className="text-4xl font-black mt-1 text-white relative z-10">94.2<span className="text-lg text-gray-500">/100</span></p>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 rounded-3xl border-t-2 border-t-[var(--color-neon-green)] relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[var(--color-neon-green)]/10 rounded-bl-full"></div>
          <div className="p-4 bg-[rgba(57,255,20,0.1)] rounded-2xl text-[var(--color-neon-green)] inline-block mb-4 relative z-10">
            <TrendingUp size={24} />
          </div>
          <p className="text-sm text-gray-400 uppercase tracking-wider relative z-10">Traffic Flow Status</p>
          <p className="text-4xl font-black mt-1 text-[var(--color-neon-green)] relative z-10 animate-pulse">OPTIMAL</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 rounded-3xl border-t-2 border-t-purple-500">
          <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-400 inline-block mb-4">
            <Users size={24} />
          </div>
          <p className="text-sm text-gray-400 uppercase tracking-wider">Total Users Today</p>
          <p className="text-4xl font-black mt-1">342</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="glass-panel p-6 rounded-3xl border-t-2 border-t-yellow-400">
          <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-400 inline-block mb-4">
            <Clock size={24} />
          </div>
          <p className="text-sm text-gray-400 uppercase tracking-wider">Avg Wait Time</p>
          <p className="text-4xl font-black mt-1">{analytics?.averageWaitTime || 0}m</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 mb-8">
        <div className="glass-panel p-6 rounded-3xl border border-gray-800/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-[var(--color-neon-blue)]" /> Occupancy vs AI Prediction
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorOccupancy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPrediction" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#39ff14" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#39ff14" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="time" stroke="#8884d8" tick={{ fill: '#6b7280' }} />
                <YAxis stroke="#8884d8" tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.95)', border: '1px solid rgba(0,243,255,0.2)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend />
                <Area type="monotone" dataKey="occupancy" stroke="#00f3ff" strokeWidth={3} fillOpacity={1} fill="url(#colorOccupancy)" name="Actual Occupancy %" />
                <Area type="monotone" dataKey="prediction" stroke="#39ff14" strokeWidth={3} fillOpacity={1} fill="url(#colorPrediction)" name="AI Prediction %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-gray-800/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="text-purple-400" /> Slot Usage by Zone Type
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#8884d8" tick={{ fill: '#6b7280' }} />
                <YAxis stroke="#8884d8" tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.95)', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Legend />
                <Bar dataKey="used" fill="#a855f7" name="Currently Used" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="total" fill="rgba(255,255,255,0.1)" name="Total Capacity" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-gray-800/50 relative z-10">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Activity className="text-[var(--color-neon-green)]" /> Bayesian AI Model Accuracy
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accuracyData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="#8884d8" tick={{ fill: '#6b7280' }} />
              <YAxis stroke="#8884d8" domain={[80, 100]} tick={{ fill: '#6b7280' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(10, 10, 15, 0.95)', border: '1px solid rgba(57,255,20,0.3)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
              />
              <Legend />
              <Line type="monotone" dataKey="accuracy" stroke="#39ff14" strokeWidth={4} name="Prediction Accuracy %" dot={{ fill: '#39ff14', r: 6, strokeWidth: 2, stroke: '#000' }} activeDot={{ r: 8, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 mt-8">
        <div className="glass-panel p-6 rounded-3xl border border-red-500/30">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-400">
            <Activity className="text-red-500 animate-pulse" /> Emergency Alerts
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-4">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 animate-ping"></div>
              <div>
                <p className="text-white font-bold">Unauthorized Vehicle Detected</p>
                <p className="text-sm text-gray-400">Gate C - Zone 2. Security notified.</p>
                <p className="text-xs text-red-400 mt-1">2 mins ago</p>
              </div>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-white font-bold">Sensor Node Offline</p>
                <p className="text-sm text-gray-400">Node B4 lost connection. Attempting reboot.</p>
                <p className="text-xs text-yellow-400 mt-1">15 mins ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-gray-800/50">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Users className="text-blue-400" /> Active Users
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-white/5 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    U{i}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">User_{Math.floor(Math.random() * 1000)}</p>
                    <p className="text-xs text-gray-500">Navigating to Zone {i}</p>
                  </div>
                </div>
                <div className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Active</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
