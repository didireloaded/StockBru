import { useState } from 'react';
import { FileText, Plus, CheckCircle2, XCircle, Truck, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Bottle, PurchaseOrder, POItem, POSortStatus, ActivityItem, Supplier } from '../types';
import { Modal, FormField, Input, Select, Button } from '../components/Primitives';
import { calculateBottleStatus } from '../services/inventory.service';

interface Props {
  bottles: Bottle[];
  setBottles: React.Dispatch<React.SetStateAction<Bottle[]>>;
  pos: PurchaseOrder[];
  setPOs: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  suppliers: Supplier[];
  logActivity: (a: Omit<ActivityItem, 'id' | 'time'>) => void;
}

const statusStyles: Record<POSortStatus, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-amber-500/10 border-amber-900/30', text: 'text-amber-400', dot: 'bg-amber-400' },
  approved: { bg: 'bg-blue-500/10 border-blue-900/30', text: 'text-blue-400', dot: 'bg-blue-400' },
  received: { bg: 'bg-emerald-500/10 border-emerald-900/30', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  cancelled: { bg: 'bg-red-500/10 border-red-900/30', text: 'text-red-500', dot: 'bg-red-500' },
};

export default function PurchaseOrders({ bottles, setBottles, pos, setPOs, suppliers, logActivity }: Props) {
  const [showNew, setShowNew] = useState(false);
  const [viewPO, setViewPO] = useState<PurchaseOrder | null>(null);
  const [filter, setFilter] = useState<'all' | POSortStatus>('all');

  const filtered = filter === 'all' ? pos : pos.filter(p => p.status === filter);
  const pending = pos.filter(p => p.status === 'pending').length;
  const approved = pos.filter(p => p.status === 'approved').length;
  const received = pos.filter(p => p.status === 'received').length;

  const createPO = (supplierId: number, items: POItem[], notes: string) => {
    const newPO: PurchaseOrder = {
      id: Date.now(),
      supplierId,
      date: new Date().toISOString(),
      items,
      status: 'pending',
      total: items.reduce((s, i) => s + i.qty * i.cost, 0),
      notes,
    };
    setPOs(prev => [newPO, ...prev]);
    logActivity({ type: 'order', title: `Purchase order #PO-${newPO.id.toString().slice(-4)} created`, subtitle: `${items.length} items`, user: 'Pedro Manager' });
    toast.success('Purchase order created');
    setShowNew(false);
  };

  const updateStatus = (id: number, status: POSortStatus) => {
    const po = pos.find(p => p.id === id);
    if (!po) return;
    setPOs(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    
    if (status === 'received') {
      // Add stock
      setBottles(prev => prev.map(b => {
        const item = po.items.find(i => i.bottleId === b.id);
        if (item) {
          const updated = { ...b, quantity: b.quantity + item.qty, lastMovementAt: new Date().toISOString() };
          return { ...updated, status: calculateBottleStatus(updated) };
        }
        return b;
      }));
      logActivity({ type: 'purchase', title: `PO #${po.id.toString().slice(-4)} received`, subtitle: `${po.items.length} items restocked`, user: 'Pedro Manager' });
      toast.success('Stock received and updated!');
    } else if (status === 'approved') {
      logActivity({ type: 'order', title: `PO #${po.id.toString().slice(-4)} approved`, subtitle: `N$ ${po.total.toLocaleString()}`, user: 'Pedro Manager' });
      toast.success('PO approved');
    } else if (status === 'cancelled') {
      toast.info('PO cancelled');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Purchase Orders</h1>
          <p className="text-sm text-slate-400 mt-1">Manage supplier orders and restocking</p>
        </div>
        <Button onClick={() => setShowNew(true)}><Plus className="w-3.5 h-3.5 inline mr-1.5" /> Create PO</Button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase tracking-wider">Pending</div><div className="text-xl font-bold text-amber-400 mt-1">{pending}</div></div>
        <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase tracking-wider">Approved</div><div className="text-xl font-bold text-blue-400 mt-1">{approved}</div></div>
        <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase tracking-wider">Received</div><div className="text-xl font-bold text-emerald-400 mt-1">{received}</div></div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['all', 'pending', 'approved', 'received', 'cancelled'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-[#d4a24c] text-black font-semibold' : 'glass-card text-slate-300'}`}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500"><FileText className="w-10 h-10 mx-auto mb-3 opacity-30" /> No purchase orders found</div>
        ) : filtered.map(po => {
          const supplier = suppliers.find(s => s.id === po.supplierId);
          return (
            <div key={po.id} className="glass-card p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${statusStyles[po.status].bg}`}>
                    {po.status === 'received' ? <Truck className={`w-5 h-5 ${statusStyles[po.status].text}`} /> : <FileText className={`w-5 h-5 ${statusStyles[po.status].text}`} />}
                  </div>
                  <div>
                    <div className="font-semibold text-white">PO #{po.id.toString().slice(-4)}</div>
                    <div className="text-xs text-slate-400">{supplier?.name} • {new Date(po.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#d4a24c]">N$ {po.total.toLocaleString()}</div>
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-md border ${statusStyles[po.status].bg} ${statusStyles[po.status].text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[po.status].dot}`} />{po.status.toUpperCase()}
                  </span>
                </div>
              </div>
              {po.notes && <div className="mt-2 text-xs text-slate-500">{po.notes}</div>}
              <div className="mt-3 pt-3 border-t border-[#26262d] flex gap-2 flex-wrap">
                <button onClick={() => setViewPO(po)} className="px-3 py-1.5 rounded-lg bg-[#1a1a20] text-slate-300 hover:text-white text-xs flex items-center gap-1"><Eye className="w-3 h-3" /> View</button>
                {po.status === 'pending' && <><Button variant="secondary" onClick={() => updateStatus(po.id, 'approved')}><CheckCircle2 className="w-3 h-3 inline mr-1" /> Approve</Button><Button variant="danger" onClick={() => updateStatus(po.id, 'cancelled')}><XCircle className="w-3 h-3 inline mr-1" /> Cancel</Button></>}
                {po.status === 'approved' && <Button onClick={() => updateStatus(po.id, 'received')}><Truck className="w-3 h-3 inline mr-1" /> Mark Received</Button>}
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!viewPO} onClose={() => setViewPO(null)} title={`PO #${viewPO?.id.toString().slice(-4) || ''}`} size="lg">
        {viewPO && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Supplier:</span> <span className="text-white">{suppliers.find(s => s.id === viewPO.supplierId)?.name}</span></div>
              <div><span className="text-slate-500">Date:</span> <span className="text-white">{new Date(viewPO.date).toLocaleString()}</span></div>
              <div><span className="text-slate-500">Status:</span> <span className={statusStyles[viewPO.status].text}>{viewPO.status}</span></div>
              <div><span className="text-slate-500">Total:</span> <span className="text-[#d4a24c] font-semibold">N$ {viewPO.total.toLocaleString()}</span></div>
            </div>
            {viewPO.notes && <div className="p-3 rounded-lg bg-[#0f0f13] text-sm text-slate-300">{viewPO.notes}</div>}
            <div>
              <div className="text-xs text-slate-500 uppercase mb-2">Items</div>
              <div className="space-y-1">
                {viewPO.items.map(item => {
                  const b = bottles.find(x => x.id === item.bottleId);
                  return (
                    <div key={item.bottleId} className="flex justify-between p-2 rounded bg-[#0f0f13] text-sm">
                      <span className="text-white">{b?.name}</span>
                      <span className="text-slate-400">{item.qty} × N$ {item.cost} = <span className="text-[#d4a24c] font-semibold">N$ {item.qty * item.cost}</span></span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <CreatePOModal open={showNew} onClose={() => setShowNew(false)} bottles={bottles} suppliers={suppliers} onCreate={createPO} />
    </div>
  );
}

function CreatePOModal({ open, onClose, bottles, suppliers, onCreate }: { open: boolean; onClose: () => void; bottles: Bottle[]; suppliers: Supplier[]; onCreate: (supplierId: number, items: POItem[], notes: string) => void }) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || 0);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<POItem[]>([]);
  const [selectedBottle, setSelectedBottle] = useState(0);
  const [qty, setQty] = useState(1);

  const addLine = () => {
    if (!selectedBottle || qty <= 0) return;
    const bottle = bottles.find(b => b.id === selectedBottle);
    if (!bottle) return;
    const existing = items.find(i => i.bottleId === selectedBottle);
    if (existing) {
      setItems(prev => prev.map(i => i.bottleId === selectedBottle ? { ...i, qty: i.qty + qty } : i));
    } else {
      setItems(prev => [...prev, { bottleId: selectedBottle, qty, cost: bottle.cost }]);
    }
    setSelectedBottle(0); setQty(1);
  };

  const removeLine = (id: number) => setItems(prev => prev.filter(i => i.bottleId !== id));

  const handleSubmit = () => {
    if (items.length === 0) { toast.error('Add at least one item'); return; }
    onCreate(supplierId, items, notes);
    setItems([]); setNotes('');
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Create Purchase Order" size="lg">
      <div className="space-y-4">
        <FormField label="Supplier">
          <Select value={supplierId} onChange={(e) => setSupplierId(parseInt(e.target.value))}>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </FormField>
        <div className="grid grid-cols-3 gap-2">
          <FormField label="Product">
            <Select value={selectedBottle} onChange={(e) => setSelectedBottle(parseInt(e.target.value))}>
              <option value={0}>Select...</option>
              {bottles.filter(b => !b.supplierId || b.supplierId === supplierId).map(b => <option key={b.id} value={b.id}>{b.name} (N${b.cost})</option>)}
            </Select>
          </FormField>
          <FormField label="Qty"><Input type="number" value={qty} onChange={(e) => setQty(parseInt(e.target.value) || 1)} /></FormField>
          <FormField label=" ">
            <Button onClick={addLine} className="w-full">Add Line</Button>
          </FormField>
        </div>

        {items.length > 0 && (
          <div className="space-y-1">
            {items.map(item => {
              const b = bottles.find(x => x.id === item.bottleId);
              return (
                <div key={item.bottleId} className="flex justify-between items-center p-2 rounded bg-[#0f0f13] text-sm">
                  <span className="text-white">{b?.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">{item.qty} × N${item.cost}</span>
                    <span className="text-[#d4a24c] font-semibold w-20 text-right">N${item.qty * item.cost}</span>
                    <button onClick={() => removeLine(item.bottleId)} className="text-red-400 hover:text-red-300"><XCircle className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              );
            })}
            <div className="text-right text-sm font-bold text-[#d4a24c] pt-2 border-t border-[#26262d]">Total: N${items.reduce((s, i) => s + i.qty * i.cost, 0).toLocaleString()}</div>
          </div>
        )}

        <FormField label="Notes (Optional)"><Input value={notes} onChange={(e) => setNotes(e.target.value)} /></FormField>
        <div className="flex gap-2 justify-end"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Create PO</Button></div>
      </div>
    </Modal>
  );
}
