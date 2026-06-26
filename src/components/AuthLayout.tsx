import { useState, useEffect } from 'react';
import { 
  Eye, EyeOff, Lock, Mail, User, MapPin, ArrowRight, 
  ShieldCheck, CheckCircle2, Clock, Calendar, Wine, Zap, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onAuthenticated: (user: { name: string; role: string; event: string; workArea: string; isFirstLogin: boolean }) => void;
}

const EVENTS_SEED = [
  { name: 'Friday Night Sessions (Mega Reggae)', time: '20:00 – 04:00', status: 'Live 🟢', staff: 6 },
  { name: 'Saturday Exclusive VIP Launch', time: '21:00 – 05:00', status: 'Scheduled ⏳', staff: 8 },
  { name: 'Sunday Sunset Rooftop Lounge', time: '15:00 – 23:00', status: 'Scheduled ⏳', staff: 4 },
  { name: 'Ladies Night Exclusive (Wednesday)', time: '19:00 – 02:00', status: 'Scheduled ⏳', staff: 5 },
];

const WORK_AREAS_SEED = [
  { name: 'Main Bar', type: 'Bar Station 🍸' },
  { name: 'VIP Bar', type: 'Bottle Service 🍾' },
  { name: 'Rooftop Bar', type: 'Cocktail Deck 🍹' },
  { name: 'Lounge Bar', type: 'Whiskey & Cigars 🥃' },
  { name: 'Stock Room', type: 'Central Storeroom 📦' },
  { name: 'Cold Room', type: 'Kegs & Backstock ❄️' },
  { name: 'Entrance Cashier', type: 'Door & POS 🎟️' },
];

