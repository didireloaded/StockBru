import { useState } from 'react';
import { Droplets, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { Bottle, ActivityItem } from '../types';
import { BOTTLE_IMAGES } from '../data/seed';
import { BottleIcon } from '../components/BottleIcon';

function BottleThumb({ bottle, h = 80 }: { bottle: Bottle; h?: number }) {
  const [err, setErr] = useState(false);
  const url = BOTTLE_IMAGES[bottle.id];
  if (url && !err) return <img src={url} alt={bottle.name} onError={() => setErr(true)} className="h-full w-auto object-contain drop-shadow-lg transition-transform duration-300" style={{ maxHeight: h }} />;
  return (
    <div className="w-12 h-12 rounded-lg bg-[#1d1d24] flex items-center justify-center text-[#d4a24c]">
      <BottleIcon bottle={bottle} className="w-8 h-8" />
    </div>
  );
}

interface Props {
  bottles: Bottle[];
  setBottles: React.Dispatch<React.SetStateAction<Bottle[]>>;
  logActivity: (a: Omit<ActivityItem, 'id' | 'time'>) => void;
}

export default function OpenBottles({ bottles, setBottles, logActivity }: Props) {
  const [filter, setFilter] = useState<'all' | 'high' | 'low'>('all');

  const openBottlesList = bottles
    .filter(b => (b.openBottles || 0) > 0)
    .map(b => ({
      bottle: b,
      totalOpen: b.openBottles || 0,
      estimatedVolume: (b.openBottles || 0) * (b.remainingVolume || 500),
      openedDaysAgo: b.lastMovementAt ? Math.floor((Date.now() - new Date(b.lastMovementAt).getTime()) / (1000 * 60 * 60 * 24)) : 0,
    }))
    .sort((a, b) => {
      if (filter === 'high') return b.estimatedVolume - a.estimatedVolume;
      if (filter === 'low') return a.estimatedVolume - b.estimatedVolume;
      return b.bottle.quantity - a.bottle.quantity;
    });

  const totalOpen = openBottlesList.reduce((s, o) => s + o.totalOpen, 0);
  const totalValue = openBottlesList.reduce((s, o) => s + (o.bottle.price * o.totalOpen), 0);
  const oldest = openBottlesList.length > 0 ? Math.max(...openBottlesList.map(o => o.openedDaysAgo)) : 0;

  const handleShotsRecorded = (bottleId: number, shots: number) => {
    const shotVolume = shots * 30; // 30ml per shot
    setBottles(prev => prev.map(b => {
      if (b.id === bottleId) {
        const currentOpen = b.openBottles || 0;
        if (currentOpen === 0) return b;
        const bottleVolume = 700; // avg bottle
        const remaining = Math.max(0, (b.remainingVolume || bottleVolume) - shotVolume);
        const newOpenBottles = remaining === 0 ? currentOpen - 1 : currentOpen;
        return {
          ...b,
          openBottles: newOpenBottles,
          remainingVolume: remaining === 0 ? bottleVolume : remaining,
          lastMovementAt: new Date().toISOString(),
        };
      }
      return b;
    }));
    logActivity({ type: 'adjustment', title: `Recorded ${shots} shots`, subtitle: `${bottles.find(b => b.id === bottleId)?.name}`, user: 'Pedro Manager' });
  };

  const handleCloseBottle = (bottleId: number) => {
    setBottles(prev => prev.map(b => b.id === bottleId ? { ...b, openBottles: Math.max(0, (b.openBottles || 1) - 1), remainingVolume: 700, lastMovementAt: new Date().toISOString() } : b));
    const b = bottles.find(x => x.id === bottleId);
    if (b) {
      logActivity({ type: 'adjustment', title: `Closed ${b.name} bottle`, subtitle: 'Marked as empty', user: 'Pedro Manager' });
      toast.success(`${b.name} bottle closed`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Droplets className="w-7 h-7 text-[#d4a24c]" />
          Open Bottle Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">Track open bottles, volume, and consumption</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-[#d4a24c]" /><div className="text-[11px] text-slate-400 uppercase tracking-wider">Open Bottles</div></div>
          <div className="text-xl font-bold text-white mt-1">{totalOpen}</div>
          <div className="text-xs text-slate-500">Currently opened</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /><div className="text-[11px] text-slate-400 uppercase tracking-wider">Est. Volume</div></div>
          <div className="text-xl font-bold text-white mt-1">{(totalValue / 1000).toFixed(1)}L</div>
          <div className="text-xs text-slate-500">Remaining stock</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#d4a24c]" /><div className="text-[11px] text-slate-400 uppercase tracking-wider">Open Value</div></div>
          <div className="text-xl font-bold text-[#d4a24c] mt-1">N$ {totalValue.toLocaleString()}</div>
          <div className="text-xs text-slate-500">Retail value</div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /><div className="text-[11px] text-slate-400 uppercase tracking-wider">Oldest Open</div></div>
          <div className="text-xl font-bold text-white mt-1">{oldest}d</div>
          <div className="text-xs text-slate-500">Days since opened</div>
        </div>
      </div>

      <div className="flex gap-2">
        {(['all', 'high', 'low'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-[#d4a24c] text-black font-semibold' : 'glass-card text-slate-300'}`}>{f === 'all' ? 'All' : f === 'high' ? 'Most Volume' : 'Least Volume'}</button>
        ))}
      </div>

      {openBottlesList.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Droplets className="w-14 h-14 mx-auto mb-3 text-slate-700" />
          <div className="text-lg font-semibold text-slate-400">No open bottles</div>
          <div className="text-sm text-slate-500 mt-1">Open a bottle from the Smart Fridge to start tracking</div>
        </div>
      ) : (
        <div className="space-y-3">
          {openBottlesList.map(({ bottle, totalOpen, estimatedVolume, openedDaysAgo }) => (
            <div key={bottle.id} className="glass-card p-5">
              <div className="flex items-start gap-4">
                <div className="w-16 h-24 flex items-end justify-center flex-shrink-0"><BottleThumb bottle={bottle} h={90} /></div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-white text-base">{bottle.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{bottle.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{totalOpen}</div>
                      <div className="text-[11px] text-slate-400">open {totalOpen > 1 ? 'bottles' : 'bottle'}</div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-[#0f0f13]">
                      <div className="text-[10px] text-slate-500">Volume Left</div>
                      <div className="text-sm font-bold text-white">{estimatedVolume}ml</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0f0f13]">
                      <div className="text-[10px] text-slate-500">Shots Remaining</div>
                      <div className="text-sm font-bold text-[#d4a24c]">{Math.floor(estimatedVolume / 30)}</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#0f0f13]">
                      <div className="text-[10px] text-slate-500">Days Open</div>
                      <div className={`text-sm font-bold ${openedDaysAgo > 7 ? 'text-red-400' : openedDaysAgo > 3 ? 'text-amber-400' : 'text-emerald-400'}`}>{openedDaysAgo}d</div>
                    </div>
                  </div>

                  {/* Volume bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Bottle fill level</span>
                      <span>{Math.round((estimatedVolume / (700 * totalOpen)) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#1a1a20] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#d4a24c] to-[#e9c27a] rounded-full transition-all" style={{ width: `${Math.min(100, (estimatedVolume / (700 * totalOpen)) * 100)}%` }} />
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-[#1d1d24] pt-2">
                    <span>Opened by: <span className="text-white font-medium">Peter (Shift #4)</span></span>
                    <span>Station: <span className="text-[#d4a24c]">{bottle.location || 'Main Bar'}</span></span>
                  </div>

                  {openedDaysAgo > 7 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Open for {openedDaysAgo} days — consider discarding</span>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <button onClick={() => handleShotsRecorded(bottle.id, 1)} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 font-medium">−1 Shot</button>
                    <button onClick={() => handleShotsRecorded(bottle.id, 5)} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 font-medium">−5 Shots</button>
                    <button onClick={() => handleCloseBottle(bottle.id)} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 font-medium ml-auto">Close Bottle</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { toast } from 'sonner';
