import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Refrigerator, Boxes, ClipboardList, ShoppingCart,
  Clock, Truck, FileText, BarChart3, Activity, Bot, Bell, Settings,
  Search, ChevronDown, Package, AlertTriangle, TrendingUp, TrendingDown,
  Wine, Sparkles, CheckCircle2, Droplets, Star, Camera, ArrowLeftRight,
  Globe, MapPin, Command, X, Search as SearchIcon, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Toaster, toast } from 'sonner';
import { Bottle, BottleStatus, ActivityItem, Sale, PurchaseOrder, Supplier, Stocktake, Shift, InventorySnapshot, InventoryMovement, InventoryTransfer, Recommendation } from './types';
import { BOTTLES_SEED, SUPPLIERS_SEED, ACTIVITIES_SEED, MOVEMENTS_SEED } from './data/seed';
import { loadFromStorage, saveToStorage, STORAGE_KEYS, clearAllStorage } from './lib/persistence';
import { calculateBottleStatus, getRecommendations, calculateInventoryHealth, healthLabel, getTopSellers } from './services/inventory.service';
import { syncCloudOnStartup, debouncedCloudSync } from './services/supabase-sync.service';

import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import StockTake from './pages/StockTake';
import PurchaseOrdersPage from './pages/PurchaseOrders';
import Suppliers from './pages/Suppliers';
import Shifts from './pages/Shifts';
import SmartFridge from './pages/SmartFridge';
import Reports from './pages/Reports';
import AIAssistant from './pages/AIAssistant';
import ProductDetail from './pages/ProductDetail';
import OpenBottles from './pages/OpenBottles';
import Snapshots from './pages/Snapshots';
import { ArtistOpsCenter } from './pages/ArtistOpsCenter';
import { LiveOpsBoard } from './pages/LiveOpsBoard';
import { NightclubFlagshipSuite } from './components/ops/NightclubFlagshipSuite';
import SettingsPage from './pages/SettingsPage';
import { Button, Modal } from './components/Primitives';
import { BottleIcon } from './components/BottleIcon';
import { AuthLayout } from './components/AuthLayout';
import { InteractiveWalkthrough } from './components/InteractiveWalkthrough';
import { CommandPalette } from './components/CommandPalette';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileFAB } from './components/MobileFAB';
import { HandheldKeypad } from './components/HandheldKeypad';
import { SyncBanner } from './components/SyncBanner';
import { DEMO_SCENARIOS, DemoScenarioType, getEnterpriseCatalog, generateScenarioLedger } from './services/scenario.service';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'liveboard', label: 'Live Ops Board', icon: Radio },
  { id: 'events', label: 'Artist Ops Center', icon: Sparkles },
  { id: 'fridge', label: 'Smart Fridge', icon: Refrigerator },
  { id: 'inventory', label: 'Inventory', icon: Boxes },
  { id: 'open-bottles', label: 'Open Bottles', icon: Droplets },
  { id: 'stocktake', label: 'Stock Take', icon: ClipboardList },
  { id: 'sales', label: 'Sales', icon: ShoppingCart },
  { id: 'shifts', label: 'Shifts', icon: Clock },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'purchase', label: 'Purchase Orders', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'ai', label: 'Operations Intelligence', icon: Activity },
  { id: 'intelligence', label: 'Item Snapshots', icon: Camera },
];

const PRODUCT_DETAIL_NAV = 'product-detail';

const statusStyles: Record<BottleStatus, { dot: string; text: string }> = {
  Normal: { dot: 'bg-emerald-400', text: 'text-emerald-400' },
  Low: { dot: 'bg-amber-400', text: 'text-amber-400' },
  Critical: { dot: 'bg-red-500', text: 'text-red-500' },
  'Out of Stock': { dot: 'bg-slate-600', text: 'text-slate-400' },
  Overstocked: { dot: 'bg-purple-500', text: 'text-purple-400' },
};

