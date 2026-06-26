import { useState } from 'react';
import { Camera, Clock, ArrowLeftRight, Package, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Bottle, InventorySnapshot, InventoryMovement, InventoryTransfer, ActivityItem } from '../types';
import { Modal, Button } from '../components/Primitives';
import { createSnapshot, compareSnapshots } from '../services/inventory.service';

interface Props {
  bottles: Bottle[];
  setBottles: React.Dispatch<React.SetStateAction<Bottle[]>>;
  snapshots: InventorySnapshot[];
  setSnapshots: React.Dispatch<React.SetStateAction<InventorySnapshot[]>>;
  movements: InventoryMovement[];
  setMovements: React.Dispatch<React.SetStateAction<InventoryMovement[]>>;
  transfers: InventoryTransfer[];
  setTransfers: React.Dispatch<React.SetStateAction<InventoryTransfer[]>>;
  logActivity: (a: Omit<ActivityItem, 'id' | 'time'>) => void;
}

export default function Snapshots({ bottles, setBottles, snapshots, setSnapshots, movements, setMovements, transfers, setTransfers, logActivity }: Props) {
  const [tab, setTab] = useState<'snapshots' | 'timeline' | 'transfers'>('snapshots');
  const [showNew, setShowNew] = useState(false);
  const [compareA, setCompareA] = useState<number | null>(null);
  const [compareB, setCompareB] = useState<number | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);

  const takeSnapshot = (scope: 'full' | 'location' | 'category', filter?: string) => {
    const snap = createSnapshot(bottles, scope, filter, 'Pedro Manager');
    setSnapshots(prev => [snap, ...prev]);
    logActivity({ type: 'snapshot', title: `Snapshot: ${snap.name}`, subtitle: `${snap.totalItems} items`, user: 'Pedro Manager' });
    toast.success('Snapshot captured');
    setShowNew(false);
  };

  const deleteSnapshot = (id: number) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
    toast.success('Snapshot deleted');
  };

  const performTransfer = (bottleId: number, from: string, to: string, _qty: number) => {
    const b = bottles.find(x => x.id === bottleId);
    if (!b) return;
    const moveQty = b.quantity;
    setBottles(prev => prev.map(x => x.id === bottleId ? { ...x, location: to as any, lastMovementAt: new Date().toISOString() } : x));
    const t: InventoryTransfer = { id: Date.now(), timestamp: new Date().toISOString(), bottleId, bottleName: b.name, qty: moveQty, fromLocation: from, toLocation: to, user: 'Pedro Manager' };
    setTransfers(prev => [t, ...prev]);
    const m: InventoryMovement = { id: Date.now() + 1, timestamp: new Date().toISOString(), type: 'transferred', bottleId, bottleName: b.name, sku: b.sku, qty: moveQty, fromLocation: from, toLocation: to, user: 'Pedro Manager' };
    setMovements(prev => [m, ...prev]);
    logActivity({ type: 'transfer', title: `Moved ${moveQty} × ${b.name}`, subtitle: `${from} → ${to}`, user: 'Pedro Manager' });
    toast.success('Location updated for this SKU');
    setShowTransfer(false);
  };

  const snapA = compareA ? snapshots.find(s => s.id === compareA) : undefined;
  const snapB = compareB ? snapshots.find(s => s.id === compareB) : undefined;
  const comparison = snapA && snapB ? compareSnapshots(snapA, snapB) : null;

  const categories = ['Spirits', 'Beer', 'Wine & Champagne', 'Mixers & Others', 'Non-Alcoholic'];
  const locations = ['Main Fridge', 'VIP Fridge', 'Storeroom', 'Cold Room', 'Display Shelf', 'Main Bar'];

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inventory Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Snapshots, timeline & transfers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowTransfer(true)}><ArrowLeftRight className="w-3.5 h-3.5 inline mr-1.5" /> Transfer</Button>
          <Button onClick={() => setShowNew(true)}><Camera className="w-3.5 h-3.5 inline mr-1.5" /> Take Snapshot</Button>
        </div>
      </div>

      <div className="flex gap-2">
        {(['snapshots', 'timeline', 'transfers'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm capitalize ${tab === t ? 'bg-[#d4a24c] text-black font-semibold' : 'glass-card text-slate-300'}`}>{t}</button>
        ))}
      </div>

      {tab === 'snapshots' && (
        <div className="space-y-3">
          {snapshots.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <Camera className="w-14 h-14 mx-auto mb-3 text-slate-700" />
              <div className="text-lg font-semibold text-slate-400">No snapshots yet</div>
              <div className="text-sm text-slate-500 mt-1">Capture inventory state to track changes over time</div>
              <div className="mt-4"><Button onClick={() => setShowNew(true)}>Take First Snapshot</Button></div>
            </div>
          ) : (
            <>
              {snapshots.map(s => (
                <div key={s.id} className="glass-card p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-white">{s.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{new Date(s.timestamp).toLocaleString()}</div>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#d4a24c]/10 text-[#d4a24c]">{s.scope}</span>
                        {s.location && <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">{s.location}</span>}
                        {s.category && <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400">{s.category}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#d4a24c]">N$ {s.totalValue.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">{s.totalItems} units</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => setCompareA(s.id)} className={`px-3 py-1.5 rounded text-xs ${compareA === s.id ? 'bg-[#d4a24c] text-black font-semibold' : 'bg-[#1a1a20] text-slate-300'}`}>Compare A</button>
                    <button onClick={() => setCompareB(s.id)} className={`px-3 py-1.5 rounded text-xs ${compareB === s.id ? 'bg-[#d4a24c] text-black font-semibold' : 'bg-[#1a1a20] text-slate-300'}`}>Compare B</button>
                    <button onClick={() => deleteSnapshot(s.id)} className="px-3 py-1.5 rounded bg-red-500/10 text-red-400 text-xs ml-auto">Delete</button>
                  </div>
                </div>
              ))}

              {comparison && (
                <div className="glass-card p-5 border-[#d4a24c]/40">
                  <h3 className="font-semibold text-white mb-3">Comparison Results</h3>
                  {comparison.changed.length === 0 ? (
                    <div className="text-sm text-emerald-400">✓ No changes between snapshots</div>
                  ) : (
                    <div className="space-y-1.5">
                      {comparison.changed.map(c => {
                        const b = bottles.find(x => x.id === c.bottleId);
                        return (
                          <div key={c.bottleId} className="flex justify-between items-center p-2 rounded bg-[#0f0f13] text-sm">
                            <span className="text-white">{b?.name}</span>
                            <span className="text-slate-500">{c.before} → {c.after}</span>
                            <span className={`font-bold ${c.diff > 0 ? 'text-emerald-400' : 'text-red-500'}`}>{c.diff > 0 ? '+' : ''}{c.diff}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === 'timeline' && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-[#d4a24c]" /> Inventory Timeline</h3>
          {movements.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No movements yet</div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {movements.map(m => (
                <div key={m.id} className="flex items-start gap-3 pb-3 border-b border-[#26262d] last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.type === 'sold' ? 'bg-emerald-500/10 text-emerald-400' : m.type === 'received' ? 'bg-blue-500/10 text-blue-400' : m.type === 'opened_bottle' ? 'bg-[#d4a24c]/10 text-[#d4a24c]' : m.type === 'transferred' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-500/10 text-slate-400'}`}>
                    {m.type === 'sold' ? <TrendingUp className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">{m.bottleName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{m.type.toUpperCase()} × {m.qty} {m.fromLocation ? `• ${m.fromLocation} → ${m.toLocation}` : ''}</div>
                  </div>
                  <div className="text-xs text-slate-500 whitespace-nowrap">{new Date(m.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'transfers' && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Transfer History</h3>
          {transfers.length === 0 ? (
            <div className="text-center text-slate-500 py-8">No transfers yet</div>
          ) : (
            <div className="space-y-2">
              {transfers.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 rounded-lg bg-[#0f0f13]">
                  <div>
                    <div className="text-sm font-medium text-white">{t.bottleName}</div>
                    <div className="text-xs text-slate-500">{t.fromLocation} → {t.toLocation}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#d4a24c]">{t.qty} units</div>
                    <div className="text-xs text-slate-500">{new Date(t.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Snapshot Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Take Snapshot">
        <div className="space-y-3">
          <Button onClick={() => takeSnapshot('full')} className="w-full">Full Inventory ({bottles.length} items)</Button>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-4">By Category</div>
          {categories.map(c => (
            <button key={c} onClick={() => takeSnapshot('category', c)} className="w-full glass-card p-3 text-left hover:border-[#d4a24c]/30 text-sm text-white">{c} ({bottles.filter(b => b.category === c).length})</button>
          ))}
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-4">By Location</div>
          {locations.map(l => (
            <button key={l} onClick={() => takeSnapshot('location', l)} className="w-full glass-card p-3 text-left hover:border-[#d4a24c]/30 text-sm text-white">{l} ({bottles.filter(b => b.location === l).length})</button>
          ))}
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal open={showTransfer} onClose={() => setShowTransfer(false)} title="Transfer Stock">
        <TransferForm bottles={bottles} onTransfer={performTransfer} />
      </Modal>
    </div>
  );
}

function TransferForm({ bottles, onTransfer }: { bottles: Bottle[]; onTransfer: (bottleId: number, from: string, to: string, qty: number) => void }) {
  const [bottleId, setBottleId] = useState(0);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [qty, setQty] = useState(1);
  const locations = ['Main Fridge', 'VIP Fridge', 'Storeroom', 'Cold Room', 'Display Shelf', 'Main Bar'];
  const bottle = bottles.find(b => b.id === bottleId);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[11px] uppercase text-slate-400 mb-1.5">Product</label>
        <select value={bottleId} onChange={(e) => { const id = parseInt(e.target.value); setBottleId(id); const b = bottles.find(x => x.id === id); if (b) setFrom(b.location || ''); }} className="w-full px-3 py-2 rounded-lg bg-[#0f0f13] border border-[#26262d] text-sm text-white">
          <option value={0}>Select...</option>
          {bottles.map(b => <option key={b.id} value={b.id}>{b.name} ({b.quantity})</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-[11px] uppercase text-slate-400 mb-1.5">From</label><input value={from} disabled className="w-full px-3 py-2 rounded-lg bg-[#0f0f13] border border-[#26262d] text-sm text-slate-500" /></div>
        <div><label className="block text-[11px] uppercase text-slate-400 mb-1.5">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-[#0f0f13] border border-[#26262d] text-sm text-white">
            <option value="">Select...</option>
            {locations.filter(l => l !== from).map(l => <option>{l}</option>)}
          </select>
        </div>
      </div>
      <div><label className="block text-[11px] uppercase text-slate-400 mb-1.5">Quantity</label><input type="number" min={1} max={bottle?.quantity || 1} value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 rounded-lg bg-[#0f0f13] border border-[#26262d] text-sm text-white" /></div>
      <Button onClick={() => { if (bottleId && to && from !== to) onTransfer(bottleId, from, to, qty); }} className="w-full">Transfer Stock</Button>
    </div>
  );
}
