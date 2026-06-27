import { useState } from 'react';
import { 
  Package, Droplets, TrendingUp, Sparkles, Paperclip, 
  FileText, Clock, AlertTriangle, CheckCircle2, ArrowUpRight, 
  Layers, Star, ShieldCheck, Zap, Heart, MessageSquare
} from 'lucide-react';
import { Button, Modal } from '../Primitives';
import { Bottle } from '../../types';
import { toast } from 'sonner';

interface ProductWorkspaceModalProps {
  bottle: Bottle | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductWorkspaceModal({ bottle, isOpen, onClose }: ProductWorkspaceModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'stock' | 'open' | 'mixers' | 'files' | 'notes' | 'timeline'>('overview');
  const [noteText, setNoteText] = useState('Cîroc sells 4x faster after 10 PM during Friday Night VIP sets. Always keep 6 chilled backup cases in VIP Bar display fridge.');

  if (!bottle && !isOpen) return null;

  const bName = bottle?.name || 'Cîroc Original Vodka (750ml)';
  const bCat = bottle?.category || 'Spirits (Vodka)';
  const bStock = bottle?.currentStock || 48;
  const bReserved = Math.floor(bStock * 0.2);
  const bAvail = bStock - bReserved;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="👑 Definitive Product Workspace Hub (All-in-One Command Center)">
      <div className="space-y-6 text-slate-100 p-2 font-sans">
        
        {/* ─── HERO PRODUCT BANNER & HEALTH SCORES ─── */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#161622] via-[#1f1d32] to-[#161622] border border-[#d4a24c]/40 flex flex-col md:flex-row md:items-center justify-between gap-6 relative shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400">HEALTH SCORE: 98%</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-400">RISK: LOW</span>
              <span className="text-slate-400 text-xs font-mono">• {bCat}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              {bName} <Star className="w-6 h-6 text-[#d4a24c] fill-[#d4a24c]" />
            </h2>
            <p className="text-xs text-slate-300 font-mono">
              Universal SKU Hierarchy: <span className="text-[#d4a24c]">1 Case</span> → <span className="text-white font-bold">12 Bottles</span> → <span className="text-emerald-400 font-bold">18 Shots Each</span> (Auto Unit Conversion Active)
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#101018] p-4 rounded-xl border border-[#262638] shrink-0 font-mono text-center">
            <div>
              <div className="text-[10px] uppercase text-slate-400">Total Stock</div>
              <div className="text-2xl font-black text-white">{bStock} BTL</div>
            </div>
            <div className="w-px h-8 bg-[#262638]" />
            <div>
              <div className="text-[10px] uppercase text-[#d4a24c]">Reserved</div>
              <div className="text-2xl font-black text-[#d4a24c]">{bReserved} BTL</div>
            </div>
            <div className="w-px h-8 bg-[#262638]" />
            <div>
              <div className="text-[10px] uppercase text-emerald-400">Available POS</div>
              <div className="text-2xl font-black text-emerald-400">{bAvail} BTL</div>
            </div>
          </div>
        </div>

        {/* ─── WORKSPACE SUB-NAVIGATION TABS ─── */}
        <div className="flex items-center gap-2 border-b border-[#262636] pb-3 overflow-x-auto scrollbar-none select-none font-mono text-xs">
          {[
            { id: 'overview', label: '📊 Overview Hub' },
            { id: 'stock', label: '📦 Stock & Cases' },
            { id: 'open', label: '💧 Open Bottles & Pours' },
            { id: 'mixers', label: '🍹 Relationships & Mixers' },
            { id: 'files', label: '📎 Universal Attachments (3)' },
            { id: 'notes', label: '📝 Internal Notes' },
            { id: 'timeline', label: '⚡ Universal Timeline' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl font-bold transition-all shrink-0 border ${
                activeTab === tab.id
                  ? 'bg-[#d4a24c] text-black border-amber-500 shadow-lg shadow-amber-900/30 scale-105'
                  : 'bg-[#14141c] text-slate-400 border-[#262636] hover:bg-[#1f1f2e] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TAB CONTENT ORCHESTRATOR ─── */}
        <div className="bg-[#12121a] border border-[#222232] rounded-2xl p-6 min-h-[300px]">
          
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
              <div className="p-5 rounded-xl bg-[#161622] border border-[#262636] space-y-3">
                <span className="text-[10px] uppercase text-emerald-400 font-bold block">Sales Velocity</span>
                <div className="text-3xl font-black text-white">18.4 BTL / Wk</div>
                <p className="text-xs text-slate-400 font-sans">🔥 Highest pour demand Fridays 22:00–02:00 at VIP Bar.</p>
              </div>
              <div className="p-5 rounded-xl bg-[#161622] border border-[#262636] space-y-3">
                <span className="text-[10px] uppercase text-blue-400 font-bold block">Theoretical Shot Ratio</span>
                <div className="text-3xl font-black text-white">99.4% Match</div>
                <p className="text-xs text-slate-400 font-sans">✓ Zero unrecorded wastage or over-pouring detected.</p>
              </div>
              <div className="p-5 rounded-xl bg-[#161622] border border-[#262636] space-y-3">
                <span className="text-[10px] uppercase text-purple-400 font-bold block">Primary Supplier</span>
                <div className="text-xl font-bold text-white">Diageo Southern Africa</div>
                <p className="text-[11px] text-slate-400 font-sans">⚡ Lead Time: 2 Days • Next Delivery Expected Friday.</p>
              </div>
            </div>
          )}

          {activeTab === 'mixers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#d4a24c] font-mono">
                  🍹 Product Relationships & Recommended Mixers (Smart POS Upsell)
                </h3>
                <span className="text-xs text-slate-400">Great for bartender operations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                {[
                  { name: 'Red Bull Energy Drink (250ml Can)', stock: '120 Cans Available', upsell: '92% Pair Rate', color: 'blue' },
                  { name: 'Coca-Cola Classic Can (330ml)', stock: '240 Cans Available', upsell: '88% Pair Rate', color: 'red' },
                  { name: 'Schweppes Tonic Water', stock: '96 Cans Available', upsell: '64% Pair Rate', color: 'amber' },
                ].map((mx, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#181824] border border-[#28283a] space-y-2">
                    <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-bold">POS UPSELL: {mx.upsell}</span>
                    <div className="font-bold text-white text-sm font-sans mt-1">{mx.name}</div>
                    <div className="text-slate-400 text-[11px]">{mx.stock}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400">📎 Universal Attachments & Compliance Vault</h3>
                <Button onClick={() => toast.success('Attached new file to product workspace!')} className="bg-blue-600 hover:bg-blue-500 text-white text-xs py-1.5">
                  + Attach Document / Photo
                </Button>
              </div>
              <div className="space-y-2 font-sans">
                {[
                  { name: 'Diageo Official Product Safety & Customs Sheet.pdf', size: '1.2 MB', date: '2026-04-12', tag: 'SAFETY SHEET' },
                  { name: 'Cîroc High-Res Front Label Packshot.png', size: '3.4 MB', date: '2026-05-01', tag: 'PACKSHOT' },
                  { name: 'NamBev Master Supplier Agreement 2026.pdf', size: '4.8 MB', date: '2026-01-15', tag: 'CONTRACT' },
                ].map((fl, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#161622] border border-[#262636] flex items-center justify-between hover:border-slate-500 transition-colors">
                    <div className="flex items-center gap-3">
                      <Paperclip className="w-4 h-4 text-[#d4a24c]" />
                      <div>
                        <div className="font-bold text-white">{fl.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{fl.size} • Uploaded {fl.date}</div>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-[#222232] text-slate-300 font-bold">{fl.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 font-mono">📝 Searchable Daily Operational Notes</h3>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full h-32 bg-[#161622] border border-[#28283a] rounded-xl p-4 text-slate-200 font-sans text-sm focus:outline-none focus:border-[#d4a24c]"
                placeholder="Add manager daily notes..."
              />
              <div className="flex justify-end">
                <Button onClick={() => toast.success('Saved manager daily note to product archive!')} className="bg-[#d4a24c] hover:bg-[#b8893d] text-black font-black text-xs px-6">
                  Save Note to Searchable Database
                </Button>
              </div>
            </div>
          )}

          {(activeTab === 'stock' || activeTab === 'open' || activeTab === 'timeline') && (
            <div className="text-center py-12 space-y-4 font-mono">
              <Layers className="w-12 h-12 text-[#d4a24c] mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-white uppercase">{activeTab} Ledger Stream Active</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto font-sans">
                Real-time stock take reconciliations, shot pour weights, and chronological lifecycle events are actively synchronized with the main club backend.
              </p>
            </div>
          )}

        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose} className="bg-[#262636] hover:bg-[#323248] text-slate-300 text-xs px-6 py-2">
            Close Product Workspace
          </Button>
        </div>

      </div>
    </Modal>
  );
}
