import { useState } from 'react';
import { 
  Calendar, Clock, Users, DollarSign, Package, AlertTriangle, 
  Droplets, TrendingUp, CheckCircle2, MapPin, Plus, Eye, 
  ExternalLink, BarChart3, ChevronRight, Activity
} from 'lucide-react';
import { Bottle, Sale, InventoryMovement } from '../types';
import { Button, Modal } from '../components/Primitives';
import { toast } from 'sonner';

interface Props {
  bottles: Bottle[];
  sales: Sale[];
  movements: InventoryMovement[];
}

interface ClubEvent {
  id: string;
  name: string;
  date: string;
  openTime: string;
  closeTime: string;
  status: 'Live 🟢' | 'Scheduled ⏳' | 'Closed 🏁';
  staffCount: number;
  workAreas: string[];
  notes: string;
  revenue: number;
}

const SEED_EVENTS: ClubEvent[] = [
  {
    id: 'ev_1',
    name: 'Friday Night Sessions (Mega Reggae)',
    date: 'Today, 27 June',
    openTime: '20:00',
    closeTime: '04:00',
    status: 'Live 🟢',
    staffCount: 6,
    workAreas: ['Main Bar', 'VIP Bar', 'Entrance Cashier'],
    notes: 'Primary weekend DJ lineup. Massive cider velocity anticipated.',
    revenue: 24850.00,
  },
  {
    id: 'ev_2',
    name: 'Saturday Exclusive VIP Launch',
    date: 'Sat, 28 June',
    openTime: '21:00',
    closeTime: '05:00',
    status: 'Scheduled ⏳',
    staffCount: 8,
    workAreas: ['Main Bar', 'VIP Bar', 'Rooftop Bar', 'Lounge Bar'],
    notes: 'Guestlist VIP bottle service priority. Don Julio & Moet reserved.',
    revenue: 0.00,
  },
  {
    id: 'ev_3',
    name: 'Sunday Sunset Rooftop Lounge',
    date: 'Sun, 29 June',
    openTime: '15:00',
    closeTime: '23:00',
    status: 'Scheduled ⏳',
    staffCount: 4,
    workAreas: ['Rooftop Bar', 'Entrance Cashier'],
    notes: 'Cocktail specials and gin buckets.',
    revenue: 0.00,
  },
];

