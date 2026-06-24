"use client";

import { Building2, Mail, Phone, ExternalLink, Plus, Search, ChevronRight, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const suppliers = [
  { id: "1", name: "Diageo South Africa", category: "Spirits", contact: "Mike Johnson", email: "orders@diageo.co.za", phone: "+27 11 123 4567", moq: "N$ 5,000", leadTime: "48 hours", status: "Excellent", pendingPos: 1, balance: "N$ 12,400" },
  { id: "2", name: "Pernod Ricard", category: "Spirits & Wine", contact: "Sarah Smith", email: "sales@pernod-ricard.com", phone: "+27 11 987 6543", moq: "N$ 3,500", leadTime: "72 hours", status: "Good", pendingPos: 0, balance: "N$ 0" },
  { id: "3", name: "Namibia Breweries", category: "Beer", contact: "John Doe", email: "orders@namtech.na", phone: "+264 61 234 5678", moq: "20 Cases", leadTime: "24 hours", status: "Warning", pendingPos: 2, balance: "N$ 45,000" },
  { id: "4", name: "LVMH (Moet Hennessy)", category: "Champagne", contact: "Chloe Dupont", email: "luxury@lvmh.com", phone: "+33 1 2345 6789", moq: "N$ 25,000", leadTime: "5 Days", status: "Excellent", pendingPos: 0, balance: "N$ 0" },
];

export default function SupplierCenter() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full h-full flex flex-col font-sans">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#F3F4F6]">Supplier Center</h1>
          <p className="text-sm text-[#9CA3AF]">Manage distributor relationships and account health.</p>
        </div>
        <button className="px-6 py-2.5 bg-[#DDAA33] hover:bg-[#b88d2a] text-[#121212] font-bold rounded-lg shadow-lg shadow-[#DDAA33]/20 transition-colors flex items-center gap-2 text-sm">
          <Plus size={18} /> Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8 shrink-0">
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Active Suppliers</span>
          <p className="text-3xl font-black text-[#F3F4F6] mt-2">12</p>
        </div>
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Pending Orders</span>
          <p className="text-3xl font-black text-[#F3F4F6] mt-2">3</p>
        </div>
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Total Outstanding Balance</span>
          <p className="text-3xl font-black text-[#F3F4F6] mt-2">N$ 57,400</p>
        </div>
        <div className="bg-[#1C1C1C] border border-[#F87171]/20 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#F87171]">Account Warnings</span>
          <p className="text-3xl font-black text-[#F87171] mt-2">1</p>
          <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F87171]/10" size={48} />
        </div>
      </div>

      <div className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#121212]">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
            <input 
              type="text" 
              placeholder="Search suppliers..." 
              className="w-full h-10 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg pl-10 pr-4 text-[#F3F4F6] text-sm focus:outline-none focus:border-[#DDAA33]"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#F3F4F6] px-3 py-2 rounded-lg outline-none">
              <option>All Categories</option>
              <option>Spirits</option>
              <option>Beer</option>
              <option>Champagne</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {suppliers.map(sup => (
              <div key={sup.id} className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 hover:border-[#DDAA33]/50 transition-colors group">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl flex items-center justify-center text-[#DDAA33]">
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#F3F4F6]">{sup.name}</h3>
                      <span className="text-[10px] bg-[#2A2A2A] text-[#9CA3AF] px-2 py-0.5 rounded uppercase tracking-wider">{sup.category}</span>
                    </div>
                  </div>
                  {sup.status === "Excellent" ? (
                    <span className="flex items-center gap-1 text-[10px] text-[#34D399] font-bold uppercase bg-[#34D399]/10 px-2 py-1 rounded">
                      <CheckCircle2 size={12} /> Excellent
                    </span>
                  ) : sup.status === "Warning" ? (
                    <span className="flex items-center gap-1 text-[10px] text-[#FBBF24] font-bold uppercase bg-[#FBBF24]/10 px-2 py-1 rounded">
                      <AlertTriangle size={12} /> Balance Overdue
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-[#F3F4F6] font-bold uppercase bg-[#2A2A2A] px-2 py-1 rounded">
                      Good
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                      <div className="w-8 h-8 rounded bg-[#1C1C1C] flex items-center justify-center"><Phone size={14} /></div>
                      <span className="font-mono">{sup.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                      <div className="w-8 h-8 rounded bg-[#1C1C1C] flex items-center justify-center"><Mail size={14} /></div>
                      <span className="truncate">{sup.email}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-[#1C1C1C] p-2 rounded-lg text-xs">
                      <span className="text-[#9CA3AF]">Lead Time</span>
                      <span className="font-bold text-[#F3F4F6]">{sup.leadTime}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#1C1C1C] p-2 rounded-lg text-xs">
                      <span className="text-[#9CA3AF]">MOQ</span>
                      <span className="font-bold text-[#F3F4F6]">{sup.moq}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#2A2A2A] flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#9CA3AF] uppercase">Pending POs</span>
                      <span className="text-sm font-bold text-[#F3F4F6]">{sup.pendingPos}</span>
                    </div>
                    <div className="w-px h-8 bg-[#2A2A2A]"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-[#9CA3AF] uppercase">Balance</span>
                      <span className={`text-sm font-bold ${sup.balance !== "N$ 0" ? 'text-[#F87171]' : 'text-[#34D399]'}`}>{sup.balance}</span>
                    </div>
                  </div>
                  
                  <Link href="/purchase-orders" className="text-[#DDAA33] text-xs font-bold flex items-center gap-1 group-hover:underline">
                    Create Order <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
