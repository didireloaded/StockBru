import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Command, CornerDownLeft, ArrowRight, Clock, Pin, 
  ShoppingCart, Plus, ClipboardCheck, Users, FileText, Sliders, 
  Activity, Droplets, TrendingUp, AlertTriangle, CheckCircle2, 
  Package, MapPin, DollarSign, ExternalLink, ShieldAlert, Zap
} from 'lucide-react';
import { Bottle, Sale, PurchaseOrder, Stocktake } from '../types';
import { BOTTLE_IMAGES } from '../data/seed';
import { BottleIcon } from './BottleIcon';

interface SearchResult {
  id: string;
  category: 'Commands & Actions' | 'Navigation & Workflows' | 'Catalog Products' | 'Suppliers & Partners' | 'Staff & Shifts' | 'Reports & Analytics' | 'System & Settings';
  title: string;
  subtitle: string;
  icon: any;
  targetNav: string;
  subData?: any;
  action?: () => void;
  requiredRole?: string;
  matchScore?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (tabId: string, subData?: any) => void;
  bottles?: Bottle[];
  sales?: Sale[];
  pos?: PurchaseOrder[];
  stocktakes?: Stocktake[];
  suppliers?: any[];
  userRole?: string;
}

const SYNONYMS: Record<string, string[]> = {
  'jd': ['johnnie walker', 'whiskey'],
  'coke': ['coca-cola', 'mixer'],
  'storeroom': ['main bar', 'fridge', 'storage', 'shelf'],
  'po': ['purchase order', 'order', 'procurement', 'supplier'],
  'kpi': ['reports', 'analytics', 'valuation', 'margin'],
  'staff': ['peter', 'john', 'mary', 'ashley', 'sarah', 'pedro', 'bartender', 'shift'],
  'theft': ['variance', 'stocktake', 'loss', 'spillage'],
  'ai': ['operations intelligence', 'forecasting', 'risks', 'rules'],
};