export default function App() {
  const [activeNav, setActiveNav] = useState('overview');
  const [viewingBottleId, setViewingBottleId] = useState<number | null>(null);
  const [workspace, setWorkspace] = useState('All Locations');
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showHandheldKeypad, setShowHandheldKeypad] = useState(false);
  const [authState, setAuthState] = useState<'authenticating' | 'authenticated'>('authenticating');
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'Pedro Manager', role: 'Manager', company: 'StockBru Hospitality Group', branch: 'Main Bar & VIP Lounge' });
  const [unreadCount, setUnreadCount] = useState(() => loadFromStorage('stockbru-unread-count', 0));
  const [demoScenario, setDemoScenarioState] = useState<DemoScenarioType>(() => loadFromStorage('stockbru-demo-scenario', 'busy_friday'));

  // ─── Persisted state ───
  const [bottles, setBottles] = useState<Bottle[]>(() => loadFromStorage(STORAGE_KEYS.BOTTLES, BOTTLES_SEED));
  const [activities, setActivities] = useState<ActivityItem[]>(() => loadFromStorage(STORAGE_KEYS.ACTIVITIES, ACTIVITIES_SEED));
  const [sales, setSales] = useState<Sale[]>(() => loadFromStorage(STORAGE_KEYS.SALES, []));
  const [pos, setPOs] = useState<PurchaseOrder[]>(() => loadFromStorage(STORAGE_KEYS.POS, []));
  const [stocktakes, setStocktakes] = useState<Stocktake[]>(() => loadFromStorage(STORAGE_KEYS.STOCKTAKES, []));
  const [shifts, setShifts] = useState<Shift[]>(() => loadFromStorage(STORAGE_KEYS.SHIFTS, []));
  const [suppliers, setSuppliers] = useState<Supplier[]>(() => loadFromStorage(STORAGE_KEYS.SUPPLIERS, SUPPLIERS_SEED));
  const [snapshots, setSnapshots] = useState<InventorySnapshot[]>(() => loadFromStorage(STORAGE_KEYS.SNAPSHOTS, []));
  const [movements, setMovements] = useState<InventoryMovement[]>(() => loadFromStorage(STORAGE_KEYS.MOVEMENTS, MOVEMENTS_SEED));
  const [transfers, setTransfers] = useState<InventoryTransfer[]>(() => loadFromStorage(STORAGE_KEYS.TRANSFERS, []));
  const [cloudStatus, setCloudStatus] = useState<'connected' | 'syncing' | 'offline'>('syncing');

  useEffect(() => {
    syncCloudOnStartup({
      setBottles, setSuppliers, setActivities, setSales, setPOs, setStocktakes, setShifts, setSnapshots, setMovements, setTransfers, setCloudStatus
    });
  }, []);

  useEffect(() => { saveToStorage(STORAGE_KEYS.BOTTLES, bottles); debouncedCloudSync('bottles', bottles); }, [bottles]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.ACTIVITIES, activities); debouncedCloudSync('activities', activities); }, [activities]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SALES, sales); debouncedCloudSync('sales', sales); }, [sales]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.POS, pos); debouncedCloudSync('purchase_orders', pos); }, [pos]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.STOCKTAKES, stocktakes); debouncedCloudSync('stocktakes', stocktakes); }, [stocktakes]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SHIFTS, shifts); debouncedCloudSync('shifts', shifts); }, [shifts]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SUPPLIERS, suppliers); debouncedCloudSync('suppliers', suppliers); }, [suppliers]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.SNAPSHOTS, snapshots); debouncedCloudSync('snapshots', snapshots); }, [snapshots]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.MOVEMENTS, movements); debouncedCloudSync('movements', movements); }, [movements]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.TRANSFERS, transfers); debouncedCloudSync('transfers', transfers); }, [transfers]);
  useEffect(() => { saveToStorage('stockbru-unread-count', unreadCount); }, [unreadCount]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ─── Scoped Data ───
  const scopedBottles = useMemo(() => {
    if (workspace === 'All Locations') return bottles;
    return bottles.filter(b => b.location === workspace);
  }, [bottles, workspace]);

  const scopedSales = useMemo(() => sales, [sales]);
  const scopedMovements = useMemo(() => movements, [movements]);

  // ─── Computed KPIs ───
  const totalValue = useMemo(() => scopedBottles.reduce((s, b) => s + b.quantity * b.cost, 0), [scopedBottles]);
  const openBottlesCount = useMemo(() => scopedBottles.reduce((s, b) => s + (b.openBottles || 0), 0), [scopedBottles]);
  const lowStockItems = useMemo(() => scopedBottles.filter(b => b.status === 'Low' || b.status === 'Critical' || b.status === 'Out of Stock'), [scopedBottles]);
  const criticalItems = useMemo(() => scopedBottles.filter(b => b.status === 'Critical' || b.status === 'Out of Stock'), [scopedBottles]);
  const recommendations: Recommendation[] = useMemo(() => getRecommendations(bottles, movements), [bottles, movements]);
  const favoriteBottles = useMemo(() => bottles.filter(b => b.favorite), [bottles]);
  const invHealth = useMemo(() => calculateInventoryHealth(scopedBottles, stocktakes), [scopedBottles, stocktakes]);
  const invHealthText = healthLabel(invHealth);
  const topSellers = useMemo(() => getTopSellers(bottles, movements, 5), [bottles, movements]);
  const stCompleted = useMemo(() => stocktakes.filter(s => s.status === 'completed').length, [stocktakes]);
  const stTotal = stocktakes.length;
  const stPct = stTotal > 0 ? Math.round((stCompleted / stTotal) * 100) : 0;

  const revenueTrend = useMemo(() => {
    const byDay = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      byDay.set(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 0);
    }
    scopedSales.forEach(s => {
      const key = new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (byDay.has(key)) byDay.set(key, (byDay.get(key) || 0) + s.total);
    });
    return Array.from(byDay.entries()).map(([date, v]) => ({ date, v }));
  }, [scopedSales]);

  const inventoryTrendData = useMemo(() => {
    const days = 14;
    const result: { date: string; value: number }[] = [];
    let currentValue = totalValue;
    const dailyDeltas = new Map<string, number>();
    movements.forEach(m => {
      const d = new Date(m.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const bottle = bottles.find(b => b.id === m.bottleId);
      if (!bottle) return;
      const delta = m.type === 'received' ? m.qty * bottle.cost : -(m.qty * bottle.cost);
      dailyDeltas.set(d, (dailyDeltas.get(d) || 0) + delta);
    });
    for (let i = 0; i < days; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      result.unshift({ date: key, value: Math.max(0, Math.round(currentValue)) });
      currentValue -= (dailyDeltas.get(key) || 0);
    }
    return result;
  }, [bottles, movements, totalValue]);

  // ─── Actions ───
  const logActivity = useCallback((a: Omit<ActivityItem, 'id' | 'time'>) => {
    setActivities(prev => [{ ...a, id: Date.now() + Math.random(), time: new Date().toISOString() }, ...prev]);
    setUnreadCount(c => c + 1);
  }, []);

  const handleBottleAction = useCallback((id: number, type: 'IN' | 'OUT' | 'OPEN') => {
    const b = bottles.find(x => x.id === id);
    if (!b) return;
    if (type === 'OUT' && b.quantity <= 0) { toast.error('Out of stock!'); return; }
    if (type === 'OPEN' && b.quantity <= 0) { toast.error('No bottles to open!'); return; }
    setBottles(prev => prev.map(x => {
      if (x.id !== id) return x;
      let q = x.quantity;
      let o = x.openBottles || 0;
      if (type === 'IN') q += 1;
      if (type === 'OUT') q -= 1;
      if (type === 'OPEN') { q -= 1; o += 1; }
      const updated = { ...x, quantity: q, openBottles: o, lastMovementAt: new Date().toISOString() };
      return { ...updated, status: calculateBottleStatus(updated) };
    }));
    const movement: InventoryMovement = {
      id: Date.now(), timestamp: new Date().toISOString(),
      type: type === 'IN' ? 'received' : type === 'OPEN' ? 'opened_bottle' : 'sold',
      bottleId: b.id, bottleName: b.name, sku: b.sku, qty: 1, user: 'Pedro Manager',
    };
    setMovements(prev => [movement, ...prev]);
    logActivity({
      type: type === 'IN' ? 'purchase' : 'sale',
      title: `${type === 'IN' ? 'Restocked' : type === 'OPEN' ? 'Opened' : 'Sold'} 1 × ${b.name}`,
      subtitle: type === 'IN' ? 'Stock received' : type === 'OPEN' ? 'Bottle opened' : 'Bottle sold',
      user: 'Pedro Manager'
    });
    toast.success(`${b.name} updated`);
  }, [bottles, logActivity]);

  const clearAllData = useCallback(() => {
    clearAllStorage();
    setBottles(BOTTLES_SEED); setActivities(ACTIVITIES_SEED); setSales([]); setPOs([]);
    setStocktakes([]); setShifts([]); setSuppliers(SUPPLIERS_SEED); setSnapshots([]);
    setMovements(MOVEMENTS_SEED); setTransfers([]); setUnreadCount(0);
    setShowResetConfirm(false);
    toast.info('Data reset to demo defaults');
  }, []);

  const handleSwitchScenario = useCallback((s: DemoScenarioType) => {
    saveToStorage('stockbru-demo-scenario', s);
    setDemoScenarioState(s);
    const newCatalog = getEnterpriseCatalog(s);
    const newLedger = generateScenarioLedger(newCatalog, s);
    setBottles(newCatalog);
    setMovements(newLedger.movements);
    setActivities(newLedger.activities);
    setSales(newLedger.sales);
    toast.success(`Switched to scenario: ${DEMO_SCENARIOS[s].label}`);
  }, []);

  const WORKSPACES = useMemo(() => ['All Locations', 'Main Fridge', 'VIP Fridge', 'Storeroom', 'Cold Room', 'Display Shelf', 'Main Bar'], []);

  if (viewingBottleId !== null && activeNav === PRODUCT_DETAIL_NAV) {
    return (
      <div className="min-h-screen bg-[#0b0b0e] text-[13px]">
        <Toaster theme="dark" position="top-right" />
        <main className="p-6 max-w-5xl mx-auto">
          <ProductDetail bottleId={viewingBottleId} bottles={bottles} setBottles={setBottles} movements={movements} setMovements={setMovements} logActivity={logActivity} suppliers={suppliers} onBack={() => { setViewingBottleId(null); setActiveNav('inventory'); }} />
        </main>
      </div>
    );
  }

  if (authState === 'authenticating') {
    return <AuthLayout onAuthenticated={(u) => { setAuthState('authenticated'); setCurrentUser(u); if (u.isFirstLogin) setShowWalkthrough(true); }} />;
  }

  return (
    <div className="min-h-screen flex text-[13px]">
      <Toaster theme="dark" position="top-right" />

      {/* Sidebar (Desktop Management Viewport ≥768px) */}
      <aside className="hidden md:flex w-64 shrink-0 bg-[#0d0d11] border-r border-[#1d1d24] flex-col h-screen sticky top-0">
        <div className="px-5 h-16 flex items-center gap-3 border-b border-[#1d1d24]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4a24c] to-[#8a6520] flex items-center justify-center shadow-lg shadow-amber-900/20"><Wine className="w-5 h-5 text-black" /></div>
          <div className="font-bold tracking-wider text-white text-sm">STOCKBRU <span className="text-[#d4a24c] font-mono text-[11px]">OS</span></div>
        </div>
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-thin">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeNav === item.id;
            return (
              <button key={item.id} onClick={() => { setActiveNav(item.id); setViewingBottleId(null); }} className={`nav-link w-full flex items-center gap-3 px-5 py-2.5 text-[13px] text-slate-400 hover:text-slate-200 transition-all duration-200 ${active ? 'active' : ''}`}>
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={active ? 2.2 : 1.7} /><span>{item.label}</span>
              </button>
            );
          })}
          <div className="mt-3 px-5 space-y-1">
            <div className="text-[10px] uppercase tracking-[1.5px] text-slate-600 mt-6 mb-2 px-1">System</div>
            <button onClick={() => setShowNotifications(true)} className="nav-link w-full flex items-center gap-3 pl-5 py-2.5 text-slate-400 hover:text-slate-200 transition-all duration-200">
              <Bell className="w-4 h-4" /> Notifications
              {unreadCount > 0 && <span className="ml-auto mr-3 text-[10px] bg-[#d4a24c] text-black font-bold rounded-full w-5 h-5 flex items-center justify-center">{Math.min(99, unreadCount)}</span>}
            </button>
            <button onClick={() => { setActiveNav('settings'); setViewingBottleId(null); }} className={`nav-link w-full flex items-center gap-3 pl-5 py-2.5 transition-all duration-200 ${activeNav === 'settings' ? 'text-[#d4a24c] font-bold bg-[#181822]' : 'text-slate-400 hover:text-slate-200'}`}>
              <Settings className="w-4 h-4" /> Club Settings
            </button>
          </div>
        </nav>
        <div className="border-t border-[#1d1d24] p-4 space-y-2">
          <button onClick={() => setShowResetConfirm(true)} className="w-full text-[10px] text-slate-600 hover:text-red-400 text-left px-2 transition-colors">Reset Demo Data</button>
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4a24c] to-[#8a6520] flex items-center justify-center text-black font-bold text-xs">PM</div>
            <div className="flex-1 text-left"><div className="text-sm font-medium text-white leading-tight">Pedro Manager</div><div className="text-[11px] text-slate-500 leading-tight">Admin</div></div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 pb-16 md:pb-0">
        <SyncBanner />
        <header className="h-16 border-b border-[#1d1d24] bg-[#0d0d11]/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#141419] border border-[#262632] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-[#d4a24c] uppercase tracking-wider">
                {(currentUser as any).workArea || 'Main Bar'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-300 font-semibold truncate max-w-[180px]">
                {(currentUser as any).event || DEMO_SCENARIOS[demoScenario].activeEvent}
              </span>
            </div>

            <select
              value={demoScenario}
              onChange={(e) => handleSwitchScenario(e.target.value as DemoScenarioType)}
              className="bg-[#181822] border border-[#d4a24c]/40 hover:border-[#d4a24c] text-[#d4a24c] text-xs font-bold rounded-xl px-3 py-2 cursor-pointer transition-all outline-none shadow-sm font-mono"
              title="Switch Nightclub Operating Demo Scenario"
            >
              {Object.values(DEMO_SCENARIOS).map(sc => (
                <option key={sc.id} value={sc.id} className="bg-[#111116] text-white font-sans">
                  🌟 Scenario: {sc.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer" onClick={() => setShowCommandPalette(true)}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4a24c] transition-colors" />
              <input readOnly type="text" placeholder="Search StockBru anywhere (⌘K)..." className="pl-9 pr-12 py-2 bg-[#16161b] border border-[#26262d] rounded-lg text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-[#d4a24c] cursor-pointer w-56 hover:border-slate-500 transition-all" />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-[#d4a24c] border border-[#d4a24c]/30 px-1.5 py-0.5 rounded bg-[#d4a24c]/10 font-mono font-bold">
                <Command className="w-2.5 h-2.5" /> K
              </div>
            </div>
            <button onClick={() => setShowNotifications(true)} className="relative w-9 h-9 rounded-full hover:bg-[#1a1a20] flex items-center justify-center text-slate-400 transition-colors">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#d4a24c] text-black text-[10px] font-bold flex items-center justify-center">{Math.min(99, unreadCount)}</span>}
            </button>
          </div>
        </header>

        <div className="p-4 md:p-6 space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNav + (viewingBottleId || '') + workspace}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {activeNav === 'overview' && (
                <div className="space-y-5">
                  <NightclubFlagshipSuite onOpenLiveBoard={() => { setActiveNav('liveboard'); setViewingBottleId(null); }} />
                  {/* KPIs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <KpiCard label="Inventory Value" value={`N$ ${totalValue.toLocaleString()}`} change={`${scopedBottles.length} SKUs in ${workspace}`} icon={Package} />
                    <KpiCard label="Inventory Health" value={`${invHealth}%`} change={invHealthText} changeType={invHealth >= 75 ? 'up' : 'down'} icon={CheckCircle2}>
                      <div className="ml-auto"><Donut value={invHealth} size={32} stroke={4} color={invHealth >= 75 ? '#4ade80' : invHealth >= 50 ? '#eab308' : '#ef4444'} /></div>
                    </KpiCard>
                    <KpiCard label="Revenue (incl. VAT)" value={`N$ ${scopedSales.reduce((s, x) => s + x.total, 0).toLocaleString()}`} change={`${scopedSales.length} sales recorded`} icon={TrendingUp}>
                      <div className="ml-auto w-20 h-8">
                        <ResponsiveContainer><LineChart data={revenueTrend}><Line type="monotone" dataKey="v" stroke="#d4a24c" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer>
                      </div>
                    </KpiCard>
                    <KpiCard label="Open Bottles" value={openBottlesCount.toString()} change={`${scopedBottles.length > 0 ? Math.round(openBottlesCount / scopedBottles.length * 100) : 0}% of products`} icon={Droplets} />
                    <KpiCard label="Low / Critical" value={lowStockItems.length.toString()} change={criticalItems.length > 0 ? `${criticalItems.length} critical` : 'All healthy'} changeType={criticalItems.length > 0 ? 'down' : 'up'} icon={AlertTriangle} />
                    <KpiCard label="Movements" value={scopedMovements.length.toString()} change={`${snapshots.length} snapshots`} icon={Activity} />
                  </div>

                  {/* Recommendations */}
                  {recommendations.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-white text-sm flex items-center gap-2 mb-3"><Sparkles className="w-4 h-4 text-[#d4a24c]" /> Requires Attention in {workspace} ({recommendations.length})</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {recommendations.slice(0, 6).map(r => (
                          <motion.div whileHover={{ scale: 1.02 }} key={r.id} className={`glass-card p-4 border-l-4 ${r.priority === 'high' ? 'border-l-red-500' : r.priority === 'medium' ? 'border-l-amber-400' : 'border-l-blue-400'}`}>
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{r.type.replace('_', ' ')}</div>
                            <div className="text-sm font-semibold text-white mb-1">{r.title}</div>
                            <div className="text-xs text-slate-400">{r.description}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="glass-card p-6 xl:col-span-2">
                      <h3 className="font-semibold text-white text-sm mb-6">Inventory Value Trend — {workspace} (14 Days)</h3>
                      <div className="h-64 -ml-4">
                        <ResponsiveContainer>
                          <AreaChart data={inventoryTrendData}>
                            <defs><linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d4a24c" stopOpacity={0.35} /><stop offset="100%" stopColor="#d4a24c" stopOpacity={0} /></linearGradient></defs>
                            <CartesianGrid stroke="#1d1d24" strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" stroke="#555" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#555" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `N$${Math.round(v/1000)}k`} />
                            <Tooltip contentStyle={{ background: '#141418', border: '1px solid #2a2a32', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`N$ ${Number(v).toLocaleString()}`, 'Value']} />
                            <Area type="monotone" dataKey="value" stroke="#d4a24c" strokeWidth={2.5} fill="url(#goldGrad)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <div className="font-semibold text-white text-sm mb-6">Inventory Health — {workspace}</div>
                      <div className="flex items-center gap-5">
                        <div className="relative flex-shrink-0"><Donut value={invHealth} size={130} stroke={12} color={invHealth >= 75 ? '#4ade80' : invHealth >= 50 ? '#eab308' : '#ef4444'} /><div className="absolute inset-0 flex flex-col items-center justify-center"><div className="kpi-value text-3xl gold-gradient-text">{invHealth}%</div><div className={`text-[11px] font-medium ${invHealth >= 75 ? 'text-emerald-400' : invHealth >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{invHealthText}</div></div></div>
                        <div className="flex-1 space-y-2.5 text-xs text-slate-400">
                          <div className="flex justify-between"><span>Normal</span><span className="text-emerald-400 font-medium">{scopedBottles.filter(b=>b.status==='Normal').length}</span></div>
                          <div className="flex justify-between"><span>Low</span><span className="text-amber-400 font-medium">{scopedBottles.filter(b=>b.status==='Low').length}</span></div>
                          <div className="flex justify-between"><span>Critical</span><span className="text-red-500 font-medium">{scopedBottles.filter(b=>b.status==='Critical').length}</span></div>
                          <div className="flex justify-between"><span>Out of Stock</span><span className="text-slate-400 font-medium">{scopedBottles.filter(b=>b.status==='Out of Stock').length}</span></div>
                          <div className="flex justify-between"><span>Overstocked</span><span className="text-purple-400 font-medium">{scopedBottles.filter(b=>b.status==='Overstocked').length}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Widgets */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-white text-sm">Low Stock Alerts</h3><button onClick={() => setActiveNav('inventory')} className="text-[11px] text-[#d4a24c] hover:underline transition-all">View All</button></div>
                      {lowStockItems.length === 0 ? <div className="text-sm text-slate-500 text-center py-6">All products healthy</div> : (
                        <div className="space-y-2">
                          {lowStockItems.slice(0, 5).map(b => (
                            <motion.div whileHover={{ x: 4 }} key={b.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-red-950/30 to-transparent border border-red-900/30 transition-all duration-300 hover:bg-red-950/40">
                              <div className="w-8 h-8 rounded-lg bg-red-950/50 flex items-center justify-center text-red-400"><BottleIcon bottle={b} className="w-5 h-5" /></div>
                              <div className="flex-1 min-w-0"><div className="text-sm font-medium text-white truncate">{b.name}</div><div className="text-[11px] text-red-400">{b.quantity} left • reorder at {b.reorderLevel}</div></div>
                              <button onClick={() => handleBottleAction(b.id, 'IN')} className="text-[10px] px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-semibold transition-colors duration-200">+1</button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="glass-card p-5">
                      <h3 className="font-semibold text-white text-sm mb-4">Recent Activity</h3>
                      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin">
                        {activities.slice(0, 8).map(a => (
                          <div key={a.id} className="activity-row flex gap-3 p-2 rounded-lg -mx-2 transition-colors">
                            <ActivityIcon type={a.type} isAlert={a.isAlert} />
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] text-slate-200 leading-snug">{a.title}</div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="text-[11px] text-slate-500">{a.user || 'System'}</div>
                                <div className="text-[11px] text-slate-500">{formatRelativeTime(a.time)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="glass-card p-5">
                      <div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-white text-sm flex items-center gap-2"><Star className="w-4 h-4 text-[#d4a24c]" /> Favorites</h3><button onClick={() => setActiveNav('fridge')} className="text-[11px] text-[#d4a24c] hover:underline transition-all">View All →</button></div>
                      {favoriteBottles.length === 0 ? <div className="text-center text-sm text-slate-500 py-8">Star products to pin them here.</div> : (
                        <div className="grid grid-cols-3 gap-3">
                          {favoriteBottles.slice(0, 9).map(b => (
                            <motion.div whileHover={{ y: -4 }} key={b.id} className="bottle-card rounded-xl p-3 flex flex-col items-center text-center cursor-pointer hover:border-[#d4a24c]/50 transition-all duration-300" onClick={() => { setViewingBottleId(b.id); setActiveNav(PRODUCT_DETAIL_NAV); }}>
                              <div className="w-10 h-10 rounded-lg bg-[#1d1d24] flex items-center justify-center text-[#d4a24c] mb-2"><BottleIcon bottle={b} className="w-6 h-6" /></div>
                              <div className="text-[11px] font-medium text-slate-200 truncate w-full">{b.name}</div>
                              <div className="kpi-value text-base text-white">{b.quantity}</div>
                              <div className={`mt-1 text-[10px] ${statusStyles[b.status].text}`}>{b.status}</div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-5"><h3 className="font-semibold text-white text-sm">Top Sellers</h3><button onClick={() => setActiveNav('reports')} className="text-[11px] text-[#d4a24c] hover:underline transition-all">View Report</button></div>
                      {topSellers.length === 0 ? <div className="text-sm text-slate-500 text-center py-6">Record sales to see top sellers</div> : (
                        <div className="space-y-4">
                          {topSellers.map((s, i) => (
                            <div key={s.name} className="flex items-center gap-3 transition-colors">
                              <div className="w-6 h-6 rounded-md bg-[#1d1d24] flex items-center justify-center text-[11px] font-bold text-[#d4a24c]">{i+1}</div>
                              <div className="flex-1"><div className="text-[13px] text-slate-200 font-medium">{s.name}</div><div className="text-[11px] text-slate-500">{s.qty} units sold</div></div>
                              <div className="text-[13px] font-semibold text-[#d4a24c]">N$ {s.revenue.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-5"><h3 className="font-semibold text-white text-sm">Stock Take Compliance</h3><button onClick={() => setActiveNav('stocktake')} className="text-[11px] text-[#d4a24c] hover:underline transition-all">View Report</button></div>
                      <div className="flex items-center gap-5">
                        <div className="relative flex-shrink-0"><Donut value={stTotal > 0 ? stPct : 0} size={110} stroke={10} color={stPct >= 80 ? '#4ade80' : '#d4a24c'} /><div className="absolute inset-0 flex flex-col items-center justify-center"><div className="kpi-value text-2xl gold-gradient-text">{stTotal > 0 ? stPct : 0}%</div><div className="text-[10px] text-slate-400">Completed</div></div></div>
                        <div className="flex-1 space-y-3 text-xs text-slate-400">
                          <div><div className="text-slate-300 mb-1 font-medium">Total</div><div className="text-2xl font-semibold text-white">{stCompleted} <span className="text-sm text-slate-500 font-normal">of {stTotal}</span></div><div className="text-[11px]">{stTotal === 0 ? 'No stock takes yet' : 'Stock takes completed'}</div></div>
                          <div className="border-t border-[#26262d] pt-3"><div className="flex justify-between items-center"><span>Locations</span><span className="font-semibold text-white">{new Set(bottles.map(b => b.location).filter(Boolean)).size}</span></div></div>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card p-6">
                      <div className="flex items-center justify-between mb-5"><h3 className="font-semibold text-white text-sm">Inventory by Category</h3></div>
                      <div className="space-y-3.5">
                        {(['Spirits', 'Beer', 'Wine & Champagne', 'Mixers & Others', 'Non-Alcoholic'] as const).map((cat, i) => {
                          const catVal = scopedBottles.filter(b => b.category === cat).reduce((s, b) => s + b.quantity * b.cost, 0);
                          const pct = totalValue > 0 ? Math.round(catVal / totalValue * 100) : 0;
                          const colors = ['#d4a24c', '#e9c27a', '#f0d08a', '#8a6520', '#4a3810'];
                          return (
                            <div key={cat}>
                              <div className="flex items-center justify-between mb-1.5 text-xs"><span className="text-slate-300">{cat}</span><span className="text-slate-400 font-mono">N$ {catVal.toLocaleString()}</span><span className="text-[#d4a24c] font-semibold">{pct}%</span></div>
                              <div className="w-full h-1.5 bg-[#1d1d24] rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: colors[i] }} /></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeNav === 'fridge' && <SmartFridge bottles={bottles} setBottles={setBottles} logActivity={logActivity} onViewProduct={(id) => { setViewingBottleId(id); setActiveNav(PRODUCT_DETAIL_NAV); }} />}
              {activeNav === 'inventory' && <Inventory bottles={bottles} setBottles={setBottles} logActivity={logActivity} suppliers={suppliers} onViewProduct={(id) => { setViewingBottleId(id); setActiveNav(PRODUCT_DETAIL_NAV); }} />}
              {activeNav === 'open-bottles' && <OpenBottles bottles={bottles} setBottles={setBottles} logActivity={logActivity} />}
              {activeNav === 'sales' && <Sales bottles={bottles} setBottles={setBottles} sales={sales} setSales={setSales} logActivity={logActivity} />}
              {activeNav === 'stocktake' && <StockTake bottles={bottles} setBottles={setBottles} stocktakes={stocktakes} setStocktakes={setStocktakes} logActivity={logActivity} />}
              {activeNav === 'shifts' && <Shifts shifts={shifts} setShifts={setShifts} logActivity={logActivity} />}
              {activeNav === 'suppliers' && <Suppliers suppliers={suppliers} setSuppliers={setSuppliers} />}
              {activeNav === 'purchase' && <PurchaseOrdersPage bottles={bottles} setBottles={setBottles} pos={pos} setPOs={setPOs} suppliers={suppliers} logActivity={logActivity} />}
              {activeNav === 'intelligence' && <Snapshots bottles={bottles} setBottles={setBottles} snapshots={snapshots} setSnapshots={setSnapshots} movements={movements} setMovements={setMovements} transfers={transfers} setTransfers={setTransfers} logActivity={logActivity} />}
              {activeNav === 'reports' && <Reports bottles={bottles} sales={sales} pos={pos} stocktakes={stocktakes} />}
              {activeNav === 'ai' && <AIAssistant bottles={bottles} logActivity={logActivity} />}
              {activeNav === 'events' && <ArtistOpsCenter bottles={bottles} pos={pos} setPOs={setPOs} />}
              {activeNav === 'liveboard' && <LiveOpsBoard bottles={bottles} />}
              {activeNav === 'settings' && <SettingsPage />}
            </motion.div>
          </AnimatePresence>

          <div className="text-center text-[11px] text-slate-600 pt-4">StockBru • {bottles.length} SKUs • {movements.length} movements • {sales.length} sales</div>
        </div>
      </main>

      {/* Notification Panel */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-[70] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={() => setShowNotifications(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="relative w-96 h-full bg-[#0d0d11] border-l border-[#1d1d24] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 h-16 border-b border-[#1d1d24] flex items-center justify-between"><div className="font-semibold text-white">Notifications</div><button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white transition-colors">✕</button></div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin">
                {activities.slice(0, 20).map(a => (
                  <div key={a.id} className="p-3 rounded-lg bg-[#16161b] border border-[#26262d] transition-colors hover:bg-[#1a1a21]">
                    <div className="flex items-start gap-3">
                      <ActivityIcon type={a.type} isAlert={a.isAlert} />
                      <div className="flex-1"><div className="text-sm text-white font-medium">{a.title}</div><div className="text-xs text-slate-500 mt-0.5">{a.subtitle}</div><div className="text-[10px] text-slate-600 mt-1">{formatRelativeTime(a.time)} • {a.user || 'System'}</div></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-[#1d1d24]"><button onClick={() => { setUnreadCount(0); toast.success('Marked as read'); }} className="w-full py-2 rounded-lg bg-[#1a1a20] text-slate-300 hover:text-white text-sm transition-colors">Mark all as read</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Universal Command Palette (Spotlight OS) */}
      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNavigate={(tab, sub) => {
          setActiveNav(tab);
          if (sub?.id && tab === 'inventory') setViewingBottleId(sub.id);
        }}
        bottles={bottles}
        sales={sales}
        pos={pos}
        stocktakes={stocktakes}
        suppliers={suppliers}
        userRole={currentUser.role}
      />

      {/* 6-Step First Login Walkthrough */}
      {showWalkthrough && (
        <InteractiveWalkthrough
          onComplete={() => setShowWalkthrough(false)}
          onNavigateTab={(tab) => setActiveNav(tab)}
        />
      )}

      {/* Mobile-First Touch OS Bottom Bar & FAB (<768px Viewports) */}
      <MobileBottomNav activeNav={activeNav} onNavigate={(id) => {
        if (id === 'stocktake') setShowHandheldKeypad(true);
        else { setActiveNav(id); setViewingBottleId(null); }
      }} />

      <MobileFAB activeNav={activeNav} onNavigate={(id) => {
        if (id === 'stocktake') setShowHandheldKeypad(true);
        else { setActiveNav(id); setViewingBottleId(null); }
      }} />

      {/* Handheld Mobile Stocktaking Keypad Modal */}
      <HandheldKeypad
        open={showHandheldKeypad}
        onClose={() => setShowHandheldKeypad(false)}
        bottles={bottles}
        onSaveCount={(skuId, count) => {
          setBottles(prev => prev.map(b => b.id === skuId ? { ...b, quantity: count } : b));
        }}
      />

      <Modal open={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Reset Demo Data" subtitle="This cannot be undone">
        <div className="space-y-4">
          <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-4 text-sm text-slate-300">This clears all application data and restores the demo inventory with recent timestamps.</div>
          <div className="flex justify-end gap-2"><Button variant="secondary" onClick={() => setShowResetConfirm(false)}>Cancel</Button><Button variant="danger" onClick={clearAllData}>Reset Everything</Button></div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Utility Components ───
function formatRelativeTime(value: string) {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return value;
  const seconds = Math.max(0, Math.floor((Date.now() - parsed) / 1000));
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function KpiCard({ label, value, change, changeType, icon: Icon, children }: any) {
  return (
    <motion.div whileHover={{ y: -2 }} className="glass-card p-5 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,162,76,0.1)] hover:border-[#d4a24c]/30 group">
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-[1.5px] text-slate-400 font-medium">{label}</div>
        {Icon && <div className="w-8 h-8 rounded-lg bg-[#1d1d24] flex items-center justify-center text-[#d4a24c] transition-colors group-hover:bg-[#d4a24c] group-hover:text-black"><Icon className="w-4 h-4" /></div>}
      </div>
      <div className="mt-3 kpi-value text-3xl text-white">{value}</div>
      <div className="mt-3 flex items-center gap-3">
        {change && (<div className={`inline-flex items-center gap-1 text-[11px] font-medium ${changeType === 'up' ? 'text-emerald-400' : changeType === 'down' ? 'text-red-400' : 'text-slate-400'}`}>{changeType === 'up' ? <TrendingUp className="w-3 h-3" /> : changeType === 'down' ? <TrendingDown className="w-3 h-3" /> : null}{change}</div>)}
        {children}
      </div>
    </motion.div>
  );
}

function Donut({ value, color = '#d4a24c', size = 70, stroke = 8 }: { value: number; color?: string; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} stroke="#2a2a32" strokeWidth={stroke} fill="none" />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ActivityIcon({ type, isAlert }: { type: string; isAlert?: boolean }) {
  const base = "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0";
  if (isAlert) return <div className={`${base} bg-red-950/60 text-red-400 ring-1 ring-red-900/50`}><AlertTriangle className="w-4 h-4" /></div>;
  if (type === 'sale') return <div className={`${base} bg-emerald-950/60 text-emerald-400 ring-1 ring-emerald-900/50`}><TrendingUp className="w-4 h-4" /></div>;
  if (type === 'purchase') return <div className={`${base} bg-blue-950/60 text-blue-400 ring-1 ring-blue-900/50`}><Truck className="w-4 h-4" /></div>;
  if (type === 'order') return <div className={`${base} bg-purple-950/60 text-purple-400 ring-1 ring-purple-900/50`}><FileText className="w-4 h-4" /></div>;
  if (type === 'adjustment') return <div className={`${base} bg-amber-950/60 text-amber-400 ring-1 ring-amber-900/50`}><Activity className="w-4 h-4" /></div>;
  if (type === 'shift') return <div className={`${base} bg-cyan-950/60 text-cyan-400 ring-1 ring-cyan-900/50`}><Clock className="w-4 h-4" /></div>;
  if (type === 'snapshot') return <div className={`${base} bg-indigo-950/60 text-indigo-400 ring-1 ring-indigo-900/50`}><Camera className="w-4 h-4" /></div>;
  if (type === 'transfer') return <div className={`${base} bg-violet-950/60 text-violet-400 ring-1 ring-violet-900/50`}><ArrowLeftRight className="w-4 h-4" /></div>;
  if (type === 'ai') return <div className={`${base} bg-[#d4a24c]/10 text-[#d4a24c] ring-1 ring-[#d4a24c]/20`}><Sparkles className="w-4 h-4" /></div>;
  return <div className={`${base} bg-[#d4a24c]/10 text-[#d4a24c] ring-1 ring-[#d4a24c]/20`}><CheckCircle2 className="w-4 h-4" /></div>;
}
