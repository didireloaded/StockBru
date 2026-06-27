import { useState } from 'react';
import { 
  Sparkles, CheckCircle2, AlertTriangle, Clock, Layers, 
  Lock, Trash2, RefreshCw, FileText, Printer, Moon, 
  ChevronRight, Check, X, Plus, Bell, ShieldCheck, Zap
} from 'lucide-react';
import { Button, Modal } from '../Primitives';
import { ClosingWizardModal } from '../closing/ClosingWizardModal';
import { toast } from 'sonner';

interface SuiteProps {
  onOpenLiveBoard: () => void;
}

export function NightclubFlagshipSuite({ onOpenLiveBoard }: SuiteProps) {
  const [showClosingWizard, setShowClosingWizard] = useState(false);
  const [showQuickCount, setShowQuickCount] = useState(false);
  const [showWasteLog, setShowWasteLog] = useState(false);
  const [showLifecycle, setShowLifecycle] = useState(false);
  const [showHandover, setShowHandover] = useState(false);

  // Chrome-like Workspace Tabs state
  const [workspaceTabs, setWorkspaceTabs] = useState([
    { id: 'overview', title: '📊 Overview Hub', active: true },
    { id: 'rider', title: '🎧 Rider: DJ Black Coffee', active: false },
    { id: 'po', title: '📦 PO #8824 (Moët)', active: false },
    { id: 'handover', title: '📋 Duty Handover Brief', active: false },
  ]);

  const handleSelectTab = (id: string) => {
    setWorkspaceTabs(prev => prev.map(t => ({ ...t, active: t.id === id })));
    toast.info(`Switched workspace tab`);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (workspaceTabs.length > 1) {
      setWorkspaceTabs(prev => prev.filter(t => t.id !== id));
    } else {
      toast.warning('Cannot close final workspace tab!');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ─── 1. CHROME-LIKE WORKSPACE TABS BAR ─── */}
      <div className="bg-[#101015] border-b border-[#20202c] px-4 pt-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none sticky top-16 z-10">
        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#d4a24c]" /> Tabs:
        </div>
        {workspaceTabs.map(tab => (
          <div
            key={tab.id}
            onClick={() => handleSelectTab(tab.id)}
            className={`group flex items-center gap-2.5 px-3.5 py-1.5 rounded-t-xl text-xs font-mono font-semibold cursor-pointer transition-all border-t border-x ${
              tab.active 
                ? 'bg-[#181822] text-[#d4a24c] border-[#d4a24c]/40 shadow-sm pt-2' 
                : 'bg-[#121218] text-slate-400 border-transparent hover:bg-[#16161f] hover:text-slate-200'
            }`}
          >
            <span>{tab.title}</span>
            <span 
              onClick={(e) => handleCloseTab(tab.id, e)}
              className="w-4 h-4 rounded hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-3 h-3" />
            </span>
          </div>
        ))}
        <button 
          onClick={() => {
            const newId = `tab_${Date.now()}`;
            setWorkspaceTabs(prev => [...prev.map(t => ({...t, active:false})), { id: newId, title: '🔍 Saved View: Spirits Prep', active: true }]);
            toast.success('Opened new Chrome-like workspace view tab');
          }}
          className="w-7 h-7 rounded-lg hover:bg-[#1f1f2c] flex items-center justify-center text-slate-400 hover:text-white mb-1 transition-colors ml-1"
          title="Open new Chrome-like workspace view"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* ─── 2. THE INVISIBLE ASSISTANT & "TODAY'S FOCUS" ACTION GREETING ─── */}
      <div className="bg-gradient-to-r from-[#161622] via-[#1a1828] to-[#161622] border border-[#d4a24c]/30 rounded-2xl p-6 shadow-xl relative overflow-hidden text-slate-100">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#d4a24c]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#d4a24c] font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Invisible Intelligence Command Brief
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Good evening. Welcome back, Peter.
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              The system already evaluated tonight's operational environment. <strong className="text-white underline">What should I do right now?</strong>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Button onClick={onOpenLiveBoard} className="bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-lg animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" /> Open Full-Screen Live Ops Board
            </Button>
            <Button onClick={() => setShowClosingWizard(true)} className="bg-[#262636] hover:bg-[#323246] text-[#d4a24c] border border-[#d4a24c]/40 font-black text-xs flex items-center gap-2">
              <Moon className="w-3.5 h-3.5" /> Launch Closing Wizard
            </Button>
          </div>
        </div>

        {/* Role Immediate Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#262636] font-mono text-xs">
          {[
            { tag: 'MANAGER ACTION', text: 'Approve Emergency PO #8824 (Moët & Chandon)', icon: Zap, color: 'amber' },
            { tag: 'EVENT PREP', text: 'Tonight DJ Black Coffee is 96% Event Ready', icon: ShieldCheck, color: 'emerald' },
            { tag: 'BARTENDER BRIEF', text: 'Count 2 open Cîroc bottles before 20:00 doors', icon: Clock, color: 'blue' },
            { tag: 'CONTROLLER TASK', text: 'Receive NamBev afternoon beverage shipment', icon: RefreshCw, color: 'purple' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-xl bg-[#12121a] border border-[#262636] hover:border-[#d4a24c]/50 transition-all cursor-pointer flex items-start gap-3 group">
                <div className={`w-8 h-8 rounded-lg bg-${item.color}-500/10 text-${item.color}-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <span className={`text-[9px] font-bold text-${item.color}-400 block tracking-wider`}>{item.tag}</span>
                  <p className="text-slate-200 font-sans font-semibold mt-0.5 leading-snug group-hover:text-[#d4a24c] transition-colors">{item.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rapid Operations Action Bar Shortcuts */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[#262636] overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono uppercase text-slate-400 mr-2 shrink-0">⚡ Quick Tools:</span>
          <Button onClick={() => setShowQuickCount(true)} className="bg-[#1f1f2e] hover:bg-[#2c2c40] text-slate-200 text-xs py-1.5 shrink-0">
            ⏱️ 30s Rapid Quick Count
          </Button>
          <Button onClick={() => setShowWasteLog(true)} className="bg-[#1f1f2e] hover:bg-[#2c2c40] text-slate-200 text-xs py-1.5 shrink-0">
            🗑️ Smart Waste Logging
          </Button>
          <Button onClick={() => setShowLifecycle(true)} className="bg-[#1f1f2e] hover:bg-[#2c2c40] text-slate-200 text-xs py-1.5 shrink-0">
            🔄 Bottle Lifecycle Audit
          </Button>
          <Button onClick={() => setShowHandover(true)} className="bg-[#1f1f2e] hover:bg-[#2c2c40] text-slate-200 text-xs py-1.5 shrink-0">
            📋 Duty Shift Handover Log
          </Button>
          <Button onClick={() => toast.success('Generated Printable Barcode Labels PDF!')} className="bg-[#1f1f2e] hover:bg-[#2c2c40] text-slate-200 text-xs py-1.5 shrink-0">
            🖨️ Print Storeroom Barcodes
          </Button>
        </div>
      </div>

      {/* ─── MODAL 1: CLOSING WIZARD ─── */}
      <ClosingWizardModal isOpen={showClosingWizard} onClose={() => setShowClosingWizard(false)} />

      {/* ─── MODAL 2: 30s RAPID QUICK COUNT ─── */}
      <Modal isOpen={showQuickCount} onClose={() => setShowQuickCount(false)} title="⏱️ Rapid Quick Count Mode (30 Seconds)">
        <div className="space-y-5 text-slate-200 p-2 font-mono text-xs">
          <p className="text-slate-400 font-sans">Sometimes managers don't need a full audit. Swipe or tap categories in 30 seconds.</p>
          <div className="space-y-3">
            {['Spirits (Vodka & Gin)', 'Beers & Ciders Kegs', 'Premium Champagnes'].map((cat, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#14141c] border border-[#262634] flex items-center justify-between">
                <span className="font-bold text-white text-sm font-sans">{cat}</span>
                <Button onClick={() => toast.success(`${cat} count verified match`)} className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs">
                  Count Verified ✓
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* ─── MODAL 3: SMART STRUCTURED WASTE TRACKING ─── */}
      <Modal isOpen={showWasteLog} onClose={() => setShowWasteLog(false)} title="🗑️ Smart Waste & Loss Tracker">
        <div className="space-y-4 text-slate-200 p-2 font-sans text-xs">
          <p className="text-slate-400">Instead of generic 'damaged', capture structured root loss causes for accurate financial reporting.</p>
          <div className="grid grid-cols-2 gap-3 font-mono">
            {['Broken', 'Spillage', 'Expired', 'Staff Error', 'Customer Complaint', 'Promotional Use', 'Management Use'].map((r, i) => (
              <Button key={i} onClick={() => { toast.success(`Logged variance loss under reason: ${r}`); setShowWasteLog(false); }} className="bg-[#1a1a24] hover:bg-[#d4a24c] hover:text-black text-slate-200 text-xs py-3 border border-[#2a2a36]">
                {r}
              </Button>
            ))}
          </div>
        </div>
      </Modal>

      {/* ─── MODAL 4: BOTTLE LIFECYCLE AUDIT ─── */}
      <Modal isOpen={showLifecycle} onClose={() => setShowLifecycle(false)} title="🔄 Complete Bottle Lifecycle Tracker">
        <div className="space-y-6 text-slate-200 p-2 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#14141c] border border-[#d4a24c]/40 text-center">
            <span className="text-slate-400 text-[10px] block uppercase">Target Asset</span>
            <strong className="text-base text-[#d4a24c] font-sans">Cîroc Original #BAT-99124</strong>
          </div>
          <div className="space-y-3 pl-4 border-l-2 border-[#d4a24c]">
            {[
              { t: '14:00', txt: 'Bottle Received from Diageo Supplier' },
              { t: '14:15', txt: 'Stored in Warehouse Bin A4' },
              { t: '18:00', txt: 'Transferred to VIP Bar Fridge' },
              { t: '21:30', txt: 'Opened Bottle Seal • Shot Pour Active' },
              { t: '23:45', txt: '18 Shots Sold • Bottle Empty' },
              { t: '02:00', txt: 'Glass Disposed & Ledger Archived' },
            ].map((node, i) => (
              <div key={i} className="flex gap-4 items-center">
                <span className="text-[#d4a24c] font-bold">{node.t}</span>
                <span className="text-slate-300 font-sans">{node.txt}</span>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* ─── MODAL 5: SHIFT HANDOVER BRIEF ─── */}
      <Modal isOpen={showHandover} onClose={() => setShowHandover(false)} title="📋 Duty Manager Shift Handover Brief">
        <div className="space-y-4 text-slate-200 p-2 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#181822] border border-[#262634] space-y-2">
            <div className="text-amber-400 font-bold">⚠️ Morning Manager → Night Manager Note:</div>
            <p className="text-slate-300 font-sans leading-relaxed">
              Three bottles reserved for Black Coffee set. NamBev supplier arriving tomorrow 10 AM. Open stock take draft in progress. VIP Freezer compressor reported buzzing (cooltech assigned). Nothing gets forgotten.
            </p>
          </div>
        </div>
      </Modal>

    </div>
  );
}