export function CommandPalette({ 
  open, onClose, onNavigate, 
  bottles = [], sales = [], pos = [], stocktakes = [], suppliers = [], 
  userRole = 'Manager' 
}: Props) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Products' | 'Commands' | 'Reports' | 'Staff'>('All');
  const [recentSearches, setRecentSearches] = useState<string[]>(['Ciroc Original', 'Create Purchase Order', 'Peter']);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Fuzzy match logic
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const checkMatch = (target: string, search: string) => {
    const normTarget = normalize(target);
    const normSearch = normalize(search);
    if (!normSearch) return true;
    if (normTarget.includes(normSearch)) return true;
    
    // Check synonyms
    for (const [key, vals] of Object.entries(SYNONYMS)) {
      if (normSearch.includes(key) || key.includes(normSearch)) {
        if (vals.some(v => normTarget.includes(normalize(v)))) return true;
      }
    }
    return false;
  };

  // Build Master Search Index
  const masterResults = useMemo(() => {
    const list: SearchResult[] = [];

    // 1. Executable Commands & Actions
    const commands = [
      { title: 'Create Purchase Order', sub: 'Launch procurement workflow for supplier restocking', nav: 'pos', icon: ShoppingCart, role: 'Stock Controller' },
      { title: 'Start Blind Stock Take', sub: 'Initiate variance counting audit across rooms & fridges', nav: 'stocktake', icon: ClipboardCheck, role: 'Bartender' },
      { title: 'Clock In / Start Shift', sub: 'Open bartender station POS cash register', nav: 'shifts', icon: Activity, role: 'Bartender' },
      { title: 'Add New Catalog Product', sub: 'Register master SKU, glass tare weight & shot yield', nav: 'inventory', icon: Plus, role: 'Manager' },
      { title: 'Receive Stock Delivery', sub: 'Log inbound supplier delivery notes', nav: 'pos', icon: Package, role: 'Stock Controller' },
      { title: 'Export Master Valuation Report', sub: 'Download CSV inventory audit sheet', nav: 'reports', icon: FileText, role: 'Manager' },
    ];
    commands.forEach(c => {
      list.push({
        id: `cmd_${c.title}`,
        category: 'Commands & Actions',
        title: c.title,
        subtitle: c.sub,
        icon: c.icon,
        targetNav: c.nav,
        requiredRole: c.role,
      });
    });

    // 2. Navigation & Workflows
    const navItems = [
      { title: 'Operations Control Center', sub: 'Real-time daily KPI scorecard', nav: 'overview' },
      { title: 'Inventory Explorer', sub: 'Catalog SKU table, batch management & filtering', nav: 'inventory' },
      { title: 'Smart Fridge Grid', sub: 'Visual shelf temperature & spillage monitoring', nav: 'smartfridge' },
      { title: 'POS Bartender Register', sub: 'Fast point of sale receipt logging', nav: 'pos' },
      { title: 'Operations Intelligence Hub', sub: 'Live relational database calculations & risk detection', nav: 'ai' },
      { title: 'Open Bottle Center', sub: 'Sub-shot exact remaining volume tracking', nav: 'openbottles' },
      { title: 'Interactive Reports & Calendar', sub: 'Deep financial lookups & historical timelines', nav: 'reports' },
      { title: 'Staff Shifts & Roster', sub: 'Shift performance & cash reconciliation logs', nav: 'shifts' },
      { title: 'Supplier Intelligence Profiles', sub: 'Spend tracking & lead time analytics', nav: 'suppliers' },
    ];
    navItems.forEach(n => {
      list.push({
        id: `nav_${n.nav}`,
        category: 'Navigation & Workflows',
        title: n.title,
        subtitle: n.sub,
        icon: ArrowRight,
        targetNav: n.nav,
      });
    });

    // 3. Catalog Products
    bottles.forEach(b => {
      list.push({
        id: `prod_${b.id}`,
        category: 'Catalog Products',
        title: b.name,
        subtitle: `${b.category} • ${b.location} • N$ ${b.cost} cost / N$ ${b.price} retail`,
        icon: Package,
        targetNav: 'inventory',
        subData: b,
      });
    });

    // 4. Staff & Team
    const staffMembers = ['Peter (Morning Bartender)', 'John (Night Bartender)', 'Mary (VIP Server)', 'Ashley (Cocktail Specialist)', 'Sarah (Head Cashier)', 'Pedro (Operations Manager)'];
    staffMembers.forEach(st => {
      list.push({
        id: `staff_${st}`,
        category: 'Staff & Shifts',
        title: st,
        subtitle: 'Click to view shift history and sales collected',
        icon: Users,
        targetNav: 'shifts',
        subData: { user: st.split(' ')[0] },
      });
    });

    // 5. Suppliers
    const supplierList = suppliers.length > 0 ? suppliers : [{ id: 1, name: 'NamBev Distributors', contact: 'John Smith' }, { id: 2, name: 'Distell Premium Logistics', contact: 'Sarah Jenkins' }, { id: 3, name: 'Heineken Wholesale', contact: 'Marc De Vries' }];
    supplierList.forEach(sup => {
      list.push({
        id: `sup_${sup.id}`,
        category: 'Suppliers & Partners',
        title: sup.name,
        subtitle: `Primary supplier • Contact: ${sup.contact || 'Account Rep'}`,
        icon: MapPin,
        targetNav: 'suppliers',
        subData: sup,
      });
    });

    // 6. Reports & System Settings
    list.push({ id: 'rep_val', category: 'Reports & Analytics', title: 'Master Inventory Valuation', subtitle: `Total stock invested across ${bottles.length} active SKUs`, icon: TrendingUp, targetNav: 'reports' });
    list.push({ id: 'set_rules', category: 'System & Settings', title: 'Business Inventory Rules', subtitle: 'Configure automated reorder points and spillage thresholds', icon: Sliders, targetNav: 'ai', requiredRole: 'Manager' });

    return list;
  }, [bottles, suppliers]);

  // Filter & Rank Results
  const filteredResults = useMemo(() => {
    let list = masterResults;

    // Permissions check
    if (userRole === 'Bartender' || userRole === 'Viewer') {
      list = list.filter(r => r.requiredRole !== 'Manager' && r.requiredRole !== 'Owner');
    }

    // Tab filter
    if (activeFilter === 'Products') list = list.filter(r => r.category === 'Catalog Products');
    if (activeFilter === 'Commands') list = list.filter(r => r.category === 'Commands & Actions');
    if (activeFilter === 'Reports') list = list.filter(r => r.category === 'Reports & Analytics');
    if (activeFilter === 'Staff') list = list.filter(r => r.category === 'Staff & Shifts');

    // Query Search
    if (query.trim()) {
      list = list.filter(r => checkMatch(r.title + ' ' + r.subtitle + ' ' + r.category, query));
    }

    return list.slice(0, 30);
  }, [masterResults, query, activeFilter, userRole]);

  // Grouping
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    filteredResults.forEach(r => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [filteredResults]);

  const flatList = useMemo(() => Object.values(groupedResults).flat(), [groupedResults]);
  const selectedResult = flatList[selectedIndex] || null;

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, flatList.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatList.length) % Math.max(1, flatList.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedResult) handleSelect(selectedResult);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, flatList, selectedResult]);

  const handleSelect = (res: SearchResult) => {
    // Save to recent
    setRecentSearches(prev => [res.title, ...prev.filter(s => s !== res.title)].slice(0, 5));
    onNavigate(res.targetNav, res.subData);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150" onClick={onClose}>
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-[#121217] border border-[#26262d] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[75vh] max-h-[680px]"
      >
        {/* Left Search Pane */}
        <div className="flex-1 flex flex-col border-r border-[#26262d]/60 overflow-hidden">
          {/* Top Search Input */}
          <div className="p-4 border-b border-[#26262d] flex items-center gap-3 bg-[#16161c]">
            <Search className="w-5 h-5 text-[#d4a24c] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              placeholder="Search StockBru anywhere (Products, Workflows, Staff, POs)..."
              className="flex-1 bg-transparent border-none text-white placeholder-slate-500 text-base focus:outline-none font-medium"
            />
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#22222b] text-[11px] text-slate-400 font-mono">
              <span>ESC</span>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="px-4 py-2.5 border-b border-[#26262d]/60 flex gap-2 overflow-x-auto scrollbar-none bg-[#121217]">
            {(['All', 'Products', 'Commands', 'Reports', 'Staff'] as const).map(f => (
              <button
                key={f}
                onClick={() => { setActiveFilter(f); setSelectedIndex(0); }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${activeFilter === f ? 'bg-[#d4a24c] text-black shadow-md shadow-[#d4a24c]/20' : 'bg-[#1a1a22] text-slate-400 hover:text-white'}`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Results List */}
          <div ref={resultsContainerRef} className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
            {!query && recentSearches.length > 0 && activeFilter === 'All' && (
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-slate-500 px-3 mb-2 tracking-wider">
                  <Clock className="w-3 h-3 text-[#d4a24c]" /> Recent & Pinned Lookups
                </div>
                <div className="flex gap-2 flex-wrap px-2">
                  {recentSearches.map(rs => (
                    <button
                      key={rs}
                      onClick={() => setQuery(rs)}
                      className="px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-[#282834] text-xs text-slate-300 hover:border-[#d4a24c] hover:text-white transition-all flex items-center gap-1.5"
                    >
                      <Pin className="w-3 h-3 text-[#d4a24c]/70" /> {rs}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {flatList.length === 0 ? (
              <div className="text-center py-16 text-slate-500 space-y-2">
                <ShieldAlert className="w-10 h-10 mx-auto text-slate-600" />
                <div className="text-base font-semibold text-slate-400">No matching records</div>
                <div className="text-xs">Try searching synonyms like "JD", "PO", "Coke", or "Storeroom"</div>
              </div>
            ) : (
              Object.entries(groupedResults).map(([cat, items]) => (
                <div key={cat} className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#d4a24c] px-3 py-1">
                    {cat}
                  </div>
                  {items.map(item => {
                    const idx = flatList.indexOf(item);
                    const isSelected = idx === selectedIndex;
                    const IconComponent = item.icon || Package;
                    return (
                      <div
                        key={item.id}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        onClick={() => handleSelect(item)}
                        className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all group ${isSelected ? 'bg-[#d4a24c] text-black shadow-lg shadow-[#d4a24c]/10' : 'hover:bg-[#1a1a22] text-slate-200'}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-black/15 text-black' : 'bg-[#1c1c24] text-[#d4a24c]'}`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 truncate">
                            <div className="font-semibold text-sm truncate">{item.title}</div>
                            <div className={`text-xs truncate ${isSelected ? 'text-black/80 font-medium' : 'text-slate-400'}`}>{item.subtitle}</div>
                          </div>
                        </div>
                        <CornerDownLeft className={`w-4 h-4 flex-shrink-0 ml-2 ${isSelected ? 'text-black opacity-100' : 'text-slate-600 opacity-0 group-hover:opacity-100'}`} />
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 border-t border-[#26262d] bg-[#141419] flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span><kbd className="px-1.5 py-0.5 rounded bg-[#22222b] text-slate-300 font-mono">↑↓</kbd> navigate</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-[#22222b] text-slate-300 font-mono">↵</kbd> select</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-[#22222b] text-slate-300 font-mono">ESC</kbd> close</span>
            </div>
            <span className="text-[#d4a24c] font-semibold flex items-center gap-1"><Zap className="w-3 h-3" /> Spotlight Navigation Engine</span>
          </div>
        </div>

        {/* Right Preview Side Panel */}
        <div className="w-full md:w-80 bg-[#14141a] p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#26262d] overflow-y-auto">
          {selectedResult ? (
            <div className="space-y-5">
              <div className="border-b border-[#26262d] pb-4">
                <span className="text-[10px] uppercase font-bold text-[#d4a24c] tracking-wider bg-[#d4a24c]/10 px-2 py-1 rounded">
                  {selectedResult.category} Preview
                </span>
                <h3 className="text-lg font-bold text-white mt-2 leading-snug">{selectedResult.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{selectedResult.subtitle}</p>
              </div>

              {selectedResult.subData?.sku ? (
                /* Product Preview Card */
                <div className="space-y-4 text-sm">
                  <div className="h-40 bg-[#101014] rounded-xl border border-[#22222a] flex items-center justify-center p-3 relative overflow-hidden">
                    {BOTTLE_IMAGES[selectedResult.subData.id] ? (
                      <img src={BOTTLE_IMAGES[selectedResult.subData.id]} alt={selectedResult.title} className="h-full object-contain drop-shadow-2xl" />
                    ) : (
                      <BottleIcon type={selectedResult.subData.type} className="w-16 h-16 text-[#d4a24c]" />
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold">
                      {selectedResult.subData.status || 'Normal'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-[#1a1a22] border border-[#262630]">
                      <span className="text-slate-500 block text-[10px]">Current Stock</span>
                      <span className="font-bold text-white font-mono text-sm">{selectedResult.subData.quantity} units</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#1a1a22] border border-[#262630]">
                      <span className="text-slate-500 block text-[10px]">Open Bottles</span>
                      <span className="font-bold text-blue-400 font-mono text-sm">{selectedResult.subData.openBottles || 0} active</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#1a1a22] border border-[#262630]">
                      <span className="text-slate-500 block text-[10px]">Cost Price</span>
                      <span className="font-bold text-slate-200 font-mono">N$ {selectedResult.subData.cost}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#1a1a22] border border-[#262630]">
                      <span className="text-slate-500 block text-[10px]">Retail Price</span>
                      <span className="font-bold text-[#d4a24c] font-mono">N$ {selectedResult.subData.price}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button onClick={() => handleSelect(selectedResult)} className="w-full py-2.5 px-4 rounded-xl bg-[#d4a24c] text-black font-bold text-xs hover:bg-[#e9c27a] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4a24c]/10">
                      Open in Inventory Workspace <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : selectedResult.category === 'Commands & Actions' ? (
                /* Command Preview Card */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#1a1a22] border border-[#282834] space-y-2">
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Execution
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Pressing Enter will immediately jump to the dedicated workflow and preload your default branch parameters.
                    </p>
                  </div>
                  <button onClick={() => handleSelect(selectedResult)} className="w-full py-2.5 px-4 rounded-xl bg-[#d4a24c] text-black font-bold text-xs hover:bg-[#e9c27a] transition-all flex items-center justify-center gap-2">
                    Execute Command Now <Zap className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                /* Standard Navigation Preview Card */
                <div className="space-y-4 text-sm text-slate-400">
                  <p className="text-xs leading-relaxed">
                    Navigate directly to this workspace module. All relational data will be instantly synchronized with your active Supabase session.
                  </p>
                  <button onClick={() => handleSelect(selectedResult)} className="w-full py-2 px-4 rounded-lg bg-[#22222c] text-white font-semibold text-xs hover:bg-[#2e2e3a] transition-all flex items-center justify-center gap-2">
                    Jump to Module <ArrowRight className="w-3.5 h-3.5 text-[#d4a24c]" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-slate-600 text-xs">
              Select or hover any item to inspect quick preview details
            </div>
          )}

          <div className="pt-6 border-t border-[#26262d] mt-4 text-[10px] text-slate-500 text-center uppercase tracking-widest font-mono">
            StockBru OS v2.6 • Zero AI Branding
          </div>
        </div>
      </div>
    </div>
  );
}
