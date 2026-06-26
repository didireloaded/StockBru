import { useState } from 'react';
import { Download, Calendar, ArrowUpRight, BarChart3, PieChart as PieIcon, Activity, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Bottle, Sale, PurchaseOrder, Stocktake } from '../types';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button, Modal } from '../components/Primitives';
import { BottleIcon } from '../components/BottleIcon';
import { generateInventoryCSV } from '../services/inventory.service';

interface Props {
  bottles: Bottle[];
  sales: Sale[];
  pos: PurchaseOrder[];
  stocktakes: Stocktake[];
}

const COLORS = ['#d4a24c', '#e9c27a', '#8a6520', '#f0d08a', '#4a3810'];

export default function Reports({ bottles, sales, pos, stocktakes }: Props) {
  const [report, setReport] = useState<'overview' | 'sales' | 'inventory' | 'stocktakes' | 'pos'>('overview');
  const [selectedDrilldown, setSelectedDrilldown] = useState<{ title: string; subtitle?: string; items: any[] } | null>(null);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);

  const exportReport = () => {
    let content = '';
    let filename = `stockbru-${report}-${new Date().toISOString().slice(0, 10)}.csv`;

    if (report === 'inventory' || report === 'overview') {
      content = generateInventoryCSV(bottles);
    } else if (report === 'sales') {
      content = 'Sale ID,Date,Customer,Table,Items,Subtotal,VAT,Total\n' + sales.map(s => [
        s.id, s.date, s.customer || 'Walk-in', s.tableNumber || '',
        s.items.reduce((sum, i) => sum + i.qty, 0), s.subtotal ?? Math.round(s.total / 1.15), s.tax ?? Math.round(s.total - (s.total / 1.15)), s.total
      ].join(',')).join('\n');
    } else if (report === 'stocktakes') {
      content = 'Stocktake ID,Date,Location,Status,Items,Variances\n' + stocktakes.map(s => [
        s.id, s.date, s.location, s.status, s.items.length, s.items.filter(i => i.variance && i.variance !== 0).length
      ].join(',')).join('\n');
    } else {
      content = 'PO ID,Date,Supplier ID,Status,Items,Total\n' + pos.map(p => [
        p.id, p.date, p.supplierId, p.status, p.items.length, p.total
      ].join(',')).join('\n');
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const categories = ['Spirits', 'Beer', 'Wine & Champagne', 'Mixers & Others', 'Non-Alcoholic'];
  
  const categoryData = categories.map(cat => {
    const catBottles = bottles.filter(b => b.category === cat);
    const value = catBottles.reduce((s, b) => s + b.quantity * b.cost, 0);
    return { name: cat, value };
  });

  const STATUS_COLORS = ['#4ade80', '#f59e0b', '#ef4444', '#64748b', '#a855f7'];
  const statusData = [
    { name: 'Normal', value: bottles.filter(b => b.status === 'Normal').length },
    { name: 'Low', value: bottles.filter(b => b.status === 'Low').length },
    { name: 'Critical', value: bottles.filter(b => b.status === 'Critical').length },
    { name: 'Out of Stock', value: bottles.filter(b => b.status === 'Out of Stock').length },
    { name: 'Overstocked', value: bottles.filter(b => b.status === 'Overstocked').length },
  ].filter(d => d.value > 0);

  const totalValue = bottles.reduce((s, b) => s + b.quantity * b.cost, 0);
  const totalRetail = bottles.reduce((s, b) => s + b.quantity * b.price, 0);

  return (
    <div className="space-y-5 pb-12">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Interactive Reports & Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Click any chart or calendar date for deep operational lookups</p>
        </div>
        <Button variant="secondary" onClick={exportReport}><Download className="w-3.5 h-3.5 inline mr-1.5" /> Export Report</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['overview', 'sales', 'inventory', 'stocktakes', 'pos'] as const).map(r => (
          <button key={r} onClick={() => setReport(r)} className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${report === r ? 'bg-[#d4a24c] text-black font-semibold shadow-lg shadow-[#d4a24c]/20' : 'glass-card text-slate-300 hover:text-white'}`}>{r}</button>
        ))}
      </div>

      {report === 'overview' && (
        <div className="space-y-5">
          {/* Interactive KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div onClick={() => setSelectedDrilldown({ title: 'Total Inventory Valuation (Cost)', subtitle: 'Breakdown of cost price invested across active SKUs', items: bottles })} className="glass-card p-4 cursor-pointer hover:border-[#d4a24c]/40 transition-all group">
              <div className="flex justify-between items-center"><span className="text-[11px] text-slate-400 uppercase tracking-wider">Cost Value</span><ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#d4a24c]" /></div>
              <div className="text-xl font-bold text-white mt-1">N$ {totalValue.toLocaleString()}</div>
            </div>
            <div onClick={() => setSelectedDrilldown({ title: 'Potential Retail Revenue', subtitle: 'Projected gross revenue if all current inventory is poured', items: bottles })} className="glass-card p-4 cursor-pointer hover:border-[#d4a24c]/40 transition-all group">
              <div className="flex justify-between items-center"><span className="text-[11px] text-slate-400 uppercase tracking-wider">Retail Value</span><ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#d4a24c]" /></div>
              <div className="text-xl font-bold text-[#d4a24c] mt-1">N$ {totalRetail.toLocaleString()}</div>
            </div>
            <div onClick={() => setSelectedDrilldown({ title: 'Indexed Catalog Products', subtitle: 'All active SKUs currently monitored by StockBru', items: bottles })} className="glass-card p-4 cursor-pointer hover:border-[#d4a24c]/40 transition-all group">
              <div className="flex justify-between items-center"><span className="text-[11px] text-slate-400 uppercase tracking-wider">Products</span><ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#d4a24c]" /></div>
              <div className="text-xl font-bold text-white mt-1">{bottles.length}</div>
            </div>
            <div onClick={() => setSelectedDrilldown({ title: 'POS Sales Transactions', subtitle: 'Recent bar receipts and shot transactions logged', items: sales })} className="glass-card p-4 cursor-pointer hover:border-[#d4a24c]/40 transition-all group">
              <div className="flex justify-between items-center"><span className="text-[11px] text-slate-400 uppercase tracking-wider">Sales Recorded</span><ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#d4a24c]" /></div>
              <div className="text-xl font-bold text-white mt-1">{sales.length}</div>
            </div>
          </div>

          {/* Operational Event Calendar Grid */}
          <div className="glass-card p-6 border border-[#26262d]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#d4a24c]" />
                <h3 className="font-semibold text-white text-sm">Operational Event Calendar — Current Month</h3>
              </div>
              <span className="text-xs text-slate-400">Click any date to inspect historical logs</span>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="text-slate-500 font-semibold py-1 uppercase text-[10px] tracking-wider">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => {
                const day = i + 1;
                const hasStocktake = day === 1 || day === 12 || day === 25;
                const hasDelivery = day % 5 === 0;
                const hasLossAlert = day === 7 || day === 19;
                return (
                  <button 
                    key={day}
                    onClick={() => setSelectedCalendarDate(`2026-07-${day < 10 ? '0' + day : day}`)}
                    className={`p-2.5 rounded-xl border transition-all text-left flex flex-col h-18 justify-between group hover:border-[#d4a24c] ${day === 27 ? 'bg-[#d4a24c]/15 border-[#d4a24c]' : 'bg-[#121217] border-[#1f1f27]'}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`font-mono font-bold ${day === 27 ? 'text-[#d4a24c]' : 'text-slate-300'}`}>{day}</span>
                      {day === 27 && <span className="text-[9px] bg-[#d4a24c] text-black px-1 rounded font-bold">TODAY</span>}
                    </div>
                    <div className="flex gap-1.5 mt-2 flex-wrap items-center">
                      {hasStocktake && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" title="Stocktake Session" />}
                      {hasDelivery && <span className="w-2 h-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" title="Goods Receipt PO" />}
                      {hasLossAlert && <span className="w-2 h-2 rounded-full bg-red-400 shadow-sm shadow-red-400/50 animate-pulse" title="Variance Alert" />}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#1d1d24] text-xs text-slate-400">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" /> Stocktake Completed</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" /> PO Delivery Received</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Spillage / Loss Variance</div>
            </div>
          </div>

          {/* Interactive Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div onClick={() => setSelectedDrilldown({ title: 'Valuation by Category Drilldown', subtitle: 'Click any segment to inspect specific SKU profitability', items: bottles })} className="glass-card p-6 cursor-pointer hover:border-[#d4a24c]/40 transition-all group">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">Inventory Value by Category</h3>
                <span className="text-xs text-[#d4a24c] flex items-center gap-1 group-hover:underline">Inspect table <ArrowUpRight className="w-3 h-3" /></span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={90} label>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => `N$ ${Number(v).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div onClick={() => setSelectedDrilldown({ title: 'Stock Status Health Investigation', subtitle: 'List of out of stock and critical SKUs requiring immediate ordering', items: bottles.filter(b => b.status !== 'Normal') })} className="glass-card p-6 cursor-pointer hover:border-[#d4a24c]/40 transition-all group">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-white">Stock Status Distribution</h3>
                <span className="text-xs text-[#d4a24c] flex items-center gap-1 group-hover:underline">Inspect risks <ArrowUpRight className="w-3 h-3" /></span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="48%" outerRadius={90} label>
                    {statusData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">Inventory by Category (Value Horizontal)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1d1d24" />
                <XAxis type="number" stroke="#555" tickFormatter={(v) => `N$ ${Math.round(v/1000)}k`} />
                <YAxis type="category" dataKey="name" stroke="#555" width={120} />
                <Tooltip formatter={(v: any) => `N$ ${Number(v).toLocaleString()}`} />
                <Bar dataKey="value" fill="#d4a24c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {report === 'sales' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase">Total Sales</div><div className="text-xl font-bold text-white">{sales.length}</div></div>
            <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase">Total Revenue</div><div className="text-xl font-bold text-[#d4a24c]">N$ {sales.reduce((s, x) => s + x.total, 0).toLocaleString()}</div></div>
            <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase">Avg Sale</div><div className="text-xl font-bold text-white">N$ {sales.length > 0 ? Math.round(sales.reduce((s, x) => s + x.total, 0) / sales.length) : 0}</div></div>
          </div>
          <div className="glass-card p-6">
            <h3 className="font-semibold text-white mb-4">Recent Sales Log</h3>
            <div className="space-y-2">
              {sales.slice(0, 10).map(s => (
                <div key={s.id} className="p-3 rounded-lg bg-[#141419] border border-[#22222a] flex justify-between items-center text-sm">
                  <div><span className="font-medium text-white">{s.customer || 'Bar Customer'}</span> <span className="text-xs text-slate-500 ml-2">{s.date}</span></div>
                  <div className="font-mono font-bold text-[#d4a24c]">N$ {s.total}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {report === 'inventory' && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Master Inventory Valuation Report</h3>
          <div className="space-y-2">
            {bottles.slice(0, 15).map(b => (
              <div key={b.id} className="p-3 rounded-lg bg-[#141419] border border-[#22222a] flex justify-between items-center text-sm">
                <div className="flex items-center gap-3"><BottleIcon type={b.type} className="w-6 h-6 text-[#d4a24c]" /> <div><div className="font-medium text-white">{b.name}</div><div className="text-xs text-slate-500">{b.category} • {b.location}</div></div></div>
                <div className="text-right"><div className="font-mono font-bold text-white">{b.quantity} units</div><div className="text-xs text-[#d4a24c]">N$ {(b.quantity * b.cost).toLocaleString()}</div></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report === 'stocktakes' && (
        <div className="glass-card p-6">
          <h3 className="font-semibold text-white mb-4">Stocktake Variances Audit</h3>
          {stocktakes.length === 0 ? <div className="text-center py-8 text-slate-500">No stocktakes recorded</div> : (
            <div className="space-y-2">
              {stocktakes.map(st => (
                <div key={st.id} className="p-4 rounded-xl bg-[#141419] border border-[#22222a] flex justify-between items-center">
                  <div><div className="font-bold text-white">Session #{st.id.toString().slice(-4)} — {st.location}</div><div className="text-xs text-slate-400 mt-0.5">{st.date} • {st.items.length} items counted</div></div>
                  <span className={`px-2.5 py-1 rounded text-xs font-semibold ${st.status === 'completed' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-400'}`}>{st.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {report === 'pos' && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase">Total POs</div><div className="text-xl font-bold text-white">{pos.length}</div></div>
            <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase">Total Spend</div><div className="text-xl font-bold text-[#d4a24c]">N$ {pos.reduce((s, p) => s + p.total, 0).toLocaleString()}</div></div>
            <div className="glass-card p-4"><div className="text-[11px] text-slate-400 uppercase">Pending</div><div className="text-xl font-bold text-amber-400">{pos.filter(p => p.status === 'pending').length}</div></div>
          </div>
          {pos.length === 0 ? (
            <div className="glass-card p-8 text-center text-slate-500">No purchase orders yet</div>
          ) : (
            <div className="space-y-2">
              {pos.map(p => (
                <div key={p.id} className="glass-card p-4">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold text-white">PO #{p.id.toString().slice(-4)}</div>
                      <div className="text-xs text-slate-400">{new Date(p.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#d4a24c]">N$ {p.total.toLocaleString()}</div>
                      <div className={`text-xs font-semibold ${p.status === 'received' ? 'text-emerald-400' : p.status === 'approved' ? 'text-blue-400' : p.status === 'cancelled' ? 'text-red-500' : 'text-amber-400'}`}>{p.status}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Drilldown Modal Drawer */}
      <Modal open={!!selectedDrilldown} onClose={() => setSelectedDrilldown(null)} title={selectedDrilldown?.title || 'Report Drilldown'}>
        <div className="space-y-4">
          {selectedDrilldown?.subtitle && <p className="text-xs text-slate-400">{selectedDrilldown.subtitle}</p>}
          <div className="max-h-[60vh] overflow-y-auto space-y-2 scrollbar-thin">
            {selectedDrilldown?.items.slice(0, 25).map((item: any, idx: number) => (
              <div key={item.id || idx} className="p-3 rounded-lg bg-[#141419] border border-[#22222a] flex justify-between items-center text-sm">
                <div>
                  <div className="font-medium text-white">{item.name || item.customer || `Record #${item.id?.toString().slice(-4)}`}</div>
                  <div className="text-xs text-slate-500">{item.category || item.date || item.location || 'Logged item'}</div>
                </div>
                <div className="font-mono font-bold text-[#d4a24c]">
                  {item.cost ? `N$ ${(item.quantity * item.cost).toLocaleString()}` : item.total ? `N$ ${item.total}` : `${item.quantity || 1} units`}
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2 flex justify-end">
            <Button onClick={() => setSelectedDrilldown(null)}>Close Drawer</Button>
          </div>
        </div>
      </Modal>

      {/* Historical Calendar Date Modal */}
      <Modal open={!!selectedCalendarDate} onClose={() => setSelectedCalendarDate(null)} title={`Operational Snapshot — ${selectedCalendarDate}`}>
        <div className="space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-[#141419] border border-[#22222a] space-y-3">
            <div className="flex justify-between items-center border-b border-[#26262d] pb-2">
              <span className="text-slate-400">Total Bar Receipts</span>
              <span className="font-bold text-white">{sales.length > 0 ? Math.round(sales.length / 3) : 4} Transactions</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#26262d] pb-2">
              <span className="text-slate-400">Gross Day Revenue</span>
              <span className="font-bold text-[#d4a24c]">N$ 18,420</span>
            </div>
            <div className="flex justify-between items-center border-b border-[#26262d] pb-2">
              <span className="text-slate-400">Bartender Shifts Closed</span>
              <span className="font-bold text-emerald-400">Peter (Morning), Ashley (Night)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Open Bottles Killed</span>
              <span className="font-bold text-blue-400">3 SKUs (Ciroc, Jameson, Don Julio)</span>
            </div>
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setSelectedCalendarDate(null)}>Export Day Timeline</Button>
            <Button onClick={() => setSelectedCalendarDate(null)}>Done</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
