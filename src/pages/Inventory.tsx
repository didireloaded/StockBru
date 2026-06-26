import { useState } from 'react';
import { Search, Plus, Download, Edit2, Trash2, AlertTriangle, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { Bottle, BottleStatus, ActivityItem } from '../types';
import { BOTTLE_IMAGES } from '../data/seed';
import { Modal, FormField, Input, Select, Button } from '../components/Primitives';
import { calculateBottleStatus } from '../services/inventory.service';
import { BottleIcon } from '../components/BottleIcon';

function BottleImage({ bottle, size = 80 }: { bottle: Bottle; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const url = BOTTLE_IMAGES[bottle.id];
  if (url && !imgError) {
    return <img src={url} alt={bottle.name} onError={() => setImgError(true)} className="h-full w-auto object-contain drop-shadow transition-transform duration-300" style={{ maxHeight: size }} />;
  }
  return (
    <div className="w-12 h-12 rounded-lg bg-[#1d1d24] flex items-center justify-center text-[#d4a24c]">
      <BottleIcon bottle={bottle} className="w-8 h-8" />
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

interface InventoryProps {
  bottles: Bottle[];
  setBottles: React.Dispatch<React.SetStateAction<Bottle[]>>;
  logActivity: (activity: Omit<ActivityItem, 'id' | 'time'>) => void;
  suppliers: { id: number; name: string }[];
  onViewProduct?: (id: number) => void;
}

export default function Inventory({ bottles, setBottles, logActivity, suppliers, onViewProduct }: InventoryProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | BottleStatus>('All');
  const [sortField, setSortField] = useState<'name' | 'quantity' | 'price' | 'status'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [page, setPage] = useState(1);

  // Editing state
  const [editingBottle, setEditingBottle] = useState<Bottle | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBottle, setSelectedBottle] = useState<Bottle | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const categories = ['All', 'Spirits', 'Beer', 'Wine & Champagne', 'Mixers & Others', 'Non-Alcoholic'];

  // Filter + Sort
  const filtered = bottles
    .filter(b => {
      const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortField === 'quantity') cmp = a.quantity - b.quantity;
      else if (sortField === 'price') cmp = a.price - b.price;
      else if (sortField === 'status') {
        const order = { Critical: 0, Low: 1, 'Out of Stock': 2, Normal: 3, Overstocked: 4 };
        cmp = order[a.status] - order[b.status];
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const pageSize = 50;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleEdit = (bottle: Bottle) => {
    setEditingBottle({ ...bottle });
  };

  const handleSaveEdit = () => {
    if (!editingBottle) return;
    if (editingBottle.quantity < 0) { toast.error('Quantity cannot be negative'); return; }
    const status = calculateBottleStatus(editingBottle);
    setBottles(prev => prev.map(b => b.id === editingBottle.id ? { ...editingBottle, status } : b));
    logActivity({ type: 'adjustment', title: `Updated ${editingBottle.name}`, subtitle: 'Manual inventory adjustment', user: 'Pedro Manager' });
    toast.success('Product updated');
    setEditingBottle(null);
  };

  const handleDelete = (id: number) => {
    const b = bottles.find(x => x.id === id);
    if (!b) return;
    setBottles(prev => prev.filter(x => x.id !== id));
    logActivity({ type: 'adjustment', title: `Deleted ${b.name}`, subtitle: 'Removed from inventory', user: 'Pedro Manager' });
    toast.success(`${b.name} deleted`);
    setConfirmDelete(null);
  };

  const handleAdd = (data: Partial<Bottle>) => {
    const newBottle: Bottle = {
      id: Math.max(0, ...bottles.map(b => b.id)) + 1,
      name: data.name || 'New Product',
      sku: data.sku || `SKU-${Date.now().toString().slice(-4)}`,
      category: (data.category as any) || 'Spirits',
      quantity: data.quantity || 0,
      price: data.price || 0,
      cost: data.cost || 0,
      reorderLevel: data.reorderLevel || 5,
      status: calculateBottleStatus({ quantity: data.quantity || 0, reorderLevel: data.reorderLevel || 5, maxStock: data.maxStock } as Bottle),
    };
    setBottles(prev => [...prev, newBottle]);
    logActivity({ type: 'purchase', title: `Added ${newBottle.name} to inventory`, subtitle: 'New product created', user: 'Pedro Manager' });
    toast.success('Product added');
    setShowAddModal(false);
  };

  const exportCSV = () => {
    const headers = 'SKU,Name,Category,Quantity,Price,Cost,Status,Reorder\n';
    const rows = filtered.map(b => `${b.sku},${b.name},${b.category},${b.quantity},${b.price},${b.cost},${b.status},${b.reorderLevel}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stockbru-inventory-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} items to CSV`);
  };

  const totalValue = filtered.reduce((s, b) => s + b.quantity * b.cost, 0);
  const totalRetail = filtered.reduce((s, b) => s + b.quantity * b.price, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Inventory</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your entire product catalog — {filtered.length} items</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={exportCSV}><Download className="w-3.5 h-3.5 inline mr-1.5" /> Export CSV</Button>
          <Button onClick={() => setShowAddModal(true)}><Plus className="w-3.5 h-3.5 inline mr-1.5" /> Add Product</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Value</div>
          <div className="text-xl font-bold text-white mt-1">N$ {totalValue.toLocaleString()}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Retail Value</div>
          <div className="text-xl font-bold text-[#d4a24c] mt-1">N$ {totalRetail.toLocaleString()}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Critical Items</div>
          <div className="text-xl font-bold text-red-500 mt-1">{bottles.filter(b => b.status === 'Critical').length}</div>
        </div>
        <div className="glass-card p-4">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider">Avg Price</div>
          <div className="text-xl font-bold text-white mt-1">N$ {Math.round(filtered.reduce((s, b) => s + b.price, 0) / (filtered.length || 1))}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or SKU..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0f0f13] border border-[#26262d] text-sm focus:outline-none focus:border-[#d4a24c]/50"
          />
        </div>
        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="max-w-[180px]">
          {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </Select>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="max-w-[150px]">
          <option value="All">All Status</option>
          <option value="Critical">Critical</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Overstocked">Overstocked</option>
        </Select>
        <div className="flex gap-1 border border-[#26262d] rounded-lg p-1">
          <button onClick={() => setViewMode('table')} className={`px-3 py-1.5 text-xs rounded ${viewMode === 'table' ? 'bg-[#d4a24c] text-black font-semibold' : 'text-slate-400 hover:text-white'}`}>Table</button>
          <button onClick={() => setViewMode('grid')} className={`px-3 py-1.5 text-xs rounded ${viewMode === 'grid' ? 'bg-[#d4a24c] text-black font-semibold' : 'text-slate-400 hover:text-white'}`}>Grid</button>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#26262d] text-[11px] uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                    Product {sortField === 'name' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-left cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('quantity')}>
                    Qty {sortField === 'quantity' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-right cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                    Price {sortField === 'price' && (sortDir === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26262d]">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-slate-500">No products match your filters</td></tr>
                ) : paginated.map(b => (
                  <tr key={b.id} className="hover:bg-[#1a1a20]/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                      <BottleIcon bottle={b} className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      {b.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{b.sku}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${statusStyles[b.status].bg} ${statusStyles[b.status].text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[b.status].dot}`} />
                        {b.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{b.category}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${b.status === 'Critical' ? 'text-red-500' : b.status === 'Low' ? 'text-amber-400' : 'text-white'}`}>
                      {b.quantity}
                      {b.openBottles ? <span className="text-slate-500 text-xs"> / {b.openBottles} open</span> : null}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-300">N$ {b.price}</td>
                    <td className="px-4 py-3 text-right text-[#d4a24c] font-semibold">N$ {(b.quantity * b.price).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => onViewProduct ? onViewProduct(b.id) : setSelectedBottle(b)} className="p-1.5 rounded hover:bg-[#1a1a20] text-slate-400 hover:text-[#d4a24c]"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleEdit(b)} className="p-1.5 rounded hover:bg-[#1a1a20] text-slate-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setConfirmDelete(b.id)} className="p-1.5 rounded hover:bg-[#1a1a20] text-slate-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {paginated.map(b => (
            <div key={b.id} className="glass-card p-4 flex flex-col items-center text-center cursor-pointer hover:border-[#d4a24c]/50 transition-all" onClick={() => setSelectedBottle(b)}>
              <div className="h-20 flex items-end justify-center mb-2"><BottleImage bottle={b} size={70} /></div>
              <div className="text-xs font-semibold text-white truncate w-full">{b.name}</div>
              <div className="text-[10px] font-mono text-slate-500">{b.sku}</div>
              <div className={`mt-2 text-lg font-bold ${b.status === 'Critical' ? 'text-red-500' : b.status === 'Low' ? 'text-amber-400' : 'text-white'}`}>{b.quantity}</div>
              <span className={`mt-1 text-[10px] px-2 py-0.5 rounded ${statusStyles[b.status].bg} ${statusStyles[b.status].text}`}>{b.status}</span>
            </div>
          ))}
        </div>
      )}

      {filtered.length > pageSize && (
        <div className="flex items-center justify-between text-sm text-slate-400">
          <span>Page {page} of {totalPages} • {filtered.length} matching products</span>
          <div className="flex gap-2">
            <Button variant="secondary" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</Button>
            <Button variant="secondary" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</Button>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      <Modal open={!!selectedBottle} onClose={() => setSelectedBottle(null)} title={selectedBottle?.name || ''} subtitle={selectedBottle?.sku}>
        {selectedBottle && (
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="w-24 h-40 flex items-end justify-center"><BottleImage bottle={selectedBottle} size={140} /></div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Quantity</div><div className="text-xl font-bold text-white">{selectedBottle.quantity}</div></div>
                <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Open Bottles</div><div className="text-xl font-bold text-white">{selectedBottle.openBottles || 0}</div></div>
                <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Unit Price</div><div className="text-xl font-bold text-[#d4a24c]">N$ {selectedBottle.price}</div></div>
                <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Total Value</div><div className="text-xl font-bold text-white">N$ {(selectedBottle.quantity * selectedBottle.price).toLocaleString()}</div></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Category:</span> <span className="text-white">{selectedBottle.category}</span></div>
              <div><span className="text-slate-500">Status:</span> <span className={statusStyles[selectedBottle.status].text}>{selectedBottle.status}</span></div>
              <div><span className="text-slate-500">Reorder Level:</span> <span className="text-white">{selectedBottle.reorderLevel}</span></div>
              <div><span className="text-slate-500">SKU:</span> <span className="font-mono text-white">{selectedBottle.sku}</span></div>
              <div><span className="text-slate-500">Cost:</span> <span className="text-white">N$ {selectedBottle.cost}</span></div>
              <div><span className="text-slate-500">Margin:</span> <span className="text-emerald-400">{Math.round(((selectedBottle.price - selectedBottle.cost) / selectedBottle.price) * 100)}%</span></div>
            </div>
            <div className="flex gap-2 pt-3">
              <Button onClick={() => { setSelectedBottle(null); handleEdit(selectedBottle); }}>Edit</Button>
              <Button variant="secondary" onClick={() => setSelectedBottle(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editingBottle} onClose={() => setEditingBottle(null)} title="Edit Product" subtitle={editingBottle?.sku}>
        {editingBottle && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Product Name">
                <Input value={editingBottle.name} onChange={(e) => setEditingBottle({ ...editingBottle, name: e.target.value })} />
              </FormField>
              <FormField label="SKU">
                <Input value={editingBottle.sku} onChange={(e) => setEditingBottle({ ...editingBottle, sku: e.target.value })} />
              </FormField>
              <FormField label="Category">
                <Select value={editingBottle.category} onChange={(e) => setEditingBottle({ ...editingBottle, category: e.target.value as any })}>
                  {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </Select>
              </FormField>
              <FormField label="Status">
                <Select value={editingBottle.status} onChange={(e) => setEditingBottle({ ...editingBottle, status: e.target.value as any })}>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                  <option value="Critical">Critical</option>
                </Select>
              </FormField>
              <FormField label="Quantity">
                <Input type="number" value={editingBottle.quantity} onChange={(e) => setEditingBottle({ ...editingBottle, quantity: parseInt(e.target.value) || 0 })} />
              </FormField>
              <FormField label="Open Bottles">
                <Input type="number" value={editingBottle.openBottles || 0} onChange={(e) => setEditingBottle({ ...editingBottle, openBottles: parseInt(e.target.value) || 0 })} />
              </FormField>
              <FormField label="Selling Price">
                <Input type="number" value={editingBottle.price} onChange={(e) => setEditingBottle({ ...editingBottle, price: parseFloat(e.target.value) || 0 })} />
              </FormField>
              <FormField label="Cost Price">
                <Input type="number" value={editingBottle.cost} onChange={(e) => setEditingBottle({ ...editingBottle, cost: parseFloat(e.target.value) || 0 })} />
              </FormField>
              <FormField label="Reorder Level">
                <Input type="number" value={editingBottle.reorderLevel} onChange={(e) => setEditingBottle({ ...editingBottle, reorderLevel: parseInt(e.target.value) || 0 })} />
              </FormField>
            </div>
            <div className="flex gap-2 pt-3 justify-end">
              <Button variant="secondary" onClick={() => setEditingBottle(null)}>Cancel</Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Modal */}
      <AddProductModal open={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAdd} suppliers={suppliers} />

      {/* Confirm Delete Modal */}
      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirm Deletion" subtitle="This action cannot be undone">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-red-950/30 border border-red-900/30">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="text-sm text-slate-300">Are you sure you want to permanently delete <strong className="text-white">{bottles.find(b => b.id === confirmDelete)?.name}</strong>?</div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => confirmDelete && handleDelete(confirmDelete)}>Delete Permanently</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AddProductModal({ open, onClose, onSave, suppliers }: { open: boolean; onClose: () => void; onSave: (data: Partial<Bottle>) => void; suppliers: { id: number; name: string }[] }) {
  const [form, setForm] = useState<Partial<Bottle>>({ name: '', sku: '', category: 'Spirits', quantity: 10, price: 100, cost: 60, reorderLevel: 5 });
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title="Add New Product" subtitle="Create a new inventory item">
      <div className="space-y-4">
        <FormField label="Product Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grey Goose" /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="SKU"><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} placeholder="SP-GRG" /></FormField>
          <FormField label="Category">
            <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })}>
              <option>Spirits</option><option>Beer</option><option>Wine & Champagne</option><option>Mixers & Others</option><option>Non-Alcoholic</option>
            </Select>
          </FormField>
          <FormField label="Initial Quantity"><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 0 })} /></FormField>
          <FormField label="Selling Price (N$)"><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} /></FormField>
          <FormField label="Cost Price (N$)"><Input type="number" value={form.cost} onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })} /></FormField>
          <FormField label="Reorder Level"><Input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: parseInt(e.target.value) || 0 })} /></FormField>
          <FormField label="Supplier">
            <Select value={form.supplierId || ''} onChange={(e) => setForm({ ...form, supplierId: parseInt(e.target.value) })}>
              <option value="">Select...</option>
              {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="flex gap-2 justify-end pt-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (!form.name) { toast.error('Name required'); return; } onSave(form); }} disabled={!form.name}>Add Product</Button>
        </div>
      </div>
    </Modal>
  );
}
