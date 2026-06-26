import { Bottle, BottleStatus, Recommendation, InventoryMovement, InventorySnapshot, SnapshotScope } from '../types';

// ─── Single source of truth for status ───
export function calculateBottleStatus(bottle: Bottle): BottleStatus {
  if (bottle.quantity === 0) return 'Out of Stock';
  if (bottle.maxStock && bottle.quantity >= bottle.maxStock) return 'Overstocked';
  if (bottle.quantity <= bottle.reorderLevel / 2) return 'Critical';
  if (bottle.quantity <= bottle.reorderLevel) return 'Low';
  return 'Normal';
}

// ─── Inventory Health Score (0-100) ───
export function calculateInventoryHealth(bottles: Bottle[], stocktakes: { status: string }[]): number {
  if (bottles.length === 0) return 100;
  let score = 100;
  const outOfStock = bottles.filter(b => b.status === 'Out of Stock').length;
  const critical = bottles.filter(b => b.status === 'Critical').length;
  const low = bottles.filter(b => b.status === 'Low').length;
  score -= outOfStock * 5;
  score -= critical * 3;
  score -= low * 1;

  // Expiry penalties
  bottles.forEach(b => {
    if (b.expiryDate) {
      const days = (new Date(b.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (days <= 0) score -= 3;
      else if (days < 30) score -= 1;
    }
  });

  // Stocktake compliance bonus
  const completed = stocktakes.filter(s => s.status === 'completed').length;
  if (stocktakes.length > 0 && completed / stocktakes.length >= 0.8) score += 2;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function healthLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

// ─── Product Score (0-100) ───
export function calculateProductScore(bottle: Bottle, movements: InventoryMovement[] = []): number {
  let score = 100;
  if (bottle.status === 'Critical' || bottle.status === 'Out of Stock') score -= 30;
  else if (bottle.status === 'Low') score -= 15;
  else if (bottle.status === 'Overstocked') score -= 10;

  const bottleMoves = movements.filter(m => m.bottleId === bottle.id && (m.type === 'sold' || m.type === 'opened_bottle'));
  if (bottleMoves.length > 10) score += 10;
  else if (bottleMoves.length > 5) score += 5;
  else if (bottleMoves.length === 0) score -= 15;

  if (bottle.lastMovementAt) {
    const days = (Date.now() - new Date(bottle.lastMovementAt).getTime()) / (1000 * 60 * 60 * 24);
    if (days > 90) score -= 20;
    else if (days > 60) score -= 10;
    else if (days > 30) score -= 5;
  }
  return Math.max(0, Math.min(100, score));
}

// ─── Daily velocity (30-day rolling window) ───
export function calculateDailyVelocity(bottle: Bottle, movements: InventoryMovement[]): number {
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recent = movements.filter(m => m.bottleId === bottle.id && (m.type === 'sold' || m.type === 'opened_bottle') && new Date(m.timestamp).getTime() >= thirtyDaysAgo);
  const totalQty = recent.reduce((s, m) => s + m.qty, 0);
  return totalQty / 30;
}

// ─── Recommendations engine ───
export function getRecommendations(bottles: Bottle[], movements: InventoryMovement[]): Recommendation[] {
  const recs: Recommendation[] = [];

  bottles.forEach(b => {
    if (b.status === 'Critical' || b.status === 'Low' || b.status === 'Out of Stock') {
      const velocity = calculateDailyVelocity(b, movements);
      const daysRemaining = velocity > 0 ? b.quantity / velocity : 999;
      recs.push({
        id: b.id * 1000 + 1, type: 'reorder',
        priority: b.status === 'Critical' || b.status === 'Out of Stock' ? 'high' : 'medium',
        title: `Reorder ${b.name}`,
        description: `${b.quantity} left. ${velocity > 0 ? `~${Math.round(daysRemaining)} days remaining.` : ''} Order ${Math.max(1, b.reorderLevel * 2 - b.quantity)} units.`,
        bottleId: b.id,
      });
    }

    if (b.status === 'Overstocked') {
      recs.push({
        id: b.id * 1000 + 2, type: 'overstock', priority: 'low',
        title: `${b.name} overstocked`,
        description: `${b.quantity} units vs max ${b.maxStock}. Consider promotions.`,
        bottleId: b.id,
      });
    }

    if (b.lastMovementAt) {
      const days = (Date.now() - new Date(b.lastMovementAt).getTime()) / (1000 * 60 * 60 * 24);
      if (days > 90 && b.quantity > 0) {
        recs.push({
          id: b.id * 1000 + 3, type: 'dead_stock', priority: 'medium',
          title: `Dead stock: ${b.name}`,
          description: `${Math.round(days)} days without movement. N$ ${(b.quantity * b.cost).toLocaleString()} locked.`,
          bottleId: b.id,
        });
      }
    }

    if (b.expiryDate) {
      const daysLeft = (new Date(b.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysLeft <= 0) {
        recs.push({
          id: b.id * 1000 + 5, type: 'expiry_warning', priority: 'high',
          title: `${b.name} EXPIRED`, description: `Expired ${b.expiryDate}. Remove immediately.`,
          bottleId: b.id,
        });
      } else if (daysLeft < 30) {
        recs.push({
          id: b.id * 1000 + 4, type: 'expiry_warning', priority: daysLeft < 7 ? 'high' : 'medium',
          title: `${b.name} expiring in ${Math.round(daysLeft)} days`,
          description: `Expires ${b.expiryDate}. ${b.quantity} units at risk.`,
          bottleId: b.id,
        });
      }
    }
  });

  return recs.sort((a, b) => {
    const prio = { high: 0, medium: 1, low: 2 };
    return prio[a.priority] - prio[b.priority];
  });
}

// ─── Snapshots ───
export function createSnapshot(bottles: Bottle[], scope: SnapshotScope, filterValue?: string, user?: string): InventorySnapshot {
  const filtered = scope === 'full' ? bottles
    : scope === 'location' ? bottles.filter(b => b.location === filterValue)
    : bottles.filter(b => b.category === filterValue);
  return {
    id: Date.now(), timestamp: new Date().toISOString(),
    name: `Snapshot ${new Date().toLocaleDateString()}`, scope,
    location: scope === 'location' ? filterValue : undefined,
    category: scope === 'category' ? filterValue : undefined,
    counts: filtered.map(b => ({ bottleId: b.id, qty: b.quantity, openBottles: b.openBottles || 0 })),
    totalValue: filtered.reduce((s, b) => s + b.quantity * b.cost, 0),
    totalItems: filtered.reduce((s, b) => s + b.quantity, 0),
    user: user || 'System',
  };
}

export function compareSnapshots(before: InventorySnapshot, after: InventorySnapshot) {
  const beforeMap = new Map(before.counts.map(c => [c.bottleId, c.qty]));
  const afterMap = new Map(after.counts.map(c => [c.bottleId, c.qty]));
  const allIds = new Set([...beforeMap.keys(), ...afterMap.keys()]);
  const changed: { bottleId: number; before: number; after: number; diff: number }[] = [];
  allIds.forEach(id => {
    const b = beforeMap.get(id) || 0;
    const a = afterMap.get(id) || 0;
    if (b !== a) changed.push({ bottleId: id, before: b, after: a, diff: a - b });
  });
  return { changed };
}

// ─── CSV ───
export function generateInventoryCSV(bottles: Bottle[]): string {
  const headers = 'SKU,Name,Category,Quantity,Open Bottles,Price,Cost,Status,Location,Tags,Expiry,Notes\n';
  const rows = bottles.map(b => [
    b.sku, `"${b.name}"`, b.category, b.quantity, b.openBottles || 0, b.price, b.cost, b.status,
    b.location || '', (b.tags || []).join('|'), b.expiryDate || '', `"${(b.notes || '').replace(/"/g, '""')}"`
  ].join(','));
  return headers + rows.join('\n');
}

// ─── Top sellers from actual sales ───
export function getTopSellers(bottles: Bottle[], movements: InventoryMovement[], limit = 5) {
  const salesMap = new Map<number, number>();
  movements.filter(m => m.type === 'sold' || m.type === 'opened_bottle').forEach(m => {
    salesMap.set(m.bottleId, (salesMap.get(m.bottleId) || 0) + m.qty);
  });
  return [...salesMap.entries()]
    .map(([id, qty]) => {
      const b = bottles.find(x => x.id === id);
      return b ? { name: b.name, qty, revenue: qty * b.price } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b!.revenue - a!.revenue)
    .slice(0, limit) as { name: string; qty: number; revenue: number }[];
}
