import { useState } from 'react';
import { ArrowLeft, Edit3, Star, MapPin, Tag, Calendar, Package, TrendingUp, MessageSquare, Plus, Minus, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import { Bottle, BottleStatus, InventoryMovement, ActivityItem } from '../types';
import { BOTTLE_IMAGES } from '../data/seed';
import { Modal, FormField, Input, Select, Textarea, Button } from '../components/Primitives';
import { calculateBottleStatus, calculateProductScore, calculateDailyVelocity } from '../services/inventory.service';
import { BottleIcon } from '../components/BottleIcon';

function BottleHero({ bottle }: { bottle: Bottle }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = BOTTLE_IMAGES[bottle.id];
  return (
    <div className="w-32 h-48 flex-shrink-0 flex items-end justify-center relative">
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#d4a24c]/10 to-transparent blur-xl rounded-b-full" />
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={bottle.name}
          onError={() => setImgError(true)}
          className="relative z-10 h-full w-auto object-contain drop-shadow-2xl transition-transform duration-300"
        />
      ) : (
        <div className="relative z-10 w-24 h-full rounded-t-lg rounded-b-sm bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-xl flex items-end justify-center pb-4">
          <BottleIcon bottle={bottle} className="w-12 h-12 text-[#d4a24c]" />
        </div>
      )}
    </div>
  );
}

