import { useState } from 'react';
import { Play, Square } from 'lucide-react';
import { toast } from 'sonner';
import { Shift, ActivityItem } from '../types';
import { Modal, FormField, Input, Select, Textarea, Button } from '../components/Primitives';

interface Props {
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  logActivity: (a: Omit<ActivityItem, 'id' | 'time'>) => void;
}

export default function Shifts({ shifts, setShifts, logActivity }: Props) {
  const [showNew, setShowNew] = useState(false);
  const [viewShift, setViewShift] = useState<Shift | null>(null);

  const activeShift = shifts.find(s => s.status === 'active');
  const todayShifts = shifts.filter(s => new Date(s.date).toDateString() === new Date().toDateString());
  const totalSales = todayShifts.reduce((s, sh) => s + (sh.sales || 0), 0);

  const startShift = (user: string, role: string, notes: string) => {
    if (activeShift) { toast.error('Another shift is active'); return; }
    const newShift: Shift = {
      id: Date.now(),
      user, role,
      date: new Date().toISOString(),
      startTime: new Date().toLocaleTimeString(),
      status: 'active',
      notes,
    };
    setShifts(prev => [newShift, ...prev]);
    logActivity({ type: 'shift', title: `Shift started - ${user}`, subtitle: role, user });
    toast.success(`Shift started for ${user}`);
    setShowNew(false);
  };

  const endShift = (id: number, sales: number) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, endTime: new Date().toLocaleTimeString(), status: 'completed' as const, sales } : s));
    const shift = shifts.find(s => s.id === id);
    logActivity({ type: 'shift', title: `Shift ended - ${shift?.user}`, subtitle: `Sales: N$ ${sales.toLocaleString()}`, user: shift?.user });
    toast.success('Shift ended');
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Shifts</h1>
          <p className="text-sm text-slate-400 mt-1">Track staff shifts and performance</p>
        </div>
        <Button onClick={() => setShowNew(true)} disabled={!!activeShift}><Play className="w-3.5 h-3.5 inline mr-1.5" /> Start Shift</Button>
      </div>

      {activeShift && (
        <div className="glass-card p-5 border-[#d4a24c]/40 bg-gradient-to-r from-[#d4a24c]/5 to-transparent">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d4a24c] text-black flex items-center justify-center font-bold">{activeShift.user[0]}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-emerald-400 text-xs font-semibold">ACTIVE SHIFT</span>
              </div>
              <div className="text-lg font-bold text-white">{activeShift.user} — {activeShift.role}</div>
              <div className="text-xs text-slate-400">Started {activeShift.startTime}</div>
            </div>
            <EndShiftForm shift={activeShift} onEnd={endShift} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase tracking-wider">Today</div><div className="text-xl font-bold text-white mt-1">{todayShifts.length}</div></div>
        <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Sales</div><div className="text-xl font-bold text-[#d4a24c] mt-1">N$ {totalSales.toLocaleString()}</div></div>
        <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase tracking-wider">All Time</div><div className="text-xl font-bold text-white mt-1">{shifts.length}</div></div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Shift History</h3>
        <div className="space-y-2">
          {shifts.filter(s => s !== activeShift).length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-500">No shifts recorded yet</div>
          ) : shifts.filter(s => s !== activeShift).map(s => (
            <div key={s.id} onClick={() => setViewShift(s)} className="glass-card p-4 flex justify-between items-center cursor-pointer hover:border-[#d4a24c]/30">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${s.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#d4a24c]/10 text-[#d4a24c]'}`}>{s.user[0]}</div>
                <div>
                  <div className="text-sm font-medium text-white">{s.user}</div>
                  <div className="text-xs text-slate-400">{s.role} • {new Date(s.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-semibold ${s.status === 'completed' ? 'text-emerald-400' : 'text-[#d4a24c]'}`}>{s.status}</div>
                {s.sales !== undefined && <div className="text-xs text-slate-400">N$ {s.sales.toLocaleString()}</div>}
                <div className="text-[11px] text-slate-500">{s.startTime} {s.endTime && `→ ${s.endTime}`}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Start New Shift">
        <StartShiftForm onStart={startShift} />
      </Modal>

      <Modal open={!!viewShift} onClose={() => setViewShift(null)} title={`${viewShift?.user}'s Shift`}>
        {viewShift && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Role</div><div className="text-white">{viewShift.role}</div></div>
              <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Status</div><div className="text-[#d4a24c]">{viewShift.status}</div></div>
              <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Start</div><div className="text-white">{viewShift.startTime}</div></div>
              <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">End</div><div className="text-white">{viewShift.endTime || '—'}</div></div>
            </div>
            {viewShift.sales !== undefined && <div className="glass-card p-4"><div className="text-[10px] text-slate-500 uppercase mb-1">Sales</div><div className="text-xl font-bold text-[#d4a24c]">N$ {viewShift.sales.toLocaleString()}</div></div>}
            {viewShift.notes && <div className="glass-card p-4"><div className="text-[10px] text-slate-500 uppercase mb-1">Notes</div><div className="text-sm text-slate-300">{viewShift.notes}</div></div>}
          </div>
        )}
      </Modal>
    </div>
  );
}

const ROSTER = [
  { name: 'Peter', role: 'Bartender' },
  { name: 'John', role: 'Bartender' },
  { name: 'Mary', role: 'Bartender' },
  { name: 'Ashley', role: 'Bartender' },
  { name: 'Sarah', role: 'Cashier' },
  { name: 'Pedro', role: 'Manager' },
];

function StartShiftForm({ onStart }: { onStart: (user: string, role: string, notes: string) => void }) {
  const [user, setUser] = useState('Peter');
  const [role, setRole] = useState('Bartender');
  const [notes, setNotes] = useState('Opening bar station 2');
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs text-slate-400 mb-2 block">Quick Staff Select (Active Bartenders)</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {ROSTER.map(r => (
            <button
              key={r.name}
              type="button"
              onClick={() => { setUser(r.name); setRole(r.role); }}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${user === r.name ? 'bg-[#d4a24c] text-black shadow-md shadow-[#d4a24c]/20' : 'bg-[#181820] border border-[#26262d] text-slate-300 hover:text-white'}`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>
      <FormField label="Staff Name"><Input value={user} onChange={(e) => setUser(e.target.value)} placeholder="Enter name..." /></FormField>
      <FormField label="Role">
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Bartender</option><option>Server</option><option>Cashier</option><option>Manager</option><option>Stock Manager</option>
        </Select>
      </FormField>
      <FormField label="Initial Shift Notes"><Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} /></FormField>
      <Button onClick={() => { if (!user) { toast.error('Name required'); return; } onStart(user, role, notes); }} className="w-full">Clock In & Start Shift</Button>
    </div>
  );
}

function EndShiftForm({ shift, onEnd }: { shift: Shift; onEnd: (id: number, sales: number) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [sales, setSales] = useState(18240);
  const [step, setStep] = useState(1);
  const [cashCounted, setCashCounted] = useState(true);
  const [bottlesVerified, setBottlesVerified] = useState(true);
  const [wastageRecorded, setWastageRecorded] = useState(true);

  if (!showModal) return <Button variant="secondary" onClick={() => setShowModal(true)}><Square className="w-3.5 h-3.5 inline mr-1.5" /> End Shift & Reconcile</Button>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 text-left">
      <div className="w-full max-w-md bg-[#121217] border border-[#26262d] rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="border-b border-[#26262d] pb-3">
          <span className="text-xs text-[#d4a24c] font-semibold tracking-wider uppercase">Shift Closing Checklist</span>
          <h3 className="text-lg font-bold text-white mt-1">Reconcile {shift.user}'s Shift</h3>
        </div>

        <div className="space-y-3 text-sm">
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#181820] border border-[#282832] cursor-pointer">
            <input type="checkbox" checked={cashCounted} onChange={() => setCashCounted(!cashCounted)} className="w-4 h-4 accent-[#d4a24c]" />
            <div className="flex-1"><div className="text-white font-medium">1. Count POS Cash Station</div><div className="text-xs text-slate-500">Gross receipt collected: N$ {sales.toLocaleString()}</div></div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#181820] border border-[#282832] cursor-pointer">
            <input type="checkbox" checked={bottlesVerified} onChange={() => setBottlesVerified(!bottlesVerified)} className="w-4 h-4 accent-[#d4a24c]" />
            <div className="flex-1"><div className="text-white font-medium">2. Verify Open Bottles Poured</div><div className="text-xs text-slate-500">42 partial pours recorded in timeline</div></div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-[#181820] border border-[#282832] cursor-pointer">
            <input type="checkbox" checked={wastageRecorded} onChange={() => setWastageRecorded(!wastageRecorded)} className="w-4 h-4 accent-[#d4a24c]" />
            <div className="flex-1"><div className="text-white font-medium">3. Confirm Spillage & Complimentary</div><div className="text-xs text-slate-500">3 complimentary VIP shots logged</div></div>
          </label>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button onClick={() => { onEnd(shift.id, sales); setShowModal(false); }}>Approve Log & Close Shift</Button>
        </div>
      </div>
    </div>
  );
}
