"use client";

import { ArrowLeft, AlertTriangle, TrendingDown, CheckCircle2, FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

const varianceData = [
  { id: "1", name: "Ciroc Vodka", expected: "12 (420ml)", actual: "11 (420ml)", variance: "-1 Full", loss: 1200, status: "Missing" },
  { id: "2", name: "Gordon's Gin", expected: "4 (0ml)", actual: "4 (0ml)", variance: "0", loss: 0, status: "Match" },
  { id: "3", name: "Jameson", expected: "15 (180ml)", actual: "15 (100ml)", variance: "-80ml", loss: 85, status: "Over-pour" },
  { id: "4", name: "Jack Daniel's", expected: "6 (0ml)", actual: "6 (0ml)", variance: "0", loss: 0, status: "Match" },
  { id: "5", name: "Moet Brut", expected: "5 (0ml)", actual: "4 (0ml)", variance: "-1 Full", loss: 850, status: "Missing" },
];

export default function VarianceDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto w-full h-full flex flex-col font-sans overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/stock-take" className="w-10 h-10 bg-[#1C1C1C] border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#F3F4F6]">Variance Report: Main Bar</h1>
            <p className="text-sm text-[#9CA3AF]">Completed Today, 09:45 by Pedro Manager</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2.5 bg-[#1C1C1C] border border-[#2A2A2A] hover:bg-[#2A2A2A] text-[#F3F4F6] font-bold rounded-lg transition-colors flex items-center gap-2 text-sm">
            <AlertCircle size={16} /> Request Recount
          </button>
          <button className="px-6 py-2.5 bg-[#DDAA33] hover:bg-[#b88d2a] text-[#121212] font-bold rounded-lg shadow-lg shadow-[#DDAA33]/20 transition-colors flex items-center gap-2 text-sm">
            <CheckCircle2 size={16} /> Approve & Commit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8 shrink-0">
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Total Items Counted</span>
          <p className="text-3xl font-black text-[#F3F4F6] mt-2">142</p>
        </div>
        <div className="bg-[#1C1C1C] border border-[#F87171]/20 rounded-2xl p-5 relative overflow-hidden">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#F87171]">Total Financial Loss</span>
          <p className="text-3xl font-black text-[#F87171] mt-2">-N$ 2,135</p>
          <TrendingDown className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F87171]/10" size={48} />
        </div>
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Missing Bottles</span>
          <p className="text-3xl font-black text-[#F3F4F6] mt-2">2</p>
        </div>
        <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#9CA3AF]">Over-poured</span>
          <p className="text-3xl font-black text-[#F3F4F6] mt-2">1</p>
        </div>
      </div>

      <div className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col">
        <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#121212]">
          <h3 className="font-bold text-[#F3F4F6] flex items-center gap-2">
            <FileText size={18} className="text-[#DDAA33]" /> Line Item Variance
          </h3>
          <div className="flex gap-2">
            <select className="bg-[#1C1C1C] border border-[#2A2A2A] text-xs text-[#F3F4F6] px-3 py-1.5 rounded-lg outline-none">
              <option>All Items</option>
              <option>Only Discrepancies</option>
              <option>Matches Only</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#121212] border-b border-[#2A2A2A] z-10">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Product</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Expected</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Actual Count</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Variance</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold text-right">Financial Impact</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {varianceData.map((item) => (
                <tr key={item.id} className="hover:bg-[#2A2A2A]/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#F3F4F6]">{item.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-[#9CA3AF]">{item.expected}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-[#F3F4F6]">{item.actual}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold font-mono ${item.variance === "0" ? "text-[#34D399]" : "text-[#F87171]"}`}>
                      {item.variance}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-sm font-bold ${item.loss > 0 ? "text-[#F87171]" : "text-[#9CA3AF]"}`}>
                      {item.loss > 0 ? `-N$ ${item.loss}` : "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.status === "Match" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#34D399] bg-[#34D399]/10 px-2 py-1 rounded">
                        <CheckCircle2 size={12} /> Match
                      </span>
                    ) : item.status === "Over-pour" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#FBBF24] bg-[#FBBF24]/10 px-2 py-1 rounded">
                        <AlertTriangle size={12} /> Over-pour
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-[#F87171] bg-[#F87171]/10 px-2 py-1 rounded">
                        <AlertTriangle size={12} /> Missing
                      </span>
                    )}
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
