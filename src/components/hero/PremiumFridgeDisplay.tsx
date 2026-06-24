"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Info } from "lucide-react";

export type ProductData = {
  id: string;
  name: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  minimumStock: number;
  bottleSizeMl?: number | null;
  Inventory: {
    fullBottles: number;
    openBottleMl: number;
  } | null;
  used30Days?: number;
  imageUrl?: string;
  supplier?: string;
};

interface PremiumFridgeDisplayProps {
  products: ProductData[];
}

// Sparkline SVG Component
const Sparkline = () => (
  <svg viewBox="0 0 100 30" className="w-full h-24 stroke-[#D4AF37] fill-none mt-4">
    <path
      d="M0,25 L10,15 L20,20 L30,10 L40,18 L50,5 L60,12 L70,22 L80,10 L90,25 L100,5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: 'drop-shadow(0px 0px 4px rgba(212,175,55,0.5))' }}
    />
    <path
      d="M0,25 L10,15 L20,20 L30,10 L40,18 L50,5 L60,12 L70,22 L80,10 L90,25 L100,5 L100,30 L0,30 Z"
      className="fill-[#D4AF37]/10 stroke-none"
    />
  </svg>
);

export default function PremiumFridgeDisplay({ products }: PremiumFridgeDisplayProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<ProductData | null>(null);

  // Group products into "shelves" (chunks of 4 or 5)
  const shelves = [];
  for (let i = 0; i < products.length; i += 5) {
    shelves.push(products.slice(i, i + 5));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full p-6 min-h-[600px] bg-[#0B0F14] text-white font-sans overflow-hidden relative">
      
      {/* Background ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#22C55E]/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Left Column: The Fridge */}
      <div className="flex-1 flex flex-col items-center z-10 w-full">
        <div className="w-full max-w-[1000px] flex justify-between items-center mb-6 px-4">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">STOCKBRU</h2>
            <span className="text-xs tracking-[0.3em] text-[#FFFFFF] uppercase">Premium Inventory</span>
          </div>
          <div className="flex items-center gap-3 glass-panel px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.1)]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]"></div>
            <span className="text-sm font-semibold tracking-wide">Fridge A1</span>
            <span className="text-sm text-gray-400 border-l border-white/20 pl-3 font-mono">3.7°C</span>
          </div>
        </div>

        {/* Fridge Cabinet */}
        <div className="relative w-full max-w-[1000px] bg-[#111114] border border-white/10 rounded-[2rem] p-8 pb-16 shadow-[inset_0_0_100px_rgba(0,0,0,0.8),_0_25px_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Internal LED lighting gradient */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-white/5 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>
          
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-white/60 blur-[3px] rounded-full shadow-[0_0_30px_rgba(255,255,255,1)]"></div>

          <div className="relative z-10 flex flex-col gap-16 mt-12">
            {shelves.map((shelf, sIdx) => (
              <div key={sIdx} className="relative flex justify-center gap-10 pb-3">
                {/* Photorealistic Wire Rack Shelf */}
                <div className="absolute bottom-0 left-[-40px] right-[-40px] h-3 border-b-4 border-double border-[#444] shadow-[0_10px_20px_rgba(0,0,0,0.9)]"></div>
                <div className="absolute bottom-3 left-[-40px] right-[-40px] h-[1px] bg-white/20"></div>

                {shelf.map((bottle) => {
                  const isHovered = hovered === bottle.id;
                  const isActive = active?.id === bottle.id;
                  const stock = bottle.Inventory?.fullBottles || 0;
                  
                  return (
                    <div 
                      key={bottle.id}
                      className="relative cursor-pointer group flex flex-col items-center justify-end h-56 w-28"
                      onMouseEnter={() => setHovered(bottle.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setActive(bottle)}
                    >
                      {/* Realistic Bottle Representation */}
                      <motion.div 
                        animate={{ 
                          scale: isHovered || isActive ? 1.1 : 1,
                          y: isHovered || isActive ? -10 : 0,
                          filter: isHovered || isActive 
                            ? "drop-shadow(0 0 25px rgba(255,255,255,0.4)) brightness(1.1)" 
                            : "drop-shadow(0 10px 15px rgba(0,0,0,0.5)) brightness(0.8)"
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="relative w-20 h-48 flex flex-col items-center justify-end z-20"
                      >
                        {bottle.imageUrl ? (
                          <div className="relative w-full h-full rounded-[15px] overflow-hidden">
                            {/* Standard img is easier without configuring Next.js domains */}
                            <img 
                              src={bottle.imageUrl} 
                              alt={bottle.name}
                              className="object-cover w-full h-full rounded-[15px]"
                            />
                            {/* Glass glare overlay */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 mix-blend-overlay rounded-[15px]"></div>
                          </div>
                        ) : (
                          // Fallback styled bottle if no image
                          <div className="w-full h-full bg-[#1a1a1c] rounded-t-[15px] rounded-b-md border border-white/20 overflow-hidden relative">
                             <div className="absolute top-0 w-8 h-12 left-1/2 -translate-x-1/2 bg-[#222] border-x border-white/10"></div>
                             <div className="absolute bottom-8 w-full h-20 bg-white flex items-center justify-center">
                               <span className="text-black text-[10px] font-black uppercase text-center px-1">{bottle.name.split(' ')[0]}</span>
                             </div>
                             <div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/20 to-transparent mix-blend-overlay"></div>
                          </div>
                        )}
                      </motion.div>

                      {/* Reflection on shelf */}
                      <div className="absolute -bottom-8 w-16 h-8 bg-gradient-to-t from-transparent to-white/10 blur-[2px] scale-y-[-1] opacity-50 z-0 pointer-events-none"></div>

                      {/* Tooltip on Hover */}
                      <AnimatePresence>
                        {isHovered && !isActive && (
                          <motion.div 
                            initial={{ opacity: 0, y: 15, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            transition={{ duration: 0.15 }}
                            className="absolute -top-24 z-50 glass-panel rounded-xl p-3 w-48 shadow-2xl pointer-events-none"
                          >
                            <h4 className="text-sm font-semibold text-white mb-1 truncate">{bottle.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                              <div className="w-2 h-2 rounded-full bg-[#D4AF37] shadow-[0_0_5px_#D4AF37]"></div>
                              <span className="font-mono">{stock} bottles left</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Fridge Bottom Vent */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 opacity-20 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="w-8 h-2 bg-black rounded-full shadow-inner"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Active Sidebar */}
      <AnimatePresence mode="popLayout">
        {active && (
          <motion.div 
            initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 40, filter: 'blur(10px)', transition: { duration: 0.2 } }}
            className="w-full lg:w-[450px] glass-panel rounded-[2rem] p-8 shadow-2xl flex flex-col relative z-20 h-fit sticky top-12"
          >
            {/* Glowing accent line */}
            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#FFFFFF] to-transparent shadow-[0_0_15px_#FFFFFF]"></div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#FFFFFF] font-bold">{active.category}</span>
                <h3 className="text-3xl font-black text-white mt-1 leading-tight">{active.name}</h3>
              </div>
              <button onClick={() => setActive(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition">
                <X size={20} className="text-gray-400" />
              </button>
            </div>

            <div className="flex gap-6 mb-8">
               <div className="w-32 h-48 bg-[#1a1a1c] rounded-[15px] border border-white/10 flex flex-col items-center justify-end shadow-inner relative overflow-hidden shrink-0">
                 {active.imageUrl ? (
                   <img src={active.imageUrl} alt={active.name} className="object-cover w-full h-full" />
                 ) : (
                   <div className="w-full h-full bg-gray-800"></div>
                 )}
                 <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>
               </div>
               
               <div className="flex flex-col justify-center gap-4 flex-1">
                 <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                   <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Current Stock</span>
                   <div className="flex items-baseline gap-2">
                     <span className="text-4xl font-light text-[#D4AF37]">{active.Inventory?.fullBottles || 0}</span>
                     <span className="text-sm text-gray-500">btls</span>
                   </div>
                 </div>
                 <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                   <span className="text-[10px] text-gray-400 uppercase tracking-widest block mb-1">Retail Price</span>
                   <div className="flex items-baseline gap-2">
                     <span className="text-3xl font-light text-white">${active.sellingPrice.toFixed(2)}</span>
                   </div>
                 </div>
               </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-white">Demand Trend</span>
                <TrendingUp size={16} className="text-[#D4AF37]" />
              </div>
              <div className="relative bg-white/5 rounded-xl p-4 border border-white/5">
                <Sparkline />
                <div className="flex justify-between text-[10px] text-gray-500 mt-2 uppercase font-mono">
                  <span>-30 Days</span>
                  <span>Used: {active.used30Days || 12}</span>
                  <span>Today</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-sm text-gray-400">Reorder Level</span>
                <span className="text-sm text-white font-mono">{active.minimumStock} btls</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-sm text-gray-400">Supplier</span>
                <span className="text-sm text-white">{active.supplier || 'Benchmark Beverages'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-white/5">
                <span className="text-sm text-gray-400">Cost Price</span>
                <span className="text-sm text-white font-mono">${active.costPrice.toFixed(2)}</span>
              </div>
            </div>

            <button className="mt-8 w-full bg-[#D4AF37] hover:bg-[#b5952f] text-[#0B0F14] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <Info size={18} />
              Manage Inventory
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
