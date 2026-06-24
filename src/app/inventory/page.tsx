import { ChevronLeft, SlidersHorizontal, Share2, Search, Plus } from "lucide-react";
import Link from "next/link";
import styles from "./inventory.module.css";

export default function InventoryPage() {
  return (
    <div className={styles.inventoryPage}>
      <header className={styles.header}>
        <Link href="/" className={styles.iconBtn}>
          <ChevronLeft size={24} />
        </Link>
        <h1>Inventory Items</h1>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn}>
            <SlidersHorizontal size={20} />
          </button>
          <button className={styles.iconBtn}>
            <Share2 size={20} />
          </button>
        </div>
      </header>

      <div className={styles.statsCard}>
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Category Items</span>
            <span className={styles.statValue}>7</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Folder</span>
            <span className={styles.statValue}>1</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Qty</span>
            <span className={styles.statValue}>274 Items</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Value</span>
            <span className={styles.statValue}>$323.45</span>
          </div>
        </div>
      </div>

      <div className={styles.searchBar}>
        <Search size={18} className={styles.iconGray} />
        <input type="text" placeholder="Search item list.." className={styles.searchInput} />
      </div>

      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <h2>Snack Folder</h2>
          <span>Total 28 category items</span>
        </div>
        <button className={styles.addBtn}>
          <Plus size={14} />
          <span>Add Items</span>
        </button>
      </div>

      <div className={styles.itemsGrid}>
        {/* Item 1 */}
        <div className={styles.itemCard}>
          <div className={styles.itemImage} style={{ backgroundColor: "#E2E8F0" }}>
            <div className={styles.addCircle}>
              <Plus size={14} color="white" />
            </div>
          </div>
          <div className={styles.itemDetails}>
            <span className={styles.itemCode}>NWNC0101</span>
            <h3 className={styles.itemTitle}>Dim Sum Varia..</h3>
            <span className={styles.itemMeta}>40 Qty • $40.50</span>
          </div>
        </div>

        {/* Item 2 */}
        <div className={styles.itemCard}>
          <div className={styles.itemImage} style={{ backgroundColor: "#CBD5E1" }}>
            <div className={styles.addCircle}>
              <Plus size={14} color="white" />
            </div>
          </div>
          <div className={styles.itemDetails}>
            <span className={styles.itemCode}>NWNC0102</span>
            <h3 className={styles.itemTitle}>Risoles Vermic..</h3>
            <span className={styles.itemMeta}>60 Qty • $108.50</span>
          </div>
        </div>

        {/* Item 3 */}
        <div className={styles.itemCard}>
          <div className={styles.itemImage} style={{ backgroundColor: "#94A3B8" }}>
            <div className={styles.addCircle}>
              <Plus size={14} color="white" />
            </div>
          </div>
          <div className={styles.itemDetails}>
            <span className={styles.itemCode}>NWNC0103</span>
            <h3 className={styles.itemTitle}>Shrimp Roll</h3>
            <span className={styles.itemMeta}>64 Qty • $56.10</span>
          </div>
        </div>

        {/* Item 4 */}
        <div className={styles.itemCard}>
          <div className={styles.itemImage} style={{ backgroundColor: "#64748B" }}>
            <div className={styles.addCircle}>
              <Plus size={14} color="white" />
            </div>
          </div>
          <div className={styles.itemDetails}>
            <span className={styles.itemCode}>NWNC0104</span>
            <h3 className={styles.itemTitle}>Ebi Furai</h3>
            <span className={styles.itemMeta}>3 Qty • $15.80</span>
          </div>
        </div>
      </div>
    </div>
  );
}
