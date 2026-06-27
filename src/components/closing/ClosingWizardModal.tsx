import { useState } from 'react';
import { 
  Lock, CheckCircle2, AlertTriangle, ArrowRight, Check, 
  DollarSign, FileText, ShieldCheck, Zap, Award, RefreshCw
} from 'lucide-react';
import { Button, Modal } from '../Primitives';
import { toast } from 'sonner';

interface ClosingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClosingWizardModal({ isOpen, onClose }: ClosingWizardModalProps) {
  const [step, setStep] = useState(1);
  const [isDone, setIsDone] = useState(false);

  const STEPS = [
    { num: 1, title: 'Stop POS Sales', desc: 'Lock all entrance cashiers and bar checkout registers.' },
    { num: 2, title: 'Close All Open Bottles', desc: 'Seal active pourers and calculate shot remaining volume.' },
    { num: 3, title: 'Cashier Reconciliation', desc: 'Verify physical cash drawers & card merchant terminal totals.' },
    { num: 4, title: 'Storeroom Physical Count', desc: 'Fast scan warehouse spirits & beer case reserves.' },
    { num: 5, title: 'Open Bottle Shot Count', desc: 'Weigh or gauge remaining open spirit levels.' },
    { num: 6, title: 'Variance Audit Review', desc: 'Review unexplained discrepancies against theoretical POS depletion.' },
    { num: 7, title: 'Approve Inventory Adjustments', desc: 'Manager sign-off on spillage and complimentary promo allowances.' },
    { num: 8, title: 'Generate End-of-Night Report', desc: 'Archive event financial settlement and dispatch summary PDF to owner.' },
  ];

  const handleNext = () => {
    if (step < 8) {
      setStep(prev => prev + 1);
      toast.success(`Completed Step ${step}: ${STEPS[step-1].title}`);
    } else {
      setIsDone(true);
      toast.success('🎉 End-of-Night Closing Procedure Completed! Venue Locked.');
    }
  };

  const handleReset = () => {
    setStep(1);
    setIsDone(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={() => { if (isDone) handleReset(); else toast.warning('Unskippable Closing Wizard Active! Please complete all steps.'); }} title="🌙 End-of-Night Closing Wizard (Mandatory Procedure)">
      <div className="space-y-6 text-slate-200 p-2 font-sans">
        
        {/* Step Progress Bar */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
          {STEPS.map(s => (
            <div key={s.num} className="flex-1 min-w-[32px] text-center">
              <div className={`w-8 h-8 mx-auto rounded-full font-mono font-bold text-xs flex items-center justify-center transition-all ${
                s.num < step || isDone ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-900/40' : s.num === step ? 'bg-[#d4a24c] text-black ring-4 ring-amber-500/20 scale-110' : 'bg-[#1e1e28] text-slate-500'
              }`}>
                {s.num < step || isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
              </div>
            </div>
          ))}
        </div>

        {!isDone ? (
          <div className="bg-[#14141c] border border-[#262634] rounded-2xl p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#d4a24c]/10 border border-[#d4a24c]/30 flex items-center justify-center text-[#d4a24c] mx-auto animate-pulse">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#d4a24c]">Step {step} of 8</span>
              <h3 className="text-2xl font-black text-white mt-1">{STEPS[step-1].title}</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">{STEPS[step-1].desc}</p>
            </div>

            {/* Step Simulation Info Box */}
            <div className="p-4 rounded-xl bg-[#1a1a24] border border-[#2a2a38] text-xs font-mono text-left space-y-2">
              <div className="flex justify-between"><span className="text-slate-400">Target Event:</span><span className="text-white font-bold">Friday Night Sessions</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Duty Manager:</span><span className="text-emerald-400 font-bold">Peter Manager (Verified PIN)</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Compliance Check:</span><span className="text-amber-400">Strict Unskippable Lock Active</span></div>
            </div>

            <Button onClick={handleNext} className="w-full bg-[#d4a24c] hover:bg-[#b8893d] text-black font-black text-sm py-3 shadow-xl">
              {step === 8 ? '✍️ Sign & Finalize Event Closure' : `Confirm & Proceed to Step ${step+1} →`}
            </Button>
          </div>
        ) : (
          <div className="bg-[#121a15] border border-emerald-500/40 rounded-2xl p-8 text-center space-y-5">
            <Award className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-black text-white">🎉 Event Closed Successfully!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              All sales stopped, bottles sealed, cash drawers reconciled, variances approved, and End-of-Night Report dispatched to ownership. Staff may now depart.
            </p>
            <Button onClick={handleReset} className="bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs px-6 py-2.5">
              Close Wizard & Return to Overview
            </Button>
          </div>
        )}

      </div>
    </Modal>
  );
}
