"use client";

import { AlertTriangle, TrendingDown, ArrowLeft, Calendar, FileBarChart, Clock } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";

const cirocData = [
  { day: 'Mon', stock: 45 },
  { day: 'Tue', stock: 42 },
  { day: 'Wed', stock: 36 },
  { day: 'Thu', stock: 24 },
  { day: 'Fri', stock: 12 },
  { day: 'Sat', stock: 0 },
];

const riskItems = [
  { id: "1", name: "Ciroc Vodka", stockOut: "Saturday, 22:00", current: 12, burnRate: "15 btls / day", supplier: "Diageo" },
  { id: "2", name: "Moet Brut", stockOut: "Friday, 19:00", current: 4, burnRate: "3 btls / day", supplier: "LVMH" },
  { id: "3", name: "Red Bull", stockOut: "Saturday, 18:00", current: 60, burnRate: "45 cans / day", supplier: "Namibia Breweries" },
];

export default function Forecasting() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full h-full flex flex-col font-sans overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/analytics" className="w-10 h-10 bg-[#1C1C1C] border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#F3F4F6]">Inventory Forecasting</h1>
            <p className="text-sm text-[#9CA3AF]">AI-driven stock depletion predictions and risk analysis.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <select className="bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#F3F4F6] px-4 py-2.5 rounded-lg outline-none font-bold">
            <option>Weekend Rush (Next 48h)</option>
            <option>Next 7 Days</option>
            <option>End of Month</option>
          </select>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
        
        {/* Left Column: Risk Dashboard */}
        <div className="w-[450px] flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pb-10">
          <div className="bg-[#1C1C1C] border border-[#F87171]/30 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(248,113,113,0.05)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#F87171]"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#F87171]/10 flex items-center justify-center text-[#F87171]">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#F3F4F6]">High Risk Stock-Outs</h2>
                <p className="text-xs text-[#F87171]">Will hit zero before the weekend.</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {riskItems.map(item => (
                <div key={item.id} className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[#F3F4F6]">{item.name}</h3>
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#F87171] bg-[#F87171]/10 px-2 py-1 rounded">
                      <Clock size={12} /> {item.stockOut}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#1C1C1C] p-2 rounded border border-[#2A2A2A]">
                      <span className="text-[#9CA3AF] block mb-0.5">Current Stock</span>
                      <span className="text-[#F3F4F6] font-bold">{item.current}</span>
                    </div>
                    <div className="bg-[#1C1C1C] p-2 rounded border border-[#2A2A2A]">
                      <span className="text-[#9CA3AF] block mb-0.5">Burn Rate</span>
                      <span className="text-[#DDAA33] font-bold">{item.burnRate}</span>
                    </div>
                  </div>
                  <button className="w-full mt-1 py-2 bg-[#DDAA33]/10 hover:bg-[#DDAA33]/20 text-[#DDAA33] border border-[#DDAA33]/30 text-xs font-bold rounded transition-colors">
                    Draft PO: {item.supplier}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Predictive Charts */}
        <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pb-10">
          
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-6">
             <div className="flex justify-between items-center mb-8">
               <div>
                 <h3 className="text-lg font-bold text-[#F3F4F6]">Depletion Curve: Ciroc Vodka</h3>
                 <p className="text-xs text-[#9CA3AF] mt-1">Based on historical sales velocity and current reservations.</p>
               </div>
               <div className="px-3 py-1.5 bg-[#F87171]/10 border border-[#F87171]/20 rounded-lg">
                 <span className="text-xs font-bold text-[#F87171] flex items-center gap-2">
                   <TrendingDown size={14} /> Critical stock-out: Sat 22:00
                 </span>
               </div>
             </div>

             <div className="h-[300px] w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={cirocData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#F87171" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#F87171" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#121212', borderColor: '#2A2A2A', borderRadius: '8px' }}
                     itemStyle={{ color: '#F3F4F6' }}
                   />
                   <ReferenceLine y={10} label={{ position: 'top', value: 'Reorder Level', fill: '#DDAA33', fontSize: 10 }} stroke="#DDAA33" strokeDasharray="3 3" />
                   <Area type="monotone" dataKey="stock" stroke="#F87171" strokeWidth={3} fillOpacity={1} fill="url(#colorStock)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[#F3F4F6] mb-6">Upcoming Events Impact</h3>
            <div className="grid grid-cols-3 gap-4">
               <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
                 <div className="flex items-center gap-2 text-[#DDAA33] mb-2">
                   <Calendar size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Friday</span>
                 </div>
                 <p className="text-sm font-bold text-[#F3F4F6]">Payday Weekend</p>
                 <p className="text-xs text-[#9CA3AF] mt-1">Expected burn rate increase: +45% across all premium spirits.</p>
               </div>
               <div className="bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl">
                 <div className="flex items-center gap-2 text-[#DDAA33] mb-2">
                   <Calendar size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Saturday</span>
                 </div>
                 <p className="text-sm font-bold text-[#F3F4F6]">VIP Tables Fully Booked</p>
                 <p className="text-xs text-[#9CA3AF] mt-1">Expected burn rate increase: +80% on Champagnes.</p>
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
