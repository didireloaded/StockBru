"use client";

import { ChevronDown, Grid, List, Eye, ShoppingCart, ArrowDownToLine, MoreHorizontal } from "lucide-react";

export type InventoryItem = {
  id: string;
  name: string;
  status: "Normal" | "Low" | "Critical";
  imageUrl: string;
  
  fullBottles: number;
  openBottles: number;
  openMl: number;
  
  salesToday: number;
  salesWeek: number;
  lastStockTake: string;
  supplier: string;
  reorderLevel: number;
};

export default function InventoryExplorer({ items }: { items: InventoryItem[] }) {
  return (
    <div className="flex flex-col h-full bg-[#121212] rounded-2xl p-6 border border-[#2A2A2A]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#F3F4F6] flex items-center gap-3">
            Inventory Explorer <span className="text-xs font-mono bg-[#1C1C1C] border border-[#2A2A2A] text-[#9CA3AF] px-2 py-0.5 rounded-full">{items.length} items</span>
          </h2>
          <p className="text-sm text-[#9CA3AF] mt-1">Live visualization of all physical stock.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-between w-[200px] px-3 py-2.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg cursor-pointer hover:border-[#DDAA33]/50 transition-colors">
            <span className="text-sm text-[#F3F4F6]">All Categories</span>
            <ChevronDown size={14} className="text-[#9CA3AF]" />
          </div>
          <div className="flex items-center justify-between w-[150px] px-3 py-2.5 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg cursor-pointer hover:border-[#DDAA33]/50 transition-colors">
            <span className="text-sm text-[#F3F4F6]">Sort: A-Z</span>
            <ChevronDown size={14} className="text-[#9CA3AF]" />
          </div>
          <div className="flex gap-1 bg-[#1C1C1C] border border-[#2A2A2A] p-1 rounded-lg text-[#9CA3AF]">
            <button className="p-1.5 bg-[#2A2A2A] rounded text-[#DDAA33]"><Grid size={16} /></button>
            <button className="p-1.5 hover:text-[#F3F4F6] transition-colors"><List size={16} /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {items.map((item) => {
          const statusColor = 
            item.status === "Normal" ? "bg-[#34D399]" :
            item.status === "Low" ? "bg-[#FBBF24]" :
            "bg-[#F87171]";

          return (
            <div key={item.id} className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl flex flex-col relative group overflow-hidden h-[380px] shadow-lg">
              
              {/* Default Card View */}
              <div className="flex flex-col h-full p-5 z-0">
                <div className="flex justify-between items-start mb-2">
                  <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-[#121212] ${statusColor}`}>
                    {item.status}
                  </div>
                  <button className="text-[#9CA3AF] hover:text-[#F3F4F6]"><MoreHorizontal size={18} /></button>
                </div>
                
                <div className="flex-1 flex items-center justify-center py-2 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent opacity-20 pointer-events-none"></div>
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="h-36 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl z-10"
                  />
                </div>
                
                <div className="flex flex-col mt-4">
                  <h3 className="text-base font-bold text-[#F3F4F6] truncate">{item.name}</h3>
                  <div className="flex items-end justify-between mt-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Full Bottles</span>
                      <span className="text-2xl font-black text-[#F3F4F6] leading-none mt-1">{item.fullBottles}</span>
                    </div>
                    {(item.openBottles > 0) && (
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-[#DDAA33] uppercase tracking-wider">Open</span>
                        <span className="text-sm font-bold text-[#DDAA33] mt-1">{item.openBottles} <span className="text-[10px] text-[#DDAA33]/70">({item.openMl}ml)</span></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions Bar (Bottom) */}
              <div className="h-12 border-t border-[#2A2A2A] bg-[#121212] flex items-center justify-between px-2 z-0">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#2A2A2A] py-1.5 rounded transition-colors">
                  <Eye size={14} /> View
                </button>
                <div className="w-px h-6 bg-[#2A2A2A]"></div>
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#DDAA33] hover:text-[#b88d2a] hover:bg-[#DDAA33]/10 py-1.5 rounded transition-colors">
                  <ShoppingCart size={14} /> Sell
                </button>
                <div className="w-px h-6 bg-[#2A2A2A]"></div>
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#34D399] hover:text-[#059669] hover:bg-[#34D399]/10 py-1.5 rounded transition-colors">
                  <ArrowDownToLine size={14} /> Receive
                </button>
              </div>

              {/* Hover Experience (Quick Inventory Preview) */}
              <div className="absolute inset-0 bg-[#121212]/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex flex-col p-6 translate-y-4 group-hover:translate-y-0">
                <h4 className="text-[#DDAA33] text-sm font-bold border-b border-[#2A2A2A] pb-3 mb-4">Quick Insights</h4>
                
                <div className="flex flex-col gap-3.5 flex-1">
                  <HoverRow label="Current Stock" value={`${item.fullBottles} btls`} />
                  <HoverRow label="Open Bottles" value={`${item.openBottles} (${item.openMl}ml)`} />
                  <div className="h-px bg-[#2A2A2A] my-1"></div>
                  <HoverRow label="Sales Today" value={`${item.salesToday} btls`} highlight />
                  <HoverRow label="Sales Week" value={`${item.salesWeek} btls`} />
                  <div className="h-px bg-[#2A2A2A] my-1"></div>
                  <HoverRow label="Last Stock Take" value={item.lastStockTake} />
                  <HoverRow label="Reorder Level" value={`${item.reorderLevel} btls`} color={item.fullBottles <= item.reorderLevel ? "text-[#F87171]" : "text-[#F3F4F6]"} />
                  <HoverRow label="Supplier" value={item.supplier} truncate />
                </div>

                <button className="w-full py-3 bg-[#DDAA33] text-[#121212] font-bold text-xs rounded-lg hover:bg-[#b88d2a] transition-colors mt-auto shadow-lg shadow-[#DDAA33]/20">
                  Open Product Details
                </button>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}

function HoverRow({ label, value, highlight = false, color = "text-[#F3F4F6]", truncate = false }: { label: string, value: string, highlight?: boolean, color?: string, truncate?: boolean }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-[#9CA3AF] shrink-0">{label}</span>
      <span className={`font-mono font-medium ${highlight ? 'text-[#DDAA33]' : color} ${truncate ? 'truncate max-w-[100px]' : ''}`} title={value}>{value}</span>
    </div>
  );
}
