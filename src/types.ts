export type BottleStatus = 'Normal' | 'Low' | 'Critical' | 'Out of Stock' | 'Overstocked';
export type POSortStatus = 'pending' | 'approved' | 'received' | 'cancelled';
export type MovementType = 'received' | 'sold' | 'adjusted' | 'variance' | 'damaged' | 'transferred' | 'opened_bottle';
export type StocktakeStatus = 'draft' | 'in_progress' | 'completed';
export type SnapshotScope = 'full' | 'location' | 'category';

export interface Bottle {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  category: 'Spirits' | 'Beer' | 'Wine & Champagne' | 'Mixers & Others' | 'Non-Alcoholic';
  quantity: number;
  openBottles?: number;
  remainingVolume?: number;
  price: number;
  cost: number;
  reorderLevel: number;
  maxStock?: number;
  status: BottleStatus;
  supplierId?: number;
  location?: 'Main Fridge' | 'VIP Fridge' | 'Storeroom' | 'Cold Room' | 'Display Shelf' | 'Main Bar';
  notes?: string;
  tags?: string[];
  expiryDate?: string;
  batchNumber?: string;
  favorite?: boolean;
  createdAt?: string;
  lastMovementAt?: string;
}

export interface ActivityItem {
  id: number;
  type: 'stocktake' | 'sale' | 'purchase' | 'adjustment' | 'alert' | 'order' | 'shift' | 'ai' | 'transfer' | 'snapshot' | 'note' | 'tag';
  title: string;
  subtitle: string;
  user?: string;
  time: string; // always ISO string
  isAlert?: boolean;
}

export interface SaleItem {
  bottleId: number;
  qty: number;
  price: number;
}

export interface Sale {
  id: number;
  date: string;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  total: number;
  customer?: string;
  tableNumber?: string;
  user: string;
}

export interface POItem {
  bottleId: number;
  qty: number;
  cost: number;
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  date: string;
  items: POItem[];
  status: POSortStatus;
  total: number;
  notes?: string;
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  bottlesSupplied: number;
  logoColor: string;
}

export interface StocktakeItem {
  bottleId: number;
  expected: number;
  actual?: number;
  variance?: number;
  countedAt?: string;
  countedBy?: string;
  cause?: string;
}

export interface Stocktake {
  id: number;
  date: string;
  location: string;
  items: StocktakeItem[];
  status: StocktakeStatus;
  user: string;
  notes?: string;
}

export interface Shift {
  id: number;
  user: string;
  role: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'scheduled';
  sales?: number;
  notes?: string;
}

export interface ChatMessage {
  id: number;
  from: 'ai' | 'user';
  text: string;
  time: string;
}

export interface InventoryMovement {
  id: number;
  timestamp: string;
  type: MovementType;
  bottleId: number;
  bottleName: string;
  sku: string;
  qty: number;
  fromLocation?: string;
  toLocation?: string;
  user: string;
  notes?: string;
}

export interface InventorySnapshot {
  id: number;
  timestamp: string;
  name: string;
  scope: SnapshotScope;
  location?: string;
  category?: string;
  counts: { bottleId: number; qty: number; openBottles: number }[];
  totalValue: number;
  totalItems: number;
  user: string;
  notes?: string;
}

export interface InventoryTransfer {
  id: number;
  timestamp: string;
  bottleId: number;
  bottleName: string;
  qty: number;
  fromLocation: string;
  toLocation: string;
  user: string;
  notes?: string;
}

export interface Recommendation {
  id: number;
  type: 'reorder' | 'overstock' | 'dead_stock' | 'expiry_warning' | 'variance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  bottleId?: number;
  action?: { label: string; navTarget?: string };
}
