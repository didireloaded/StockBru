import { useState, useEffect } from 'react';
import { Cloud, WifiOff } from 'lucide-react';

export function SyncBanner() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return (
      <div className="bg-[#141419]/90 border-b border-[#22222e] px-4 py-1.5 text-[11px] flex items-center justify-between text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold">Touch POS Online</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 font-semibold">
          <Cloud className="w-3.5 h-3.5" />
          <span>Cloud Synced</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-950/80 border-b border-amber-500/40 px-4 py-2 text-xs flex items-center justify-between text-amber-200 font-bold animate-pulse">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400" />
        <span>Wi-Fi Disconnected • Offline Cache Active</span>
      </div>
      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase font-mono">Buffered</span>
    </div>
  );
}
