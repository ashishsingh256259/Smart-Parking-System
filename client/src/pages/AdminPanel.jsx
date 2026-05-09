import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { DollarSign, TrendingUp, Users, Clock } from 'lucide-react';

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState(null);

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

  return (
    <div className="pt-24 px-6 md:px-12 pb-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-wider">Admin <span className="text-gradient">Analytics</span></h1>
        <p className="text-gray-400 mt-1">System performance and revenue monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[rgba(0,243,255,0.1)] rounded-xl text-[var(--color-neon-blue)]">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Simulated Revenue</p>
            <p className="text-2xl font-bold">${analytics?.revenueSimulation || 0}</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-[rgba(57,255,20,0.1)] rounded-xl text-[var(--color-neon-green)]">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Peak Usage Time</p>
            <p className="text-2xl font-bold">{analytics?.peakUsageTime || '14:00'}</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-xl text-purple-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Users Today</p>
            <p className="text-2xl font-bold">342</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-yellow-500/10 rounded-xl text-yellow-400">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-400">Avg Wait Time</p>
            <p className="text-2xl font-bold">{analytics?.averageWaitTime || 0}m</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Occupancy vs Prediction</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="occupancy" stroke="#00f3ff" fillOpacity={1} fill="url(#colorOccupancy)" name="Actual Occupancy %" />
                <Area type="monotone" dataKey="prediction" stroke="#39ff14" fillOpacity={1} fill="url(#colorPrediction)" name="AI Prediction %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-xl font-bold mb-6">Slot Usage by Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="name" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="used" fill="#00f3ff" name="Currently Used" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" fill="rgba(255,255,255,0.2)" name="Total Capacity" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
