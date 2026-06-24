"use client";

import { Building2, TrendingUp, TrendingDown, MapPin, Search, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

const branches = [
  { id: "1", name: "Sandton Main Club", location: "Johannesburg", manager: "Pedro Silva", value: "N$ 425,000", variance: "-N$ 2,135", health: "94%", status: "Active" },
  { id: "2", name: "Camps Bay Beach Bar", location: "Cape Town", manager: "Sarah Jenkins", value: "N$ 180,000", variance: "-N$ 540", health: "98%", status: "Active" },
  { id: "3", name: "Pretoria VIP Lounge", location: "Pretoria", manager: "Michael Ndlovu", value: "N$ 320,000", variance: "-N$ 4,200", health: "82%", status: "Warning" },
];

export default function MultiBranchManagement() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full h-full flex flex-col font-sans overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#F3F4F6]">Global Venues</h1>
          <p className="text-sm text-[#9CA3AF]">Manage multiple branches and compare performance.</p>
        </div>
        <button className="px-6 py-2.5 bg-[#DDAA33] hover:bg-[#b88d2a] text-[#121212] font-bold rounded-lg shadow-lg shadow-[#DDAA33]/20 transition-colors flex items-center gap-2 text-sm">
          <Building2 size={18} /> Add New Branch
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8 shrink-0">
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Total Branches</span>
          <p className="text-3xl font-black text-[#F3F4F6] mt-2">3</p>
        </div>
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Global Inventory Value</span>
          <p className="text-3xl font-black text-[#F3F4F6] mt-2">N$ 925,000</p>
        </div>
        <div className="bg-[#1C1C1C] border border-[#F87171]/20 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#F87171]">Global Variance Loss</span>
          <p className="text-3xl font-black text-[#F87171] mt-2">-N$ 6,875</p>
          <TrendingDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F87171]/10" size={48} />
        </div>
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Avg Health Score</span>
          <p className="text-3xl font-black text-[#34D399] mt-2">91%</p>
        </div>
      </div>

      <div className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#121212]">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
            <input 
              type="text" 
              placeholder="Search branches..." 
              className="w-full h-10 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg pl-10 pr-4 text-[#F3F4F6] text-sm focus:outline-none focus:border-[#DDAA33]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#121212] border-b border-[#2A2A2A] z-10">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Branch Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Location</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Manager</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold text-right">Inventory Value</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold text-right">Variance Loss</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold text-center">Health</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {branches.map((branch) => (
                <tr key={branch.id} className="hover:bg-[#2A2A2A]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#F3F4F6]">{branch.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[#9CA3AF] text-sm">
                      <MapPin size={14} /> {branch.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#F3F4F6]">{branch.manager}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-[#F3F4F6]">{branch.value}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-[#F87171]">{branch.variance}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {branch.status === "Warning" ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#F87171] bg-[#F87171]/10 px-2 py-1 rounded border border-[#F87171]/20">
                        <AlertTriangle size={12} /> {branch.health}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#34D399] bg-[#34D399]/10 px-2 py-1 rounded border border-[#34D399]/20">
                        {branch.health}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[#DDAA33] hover:text-[#b88d2a] font-bold text-xs flex items-center justify-center gap-1 mx-auto transition-colors">
                      Switch <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