export default function Events({ bottles, sales }: Props) {
  const [events, setEvents] = useState<ClubEvent[]>(SEED_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<ClubEvent | null>(SEED_EVENTS[0]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', date: '', openTime: '20:00', closeTime: '04:00', notes: '' });

  // Computed event metrics
  const criticalCount = bottles.filter(b => b.status === 'Critical' || b.status === 'Out of Stock').length;
  const lowCount = bottles.filter(b => b.status === 'Low').length;
  const openBottlesCount = bottles.filter(b => (b.openBottles || 0) > 0).length;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.name) return;
    const created: ClubEvent = {
      id: `ev_${Date.now()}`,
      name: newEvent.name,
      date: newEvent.date || 'Upcoming',
      openTime: newEvent.openTime,
      closeTime: newEvent.closeTime,
      status: 'Scheduled ⏳',
      staffCount: 4,
      workAreas: ['Main Bar', 'VIP Bar'],
      notes: newEvent.notes,
      revenue: 0,
    };
    setEvents([created, ...events]);
    setShowCreateModal(false);
    toast.success(`Event scheduled: ${created.name}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262630] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#d4a24c] flex items-center justify-center text-black font-black shadow-lg shadow-[#d4a24c]/20">
              <Calendar className="w-5 h-5 stroke-[2.5]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Nightclub Events Hub</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Master operational containers linking staff shifts, bar stations, live receipts N$ & inventory depletion
          </p>
        </div>

        <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-1.5 shrink-0 font-bold">
          <Plus className="w-4 h-4 stroke-[3]" /> Schedule Club Event
        </Button>
      </div>

      {/* EVENTS MASTER LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {events.map(ev => (
          <div
            key={ev.id}
            onClick={() => setSelectedEvent(ev)}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between glass-card ${selectedEvent?.id === ev.id ? 'border-[#d4a24c] bg-[#16161f] shadow-[0_0_25px_rgba(212,162,76,0.15)] ring-1 ring-[#d4a24c]' : 'border-[#22222d] bg-[#0e0e13] hover:border-slate-600'}`}
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-start gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#22222e] text-[#d4a24c] font-bold">
                  {ev.status}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#d4a24c]" /> {ev.openTime} – {ev.closeTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{ev.name}</h3>
              <p className="text-xs text-slate-400 font-medium">{ev.date}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#1e1e28] flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-blue-400" /> {ev.staffCount} Staff Roster
              </span>
              <span className="font-mono font-bold text-emerald-400">
                N$ {ev.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* EVENT OPERATIONAL DASHBOARD CONTAINER */}
      {selectedEvent && (
        <div className="glass-card p-6 rounded-3xl border border-[#262632] bg-[#0e0e14] space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#22222e] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#d4a24c] uppercase tracking-wider">
                  ACTIVE EVENT CONTAINER
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-sm font-extrabold text-white">{selectedEvent.name}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{selectedEvent.notes}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-500">Event Bar Receipts</div>
                <div className="text-xl font-black text-emerald-400 font-mono">
                  N$ {selectedEvent.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <Button variant="secondary" className="text-xs">
                <BarChart3 className="w-3.5 h-3.5 mr-1 text-[#d4a24c]" /> Event Audit Report
              </Button>
            </div>
          </div>

          {/* Event Live Scorecard Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-[#14141a] border border-[#22222c]">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" /> Bartender Shifts
              </span>
              <span className="text-2xl font-black text-white mt-1 block font-mono">{selectedEvent.staffCount} Active</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">100% clocked in</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#14141a] border border-[#22222c]">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Droplets className="w-3 h-3 text-blue-400" /> Open Bottles Active
              </span>
              <span className="text-2xl font-black text-blue-400 mt-1 block font-mono">{openBottlesCount} Pours</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">ml decay traceable</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#14141a] border border-[#22222c]">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-400" /> Critical Risks
              </span>
              <span className="text-2xl font-black text-red-400 mt-1 block font-mono">{criticalCount} SKUs</span>
              <span className="text-[10px] text-red-400/80 block mt-0.5">Immediate storeroom jump</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#14141a] border border-[#22222c]">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Stock Health
              </span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block font-mono">94%</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Optimal buffer reserves</span>
            </div>
          </div>

          {/* Assigned Work Areas Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#d4a24c]" /> Assigned Work Areas (Bar Stations)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {selectedEvent.workAreas.map(wa => (
                <div key={wa} className="p-3.5 rounded-xl bg-[#121218] border border-[#20202a] flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{wa}</span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    POS Active 🟢
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Selling Products for Event */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Event Top Selling Products (Live Velocity)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#121218] border border-[#20202a]">
                <div className="text-slate-400">1. Savanna Dry Cider</div>
                <div className="text-white font-bold text-sm mt-0.5">42 Units • N$ 1,890</div>
              </div>
              <div className="p-3 rounded-xl bg-[#121218] border border-[#20202a]">
                <div className="text-slate-400">2. Ciroc Original Vodka</div>
                <div className="text-white font-bold text-sm mt-0.5">18 Units • N$ 8,100</div>
              </div>
              <div className="p-3 rounded-xl bg-[#121218] border border-[#20202a]">
                <div className="text-slate-400">3. Don Julio Reposado</div>
                <div className="text-white font-bold text-sm mt-0.5">12 Shots • N$ 960</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE EVENT MODAL */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Schedule Nightclub Event" subtitle="Provision container for shifts, sales & stock tracking">
        <form onSubmit={handleCreate} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Event Name</label>
            <input required value={newEvent.name} onChange={e => setNewEvent({ ...newEvent, name: e.target.value })} placeholder="e.g. Saturday Mega Reggae Sessions" className="w-full px-4 py-2.5 rounded-xl bg-[#141419] border border-[#262632] text-white" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Date</label>
              <input value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} placeholder="e.g. Sat, 28 June" className="w-full px-3 py-2 rounded-xl bg-[#141419] border border-[#262632] text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Open Time</label>
              <input value={newEvent.openTime} onChange={e => setNewEvent({ ...newEvent, openTime: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[#141419] border border-[#262632] text-white font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Close Time</label>
              <input value={newEvent.closeTime} onChange={e => setNewEvent({ ...newEvent, closeTime: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-[#141419] border border-[#262632] text-white font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Operational Notes</label>
            <textarea value={newEvent.notes} onChange={e => setNewEvent({ ...newEvent, notes: e.target.value })} placeholder="e.g. VIP guestlist priority, extra tequila stock needed" rows={3} className="w-full px-4 py-2 rounded-xl bg-[#141419] border border-[#262632] text-white text-xs" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button type="submit">Provision Event Container</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
