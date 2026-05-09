import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Cpu, Map, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="pt-24 min-h-screen relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-[var(--color-neon-blue)] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[var(--color-neon-green)] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <div className="inline-block px-4 py-1.5 rounded-full glass-panel mb-6 border-[var(--color-neon-blue)]/30">
            <span className="text-sm font-semibold tracking-widest uppercase text-gradient">
              Next-Gen Smart City Infrastructure
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            <span className="block text-white">Find Parking With</span>
            <span className="block text-gradient mt-2">AI Precision</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Experience the future of urban mobility. Our system uses advanced A* pathfinding and Bayesian probability to guide you to the optimal parking spot with 99.9% accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-white text-black font-bold text-lg flex items-center gap-2 hover:bg-gray-100 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              >
                Launch System
                <ChevronRight size={20} />
              </motion.button>
            </Link>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl glass-panel text-white font-bold text-lg flex items-center gap-2 hover:bg-[rgba(255,255,255,0.1)] transition-colors border border-[rgba(255,255,255,0.2)]"
            >
              View Documentation
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full"
        >
          <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-[rgba(0,243,255,0.1)] flex items-center justify-center mb-6 neon-shadow">
              <Map className="text-[var(--color-neon-blue)]" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">A* Pathfinding</h3>
            <p className="text-gray-400 leading-relaxed">
              Real-time optimal routing from entry gate to the nearest available slot, avoiding occupied spaces.
            </p>
          </div>
          
          <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-[rgba(57,255,20,0.1)] flex items-center justify-center mb-6 neon-shadow-green">
              <Cpu className="text-[var(--color-neon-green)]" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Bayesian Prediction</h3>
            <p className="text-gray-400 leading-relaxed">
              AI-driven probability models predict slot availability based on historical data and current trends.
            </p>
          </div>
          
          <div className="glass-panel p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <Zap className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Smart Integration</h3>
            <p className="text-gray-400 leading-relaxed">
              Supports EV charging slots, disabled parking, and VIP reservations with automated license plate recognition.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
