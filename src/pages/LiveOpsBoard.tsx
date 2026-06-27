import { useState, useEffect } from 'react';
import { 
  Activity, Zap, Clock, Users, DollarSign, Droplets, 
  AlertTriangle, ArrowUpRight, Truck, CheckCircle2, ShieldAlert,
  Flame, Radio, TrendingUp, Sparkles, RefreshCw, Layers
} from 'lucide-react';
import { Bottle } from '../types';

interface LiveOpsBoardProps {
  bottles: Bottle[];
}

export function LiveOpsBoard({ bottles }: LiveOpsBoardProps) {
  const [tickerTime, setTickerTime] = useState(new Date().toLocaleTimeString());
  const [simSalesCount, setSimSalesCount] = useState(318);
  const [simRevHour, setSimRevHour] = useState(14850);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerTime(new Date().toLocaleTimeString());
      if (Math.random() > 0.6) {
        setSimSalesCount(prev => prev + 1);
        setSimRevHour(prev => prev + Math.floor(Math.random() * 450 + 50));
      }
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const LOW_STOCK_RISKS = [
    { name: 'Grey Goose Vodka (750ml)', risk: 'MEDIUM', reason: 'Low stock (4 left). Weekend VIP demand spiking + supplier shipment delayed.', color: 'amber' },
    { name: 'Moët & Chandon Nectar', risk: 'HIGH', reason: 'Only 2 reserve bottles remaining. Artist rider locked.', color: 'red' },
    { name: 'Windhoek Draught Keg', risk: 'MEDIUM', reason: 'Main Bar keg pressure warning reported at 21:30.', color: 'amber' },
  ];

  const LIVE_TICKER = [
    { time: '21:44:12', text: 'Bottle Sold: Cîroc Red Berry × 2 (VIP Booth 4)', type: 'sale' },
    { time: '21:43:55', text: 'Bottle Opened: Moët & Chandon Imperial (VIP Bar)', type: 'open' },
    { time: '21:42:10', text: 'Storeroom Transfer: 24 × Windhoek Draught → Main Bar Fridge', type: 'transfer' },
    { time: '21:40:02', text: 'Quick Count Completed: Vodka Category (100% Variance Match)', type: 'count' },
    { time: '21:38:45', text: 'NamBev Emergency Supplier PO #8824 Approved by Peter', type: 'po' },
    { time: '21:35:00', text: 'Ashley Hostess Completed VIP Suite 2 Green Room Inspection', type: 'check' },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#07070a] text-slate-100 p-6 md:p-8 space-y-8 font-sans">
      
      {/* ─── TOP HEADER HEARTBEAT BANNER ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1f1f2a]">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-red-400">Live Operations Command Center</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-mono text-slate-400">Office Monitor View</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            THE OPERATIONAL HEARTBEAT <Radio className="w-8 h-8 text-[#d4a24c] animate-pulse" />
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-[#121218] px-6 py-4 rounded-2xl border border-[#262634] shadow-2xl shrink-0 font-mono">
          <Clock className="w-6 h-6 text-[#d4a24c]" />
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400">System Live Ticker</div>
            <div className="text-2xl font-black text-white">{tickerTime}</div>
          </div>
        </div>
      </div>

      {/* ─── HERO VELOCITY GAUGES ROW ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        
        {/* Gauge 1: Revenue Velocity */}
        <div className="bg-gradient-to-br from-[#131b17] to-[#0c120f] border border-emerald-500/40 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase text-emerald-400 font-bold">Sales Velocity Gauge</span>
            <TrendingUp className="w-5 h-5 text-emerald-400 animate-bounce" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-white">N$ {simRevHour.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-300 mt-1 flex items-center gap-1 font-sans">
            <span>🔥 +34% vs Last Friday Hour</span>
          </div>
          <div className="mt-4 w-full bg-emerald-950 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-[84%] rounded-full transition-all duration-500 animate-pulse" />
          </div>
        </div>

        {/* Gauge 2: Pour Velocity */}
        <div className="bg-[#121218] border border-purple-500/40 rounded-2xl p-6 relative shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase text-purple-400 font-bold">Bottle Pour Velocity</span>
            <Droplets className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-white">48 Bottles</div>
          <div className="text-[11px] text-purple-300 mt-1 font-sans">
            Opened this hour across 4 bars
          </div>
          <div className="mt-4 w-full bg-purple-950 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-400 h-full w-[68%] rounded-full" />
          </div>
        </div>

        {/* Gauge 3: Active Orders */}
        <div className="bg-[#121218] border border-[#d4a24c]/40 rounded-2xl p-6 relative shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase text-[#d4a24c] font-bold">POS Transactions</span>
            <Zap className="w-5 h-5 text-[#d4a24c]" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-white">{simSalesCount} Orders</div>
          <div className="text-[11px] text-amber-300 mt-1 font-sans">
            ⚡ 1.8s Avg Cashier Checkout Time
          </div>
          <div className="mt-4 w-full bg-amber-950 h-2 rounded-full overflow-hidden">
            <div className="bg-[#d4a24c] h-full w-[92%] rounded-full" />
          </div>
        </div>

        {/* Gauge 4: Event Readiness */}
        <div className="bg-[#121218] border border-blue-500/40 rounded-2xl p-6 relative shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs uppercase text-blue-400 font-bold">DJ Black Coffee Set</span>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-3xl lg:text-4xl font-black text-white">96% Ready</div>
          <div className="text-[11px] text-blue-300 mt-1 font-sans">
            🟢 Artist Escort Arrival Active
          </div>
          <div className="mt-4 w-full bg-blue-950 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-400 h-full w-[96%] rounded-full" />
          </div>
        </div>

      </div>

      {/* ─── MIDDLE SECTION: STAFF ON SHIFT & STOCK RISK SCORES ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Staff on Shift */}
        <div className="bg-[#101016] border border-[#22222e] rounded-2xl p-6 space-y-5 lg:col-span-1 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Users className="w-4 h-4 text-[#d4a24c]" /> Staff On Shift (6 Active)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold">ALL BRIEFED ✓</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { name: 'Peter Manager', role: 'Duty Night Manager', loc: 'Command Center', status: 'Active' },
              { name: 'Ashley Hostess', role: 'VIP Suite Hostess', loc: 'VIP Lounge', status: 'Active' },
              { name: 'John Cashier', role: 'Main Entrance POS', loc: 'Main Bar', status: 'Active' },
              { name: 'Sarah Bartender', role: 'Cocktail Specialist', loc: 'VIP Bar', status: 'Active' },
              { name: 'Mike Controller', role: 'Storeroom Controller', loc: 'Warehouse', status: 'Active' },
              { name: 'David Security', role: 'Artist Escort Lead', loc: 'Stage Green Room', status: 'Active' },
            ].map((st, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-[#16161f] border border-[#262634] flex items-center justify-between">
                <div>
                  <div className="font-bold text-white font-sans">{st.name}</div>
                  <div className="text-[10px] text-slate-400">{st.role} • {st.loc}</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Stock Risk Scores & Alerts */}
        <div className="bg-[#101016] border border-[#22222e] rounded-2xl p-6 space-y-5 lg:col-span-2 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Real-Time Stock Risk Scores
            </h2>
            <span className="text-xs text-slate-400 font-mono">AI Proactive Monitor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LOW_STOCK_RISKS.map((r, i) => (
              <div key={i} className={`p-5 rounded-2xl bg-[#16161f] border ${r.color === 'red' ? 'border-red-500/50 bg-red-950/10' : 'border-amber-500/40'} space-y-3 flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${r.color === 'red' ? 'bg-red-500 text-black' : 'bg-amber-500 text-black'}`}>
                      RISK: {r.risk}
                    </span>
                    <AlertTriangle className={`w-4 h-4 text-${r.color}-400`} />
                  </div>
                  <h3 className="font-bold text-white text-sm font-sans mt-2">{r.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed font-sans">{r.reason}</p>
                </div>
                <div className="pt-2 border-t border-[#262634] text-[10px] font-mono text-[#d4a24c]">
                  ⚡ One-Click Storeroom Draft Ready
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ─── BOTTOM SECTION: UNIVERSAL LIVE TICKER TIMELINE ─── */}
      <div className="bg-[#101016] border border-[#22222e] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Universal Live Event Ticker (Happening Right Now)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Auto-scrolling stream</span>
        </div>

        <div className="space-y-2 font-mono text-xs max-h-64 overflow-y-auto pr-2 scrollbar-thin">
          {LIVE_TICKER.map((tk, index) => (
            <div key={index} className="p-3 rounded-xl bg-[#14141c] border border-[#20202c] flex items-center gap-4 hover:border-slate-600 transition-colors">
              <span className="text-[#d4a24c] font-bold shrink-0">[{tk.time}]</span>
              <span className="text-slate-200 flex-1 font-sans">{tk.text}</span>
              <span className="px-2 py-0.5 rounded uppercase text-[9px] bg-[#222230] text-slate-400">{tk.type}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
