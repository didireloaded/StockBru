"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle2, MapPin, Search, ChevronRight, Calculator, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const locations = [
  { id: "1", name: "Main Bar", progress: 68, total: 142 },
  { id: "2", name: "VIP Lounge", progress: 0, total: 45 },
  { id: "3", name: "Main Storage", progress: 100, total: 320 },
];

const mockProducts = [
  { id: "1", name: "Ciroc Vodka", imageUrl: "https://images.unsplash.com/photo-1626804475297-4160eb80bf85?w=200&h=400&fit=crop", status: "pending" },
  { id: "2", name: "Gordon's Gin", imageUrl: "https://images.unsplash.com/photo-1614316346936-39dd75eb82b3?w=200&h=400&fit=crop", status: "counted" },
  { id: "3", name: "Jack Daniel's", imageUrl: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=200&h=400&fit=crop", status: "pending" },
];

export default function StockTakeWorkflow() {
  const router = useRouter();
  const [activeLocation, setActiveLocation] = useState<any>(null);
  const [activeProduct, setActiveProduct] = useState<any>(null);
  
  const [fullCount, setFullCount] = useState("0");
  const [mlCount, setMlCount] = useState("0");
  const [inputMode, setInputMode] = useState<"full" | "ml">("full");

  const handleNumpad = (num: string) => {
    if (inputMode === "full") {
      setFullCount(prev => prev === "0" ? num : prev + num);
    } else {
      setMlCount(prev => prev === "0" ? num : prev + num);
    }
  };

  const handleClear = () => {
    if (inputMode === "full") setFullCount("0");
    else setMlCount("0");
  };

  const handleSaveCount = () => {
    // In a real app, save to state/db
    setActiveProduct(null);
    setFullCount("0");
    setMlCount("0");
    setInputMode("full");
  };

  const handleFinishLocation = () => {
    router.push("/stock-take/variance");
  };

  if (!activeLocation) {
    return (
      <div className="p-6 max-w-5xl mx-auto w-full h-full flex flex-col font-sans">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="w-10 h-10 bg-[#1C1C1C] border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#F3F4F6]">Stock Take</h1>
            <p className="text-sm text-[#9CA3AF]">Select a location to begin or resume counting.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map(loc => (
            <button 
              key={loc.id}
              onClick={() => setActiveLocation(loc)}
              className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-6 text-left hover:border-[#DDAA33]/50 transition-colors group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-[#121212] border border-[#2A2A2A] rounded-xl flex items-center justify-center text-[#DDAA33]">
                  <MapPin size={24} />
                </div>
                {loc.progress === 100 && <CheckCircle2 className="text-[#34D399]" size={24} />}
              </div>
              <h2 className="text-xl font-bold text-[#F3F4F6] mb-2">{loc.name}</h2>
              <div className="flex justify-between text-xs text-[#9CA3AF] mb-2">
                <span>Progress</span>
                <span>{loc.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#121212] rounded-full overflow-hidden">
                <div className={`h-full ${loc.progress === 100 ? 'bg-[#34D399]' : 'bg-[#DDAA33]'}`} style={{ width: `${loc.progress}%` }}></div>
              </div>
              <div className="mt-4 text-xs font-bold text-[#DDAA33] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                {loc.progress === 100 ? 'Review Count' : loc.progress > 0 ? 'Resume Count' : 'Start Count'} <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header */}
      <div className="h-20 border-b border-[#2A2A2A] bg-[#121212] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveLocation(null)} className="w-10 h-10 bg-[#1C1C1C] border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#F3F4F6]">{activeLocation.name}</h1>
            <p className="text-xs text-[#DDAA33] uppercase tracking-wider font-bold">Blind Count Active</p>
          </div>
        </div>
        <button onClick={handleFinishLocation} className="px-6 py-2.5 bg-[#DDAA33] hover:bg-[#b88d2a] text-[#121212] font-bold rounded-lg shadow-lg shadow-[#DDAA33]/20 transition-colors flex items-center gap-2">
          Finish Location <Check size={18} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left List */}
        <div className="w-1/3 border-r border-[#2A2A2A] bg-[#1C1C1C] flex flex-col h-full">
          <div className="p-4 border-b border-[#2A2A2A]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={16} />
              <input 
                type="text" 
                placeholder="Search or scan..." 
                className="w-full h-10 bg-[#121212] border border-[#2A2A2A] rounded-lg pl-10 pr-4 text-[#F3F4F6] text-sm focus:outline-none focus:border-[#DDAA33]"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {mockProducts.map(p => (
              <button 
                key={p.id}
                onClick={() => setActiveProduct(p)}
                className={`w-full text-left p-3 rounded-lg border flex justify-between items-center transition-colors ${activeProduct?.id === p.id ? 'bg-[#DDAA33]/10 border-[#DDAA33]' : 'bg-[#121212] border-[#2A2A2A] hover:border-[#DDAA33]/50'}`}
              >
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl} alt={p.name} className="h-8 object-contain" />
                  <span className="text-sm font-bold text-[#F3F4F6]">{p.name}</span>
                </div>
                {p.status === "counted" ? (
                  <CheckCircle2 size={16} className="text-[#34D399]" />
                ) : (
                  <ChevronRight size={16} className="text-[#9CA3AF]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Input Area */}
        <div className="flex-1 bg-[#0B0F14] flex items-center justify-center p-8">
          {activeProduct ? (
            <div className="w-full max-w-lg">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <img src={activeProduct.imageUrl} alt={activeProduct.name} className="h-32 object-contain drop-shadow-2xl" />
                  <h2 className="text-3xl font-black text-[#F3F4F6]">{activeProduct.name}</h2>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setInputMode("full")}
                  className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-colors ${inputMode === "full" ? 'bg-[#DDAA33]/10 border-[#DDAA33] text-[#DDAA33]' : 'bg-[#1C1C1C] border-[#2A2A2A] text-[#9CA3AF]'}`}
                >
                  <span className="text-xs uppercase tracking-wider font-bold mb-1">Full Bottles</span>
                  <span className="text-3xl font-black">{fullCount}</span>
                </button>
                <button 
                  onClick={() => setInputMode("ml")}
                  className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center justify-center transition-colors ${inputMode === "ml" ? 'bg-[#DDAA33]/10 border-[#DDAA33] text-[#DDAA33]' : 'bg-[#1C1C1C] border-[#2A2A2A] text-[#9CA3AF]'}`}
                >
                  <span className="text-xs uppercase tracking-wider font-bold mb-1">Open (ml)</span>
                  <span className="text-3xl font-black">{mlCount}</span>
                </button>
              </div>

              {/* Numpad */}
              <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-4">
                <div className="grid grid-cols-3 gap-2">
                  {[1,2,3,4,5,6,7,8,9].map(num => (
                    <button 
                      key={num}
                      onClick={() => handleNumpad(num.toString())}
                      className="h-16 bg-[#121212] border border-[#2A2A2A] rounded-xl text-2xl font-bold text-[#F3F4F6] hover:bg-[#2A2A2A] hover:border-[#DDAA33] transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                  <button onClick={handleClear} className="h-16 bg-[#F87171]/10 border border-[#F87171]/20 rounded-xl text-sm font-bold text-[#F87171] hover:bg-[#F87171]/20 transition-colors">
                    CLEAR
                  </button>
                  <button onClick={() => handleNumpad("0")} className="h-16 bg-[#121212] border border-[#2A2A2A] rounded-xl text-2xl font-bold text-[#F3F4F6] hover:bg-[#2A2A2A] hover:border-[#DDAA33] transition-colors">
                    0
                  </button>
                  <button onClick={handleSaveCount} className="h-16 bg-[#34D399] border border-[#34D399] rounded-xl text-sm font-bold text-[#121212] hover:bg-[#059669] transition-colors shadow-lg shadow-[#34D399]/20 flex items-center justify-center gap-2">
                    <Check size={20} /> SAVE
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Calculator size={64} className="text-[#2A2A2A] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#F3F4F6]">Ready to Count</h3>
              <p className="text-[#9CA3AF] mt-2">Select a product from the list or scan a barcode.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
