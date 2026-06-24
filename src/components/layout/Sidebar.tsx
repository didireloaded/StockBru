"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Refrigerator, 
  Package, 
  ClipboardCheck, 
  TrendingUp, 
  Clock, 
  Users, 
  Receipt,
  FileBarChart,
  LineChart,
  Bot,
  Settings,
  Bell
} from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Smart Fridge", href: "/fridge", icon: Refrigerator },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Stock Take", href: "/stock-take", icon: ClipboardCheck },
    { name: "Sales", href: "/sales", icon: TrendingUp },
    { name: "Shifts", href: "/shifts", icon: Clock },
    { name: "Suppliers", href: "/suppliers", icon: Users },
    { name: "Purchase Orders", href: "/purchase-orders", icon: Receipt },
    { name: "Reports", href: "/reports", icon: FileBarChart },
    { name: "Analytics", href: "/analytics", icon: LineChart },
    { name: "AI Assistant", href: "/ai", icon: Bot },
  ];

  return (
    <aside className="w-64 h-screen bg-[#121212] border-r border-[#2A2A2A] flex flex-col flex-shrink-0 sticky top-0 font-sans">
      <div className="h-20 flex items-center px-6">
        <h1 className="text-xl font-bold tracking-wide text-[#F3F4F6] flex items-center gap-2">
          <div className="w-6 h-6 rounded-md border-2 border-[#DDAA33] flex items-center justify-center">
            <div className="w-2 h-2 bg-[#DDAA33] rounded-sm"></div>
          </div>
          STOCKBRU <span className="text-[#DDAA33] text-sm mt-0.5">AI</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-4 flex flex-col gap-1.5 custom-scrollbar">
        {mainNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? "bg-[#DDAA33]/20 text-[#DDAA33] border border-[#DDAA33]/30" 
                  : "text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1C1C]"
              }`}
            >
              <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 flex flex-col gap-2 mt-auto">
        <Link href="/notifications" className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1C1C] transition-colors">
          <div className="flex items-center gap-3">
            <Bell size={18} />
            Notifications
          </div>
          <span className="bg-[#DDAA33] text-[#121212] text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>
        </Link>
        <Link href="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-[#1C1C1C] transition-colors">
          <Settings size={18} />
          Settings
        </Link>
        
        <div className="mt-4 pt-4 border-t border-[#2A2A2A] flex items-center justify-between px-2 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1C1C1C] border border-[#2A2A2A] overflow-hidden">
               <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" alt="Pedro Manager" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#F3F4F6]">Pedro Manager</span>
              <span className="text-xs text-[#9CA3AF]">Admin</span>
            </div>
          </div>
          <span className="text-[#9CA3AF] group-hover:text-[#F3F4F6]">&rsaquo;</span>
        </div>
      </div>
    </aside>
  );
}
