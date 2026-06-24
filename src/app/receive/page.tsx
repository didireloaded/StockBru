"use client";

import { useState } from "react";
import { ArrowLeft, Barcode, Camera, Search, Plus, Minus, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useBarcodeScanner } from "@/hooks/useBarcodeScanner";

// Mock database
const mockProducts = [
  { id: "1", name: "Ciroc Vodka", barcode: "123456789", currentStock: 12, imageUrl: "https://images.unsplash.com/photo-1626804475297-4160eb80bf85?w=200&h=400&fit=crop" },
  { id: "2", name: "Gordon's Gin", barcode: "987654321", currentStock: 4, imageUrl: "https://images.unsplash.com/photo-1614316346936-39dd75eb82b3?w=200&h=400&fit=crop" },
];

export default function ReceiveStock() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [quantity, setQuantity] = useState(1);
  const [supplier, setSupplier] = useState("Diageo");
  const [costPrice, setCostPrice] = useState("");
  
  const [success, setSuccess] = useState(false);

  // Integrate Barcode Scanner Hook
  useBarcodeScanner((barcode) => {
    console.log("Scanned:", barcode);
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
    setSuccess(false);
  };

  const handleReceive = () => {
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
          <h1 className="text-2xl font-bold text-[#F3F4F6]">Receive Stock</h1>
          <p className="text-sm text-[#9CA3AF]">Scan barcodes or manually enter received goods.</p>
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
            <p className="text-sm text-[#9CA3AF] mt-2 max-w-md">Use your physical barcode scanner, tap the camera icon to use your device camera, or search manually above.</p>
            
            {/* Mock Quick Select for Demo */}
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
                    <p className="text-xs text-[#9CA3AF]">Current: {p.currentStock}</p>
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
             <div className="flex-1 w-full flex items-center justify-center py-4 bg-[#121212] rounded-xl border border-[#2A2A2A] mb-4">
               <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="h-48 object-contain drop-shadow-2xl" />
             </div>
             <h2 className="text-xl font-bold text-[#F3F4F6]">{selectedProduct.name}</h2>
             <span className="text-xs font-mono text-[#9CA3AF] bg-[#2A2A2A] px-2 py-0.5 rounded mt-2">{selectedProduct.barcode}</span>
             
             <div className="w-full flex justify-between mt-6 p-4 bg-[#121212] rounded-xl border border-[#2A2A2A]">
               <span className="text-sm text-[#9CA3AF]">Current Stock</span>
               <span className="text-sm font-bold text-[#F3F4F6]">{selectedProduct.currentStock} Bottles</span>
             </div>
             
             <button onClick={() => setSelectedProduct(null)} className="mt-6 text-sm text-[#9CA3AF] hover:text-[#F3F4F6] underline">
               Cancel & Scan Another
             </button>
          </div>

          <div className="flex-1 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-8 relative overflow-hidden">
            {success ? (
              <div className="absolute inset-0 bg-[#1C1C1C] z-10 flex flex-col items-center justify-center">
                <CheckCircle2 size={64} className="text-[#34D399] mb-4" />
                <h2 className="text-2xl font-bold text-[#F3F4F6]">Stock Received!</h2>
                <p className="text-[#9CA3AF] mt-2">Inventory updated successfully.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-[#F3F4F6] mb-6">Receive Details</h3>
                
                <div className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 block">Quantity Received (Bottles)</label>
                    <div className="flex items-center">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-14 h-14 bg-[#2A2A2A] rounded-l-xl flex items-center justify-center text-[#F3F4F6] hover:bg-[#333333]">
                        <Minus size={20} />
                      </button>
                      <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="h-14 flex-1 bg-[#121212] border-y border-[#2A2A2A] text-center text-2xl font-bold text-[#F3F4F6] focus:outline-none"
                      />
                      <button onClick={() => setQuantity(quantity + 1)} className="w-14 h-14 bg-[#2A2A2A] rounded-r-xl flex items-center justify-center text-[#F3F4F6] hover:bg-[#333333]">
                        <Plus size={20} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 block">Supplier</label>
                    <select 
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="w-full h-14 bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 text-[#F3F4F6] focus:outline-none focus:border-[#DDAA33]"
                    >
                      <option value="Diageo">Diageo</option>
                      <option value="Bacardi">Bacardi</option>
                      <option value="Pernod Ricard">Pernod Ricard</option>
                      <option value="LVMH">LVMH</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2 block">Total Cost Price (N$)</label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="w-full h-14 bg-[#121212] border border-[#2A2A2A] rounded-xl px-4 text-[#F3F4F6] focus:outline-none focus:border-[#DDAA33]"
                    />
                  </div>
                </div>

                <div className="mt-10">
                  <button 
                    onClick={handleReceive}
                    className="w-full h-14 bg-[#34D399] hover:bg-[#059669] text-[#121212] font-bold rounded-xl shadow-lg shadow-[#34D399]/20 transition-colors flex items-center justify-center gap-2"
                  >
                    Confirm & Add to Inventory
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
