import { useState } from 'react';
import { Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import { Bottle } from '../types';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  bottles: Bottle[];
  onSaveCount?: (skuId: number, count: number) => void;
}

export function HandheldKeypad({ open, onClose, bottles, onSaveCount }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numVal, setNumVal] = useState('0');

  if (!open) return null;

  const currentBottle = bottles[currentIndex] || bottles[0];

  const handleKey = (digit: string) => {
    if (numVal === '0') setNumVal(digit);
    else if (numVal.length < 5) setNumVal(numVal + digit);
  };

  const handlePlusOne = () => {
    const next = (parseInt(numVal, 10) || 0) + 1;
    setNumVal(next.toString());
  };

  const handleClear = () => {
    setNumVal('0');
  };

  const handleSaveAndNext = () => {
    const qty = parseInt(numVal, 10) || 0;
    if (onSaveCount && currentBottle) {
      onSaveCount(currentBottle.id, qty);
    }
    toast.success(`Saved count: ${qty} units for ${currentBottle?.name || 'SKU'}`);
    setNumVal('0');
    if (currentIndex < bottles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.info('🎉 All storeroom items counted! Generating audit compliance variance.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0c0c10] flex flex-col p-4 pb-safe select-none overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#22222e] pb-3 shrink-0">
        <div>
          <div className="text-[10px] font-mono text-[#d4a24c] uppercase font-bold">Handheld Keypad OS</div>
          <h2 className="text-base font-black text-white">Stocktake Audit Mode</h2>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('📷 Camera Barcode Scanner Active')} className="p-2 rounded-xl bg-[#181822] text-[#d4a24c]">
            <Camera className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-400 font-bold text-xs">
            Exit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="py-3 shrink-0">
        <div className="flex justify-between text-[11px] text-slate-400 font-semibold mb-1">
          <span>SKU {currentIndex + 1} of {bottles.length}</span>
          <span className="text-emerald-400">~{Math.max(1, Math.round((bottles.length - currentIndex) * 0.2))} min left</span>
        </div>
        <div className="w-full h-1.5 bg-[#181822] rounded-full overflow-hidden">
          <div className="h-full bg-[#d4a24c] transition-all duration-300" style={{ width: `${Math.round((currentIndex + 1) / bottles.length * 100)}%` }} />
        </div>
      </div>

      {/* Hero SKU Preview Card */}
      <div className="p-4 rounded-2xl bg-[#14141a] border border-[#262632] text-center my-1 shrink-0">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">{currentBottle?.category || 'Spirits'} • {currentBottle?.location || 'Main Bar'}</div>
        <h3 className="text-lg font-black text-white mt-0.5 truncate">{currentBottle?.name || 'Hennessy VSOP'}</h3>
        <p className="text-xs text-slate-400">System expect: <span className="font-mono text-white font-bold">{currentBottle?.quantity || 12} units</span></p>
      </div>

      {/* Giant Numeric Screen Display */}
      <div className="flex-1 min-h-[70px] max-h-[110px] rounded-2xl bg-[#08080c] border-2 border-[#d4a24c]/40 flex items-center justify-center my-2 shadow-inner shrink-0">
        <span className="text-5xl font-mono font-black gold-gradient-text tracking-wider">{numVal}</span>
        <span className="text-sm text-slate-500 font-bold ml-2 self-end mb-4">UNITS</span>
      </div>

      {/* Giant Numeric Touch Keypad Grid */}
      <div className="grid grid-cols-3 gap-2 flex-1 my-1">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(d => (
          <button
            key={d}
            onClick={() => handleKey(d)}
            className="rounded-2xl bg-[#16161f] hover:bg-[#20202c] active:bg-[#d4a24c] active:text-black text-2xl font-black text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
          >
            {d}
          </button>
        ))}
        <button
          onClick={handlePlusOne}
          className="rounded-2xl bg-emerald-500/20 border border-emerald-500/40 active:bg-emerald-400 active:text-black text-lg font-black text-emerald-300 flex items-center justify-center shadow-lg transition-all active:scale-95"
        >
          +1
        </button>
        <button
          onClick={() => handleKey('0')}
          className="rounded-2xl bg-[#16161f] hover:bg-[#20202c] active:bg-[#d4a24c] active:text-black text-2xl font-black text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
        >
          0
        </button>
        <button
          onClick={handleClear}
          className="rounded-2xl bg-red-500/15 border border-red-500/30 active:bg-red-500 active:text-white text-base font-black text-red-400 flex items-center justify-center shadow-lg transition-all active:scale-95"
        >
          CLR
        </button>
      </div>

      {/* Giant Green Submit Button */}
      <button
        onClick={handleSaveAndNext}
        className="w-full h-16 rounded-2xl bg-emerald-400 text-black font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl shadow-emerald-500/30 mt-2 transition-all active:scale-95 hover:bg-emerald-300 shrink-0"
      >
        <CheckCircle2 className="w-6 h-6 stroke-[3]" />
        <span>Save SKU & Next</span>
        <ArrowRight className="w-5 h-5 stroke-[3]" />
      </button>
    </div>
  );
}
