import { Wine, Beer, FlaskConical, CupSoda, Droplets, Apple } from 'lucide-react';
import { Bottle } from '../types';

interface BottleIconProps {
  bottle: Bottle;
  className?: string;
}

export function BottleIcon({ bottle, className = "w-6 h-6" }: BottleIconProps) {
  // Map categories to specific Lucide icons
  switch (bottle.category) {
    case 'Beer':
      return <Beer className={className} />;
    case 'Wine & Champagne':
      return <Wine className={className} />;
    case 'Mixers & Others':
      return <CupSoda className={className} />;
    case 'Non-Alcoholic':
      // Differentiate juice/water if needed, otherwise generic
      if (bottle.name.toLowerCase().includes('water')) return <Droplets className={className} />;
      if (bottle.name.toLowerCase().includes('juice')) return <Apple className={className} />;
      return <CupSoda className={className} />;
    case 'Spirits':
    default:
      return <FlaskConical className={className} />;
  }
}

export function getCategoryIcon(category: string, className = "w-6 h-6") {
  switch (category) {
    case 'Beer': return <Beer className={className} />;
    case 'Wine & Champagne': return <Wine className={className} />;
    case 'Mixers & Others': return <CupSoda className={className} />;
    case 'Non-Alcoholic': return <Droplets className={className} />;
    case 'Spirits': return <FlaskConical className={className} />;
    default: return <Wine className={className} />;
  }
}
