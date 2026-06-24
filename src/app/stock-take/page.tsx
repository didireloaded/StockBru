"use client";

import { useState } from "react";
import { Camera, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import styles from "./stock-take.module.css";

export default function StockTakePage() {
  const [step, setStep] = useState<"start" | "counting" | "review">("start");

  const totalItems = 186;
  const countedItems = 145;
  const progress = (countedItems / totalItems) * 100;

  return (
    <div className={styles.stockTakePage}>
      <header className={styles.header}>
        <h1>Stock Take</h1>
      </header>

      {step === "start" && (
        <div className={styles.startState}>
          <div className={styles.iconCircle}>
            <CheckCircle2 size={48} color="var(--accent-gold)" />
          </div>
          <h2>Weekly Stock Count</h2>
          <p>Last count: 7 days ago</p>
          <button className={styles.primaryBtn} onClick={() => setStep("counting")}>
            Start New Stock Take
          </button>
        </div>
      )}

      {step === "counting" && (
        <div className={styles.countingState}>
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>{progress.toFixed(0)}% Complete</span>
              <span>{countedItems} / {totalItems}</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className={styles.scanArea}>
            <Camera size={48} color="var(--text-secondary)" />
            <p>Scan next item</p>
          </div>

          <div className={styles.manualEntry}>
            <h3>Or enter manually</h3>
            <div className={styles.itemCard}>
              <div className={styles.itemDetails}>
                <h4>Ciroc Vodka</h4>
                <p>Expected: 20 Bottles</p>
              </div>
              <div className={styles.inputGroup}>
                <input type="number" placeholder="0" className={styles.countInput} />
                <button className={styles.nextBtn}>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <button className={styles.secondaryBtn} onClick={() => setStep("review")}>
            Finish Count
          </button>
        </div>
      )}

      {step === "review" && (
        <div className={styles.reviewState}>
          <div className={styles.summaryCard}>
            <h3>Variance Report</h3>
            <div className={styles.varianceList}>
              <div className={styles.varianceItem}>
                <div className={styles.vDetails}>
                  <h4>Ciroc Vodka</h4>
                  <span>Expected: 20 | Actual: 18</span>
                </div>
                <div className={styles.vBadgeAlert}>-2 Missing</div>
              </div>
              <div className={styles.varianceItem}>
                <div className={styles.vDetails}>
                  <h4>Hunters Gold</h4>
                  <span>Expected: 146 | Actual: 145</span>
                </div>
                <div className={styles.vBadgeAlert}>-1 Missing</div>
              </div>
              <div className={styles.varianceItem}>
                <div className={styles.vDetails}>
                  <h4>Gordons Gin</h4>
                  <span>Expected: 4 | Actual: 4</span>
                </div>
                <div className={styles.vBadgeGood}>Matched</div>
              </div>
            </div>
          </div>
          
          <div className={styles.totalLoss}>
            <AlertTriangle size={24} color="var(--status-orange)" />
            <div className={styles.lossText}>
              <span>Potential Loss</span>
              <strong>N$ 850.00</strong>
            </div>
          </div>

          <button className={styles.primaryBtn} onClick={() => setStep("start")}>
            Submit Report
          </button>
        </div>
      )}
    </div>
  );
}
