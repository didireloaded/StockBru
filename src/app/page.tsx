"use client";

import { AlertTriangle, TrendingUp, TrendingDown, ClipboardCheck, ArrowUpRight, ArrowDownRight, Package, Receipt, FileText } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import SmartFridgeGrid, { FridgeItem } from "@/components/dashboard/SmartFridgeGrid";

const trendData = [
  { name: 'Apr 17', value: 200000 },
  { name: 'Apr 24', value: 240000 },
  { name: 'May 1', value: 280000 },
  { name: 'May 8', value: 310000 },
  { name: 'May 15', value: 425000 },
];

const healthData = [
  { name: 'Stock Accuracy', value: 97, color: '#34D399' },
  { name: 'Stock Availability', value: 92, color: '#34D399' },
  { name: 'Movement Tracking', value: 95, color: '#34D399' },
  { name: 'Stock Take Compliance', value: 93, color: '#34D399' },
  { name: 'Variance Rate', value: 2.1, color: '#DDAA33' },
];

const complianceData = [
  { name: 'Completed', value: 92, color: '#DDAA33' },
  { name: 'Overdue', value: 8, color: '#2A2A2A' },
];

const fridgeItems: FridgeItem[] = [
  { id: "1", name: "Ciroc Vodka", count: 12, status: "Normal", imageUrl: "https://images.unsplash.com/photo-1626804475297-4160eb80bf85?w=200&h=400&fit=crop" },
  { id: "2", name: "Grey Goose", count: 8, status: "Normal", imageUrl: "https://images.unsplash.com/photo-1550985543-f47f38aeea53?w=200&h=400&fit=crop" },
  { id: "3", name: "Belvedere", count: 6, status: "Normal", imageUrl: "https://images.unsplash.com/photo-1614316346936-39dd75eb82b3?w=200&h=400&fit=crop" },
  { id: "4", name: "Hennessy VS", count: 10, status: "Normal", imageUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&h=400&fit=crop" },
  { id: "5", name: "Jameson", count: 15, status: "Normal", imageUrl: "https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?w=200&h=400&fit=crop" },
  { id: "6", name: "Jack Daniel's", count: 9, status: "Low", imageUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&h=400&fit=crop" },
  { id: "7", name: "Moet Brut", count: 7, status: "Low", imageUrl: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?w=200&h=400&fit=crop" },
  { id: "8", name: "Veuve Clicquot", count: 5, status: "Low", imageUrl: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?w=200&h=400&fit=crop" },
  { id: "9", name: "Dom Pérignon", count: 2, status: "Critical", imageUrl: "https://images.unsplash.com/photo-1590593162201-f67611a18b87?w=200&h=400&fit=crop" },
  { id: "10", name: "Heineken", count: 24, status: "Normal", imageUrl: "https://images.unsplash.com/photo-1614316346936-39dd75eb82b3?w=200&h=400&fit=crop" },
  { id: "11", name: "Windhoek", count: 36, status: "Normal", imageUrl: "https://images.unsplash.com/photo-1614316346936-39dd75eb82b3?w=200&h=400&fit=crop" },
  { id: "12", name: "Red Bull", count: 30, status: "Normal", imageUrl: "https://images.unsplash.com/photo-1626804475297-4160eb80bf85?w=200&h=400&fit=crop" },
];

export default function Dashboard() {
  return (
    <div className="p-6 w-full flex gap-6 h-full font-sans overflow-hidden">
      
      {/* Left/Center Column (Metrics & Operations) */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
        
        {/* KPI Row */}
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Inventory Value</span>
            <span className="text-2xl font-bold text-[#F3F4F6] mt-2">N$ 425,000</span>
            <div className="flex items-center gap-1 text-[#34D399] text-xs mt-3">
              <ArrowUpRight size={12} /> <span className="font-semibold">12.4%</span> <span className="text-[#9CA3AF]">vs last 7 days</span>
            </div>
          </div>
          
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-4 flex justify-between relative overflow-hidden">
            <div className="flex flex-col justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Inventory Health</span>
              <span className="text-2xl font-bold text-[#F3F4F6] mt-2">94%</span>
              <span className="text-[#34D399] text-xs font-semibold mt-3">Excellent</span>
            </div>
            {/* Simple CSS Circle for 94% */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-4 border-[#2A2A2A] border-t-[#DDAA33] border-r-[#DDAA33] border-b-[#DDAA33] rotate-45"></div>
          </div>
          
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Estimated Revenue</span>
            <span className="text-2xl font-bold text-[#F3F4F6] mt-2">N$ 812,000</span>
            <div className="flex justify-between items-end mt-3">
              <div className="flex items-center gap-1 text-[#34D399] text-xs">
                <ArrowUpRight size={12} /> <span className="font-semibold">18.7%</span> <span className="text-[#9CA3AF]">vs last 7 days</span>
              </div>
              <TrendingUp size={24} className="text-[#DDAA33] opacity-50" />
            </div>
          </div>
          
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-4 flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Missing Inventory</span>
            <span className="text-2xl font-bold text-[#F3F4F6] mt-2">N$ 1,200</span>
            <div className="flex items-center gap-1 text-[#F87171] text-xs mt-3">
              <ArrowUpRight size={12} /> <span className="font-semibold">5.3%</span> <span className="text-[#F87171]/70">vs last 7 days</span>
            </div>
          </div>
          
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Open Bottles</span>
            <span className="text-2xl font-bold text-[#F3F4F6] mt-2">24</span>
            <span className="text-[#9CA3AF] text-xs mt-3">6.2% of total inventory</span>
            <WineIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2A2A2A] w-12 h-12" />
          </div>
          
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Low Stock Items</span>
            <span className="text-2xl font-bold text-[#F3F4F6] mt-2">18</span>
            <span className="text-[#F87171] text-xs mt-3">Needs attention</span>
            <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2A2A2A] w-12 h-12" />
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-[#F3F4F6]">Inventory Value Trend</h3>
              <select className="bg-[#121212] border border-[#2A2A2A] text-xs text-[#9CA3AF] rounded px-2 py-1 outline-none">
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DDAA33" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#DDAA33" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#DDAA33" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-5">
            <h3 className="text-sm font-bold text-[#F3F4F6] mb-6">Inventory Health Breakdown</h3>
            <div className="flex items-center justify-between">
              <div className="h-[180px] w-[180px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {healthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[#F3F4F6]">94%</span>
                  <span className="text-xs text-[#F3F4F6]">Excellent</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1 ml-8">
                {healthData.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[#9CA3AF]">{item.name}</span>
                    </div>
                    <span className="text-[#F3F4F6] font-bold">{item.value}{item.value > 10 ? '%' : '%'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Operations Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#F3F4F6]">Low Stock Alerts</h3>
              <button className="text-[#DDAA33] text-xs hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-3">
              {['Gordon\'s Gin', 'Tanqueray Gin', 'Bacardi White Rum'].map((name, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-[#2A2A2A] rounded-lg bg-[#121212]">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-8 bg-[#1C1C1C] rounded border border-[#2A2A2A]"></div>
                    <span className="text-sm font-bold text-[#F3F4F6]">{name}</span>
                  </div>
                  <div className="text-xs text-[#F87171] flex items-center gap-2">
                    <span>Reorder: 12 Bottles</span>
                    <ChevronDownIcon />
                  </div>
                </div>
              ))}
              {['Jack Daniel\'s', 'Moet Brut'].map((name, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-[#F87171]/20 rounded-lg bg-[#F87171]/5">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-8 bg-[#1C1C1C] rounded border border-[#F87171]/30"></div>
                    <span className="text-sm font-bold text-[#F3F4F6]">{name}</span>
                  </div>
                  <div className="text-xs text-[#F87171] flex items-center gap-2">
                    <span>Reorder: 6 Bottles</span>
                    <ChevronDownIcon />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#F3F4F6]">Recent Activity</h3>
              <button className="text-[#DDAA33] text-xs hover:underline">View All</button>
            </div>
            <div className="flex flex-col gap-6 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-[#2A2A2A]"></div>
              
              <ActivityItem icon={<ClipboardCheck size={14} />} title="Stock take completed - Main Bar" desc="by John Manager" time="2m ago" />
              <ActivityItem icon={<Package size={14} />} title="3 Bottles of Ciroc Vodka sold" desc="by John Manager" time="15m ago" />
              <ActivityItem icon={<Receipt size={14} />} title="New purchase order #PO-1256 approved" desc="by Pedro Manager" time="45m ago" />
              <ActivityItem icon={<FileText size={14} />} title="Stock adjustment - Tanqueray Gin" desc="by Mary Staff" time="1h ago" />
              <ActivityItem icon={<AlertTriangle size={14} />} title="Low stock alert - Moet Brut" desc="System Alert" time="2h ago" isAlert />
            </div>
          </div>
        </div>

        {/* Performance Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#F3F4F6]">Top Selling Products</h3>
              <button className="text-[#DDAA33] text-[10px] hover:underline">View Report</button>
            </div>
            <div className="flex flex-col gap-3">
              <TopProduct num={1} name="Ciroc Vodka" amt="24 Bottles" val="N$ 14,400" />
              <TopProduct num={2} name="Heineken" amt="48 Bottles" val="N$ 9,600" />
              <TopProduct num={3} name="Jameson" amt="18 Bottles" val="N$ 8,100" />
              <TopProduct num={4} name="Red Bull" amt="60 Cans" val="N$ 6,000" />
              <TopProduct num={5} name="Jack Daniel's" amt="15 Bottles" val="N$ 5,250" />
            </div>
          </div>

          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#F3F4F6]">Stock Take Compliance</h3>
              <button className="text-[#DDAA33] text-[10px] hover:underline">View Report</button>
            </div>
            <div className="flex items-center gap-6 mt-4">
              <div className="h-[100px] w-[100px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={complianceData} innerRadius={35} outerRadius={45} stroke="none" dataKey="value">
                      {complianceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-[#F3F4F6]">92%</span>
                  <span className="text-[8px] text-[#9CA3AF] uppercase">Completed</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <span className="text-[10px] text-[#9CA3AF] uppercase block">This Week</span>
                  <span className="text-lg font-bold text-[#F3F4F6]">11 of 12</span>
                  <span className="text-[10px] text-[#9CA3AF] block">Stock takes completed</span>
                </div>
                <div className="w-full h-px bg-[#2A2A2A]"></div>
                <div>
                  <span className="text-[10px] text-[#F87171] uppercase block">Overdue</span>
                  <span className="text-lg font-bold text-[#F3F4F6]">1</span>
                  <span className="text-[10px] text-[#9CA3AF] block">Locations</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[#F3F4F6]">Inventory by Category</h3>
              <button className="text-[#DDAA33] text-[10px] hover:underline">View Report</button>
            </div>
            <div className="flex flex-col gap-4 mt-2">
               <CategoryBar name="Spirits" val="N$ 235,000" pct={55} />
               <CategoryBar name="Beer" val="N$ 80,000" pct={19} />
               <CategoryBar name="Wine & Champagne" val="N$ 60,000" pct={14} />
               <CategoryBar name="Mixers & Others" val="N$ 30,000" pct={7} />
               <CategoryBar name="Non-Alcoholic" val="N$ 20,000" pct={5} />
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Smart Fridge */}
      <div className="w-[380px] bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5 flex-shrink-0 h-[calc(100vh-120px)] overflow-hidden">
        <SmartFridgeGrid items={fridgeItems} />
      </div>

    </div>
  );
}

function WineIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 22h8"/>
      <path d="M7 10h10"/>
      <path d="M12 15v7"/>
      <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/>
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  )
}

function ActivityItem({ icon, title, desc, time, isAlert }: any) {
  return (
    <div className="flex items-start gap-4 relative z-10 pl-1.5">
      <div className={`w-6 h-6 rounded border ${isAlert ? 'border-[#F87171] bg-[#1C1C1C] text-[#F87171]' : 'border-[#2A2A2A] bg-[#121212] text-[#9CA3AF]'} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 -mt-0.5">
        <p className={`text-xs font-bold ${isAlert ? 'text-[#F87171]' : 'text-[#F3F4F6]'}`}>{title}</p>
        <p className="text-[10px] text-[#9CA3AF]">{desc}</p>
      </div>
      <span className="text-[10px] text-[#9CA3AF] shrink-0">{time}</span>
    </div>
  )
}

function TopProduct({ num, name, amt, val }: any) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <span className="text-[#9CA3AF] w-2">{num}</span>
        <span className="text-[#F3F4F6]">{name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[#9CA3AF] w-16 text-right">{amt}</span>
        <span className="text-[#F3F4F6] font-bold w-16 text-right">{val}</span>
      </div>
    </div>
  )
}

function CategoryBar({ name, val, pct }: any) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-[10px]">
        <span className="text-[#9CA3AF]">{name}</span>
        <div className="flex gap-4">
          <span className="text-[#DDAA33] font-bold">{val}</span>
          <span className="text-[#F3F4F6] font-bold w-6 text-right">{pct}%</span>
        </div>
      </div>
      <div className="w-full h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
        <div className="h-full bg-[#DDAA33]" style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  )
}
