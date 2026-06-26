import { Bottle, Supplier, ActivityItem, InventoryMovement } from '../types';

// Generate recent dates relative to "now" so seed data never looks stale
const now = Date.now();
const h = (hours: number) => new Date(now - hours * 3600000).toISOString();
const d = (days: number) => new Date(now - days * 86400000).toISOString();

export const BOTTLE_IMAGES: Record<number, string> = {
  1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ciroc_Vodka_Bottle.jpg/220px-Ciroc_Vodka_Bottle.jpg',
  2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Grey_Goose_Vodka.jpg/220px-Grey_Goose_Vodka.jpg',
  3: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Belvedere_Vodka_2014.jpg/220px-Belvedere_Vodka_2014.jpg',
  4: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Hennessy_Cognac_Bottle.jpg/220px-Hennessy_Cognac_Bottle.jpg',
  5: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Jameson_whiskey_bottle.jpg/220px-Jameson_whiskey_bottle.jpg',
  6: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Jack_Daniel%27s_Old_No._7_%28edit%29.jpg/220px-Jack_Daniel%27s_Old_No._7_%28edit%29.jpg',
  7: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Moet_Chandon_Rose.JPG/220px-Moet_Chandon_Rose.JPG',
  8: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Veuve_Clicquot_Ponsardin_--_Brut_Champagne.jpg/220px-Veuve_Clicquot_Ponsardin_--_Brut_Champagne.jpg',
  9: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Dom_Perignon_champagne.jpg/220px-Dom_Perignon_champagne.jpg',
  10: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Heineken_International_bottle.jpg/220px-Heineken_International_bottle.jpg',
  11: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Windhoek_Lager_440ml_can.png/220px-Windhoek_Lager_440ml_can.png',
  12: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/RedBullEnergyDrinkCan.jpg/220px-RedBullEnergyDrinkCan.jpg',
  13: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Bottle_of_water.jpg/220px-Bottle_of_water.jpg',
  14: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/2011-01-15_Coke_bottle_in_a_restaurant.jpg/220px-2011-01-15_Coke_bottle_in_a_restaurant.jpg',
  15: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Orange_juice_1.jpg/220px-Orange_juice_1.jpg',
  16: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Gordon%27s_Gin_bottle_%282012%29.jpg/220px-Gordon%27s_Gin_bottle_%282012%29.jpg',
  17: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Tanqueray_no._ten.jpg/220px-Tanqueray_no._ten.jpg',
  18: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Bacardi_Blanco.jpg/220px-Bacardi_Blanco.jpg',
};

