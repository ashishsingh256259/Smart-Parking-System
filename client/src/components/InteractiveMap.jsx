import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aStar } from '../algorithms/aStar';

const InteractiveMap = ({ slots, onSlotClick }) => {
  const [path, setPath] = useState([]);
  const [visited, setVisited] = useState([]);
  const [targetSlot, setTargetSlot] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Grid size 5x5
  const GRID_WIDTH = 5;
  const GRID_HEIGHT = 5;
  const ENTRY_GATE = { x: 0, y: 0 }; // Assume 0,0 is entry

  const handleSlotClick = (slot) => {
    if (isAnimating || slot.status !== 'available') {
      onSlotClick(slot);
      return;
    }
    
    setTargetSlot(slot);
    onSlotClick(slot);
    
    // Calculate obstacles (occupied or reserved slots)
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

    // Animate
    setIsAnimating(true);
    setVisited([]);
    setPath([]);

    // Animate visited nodes (exploration)
    let visitTimeout;
    visitedNodes.forEach((node, idx) => {
      visitTimeout = setTimeout(() => {
        setVisited(prev => [...prev, node]);
      }, idx * 50);
    });

    // Animate final path
    setTimeout(() => {
      newPath.forEach((node, idx) => {
        setTimeout(() => {
          setPath(prev => [...prev, node]);
          if (idx === newPath.length - 1) {
            setIsAnimating(false);
          }
        }, idx * 100);
      });
    }, visitedNodes.length * 50 + 200);
  };

  const isPathNode = (x, y) => path.some(p => p.x === x && p.y === y);
  const isVisitedNode = (x, y) => visited.some(v => v.x === x && v.y === y);

  return (
    <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Interactive Parking Map</h3>
        <div className="flex gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[var(--color-neon-green)] shadow-[0_0_8px_var(--color-neon-green)]"></span> Available</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_red]"></span> Occupied</div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_8px_yellow]"></span> Reserved</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4 relative z-10 p-4 border border-[rgba(255,255,255,0.05)] rounded-xl bg-black/40">
        {/* Entry Gate Indicator */}
        <div className="absolute -top-3 -left-3 px-3 py-1 bg-[var(--color-neon-blue)] text-black font-bold rounded-lg text-xs shadow-[0_0_10px_var(--color-neon-blue)] z-20">
          ENTRY
        </div>

        {Array.from({ length: GRID_HEIGHT }).map((_, y) => (
          Array.from({ length: GRID_WIDTH }).map((_, x) => {
            const slot = slots.find(s => s.x === x && s.y === y);
            const inPath = isPathNode(x, y);
            const isExplored = isVisitedNode(x, y) && !inPath;
            
            let bgColor = "bg-gray-800/50";
            let borderColor = "border-gray-700";
            let shadow = "";
            let pulse = false;

            if (slot) {
              if (slot.status === 'available') {
                bgColor = "bg-[var(--color-neon-green)]/10 hover:bg-[var(--color-neon-green)]/30";
                borderColor = "border-[var(--color-neon-green)]/50";
                shadow = "hover:shadow-[0_0_15px_rgba(57,255,20,0.4)]";
              } else if (slot.status === 'occupied') {
                bgColor = "bg-red-500/10 hover:bg-red-500/30";
                borderColor = "border-red-500/50 hover:border-red-400";
                shadow = "hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]";
              } else if (slot.status === 'reserved') {
                bgColor = "bg-yellow-400/10";
                borderColor = "border-yellow-400/50";
              }
            }

            if (inPath) {
              bgColor = "bg-[var(--color-neon-blue)]/40";
              borderColor = "border-[var(--color-neon-blue)]";
              shadow = "shadow-[0_0_15px_var(--color-neon-blue)]";
              pulse = true;
            } else if (isExplored) {
              bgColor = "bg-purple-500/20";
            }

            return (
              <motion.div
                key={`${x}-${y}`}
                whileHover={slot && slot.status !== 'reserved' ? { scale: 1.05 } : {}}
                whileTap={slot && slot.status !== 'reserved' ? { scale: 0.95 } : {}}
                onClick={() => slot && handleSlotClick(slot)}
                className={`
                  aspect-square rounded-lg border-2 flex flex-col items-center justify-center
                  cursor-pointer transition-all duration-300 relative
                  ${bgColor} ${borderColor} ${shadow} ${pulse ? 'animate-pulse' : ''}
                  ${!slot ? 'opacity-20 pointer-events-none' : ''}
                `}
              >
                {slot && (
                  <>
                    <span className="font-bold text-lg">{slot.slotId}</span>
                    {slot.type === 'ev' && <span className="text-xs text-blue-400 absolute bottom-1 right-1">⚡</span>}
                    {slot.type === 'disabled' && <span className="text-xs text-blue-400 absolute bottom-1 right-1">♿</span>}
                    {slot.status === 'available' && (
                      <span className="text-[10px] text-gray-400 mt-1">{slot.predictionPercentage}% AI</span>
                    )}
                  </>
                )}
                
                {/* Path line connector visualization (simplified) */}
                {inPath && (
                  <div className="absolute inset-0 border-2 border-[var(--color-neon-blue)] rounded-lg filter blur-[2px] opacity-70 pointer-events-none" />
                )}
              </motion.div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default InteractiveMap;
