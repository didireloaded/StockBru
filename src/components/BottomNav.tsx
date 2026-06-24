"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomNav.module.css";
import { Home, Package, BarChart2, Menu, ScanLine } from "lucide-react"; 

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className={styles.navBar}>
      <Link href="/" className={`${styles.navItem} ${pathname === "/" ? styles.active : ""}`}>
        <Home size={24} className={pathname === "/" ? styles.iconActive : styles.iconInactive} />
        <span className={styles.label}>Home</span>
      </Link>
      
      <Link href="/inventory" className={`${styles.navItem} ${pathname.startsWith("/inventory") ? styles.active : ""}`}>
        <Package size={24} className={pathname.startsWith("/inventory") ? styles.iconActive : styles.iconInactive} />
        <span className={styles.label}>Items</span>
      </Link>
      
      <div className={styles.fabSpacer}>
        <Link href="/scan" className={styles.fab} aria-label="Scan">
          <ScanLine size={24} color="white" />
        </Link>
      </div>

      <Link href="/reports" className={`${styles.navItem} ${pathname.startsWith("/reports") ? styles.active : ""}`}>
        <BarChart2 size={24} className={pathname.startsWith("/reports") ? styles.iconActive : styles.iconInactive} />
        <span className={styles.label}>Stats</span>
      </Link>

      <Link href="/settings" className={`${styles.navItem} ${pathname.startsWith("/settings") ? styles.active : ""}`}>
        <Menu size={24} className={pathname.startsWith("/settings") ? styles.iconActive : styles.iconInactive} />
        <span className={styles.label}>Menu</span>
      </Link>
    </div>
  );
}
