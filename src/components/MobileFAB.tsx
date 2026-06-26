import { ShoppingCart, Plus, Droplets, Camera } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  activeNav: string;
  onNavigate: (navId: string) => void;
  onTriggerAction?: (action: string) => void;
}

export function MobileFAB({ activeNav, onNavigate }: Props) {
  // Context-aware button styling & action logic
  const getFabConfig = () => {
    switch (activeNav) {
      case 'sales':
        return {
          label: 'Record Sale',
          icon: ShoppingCart,
          bg: 'bg-emerald-400 text-black shadow-emerald-500/30',
          action: () => { toast.info('⚡ Search SKUs above or scan barcode to checkout in <2 seconds'); }
        };
      case 'inventory':
        return {
          label: 'Receive Stock',
          icon: Plus,
          bg: 'bg-[#d4a24c] text-black shadow-amber-500/30',
          action: () => { onNavigate('purchase'); toast.success('Select Purchase Order to receive stock items'); }
        };
      case 'fridge':
      case 'open-bottles':
        return {
          label: 'Open Bottle',
          icon: Droplets,
          bg: 'bg-blue-400 text-black shadow-blue-500/30',
          action: () => { onNavigate('fridge'); toast.info('Tap any bottle in the Smart Fridge hero view to record shot consumption'); }
        };
      case 'stocktake':
        return {
          label: 'Scan Barcode',
          icon: Camera,
          bg: 'bg-purple-400 text-black shadow-purple-500/30',
          action: () => { toast.success('📷 Camera scanner initialized. Position barcode in frame.'); }
        };
      default:
        return {
          label: 'Quick Sale',
          icon: Plus,
          bg: 'bg-[#d4a24c] text-black shadow-amber-500/30',
          action: () => { onNavigate('sales'); }
        };
    }
  };

  const config = getFabConfig();
  const Icon = config.icon;

  return (
    <button
      onClick={config.action}
      className={`fixed bottom-20 right-5 z-40 md:hidden h-14 px-5 rounded-full ${config.bg} font-black shadow-2xl flex items-center gap-2.5 transition-all active:scale-90 hover:scale-105 border border-white/20`}
    >
      <Icon className="w-5 h-5 stroke-[3]" />
      <span className="text-xs uppercase tracking-wider">{config.label}</span>
    </button>
  );
}
