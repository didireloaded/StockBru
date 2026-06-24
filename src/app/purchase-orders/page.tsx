"use client";

import { FileText, Plus, Search, ChevronRight, CheckCircle2, Clock, Truck, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const pos = [
  { id: "PO-1258", supplier: "Diageo South Africa", date: "Today, 10:15", total: "N$ 12,400", items: 4, status: "Draft" },
  { id: "PO-1257", supplier: "Pernod Ricard", date: "Yesterday", total: "N$ 8,250", items: 2, status: "Sent" },
  { id: "PO-1256", supplier: "Namibia Breweries", date: "22 Jun 2026", total: "N$ 15,000", items: 12, status: "Partially Received" },
  { id: "PO-1255", supplier: "LVMH", date: "20 Jun 2026", total: "N$ 45,000", items: 6, status: "Completed" },
];

export default function PurchaseOrders() {
  return (
    <div className="p-6 max-w-7xl mx-auto w-full h-full flex flex-col font-sans overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#F3F4F6]">Purchase Orders</h1>
          <p className="text-sm text-[#9CA3AF]">Manage procurement and track incoming stock.</p>
        </div>
        <button className="px-6 py-2.5 bg-[#DDAA33] hover:bg-[#b88d2a] text-[#121212] font-bold rounded-lg shadow-lg shadow-[#DDAA33]/20 transition-colors flex items-center gap-2 text-sm">
          <Plus size={18} /> Create New PO
        </button>
      </div>

      <div className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#121212]">
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
              <input 
                type="text" 
                placeholder="Search PO number or supplier..." 
                className="w-full h-10 bg-[#1C1C1C] border border-[#2A2A2A] rounded-lg pl-10 pr-4 text-[#F3F4F6] text-sm focus:outline-none focus:border-[#DDAA33]"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select className="bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#F3F4F6] px-3 py-2 rounded-lg outline-none">
              <option>All Statuses</option>
              <option>Draft</option>
              <option>Sent</option>
              <option>Partially Received</option>
              <option>Completed</option>
            </select>
            <select className="bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#F3F4F6] px-3 py-2 rounded-lg outline-none">
              <option>Last 30 Days</option>
              <option>This Week</option>
              <option>Today</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#121212] border-b border-[#2A2A2A] z-10">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">PO Number</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Supplier</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Date Issued</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Items</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold text-right">Total Value</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold text-center">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {pos.map((po) => (
                <tr key={po.id} className="hover:bg-[#2A2A2A]/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#121212] border border-[#2A2A2A] flex items-center justify-center text-[#DDAA33]">
                        <FileText size={14} />
                      </div>
                      <span className="text-sm font-bold font-mono text-[#F3F4F6]">{po.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#F3F4F6]">{po.supplier}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#9CA3AF]">{po.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-[#F3F4F6]">{po.items}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-[#F3F4F6]">{po.total}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {po.status === "Draft" && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#9CA3AF] bg-[#2A2A2A] px-2 py-1 rounded">
                        <FileText size={12} /> Draft
                      </span>
                    )}
                    {po.status === "Sent" && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded border border-[#3B82F6]/20">
                        <Clock size={12} /> Sent
                      </span>
                    )}
                    {po.status === "Partially Received" && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#FBBF24] bg-[#FBBF24]/10 px-2 py-1 rounded border border-[#FBBF24]/20">
                        <Truck size={12} /> Receiving
                      </span>
                    )}
                    {po.status === "Completed" && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#34D399] bg-[#34D399]/10 px-2 py-1 rounded border border-[#34D399]/20">
                        <CheckCircle2 size={12} /> Completed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
                      <MoreHorizontal size={18} />
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
