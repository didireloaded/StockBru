"use client";

import { Bell, AlertTriangle, FileText, Package, Settings, Search, CheckCircle2, CheckSquare } from "lucide-react";
import Link from "next/link";

const notifications = [
  { id: "1", type: "Critical", title: "Stock-Out Risk: Ciroc Vodka", message: "Ciroc Vodka will deplete before the weekend rush. Current stock: 12 bottles. Burn rate: 15/day.", time: "10 mins ago", unread: true, icon: AlertTriangle, color: "text-[#F87171]", bg: "bg-[#F87171]/10" },
  { id: "2", type: "Action Required", title: "Approve Variance: Main Bar", message: "A variance of -N$ 2,135 was recorded in the Main Bar. Please review and approve.", time: "2 hours ago", unread: true, icon: CheckSquare, color: "text-[#FBBF24]", bg: "bg-[#FBBF24]/10" },
  { id: "3", type: "Action Required", title: "Draft PO Created", AI: true, message: "StockMan has automatically drafted PO-1258 for Diageo based on low stock alerts.", time: "4 hours ago", unread: false, icon: FileText, color: "text-[#DDAA33]", bg: "bg-[#DDAA33]/10" },
  { id: "4", type: "Info", title: "Stock Received: LVMH", message: "PO-1255 has been fully received. 6 items added to VIP Lounge inventory.", time: "Yesterday", unread: false, icon: Package, color: "text-[#34D399]", bg: "bg-[#34D399]/10" },
];

export default function NotificationCenter() {
  return (
    <div className="p-6 max-w-5xl mx-auto w-full h-full flex flex-col font-sans overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#F3F4F6] flex items-center gap-3">
            <Bell className="text-[#DDAA33]" /> Notification Center
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-1">Review critical alerts and required actions.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-[#1C1C1C] border border-[#2A2A2A] hover:bg-[#2A2A2A] text-[#F3F4F6] rounded-lg transition-colors flex items-center gap-2 text-sm">
            <Settings size={16} /> Preferences
          </button>
          <button className="px-4 py-2 bg-[#DDAA33] hover:bg-[#b88d2a] text-[#121212] font-bold rounded-lg shadow-lg shadow-[#DDAA33]/20 transition-colors flex items-center gap-2 text-sm">
            <CheckCircle2 size={16} /> Mark All Read
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 shrink-0">
        <button className="px-4 py-2 text-sm font-bold bg-[#DDAA33] text-[#121212] rounded-lg transition-colors">All Alerts (2)</button>
        <button className="px-4 py-2 text-sm font-bold bg-[#1C1C1C] border border-[#2A2A2A] text-[#9CA3AF] hover:text-[#F3F4F6] rounded-lg transition-colors">Critical</button>
        <button className="px-4 py-2 text-sm font-bold bg-[#1C1C1C] border border-[#2A2A2A] text-[#9CA3AF] hover:text-[#F3F4F6] rounded-lg transition-colors">Action Required</button>
      </div>

      <div className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {notifications.map(note => (
            <div 
              key={note.id} 
              className={`p-5 border-b border-[#2A2A2A] last:border-0 hover:bg-[#2A2A2A]/30 transition-colors flex gap-5 items-start ${note.unread ? 'bg-[#121212]' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${note.bg} ${note.color}`}>
                <note.icon size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-[#F3F4F6] flex items-center gap-2 ${note.unread ? 'text-[16px]' : 'text-[15px]'}`}>
                    {note.title} 
                    {note.unread && <span className="w-2 h-2 rounded-full bg-[#DDAA33]"></span>}
                  </h3>
                  <span className="text-xs text-[#9CA3AF] whitespace-nowrap">{note.time}</span>
                </div>
                <p className={`text-sm ${note.unread ? 'text-[#D1D5DB]' : 'text-[#9CA3AF]'}`}>
                  {note.message}
                </p>
                
                {note.type === "Action Required" && note.unread && (
                  <div className="mt-4 flex gap-3">
                    <button className="px-4 py-1.5 bg-[#DDAA33] text-[#121212] text-xs font-bold rounded hover:bg-[#b88d2a] transition-colors">
                      Review Now
                    </button>
                    <button className="px-4 py-1.5 bg-[#2A2A2A] text-[#F3F4F6] text-xs font-bold rounded hover:bg-[#333333] transition-colors">
                      Dismiss
                    </button>
                  </div>
                )}
                
                {note.type === "Critical" && note.unread && (
                  <div className="mt-4 flex gap-3">
                    <button className="px-4 py-1.5 bg-[#F87171] text-[#121212] text-xs font-bold rounded hover:bg-[#EF4444] transition-colors">
                      Generate PO
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
