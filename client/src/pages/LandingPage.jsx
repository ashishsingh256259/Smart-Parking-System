import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Cpu, Map, Zap, Network, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="pt-24 min-h-screen relative overflow-hidden bg-[#050508]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[var(--color-neon-blue)] rounded-full mix-blend-screen filter blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[600px] h-[600px] bg-[var(--color-neon-green)] rounded-full mix-blend-screen filter blur-[150px] opacity-15" style={{ animation: 'pulse 6s infinite' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
        
        {/* Holographic grid lines */}
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(0,243,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px', transform: 'perspective(1000px) rotateX(60deg) scale(2.5) translateY(-100px)', transformOrigin: 'top center', opacity: 0.6 }}></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 py-12 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel mb-8 border-[var(--color-neon-blue)]/40 shadow-[0_0_20px_rgba(0,243,255,0.15)]"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-neon-green)] animate-ping"></span>
            <span className="text-sm font-bold tracking-widest uppercase text-gray-300">
              Enterprise Smart City Core v2.0
            </span>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.1]">
            <span className="block text-white">Find Parking With</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-neon-blue)] via-white to-[var(--color-neon-green)] mt-2 drop-shadow-[0_0_25px_rgba(0,243,255,0.4)]">
              Quantum Precision
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Experience the apex of urban mobility. Our decentralized system utilizes <span className="text-white">A* pathfinding</span> and <span className="text-white">Bayesian probability models</span> to navigate you to the optimal slot with 99.9% accuracy.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/dashboard">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 243, 255, 0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 rounded-2xl bg-white text-black font-black text-xl flex items-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(255,255,255,0.3)]"
              >
                Access Terminal
                <ChevronRight size={24} className="text-[var(--color-neon-blue)]" />
              </motion.button>
            </Link>
            
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 rounded-2xl glass-panel text-white font-bold text-xl flex items-center gap-3 transition-all border border-gray-600 hover:border-[var(--color-neon-blue)]"
            >
              <Network size={24} />
              View Architecture
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-6xl relative"
        >
          {/* Connector lines behind cards */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--color-neon-blue)] to-transparent opacity-20 hidden md:block z-0"></div>

          <div className="glass-panel p-10 rounded-3xl hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-t border-t-[var(--color-neon-blue)]/50 group relative z-10 bg-[rgba(10,10,15,0.8)] backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(0,243,255,0.1)] flex items-center justify-center mb-8 group-hover:shadow-[0_0_25px_rgba(0,243,255,0.5)] transition-shadow duration-300 border border-[rgba(0,243,255,0.2)]">
              <Map className="text-[var(--color-neon-blue)]" size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4 text-white tracking-wide">A* Routing</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              Sub-millisecond optimal path calculation from entry gates directly to available slots, avoiding dynamic obstacles in real-time.
            </p>
          </div>
          
          <div className="glass-panel p-10 rounded-3xl hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-t border-t-[var(--color-neon-green)]/50 group relative z-10 bg-[rgba(10,10,15,0.8)] backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(57,255,20,0.1)] flex items-center justify-center mb-8 group-hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] transition-shadow duration-300 border border-[rgba(57,255,20,0.2)]">
              <Cpu className="text-[var(--color-neon-green)]" size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4 text-white tracking-wide">Bayesian AI</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              Predictive models utilize historical variance and live sensor telemetry to forecast slot availability with 96% confidence.
            </p>
          </div>
          
          <div className="glass-panel p-10 rounded-3xl hover:-translate-y-3 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border-t border-t-purple-500/50 group relative z-10 bg-[rgba(10,10,15,0.8)] backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-shadow duration-300 border border-purple-500/20">
              <ShieldCheck className="text-purple-400" size={32} />
            </div>
            <h3 className="text-2xl font-black mb-4 text-white tracking-wide">Enterprise Core</h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              Built for immense scale. Integrated management for EV charging nodes, VIP reservations, and automated LPR gateways.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
