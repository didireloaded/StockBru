"use client";

import { useState } from "react";
import { TrendingUp, AlertCircle, FileText, Download } from "lucide-react";
import styles from "./reports.module.css";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<"Today" | "Week" | "Month">("Week");

  return (
    <div className={styles.reportsPage}>
      <header className={styles.header}>
        <h1>Reports</h1>
        <button className={styles.iconButton}>
          <Download size={24} />
        </button>
      </header>

      <div className={styles.tabs}>
        {["Today", "Week", "Month"].map(tab => (
          <button 
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <p className={styles.label}>Revenue Est.</p>
          <h3 className={styles.value}>N$ 84,200</h3>
          <span className={styles.trendUp}>+12% vs last {activeTab.toLowerCase()}</span>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.label}>Bottles Sold</p>
          <h3 className={styles.value}>246</h3>
          <span className={styles.trendUp}>+5% vs last {activeTab.toLowerCase()}</span>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.label}>Shots Sold</p>
          <h3 className={styles.value}>1,840</h3>
          <span className={styles.trendUp}>+18% vs last {activeTab.toLowerCase()}</span>
        </div>
        <div className={styles.summaryCard}>
          <p className={styles.label}>Missing Value</p>
          <h3 className={styles.valueAlert}>N$ 1,250</h3>
          <span className={styles.trendDown}>-2% vs last {activeTab.toLowerCase()}</span>
        </div>
      </div>

      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <h3>Sales Volume</h3>
        </div>
        <div className={styles.mockChart}>
          {/* Simple CSS mock chart */}
          <div className={styles.barContainer}>
            <div className={styles.bar} style={{ height: "40%" }} />
            <span>Mon</span>
          </div>
          <div className={styles.barContainer}>
            <div className={styles.bar} style={{ height: "60%" }} />
            <span>Tue</span>
          </div>
          <div className={styles.barContainer}>
            <div className={styles.bar} style={{ height: "80%" }} />
            <span>Wed</span>
          </div>
          <div className={styles.barContainer}>
            <div className={styles.bar} style={{ height: "50%" }} />
            <span>Thu</span>
          </div>
          <div className={styles.barContainer}>
            <div className={`${styles.bar} ${styles.barHighlight}`} style={{ height: "100%" }} />
            <span>Fri</span>
          </div>
          <div className={styles.barContainer}>
            <div className={`${styles.bar} ${styles.barHighlight}`} style={{ height: "90%" }} />
            <span>Sat</span>
          </div>
          <div className={styles.barContainer}>
            <div className={styles.bar} style={{ height: "30%" }} />
            <span>Sun</span>
          </div>
        </div>
      </div>

      <div className={styles.listSection}>
        <h3>Top Performing Products</h3>
        <div className={styles.listItem}>
          <div className={styles.itemLeft}>
            <div className={styles.rank}>1</div>
            <div className={styles.details}>
              <h4>Ciroc Vodka</h4>
              <span>120 Bottles</span>
            </div>
          </div>
          <div className={styles.itemRight}>
            <strong>N$ 42,000</strong>
          </div>
        </div>
        <div className={styles.listItem}>
          <div className={styles.itemLeft}>
            <div className={styles.rank}>2</div>
            <div className={styles.details}>
              <h4>Hunters Gold</h4>
              <span>450 Units</span>
            </div>
          </div>
          <div className={styles.itemRight}>
            <strong>N$ 15,750</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
