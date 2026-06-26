import { useState } from 'react';
import { 
  LayoutDashboard, Boxes, ShoppingCart, Refrigerator, Menu, X, 
  Clock, ClipboardList, Droplets, Truck, FileText, BarChart3, 
  Activity, Camera, Settings, Sparkles, Wine, ChevronRight
} from 'lucide-react';

interface Props {
  activeNav: string;
  onNavigate: (tabId: string) => void;
  unreadCount?: number;
}

const MENU_MODULES = [
  { id: 'events', label: 'Events Hub', icon: Sparkles, color: 'text-amber-400' },
  { id: 'shifts', label: 'Bartender Shifts', icon: Clock, color: 'text-cyan-400' },
  { id: 'stocktake', label: 'Stock Take Keypad', icon: ClipboardList, color: 'text-emerald-400' },
  { id: 'open-bottles', label: 'Open Bottles ml', icon: Droplets, color: 'text-blue-400' },
  { id: 'purchase', label: 'Purchase Orders', icon: FileText, color: 'text-purple-400' },
  { id: 'suppliers', label: 'Suppliers & Vendors', icon: Truck, color: 'text-indigo-400' },
  { id: 'reports', label: 'Valuation Reports', icon: BarChart3, color: 'text-rose-400' },
  { id: 'ai', label: 'Ops Intelligence', icon: Activity, color: 'text-[#d4a24c]' },
  { id: 'intelligence', label: 'Item Snapshots', icon: Camera, color: 'text-teal-400' },
  { id: 'settings', label: 'Club Settings', icon: Settings, color: 'text-slate-300' },
] as const;

export function MobileBottomNav({ activeNav, onNavigate }: Props) {
  const [showDrawer, setShowDrawer] = useState(false);

  const MAIN_TABS = [
    { id: 'overview', label: 'Home', icon: LayoutDashboard },
    { id: 'inventory', label: 'Stock', icon: Boxes },
    { id: 'sales', label: 'Sales', icon: ShoppingCart },
    { id: 'fridge', label: 'Fridge', icon: Refrigerator },
  ];

  return (
    <>
      {/* Fixed Bottom Bar (<768px Mobile Viewport) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden h-16 bg-[#0d0d12]/95 border-t border-[#262632] backdrop-blur-2xl flex items-center justify-around px-1 pb-safe selection:bg-none">
        {MAIN_TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeNav === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { onNavigate(tab.id); setShowDrawer(false); }}
              className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all active:scale-90 ${active ? 'text-[#d4a24c] font-black' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Icon className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[10px] tracking-tight uppercase leading-none">{tab.label}</span>
              {active && <span className="w-1 h-1 rounded-full bg-[#d4a24c] absolute bottom-1.5" />}
            </button>
          );
        })}

        {/* Menu Toggle Tab */}
        <button
          onClick={() => setShowDrawer(!showDrawer)}
          className={`flex-1 flex flex-col items-center justify-center h-full gap-1 transition-all active:scale-90 ${showDrawer || MENU_MODULES.some(m => m.id === activeNav) ? 'text-[#d4a24c] font-black' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] tracking-tight uppercase leading-none">Menu</span>
          {(showDrawer || MENU_MODULES.some(m => m.id === activeNav)) && <span className="w-1 h-1 rounded-full bg-[#d4a24c] absolute bottom-1.5" />}
        </button>
      </nav>

      {/* Slide-out Bottom Sheet Drawer Modal */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowDrawer(false)} />
          
          <div className="relative w-full bg-[#0e0e14] border-t-2 border-[#d4a24c] rounded-t-3xl p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-10 duration-200 max-h-[85vh] overflow-y-auto pb-24 scrollbar-thin">
            {/* Sheet Gripper Bar */}
            <div className="w-12 h-1 rounded-full bg-slate-700 mx-auto -mt-2 mb-2" />

            <div className="flex items-center justify-between border-b border-[#22222e] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#d4a24c] text-black flex items-center justify-center font-black">
                  <Wine className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white leading-tight tracking-wider">STOCKBRU OS</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Nightclub Touch Modules</p>
                </div>
              </div>
              <button onClick={() => setShowDrawer(false)} className="p-2 text-slate-400 hover:text-white rounded-full bg-[#181822]">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {MENU_MODULES.map(mod => {
                const Icon = mod.icon;
                const active = activeNav === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => { onNavigate(mod.id); setShowDrawer(false); }}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all active:scale-95 ${active ? 'bg-[#d4a24c]/15 border-[#d4a24c] text-white shadow-md' : 'bg-[#14141a] border-[#22222c] text-slate-300 hover:border-slate-500'}`}
                  >
                    <div className="flex items-center gap-3 truncate pr-2">
                      <div className={`w-8 h-8 rounded-xl bg-[#1c1c24] flex items-center justify-center shrink-0 ${mod.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold truncate">{mod.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="p-3 rounded-xl bg-[#14141a] border border-[#22222c] text-[10px] text-slate-400 text-center font-mono">
              ⚡ POS Handheld Terminal • 100% One-Handed Operation Enabled
            </div>
          </div>
        </div>
      )}
    </>
  );
}
