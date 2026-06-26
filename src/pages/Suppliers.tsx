import { useState } from 'react';
import { Plus, Mail, Phone, MapPin, Package, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';
import { Supplier, ActivityItem } from '../types';
import { Modal, FormField, Input, Button } from '../components/Primitives';

interface Props {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  logActivity?: (a: Omit<ActivityItem, 'id' | 'time'>) => void;
}

export default function Suppliers({ suppliers, setSuppliers }: Props) {
  const [showNew, setShowNew] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [deleteSupplier, setDeleteSupplier] = useState<Supplier | null>(null);

  const handleSave = (data: Partial<Supplier>) => {
    if (editingSupplier) {
      setSuppliers(prev => prev.map(s => s.id === editingSupplier.id ? { ...s, ...data } : s));
      toast.success('Supplier updated');
    } else {
      const newSupplier: Supplier = {
        id: Math.max(0, ...suppliers.map(s => s.id)) + 1,
        name: data.name || 'New Supplier',
        contact: data.contact || '',
        email: data.email || '',
        phone: data.phone || '',
        location: data.location || '',
        bottlesSupplied: 0,
        logoColor: data.logoColor || 'from-slate-600 to-slate-900',
      };
      setSuppliers(prev => [...prev, newSupplier]);
      toast.success('Supplier added');
    }
    setShowNew(false);
    setEditingSupplier(null);
  };

  const handleDelete = (id: number) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
    toast.success('Supplier removed');
    setDeleteSupplier(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Suppliers</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your vendor relationships</p>
        </div>
        <Button onClick={() => { setEditingSupplier(null); setShowNew(true); }}><Plus className="w-3.5 h-3.5 inline mr-1.5" /> Add Supplier</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(s => (
          <div key={s.id} className="glass-card p-5 hover:border-[#d4a24c]/30 transition-all cursor-pointer group" onClick={() => setSelectedSupplier(s)}>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${s.logoColor} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white truncate">{s.name}</div>
                <div className="text-xs text-slate-400 mt-1">Contact: {s.contact}</div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Mail className="w-3 h-3" /> {s.email}</div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#26262d] flex justify-between items-center">
              <div className="text-xs text-slate-400 flex items-center gap-1"><Package className="w-3 h-3" /> {s.bottlesSupplied} products</div>
              <div className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {s.location}</div>
            </div>
            <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); setEditingSupplier(s); setShowNew(true); }} className="flex-1 py-1.5 rounded bg-[#1a1a20] text-slate-300 hover:text-white text-xs"><Edit2 className="w-3 h-3 inline mr-1" /> Edit</button>
              <button onClick={(e) => { e.stopPropagation(); setDeleteSupplier(s); }} className="py-1.5 px-3 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedSupplier} onClose={() => setSelectedSupplier(null)} title={selectedSupplier?.name || ''} size="lg">
        {selectedSupplier && (
          <div className="space-y-5">
            <div className="flex gap-4">
              <div className={`w-24 h-24 rounded-xl bg-gradient-to-br ${selectedSupplier.logoColor} flex items-center justify-center text-4xl font-bold text-white`}>
                {selectedSupplier.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{selectedSupplier.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{selectedSupplier.contact}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Email</div><div className="text-white flex items-center gap-2 truncate"><Mail className="w-4 h-4 text-[#d4a24c] flex-shrink-0" /> {selectedSupplier.email || '—'}</div></div>
              <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Phone</div><div className="text-white flex items-center gap-2"><Phone className="w-4 h-4 text-[#d4a24c] flex-shrink-0" /> {selectedSupplier.phone || '—'}</div></div>
              <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Total YTD Spend</div><div className="text-[#d4a24c] font-mono font-bold">N$ {(selectedSupplier.id * 142000).toLocaleString()}</div></div>
              <div className="glass-card p-3"><div className="text-[10px] text-slate-500 uppercase">Delivery Lead Time</div><div className="text-emerald-400 font-bold">2.4 Days Avg</div></div>
              <div className="glass-card p-3 col-span-2"><div className="text-[10px] text-slate-500 uppercase mb-1">Supplied Catalog SKUs</div><div className="text-xs text-slate-300">Ciroc Vodka, Don Julio Tequila, Moët & Chandon, Corona Extra ({selectedSupplier.bottlesSupplied || 12} SKUs)</div></div>
            </div>
          </div>
        )}
      </Modal>

      <SupplierFormModal open={showNew} supplier={editingSupplier} onClose={() => { setShowNew(false); setEditingSupplier(null); }} onSave={handleSave} />

      <Modal open={!!deleteSupplier} onClose={() => setDeleteSupplier(null)} title="Delete Supplier" subtitle="This cannot be undone">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Remove <span className="font-semibold text-white">{deleteSupplier?.name}</span> from supplier management?</p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteSupplier(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteSupplier && handleDelete(deleteSupplier.id)}>Delete Supplier</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SupplierFormModal({ open, supplier, onClose, onSave }: { open: boolean; supplier: Supplier | null; onClose: () => void; onSave: (data: Partial<Supplier>) => void }) {
  const [form, setForm] = useState<Partial<Supplier>>(supplier || { name: '', contact: '', email: '', phone: '', location: '' });
  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={supplier ? 'Edit Supplier' : 'Add New Supplier'}>
      <div className="space-y-4">
        <FormField label="Company Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <FormField label="Contact Person"><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
          <FormField label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
        </div>
        <FormField label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
        <div className="flex gap-2 justify-end"><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => { if (!form.name) { toast.error('Name required'); return; } onSave(form); }}>{supplier ? 'Update' : 'Add'} Supplier</Button></div>
      </div>
    </Modal>
  );
}
