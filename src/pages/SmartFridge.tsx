import { useState, useMemo } from 'react';
import {
  Search, Plus, Minus, Droplets, Grid, List, LayoutGrid,
  Package, Sparkles, Star, Tag, MapPin
} from 'lucide-react';
import { toast } from 'sonner';
import { Bottle, BottleStatus, ActivityItem } from '../types';
import { BOTTLE_IMAGES } from '../data/seed';
import { calculateBottleStatus } from '../services/inventory.service';
import { BottleIcon } from '../components/BottleIcon';

const statusStyles: Record<BottleStatus, { dot: string; text: string; bg: string; ring: string; label: string }> = {
  Normal:       { dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/30', label: 'HEALTHY' },
  Low:          { dot: 'bg-amber-400',   text: 'text-amber-400',   bg: 'bg-amber-500/10',   ring: 'ring-amber-500/30',   label: 'LOW' },
  Critical:     { dot: 'bg-red-500',     text: 'text-red-500',     bg: 'bg-red-500/10',     ring: 'ring-red-500/30',     label: 'CRITICAL' },
  'Out of Stock': { dot: 'bg-slate-600', text: 'text-slate-400',   bg: 'bg-slate-500/10',   ring: 'ring-slate-600/50',   label: 'OUT' },
  Overstocked:  { dot: 'bg-purple-500', text: 'text-purple-400',  bg: 'bg-purple-500/10', ring: 'ring-purple-500/30', label: 'OVERSTOCK' },
};

interface Props {
  bottles: Bottle[];
  setBottles: React.Dispatch<React.SetStateAction<Bottle[]>>;
  logActivity: (a: Omit<ActivityItem, 'id' | 'time'>) => void;
  onViewProduct?: (id: number) => void;
}

type ViewMode = 'grid' | 'compact' | 'shelf';
type FilterStatus = 'all' | BottleStatus | 'favorite';

export default function SmartFridge({ bottles, setBottles, logActivity }: Props) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<FilterStatus>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [location, setLocation] = useState('All');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'qty' | 'price' | 'status'>('name');

  const locations = useMemo(() => ['All', ...Array.from(new Set(bottles.map(b => b.location).filter(Boolean))) as string[]], [bottles]);
  const categories = ['All', 'Spirits', 'Beer', 'Wine & Champagne', 'Mixers & Others', 'Non-Alcoholic'];
  const allTags = useMemo(() => Array.from(new Set(bottles.flatMap(b => b.tags || []))), [bottles]);

  const filtered = useMemo(() => {
    let result = bottles.filter(b => {
      if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.sku.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== 'All' && b.category !== category) return false;
      if (status !== 'all') {
        if (status === 'favorite') { if (!b.favorite) return false; }
        else if (b.status !== status) return false;
      }
      if (location !== 'All' && b.location !== location) return false;
      if (selectedTags.length > 0 && !selectedTags.some(t => b.tags?.includes(t))) return false;
      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'qty') return a.quantity - b.quantity;
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'status') {
        const order = { Critical: 0, Low: 1, 'Out of Stock': 2, Normal: 3, Overstocked: 4 };
        return order[a.status] - order[b.status];
      }
      return 0;
    });
    return result;
  }, [bottles, search, category, status, location, selectedTags, sortBy]);

  const stats = useMemo(() => ({
    total: bottles.length,
    healthy: bottles.filter(b => b.status === 'Normal').length,
    low: bottles.filter(b => b.status === 'Low').length,
    critical: bottles.filter(b => b.status === 'Critical' || b.status === 'Out of Stock').length,
    openTotal: bottles.reduce((s, b) => s + (b.openBottles || 0), 0),
    totalValue: bottles.reduce((s, b) => s + b.quantity * b.price, 0),
  }), [bottles]);

  const handleAction = (id: number, type: 'IN' | 'OUT' | 'OPEN') => {
    setBottles(prev => prev.map(b => {
      if (b.id === id) {
        let newQty = b.quantity;
        let newOpen = b.openBottles || 0;
        if (type === 'IN') newQty += 1;
        if (type === 'OUT') { if (newQty > 0) newQty -= 1; else { toast.error("Out of stock!"); return b; } }
        if (type === 'OPEN') { if (newQty > 0) { newQty -= 1; newOpen += 1; } else { toast.error("No bottles to open!"); return b; } }
        
        const updated: Bottle = { ...b, quantity: newQty, openBottles: newOpen, lastMovementAt: new Date().toISOString() };
        return { ...updated, status: calculateBottleStatus(updated) };
      }
      return b;
    }));
    const b = bottles.find(x => x.id === id);
    if (b) {
      logActivity({ type: type === 'IN' ? 'purchase' : 'sale', title: `${type === 'IN' ? 'Restocked' : type === 'OPEN' ? 'Opened' : 'Sold'} 1 × ${b.name}`, subtitle: 'Smart Fridge quick action', user: 'Pedro Manager' });
      toast.success(`${b.name}: ${type === 'IN' ? '+1' : '−1'}`);
    }
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBottles(prev => prev.map(b => b.id === id ? { ...b, favorite: !b.favorite } : b));
    toast.success(bottles.find(b => b.id === id)?.favorite ? 'Removed from favorites' : 'Added to favorites');
  };

  return (
    <div className="space-y-6">
      {/* Header with premium feel */}
      <div className="relative overflow-hidden rounded-2xl border border-[#26262d] bg-gradient-to-br from-[#16161b] via-[#0f0f13] to-[#0a0a0e] p-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4a24c]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#d4a24c]/5 rounded-full blur-3xl translate-y-1/2" />
        
        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a24c] to-[#8a6520] flex items-center justify-center">
                  <Package className="w-4 h-4 text-black" />
                </div>
                <div className="text-[10px] uppercase tracking-[2px] text-[#d4a24c] font-semibold">INVENTORY EXPLORER</div>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Smart Fridge</h1>
              <p className="text-sm text-slate-400 mt-1">Live inventory across all locations. {filtered.length} products shown.</p>
            </div>

            <div className="flex gap-2">
              <div className="flex gap-1 p-1 bg-[#0f0f13] border border-[#26262d] rounded-lg">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#d4a24c] text-black' : 'text-slate-400 hover:text-white'}`} title="Grid view"><Grid className="w-3.5 h-3.5" /></button>
                <button onClick={() => setViewMode('compact')} className={`p-2 rounded ${viewMode === 'compact' ? 'bg-[#d4a24c] text-black' : 'text-slate-400 hover:text-white'}`} title="Compact view"><List className="w-3.5 h-3.5" /></button>
                <button onClick={() => setViewMode('shelf')} className={`p-2 rounded ${viewMode === 'shelf' ? 'bg-[#d4a24c] text-black' : 'text-slate-400 hover:text-white'}`} title="Shelf view"><LayoutGrid className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-6">
            <StatBox label="Products" value={stats.total.toString()} icon={Package} />
            <StatBox label="Healthy" value={stats.healthy.toString()} iconColor="text-emerald-400" />
            <StatBox label="Low Stock" value={stats.low.toString()} iconColor="text-amber-400" />
            <StatBox label="Critical" value={stats.critical.toString()} iconColor="text-red-500" />
            <StatBox label="Open Bottles" value={stats.openTotal.toString()} icon={Droplets} iconColor="text-[#d4a24c]" />
            <StatBox label="Total Value" value={`N$ ${(stats.totalValue / 1000).toFixed(0)}k`} iconColor="text-[#d4a24c]" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product or SKU..."
              className="w-full pl-10 pr-3 py-2.5 bg-[#0f0f13] border border-[#26262d] rounded-lg text-sm focus:outline-none focus:border-[#d4a24c]/50 transition-colors"
            />
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2.5 bg-[#0f0f13] border border-[#26262d] rounded-lg text-sm text-slate-200 appearance-none cursor-pointer">
            {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
          </select>

          <select value={location} onChange={(e) => setLocation(e.target.value)} className="px-3 py-2.5 bg-[#0f0f13] border border-[#26262d] rounded-lg text-sm text-slate-200 appearance-none cursor-pointer">
            {locations.map(l => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2.5 bg-[#0f0f13] border border-[#26262d] rounded-lg text-sm text-slate-200 appearance-none cursor-pointer">
            <option value="name">Sort: Name</option>
            <option value="qty">Sort: Quantity</option>
            <option value="price">Sort: Price</option>
            <option value="status">Sort: Status</option>
          </select>
        </div>

        {/* Status pill filters */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'Normal', 'Low', 'Critical', 'favorite'] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                status === s ? 'bg-[#d4a24c] text-black' : 'bg-[#0f0f13] border border-[#26262d] text-slate-400 hover:text-white'
              }`}
            >
              {s === 'all' ? 'All' : s === 'favorite' ? '★ Favorites' : s}
            </button>
          ))}
          {allTags.length > 0 && <div className="w-px bg-[#26262d] mx-1" />}
          {allTags.slice(0, 6).map(t => (
            <button
              key={t}
              onClick={() => setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                selectedTags.includes(t) ? 'bg-[#d4a24c]/20 text-[#e9c27a] border border-[#d4a24c]/40' : 'bg-[#0f0f13] border border-[#26262d] text-slate-400 hover:text-white'
              }`}
            >
              <Tag className="w-3 h-3" /> {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Showing {filtered.length} of {bottles.length} products</span>
        <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-[#d4a24c]" /> Live data synced</span>
      </div>

      {/* GRID VIEW - Premium large cards with real images */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(b => (
            <BottleCard
              key={b.id}
              bottle={b}
              onAction={handleAction}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {/* COMPACT VIEW */}
      {viewMode === 'compact' && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#26262d]">
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500">Product</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500">SKU</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500">Location</th>
                  <th className="px-4 py-3 text-center text-[10px] uppercase tracking-widest text-slate-500">Stock</th>
                  <th className="px-4 py-3 text-center text-[10px] uppercase tracking-widest text-slate-500">Open</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest text-slate-500">Price</th>
                  <th className="px-4 py-3 text-center text-[10px] uppercase tracking-widest text-slate-500">Status</th>
                  <th className="px-4 py-3 text-right text-[10px] uppercase tracking-widest text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26262d]">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-[#1a1a20]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <BottleThumb bottle={b} size={32} />
                        <div>
                          <div className="font-medium text-white text-sm">{b.name}</div>
                          <div className="text-[10px] text-slate-500">{b.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{b.sku}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{b.location || '—'}</td>
                    <td className={`px-4 py-3 text-center font-bold ${b.status === 'Critical' ? 'text-red-500' : b.status === 'Low' ? 'text-amber-400' : 'text-white'}`}>{b.quantity}</td>
                    <td className="px-4 py-3 text-center text-slate-400">{b.openBottles || 0}</td>
                    <td className="px-4 py-3 text-right text-[#d4a24c] font-semibold">N$ {b.price}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-md ring-1 ${statusStyles[b.status].bg} ${statusStyles[b.status].text} ${statusStyles[b.status].ring}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[b.status].dot} ${b.status !== 'Normal' ? 'pulse-dot' : ''}`} />
                        {statusStyles[b.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <button onClick={() => handleAction(b.id, 'IN')} className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500/20 font-semibold">+</button>
                        <button onClick={() => handleAction(b.id, 'OUT')} className="px-2 py-1 rounded bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 font-semibold">−</button>
                        <button onClick={() => handleAction(b.id, 'OPEN')} className="px-2 py-1 rounded bg-[#d4a24c]/10 text-[#d4a24c] text-xs hover:bg-[#d4a24c]/20 font-semibold">◎</button>
                        <button onClick={(e) => toggleFavorite(b.id, e)} className={`px-2 py-1 rounded text-xs ${b.favorite ? 'text-[#d4a24c]' : 'text-slate-500 hover:text-[#d4a24c]'}`}><Star className="w-3 h-3" fill={b.favorite ? 'currentColor' : 'none'} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SHELF VIEW - arranged like shelves */}
      {viewMode === 'shelf' && (
        <div className="space-y-6">
          {categories.filter(c => c !== 'All').map(cat => {
            const catBottles = filtered.filter(b => b.category === cat);
            if (catBottles.length === 0) return null;
            return (
              <div key={cat} className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white text-sm flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#d4a24c] rounded-full" />
                    {cat}
                    <span className="text-xs text-slate-500 font-normal ml-1">({catBottles.length})</span>
                  </h3>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin">
                  {catBottles.map(b => (
                    <div key={b.id} className="flex-shrink-0 w-24 group/bottle relative">
                      <BottleImage bottle={b} size={80} />
                      <div className="text-center mt-2">
                        <div className="text-[10px] text-white font-semibold truncate">{b.name}</div>
                        <div className={`text-lg font-bold leading-tight ${b.status === 'Critical' ? 'text-red-500' : b.status === 'Low' ? 'text-amber-400' : 'text-white'}`}>{b.quantity}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-[#26262d] to-transparent mt-4" />
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="glass-card p-16 text-center">
          <Package className="w-14 h-14 mx-auto mb-3 text-slate-700" />
          <div className="text-lg font-semibold text-slate-400">No products match your filters</div>
          <div className="text-sm text-slate-500 mt-1">Try adjusting your search or clearing filters</div>
        </div>
      )}
    </div>
  );
}

// ============ COMPONENTS ============

function BottleImage({ bottle, size = 120 }: { bottle: Bottle; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = BOTTLE_IMAGES[bottle.id];
  const useImage = imageUrl && !imgError;

  return (
    <div 
      className="relative flex items-end justify-center" 
      style={{ height: size * 1.4, width: size }}
    >
      {/* Glass bottle glow effect */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#d4a24c]/5 to-transparent blur-xl rounded-b-full" />
      
      {useImage ? (
        <img
          src={imageUrl}
          alt={bottle.name}
          onError={() => setImgError(true)}
          className="relative z-10 object-contain h-full w-auto drop-shadow-2xl transition-transform group-hover/bottle:scale-105"
          style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' }}
          loading="lazy"
        />
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-end h-full w-3/4 mx-auto rounded-t-lg rounded-b-sm bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-xl overflow-hidden">
          <div className="absolute top-1 left-1 right-1 h-1/3 bg-gradient-to-br from-white/10 to-transparent" />
          <div className="absolute bottom-4 left-0 right-0 h-6 bg-black/40 flex items-center justify-center">
            <span className="text-[6px] text-white/60 font-bold tracking-wider truncate px-1">{bottle.name.split(' ')[0].toUpperCase()}</span>
          </div>
          <BottleIcon bottle={bottle} className="w-8 h-8 text-white/80 -mb-2 z-10 relative" />
        </div>
      )}
    </div>
  );
}

function BottleThumb({ bottle, size = 40 }: { bottle: Bottle; size?: number }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = BOTTLE_IMAGES[bottle.id];
  if (imageUrl && !imgError) {
    return (
      <div className="relative" style={{ width: size * 0.7, height: size }}>
        <img
          src={imageUrl}
          alt=""
          onError={() => setImgError(true)}
          className="h-full w-auto object-contain drop-shadow"
          loading="lazy"
        />
      </div>
    );
  }
  return <div className="w-8 h-10 flex items-end justify-center"><BottleIcon bottle={bottle} className="w-6 h-6 text-slate-400" /></div>;
}

function BottleCard({ bottle, onAction, onToggleFavorite }: {
  bottle: Bottle;
  onAction: (id: number, t: 'IN' | 'OUT' | 'OPEN') => void;
  onToggleFavorite: (id: number, e: React.MouseEvent) => void;
}) {
  const s = statusStyles[bottle.status];
  const retailValue = bottle.quantity * bottle.price;

  return (
    <div 
      className="group/bottle relative glass-card p-4 hover:border-[#d4a24c]/40 transition-all hover:-translate-y-0.5 cursor-pointer"
    >
      {/* Status pill */}
      <div className="absolute top-3 left-3 z-20">
        <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded ring-1 ${s.bg} ${s.text} ${s.ring}`}>
          <span className={`w-1 h-1 rounded-full ${s.dot} ${bottle.status !== 'Normal' ? 'pulse-dot' : ''}`} />
        </span>
      </div>

      {/* Favorite */}
      <button
        onClick={(e) => onToggleFavorite(bottle.id, e)}
        className="absolute top-3 right-3 z-20 p-1 rounded transition-all"
      >
        <Star className={`w-4 h-4 ${bottle.favorite ? 'fill-[#d4a24c] text-[#d4a24c]' : 'text-slate-600 group-hover/bottle:text-slate-400'}`} />
      </button>

      {/* Image with shelf effect */}
      <div className="relative flex justify-center pt-4 pb-2 h-40 items-end">
        <div className="absolute inset-0 bg-gradient-to-b from-[#d4a24c]/5 via-transparent to-transparent rounded-t-2xl opacity-0 group-hover/bottle:opacity-100 transition-opacity" />
        {/* Shelf */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a24c]/20 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-gradient-to-b from-black/40 to-black/5 blur-md rounded-full" />
        <div className="relative z-10 transition-transform duration-300 group-hover/bottle:scale-105 group-hover/bottle:-translate-y-1">
          <BottleImage bottle={bottle} size={100} />
        </div>
      </div>

      {/* Info */}
      <div className="relative z-10 mt-2">
        <div className="font-semibold text-white text-sm leading-tight truncate text-center" title={bottle.name}>{bottle.name}</div>
        <div className="text-[10px] text-slate-500 font-mono text-center mt-0.5">{bottle.sku}</div>
        
        {bottle.location && (
          <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-slate-500">
            <MapPin className="w-2.5 h-2.5" />
            {bottle.location}
          </div>
        )}

        <div className="flex items-baseline justify-center gap-2 mt-3">
          <div className={`text-3xl font-bold tracking-tight leading-none ${bottle.status === 'Critical' ? 'text-red-500' : bottle.status === 'Low' ? 'text-amber-400' : 'text-white'}`}>{bottle.quantity}</div>
          {(bottle.openBottles || 0) > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-[#d4a24c]">
              <Droplets className="w-2.5 h-2.5" />
              <span>{bottle.openBottles}</span>
            </div>
          )}
        </div>

        <div className="text-[10px] text-center text-slate-500 mt-1">N$ {bottle.price} • Retail value: N$ {retailValue.toLocaleString()}</div>

        {/* Tags */}
        {bottle.tags && bottle.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center mt-2">
            {bottle.tags.slice(0, 2).map((t: string) => (
              <span key={t} className="text-[8px] px-1.5 py-0.5 rounded bg-[#d4a24c]/10 text-[#e9c27a] uppercase tracking-wider font-semibold">{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Bar - appears on hover */}
      <div className={`absolute bottom-0 left-0 right-0 p-2 flex gap-1 opacity-0 group-hover/bottle:opacity-100 transition-all translate-y-2 group-hover/bottle:translate-y-0 z-20`}>
        <div className="w-full flex gap-1 p-1.5 rounded-lg bg-[#0a0a0e]/95 backdrop-blur border border-[#26262d]">
          <button
            onClick={(e) => { e.stopPropagation(); onAction(bottle.id, 'IN'); }}
            className="flex-1 py-1.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 text-[10px] font-bold"
            title="Restock 1"
          >
            <Plus className="w-3 h-3 mx-auto" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAction(bottle.id, 'OUT'); }}
            className="flex-1 py-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500 text-[10px] font-bold"
            title="Sell 1"
          >
            <Minus className="w-3 h-3 mx-auto" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAction(bottle.id, 'OPEN'); }}
            className="flex-1 py-1.5 rounded bg-[#d4a24c]/20 text-[#d4a24c] hover:bg-[#d4a24c]/40 text-[10px] font-bold"
            title="Open bottle"
          >
            <Droplets className="w-3 h-3 mx-auto" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, icon: Icon, iconColor = 'text-white' }: { label: string; value: string; icon?: any; iconColor?: string }) {
  return (
    <div className="bg-[#0a0a0e]/60 border border-[#26262d] rounded-lg p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</span>
        {Icon && <Icon className={`w-3.5 h-3.5 ${iconColor} opacity-70`} />}
      </div>
      <div className={`text-lg font-bold mt-1 ${iconColor}`}>{value}</div>
    </div>
  );
}
