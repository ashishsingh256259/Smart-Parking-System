import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aStar } from '../algorithms/aStar';
import { Car, MapPin, Zap, Info } from 'lucide-react';

const InteractiveMap = ({ slots, onSlotClick }) => {
  const [path, setPath] = useState([]);
  const [visited, setVisited] = useState([]);
  const [targetSlot, setTargetSlot] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pathStats, setPathStats] = useState(null);
  
  const mapRef = useRef(null);

  // Grid size 5x5 based on backend seed
  const GRID_WIDTH = 5;
  const GRID_HEIGHT = 5;
  const ENTRY_GATE = { x: 0, y: 0 }; 

  const handleSlotClick = (slot) => {
    if (isAnimating || slot.status !== 'available') {
      onSlotClick(slot);
      return;
    }
    
    setTargetSlot(slot);
    onSlotClick(slot);
    
    const obstacles = slots
      .filter(s => s.status !== 'available' && s.slotId !== slot.slotId)
      .map(s => ({ x: s.x, y: s.y }));

    const { path: newPath, visitedNodes } = aStar(
      GRID_WIDTH, 
      GRID_HEIGHT, 
      ENTRY_GATE, 
      { x: slot.x, y: slot.y },
      obstacles
    );

    setIsAnimating(true);
    setVisited([]);
    setPath([]);
    setPathStats(null);

    // Animate exploration
    visitedNodes.forEach((node, idx) => {
      setTimeout(() => {
        setVisited(prev => [...prev, node]);
      }, idx * 30);
    });

    // Animate path
    const pathDelay = visitedNodes.length * 30 + 100;
    setTimeout(() => {
      newPath.forEach((node, idx) => {
        setTimeout(() => {
          setPath(prev => [...prev, node]);
          if (idx === newPath.length - 1) {
            setIsAnimating(false);
            setPathStats({
              distance: newPath.length * 2.5,
              nodesExplored: visitedNodes.length,
              eta: `${Math.ceil((newPath.length * 2.5) / 10)} min`
            });
          }
        }, idx * 80);
      });
    }, pathDelay);
  };

  const isPathNode = (x, y) => path.some(p => p.x === x && p.y === y);
  const isVisitedNode = (x, y) => visited.some(v => v.x === x && v.y === y);
  const isRoad = (x, y) => {
    // In our backend seed, x%2 !== 0 are roads (x=1, x=3)
    return x % 2 !== 0 || (x === 0 && y === 0);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col h-full">
      {/* Background Holographic Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(0,243,255,0.03)] via-transparent to-transparent pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-6 z-10 relative">
        <div>
          <h3 className="text-2xl font-bold tracking-wide flex items-center gap-2">
            <MapPin className="text-[var(--color-neon-blue)]" />
            AI Navigation Grid
          </h3>
          <p className="text-gray-400 text-sm mt-1">Live Sensor Mapping & Routing</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold bg-black/40 px-4 py-2 rounded-xl border border-gray-800">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[var(--color-neon-green)] shadow-[0_0_8px_var(--color-neon-green)] animate-pulse"></span> Available</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_red]"></span> Occupied</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_yellow]"></span> Reserved</div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center relative z-10">
        <div 
          ref={mapRef}
          className="grid gap-3 relative p-8 border border-[rgba(0,243,255,0.1)] rounded-2xl bg-[#050508] shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]"
          style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))` }}
        >
          {/* Animated Background Grid Lines */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,243,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

          {/* Entry Gate */}
          <div className="absolute -top-4 -left-4 px-4 py-1.5 bg-gradient-to-r from-[var(--color-neon-blue)] to-[var(--color-neon-green)] text-black font-extrabold rounded-lg text-xs shadow-[0_0_20px_var(--color-neon-blue)] z-30 uppercase tracking-widest flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
            Gate A Entry
          </div>

          {Array.from({ length: GRID_HEIGHT }).map((_, y) => (
            Array.from({ length: GRID_WIDTH }).map((_, x) => {
              const slot = slots.find(s => s.x === x && s.y === y);
              const inPath = isPathNode(x, y);
              const isExplored = isVisitedNode(x, y) && !inPath;
              const road = !slot && isRoad(x, y);
              
              let bgColor = "bg-transparent";
              let borderColor = "border-transparent";
              let shadow = "";
              let content = null;
              
              if (road) {
                // Road styling
                content = (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                     <div className="w-1 h-full border-l-2 border-dashed border-gray-500"></div>
                  </div>
                );
              } else if (slot) {
                if (slot.status === 'available') {
                  bgColor = "bg-[var(--color-neon-green)]/5 hover:bg-[var(--color-neon-green)]/20";
                  borderColor = "border-[var(--color-neon-green)]/40 hover:border-[var(--color-neon-green)]";
                  shadow = "hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]";
                } else if (slot.status === 'occupied') {
                  bgColor = "bg-red-500/10 hover:bg-red-500/30";
                  borderColor = "border-red-500/40 hover:border-red-400";
                  shadow = "hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]";
                } else if (slot.status === 'reserved') {
                  bgColor = "bg-yellow-400/10";
                  borderColor = "border-yellow-400/40";
                }

                content = (
                  <>
                    <span className="font-extrabold text-xl z-10">{slot.slotId}</span>
                    {slot.type === 'ev' && <Zap size={14} className="text-blue-400 absolute bottom-2 right-2 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />}
                    {slot.type === 'disabled' && <span className="text-xs text-blue-400 absolute bottom-2 right-2">♿</span>}
                    
                    {/* Animated Prediction Ring */}
                    {slot.status === 'available' && (
                      <div className="absolute top-2 left-2 flex flex-col items-start">
                        <span className="text-[9px] text-[var(--color-neon-green)] font-bold tracking-wider">{slot.predictionPercentage}%</span>
                        <div className="w-8 h-1 bg-gray-800 rounded-full mt-0.5 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${slot.predictionPercentage}%` }}
                            className="h-full bg-[var(--color-neon-green)] shadow-[0_0_5px_var(--color-neon-green)]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Car Model for Occupied */}
                    {slot.status === 'occupied' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50"
                      >
                        <Car size={32} className="text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                      </motion.div>
                    )}
                  </>
                );
              }

              // Pathfinding visuals
              if (inPath) {
                bgColor = "bg-[var(--color-neon-blue)]/30";
                borderColor = "border-[var(--color-neon-blue)]";
                shadow = "shadow-[0_0_25px_var(--color-neon-blue)]";
              } else if (isExplored) {
                bgColor = "bg-purple-500/10";
                borderColor = "border-purple-500/30";
              }

              return (
                <motion.div
                  key={`${x}-${y}`}
                  whileHover={slot && slot.status !== 'reserved' ? { scale: 1.05, zIndex: 20 } : {}}
                  whileTap={slot && slot.status !== 'reserved' ? { scale: 0.95 } : {}}
                  onClick={() => slot && handleSlotClick(slot)}
                  className={`
                    w-20 h-24 md:w-24 md:h-28 rounded-xl border-2 flex flex-col items-center justify-center
                    cursor-pointer transition-colors duration-300 relative backdrop-blur-sm
                    ${bgColor} ${borderColor} ${shadow}
                    ${!slot && !road ? 'opacity-0 pointer-events-none' : ''}
                  `}
                >
                  {content}
                  
                  {/* Path connection effect */}
                  {inPath && (
                    <motion.div 
                      layoutId="pathEffect"
                      className="absolute inset-0 border-[3px] border-[var(--color-neon-blue)] rounded-xl filter blur-[4px] opacity-80 pointer-events-none" 
                    />
                  )}
                </motion.div>
              );
            })
          ))}
        </div>
      </div>

      {/* Path Stats Panel */}
      <AnimatePresence>
        {pathStats && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 glass-panel border-[var(--color-neon-blue)]/50 px-6 py-3 rounded-full flex gap-6 items-center shadow-[0_10px_30px_rgba(0,243,255,0.15)] z-40"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Distance</span>
              <span className="font-bold text-white">{pathStats.distance}m</span>
            </div>
            <div className="w-px h-6 bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">Est. Time</span>
              <span className="font-bold text-[var(--color-neon-blue)]">{pathStats.eta}</span>
            </div>
            <div className="w-px h-6 bg-gray-700"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest">AI Nodes</span>
              <span className="font-bold text-purple-400">{pathStats.nodesExplored}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InteractiveMap;