const statusStyles: Record<BottleStatus, { dot: string; text: string; bg: string }> = {
  Normal:   { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-900/30' },
  Low:      { dot: 'bg-amber-400',   text: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-900/30' },
  Critical: { dot: 'bg-red-500',     text: 'text-red-500',     bg: 'bg-red-500/10 border-red-900/30' },
  'Out of Stock': { dot: 'bg-slate-600', text: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-900/30' },
  Overstocked: { dot: 'bg-purple-500', text: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-900/30' },
};

interface Props {
  bottleId: number | null;
  bottles: Bottle[];
  setBottles: React.Dispatch<React.SetStateAction<Bottle[]>>;
  movements: InventoryMovement[];
  setMovements: React.Dispatch<React.SetStateAction<InventoryMovement[]>>;
  logActivity: (a: Omit<ActivityItem, 'id' | 'time'>) => void;
  suppliers: { id: number; name: string }[];
  onBack: () => void;
}

export default function ProductDetail({ bottleId, bottles, setBottles, movements, setMovements, logActivity, suppliers, onBack }: Props) {
  const bottle = bottles.find(b => b.id === bottleId);
  const [editing, setEditing] = useState(false);
  const [noteText, setNoteText] = useState(bottle?.notes || '');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTo, setTransferTo] = useState<string>('');
  const [transferQty, setTransferQty] = useState(1);

  if (!bottle) {
    return (
      <div className="glass-card p-12 text-center text-slate-500">
        <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
        Product not found
        <div className="mt-4"><Button onClick={onBack}>Back to Inventory</Button></div>
      </div>
    );
  }

  const bottleMovements = movements.filter(m => m.bottleId === bottle.id);
  const score = calculateProductScore(bottle, movements);
  const velocity = calculateDailyVelocity(bottle, movements);
  const supplier = suppliers.find(s => s.id === bottle.supplierId);
  const daysSinceMovement = bottle.lastMovementAt ? Math.floor((Date.now() - new Date(bottle.lastMovementAt).getTime()) / (1000 * 60 * 60 * 24)) : null;
  const expiryDays = bottle.expiryDate ? Math.ceil((new Date(bottle.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  const handleQuickAction = (type: 'IN' | 'OUT' | 'OPEN' | 'ADJUST') => {
    setBottles(prev => prev.map(b => {
      if (b.id === bottle.id) {
        const copy = { ...b };
        if (type === 'IN') { copy.quantity += 1; copy.lastMovementAt = new Date().toISOString(); }
        if (type === 'OUT') { if (copy.quantity > 0) { copy.quantity -= 1; copy.lastMovementAt = new Date().toISOString(); } else { toast.error('Out of stock'); return b; } }
        if (type === 'OPEN') { if (copy.quantity > 0) { copy.quantity -= 1; copy.openBottles = (copy.openBottles || 0) + 1; copy.lastMovementAt = new Date().toISOString(); } else { toast.error('No bottles'); return b; } }
        copy.status = calculateBottleStatus(copy);
        return copy;
      }
      return b;
    }));
    const newMovement: InventoryMovement = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: type === 'IN' ? 'received' : type === 'OUT' ? 'sold' : type === 'OPEN' ? 'opened_bottle' : 'adjusted',
      bottleId: bottle.id,
      bottleName: bottle.name,
      sku: bottle.sku,
      qty: 1,
      user: 'Pedro Manager',
    };
    setMovements(prev => [newMovement, ...prev]);
    logActivity({ type: 'adjustment', title: `${type === 'IN' ? 'Restocked' : type === 'OPEN' ? 'Opened' : 'Sold'} 1 × ${bottle.name}`, subtitle: 'Quick action', user: 'Pedro Manager' });
    toast.success(`${bottle.name} updated`);
  };

  const saveNote = () => {
    setBottles(prev => prev.map(b => b.id === bottle.id ? { ...b, notes: noteText } : b));
    toast.success('Note saved');
    setShowNoteModal(false);
  };

  const toggleFavorite = () => {
    setBottles(prev => prev.map(b => b.id === bottle.id ? { ...b, favorite: !b.favorite } : b));
    toast.success(bottle.favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const performTransfer = () => {
    if (!transferTo || transferTo === bottle.location) { toast.error('Invalid destination'); return; }
    const moveQty = bottle.quantity;
    setBottles(prev => prev.map(b => b.id === bottle.id ? { ...b, location: transferTo as any, lastMovementAt: new Date().toISOString() } : b));
    const newMovement: InventoryMovement = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type: 'transferred',
      bottleId: bottle.id,
      bottleName: bottle.name,
      sku: bottle.sku,
      qty: moveQty,
      fromLocation: bottle.location,
      toLocation: transferTo,
      user: 'Pedro Manager',
    };
    setMovements(prev => [newMovement, ...prev]);
    logActivity({ type: 'transfer', title: `Moved ${moveQty} × ${bottle.name}`, subtitle: `${bottle.location} → ${transferTo}`, user: 'Pedro Manager' });
    toast.success(`Location updated to ${transferTo}`);
    setShowTransferModal(false);
  };

  const updateTag = (tag: string) => {
    setBottles(prev => prev.map(b => {
      if (b.id === bottle.id) {
        const tags = b.tags || [];
        return { ...b, tags: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag] };
      }
      return b;
    }));
  };

  const availableTags = ['VIP', 'Fast Seller', 'Slow Seller', 'Premium', 'Imported', 'Local', 'Mixer', 'Fresh', 'Perishable', 'Ultra Premium', 'Promotion'];
  const locations = ['Main Fridge', 'VIP Fridge', 'Storeroom', 'Cold Room', 'Display Shelf', 'Main Bar'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-[#1a1a20] text-slate-400"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{bottle.name}</h1>
          <p className="text-sm text-slate-400 font-mono">{bottle.sku}</p>
        </div>
        <button onClick={toggleFavorite} className={`ml-auto p-2 rounded-lg ${bottle.favorite ? 'bg-[#d4a24c]/20 text-[#d4a24c]' : 'hover:bg-[#1a1a20] text-slate-400'}`}>
          <Star className={`w-5 h-5 ${bottle.favorite ? 'fill-current' : ''}`} />
        </button>
        <button onClick={() => setEditing(true)} className="p-2 rounded-lg hover:bg-[#1a1a20] text-slate-400"><Edit3 className="w-5 h-5" /></button>
      </div>

      {/* Product Hero */}
      <div className="glass-card p-6">
        <div className="flex gap-6">
          <BottleHero bottle={bottle} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border ${statusStyles[bottle.status].bg} ${statusStyles[bottle.status].text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[bottle.status].dot}`} />{bottle.status.toUpperCase()}
              </span>
              <span className="text-xs text-slate-400 px-2 py-1 rounded bg-[#1a1a20]">{bottle.category}</span>
              {bottle.location && <span className="text-xs text-slate-400 px-2 py-1 rounded bg-[#1a1a20] flex items-center gap-1"><MapPin className="w-3 h-3" />{bottle.location}</span>}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
              <MetricCard label="Current Stock" value={bottle.quantity.toString()} sub={`${bottle.reorderLevel} min`} color={bottle.status === 'Critical' ? 'text-red-500' : bottle.status === 'Low' ? 'text-amber-400' : 'text-white'} />
              <MetricCard label="Open Bottles" value={(bottle.openBottles || 0).toString()} sub={`${bottle.remainingVolume || 0}ml avg`} />
              <MetricCard label="Unit Price" value={`N$ ${bottle.price}`} sub={`Cost: N$ ${bottle.cost}`} />
              <MetricCard label="Inventory Value" value={`N$ ${(bottle.quantity * bottle.price).toLocaleString()}`} sub={`Margin: ${Math.round(((bottle.price - bottle.cost) / bottle.price) * 100)}%`} color="text-[#d4a24c]" />
            </div>

            {bottle.tags && bottle.tags.length > 0 && (
              <div className="flex gap-1.5 mt-4 flex-wrap">
                {bottle.tags.map(t => <span key={t} className="text-[10px] px-2 py-1 rounded bg-[#d4a24c]/10 text-[#e9c27a] border border-[#d4a24c]/20">{t}</span>)}
              </div>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="mt-6 pt-6 border-t border-[#26262d]">
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">Product Score</div>
            <div className="flex-1 h-2 bg-[#1a1a20] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: score >= 80 ? '#4ade80' : score >= 60 ? '#eab308' : '#ef4444' }} />
            </div>
            <div className="text-2xl font-bold text-white w-12 text-right">{score}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        <button onClick={() => handleQuickAction('IN')} className="glass-card p-4 hover:border-emerald-900/50 text-center group transition-all">
          <Plus className="w-5 h-5 mx-auto text-emerald-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-semibold text-white">Receive</div>
          <div className="text-[10px] text-slate-500">+1 stock</div>
        </button>
        <button onClick={() => handleQuickAction('OUT')} className="glass-card p-4 hover:border-red-900/50 text-center group transition-all">
          <Minus className="w-5 h-5 mx-auto text-red-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-semibold text-white">Sell</div>
          <div className="text-[10px] text-slate-500">−1 stock</div>
        </button>
        <button onClick={() => handleQuickAction('OPEN')} className="glass-card p-4 hover:border-[#d4a24c]/50 text-center group transition-all">
          <Droplets className="w-5 h-5 mx-auto text-[#d4a24c] mb-1.5 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-semibold text-white">Open</div>
          <div className="text-[10px] text-slate-500">Open bottle</div>
        </button>
        <button onClick={() => setShowTransferModal(true)} className="glass-card p-4 hover:border-blue-900/50 text-center group transition-all">
          <MapPin className="w-5 h-5 mx-auto text-blue-400 mb-1.5 group-hover:scale-110 transition-transform" />
          <div className="text-xs font-semibold text-white">Transfer</div>
          <div className="text-[10px] text-slate-500">Move location</div>
        </button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Tag className="w-4 h-4 text-[#d4a24c]" /> Product Information</h3>
          <div className="space-y-3 text-sm">
            <InfoRow label="SKU" value={bottle.sku} />
            <InfoRow label="Category" value={bottle.category} />
            <InfoRow label="Supplier" value={supplier?.name || '—'} />
            <InfoRow label="Location" value={bottle.location || '—'} />
            {bottle.barcode && <InfoRow label="Barcode" value={bottle.barcode} />}
            {bottle.batchNumber && <InfoRow label="Batch" value={bottle.batchNumber} />}
            {bottle.expiryDate && <InfoRow label="Expiry" value={bottle.expiryDate} highlight={expiryDays !== null && expiryDays < 30} />}
            {daysSinceMovement !== null && <InfoRow label="Last Movement" value={`${daysSinceMovement} days ago`} />}
            <InfoRow label="Reorder Level" value={bottle.reorderLevel.toString()} />
            {bottle.maxStock && <InfoRow label="Max Stock" value={bottle.maxStock.toString()} />}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-[#d4a24c]" /> Analytics</h3>
          <div className="space-y-3 text-sm">
            <InfoRow label="Daily Velocity" value={`${velocity.toFixed(2)} units/day`} />
            <InfoRow label="Monthly Projection" value={`${Math.round(velocity * 30)} units`} />
            <InfoRow label="Days Until Reorder" value={velocity > 0 ? `~${Math.round(bottle.quantity / velocity)} days` : 'N/A'} />
            <InfoRow label="Total Movements" value={bottleMovements.length.toString()} />
            <InfoRow label="Total Sales" value={bottleMovements.filter(m => m.type === 'sold').length.toString()} />
            <InfoRow label="Stock Value (Cost)" value={`N$ ${(bottle.quantity * bottle.cost).toLocaleString()}`} />
            <InfoRow label="Stock Value (Retail)" value={`N$ ${(bottle.quantity * bottle.price).toLocaleString()}`} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#d4a24c]" /> Notes</h3>
          <Button variant="ghost" onClick={() => { setNoteText(bottle.notes || ''); setShowNoteModal(true); }} className="text-xs">Edit</Button>
        </div>
        <div className="p-4 rounded-lg bg-[#0f0f13] border border-[#26262d] min-h-[60px] text-sm text-slate-300">
          {bottle.notes || <span className="text-slate-600">No notes yet</span>}
        </div>
      </div>

      {/* Tags Management */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Tag className="w-4 h-4 text-[#d4a24c]" /> Tags</h3>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(t => {
            const active = bottle.tags?.includes(t);
            return (
              <button key={t} onClick={() => updateTag(t)} className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${active ? 'bg-[#d4a24c] text-black border-[#d4a24c] font-semibold' : 'bg-[#0f0f13] border-[#26262d] text-slate-400 hover:text-white hover:border-[#d4a24c]/30'}`}>
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* Movement History */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-[#d4a24c]" /> Movement History</h3>
        {bottleMovements.length === 0 ? (
          <div className="text-sm text-slate-500 py-6 text-center">No movements recorded yet</div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
            {bottleMovements.map(m => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-[#0f0f13]">
                <div className="text-xs text-slate-500 w-24">{new Date(m.timestamp).toLocaleDateString()}</div>
                <div className={`text-xs font-semibold px-2 py-0.5 rounded ${m.type === 'sold' ? 'bg-emerald-500/10 text-emerald-400' : m.type === 'received' ? 'bg-blue-500/10 text-blue-400' : m.type === 'opened_bottle' ? 'bg-[#d4a24c]/10 text-[#d4a24c]' : 'bg-slate-500/10 text-slate-400'}`}>{m.type.toUpperCase()}</div>
                <div className="flex-1 text-xs text-slate-300">{m.notes || `Qty: ${m.qty}`}</div>
                <div className="text-xs text-slate-500">{m.user}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Product" subtitle={bottle.sku} size="lg">
        <EditBottleForm bottle={bottle} onSave={(data) => {
          setBottles(prev => prev.map(b => b.id === bottle.id ? { ...b, ...data } : b));
          setEditing(false);
          toast.success('Product updated');
        }} suppliers={suppliers} />
      </Modal>

      {/* Note Modal */}
      <Modal open={showNoteModal} onClose={() => setShowNoteModal(false)} title="Edit Note" subtitle={bottle.name}>
        <div className="space-y-4">
          <FormField label="Note"><Textarea rows={5} value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add notes about this product..." /></FormField>
          <div className="flex gap-2 justify-end"><Button variant="secondary" onClick={() => setShowNoteModal(false)}>Cancel</Button><Button onClick={saveNote}>Save Note</Button></div>
        </div>
      </Modal>

      {/* Transfer Modal */}
      <Modal open={showTransferModal} onClose={() => setShowTransferModal(false)} title="Transfer Stock" subtitle={bottle.name}>
        <div className="space-y-4">
          <div className="glass-card p-4 bg-[#0f0f13]">
            <div className="text-xs text-slate-400">From</div>
            <div className="text-sm font-semibold text-white">{bottle.location || 'No location'}</div>
            <div className="text-xs text-slate-500 mt-1">Available: {bottle.quantity} units</div>
          </div>
          <FormField label="To Location">
            <Select value={transferTo} onChange={(e) => setTransferTo(e.target.value)}>
              <option value="">Select destination...</option>
              {locations.filter(l => l !== bottle.location).map(l => <option key={l}>{l}</option>)}
            </Select>
          </FormField>
          <FormField label="Quantity"><Input type="number" min={1} max={bottle.quantity} value={transferQty} onChange={(e) => setTransferQty(parseInt(e.target.value) || 1)} /></FormField>
          <div className="flex gap-2 justify-end"><Button variant="secondary" onClick={() => setShowTransferModal(false)}>Cancel</Button><Button onClick={performTransfer} disabled={!transferTo}>Transfer</Button></div>
        </div>
      </Modal>
    </div>
  );
}

function MetricCard({ label, value, sub, color = 'text-white' }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="p-3 rounded-lg bg-[#0f0f13]">
      <div className="text-[10px] uppercase text-slate-500 tracking-wider">{label}</div>
      <div className={`text-lg font-bold mt-1 ${color}`}>{value}</div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-500">{label}</span>
      <span className={`font-medium ${highlight ? 'text-red-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}

function EditBottleForm({ bottle, onSave, suppliers }: { bottle: Bottle; onSave: (data: Partial<Bottle>) => void; suppliers: { id: number; name: string }[] }) {
  const [form, setForm] = useState(bottle);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <FormField label="SKU"><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></FormField>
        <FormField label="Category">
          <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
            <option>Spirits</option><option>Beer</option><option>Wine & Champagne</option><option>Mixers & Others</option><option>Non-Alcoholic</option>
          </Select>
        </FormField>
        <FormField label="Supplier">
          <Select value={form.supplierId || ''} onChange={(e) => setForm({ ...form, supplierId: parseInt(e.target.value) })}>
            <option value="">None</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </FormField>
        <FormField label="Quantity"><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} /></FormField>
        <FormField label="Open Bottles"><Input type="number" value={form.openBottles || 0} onChange={(e) => setForm({ ...form, openBottles: parseInt(e.target.value) || 0 })} /></FormField>
        <FormField label="Selling Price"><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} /></FormField>
        <FormField label="Cost Price"><Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })} /></FormField>
        <FormField label="Reorder Level"><Input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: parseInt(e.target.value) || 0 })} /></FormField>
        <FormField label="Max Stock"><Input type="number" value={form.maxStock || 0} onChange={(e) => setForm({ ...form, maxStock: parseInt(e.target.value) || 0 })} /></FormField>
        <FormField label="Location">
          <Select value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value as any })}>
            <option value="">No location</option>
            <option>Main Fridge</option><option>VIP Fridge</option><option>Storeroom</option><option>Cold Room</option><option>Display Shelf</option><option>Main Bar</option>
          </Select>
        </FormField>
        <FormField label="Expiry Date"><Input type="date" value={form.expiryDate || ''} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} /></FormField>
        <FormField label="Batch Number"><Input value={form.batchNumber || ''} onChange={(e) => setForm({ ...form, batchNumber: e.target.value })} /></FormField>
      </div>
      <FormField label="Notes"><Textarea rows={3} value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></FormField>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" onClick={() => onSave({})}>Cancel</Button>
        <Button onClick={() => onSave({ ...form })}>Save Changes</Button>
      </div>
    </div>
  );
}
