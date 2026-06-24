"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import Link from "next/link";
import styles from "./ai.module.css";

export default function AIOpenPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello Pedro! I'm your StockBru AI. Ask me anything about your inventory, sales, or stock losses." }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");

    // Mock AI response
    setTimeout(() => {
      let aiResponse = "I'm currently checking the database...";
      
      if (userMsg.toLowerCase().includes("ciroc")) {
        aiResponse = "You currently have 18 bottles of Ciroc. Based on average sales, stock will last approximately 4 days.";
      } else if (userMsg.toLowerCase().includes("reorder") || userMsg.toLowerCase().includes("low")) {
        aiResponse = "Ciroc, Hunters Gold and Gordons Gin are projected to run out before Friday.";
      } else if (userMsg.toLowerCase().includes("most")) {
        aiResponse = "Ciroc sold 18 bottles. Gordons Gin sold 42 shots. Hunters Dry sold 96 units.";
      }

      setMessages(prev => [...prev, { role: "assistant", content: aiResponse }]);
    }, 1000);
  };

  return (
    <div className={styles.aiPage}>
      <header className={styles.header}>
        <Link href="/" className={styles.backBtn}>
          <ArrowLeft size={24} />
        </Link>
        <div className={styles.headerTitle}>
          <Bot size={24} color="var(--nawano-primary-200)" />
          <h1>StockBru AI</h1>
        </div>
        <div style={{ width: 24 }} /> {/* spacer */}
      </header>

      <div className={styles.chatArea}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.messageWrapper} ${msg.role === "user" ? styles.userWrapper : styles.aiWrapper}`}>
            {msg.role === "assistant" && (
              <div className={styles.avatarAi}>
                <Bot size={16} color="var(--bg-main)" />
              </div>
            )}
            <div className={`${styles.messageBubble} ${msg.role === "user" ? styles.userBubble : styles.aiBubble}`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputArea}>
        <div className={styles.inputWrapper}>
          <input 
            type="text" 
            placeholder="Ask about your inventory..." 
            className={styles.input}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button className={styles.sendBtn} onClick={handleSend} disabled={!input.trim()}>
            <Send size={20} color={input.trim() ? "var(--nawano-primary-200)" : "var(--text-secondary)"} />
          </button>
        </div>
      </div>
    </div>
  );
}