export const BOTTLES_SEED: Bottle[] = [
  { id: 1, name: "Ciroc Vodka", sku: "SP-CIROC", category: "Spirits", quantity: 12, openBottles: 3, price: 450, cost: 280, reorderLevel: 6, maxStock: 30, status: "Normal", supplierId: 1, location: "Main Fridge", notes: "Top seller on weekends.", tags: ["VIP", "Fast Seller"], batchNumber: "B-2026-0421", createdAt: d(90), lastMovementAt: h(2) },
  { id: 2, name: "Grey Goose", sku: "SP-GGOOSE", category: "Spirits", quantity: 8, openBottles: 2, price: 520, cost: 320, reorderLevel: 5, maxStock: 25, status: "Normal", supplierId: 1, location: "Main Fridge", tags: ["Premium", "Imported"], createdAt: d(90), lastMovementAt: h(5) },
  { id: 3, name: "Belvedere", sku: "SP-BELV", category: "Spirits", quantity: 6, openBottles: 1, price: 480, cost: 300, reorderLevel: 4, maxStock: 20, status: "Normal", supplierId: 1, location: "VIP Fridge", tags: ["Premium"], createdAt: d(90), lastMovementAt: h(18) },
  { id: 4, name: "Hennessy VS", sku: "SP-HENVS", category: "Spirits", quantity: 10, openBottles: 2, price: 680, cost: 420, reorderLevel: 8, maxStock: 30, status: "Normal", supplierId: 2, location: "Storeroom", tags: ["Fast Seller"], createdAt: d(90), lastMovementAt: h(6) },
  { id: 5, name: "Jameson", sku: "SP-JAMES", category: "Spirits", quantity: 15, openBottles: 4, price: 380, cost: 220, reorderLevel: 10, maxStock: 40, status: "Normal", supplierId: 2, location: "Main Bar", tags: ["Fast Seller", "Local"], createdAt: d(90), lastMovementAt: h(3) },
  { id: 6, name: "Jack Daniel's", sku: "SP-JD", category: "Spirits", quantity: 9, openBottles: 3, price: 420, cost: 260, reorderLevel: 10, maxStock: 30, status: "Low", supplierId: 3, location: "Main Bar", tags: ["Fast Seller"], createdAt: d(90), lastMovementAt: h(1) },
  { id: 7, name: "Moët & Chandon", sku: "WI-MOET", category: "Wine & Champagne", quantity: 7, openBottles: 2, price: 890, cost: 550, reorderLevel: 8, maxStock: 20, status: "Low", supplierId: 1, location: "Cold Room", expiryDate: "2028-12-31", tags: ["Premium"], createdAt: d(120), lastMovementAt: h(12) },
  { id: 8, name: "Veuve Clicquot", sku: "WI-VC", category: "Wine & Champagne", quantity: 5, openBottles: 1, price: 950, cost: 600, reorderLevel: 6, maxStock: 15, status: "Low", supplierId: 1, location: "Cold Room", expiryDate: "2029-06-30", tags: ["Premium", "VIP"], createdAt: d(120), lastMovementAt: d(2) },
  { id: 9, name: "Dom Pérignon", sku: "WI-DP", category: "Wine & Champagne", quantity: 2, openBottles: 0, price: 3200, cost: 2100, reorderLevel: 3, maxStock: 10, status: "Critical", supplierId: 1, location: "VIP Fridge", expiryDate: "2030-01-15", tags: ["Ultra Premium", "VIP"], createdAt: d(180), lastMovementAt: d(5) },
  { id: 10, name: "Heineken", sku: "BR-HEIN", category: "Beer", quantity: 24, openBottles: 6, price: 45, cost: 22, reorderLevel: 30, maxStock: 100, status: "Low", supplierId: 4, location: "Cold Room", tags: ["Fast Seller"], createdAt: d(90), lastMovementAt: h(1) },
  { id: 11, name: "Windhoek Draught", sku: "BR-WIND", category: "Beer", quantity: 36, openBottles: 12, price: 38, cost: 18, reorderLevel: 24, maxStock: 120, status: "Normal", supplierId: 4, location: "Cold Room", tags: ["Local", "Fast Seller"], createdAt: d(90), lastMovementAt: h(4) },
  { id: 12, name: "Red Bull", sku: "MX-RB", category: "Mixers & Others", quantity: 30, openBottles: 0, price: 35, cost: 18, reorderLevel: 20, maxStock: 60, status: "Normal", supplierId: 5, location: "Storeroom", expiryDate: "2027-09-15", tags: ["Mixer"], createdAt: d(90), lastMovementAt: h(8) },
  { id: 13, name: "Water (Still)", sku: "NA-WAT", category: "Non-Alcoholic", quantity: 48, openBottles: 0, price: 20, cost: 6, reorderLevel: 24, maxStock: 40, status: "Overstocked", supplierId: 5, location: "Storeroom", expiryDate: "2027-06-30", tags: ["Mixer"], createdAt: d(90), lastMovementAt: d(1) },
  { id: 14, name: "Coca Cola", sku: "MX-COKE", category: "Mixers & Others", quantity: 24, openBottles: 0, price: 25, cost: 10, reorderLevel: 30, maxStock: 80, status: "Low", supplierId: 5, location: "Storeroom", expiryDate: "2027-08-20", tags: ["Mixer", "Fast Seller"], createdAt: d(90), lastMovementAt: h(3) },
  { id: 15, name: "Orange Juice", sku: "NA-OJ", category: "Non-Alcoholic", quantity: 12, openBottles: 2, price: 30, cost: 12, reorderLevel: 12, maxStock: 30, status: "Normal", supplierId: 5, location: "Main Fridge", expiryDate: "2026-07-15", tags: ["Fresh", "Perishable"], createdAt: d(60), lastMovementAt: h(10) },
  { id: 16, name: "Gordon's Gin", sku: "SP-GGIN", category: "Spirits", quantity: 4, openBottles: 2, price: 280, cost: 170, reorderLevel: 12, maxStock: 25, status: "Critical", supplierId: 2, location: "Main Bar", tags: ["Slow Seller"], createdAt: d(90), lastMovementAt: d(3) },
  { id: 17, name: "Tanqueray Gin", sku: "SP-TANQ", category: "Spirits", quantity: 5, openBottles: 1, price: 420, cost: 260, reorderLevel: 12, maxStock: 20, status: "Critical", supplierId: 2, location: "Main Bar", tags: ["Premium", "Slow Seller"], createdAt: d(90), lastMovementAt: d(4) },
  { id: 18, name: "Bacardi White Rum", sku: "SP-BACW", category: "Spirits", quantity: 8, openBottles: 3, price: 320, cost: 190, reorderLevel: 12, maxStock: 30, status: "Low", supplierId: 3, location: "Main Bar", tags: ["Fast Seller"], createdAt: d(90), lastMovementAt: h(6) },
];

