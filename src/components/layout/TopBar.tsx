"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Sun, Store, ChevronDown, WifiOff, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function TopBar() {
  const [isOffline, setIsOffline] = useState(false);

  // Mock offline toggle for demonstration purposes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'o') {
        e.preventDefault();
        setIsOffline(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="h-20 border-b border-[#2A2A2A] bg-[#121212]/95 flex items-center justify-between px-8 sticky top-0 z-40">
      
      <div className="flex items-center gap-4">
        {/* Location Dropdown */}
        <Link href="/branches" className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg cursor-pointer hover:border-[#DDAA33]/50 transition-colors">
          <Store size={18} className="text-[#DDAA33]" />
          <span className="text-sm font-medium text-[#F3F4F6] px-2">All Locations</span>
          <ChevronDown size={16} className="text-[#9CA3AF]" />
        </Link>

        {/* Offline Indicator */}
        {isOffline && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#F87171]/10 border border-[#F87171]/20 rounded-lg animate-pulse">
            <WifiOff size={16} className="text-[#F87171]" />
            <span className="text-xs font-bold text-[#F87171] uppercase tracking-wider">Offline Mode</span>
            <div className="w-px h-4 bg-[#F87171]/20"></div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#F87171]">
              <RefreshCw size={12} className="text-[#F87171]" />
              4 Pending Sync
            </div>
          </div>
        )}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        {isOffline && (
          <span className="text-xs text-[#9CA3AF] hidden lg:block mr-2">
            Press <kbd className="bg-[#1C1C1C] border border-[#2A2A2A] px-1.5 py-0.5 rounded font-mono text-[10px]">Ctrl+O</kbd> to toggle online.
          </span>
        )}
        {!isOffline && (
           <span className="text-xs text-[#2A2A2A] hidden lg:block mr-2">
             Press <kbd className="px-1.5 py-0.5 font-mono text-[10px]">Ctrl+O</kbd> to test offline mode.
           </span>
        )}
        
        <button className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
          <Search size={20} />
        </button>
        
        <Link href="/notifications" className="relative text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#DDAA33] text-[#121212] flex items-center justify-center text-[9px] font-bold rounded-full">2</span>
        </Link>
        
        <button className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
          <Sun size={20} />
        </button>
      </div>
    </header>
  );
}
