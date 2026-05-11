import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aStar } from '../algorithms/aStar';
import { Car, MapPin, Zap, Info } from 'lucide-react';

const InteractiveMap = ({ slots, onSlotClick, autoNavigateTarget, surgeMultiplier = 1.0 }) => {
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

  useEffect(() => {
    if (autoNavigateTarget) {
      setTimeout(() => handleSlotClick(autoNavigateTarget, true), 100);
    }
  }, [autoNavigateTarget]);

  const handleSlotClick = (slot, force = false) => {
    if ((isAnimating && !force) || slot.status !== 'available') {
      if (!force) onSlotClick(slot);
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

  const occupancyDensity = slots.length > 0 ? slots.filter(s => s.status !== 'available').length / slots.length : 0;
  const heatmapColor = occupancyDensity > 0.8 ? 'rgba(239, 68, 68, 0.15)' : occupancyDensity > 0.5 ? 'rgba(250, 204, 21, 0.1)' : 'rgba(57, 255, 20, 0.05)';

  return (
    <div className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col h-full">
      {/* Smart Heatmap Overlay */}
      <div className="absolute inset-0 pointer-events-none transition-colors duration-1000 z-0 mix-blend-screen" style={{ backgroundColor: heatmapColor }}></div>
      {/* Background Holographic Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[rgba(0,243,255,0.03)] via-transparent to-transparent pointer-events-none z-0"></div>
      
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

          {/* Ambient Traffic Simulation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-30">
            <motion.div 
              className="absolute left-[30%] text-[var(--color-neon-blue)]"
              animate={{ top: ['-20%', '120%'] }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              <Car size={32} className="transform rotate-180 opacity-50 blur-[1px]" />
            </motion.div>
            <motion.div 
              className="absolute left-[70%] text-[var(--color-neon-green)]"
              animate={{ top: ['120%', '-20%'] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 3 }}
            >
              <Car size={32} className="opacity-50 blur-[1px]" />
            </motion.div>
          </div>

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
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-60">
                     <div className="text-gray-600 mb-1 font-bold text-xs">↑</div>
                     <div className="w-1 h-full border-l-[3px] border-dashed border-yellow-500/40"></div>
                     <div className="text-gray-600 mt-1 font-bold text-xs">↓</div>
                  </div>
                );
              } else if (slot) {
                if (slot.status === 'available') {
                  const isSurging = surgeMultiplier > 1.0;
                  bgColor = isSurging ? "bg-yellow-400/10 hover:bg-yellow-400/20" : "bg-[var(--color-neon-green)]/5 hover:bg-[var(--color-neon-green)]/20";
                  borderColor = isSurging ? "border-yellow-400/50 hover:border-yellow-400" : "border-[var(--color-neon-green)]/40 hover:border-[var(--color-neon-green)]";
                  shadow = isSurging ? "hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] shadow-[inset_0_0_10px_rgba(250,204,21,0.2)]" : "hover:shadow-[0_0_20px_rgba(57,255,20,0.4)]";
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
                    {slot.status === 'available' && (
                       <span className={`text-[10px] font-mono mt-0.5 font-bold z-10 ${surgeMultiplier > 1.0 ? 'text-yellow-400 animate-pulse' : 'text-green-500'}`}>
                          ₹{(50.0 * surgeMultiplier).toFixed(2)}
                       </span>
                    )}
                    {slot.type === 'ev' && <Zap size={14} className="text-blue-400 absolute bottom-2 right-2 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />}
                    {slot.type === 'disabled' && <span className="text-xs text-blue-400 absolute bottom-2 right-2">♿</span>}
                    
                    {/* Animated Prediction Ring */}
                    {slot.status === 'available' && (
                      <div className="absolute top-2 left-2 flex flex-col items-start">
                        <span className="text-[9px] text-[var(--color-neon-green)] font-bold tracking-wider">{slot.predictionPercentage}%</span>
                        <div className="w-8 h-1 bg-gray-800 rounded-full mt-0.5 overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${slot.predictionPercentage}%` }}
                            className="h-full bg-[var(--color-neon-green)] shadow-[0_0_5px_var(--color-neon-green)]"
                          />
                          <motion.div 
                            className="absolute top-0 bottom-0 w-3 bg-white/70 blur-[2px]"
                            animate={{ left: ['-50%', '150%'] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
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
                    
                    {/* EV Charging Status */}
                    {slot.status === 'occupied' && slot.type === 'ev' && (
                      <div className="absolute top-1 right-1 flex items-center gap-1 bg-black/50 px-1 py-0.5 rounded border border-blue-400/30">
                        <Zap size={10} className="text-blue-400 animate-pulse" />
                        <div className="w-4 h-2 border border-blue-400 rounded-sm p-[1px] relative flex">
                          <motion.div className="h-full bg-blue-400" animate={{ width: ['0%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
                        </div>
                      </div>
                    )}
                  </>
                );
              }

              // Pathfinding visuals
              if (inPath) {
                bgColor = "bg-[var(--color-neon-blue)]/40";
                borderColor = "border-[var(--color-neon-blue)]";
                shadow = "shadow-[0_0_30px_var(--color-neon-blue)]";
              } else if (isExplored) {
                bgColor = "bg-[var(--color-neon-blue)]/15";
                borderColor = "border-[var(--color-neon-blue)]/40";
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
                    ${road ? '!rounded-none !border-y-0 !border-x-[1px] !border-gray-800 bg-[#0c0c12]' : ''}
                  `}
                >
                  {content}
                  
                  {/* Destination Pulsing */}
                  {targetSlot && targetSlot.x === x && targetSlot.y === y && isAnimating && (
                    <motion.div 
                      className="absolute inset-0 border-[3px] border-[var(--color-neon-green)] rounded-xl z-20 pointer-events-none"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}

                  {/* Car Animation on Path */}
                  {inPath && path[path.length - 1].x === x && path[path.length - 1].y === y && (
                    <motion.div 
                      layoutId="navigationCar"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      className="absolute z-30 pointer-events-none flex items-center justify-center"
                    >
                      <Car size={40} className="text-[var(--color-neon-blue)] drop-shadow-[0_0_20px_rgba(0,243,255,1)] relative z-10" />
                      <motion.div className="absolute inset-0 bg-[var(--color-neon-blue)] rounded-full blur-[15px] opacity-60 z-0" animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
                    </motion.div>
                  )}

                  {/* Path connection effect */}
                  {inPath && (
                    <motion.div 
                      layoutId="pathEffect"
                      className="absolute inset-0 border-[3px] border-[var(--color-neon-blue)] rounded-xl filter blur-[4px] opacity-80 pointer-events-none shadow-[inset_0_0_20px_rgba(0,243,255,0.5)]" 
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
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