export function AuthLayout({ onAuthenticated }: Props) {
  const [view, setView] = useState<'splash' | 'login' | 'forgot' | 'shift_start'>('splash');
  const [identifier, setIdentifier] = useState('peter@stockbru.com');
  const [password, setPassword] = useState('Didireloaded@1');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Shift Start State
  const [selectedEvent, setSelectedEvent] = useState(EVENTS_SEED[0].name);
  const [selectedArea, setSelectedArea] = useState(WORK_AREAS_SEED[0].name);

  useEffect(() => {
    if (view === 'splash') {
      const timer = setTimeout(() => setView('login'), 1200);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleKeyUp = (e: React.KeyboardEvent) => {
    setCapsLock(e.getModifierState('CapsLock'));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) {
      toast.error('Account locked for 15 minutes due to multiple failed credentials.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (password !== 'Didireloaded@1' && password !== 'admin') {
        const attempts = failedAttempts + 1;
        setFailedAttempts(attempts);
        toast.error(`Invalid authentication (${attempts}/3 attempts)`);
        if (attempts >= 3) setIsLocked(true);
        return;
      }

      toast.success('Identity verified • Proceed to Shift Start Setup');
      setView('shift_start');
    }, 600);
  };

  const handleStartShift = (isFirst: boolean) => {
    toast.success(`Shift active • Work Area: ${selectedArea} (${selectedEvent})`);
    onAuthenticated({
      name: identifier.includes('peter') ? 'Peter Bartender' : 'Pedro Manager',
      role: identifier.includes('peter') ? 'Bartender' : 'Club Manager',
      event: selectedEvent,
      workArea: selectedArea,
      isFirstLogin: isFirst,
    });
  };

  return (
    <div className="min-h-screen bg-[#09090c] flex items-center justify-center p-4 selection:bg-[#d4a24c] selection:text-black font-sans relative overflow-hidden">
      {/* Subtle Nightclub Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4a24c]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* 1. SPLASH SCREEN */}
      {view === 'splash' && (
        <div className="text-center space-y-4 animate-in fade-in duration-500">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4a24c] to-[#8a6520] flex items-center justify-center mx-auto shadow-2xl shadow-[#d4a24c]/20 animate-pulse">
            <Wine className="w-8 h-8 text-black stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-widest text-white">STOCKBRU</h1>
            <p className="text-xs text-[#d4a24c] font-mono tracking-widest uppercase mt-1">Single Club Operating System</p>
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-4">
            <span className="w-2 h-2 rounded-full bg-[#d4a24c] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#d4a24c] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 rounded-full bg-[#d4a24c] animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}

      {/* 2. LOGIN SCREEN */}
      {view === 'login' && (
        <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-[#262630] bg-[#0e0e13]/90 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-1.5 border-b border-[#22222d] pb-5">
            <div className="w-10 h-10 rounded-xl bg-[#d4a24c] flex items-center justify-center mx-auto text-black font-black mb-3 shadow-lg shadow-[#d4a24c]/20">
              <Wine className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-black tracking-wider text-white">STOCKBRU OS</h2>
            <p className="text-xs text-slate-400">Single Club Inventory & Shift Operating System</p>
          </div>

          <form onSubmit={handleLogin} onKeyUp={handleKeyUp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Email or Username
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#d4a24c] transition-colors" />
                <input
                  required
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. peter@club.com or peter"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#141419] border border-[#262632] text-sm text-white focus:outline-none focus:border-[#d4a24c] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Account Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#d4a24c] transition-colors" />
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#141419] border border-[#262632] text-sm text-white focus:outline-none focus:border-[#d4a24c] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {capsLock && (
                <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-1.5 font-semibold">
                  <span>⚠️ Caps Lock is turned on</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 text-[#d4a24c] focus:ring-0 bg-[#141419]" />
                <span>Remember session</span>
              </label>
              <button type="button" onClick={() => setView('forgot')} className="text-slate-400 hover:text-[#d4a24c]">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full py-3.5 rounded-xl bg-[#d4a24c] text-black font-black text-sm hover:bg-[#e9c27a] disabled:opacity-50 transition-all shadow-xl shadow-[#d4a24c]/10 mt-2"
            >
              {loading ? 'Authenticating...' : 'Continue to Shift Setup'}
            </button>
          </form>
        </div>
      )}

      {/* 3. FORGOT PASSWORD */}
      {view === 'forgot' && (
        <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-[#262630] bg-[#0e0e13]/90 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
          <div className="text-center space-y-2">
            <ShieldCheck className="w-12 h-12 text-[#d4a24c] mx-auto mb-2" />
            <h2 className="text-xl font-bold text-white">Reset Club Password</h2>
            <p className="text-xs text-slate-400">Request password authorization token from Club Admin</p>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Username or email" defaultValue={identifier} className="w-full px-4 py-3 rounded-xl bg-[#141419] border border-[#262632] text-sm text-white" />
            <button onClick={() => { toast.success('Password authorization token sent to Club Manager'); setView('login'); }} className="w-full py-3 rounded-xl bg-[#d4a24c] text-black font-bold text-sm">Request Authorization</button>
            <button onClick={() => setView('login')} className="w-full py-2 text-xs text-slate-400 hover:text-white">Return to Sign In</button>
          </div>
        </div>
      )}

      {/* 4. SHIFT START WORKFLOW (Nightclub OS Core Mandate) */}
      {view === 'shift_start' && (
        <div className="w-full max-w-xl glass-card p-8 rounded-3xl border border-[#262630] bg-[#0e0e13]/95 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
          <div className="space-y-1 border-b border-[#22222d] pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#d4a24c]/20 text-[#d4a24c] font-mono font-bold text-[10px]">
                SHIFT SETUP
              </span>
              <span className="text-xs text-slate-400">Nightclub Operating Environment</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight pt-1">Select Event & Work Area</h2>
            <p className="text-xs text-slate-400">Every sale and open bottle will link to this active workstation session</p>
          </div>

          {/* STEP 1: EVENT SELECTION */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-[#d4a24c] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> 1. Select Venue Event
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EVENTS_SEED.map(ev => (
                <div
                  key={ev.name}
                  onClick={() => setSelectedEvent(ev.name)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${selectedEvent === ev.name ? 'bg-[#d4a24c]/15 border-[#d4a24c] text-white shadow-md' : 'bg-[#141419] border-[#22222c] text-slate-300 hover:border-slate-500'}`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-bold text-xs leading-tight">{ev.name}</span>
                    <span className="text-[10px] font-mono font-semibold">{ev.status}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
                    <span>{ev.time}</span>
                    <span>{ev.staff} Staff</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: WORK AREA SELECTION */}
          <div className="space-y-2.5 pt-2">
            <label className="block text-xs font-bold text-[#d4a24c] uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> 2. Select Work Area (Bar / Station)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WORK_AREAS_SEED.map(wa => (
                <div
                  key={wa.name}
                  onClick={() => setSelectedArea(wa.name)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${selectedArea === wa.name ? 'bg-[#d4a24c] text-black font-black border-[#d4a24c] shadow-lg' : 'bg-[#141419] border-[#22222c] text-slate-300 hover:border-slate-500'}`}
                >
                  <div>
                    <div className="text-xs font-bold">{wa.name}</div>
                    <div className={`text-[10px] mt-0.5 ${selectedArea === wa.name ? 'text-black/80' : 'text-slate-500'}`}>{wa.type}</div>
                  </div>
                  {selectedArea === wa.name && <CheckCircle2 className="w-4 h-4 text-black shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-[#22222d]">
            <button
              onClick={() => handleStartShift(true)}
              className="flex-1 py-3.5 rounded-xl bg-[#d4a24c] text-black font-black text-sm hover:bg-[#e9c27a] transition-all shadow-xl shadow-[#d4a24c]/15 flex items-center justify-center gap-2"
            >
              <span>Start Shift & Enter Club OS</span> <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
