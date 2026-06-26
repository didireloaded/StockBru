import { useState, useEffect } from 'react';
import { 
  Activity, Package, Refrigerator, BarChart3, ArrowRight, 
  CheckCircle2, ShieldCheck, Zap, X, ChevronRight, ChevronLeft, 
  MapPin, Sliders
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onComplete: () => void;
  onNavigateTab: (tabId: string) => void;
}

export function InteractiveWalkthrough({ onComplete, onNavigateTab }: Props) {
  const [step, setStep] = useState(1);

  const STEPS = [
    {
      title: 'Nightclub Mission Control',
      subtitle: 'Step 1: Real-Time Overview',
      description: 'You are viewing the active event dashboard. Everything critical is summarized here: Shift revenue N$, open bottles, staff attendance, and critical restock risks.',
      targetTab: 'overview',
      spotlightBanner: '⚡ SPOTLIGHT ACTIVE: Overview Scorecard & Event Calendar',
      icon: Activity,
    },
    {
      title: 'Inventory Explorer',
      subtitle: 'Step 2: Master Stock & Batches',
      description: 'We have automatically navigated to Inventory. Here you can inspect backstock across storerooms, filter by liquor categories, and record FIFO stock received.',
      targetTab: 'inventory',
      spotlightBanner: '📦 SPOTLIGHT ACTIVE: Master Catalog & Multi-Location Stock',
      icon: Package,
    },
    {
      title: 'Smart Fridge Grid',
      subtitle: 'Step 3: Visual Bottle & ml Levels',
      description: 'Now viewing Smart Fridge. Each bar station maintains live fill-level indicators tracking exact sub-shot liquid volume decay across open partial pours.',
      targetTab: 'fridge',
      spotlightBanner: '❄️ SPOTLIGHT ACTIVE: Bar Station Fridges & Live Fill Indicators',
      icon: Refrigerator,
    },
    {
      title: 'Interactive Valuation Reports',
      subtitle: 'Step 4: Financial Audit Drilldowns',
      description: 'Finally viewing Reports. Click any chart segment or calendar date to immediately pop open an audit drawer showing SKU cost breakdowns and staff variances.',
      targetTab: 'reports',
      spotlightBanner: '📊 SPOTLIGHT ACTIVE: Clickable Financial Audit Charts',
      icon: BarChart3,
    },
  ];

  const current = STEPS[step - 1];
  const IconComponent = current.icon;

  useEffect(() => {
    onNavigateTab(current.targetTab);
  }, [step]);

  const handleNext = () => {
    if (step < STEPS.length) {
      setStep(step + 1);
    } else {
      toast.success('Nightclub OS Walkthrough completed');
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col justify-between p-6">
      {/* Top Animated Spotlight Pointer Banner */}
      <div className="w-full flex justify-center pt-2">
        <div className="pointer-events-auto px-6 py-2.5 rounded-full bg-[#121218] border-2 border-[#d4a24c] text-[#d4a24c] font-black text-xs tracking-wider uppercase shadow-[0_0_30px_rgba(212,162,76,0.3)] animate-pulse flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{current.spotlightBanner}</span>
        </div>
      </div>

      {/* Floating Walkthrough Card (Top-Right / Bottom-Right) */}
      <div className="w-full flex justify-end pb-4 pr-4">
        <div className="pointer-events-auto w-full max-w-md bg-[#0e0e14]/95 border-2 border-[#d4a24c]/80 rounded-3xl p-6 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-xl relative space-y-5 animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-[#22222e] pb-3.5">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#d4a24c]">
              <span>SPOTLIGHT TOUR</span>
              <span className="text-slate-600">•</span>
              <span>{step} OF {STEPS.length}</span>
            </div>
            <button 
              onClick={() => { toast.info('Walkthrough dismissed • Replay anytime from Settings'); onComplete(); }} 
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors font-semibold"
            >
              <span>Skip</span> <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#d4a24c] text-black flex items-center justify-center shrink-0 font-black shadow-lg shadow-[#d4a24c]/20">
                <IconComponent className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{current.subtitle}</span>
                <h3 className="text-lg font-black text-white leading-snug">{current.title}</h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-[#14141c] p-3.5 rounded-xl border border-[#242432]">
              {current.description}
            </p>
          </div>

          {/* Footer Navigation & Progress */}
          <div className="pt-3 border-t border-[#22222e] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {STEPS.map((_, idx) => (
                  <span 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx + 1 === step ? 'w-6 bg-[#d4a24c]' : 'w-1.5 bg-[#262634]'}`}
                  />
                ))}
              </div>

              <div className="flex gap-2">
                {step > 1 && (
                  <button 
                    onClick={handleBack}
                    className="py-2 px-3 rounded-xl bg-[#1c1c26] text-slate-300 text-xs font-bold hover:bg-[#262634] transition-all flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Back
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  className="py-2 px-5 rounded-xl bg-[#d4a24c] text-black font-black text-xs hover:bg-[#e9c27a] transition-all shadow-md flex items-center gap-1"
                >
                  <span>{step === STEPS.length ? 'Enter Dashboard' : 'Next'}</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>

            <div className="text-[10px] text-center text-slate-500 font-medium">
              💡 Replay this interactive tour later from Settings → System Preferences
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
