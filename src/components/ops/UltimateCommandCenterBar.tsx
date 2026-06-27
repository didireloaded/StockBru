import { useState, useEffect } from 'react';
import { 
  Clock, RotateCcw, ShieldCheck, Zap, Layers, Command, 
  Search, CheckCircle2, AlertTriangle, Play, Pause, 
  ChevronRight, Sparkles, HelpCircle, Activity, Server, 
  FileText, Truck, RefreshCw, Undo2, Users, Star
} from 'lucide-react';
import { Button, Modal } from '../Primitives';
import { ProductWorkspaceModal } from './ProductWorkspaceModal';
import { Bottle } from '../../types';
import { toast } from 'sonner';

interface UltimateCommandCenterBarProps {
  bottles: Bottle[];
}

export function UltimateCommandCenterBar({ bottles }: UltimateCommandCenterBarProps) {
  const [selectedProduct, setSelectedProduct] = useState<Bottle | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [replayHour, setReplayHour] = useState(20); // 18 to 2 (26)
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);

  // Simulated Replay stock count
  const replaySimStock = Math.floor(48 - (replayHour >= 18 ? (replayHour - 18) * 3.5 : (replayHour + 6) * 3.5));

  useEffect(() => {
    let timer: any;
    if (isPlayingReplay) {
      timer = setInterval(() => {
        setReplayHour(prev => {
          if (prev === 23) return 0;
          if (prev === 2) { setIsPlayingReplay(false); return 18; }
          return prev + 1;
        });
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlayingReplay]);

  const handleSimulateUndo = () => {
    toast('🛍️ Bottle Sold: Cîroc Original (750ml) — N$ 1,450', {
      description: '⏱️ Undo Window Active: 10 Seconds Remaining to Rollback.',
      action: {
        label: '↩ UNDO SALE',
        onClick: () => toast.success('↩ Sale Rolled Back Successfully! Inventory restored + Audit log created.'),
      },
      duration: 10000,
    });
  };

  const RECENTLY_VIEWED = [
    { label: 'Cîroc Original (750ml)', type: 'sku' },
    { label: 'NamBev PO #8824', type: 'po' },
    { label: 'Friday Night Set (Black Coffee)', type: 'event' },
    { label: 'Main Bar Spirits Count', type: 'count' },
  ];

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      
      {/* ─── 1. ADOBE/FIGMA STYLE RECENTLY VIEWED & HEALTH BADGE ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0f0f16] p-4 rounded-2xl border border-[#222232] shadow-xl font-mono text-xs">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1 md:pb-0">
          <span className="text-slate-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#d4a24c]" /> Recently Viewed:
          </span>
          {RECENTLY_VIEWED.map((rv, i) => (
            <button
              key={i}
              onClick={() => {
                if (rv.type === 'sku') setSelectedProduct(bottles[0] || null);
                else toast.info(`Reopened ${rv.label}`);
              }}
              className="px-3 py-1 rounded-lg bg-[#181824] hover:bg-[#262638] text-slate-200 hover:text-[#d4a24c] border border-[#2a2a3e] transition-all shrink-0 flex items-center gap-1.5"
            >
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span>{rv.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#222232]">
          <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <Server className="w-3.5 h-3.5" /> System Health: 100% Synced
          </span>
          <Button onClick={() => setShowShortcuts(true)} className="bg-[#1c1c2a] hover:bg-[#2a2a40] text-slate-300 px-2.5 py-1 h-7 text-xs flex items-center gap-1" title="Keyboard Shortcuts Cheat Sheet">
            <Command className="w-3.5 h-3.5 text-[#d4a24c]" /> Shortcuts
          </Button>
        </div>
      </div>

      {/* ─── 2. DRAFT MODE RESUMPTION BANNER (62% PROGRESS) ─── */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/30 via-[#1e1910] to-[#14120e] border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 animate-pulse">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500 text-black">DRAFT MODE IN PROGRESS</span>
              <span className="text-xs font-mono text-slate-400">Started 15:42 • Last Edited 16:10</span>
            </div>
            <h3 className="font-bold text-white text-base mt-1 font-sans">Main Bar Friday Spirits Stock Take</h3>
            <p className="text-xs text-slate-300 mt-0.5 font-sans">
              Peter saved this audit in draft status. <strong className="text-amber-300">62% Completed</strong> (18 of 29 beverage categories counted).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button onClick={() => toast.success('Resumed Draft Stock Take Audit! Jumped to Category 19.')} className="w-full sm:w-auto bg-[#d4a24c] hover:bg-[#b8893d] text-black font-black text-xs px-6 py-2.5 shadow-lg flex items-center justify-center gap-2">
            <span>Resume Draft Audit</span> <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ─── 3. ACTIVITY REPLAY SCRUBBER SLIDER (18:00 TO 02:00) ─── */}
      <div className="bg-[#12121a] border border-[#242436] rounded-2xl p-6 shadow-xl space-y-4 font-mono">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 animate-spin" /> Time Travel Scrubber Engine
            </span>
            <h3 className="text-lg font-black text-white font-sans mt-0.5">Watch Friday Inventory Change Across Shift Hours</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#1c1c2a] px-3 py-1 rounded-lg text-sm font-bold text-[#d4a24c]">
              SIMULATED TIME: {replayHour < 10 ? `0${replayHour}:00` : `${replayHour}:00`}
            </div>
            <Button 
              onClick={() => setIsPlayingReplay(!isPlayingReplay)}
              className={`${isPlayingReplay ? 'bg-amber-600' : 'bg-purple-600 hover:bg-purple-500'} text-white text-xs px-4 py-1.5 flex items-center gap-1.5`}
            >
              {isPlayingReplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlayingReplay ? 'Pause Replay' : 'Replay Shift Stream'}</span>
            </Button>
          </div>
        </div>

        {/* Scrubber Slider Bar */}
        <div className="space-y-2 pt-2">
          <input 
            type="range" 
            min="18" 
            max="26" 
            value={replayHour < 18 ? replayHour + 24 : replayHour}
            onChange={(e) => {
              const val = Number(e.target.value);
              setReplayHour(val >= 24 ? val - 24 : val);
            }}
            className="w-full accent-[#d4a24c] bg-[#222234] h-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-bold px-1">
            <span>18:00 (Doors)</span>
            <span>20:00 (VIP Rush)</span>
            <span>22:00 (Headline DJ)</span>
            <span>00:00 (Peak Pour)</span>
            <span>02:00 (Closing)</span>
          </div>
        </div>

        {/* Live Scrubber Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#222234] text-xs">
          <div className="p-3 rounded-xl bg-[#181824] flex items-center justify-between">
            <span className="text-slate-400">Simulated Cîroc Stock:</span>
            <span className="text-white font-bold text-sm">{Math.max(4, replaySimStock)} Bottles</span>
          </div>
          <div className="p-3 rounded-xl bg-[#181824] flex items-center justify-between">
            <span className="text-slate-400">Pour Velocity:</span>
            <span className="text-purple-400 font-bold text-sm">{replayHour >= 21 || replayHour <= 1 ? '52 BTL/hr 🔥' : '14 BTL/hr'}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#181824] flex items-center justify-between">
            <span className="text-slate-400">Undo Protection:</span>
            <button onClick={handleSimulateUndo} className="text-[#d4a24c] hover:underline flex items-center gap-1 font-bold">
              <Undo2 className="w-3 h-3" /> Test 10s Undo Toast
            </button>
          </div>
        </div>
      </div>

      {/* ─── 4. DEFINITIVE PRODUCT WORKSPACE MODAL TRIGGER ─── */}
      <ProductWorkspaceModal 
        bottle={selectedProduct || bottles[0] || null} 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      {/* ─── 5. KEYBOARD SHORTCUT CHEAT SHEET MODAL ─── */}
      <Modal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} title="⚡ Global Keyboard Shortcuts Cheat Sheet">
        <div className="space-y-4 text-slate-200 p-2 font-mono text-xs">
          <p className="text-slate-400 font-sans">Power users operate StockBru at lightning speed without reaching for a mouse.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: 'Ctrl + K', desc: 'Search Absolutely Everything' },
              { key: 'N', desc: 'Create New Inventory Product' },
              { key: 'R', desc: 'Open Goods Receipt Delivery' },
              { key: 'T', desc: 'Start Rapid Stock Take Count' },
              { key: 'P', desc: 'Create Emergency Purchase Order' },
              { key: 'Esc', desc: 'Close Active Workspace Modal' },
            ].map((sc, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-[#161622] border border-[#262636] flex items-center justify-between">
                <span className="text-slate-300 font-sans">{sc.desc}</span>
                <kbd className="px-2.5 py-1 rounded bg-[#242436] text-[#d4a24c] font-black border border-slate-600 shadow">{sc.key}</kbd>
              </div>
            ))}
          </div>
        </div>
      </Modal>

    </div>
  );
}
