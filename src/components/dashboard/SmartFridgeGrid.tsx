"use client";

import { ChevronDown, Grid, List } from "lucide-react";
import Image from "next/image";

export type FridgeItem = {
  id: string;
  name: string;
  count: number;
  status: "Normal" | "Low" | "Critical";
  imageUrl: string;
};

export default function SmartFridgeGrid({ items }: { items: FridgeItem[] }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#DDAA33] text-xs font-bold tracking-widest uppercase">Smart Fridge</h3>
        <button className="text-xs text-[#DDAA33] hover:text-[#b88d2a] flex items-center gap-1 transition-colors">
          View All <span>&rarr;</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center justify-between w-full max-w-[200px] px-3 py-2 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg cursor-pointer">
          <span className="text-sm text-[#F3F4F6]">All Categories</span>
          <ChevronDown size={14} className="text-[#9CA3AF]" />
        </div>
        <div className="flex gap-2 text-[#9CA3AF]">
          <button className="p-1 hover:text-[#F3F4F6] bg-[#2A2A2A] rounded text-[#DDAA33]"><Grid size={16} /></button>
          <button className="p-1 hover:text-[#F3F4F6]"><List size={16} /></button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 overflow-y-auto custom-scrollbar pr-2 pb-4 h-full">
        {items.map((item) => {
          const statusColor = 
            item.status === "Normal" ? "bg-[#34D399]" :
            item.status === "Low" ? "bg-[#FBBF24]" :
            "bg-[#F87171]";

          return (
            <div key={item.id} className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-3 flex flex-col hover:border-[#DDAA33]/50 transition-colors cursor-pointer group">
              <div className="h-28 w-full flex items-center justify-center mb-3">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-[#F3F4F6] truncate" title={item.name}>{item.name}</span>
                <span className="text-sm font-bold text-[#F3F4F6]">{item.count}</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`}></div>
                  <span className="text-[10px] text-[#9CA3AF]">{item.status}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
