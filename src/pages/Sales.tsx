import { useState } from 'react';
import { Search, Plus, Trash2, ShoppingCart, User, Hash, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Bottle, Sale, SaleItem, ActivityItem } from '../types';
import { Modal, FormField, Input, Button } from '../components/Primitives';
import { calculateBottleStatus } from '../services/inventory.service';
import { BottleIcon } from '../components/BottleIcon';

interface SalesProps {
  bottles: Bottle[];
  setBottles: React.Dispatch<React.SetStateAction<Bottle[]>>;
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  logActivity: (activity: Omit<ActivityItem, 'id' | 'time'>) => void;
}

export default function Sales({ bottles, setBottles, sales, setSales, logActivity }: SalesProps) {
  const [showNewSale, setShowNewSale] = useState(false);
  const [filter, setFilter] = useState('all');

  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const todaySales = sales.filter(s => new Date(s.date).toDateString() === new Date().toDateString());
  const todayRevenue = todaySales.reduce((s, sale) => s + sale.total, 0);

  const handleCompleteSale = (items: SaleItem[], customer?: string, tableNumber?: string) => {
    const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
    const tax = Math.round(subtotal * 0.15);
    const total = subtotal + tax;

    // Deduct stock
    setBottles(prev => prev.map(b => {
      const item = items.find(i => i.bottleId === b.id);
      if (item) {
        const updated = { ...b, quantity: Math.max(0, b.quantity - item.qty), lastMovementAt: new Date().toISOString() };
        return { ...updated, status: calculateBottleStatus(updated) };
      }
      return b;
    }));

    const newSale: Sale = {
      id: Date.now(),
      date: new Date().toISOString(),
      items,
      subtotal,
      tax,
      total,
      customer,
      tableNumber,
      user: 'Pedro Manager',
    };
    setSales(prev => [newSale, ...prev]);
    logActivity({
      type: 'sale',
      title: `Sale #${newSale.id.toString().slice(-4)} completed`,
      subtitle: `${items.reduce((s, i) => s + i.qty, 0)} items • N$ ${newSale.total.toLocaleString()} incl. VAT`,
      user: 'Pedro Manager',
    });
    toast.success('Sale completed!');
    setShowNewSale(false);
  };

  const filteredSales = filter === 'all' ? sales : todaySales;

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales</h1>
          <p className="text-sm text-slate-400 mt-1">Point-of-sale and sales history</p>
        </div>
        <Button onClick={() => setShowNewSale(true)}><Plus className="w-3.5 h-3.5 inline mr-1.5" /> New Sale</Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Revenue</div>
          <div className="text-xl font-bold text-white mt-1">N$ {totalRevenue.toLocaleString()}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Today</div>
          <div className="text-xl font-bold text-[#d4a24c] mt-1">N$ {todayRevenue.toLocaleString()}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Sales</div>
          <div className="text-xl font-bold text-white mt-1">{sales.length}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Avg Sale</div>
          <div className="text-xl font-bold text-white mt-1">N$ {Math.round(totalRevenue / (sales.length || 1))}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-lg text-sm ${filter === 'all' ? 'bg-[#d4a24c] text-black font-semibold' : 'glass-card text-slate-300'}`}>All Sales ({sales.length})</button>
        <button onClick={() => setFilter('today')} className={`px-4 py-2 rounded-lg text-sm ${filter === 'today' ? 'bg-[#d4a24c] text-black font-semibold' : 'glass-card text-slate-300'}`}>Today ({todaySales.length})</button>
      </div>

      {/* Sales List */}
      <div className="space-y-3">
        {filteredSales.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500">
            <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-30" />
            No sales yet. Click "New Sale" to record your first transaction.
          </div>
        ) : (
          filteredSales.map(sale => (
            <div key={sale.id} className="glass-card p-4 hover:border-[#d4a24c]/30 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-900/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Sale #{sale.id.toString().slice(-4)}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      {sale.customer && <><User className="w-3 h-3" /> {sale.customer}</>}
                      {sale.tableNumber && <><Hash className="w-3 h-3" /> Table {sale.tableNumber}</>}
                      <span className="text-slate-500">•</span>
                      {new Date(sale.date).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#d4a24c]">N$ {sale.total.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">{sale.items.reduce((s, i) => s + i.qty, 0)} items</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[#26262d] space-y-1">
                {sale.items.map(item => {
                  const bottle = bottles.find(b => b.id === item.bottleId);
                  return (
                    <div key={item.bottleId} className="flex justify-between text-xs">
                      <span className="text-slate-300">{bottle?.name || 'Unknown'}</span>
                      <span className="text-slate-400">{item.qty} × N$ {item.price} = <span className="text-white font-semibold">N$ {item.qty * item.price}</span></span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <NewSaleModal open={showNewSale} onClose={() => setShowNewSale(false)} bottles={bottles} onComplete={handleCompleteSale} />
    </div>
  );
}

function NewSaleModal({ open, onClose, bottles, onComplete }: { open: boolean; onClose: () => void; bottles: Bottle[]; onComplete: (items: SaleItem[], customer?: string, tableNumber?: string) => void }) {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [customer, setCustomer] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [search, setSearch] = useState('');

  const available = bottles.filter(b => b.quantity > 0 && (b.name.toLowerCase().includes(search.toLowerCase()) || b.sku.toLowerCase().includes(search.toLowerCase())));

  const addItem = (bottleId: number) => {
    const bottle = bottles.find(b => b.id === bottleId);
    if (!bottle) return;
    const existing = items.find(i => i.bottleId === bottleId);
    if (existing) {
      if (existing.qty >= bottle.quantity) { toast.error('No more stock!'); return; }
      setItems(prev => prev.map(i => i.bottleId === bottleId ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setItems(prev => [...prev, { bottleId, qty: 1, price: bottle.price }]);
    }
    setSearch('');
  };

  const updateQty = (bottleId: number, qty: number) => {
    const bottle = bottles.find(b => b.id === bottleId);
    if (!bottle) return;
    if (qty <= 0) { setItems(prev => prev.filter(i => i.bottleId !== bottleId)); return; }
    if (qty > bottle.quantity) { toast.error('Exceeds available stock!'); return; }
    setItems(prev => prev.map(i => i.bottleId === bottleId ? { ...i, qty } : i));
  };

  const removeItem = (bottleId: number) => setItems(prev => prev.filter(i => i.bottleId !== bottleId));

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = Math.round(subtotal * 0.15);
  const total = subtotal + tax;
  const totalItems = items.reduce((s, i) => s + i.qty, 0);

  const handleComplete = () => {
    if (items.length === 0) { toast.error('Add at least one item'); return; }
    onComplete(items, customer || undefined, tableNumber || undefined);
    setItems([]); setCustomer(''); setTableNumber('');
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="New Sale" subtitle={`Total incl. VAT: N$ ${total.toLocaleString()} • ${totalItems} items`} size="xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Products Selector */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0f0f13] border border-[#26262d] text-sm focus:outline-none focus:border-[#d4a24c]/50" />
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
            {available.length === 0 ? (
              <div className="text-center text-sm text-slate-500 py-6">No products found</div>
            ) : available.map(b => {
              const inCart = items.find(i => i.bottleId === b.id);
              return (
                <button key={b.id} onClick={() => addItem(b.id)} disabled={inCart && inCart.qty >= b.quantity} className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#1a1a20] text-left transition-colors disabled:opacity-50">
                  <div className="flex items-center gap-2">
                    <BottleIcon bottle={b} className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="text-sm text-white">{b.name}</div>
                      <div className="text-xs text-slate-500 font-mono">{b.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#d4a24c]">N$ {b.price}</div>
                    <div className="text-xs text-slate-500">{b.quantity} in stock</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-4">
          <div className="glass-card p-4">
            <div className="text-sm font-semibold text-white mb-3">Cart ({totalItems} items)</div>
            {items.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-6">Cart is empty</div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {items.map(item => {
                  const bottle = bottles.find(b => b.id === item.bottleId);
                  return (
                    <div key={item.bottleId} className="flex items-center gap-2 p-2 rounded bg-[#0f0f13]">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white truncate">{bottle?.name}</div>
                        <div className="text-[10px] text-slate-500">N$ {item.price}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQty(item.bottleId, item.qty - 1)} className="w-6 h-6 rounded bg-[#1a1a20] text-slate-400 hover:text-white">−</button>
                        <input type="number" value={item.qty} onChange={(e) => updateQty(item.bottleId, parseInt(e.target.value) || 0)} className="w-10 text-center bg-[#1a1a20] rounded text-xs text-white py-1" />
                        <button onClick={() => updateQty(item.bottleId, item.qty + 1)} className="w-6 h-6 rounded bg-[#1a1a20] text-slate-400 hover:text-white">+</button>
                      </div>
                      <button onClick={() => removeItem(item.bottleId)} className="text-slate-400 hover:text-red-400 p-1"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <FormField label="Customer (Optional)"><Input value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Walk-in, John Doe..." /></FormField>
          <FormField label="Table Number (Optional)"><Input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="14" /></FormField>

          <div className="glass-card p-4 space-y-1">
            <div className="flex justify-between text-xs text-slate-400"><span>Subtotal</span><span>N$ {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between text-xs text-slate-400"><span>VAT (15%)</span><span>N$ {tax.toLocaleString()}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#26262d] text-white"><span>Total</span><span className="text-[#d4a24c]">N$ {total.toLocaleString()}</span></div>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleComplete} disabled={items.length === 0} className="flex-1">Complete Sale</Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
