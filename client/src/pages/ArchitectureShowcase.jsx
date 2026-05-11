import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Network, Cpu, Server, Shield, BrainCircuit, Activity, Code, Wifi } from 'lucide-react';

const architectureData = [
  {
    id: 'ai',
    title: 'A* & Bayesian AI Engine',
    icon: <BrainCircuit size={32} className="text-[var(--color-neon-blue)]" />,
    color: 'var(--color-neon-blue)',
    description: 'Dynamic pathfinding combined with probabilistic occupancy prediction.',
    details: [
      'A* Algorithm: Calculates the shortest path avoiding occupied slots and boundaries in real-time.',
      'Bayesian Reasoning: Updates the probability of slot availability based on historical data, time of day, and nearby occupancy.',
      'Real-time Rerouting: If a target slot becomes occupied while a vehicle is en route, the engine instantly recalculates the next best slot.'
    ]
  },
  {
    id: 'socket',
    title: 'Real-Time Socket Hub',
    icon: <Wifi size={32} className="text-[var(--color-neon-green)]" />,
    color: 'var(--color-neon-green)',
    description: 'Bi-directional low-latency communication layer.',
    details: [
      'Socket.io Integration: Pushes state changes (slot occupied/freed) to all connected clients under 50ms.',
      'Event-Driven Architecture: Avoids heavy polling by reacting to MongoDB change streams and sensor events.',
      'Connection Resilience: Automatic heartbeat and reconnection strategies for uninterrupted city monitoring.'
    ]
  },
  {
    id: 'db',
    title: 'MongoDB Cluster',
    icon: <Database size={32} className="text-purple-400" />,
    color: '#a855f7',
    description: 'NoSQL distributed storage for dynamic slot state.',
    details: [
      'Schema Design: Optimized documents for quick spatial queries and status updates.',
      'Analytics Aggregation: Daily cron jobs summarize hourly occupancy and revenue predictions.',
      'Scalable Storage: Designed to handle thousands of sensor pings per second across multiple parking zones.'
    ]
  },
  {
    id: 'api',
    title: 'Node.js/Express Backend',
    icon: <Server size={32} className="text-yellow-400" />,
    color: '#facc15',
    description: 'High-throughput REST API serving the core logic.',
    details: [
      'Middleware Stack: Rate limiting, CORS, and request validation for enterprise security.',
      'Controller Logic: Separates database operations from socket emissions and AI calculations.',
      'Modular Routes: Clean separation of /api/slots, /api/analytics, and /api/system routes.'
    ]
  }
];

const ArchitectureShowcase = () => {
  const [activeNode, setActiveNode] = useState(architectureData[0]);

  return (
    <div className="pt-24 px-6 md:px-12 pb-12 max-w-7xl mx-auto relative min-h-screen">
      {/* Dynamic Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[var(--color-neon-blue)] rounded-full mix-blend-screen filter blur-[200px] opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-screen filter blur-[200px] opacity-10"></div>
        
        {/* Animated Data Streams */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gradient-to-b from-transparent via-[var(--color-neon-blue)] to-transparent h-full"
              style={{ left: `${i * 10}%` }}
              animate={{ top: ['-100%', '100%'] }}
              transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: 'linear', delay: Math.random() * 5 }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mb-12 text-center">
        <h1 className="text-5xl font-black tracking-wider mb-4 flex items-center justify-center gap-4">
          <Network className="text-[var(--color-neon-blue)]" size={48} />
          System <span className="text-gradient">Architecture</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Explore the internal blueprint of our futuristic smart mobility platform. Select a node to view its technical specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Node Map */}
        <div className="lg:col-span-5 flex flex-col justify-center gap-6">
          {architectureData.map((node) => (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveNode(node)}
              className={`cursor-pointer p-6 rounded-2xl glass-panel border transition-all duration-300 relative overflow-hidden group
                ${activeNode.id === node.id 
                  ? 'border-[var(--color-neon-blue)] shadow-[0_0_30px_rgba(0,243,255,0.15)] bg-white/5' 
                  : 'border-gray-800/50 hover:border-gray-700'}`}
            >
              {activeNode.id === node.id && (
                <motion.div 
                  layoutId="activeGlow"
                  className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 z-0"
                />
              )}
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 rounded-xl bg-black/50 border border-gray-800 group-hover:border-gray-600 transition-colors">
                  {node.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide">{node.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{node.description}</p>
                </div>
                {activeNode.id === node.id && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto w-3 h-3 rounded-full animate-pulse shadow-[0_0_10px_currentColor]"
                    style={{ backgroundColor: node.color, color: node.color }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Node Details Panel */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              transition={{ duration: 0.4 }}
              className="glass-panel p-8 md:p-12 rounded-3xl border border-gray-800/50 h-full relative overflow-hidden flex flex-col justify-center"
            >
              <div 
                className="absolute top-0 right-0 w-64 h-64 rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none transition-colors duration-500"
                style={{ backgroundColor: activeNode.color }}
              ></div>

              <div className="flex items-center gap-6 mb-8 relative z-10">
                <div 
                  className="p-6 rounded-2xl bg-black/60 border border-gray-700 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                  style={{ boxShadow: `0 0 30px ${activeNode.color}20` }}
                >
                  {React.cloneElement(activeNode.icon, { size: 48 })}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-wider">{activeNode.title}</h2>
                  <p className="text-[var(--color-neon-blue)] font-mono tracking-widest text-sm mt-2 uppercase flex items-center gap-2">
                    <Activity size={14} className="animate-pulse" /> Status: Operational
                  </p>
                </div>
              </div>

              <p className="text-xl text-gray-300 leading-relaxed mb-8 relative z-10 font-medium">
                {activeNode.description}
              </p>

              <div className="space-y-4 relative z-10">
                {activeNode.details.map((detail, idx) => {
                  const [title, ...rest] = detail.split(':');
                  const content = rest.join(':');
                  
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="p-4 rounded-xl bg-black/40 border border-gray-800/80 hover:bg-white/5 hover:border-gray-700 transition-colors flex gap-4 items-start group"
                    >
                      <div className="mt-1 flex-shrink-0">
                        <Code size={18} className="text-gray-500 group-hover:text-white transition-colors" style={{ color: activeNode.color }} />
                      </div>
                      <div>
                        <span className="font-bold text-white mr-2">{title}:</span>
                        <span className="text-gray-400 leading-relaxed">{content}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ArchitectureShowcase;
