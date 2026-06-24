import styles from "./page.module.css";
import { Sun, ChevronDown, Layers, AlertCircle, ArrowRightLeft, Clock, Activity, ChevronRight } from "lucide-react";

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.dateSelector}>
          <Sun size={14} className={styles.iconGray} />
          <span>Wed, 13 Apr 23</span>
          <ChevronDown size={14} className={styles.iconGray} />
        </div>
        <h1>Welcome, Anthony!</h1>
      </header>

      <div className={styles.heroCard}>
        <div className={styles.heroTop}>
          <div className={styles.heroIconBg}>
            <Layers size={18} color="white" />
          </div>
          <h2>Inventory Summary</h2>
        </div>
        
        <div className={styles.heroGrid}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatLabel}>Category Items</span>
            <span className={styles.heroStatValue}>24</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatLabel}>Folders</span>
            <span className={styles.heroStatValue}>15</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatLabel}>Total Qty</span>
            <span className={styles.heroStatValue}>479 Items</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatLabel}>Total Value</span>
            <span className={styles.heroStatValue}>$1,067.50</span>
          </div>
        </div>
      </div>

      <div className={styles.gridSection}>
        <div className={styles.actionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <AlertCircle size={20} color="var(--nawano-dark-200)" />
            </div>
            <span className={styles.newBadge}>New</span>
          </div>
          <div className={styles.cardBody}>
            <h3>Low Stock</h3>
            <p>All stock items that are low inventory</p>
            <strong>18 Items</strong>
          </div>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <ArrowRightLeft size={20} color="var(--nawano-dark-200)" />
            </div>
            <span className={styles.newBadge}>New</span>
          </div>
          <div className={styles.cardBody}>
            <h3>Move Su..</h3>
            <p>Track inventory that has moved locations</p>
            <strong>8 Orders</strong>
          </div>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <Clock size={20} color="var(--nawano-dark-200)" />
            </div>
          </div>
          <div className={styles.cardBody}>
            <h3>Upcoming..</h3>
            <p>Items in inventory are set to expire soon</p>
            <strong>4 Items</strong>
          </div>
        </div>

        <div className={styles.actionCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <Activity size={20} color="var(--nawano-dark-200)" />
            </div>
          </div>
          <div className={styles.cardBody}>
            <h3>Qty Chan..</h3>
            <p>All inflows and outflows for an item</p>
            <strong>32 Items</strong>
          </div>
        </div>
      </div>

      <div className={styles.filterPills}>
        <button className={styles.pillInactive}>All Activ..</button>
        <button className={styles.pillActive}>Incomin..</button>
        <button className={styles.pillInactive}>Inboun..</button>
        <button className={styles.pillInactive}>Out..</button>
      </div>

      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h3>Incoming Goods Req (4)</h3>
          <button className={styles.viewAllBtn}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        {/* Placeholder for list items */}
      </section>
    </div>
  );
}
