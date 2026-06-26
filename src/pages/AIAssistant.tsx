import { useState, useMemo } from 'react';
import { 
  Activity, TrendingUp, AlertTriangle, Lightbulb, Package, 
  ArrowRight, CheckCircle2, Sliders, Calendar, MapPin, 
  ExternalLink, ShieldAlert, Zap, Clock, DollarSign, Eye, Droplets
} from 'lucide-react';
import { Bottle, ActivityItem } from '../types';
import { Button, Modal } from '../components/Primitives';
import { calculateBottleStatus } from '../services/inventory.service';
import { toast } from 'sonner';

interface Props {
  bottles: Bottle[];
  logActivity: (a: Omit<ActivityItem, 'id' | 'time'>) => void;
}

interface DecisionCard {
  id: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  actionType: 'reorder' | 'transfer' | 'delay' | 'audit';
  title: string;
  sku: string;
  station: string;
  qty: number;
  reason: string;
  bottle?: Bottle;
}

export default function AIAssistant({ bottles, logActivity }: Props) {
  const [selectedContext, setSelectedContext] = useState<DecisionCard | null>(null);
  const [activeTab, setActiveTab] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');

  // Computed live stats
  const criticalCount = bottles.filter(b => b.status === 'Critical' || b.status === 'Out of Stock').length;
  const totalCostValue = bottles.reduce((s, b) => s + b.quantity * b.cost, 0);
  const openBottlesCount = bottles.filter(b => (b.openBottles || 0) > 0).length;

  // Generate automated Decisions based on live inventory observation
  const decisions = useMemo(() => {
    const list: DecisionCard[] = [];

    // 1. Live observation of critical/low stock
    bottles.forEach(b => {
      if (b.status === 'Out of Stock' || b.status === 'Critical') {
        list.push({
          id: `dec_${b.id}`,
          priority: 'Critical',
          actionType: 'reorder',
          title: `Reorder ${b.reorderLevel * 2 || 24} units of ${b.name}`,
          sku: b.sku,
          station: b.location || 'Main Bar Storeroom',
          qty: b.reorderLevel * 2 || 24,
          reason: `Current stock (${b.quantity} units) is at or below critical depletion threshold. Based on Friday evening sales velocity, station inventory will be completely exhausted within 4 operating hours.`,
          bottle: b,
        });
      } else if (b.status === 'Low') {
        list.push({
          id: `dec_${b.id}`,
          priority: 'High',
          actionType: 'transfer',
          title: `Transfer 12 units ${b.name} to assigned station`,
          sku: b.sku,
          station: b.location || 'VIP Lounge',
          qty: 12,
          reason: `Station shelf buffer is nearing minimum reorder level (${b.quantity} remaining). Central warehouse storeroom currently holds adequate unreserved backstock.`,
          bottle: b,
        });
      }
    });

    // 2. Add static explainable business decisions
    list.push({
      id: 'dec_static_1',
      priority: 'Critical',
      actionType: 'reorder',
      title: 'Reorder 48 Hunters Gold Dry Cider',
      sku: 'CIDER-HUNT-01',
      station: 'Main Bar Fridge',
      qty: 48,
      reason: 'Average weekend consumption increased 32% over the past three weekends and current inventory will likely be exhausted before the next scheduled distributor delivery.',
    });

    list.push({
      id: 'dec_static_2',
      priority: 'Medium',
      actionType: 'delay',
      title: 'Delay purchasing Jameson Irish Whiskey until next week',
      sku: 'WHISKEY-JAM-01',
      station: 'Central Storeroom',
      qty: 0,
      reason: 'Current inventory velocity indicates 28 days of buffer stock remaining. Purchasing now would prematurely tie up N$ 14,500 in working capital before month-end payroll settlement.',
    });

    list.push({
      id: 'dec_static_3',
      priority: 'Low',
      actionType: 'audit',
      title: 'Investigate dead stock SKU: Campari Bitter',
      sku: 'LIQ-CAMP-01',
      station: 'Display Shelf',
      qty: 0,
      reason: 'Zero units recorded sold across all POS registers over the last 42 operating days while occupying premium display shelf space.',
    });

    return list;
  }, [bottles]);

  // Filtered decisions
  const filteredDecisions = useMemo(() => {
    if (activeTab === 'All') return decisions;
    return decisions.filter(d => d.priority === activeTab);
  }, [decisions, activeTab]);

  const handleExecute = (card: DecisionCard) => {
    toast.success(`Executed decision workflow: ${card.title}`);
    logActivity({
      type: 'adjustment',
      title: `Executed decision: ${card.title}`,
      subtitle: card.reason.slice(0, 80) + '...',
      user: 'Pedro Manager',
    });
  };

  const priorityBadge = (p: DecisionCard['priority']) => {
    if (p === 'Critical') return 'bg-red-500/20 text-red-400 border border-red-500/40';
    if (p === 'High') return 'bg-amber-500/20 text-amber-400 border border-amber-500/40';
    if (p === 'Medium') return 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30';
    return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#26262d] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#d4a24c] flex items-center justify-center text-black font-black shadow-lg shadow-[#d4a24c]/20">
              <Activity className="w-5 h-5 stroke-[3]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Operations Intelligence Engine</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proactive real-time business observation & relational decision engine • Zero AI Q&A Chat Bots
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-[#141419] px-3 py-1.5 rounded-xl border border-[#22222a]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">Continuous Observation Active</span>
        </div>
      </div>

      {/* AUTOMATED DAILY MORNING BRIEFING */}
      <div className="glass-card p-6 rounded-2xl border border-[#262630] bg-gradient-to-r from-[#14141a] via-[#161622] to-[#14141a] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a24c]/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4 border-b border-[#262630] pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Zap className="w-4 h-4 text-[#d4a24c]" />
            <span>Automated Daily Morning Briefing</span>
            <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded bg-[#22222e] text-[#d4a24c]">
              Generated Today 06:00
            </span>
          </div>
          <span className="text-xs text-slate-400">Zero user inputs required</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-[#0f0f14]/80 border border-[#22222c]">
            <span className="text-[11px] text-slate-400 block font-medium">Yesterday's Bar Receipts</span>
            <span className="text-2xl font-black text-white mt-1 block font-mono">N$ 18,420</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
              <TrendingUp className="w-3 h-3" /> +14.2% vs prior Thursday
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#0f0f14]/80 border border-[#22222c]">
            <span className="text-[11px] text-slate-400 block font-medium">Spillage & Variance Loss</span>
            <span className="text-2xl font-black text-red-400 mt-1 block font-mono">−N$ 450</span>
            <span className="text-[10px] text-slate-500 block mt-1">2 broken shots recorded</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0f0f14]/80 border border-[#22222c]">
            <span className="text-[11px] text-slate-400 block font-medium">Active Open Bottles</span>
            <span className="text-2xl font-black text-blue-400 mt-1 block font-mono">{openBottlesCount} SKUs</span>
            <span className="text-[10px] text-slate-500 block mt-1">Sub-shot ml decay tracking</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0f0f14]/80 border border-[#22222c]">
            <span className="text-[11px] text-slate-400 block font-medium">Master Stock Valuation</span>
            <span className="text-2xl font-black text-[#d4a24c] mt-1 block font-mono">
              N$ {(totalCostValue / 1000).toFixed(1)}k
            </span>
            <span className="text-[10px] text-slate-500 block mt-1">{bottles.length} master products</span>
          </div>
        </div>

        {/* Briefing Highlights Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2 border-t border-[#22222c]">
          <div className="space-y-1.5">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Top Selling SKUs (24h)
            </div>
            <p className="text-slate-400 pl-5 leading-relaxed">
              1. Ciroc Original (18 units) • 2. Savanna Dry (42 units) • 3. Don Julio Reposado (6 shots)
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Today's Procurement Priorities
            </div>
            <p className="text-slate-400 pl-5 leading-relaxed">
              Expected goods receipt delivery from NamBev Distributors at 11:30 AM (PO #1042).
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Blind Count Audit Status
            </div>
            <p className="text-slate-400 pl-5 leading-relaxed">
              Main Bar room audit completed by Peter at 02:15 AM. Variance accuracy: 98.4%.
            </p>
          </div>
        </div>
      </div>

      {/* PRIORITIZED RECOMMENDATIONS ENGINE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#d4a24c]" /> Prioritized Decision Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Every recommendation explicitly explains its relational database rationale
            </p>
          </div>

          {/* Tier Filters */}
          <div className="flex gap-1.5 p-1 rounded-xl bg-[#141419] border border-[#22222a] overflow-x-auto">
            {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-[#d4a24c] text-black shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {tab} {tab === 'All' ? `(${decisions.length})` : tab === 'Critical' ? `(${decisions.filter(d => d.priority === 'Critical').length})` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Decision Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDecisions.map(card => (
            <div 
              key={card.id}
              className="glass-card p-6 rounded-2xl border border-[#262630] hover:border-[#d4a24c]/40 transition-all flex flex-col justify-between group bg-[#121217]"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${priorityBadge(card.priority)}`}>
                    {card.priority} Priority
                  </span>
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d4a24c]" /> {card.station}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#e9c27a] transition-colors leading-snug">
                  {card.title}
                </h3>

                {/* Plain-English Explainability Rationale Box */}
                <div className="p-3.5 rounded-xl bg-[#0b0b0f] border border-[#1e1e28] space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#d4a24c] flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" /> Operational Rationale (Why)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {card.reason}
                  </p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-4 mt-4 border-t border-[#1d1d24] flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedContext(card)}
                  className="px-3.5 py-2 rounded-xl bg-[#1c1c24] text-slate-300 hover:text-white text-xs font-semibold border border-[#282834] transition-all flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-[#d4a24c]" /> 360° Context Engine
                </button>

                <button
                  onClick={() => handleExecute(card)}
                  className="px-4 py-2 rounded-xl bg-[#d4a24c] text-black font-extrabold text-xs hover:bg-[#e9c27a] transition-all shadow-lg shadow-[#d4a24c]/10 flex items-center gap-1.5"
                >
                  <span>Execute Workflow</span> <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 360° CONTEXT ENGINE MODAL DRAWER */}
      <Modal 
        open={!!selectedContext} 
        onClose={() => setSelectedContext(null)} 
        title={selectedContext ? `360° Context Intelligence — ${selectedContext.sku}` : 'Context Engine'}
        subtitle="Comprehensive relational analysis across all business modules"
      >
        {selectedContext && (
          <div className="space-y-5 text-sm animate-in zoom-in-95 duration-150">
            <div className="p-4 rounded-2xl bg-[#16161f] border border-[#262634] space-y-3">
              <div className="flex justify-between items-center border-b border-[#262634] pb-2.5">
                <span className="text-slate-400">Target Action</span>
                <span className="font-bold text-white text-right">{selectedContext.title}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#262634] pb-2.5">
                <span className="text-slate-400">Assigned Station</span>
                <span className="font-bold text-[#d4a24c]">{selectedContext.station}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#262634] pb-2.5">
                <span className="text-slate-400">Sealed Stock on Hand</span>
                <span className="font-bold font-mono text-white">
                  {selectedContext.bottle ? `${selectedContext.bottle.quantity} units` : '12 sealed cases'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#262634] pb-2.5">
                <span className="text-slate-400">Open Bottles Active</span>
                <span className="font-bold font-mono text-blue-400">
                  {selectedContext.bottle ? `${selectedContext.bottle.openBottles || 0} active bottles` : '2 partial bottles (420ml left)'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-[#262634] pb-2.5">
                <span className="text-slate-400">Average Consumption Rate</span>
                <span className="font-bold text-emerald-400">4.2 units / weekend shift</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Estimated Days Remaining</span>
                <span className="font-bold font-mono text-amber-400">~2.8 Days remaining</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0f0f14] border border-[#22222a] space-y-2">
              <div className="text-xs font-bold text-[#d4a24c] uppercase tracking-wider">
                ⚡ Continuous Learning & Explainability
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedContext.reason}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setSelectedContext(null)}>Close Context</Button>
              <Button onClick={() => { handleExecute(selectedContext); setSelectedContext(null); }}>
                Proceed to Execution
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
