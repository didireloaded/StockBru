"use client";

import { Activity, AlertTriangle, ArrowUpRight, CheckCircle2, ChevronRight, Package, TrendingUp } from "lucide-react";
import InventoryExplorer, { InventoryItem } from "@/components/dashboard/InventoryExplorer";

const inventoryItems: InventoryItem[] = [
  { id: "1", name: "Ciroc Vodka", status: "Normal", imageUrl: "https://images.unsplash.com/photo-1626804475297-4160eb80bf85?w=200&h=400&fit=crop", fullBottles: 12, openBottles: 1, openMl: 420, salesToday: 3, salesWeek: 24, lastStockTake: "Today, 08:00", supplier: "Diageo", reorderLevel: 10 },
  { id: "2", name: "Grey Goose", status: "Normal", imageUrl: "https://images.unsplash.com/photo-1550985543-f47f38aeea53?w=200&h=400&fit=crop", fullBottles: 8, openBottles: 2, openMl: 350, salesToday: 1, salesWeek: 12, lastStockTake: "Today, 08:00", supplier: "Bacardi", reorderLevel: 5 },
  { id: "3", name: "Belvedere", status: "Normal", imageUrl: "https://images.unsplash.com/photo-1614316346936-39dd75eb82b3?w=200&h=400&fit=crop", fullBottles: 6, openBottles: 0, openMl: 0, salesToday: 0, salesWeek: 8, lastStockTake: "Today, 08:00", supplier: "LVMH", reorderLevel: 4 },
  { id: "4", name: "Hennessy VS", status: "Normal", imageUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&h=400&fit=crop", fullBottles: 10, openBottles: 1, openMl: 200, salesToday: 2, salesWeek: 15, lastStockTake: "Yesterday", supplier: "LVMH", reorderLevel: 5 },
  { id: "5", name: "Jameson", status: "Normal", imageUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=200&h=400&fit=crop", fullBottles: 15, openBottles: 2, openMl: 180, salesToday: 5, salesWeek: 35, lastStockTake: "Yesterday", supplier: "Pernod Ricard", reorderLevel: 10 },
  { id: "6", name: "Jack Daniel's", status: "Low", imageUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&h=400&fit=crop", fullBottles: 4, openBottles: 1, openMl: 650, salesToday: 4, salesWeek: 28, lastStockTake: "Today, 08:00", supplier: "Brown-Forman", reorderLevel: 6 },
  { id: "7", name: "Moet Brut", status: "Low", imageUrl: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?w=200&h=400&fit=crop", fullBottles: 5, openBottles: 0, openMl: 0, salesToday: 2, salesWeek: 18, lastStockTake: "Yesterday", supplier: "LVMH", reorderLevel: 6 },
  { id: "8", name: "Dom Pérignon", status: "Critical", imageUrl: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?w=200&h=400&fit=crop", fullBottles: 2, openBottles: 0, openMl: 0, salesToday: 0, salesWeek: 2, lastStockTake: "Today, 08:00", supplier: "LVMH", reorderLevel: 3 },
  { id: "9", name: "Gordon's Gin", status: "Low", imageUrl: "https://images.unsplash.com/photo-1614316346936-39dd75eb82b3?w=200&h=400&fit=crop", fullBottles: 4, openBottles: 2, openMl: 350, salesToday: 8, salesWeek: 45, lastStockTake: "Today, 08:00", supplier: "Diageo", reorderLevel: 12 },
  { id: "10", name: "Tanqueray", status: "Low", imageUrl: "https://images.unsplash.com/photo-1614316346936-39dd75eb82b3?w=200&h=400&fit=crop", fullBottles: 3, openBottles: 1, openMl: 150, salesToday: 4, salesWeek: 22, lastStockTake: "Today, 08:00", supplier: "Diageo", reorderLevel: 12 },
];

export default function Dashboard() {
  return (
    <div className="p-6 w-full flex flex-col xl:flex-row gap-6 h-full font-sans overflow-hidden">
      
      {/* Left/Center Column: Inventory Explorer Core */}
      <div className="flex-1 flex flex-col min-w-[60%] h-full overflow-hidden">
        <InventoryExplorer items={inventoryItems} />
      </div>

      {/* Right Column: Workflow Widgets */}
      <div className="w-full xl:w-[450px] flex-shrink-0 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
        
        {/* WhatsApp Shift Report Generator */}
        <button 
          onClick={() => {
            const report = `*End of Shift Report - StockMan*%0A*Manager:* Pedro Silva%0A*Time:* 18:00%0A%0A*Sales Highlight:*%0A- 3x Ciroc Vodka%0A- 5x Jameson%0A%0A*Low Stock Alert 🚨*%0A- Jack Daniel's (4 left)%0A- Dom Pérignon (2 left)%0A%0A*Action Needed:*%0A5 Purchase Orders pending generation.`;
            window.open(`https://wa.me/?text=${report}`, '_blank');
          }}
          className="w-full bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#25D366]/30 hover:border-[#25D366] rounded-2xl p-4 flex items-center justify-center gap-3 transition-colors shadow-lg shadow-[#25D366]/5 group"
        >
          <div className="w-8 h-8 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </div>
          <span className="text-[#F3F4F6] font-bold text-sm">Generate WhatsApp Shift Report</span>
        </button>
        
        {/* Widget: Stock Take Command Center */}
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-[#DDAA33]"></div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[#F3F4F6] flex items-center gap-2">
              <ClipboardCheck size={16} className="text-[#DDAA33]" /> Active Stock Take
            </h3>
            <span className="text-[10px] bg-[#DDAA33]/20 text-[#DDAA33] px-2 py-0.5 rounded font-bold uppercase tracking-wider">In Progress</span>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] text-[#9CA3AF] uppercase tracking-wider">Main Bar</span>
                <p className="text-2xl font-black text-[#F3F4F6] leading-none mt-1">68%</p>
              </div>
              <div className="text-right">
                 <span className="text-xs text-[#9CA3AF]">Variance:</span>
                 <span className="text-sm font-bold text-[#F87171] ml-1">-N$ 450</span>
              </div>
            </div>
            
            <div className="w-full h-2 bg-[#2A2A2A] rounded-full overflow-hidden">
              <div className="h-full bg-[#DDAA33] rounded-full" style={{ width: '68%' }}></div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#121212] rounded p-2 border border-[#2A2A2A]">
                <span className="text-[#9CA3AF] block mb-0.5">Counted</span>
                <span className="text-[#F3F4F6] font-bold">142 items</span>
              </div>
              <div className="bg-[#121212] rounded p-2 border border-[#2A2A2A]">
                <span className="text-[#9CA3AF] block mb-0.5">Remaining</span>
                <span className="text-[#F3F4F6] font-bold">65 items</span>
              </div>
            </div>
            
            <button className="w-full py-2 bg-[#2A2A2A] hover:bg-[#333333] text-[#F3F4F6] text-xs font-bold rounded-lg transition-colors mt-1">
              Resume Count &rarr;
            </button>
          </div>
        </div>

        {/* Widget: Open Bottle Dashboard */}
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[#F3F4F6]">Open Bottles</h3>
            <button className="text-[#DDAA33] text-[10px] hover:underline">View All</button>
          </div>
          <div className="flex flex-col gap-3">
             <OpenBottleRow name="Ciroc Vodka" ml={420} maxMl={750} />
             <OpenBottleRow name="Jameson" ml={180} maxMl={750} />
             <OpenBottleRow name="Gordon's Gin" ml={350} maxMl={750} />
             <OpenBottleRow name="Jack Daniel's" ml={650} maxMl={750} />
          </div>
        </div>

        {/* Widget: Reorder Center */}
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[#F3F4F6]">Reorder Center</h3>
            <span className="text-[10px] bg-[#F87171]/10 text-[#F87171] px-2 py-0.5 rounded font-bold uppercase tracking-wider">5 Action Required</span>
          </div>
          <div className="flex flex-col gap-3">
             <ReorderRow name="Ciroc Vodka" current={4} min={10} suggest={24} />
             <ReorderRow name="Gordon's Gin" current={4} min={12} suggest={24} />
             <ReorderRow name="Jack Daniel's" current={4} min={6} suggest={12} />
             <button className="w-full mt-2 py-2.5 bg-[#DDAA33] text-[#121212] text-xs font-bold rounded-lg hover:bg-[#b88d2a] transition-colors shadow-lg shadow-[#DDAA33]/20">
               Generate Purchase Orders
             </button>
          </div>
        </div>

        {/* Widget: Inventory Timeline */}
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-sm font-bold text-[#F3F4F6]">Inventory Timeline</h3>
            <span className="text-[10px] text-[#9CA3AF]">Today</span>
          </div>
          <div className="flex flex-col gap-0 relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-[#2A2A2A]"></div>
            <TimelineEvent time="11:45" type="adjust" title="Stock Adjustment" desc="Tanqueray Gin (-1 bottle)" />
            <TimelineEvent time="11:20" type="open" title="Opened Bottle" desc="Ciroc Vodka (Table 4)" />
            <TimelineEvent time="11:05" type="sell" title="Sold" desc="3 Ciroc Vodka, 2 Red Bull" />
            <TimelineEvent time="10:15" type="receive" title="Received Stock" desc="24 Ciroc Vodka (PO-1256)" />
          </div>
        </div>

      </div>
    </div>
  );
}

function OpenBottleRow({ name, ml, maxMl }: { name: string, ml: number, maxMl: number }) {
  const pct = Math.round((ml / maxMl) * 100);
  const colorClass = pct < 20 ? "bg-[#F87171]" : pct < 50 ? "bg-[#FBBF24]" : "bg-[#34D399]";
  
  return (
    <div className="flex flex-col gap-1.5 bg-[#121212] p-3 rounded-lg border border-[#2A2A2A]">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-[#F3F4F6]">{name}</span>
        <span className="text-xs font-mono text-[#DDAA33]">{ml}ml <span className="text-[#9CA3AF]">/ {maxMl}</span></span>
      </div>
      <div className="w-full h-1.5 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div className={`h-full ${colorClass}`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

function ReorderRow({ name, current, min, suggest }: { name: string, current: number, min: number, suggest: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#121212] border border-[#F87171]/20 rounded-lg">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-[#F3F4F6]">{name}</span>
        <div className="flex gap-2 text-[10px] mt-0.5">
          <span className="text-[#F87171]">Cur: {current}</span>
          <span className="text-[#9CA3AF]">Min: {min}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-[#9CA3AF] uppercase">Suggest</span>
        <span className="text-sm font-bold text-[#34D399]">{suggest}</span>
      </div>
    </div>
  );
}

function TimelineEvent({ time, type, title, desc }: { time: string, type: 'adjust' | 'open' | 'sell' | 'receive', title: string, desc: string }) {
  const colors = {
    adjust: 'bg-[#FBBF24] border-[#FBBF24]/30',
    open: 'bg-[#DDAA33] border-[#DDAA33]/30',
    sell: 'bg-[#F3F4F6] border-[#F3F4F6]/30',
    receive: 'bg-[#34D399] border-[#34D399]/30'
  };
  
  return (
    <div className="flex gap-4 relative pb-6 last:pb-0">
      <div className="flex flex-col items-center z-10 pt-1">
        <div className={`w-6 h-6 rounded-full border-4 border-[#1C1C1C] ${colors[type]}`}></div>
      </div>
      <div className="flex flex-col bg-[#121212] p-3 rounded-lg border border-[#2A2A2A] flex-1">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-[#F3F4F6]">{title}</span>
          <span className="text-[10px] font-mono text-[#9CA3AF] bg-[#2A2A2A] px-1.5 rounded">{time}</span>
        </div>
        <span className="text-[10px] text-[#9CA3AF] mt-1">{desc}</span>
      </div>
    </div>
  );
}