export const SUPPLIERS_SEED: Supplier[] = [
  { id: 1, name: "Moët Hennessy", contact: "Jean Dupont", email: "jean@mh.com", phone: "+264 61 123 456", location: "Windhoek Central", bottlesSupplied: 5, logoColor: "from-rose-600 to-rose-900" },
  { id: 2, name: "Diageo Namibia", contact: "Sarah Muller", email: "sarah@diageo.na", phone: "+264 61 234 567", location: "Eros, Windhoek", bottlesSupplied: 4, logoColor: "from-blue-600 to-blue-900" },
  { id: 3, name: "Brown-Forman", contact: "Tom Bradley", email: "tom@bf.com", phone: "+264 61 345 678", location: "Klein Windhoek", bottlesSupplied: 2, logoColor: "from-amber-600 to-amber-900" },
  { id: 4, name: "Namibia Breweries", contact: "Heini Becker", email: "heini@nbl.com.na", phone: "+264 61 456 789", location: "Southern Industrial", bottlesSupplied: 2, logoColor: "from-emerald-600 to-emerald-900" },
  { id: 5, name: "Mash Holdings", contact: "Nandi Okoroma", email: "nandi@mash.co", phone: "+264 61 567 890", location: "Northern Industrial", bottlesSupplied: 5, logoColor: "from-purple-600 to-purple-900" },
];

// Seed activities with real ISO timestamps so formatRelativeTime works
export const ACTIVITIES_SEED: ActivityItem[] = [
  { id: 1, type: 'stocktake', title: 'Stock take completed - Main Bar', subtitle: 'All items verified', user: 'John Manager', time: h(0.03) },
  { id: 2, type: 'sale', title: '3 Bottles of Ciroc Vodka sold', subtitle: 'Table #14', user: 'Sarah Staff', time: h(0.25) },
  { id: 3, type: 'purchase', title: 'Received delivery from Diageo', subtitle: '24 units across 4 products', user: 'Pedro Manager', time: h(2) },
  { id: 4, type: 'order', title: 'Purchase order #PO-1256 approved', subtitle: 'Namibia Beverages', user: 'Pedro Manager', time: h(5) },
  { id: 5, type: 'adjustment', title: 'Stock adjustment - Tanqueray Gin', subtitle: '2 broken bottles written off', user: 'Mary Staff', time: h(8) },
];

// Seed movements with recent timestamps so trend chart and velocity work
export const MOVEMENTS_SEED: InventoryMovement[] = [
  { id: 101, timestamp: h(1), type: 'sold', bottleId: 1, bottleName: 'Ciroc Vodka', sku: 'SP-CIROC', qty: 3, user: 'Sarah Staff' },
  { id: 102, timestamp: h(2), type: 'received', bottleId: 10, bottleName: 'Heineken', sku: 'BR-HEIN', qty: 24, user: 'Pedro Manager' },
  { id: 103, timestamp: h(3), type: 'sold', bottleId: 5, bottleName: 'Jameson', sku: 'SP-JAMES', qty: 2, user: 'Sarah Staff' },
  { id: 104, timestamp: h(4), type: 'opened_bottle', bottleId: 6, bottleName: "Jack Daniel's", sku: 'SP-JD', qty: 1, user: 'John Manager' },
  { id: 105, timestamp: h(6), type: 'sold', bottleId: 11, bottleName: 'Windhoek Draught', sku: 'BR-WIND', qty: 6, user: 'Sarah Staff' },
  { id: 106, timestamp: h(8), type: 'sold', bottleId: 12, bottleName: 'Red Bull', sku: 'MX-RB', qty: 4, user: 'John Manager' },
  { id: 107, timestamp: h(12), type: 'received', bottleId: 1, bottleName: 'Ciroc Vodka', sku: 'SP-CIROC', qty: 12, user: 'Pedro Manager' },
  { id: 108, timestamp: d(1), type: 'sold', bottleId: 1, bottleName: 'Ciroc Vodka', sku: 'SP-CIROC', qty: 5, user: 'Sarah Staff' },
  { id: 109, timestamp: d(1), type: 'sold', bottleId: 10, bottleName: 'Heineken', sku: 'BR-HEIN', qty: 12, user: 'John Manager' },
  { id: 110, timestamp: d(2), type: 'received', bottleId: 5, bottleName: 'Jameson', sku: 'SP-JAMES', qty: 10, user: 'Pedro Manager' },
  { id: 111, timestamp: d(2), type: 'sold', bottleId: 4, bottleName: 'Hennessy VS', sku: 'SP-HENVS', qty: 3, user: 'Sarah Staff' },
  { id: 112, timestamp: d(3), type: 'sold', bottleId: 14, bottleName: 'Coca Cola', sku: 'MX-COKE', qty: 8, user: 'John Manager' },
  { id: 113, timestamp: d(4), type: 'received', bottleId: 11, bottleName: 'Windhoek Draught', sku: 'BR-WIND', qty: 24, user: 'Pedro Manager' },
  { id: 114, timestamp: d(5), type: 'sold', bottleId: 2, bottleName: 'Grey Goose', sku: 'SP-GGOOSE', qty: 2, user: 'Sarah Staff' },
  { id: 115, timestamp: d(7), type: 'sold', bottleId: 18, bottleName: 'Bacardi White Rum', sku: 'SP-BACW', qty: 4, user: 'John Manager' },
];
