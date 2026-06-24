"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Plus, FileText, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ChatAssistant() {
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      role: "assistant",
      content: "Good morning. I've analyzed today's inventory data. We have 5 items requiring your attention before the weekend rush. What would you like to do?",
      widget: null
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      widget: null
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Mock AI Response Logic
    setTimeout(() => {
      let aiResponse: any = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I didn't quite catch that. Try asking about 'low stock' or 'order for Diageo'.",
        widget: null
      };

      const lowerInput = userMessage.content.toLowerCase();

      if (lowerInput.includes("low stock") || lowerInput.includes("order")) {
        aiResponse.content = "Here are the products currently below their minimum thresholds. Would you like me to generate purchase orders for these?";
        aiResponse.widget = "ReorderCenter";
      } else if (lowerInput.includes("diageo")) {
        aiResponse.content = "I've drafted a purchase order for Diageo based on your current burn rate.";
        aiResponse.widget = "PurchaseOrderDraft";
      } else if (lowerInput.includes("variance") || lowerInput.includes("loss")) {
        aiResponse.content = "Based on the last stock take, we are missing N$ 2,135 in value. The biggest culprit is Moet Brut.";
      }

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full font-sans max-w-5xl mx-auto w-full relative">
      <div className="h-20 flex items-center px-6 border-b border-[#2A2A2A] shrink-0 bg-[#0B0F14]/95 backdrop-blur-sm z-10 sticky top-0">
        <h1 className="text-xl font-bold text-[#F3F4F6] flex items-center gap-3">
          <MessageSquare className="text-[#DDAA33]" /> Intelligence Chat
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32 flex flex-col gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              <div className={`p-4 rounded-2xl text-sm ${
                msg.role === 'user' 
                  ? 'bg-[#DDAA33] text-[#121212] font-medium rounded-tr-sm' 
                  : 'bg-[#1C1C1C] border border-[#2A2A2A] text-[#F3F4F6] rounded-tl-sm'
              }`}>
                {msg.content}
              </div>

              {msg.widget === "ReorderCenter" && (
                <div className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5 shadow-lg mt-2">
                  <h3 className="text-sm font-bold text-[#F3F4F6] mb-4">Critical Stock to Reorder</h3>
                  <div className="flex flex-col gap-3">
                     <ReorderRow name="Ciroc Vodka" current={4} min={10} suggest={24} />
                     <ReorderRow name="Gordon's Gin" current={4} min={12} suggest={24} />
                     <button className="w-full mt-2 py-2.5 bg-[#2A2A2A] hover:bg-[#333333] text-[#F3F4F6] text-xs font-bold rounded-lg transition-colors">
                       Generate POs
                     </button>
                  </div>
                </div>
              )}

              {msg.widget === "PurchaseOrderDraft" && (
                <div className="w-[400px] bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl p-5 shadow-lg mt-2 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-[#F3F4F6]">Draft PO: Diageo</h3>
                      <p className="text-xs text-[#9CA3AF]">PO-1257 • Total: N$ 12,400</p>
                    </div>
                    <FileText className="text-[#DDAA33]" size={20} />
                  </div>
                  <div className="text-xs text-[#F3F4F6] bg-[#121212] p-3 rounded-lg border border-[#2A2A2A]">
                    <div className="flex justify-between mb-1"><span className="text-[#9CA3AF]">Ciroc Vodka</span><span>24 btls</span></div>
                    <div className="flex justify-between"><span className="text-[#9CA3AF]">Gordon's Gin</span><span>24 btls</span></div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-[#DDAA33] hover:bg-[#b88d2a] text-[#121212] text-xs font-bold rounded-lg transition-colors">Approve & Send</button>
                    <button className="flex-1 py-2 bg-[#2A2A2A] hover:bg-[#333333] text-[#F3F4F6] text-xs font-bold rounded-lg transition-colors">Edit</button>
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#1C1C1C] border border-[#2A2A2A] p-4 rounded-2xl rounded-tl-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-[#DDAA33]" size={16} />
              <span className="text-xs text-[#9CA3AF]">Analyzing data...</span>
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14] to-transparent">
        <div className="relative max-w-4xl mx-auto flex items-end gap-2">
          <button className="h-14 w-14 shrink-0 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl flex items-center justify-center text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-[#DDAA33]/50 transition-colors">
            <Plus size={24} />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about inventory, variances, or tell me to generate an order..."
              className="w-full h-14 bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl pl-6 pr-14 text-[#F3F4F6] text-sm focus:outline-none focus:border-[#DDAA33] transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#DDAA33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#b88d2a] text-[#121212] rounded-xl flex items-center justify-center transition-colors shadow-lg shadow-[#DDAA33]/20"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReorderRow({ name, current, min, suggest }: { name: string, current: number, min: number, suggest: number }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#121212] border border-[#F87171]/20 rounded-lg">
      <div className="flex flex-col">
        <span className="text-xs font-bold text-[#F3F4F6]">{name}</span>
        <div className="flex gap-2 text-[10px] mt-0.5">
          <span className="text-[#F87171]">Cur: {current}</span>
          <span className="text-[#9CA3AF]">Min: {min}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-[#9CA3AF] uppercase">Suggest</span>
        <span className="text-sm font-bold text-[#34D399]">{suggest}</span>
      </div>
    </div>
  );
}
