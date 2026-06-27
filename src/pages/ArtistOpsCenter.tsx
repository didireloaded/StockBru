import { useState } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, Clock, Calendar, 
  MapPin, User, ShieldCheck, ShoppingCart, Lock, FileText, 
  UploadCloud, ArrowRight, Check, CheckSquare, Search, Award,
  TrendingUp, Activity, CheckCircle, Disc, DollarSign, Layers
} from 'lucide-react';
import { Bottle, PurchaseOrder } from '../types';
import { Button } from '../components/Primitives';
import { toast } from 'sonner';

interface ArtistOpsCenterProps {
  bottles: Bottle[];
  pos: PurchaseOrder[];
  setPOs: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
}

type TabType = 'overview' | 'rider' | 'inventory' | 'purchasing' | 'green_room' | 'timeline' | 'documents' | 'profile' | 'after_event';

export function ArtistOpsCenter({ bottles, pos, setPOs }: ArtistOpsCenterProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [moetOrdered, setMoetOrdered] = useState(false);
  const [isDraggingPDF, setIsDraggingPDF] = useState(false);
  const [searchDoc, setSearchDoc] = useState('');

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, name: 'Water (Aqua Splash & San Pellegrino)', done: true },
    { id: 2, name: 'Crushed Ice & Silver Bucket', done: true },
    { id: 3, name: 'Fresh Towels (Black Cotton)', done: true },
    { id: 4, name: 'Fruit Platter (Organic Berries)', done: true },
    { id: 5, name: 'Gourmet Snacks & Charcuterie', done: true },
    { id: 6, name: 'Champagne Flutes & Crystal Glasses', done: true },
    { id: 7, name: 'Spirits & Mixers Setup', done: true },
    { id: 8, name: 'Stage Flowers Arrangement', done: true },
  ]);

  const handleCreatePO = () => {
    setMoetOrdered(true);
    toast.success('Purchase Order Draft #PO-8824 created for 2 × Moët & Chandon (NamBev)');
  };

  const handlePDFDropSim = () => {
    setIsDraggingPDF(true);
    setTimeout(() => {
      setIsDraggingPDF(false);
      toast.success('Rider Extracted! Matched 4 drinks, reserved 32 bottles, generated setup tasks.');
    }, 1200);
  };

  const DOCUMENTS = [
    { title: 'Performance Contract', category: 'Legal', date: '12 July 2026', size: '2.4 MB' },
    { title: 'Technical Rider (Stage & Audio)', category: 'Technical', date: '14 July 2026', size: '4.1 MB' },
    { title: 'Hospitality & Beverage Rider', category: 'Hospitality', date: '14 July 2026', size: '1.1 MB' },
    { title: 'Artist Invoice #INV-BC99', category: 'Finance', date: '15 July 2026', size: '890 KB' },
    { title: 'Hilton Accommodation Confirmation', category: 'Travel', date: '20 July 2026', size: '1.5 MB' },
    { title: 'Airlink Business Class Travel Tickets', category: 'Travel', date: '20 July 2026', size: '3.2 MB' },
    { title: 'VIP Secure Parking Passes (Bay 1-3)', category: 'Security', date: '25 July 2026', size: '450 KB' },
    { title: 'Artist & Tour Manager ID Copies', category: 'Compliance', date: '25 July 2026', size: '3.8 MB' },
    { title: 'International Passports Scan', category: 'Compliance', date: '25 July 2026', size: '4.2 MB' },
    { title: 'Management Briefing Notes', category: 'Operations', date: '26 July 2026', size: '310 KB' },
  ];

  const filteredDocs = DOCUMENTS.filter(d => d.title.toLowerCase().includes(searchDoc.toLowerCase()) || d.category.toLowerCase().includes(searchDoc.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto text-slate-200">
      
      {/* ─── TOP HERO ARTIST BANNER ─── */}
      <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#d4a24c]/10 via-purple-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Event Ready
              </span>
              <span className="text-xs font-mono uppercase text-slate-400">Friday Night Lineup</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-[#d4a24c] font-bold">28 July 2026</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              DJ Black Coffee
            </h1>

            <div className="flex items-center gap-6 pt-1 text-xs font-mono text-slate-300 flex-wrap">
              <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#d4a24c]" /><span>Arrival: <strong className="text-white">18:00</strong></span></div>
              <div className="flex items-center gap-1.5"><Disc className="w-3.5 h-3.5 text-purple-400" /><span>Performance: <strong className="text-white">22:30</strong></span></div>
              <div className="flex items-center gap-1.5"><ArrowRight className="w-3.5 h-3.5 text-slate-500" /><span>Departure: <strong className="text-white">01:00</strong></span></div>
              <div className="flex items-center gap-1.5 pl-4 border-l border-[#262632]"><User className="w-3.5 h-3.5 text-emerald-400" /><span>Manager: <strong className="text-white">Peter</strong></span></div>
              <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-400" /><span>Assigned Bar: <strong className="text-white">VIP Bar</strong></span></div>
            </div>
          </div>

          {/* Hero KPI: Readiness Score Hero Badge */}
          <div className="bg-[#181822] border border-[#d4a24c]/40 rounded-2xl p-5 shrink-0 flex items-center gap-5 shadow-inner">
            <div className="text-center">
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#d4a24c] font-bold">Event Readiness</div>
              <div className="text-4xl font-black text-white font-mono mt-0.5">96%</div>
            </div>
            <div className="w-px h-12 bg-[#262632]" />
            <div className="space-y-1 text-[11px] font-mono min-w-[140px]">
              <div className="flex justify-between"><span className="text-slate-400">Inventory</span><span className="text-emerald-400 font-bold">100%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Purchasing</span><span className="text-emerald-400 font-bold">100%</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Green Room</span><span className="text-amber-400 font-bold">95%</span></div>
            </div>
          </div>
        </div>

        {/* ─── NAVIGATION MODULE TABS ACROSS TOP ─── */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-[#22222d] overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'rider', label: 'Rider Cards', icon: Layers },
            { id: 'inventory', label: 'Inventory Lockup', icon: Lock },
            { id: 'purchasing', label: 'Purchasing', icon: ShoppingCart },
            { id: 'green_room', label: 'Green Room Prep', icon: CheckSquare },
            { id: 'timeline', label: 'Timeline', icon: Clock },
            { id: 'documents', label: 'Documents Vault', icon: FileText },
            { id: 'profile', label: 'Artist Profile', icon: Award },
            { id: 'after_event', label: 'After Event Settlement', icon: DollarSign },
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active 
                    ? 'bg-[#d4a24c] text-black shadow-lg shadow-amber-900/20 scale-[1.02]' 
                    : 'bg-[#181820] text-slate-400 hover:text-white hover:bg-[#20202a]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── SILENT OPERATIONS INTELLIGENCE BOX (ON EVERY TAB) ─── */}
      <div className="bg-[#15151e] border border-purple-500/30 rounded-xl p-4 flex items-center gap-4 shadow-sm">
        <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex-1 text-xs">
          <span className="font-bold text-white uppercase tracking-wider text-[10px] font-mono text-purple-300 block mb-0.5">Operational Insight</span>
          <p className="text-slate-300 leading-relaxed">
            Current inventory satisfies <strong className="text-emerald-400">92%</strong> of the rider. 
            {moetOrdered 
              ? <span className="text-emerald-400 font-semibold"> Purchase Order for Moët & Chandon is approved and inbound.</span>
              : <span className="text-amber-400 font-semibold"> Only two bottles of Moët remain to be purchased.</span>
            } Estimated preparation completion: <strong className="text-white">Today 17:30</strong>.
          </p>
        </div>
      </div>

      {/* ─── TAB 1: OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Readiness Pillars Breakdown */}
          <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 md:col-span-2 space-y-6">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#d4a24c]" /> Readiness Pillars Audit
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Inventory Ready', score: '98%', status: 'Healthy', color: 'emerald' },
                { label: 'Purchasing', score: '100%', status: 'Complete', color: 'emerald' },
                { label: 'Green Room', score: '95%', status: 'Ashley Active', color: 'amber' },
                { label: 'Staff Assigned', score: '100%', status: 'Ready', color: 'emerald' },
                { label: 'Technical Rider', score: '88%', status: 'Audio Check 18:00', color: 'amber' },
                { label: 'Documents Vault', score: '100%', status: '10 Uploaded', color: 'emerald' },
              ].map((p, idx) => (
                <div key={idx} className="bg-[#181822] p-4 rounded-xl border border-[#262632] space-y-2">
                  <div className="text-[11px] text-slate-400">{p.label}</div>
                  <div className="text-2xl font-black font-mono text-white">{p.score}</div>
                  <div className={`text-[10px] font-mono px-2 py-0.5 rounded inline-block bg-${p.color}-500/10 text-${p.color}-400 font-bold`}>
                    {p.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Drag & Drop Hero Upload Simulator */}
            <div className="pt-4 border-t border-[#22222d]">
              <div 
                onClick={handlePDFDropSim}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDraggingPDF 
                    ? 'border-[#d4a24c] bg-[#d4a24c]/10 scale-[0.99]' 
                    : 'border-[#2d2d3c] hover:border-[#d4a24c]/50 bg-[#15151c]'
                }`}
              >
                <UploadCloud className="w-10 h-10 text-[#d4a24c] mx-auto mb-3 animate-bounce" />
                <h3 className="text-base font-bold text-white">✨ Drag & Drop Artist Rider PDF Here</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  StockBru automatically extracts drinks, checks live inventory, highlights shortages, reserves stock, and creates purchase orders instantly.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#20202d] text-xs font-mono text-[#d4a24c] font-bold">
                  Click to Simulate Instant Nightclub Extraction
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats & Contact Sidebar */}
          <div className="space-y-6">
            <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">Headline Booking Profile</h3>
              <div className="flex items-center gap-4 p-3 bg-[#181822] rounded-xl border border-[#262632]">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 font-bold text-lg">BC</div>
                <div>
                  <div className="font-bold text-white">DJ Black Coffee</div>
                  <div className="text-xs text-slate-400">Played 12 Times • Returning VIP</div>
                </div>
              </div>

              <div className="space-y-3 text-xs pt-2 font-mono">
                <div className="flex justify-between"><span className="text-slate-400">Avg Rider Value:</span><span className="text-emerald-400 font-bold">N$ 18,000</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Preferred Room:</span><span className="text-white font-bold">VIP Suite 2</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Management:</span><span className="text-white">John Smith</span></div>
              </div>

              <Button onClick={() => setActiveTab('rider')} className="w-full bg-[#d4a24c] hover:bg-[#b5883d] text-black font-bold text-xs mt-2">
                Open Beverage Operational Cards →
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* ─── TAB 2: RIDER (LIVE OPERATIONAL CARDS) ─── */}
      {activeTab === 'rider' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: 'Overall Completion', val: '96%', color: 'white' },
              { label: 'Inventory Ready', val: '98%', color: 'emerald-400' },
              { label: 'Purchasing', val: '100%', color: 'emerald-400' },
              { label: 'Green Room', val: '100%', color: 'emerald-400' },
              { label: 'Technical', val: '90%', color: 'amber-400' },
              { label: 'Hospitality', val: '100%', color: 'emerald-400' },
            ].map((st, i) => (
              <div key={i} className="bg-[#121218] border border-[#262632] p-4 rounded-xl text-center">
                <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">{st.label}</div>
                <div className={`text-2xl font-black font-mono text-${st.color}`}>{st.val}</div>
              </div>
            ))}
          </div>

          <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#d4a24c]" /> Live Interactive Beverage Rider
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
              
              {/* Card 1: Ciroc */}
              <div className="bg-[#181822] border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 font-sans">
                    <CheckCircle2 className="w-4 h-4" /> ✓ Cîroc Original
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">READY</span>
                </div>
                <div className="h-px bg-[#2a2a38]" />
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Requested:</span><span className="text-white font-bold">4 Bottles</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Available:</span><span className="text-emerald-400 font-bold">8</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Reserved:</span><span className="text-[#d4a24c] font-bold">4</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Location:</span><span className="text-slate-300">VIP Storeroom</span></div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-300 font-sans text-center">
                  Matched & Locked in Safe
                </div>
              </div>

              {/* Card 2: Moet & Chandon */}
              <div className={`bg-[#181822] rounded-2xl p-5 space-y-4 shadow-lg transition-all ${moetOrdered ? 'border border-emerald-500/40' : 'border border-amber-500/60'}`}>
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm flex items-center gap-1.5 font-sans ${moetOrdered ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {moetOrdered ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} 
                    {moetOrdered ? '✓ Moët & Chandon' : '⚠ Moët & Chandon'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${moetOrdered ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                    {moetOrdered ? 'PO INBOUND' : 'SHORTAGE'}
                  </span>
                </div>
                <div className="h-px bg-[#2a2a38]" />
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Requested:</span><span className="text-white font-bold">6 Bottles</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Available:</span><span className="text-white font-bold">4</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Missing:</span><span className={`font-bold ${moetOrdered ? 'text-emerald-400' : 'text-amber-400'}`}>{moetOrdered ? '0' : '2'}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Supplier:</span><span className="text-slate-300">NamBev Corp</span></div>
                </div>

                {!moetOrdered ? (
                  <Button onClick={handleCreatePO} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs shadow-md animate-pulse font-sans py-2.5">
                    + Create Purchase Order (2 BOTTLES)
                  </Button>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-300 font-sans text-center">
                    Purchase Order Ordered • Arriving Tomorrow
                  </div>
                )}
              </div>

              {/* Card 3: Red Bull */}
              <div className="bg-[#181822] border border-emerald-500/40 rounded-2xl p-5 space-y-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5 font-sans">
                    <CheckCircle2 className="w-4 h-4" /> ✓ Red Bull Energy
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-bold">READY</span>
                </div>
                <div className="h-px bg-[#2a2a38]" />
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-400">Requested:</span><span className="text-white font-bold">24 Cans</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Available:</span><span className="text-emerald-400 font-bold">120</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Reserved:</span><span className="text-[#d4a24c] font-bold">24</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Location:</span><span className="text-slate-300">VIP Storeroom</span></div>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-[11px] text-emerald-300 font-sans text-center">
                  Abundant Reserves Verified
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 3: INVENTORY LOCKUP RESERVATION ─── */}
      {activeTab === 'inventory' && (
        <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 space-y-6 max-w-4xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Smart Inventory Lockup Reservation</h2>
              <p className="text-xs text-slate-400">Those reserved bottles cannot accidentally be sold over the public bars.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono pt-2">
            <div className="bg-[#181822] p-5 rounded-2xl border border-[#262632] text-center">
              <div className="text-xs text-slate-400 mb-1">Current Physical Stock</div>
              <div className="text-4xl font-black text-white">40</div>
              <div className="text-[10px] text-slate-500 mt-1">Cîroc Original In Warehouse</div>
            </div>

            <div className="bg-[#181822] p-5 rounded-2xl border border-[#d4a24c]/40 text-center relative overflow-hidden bg-gradient-to-b from-[#d4a24c]/5 to-transparent">
              <div className="text-xs text-[#d4a24c] mb-1 font-bold">Locked For Artist Rider</div>
              <div className="text-4xl font-black text-[#d4a24c]">8</div>
              <div className="text-[10px] text-amber-400 mt-1 font-bold">🔒 BLOCKED FROM POS</div>
            </div>

            <div className="bg-[#181822] p-5 rounded-2xl border border-emerald-500/30 text-center">
              <div className="text-xs text-slate-400 mb-1">Available For Club Sales</div>
              <div className="text-4xl font-black text-emerald-400">32</div>
              <div className="text-[10px] text-emerald-500 mt-1">Safe For General Bartenders</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#181822] border border-[#2a2a36] text-xs text-slate-300 leading-relaxed">
            💡 <strong>How it works:</strong> When an artist rider is extracted, StockBru creates a hard inventory lockup. Even if Main Bar experiences a massive Friday rush, checkout registers will report <em>"Out of Public Stock"</em> once general inventory reaches 8 bottles, strictly guaranteeing DJ Black Coffee's rider is intact when he arrives at 18:00.
          </div>
        </div>
      )}

      {/* ─── TAB 4: PURCHASING ─── */}
      {activeTab === 'purchasing' && (
        <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#d4a24c]" /> Automated Rider Purchasing Requirements
          </h2>

          <div className="bg-[#181822] rounded-xl border border-[#262632] overflow-hidden font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#1f1f2c] text-slate-400 text-[11px] uppercase">
                <tr><th className="p-4">Missing Item</th><th className="p-4">Shortage</th><th className="p-4">Supplier</th><th className="p-4">ETA</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-[#262632]">
                <tr>
                  <td className="p-4 font-bold text-white font-sans">Moët & Chandon Imperial (750ml)</td>
                  <td className="p-4 text-amber-400 font-bold">2 Bottles</td>
                  <td className="p-4 text-slate-300">NamBev Beverage Corp</td>
                  <td className="p-4 text-emerald-400 font-semibold">Tomorrow 10:00</td>
                  <td className="p-4"><span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">ORDERED (#PO-8824)</span></td>
                  <td className="p-4 text-right font-sans">
                    <Button onClick={() => toast.info('Opening Purchase Order #PO-8824')} className="bg-[#262634] hover:bg-[#323244] text-white text-[11px] px-3 py-1">
                      View PO Draft
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── TAB 5: GREEN ROOM PREP CHECKLIST ─── */}
      {activeTab === 'green_room' && (
        <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 space-y-6 max-w-3xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-400" /> Green Room VIP Suite 2 Setup Checklist
              </h2>
              <p className="text-xs text-slate-400">Assigned To: <strong className="text-emerald-400">Ashley (VIP Hostess)</strong> • Completed at <strong className="text-white">17:42</strong></p>
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              100% COMPLETED ✓
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {checklist.map(chk => (
              <div 
                key={chk.id}
                onClick={() => setChecklist(prev => prev.map(x => x.id === chk.id ? { ...x, done: !x.done } : x))}
                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  chk.done ? 'bg-[#161f1a] border-emerald-500/30 text-emerald-200' : 'bg-[#181822] border-[#2d2d3c] text-slate-400 hover:border-slate-500'
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${chk.done ? 'bg-emerald-500 text-black font-bold' : 'border border-slate-600'}`}>
                  {chk.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
                <span className="text-xs font-semibold">{chk.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 6: TIMELINE ─── */}
      {activeTab === 'timeline' && (
        <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 space-y-6 max-w-3xl">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#d4a24c]" /> Operational Event Milestone Timeline
          </h2>

          <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[#262634] font-mono text-xs">
            {[
              { time: '09:00', title: 'Artist Booked & Contract Executed', done: true },
              { time: '09:15', title: 'Hospitality Rider Document Uploaded', done: true },
              { time: '09:20', title: 'Smart Inventory Catalog Verified', done: true },
              { time: '09:23', title: 'Purchase Order Created (#PO-8824)', done: true },
              { time: '11:42', title: 'NamBev Beverage Delivery Received', done: true },
              { time: '16:00', title: 'Green Room Suite Prepared', done: true },
              { time: '17:00', title: 'Inventory Lockups Reserved (32 Avail)', done: true },
              { time: '18:00', title: 'Artist Escort Arrived & Sound Check', done: true, curr: true },
              { time: '22:30', title: 'Headline DJ Performance Started', done: false },
              { time: '01:00', title: 'Performance Finished & Departure', done: false },
            ].map((node, i) => (
              <div key={i} className="relative flex items-center gap-4">
                <span className={`absolute -left-[23px] w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  node.curr ? 'bg-[#d4a24c] border-white animate-ping' : node.done ? 'bg-emerald-500 border-[#121218]' : 'bg-[#181822] border-slate-600'
                }`} />
                <span className={`w-12 shrink-0 font-bold ${node.done ? 'text-[#d4a24c]' : 'text-slate-500'}`}>{node.time}</span>
                <span className={`flex-1 p-3 rounded-xl border ${node.curr ? 'bg-[#1d1d28] border-[#d4a24c] text-white font-bold' : node.done ? 'bg-[#181822] border-[#262632] text-slate-300' : 'bg-[#14141a] border-[#1d1d26] text-slate-600'}`}>
                  {node.title} {node.curr && <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] bg-[#d4a24c] text-black font-sans">LIVE NOW</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 7: DOCUMENTS VAULT ─── */}
      {activeTab === 'documents' && (
        <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#d4a24c]" /> Searchable Artist Document Vault
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input 
                value={searchDoc} 
                onChange={e => setSearchDoc(e.target.value)}
                placeholder="Search contract, passport, invoice..." 
                className="w-full pl-9 pr-4 py-2 bg-[#181822] border border-[#2a2a36] rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-[#d4a24c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#181822] border border-[#262632] hover:border-[#d4a24c]/50 flex items-center justify-between transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#20202d] flex items-center justify-center text-[#d4a24c] font-mono text-xs font-bold">
                    PDF
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-[#d4a24c] transition-colors">{doc.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{doc.category} • Uploaded {doc.date}</div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500 mr-2">{doc.size}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 8: ARTIST PROFILE VAULT ─── */}
      {activeTab === 'profile' && (
        <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 space-y-6 max-w-3xl font-mono text-xs">
          <h2 className="text-lg font-black text-white font-sans">Returning VIP Artist Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#181822] border border-[#262632]"><span className="text-slate-400 block mb-1">Played At Club:</span><span className="text-2xl font-black text-white">12 Times</span></div>
            <div className="p-4 rounded-xl bg-[#181822] border border-[#262632]"><span className="text-slate-400 block mb-1">Avg Rider Value:</span><span className="text-2xl font-black text-emerald-400">N$ 18,000</span></div>
            <div className="p-4 rounded-xl bg-[#181822] border border-[#262632]"><span className="text-slate-400 block mb-1">Favourite Drinks:</span><span className="text-white font-bold">Cîroc, Moët, Red Bull</span></div>
            <div className="p-4 rounded-xl bg-[#181822] border border-[#262632]"><span className="text-slate-400 block mb-1">Preferred Room:</span><span className="text-white font-bold">VIP Suite 2</span></div>
            <div className="p-4 rounded-xl bg-[#181822] border border-[#262632] sm:col-span-2"><span className="text-slate-400 block mb-1">Management Contact:</span><span className="text-white font-bold">John Smith (WME Agency) • +27 82 555 9911</span></div>
          </div>
        </div>
      )}

      {/* ─── TAB 9: AFTER EVENT SETTLEMENT ─── */}
      {activeTab === 'after_event' && (
        <div className="bg-[#121218] border border-[#262632] rounded-2xl p-6 space-y-6 max-w-4xl font-mono text-xs">
          <h2 className="text-lg font-black text-white font-sans flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" /> Post-Event Settlement Report Archive
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 text-center">
            <div className="bg-[#181822] p-5 rounded-2xl border border-[#262632]"><span className="text-slate-400 block mb-1">Total Rider Cost</span><span className="text-2xl font-black text-white">N$ 18,420</span></div>
            <div className="bg-[#181822] p-5 rounded-2xl border border-emerald-500/30"><span className="text-slate-400 block mb-1">Actual Consumed</span><span className="text-2xl font-black text-emerald-400">N$ 15,200</span></div>
            <div className="bg-[#181822] p-5 rounded-2xl border border-[#d4a24c]/40"><span className="text-slate-400 block mb-1">Unused Stock Returned</span><span className="text-2xl font-black text-[#d4a24c]">N$ 3,220</span></div>
          </div>

          <div className="space-y-3 bg-[#181822] p-5 rounded-2xl border border-[#262632]">
            <div className="flex justify-between"><span className="text-slate-400">Performance Started On Time:</span><span className="text-emerald-400 font-bold">Yes (22:30 Exact)</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Rider Fulfillment Completed:</span><span className="text-emerald-400 font-bold">100%</span></div>
            <div className="flex justify-between"><span className="text-slate-400">Recorded Operational Incidents:</span><span className="text-white">None</span></div>
            <div className="pt-2 border-t border-[#262632] font-sans">
              <span className="text-slate-400 text-[11px] block mb-1">Manager Settlement Notes:</span>
              <p className="text-slate-200">Everything executed successfully. Unused 2 bottles of Moët returned to storeroom inventory ledger.</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
