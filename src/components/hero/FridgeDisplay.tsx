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
  // Simulated fields for UI realism based on reference
  used30Days?: number;
  imageUrl?: string;
  supplier?: string;
};

interface FridgeDisplayProps {
  products: ProductData[];
}

// Sparkline SVG Component
const Sparkline = () => (
  <svg viewBox="0 0 100 30" className="w-full h-24 stroke-[#8EE000] fill-none mt-4">
    <path
      d="M0,25 L10,15 L20,20 L30,10 L40,18 L50,5 L60,12 L70,22 L80,10 L90,25 L100,5"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0,25 L10,15 L20,20 L30,10 L40,18 L50,5 L60,12 L70,22 L80,10 L90,25 L100,5 L100,30 L0,30 Z"
      className="fill-[#8EE000]/10 stroke-none"
    />
  </svg>
);

export default function FridgeDisplay({ products }: FridgeDisplayProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [active, setActive] = useState<ProductData | null>(null);

  // Group products into "shelves" (chunks of 4 or 5)
  const shelves = [];
  for (let i = 0; i < products.length; i += 5) {
    shelves.push(products.slice(i, i + 5));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-[1400px] mx-auto p-4 lg:p-8 min-h-screen bg-[#0a0a0c] text-white font-sans">
      
      {/* Left Column: The Fridge */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4 px-2">
          <h2 className="text-xl font-bold tracking-tight">STOCKBRU</h2>
          <div className="flex items-center gap-3 bg-[#161618] px-4 py-2 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-[#8EE000]"></div>
            <span className="text-sm font-medium">Fridge 1</span>
            <span className="text-sm text-gray-400 border-l border-white/10 pl-3">3.7°C</span>
          </div>
        </div>

        {/* Fridge Cabinet */}
        <div className="relative w-full max-w-[800px] bg-[#111114] border border-white/10 rounded-2xl p-6 pb-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
          {/* Top internal LED light */}
          <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-white/40 blur-[2px] rounded-full"></div>

          <div className="relative z-10 flex flex-col gap-12 mt-8">
            {shelves.map((shelf, sIdx) => (
              <div key={sIdx} className="relative flex justify-center gap-6 pb-2">
                {/* Wire Rack Shelf */}
                <div className="absolute bottom-0 left-[-20px] right-[-20px] h-2 border-b-2 border-dashed border-[#333] shadow-[0_4px_10px_rgba(0,0,0,0.8)]"></div>
                <div className="absolute bottom-[-6px] left-[-20px] right-[-20px] h-1 bg-gradient-to-r from-transparent via-[#222] to-transparent"></div>

                {shelf.map((bottle) => {
                  const isHovered = hovered === bottle.id;
                  const isActive = active?.id === bottle.id;
                  const stock = bottle.Inventory?.fullBottles || 0;
                  const used = bottle.used30Days || Math.floor(Math.random() * 15);
                  
                  return (
                    <div 
                      key={bottle.id}
                      className="relative cursor-pointer group flex flex-col items-center justify-end h-48 w-24"
                      onMouseEnter={() => setHovered(bottle.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => setActive(bottle)}
                    >
                      {/* Realistic Bottle Representation */}
                      <motion.div 
                        animate={{ 
                          scale: isHovered || isActive ? 1.05 : 1,
                          filter: isHovered || isActive 
                            ? "grayscale(0%) brightness(1.1) drop-shadow(0 0 20px rgba(255,255,255,0.15))" 
                            : "grayscale(60%) brightness(0.6) drop-shadow(0 0 0 rgba(0,0,0,0))"
                        }}
                        className="relative w-16 h-40 bg-[#1a1a1c] rounded-t-lg rounded-b-md border border-white/10 flex flex-col items-center justify-end overflow-hidden shadow-inner"
                      >
                        {/* Bottle Neck */}
                        <div className="absolute top-0 w-6 h-12 bg-[#222] border-x border-white/5"></div>
                        {/* Label */}
                        <div className="w-full h-20 bg-[#fdfdfd] mb-4 flex flex-col items-center justify-center border-y border-[#ddd]">
                          <span className="text-[#111] text-[10px] font-black tracking-tighter uppercase text-center leading-tight px-1">
                            {bottle.name.split(' ')[0]}
                          </span>
                          <span className="text-[#666] text-[6px] uppercase tracking-widest mt-1">
                            {bottle.category}
                          </span>
                        </div>
                        {/* Liquid tint */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#8EE000]/10 to-transparent mix-blend-overlay"></div>
                      </motion.div>

                      {/* Tooltip on Hover */}
                      <AnimatePresence>
                        {isHovered && !isActive && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            className="absolute -top-24 z-50 bg-[#1e1e22] border border-white/10 rounded-xl p-3 w-48 shadow-2xl pointer-events-none"
                          >
                            <h4 className="text-sm font-semibold text-white mb-2 truncate">{bottle.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#8EE000]"></div>
                              <span>Stock: {stock} bottles</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#8EE000]"></div>
                              <span>Used (30d): {used} bottles</span>
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

          {/* Fridge Vents */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-4 opacity-30">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-6 h-1 bg-[#444] rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Walkthrough Footer */}
        <div className="w-full max-w-[800px] mt-8 grid grid-cols-3 gap-4">
          <div className="bg-[#111114] border border-white/5 rounded-xl p-4 flex items-start gap-4">
            <div className="w-6 h-6 rounded-full border border-[#8EE000] text-[#8EE000] flex items-center justify-center text-xs shrink-0">1</div>
            <div>
              <h5 className="text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Hover</h5>
              <p className="text-xs text-gray-500">Hover over any bottle to quickly view stock and usage info.</p>
            </div>
          </div>
          <div className="bg-[#111114] border border-white/5 rounded-xl p-4 flex items-start gap-4">
            <div className="w-6 h-6 rounded-full border border-[#8EE000] text-[#8EE000] flex items-center justify-center text-xs shrink-0">2</div>
            <div>
              <h5 className="text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Click</h5>
              <p className="text-xs text-gray-500">Click a bottle to open detailed inventory information.</p>
            </div>
          </div>
          <div className="bg-[#111114] border border-white/5 rounded-xl p-4 flex items-start gap-4">
            <div className="w-6 h-6 rounded-full border border-[#8EE000] text-[#8EE000] flex items-center justify-center text-xs shrink-0">3</div>
            <div>
              <h5 className="text-xs font-bold text-gray-300 mb-1 uppercase tracking-wider">Manage</h5>
              <p className="text-xs text-gray-500">Track usage, manage stock levels, and make decisions.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Active Sidebar */}
      <AnimatePresence mode="popLayout">
        {active && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            className="w-full lg:w-[420px] bg-[#111114] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col"
          >
            <div className="flex justify-end">
              <button onClick={() => setActive(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition">
                <X size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Giant Active Bottle Image Placeholder */}
            <div className="flex justify-center mb-8 mt-4">
               <div className="relative w-32 h-80 bg-[#1a1a1c] rounded-t-2xl rounded-b-lg border border-white/10 flex flex-col items-center justify-end shadow-[0_0_50px_rgba(142,224,0,0.1)]">
                 <div className="absolute top-0 w-10 h-24 bg-[#222] border-x border-white/5"></div>
                 <div className="w-full h-40 bg-[#fdfdfd] mb-8 flex flex-col items-center justify-center border-y border-[#ddd] shadow-inner px-2">
                   <span className="text-[#111] text-xl font-black tracking-tighter uppercase text-center leading-none">
                     {active.name.split(' ')[0]}
                   </span>
                   <span className="text-[#666] text-xs uppercase tracking-widest mt-2 text-center leading-tight">
                     {active.category}
                   </span>
                 </div>
               </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{active.name}</h3>
              <p className="text-sm text-gray-400 tracking-wide">{active.category} • {active.bottleSizeMl || 750}ml</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Current Stock</span>
                <span className="text-3xl font-light text-[#8EE000]">
                  {active.Inventory?.fullBottles || 0}
                </span>
                <span className="text-xs text-gray-500 block mt-1">bottles</span>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Used (30 Days)</span>
                <span className="text-3xl font-light text-white">
                  {active.used30Days || Math.floor(Math.random() * 15)}
                </span>
                <span className="text-xs text-gray-500 block mt-1">bottles</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-white">Stock Trend (30 Days)</span>
              </div>
              <div className="relative">
                <Sparkline />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1 uppercase">
                  <span>30d ago</span>
                  <span>Today</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">Reorder Level</span>
                <span className="text-sm text-white font-medium">{active.minimumStock} bottles</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">Par Level</span>
                <span className="text-sm text-white font-medium">{active.minimumStock * 3} bottles</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">Category</span>
                <span className="text-sm text-white font-medium">{active.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">Supplier</span>
                <span className="text-sm text-white font-medium">{active.supplier || 'Benchmark Beverages'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">Cost per Bottle</span>
                <span className="text-sm text-white font-medium">${active.costPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">Retail Price</span>
                <span className="text-sm text-white font-medium">${active.sellingPrice.toFixed(2)}</span>
              </div>
            </div>

            <button className="mt-auto w-full bg-white/5 hover:bg-white/10 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition border border-white/10">
              <Info size={16} />
              View Full Details
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
