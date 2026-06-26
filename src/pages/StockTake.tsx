import { useState } from 'react';
import { Plus, CheckCircle2, Clock, Play, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Bottle, Stocktake, ActivityItem } from '../types';
import { Modal, FormField, Input, Select, Button } from '../components/Primitives';
import { calculateBottleStatus } from '../services/inventory.service';
import { BottleIcon } from '../components/BottleIcon';

interface Props {
  bottles: Bottle[];
  setBottles: React.Dispatch<React.SetStateAction<Bottle[]>>;
  stocktakes: Stocktake[];
  setStocktakes: React.Dispatch<React.SetStateAction<Stocktake[]>>;
  logActivity: (a: Omit<ActivityItem, 'id' | 'time'>) => void;
}

export default function StockTake({ bottles, setBottles, stocktakes, setStocktakes, logActivity }: Props) {
  const [showNew, setShowNew] = useState(false);
  const [activeTake, setActiveTake] = useState<Stocktake | null>(null);

  const totalStocktakes = stocktakes.length;
  const completed = stocktakes.filter(s => s.status === 'completed').length;
  const inProgress = stocktakes.filter(s => s.status === 'in_progress').length;

  const startStocktake = (location: string, scope: 'all' | 'critical' | 'category', category: string) => {
    let items: Bottle[] = bottles;
    if (scope === 'critical') items = bottles.filter(b => b.status === 'Critical' || b.status === 'Low');
    if (scope === 'category') items = bottles.filter(b => b.category === category);
    
    const newTake: Stocktake = {
      id: Date.now(),
      date: new Date().toISOString(),
      location,
      items: items.map(b => ({ bottleId: b.id, expected: b.quantity })),
      status: 'in_progress',
      user: 'Pedro Manager',
    };
    setStocktakes(prev => [newTake, ...prev]);
    setActiveTake(newTake);
    setShowNew(false);
    logActivity({ type: 'stocktake', title: `Stock take started - ${location}`, subtitle: `${items.length} items`, user: 'Pedro Manager' });
    toast.success(`Stock take started at ${location}`);
  };

  const updateCount = (bottleId: number, actual: number) => {
    if (!activeTake) return;
    setStocktakes(prev => prev.map(t => {
      if (t.id === activeTake.id) {
        return { ...t, items: t.items.map(i => i.bottleId === bottleId ? { ...i, actual, variance: actual - i.expected } : i) };
      }
      return t;
    }));
  };

  const completeStocktake = () => {
    if (!activeTake) return;
    const incomplete = activeTake.items.filter(i => i.actual === undefined);
    if (incomplete.length > 0) { toast.error(`Complete all ${incomplete.length} items first`); return; }
    
    // Apply adjustments to bottles
    setStocktakes(prev => prev.map(t => t.id === activeTake.id ? { ...t, status: 'completed' } : t));
    
    setBottles(prev => prev.map(b => {
      const item = activeTake.items.find(i => i.bottleId === b.id);
      if (item && item.actual !== undefined) {
        const diff = item.actual - b.quantity;
        if (diff !== 0) {
          const updated = { ...b, quantity: item.actual };
          return { ...updated, status: calculateBottleStatus(updated) };
        }
      }
      return b;
    }));

    const variances = activeTake.items.filter(i => i.variance && i.variance !== 0).length;
    logActivity({
      type: 'stocktake',
      title: `Stock take completed - ${activeTake.location}`,
      subtitle: `${variances} variances found`,
      user: 'Pedro Manager',
    });
    toast.success(`Stock take completed! ${variances} variances found.`);
    setActiveTake(null);
  };

  const discardStocktake = () => {
    if (!activeTake) return;
    setStocktakes(prev => prev.filter(t => t.id !== activeTake.id));
    setActiveTake(null);
    toast.info('Stock take discarded');
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Stock Take</h1>
          <p className="text-sm text-slate-400 mt-1">Physical inventory counting and variance tracking</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="w-3.5 h-3.5 inline mr-1.5" /> Start New Stock Take</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Completed</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">{completed}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">In Progress</div>
          <div className="text-xl font-bold text-[#d4a24c] mt-1">{inProgress}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total</div>
          <div className="text-xl font-bold text-white mt-1">{totalStocktakes}</div>
        </div>
      </div>

      {/* Active Stock Take */}
      {activeTake && (
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{activeTake.location} — Active</h3>
              <p className="text-xs text-slate-400">{activeTake.items.length} items to count</p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={discardStocktake}><RotateCcw className="w-3.5 h-3.5 inline mr-1.5" /> Discard</Button>
              <Button onClick={completeStocktake}><CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5" /> Complete</Button>
            </div>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
            {activeTake.items.map(item => {
              const bottle = bottles.find(b => b.id === item.bottleId);
              const isVariance = item.actual !== undefined && item.actual !== item.expected;
              return (
                <div key={item.bottleId} className={`flex items-center gap-4 p-3 rounded-lg border ${isVariance ? 'border-red-900/40 bg-red-950/20' : 'border-[#26262d]'}`}>
                  <div className="w-8 h-8 rounded-lg bg-[#1a1a20] flex items-center justify-center">
                    {bottle && <BottleIcon bottle={bottle} className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white font-medium truncate">{bottle?.name}</div>
                    <div className="text-xs text-slate-500">{bottle?.sku}</div>
                  </div>
                  <div className="text-xs text-slate-400">
                    Expected: <span className="text-white font-semibold">{item.expected}</span>
                  </div>
                  <div className="w-20">
                    <input 
                      type="number"
                      value={item.actual ?? ''}
                      onChange={(e) => updateCount(item.bottleId, parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full px-2 py-1.5 rounded bg-[#0f0f13] border border-[#26262d] text-sm text-white text-center focus:outline-none focus:border-[#d4a24c]/50"
                    />
                  </div>
                  {item.variance !== undefined && (
                    <div className={`w-16 text-right text-sm font-bold ${item.variance > 0 ? 'text-emerald-400' : item.variance < 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      {item.variance > 0 ? '+' : ''}{item.variance}
                    </div>
                  )}
                  {item.variance === undefined && <div className="w-16" />}
                </div>
              );
            })}
          </div>

          {activeTake.items.every(i => i.actual !== undefined) && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-900/30 text-sm text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              All items counted! You can now complete this stock take.
            </div>
          )}
        </div>
      )}

      {/* History */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Stock Take History</h3>
        <div className="space-y-2">
          {stocktakes.filter(s => s !== activeTake).length === 0 ? (
            <div className="glass-card p-8 text-center text-sm text-slate-500">No stock takes recorded yet</div>
          ) : stocktakes.filter(s => s !== activeTake).map(t => {
            const completed_count = t.items.filter(i => i.actual !== undefined).length;
            const variances = t.items.filter(i => i.variance && i.variance !== 0).length;
            return (
              <div key={t.id} className="glass-card p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#d4a24c]/10 text-[#d4a24c]'}`}>
                      {t.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm text-white font-medium">{t.location}</div>
                      <div className="text-xs text-slate-400">{new Date(t.date).toLocaleString()} • by {t.user}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">{completed_count}/{t.items.length} counted</div>
                    <div className={`text-xs font-semibold ${variances > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{variances} variances</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Start Stock Take" subtitle="Select scope and location">
        <StocktakeWizard onStart={startStocktake} bottles={bottles} />
      </Modal>
    </div>
  );
}

function StocktakeWizard({ onStart, bottles }: { onStart: (loc: string, scope: 'all' | 'critical' | 'category', cat: string) => void; bottles: Bottle[] }) {
  const [location, setLocation] = useState('Main Bar');
  const [scope, setScope] = useState<'all' | 'critical' | 'category'>('all');
  const [category, setCategory] = useState('Spirits');
  const cats = Array.from(new Set(bottles.map(b => b.category)));

  const count = scope === 'all' ? bottles.length : scope === 'critical' ? bottles.filter(b => b.status !== 'Normal').length : bottles.filter(b => b.category === category).length;

  return (
    <div className="space-y-4">
      <FormField label="Location"><Input value={location} onChange={(e) => setLocation(e.target.value)} /></FormField>
      <FormField label="Scope">
        <Select value={scope} onChange={(e) => setScope(e.target.value as any)}>
          <option value="all">All Products ({bottles.length})</option>
          <option value="critical">Low & Critical Stock ({bottles.filter(b => b.status !== 'Normal').length})</option>
          <option value="category">By Category</option>
        </Select>
      </FormField>
      {scope === 'category' && (
        <FormField label="Category">
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            {cats.map(c => <option key={c}>{c}</option>)}
          </Select>
        </FormField>
      )}
      <div className="p-3 rounded-lg bg-[#d4a24c]/10 border border-[#d4a24c]/30 text-sm text-[#e9c27a]">
        <Play className="w-4 h-4 inline mr-2" />
        {count} items will be included in this stock take
      </div>
      <Button onClick={() => onStart(location, scope, category)} className="w-full">Start Stock Take</Button>
    </div>
  );
}
