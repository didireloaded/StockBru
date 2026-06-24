"use client";

import { useState } from "react";
import { ArrowLeft, Barcode, Camera, Search, Plus, Minus, CheckCircle2, Wine } from "lucide-react";
import Link from "next/link";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";

const mockProducts = [
  { id: "1", name: "Ciroc Vodka", barcode: "123456789", fullBottles: 12, openBottles: 1, openMl: 420, maxMl: 750, imageUrl: "https://images.unsplash.com/photo-1626804475297-4160eb80bf85?w=200&h=400&fit=crop" },
  { id: "2", name: "Gordon's Gin", barcode: "987654321", fullBottles: 4, openBottles: 0, openMl: 0, maxMl: 750, imageUrl: "https://images.unsplash.com/photo-1614316346936-39dd75eb82b3?w=200&h=400&fit=crop" },
];

export default function RecordSale() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [mode, setMode] = useState<"full" | "ml">("full");
  const [quantity, setQuantity] = useState(1);
  const [mlUsed, setMlUsed] = useState(25);
  
  const [success, setSuccess] = useState(false);

  useBarcodeScanner((barcode) => {
    setSearch(barcode);
    const found = mockProducts.find(p => p.barcode === barcode);
    if (found) {
      handleSelect(found);
    }
  });

  const handleSelect = (product: any) => {
    setSelectedProduct(product);
    setSearch("");
    setQuantity(1);
    setMode(product.openBottles > 0 ? "ml" : "full");
    setSuccess(false);
  };

  const handleRecord = () => {
    setSuccess(true);
    setTimeout(() => {
      setSelectedProduct(null);
      setSuccess(false);
    }, 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto w-full h-full flex flex-col font-sans">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/" className="w-10 h-10 bg-[#1C1C1C] border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-[#F3F4F6]">Record Sale / Usage</h1>
          <p className="text-sm text-[#9CA3AF]">Log full bottle sales or precise open bottle usage.</p>
        </div>
      </div>

      {!selectedProduct && (
        <div className="flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" size={20} />
            <input 
              type="text" 
              placeholder="Scan barcode or search product name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-16 bg-[#1C1C1C] border-2 border-[#2A2A2A] rounded-2xl pl-12 pr-16 text-[#F3F4F6] text-lg focus:outline-none focus:border-[#DDAA33] transition-colors"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#DDAA33] hover:text-[#b88d2a]">
              <Camera size={24} />
            </button>
          </div>

          <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#121212] border border-[#2A2A2A] rounded-full flex items-center justify-center mb-4 text-[#DDAA33]">
              <Barcode size={32} />
            </div>
            <h3 className="text-lg font-bold text-[#F3F4F6]">Awaiting Scan...</h3>
            <p className="text-sm text-[#9CA3AF] mt-2 max-w-md">Scan a product to quickly log a sale or measure a pour.</p>
            
            <div className="mt-8 flex gap-4 w-full">
              {mockProducts.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => handleSelect(p)}
                  className="flex-1 bg-[#121212] border border-[#2A2A2A] p-4 rounded-xl flex items-center gap-4 hover:border-[#DDAA33] transition-colors text-left"
                >
                  <img src={p.imageUrl} alt={p.name} className="h-12 object-contain" />
                  <div>
                    <p className="font-bold text-[#F3F4F6]">{p.name}</p>
                    <div className="flex gap-2 text-[10px] mt-1">
                      <span className="bg-[#2A2A2A] px-1.5 py-0.5 rounded text-[#F3F4F6]">{p.fullBottles} Full</span>
                      {p.openBottles > 0 && <span className="bg-[#DDAA33]/20 text-[#DDAA33] px-1.5 py-0.5 rounded border border-[#DDAA33]/30">{p.openMl}ml Open</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="flex gap-6 flex-col lg:flex-row">
          
          <div className="w-full lg:w-1/3 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col items-center text-center">
             <div className="flex-1 w-full flex items-center justify-center py-4 bg-[#121212] rounded-xl border border-[#2A2A2A] mb-4 relative overflow-hidden">
               <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="h-48 object-contain drop-shadow-2xl z-10 relative" />
               {mode === "ml" && selectedProduct.openBottles > 0 && (
                 <div className="absolute inset-x-0 bottom-0 bg-[#DDAA33]/20" style={{ height: `${(selectedProduct.openMl / selectedProduct.maxMl) * 100}%` }}></div>
               )}
             </div>
             <h2 className="text-xl font-bold text-[#F3F4F6]">{selectedProduct.name}</h2>
             
             <div className="w-full grid grid-cols-2 gap-2 mt-6">
               <div className="p-3 bg-[#121212] rounded-xl border border-[#2A2A2A]">
                 <span className="text-[10px] text-[#9CA3AF] uppercase block">Full Bottles</span>
                 <span className="text-lg font-bold text-[#F3F4F6]">{selectedProduct.fullBottles}</span>
               </div>
               <div className={`p-3 bg-[#121212] rounded-xl border ${selectedProduct.openBottles > 0 ? 'border-[#DDAA33]' : 'border-[#2A2A2A]'}`}>
                 <span className="text-[10px] text-[#9CA3AF] uppercase block">Open Bottle</span>
                 <span className="text-lg font-bold text-[#DDAA33]">{selectedProduct.openMl}ml</span>
               </div>
             </div>
             
             <button onClick={() => setSelectedProduct(null)} className="mt-6 text-sm text-[#9CA3AF] hover:text-[#F3F4F6] underline">
               Cancel
             </button>
          </div>

          <div className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-8 relative overflow-hidden flex flex-col">
            {success ? (
              <div className="absolute inset-0 bg-[#1C1C1C] z-10 flex flex-col items-center justify-center">
                <CheckCircle2 size={64} className="text-[#34D399] mb-4" />
                <h2 className="text-2xl font-bold text-[#F3F4F6]">Sale Recorded!</h2>
                <p className="text-[#9CA3AF] mt-2">Inventory has been deducted.</p>
              </div>
            ) : (
              <>
                <div className="flex bg-[#121212] p-1 rounded-xl mb-8 border border-[#2A2A2A]">
                  <button 
                    onClick={() => setMode("full")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${mode === "full" ? 'bg-[#DDAA33] text-[#121212]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'}`}
                  >
                    Full Bottle Sale
                  </button>
                  <button 
                    onClick={() => setMode("ml")}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${mode === "ml" ? 'bg-[#DDAA33] text-[#121212]' : 'text-[#9CA3AF] hover:text-[#F3F4F6]'}`}
                  >
                    <Wine size={16} /> Open Pour (ml)
                  </button>
                </div>

                {mode === "full" && (
                  <div className="flex flex-col gap-8 flex-1">
                    <div>
                      <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 block">Bottles Sold</label>
                      <div className="flex items-center">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-16 h-16 bg-[#2A2A2A] rounded-l-xl flex items-center justify-center text-[#F3F4F6] hover:bg-[#333333]">
                          <Minus size={24} />
                        </button>
                        <input 
                          type="number" 
                          value={quantity} 
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="h-16 flex-1 bg-[#121212] border-y border-[#2A2A2A] text-center text-3xl font-black text-[#F3F4F6] focus:outline-none"
                        />
                        <button onClick={() => setQuantity(quantity + 1)} className="w-16 h-16 bg-[#2A2A2A] rounded-r-xl flex items-center justify-center text-[#F3F4F6] hover:bg-[#333333]">
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {mode === "ml" && (
                  <div className="flex flex-col gap-6 flex-1">
                    <div>
                      <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-3 block">Quick Pour</label>
                      <div className="grid grid-cols-4 gap-3">
                        {[25, 50, 75, 100].map(val => (
                          <button 
                            key={val}
                            onClick={() => setMlUsed(val)}
                            className={`h-12 rounded-xl text-sm font-bold border transition-colors ${mlUsed === val ? 'bg-[#DDAA33]/20 border-[#DDAA33] text-[#DDAA33]' : 'bg-[#121212] border-[#2A2A2A] text-[#9CA3AF] hover:border-[#DDAA33]/50 hover:text-[#F3F4F6]'}`}
                          >
                            {val}ml
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 block">Custom Pour (ml)</label>
                      <input 
                        type="number" 
                        value={mlUsed} 
                        onChange={(e) => setMlUsed(Number(e.target.value))}
                        className="w-full h-16 bg-[#121212] border border-[#2A2A2A] rounded-xl text-center text-3xl font-black text-[#DDAA33] focus:outline-none focus:border-[#DDAA33]"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-8">
                  <button 
                    onClick={handleRecord}
                    className="w-full h-14 bg-[#DDAA33] hover:bg-[#b88d2a] text-[#121212] font-bold rounded-xl shadow-lg shadow-[#DDAA33]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    Confirm & Deduct Stock
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
