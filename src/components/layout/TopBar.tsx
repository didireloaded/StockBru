"use client";

import { Search, Bell, Sun, Store, ChevronDown } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-20 border-b border-[#2A2A2A] bg-[#121212]/95 flex items-center justify-between px-8 sticky top-0 z-40">
      
      {/* Location Dropdown */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg cursor-pointer hover:border-[#DDAA33]/50 transition-colors">
        <Store size={18} className="text-[#DDAA33]" />
        <span className="text-sm font-medium text-[#F3F4F6] px-2">All Locations</span>
        <ChevronDown size={16} className="text-[#9CA3AF]" />
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <button className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
          <Search size={20} />
        </button>
        
        <button className="relative text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
          <Bell size={20} />
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#DDAA33] text-[#121212] flex items-center justify-center text-[9px] font-bold rounded-full">12</span>
        </button>
        
        <button className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
          <Sun size={20} />
        </button>
      </div>
    </header>
  );
}
