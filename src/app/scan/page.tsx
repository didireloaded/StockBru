"use client";

import { useState } from "react";
import { Camera, Plus, Minus, CheckCircle2 } from "lucide-react";
import styles from "./scan.module.css";

export default function ScanPage() {
  const [scanStatus, setScanStatus] = useState<"scanning" | "success">("scanning");

  const simulateScan = () => {
    setScanStatus("success");
    setTimeout(() => setScanStatus("scanning"), 3000);
  };

  return (
    <div className={styles.scanPage}>
      <header className={styles.header}>
        <h1>Scan Product</h1>
      </header>

      <div className={styles.scannerContainer} onClick={simulateScan}>
        {scanStatus === "scanning" ? (
          <>
            <div className={styles.scanTarget}>
              <div className={styles.cornerTopLeft} />
              <div className={styles.cornerTopRight} />
              <div className={styles.cornerBottomLeft} />
              <div className={styles.cornerBottomRight} />
              <div className={styles.scanLine} />
            </div>
            <p className={styles.scanText}>Point camera at barcode</p>
          </>
        ) : (
          <div className={styles.successState}>
            <CheckCircle2 size={64} color="var(--status-green)" />
            <p className={styles.successText}>Ciroc Vodka Detected!</p>
            <span className={styles.stockText}>Current Stock: 18 Bottles</span>
          </div>
        )}
      </div>

      <div className={styles.actionsGrid}>
        <button className={styles.actionButton}>
          <div className={styles.actionIconWrapper}>
            <Plus size={24} color="var(--bg-dark)" />
          </div>
          <span>Receive Stock</span>
        </button>

        <button className={styles.actionButton}>
          <div className={`${styles.actionIconWrapper} ${styles.iconRed}`}>
            <Minus size={24} color="var(--text-primary)" />
          </div>
          <span>Sell Product</span>
        </button>

        <button className={`${styles.actionButton} ${styles.actionFull}`}>
          <div className={`${styles.actionIconWrapper} ${styles.iconGold}`}>
            <CheckCircle2 size={24} color="var(--bg-dark)" />
          </div>
          <span>Check Inventory</span>
        </button>
      </div>
    </div>
  );
}
