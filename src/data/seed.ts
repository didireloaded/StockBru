import { Bottle, Supplier, ActivityItem, InventoryMovement } from '../types';

// Generate recent dates relative to "now" so seed data never looks stale
const now = Date.now();
const h = (hours: number) => new Date(now - hours * 3600000).toISOString();
const d = (days: number) => new Date(now - days * 86400000).toISOString();

export const BOTTLE_IMAGES: Record<number, string> = {
  1: '/products/vodka/vodka-ciroc-original.webp',
  2: '/products/vodka/vodka-grey-goose.webp',
  3: '/products/vodka/vodka-belvedere.webp',
  4: '/products/brandy/brandy-hennessy-vs.webp',
  5: '/products/whiskey/whiskey-jameson.webp',
  6: '/products/whiskey/whiskey-jack-daniels.webp',
  7: '/products/champagne/champagne-moet-imperial.webp',
  8: '/products/champagne/champagne-veuve-clicquot.webp',
  9: '/products/champagne/champagne-moet-imperial.webp',
  10: '/products/beer/beer-heineken.webp',
  11: '/products/beer/beer-windhoek-lager.webp',
  12: '/products/energy-drink/energy-drink-red-bull.webp',
  13: '/products/water/water-still-water.webp',
  14: '/products/cooldrink/cooldrink-coca-cola.webp',
  15: '/products/juice/juice-orange-juice.webp',
  16: '/products/gin/gin-gordons-london-dry.webp',
  17: '/products/gin/gin-tanqueray.webp',
  18: '/products/rum/rum-bacardi-superior.webp',
};

import { getEnterpriseCatalog, generateScenarioLedger } from '../services/scenario.service';

export const BOTTLES_SEED: Bottle[] = getEnterpriseCatalog('busy_friday');

export const SUPPLIERS_SEED: Supplier[] = [
  { id: 1, name: "NamBev Beverage Corporation", contact: "Johan Van Der Merwe", email: "orders@nambev.com.na", phone: "+264 61 299 1111", location: "Windhoek Northern Industrial", bottlesSupplied: 84, logoColor: "from-[#d4a24c] to-amber-900" },
  { id: 2, name: "Diageo Southern Africa", contact: "Sipho Dlamini", email: "hospitality@diageo.com", phone: "+27 11 987 6543", location: "Johannesburg Distribution", bottlesSupplied: 62, logoColor: "from-blue-600 to-blue-900" },
  { id: 3, name: "Pernod Ricard Hospitality", contact: "Claire Dupont", email: "orders@pernod-ricard.com", phone: "+27 21 444 8888", location: "Cape Town Regional Depot", bottlesSupplied: 45, logoColor: "from-purple-600 to-purple-900" },
  { id: 4, name: "Distell Group Limited", contact: "Hendrik Smit", email: "supply@distell.co.za", phone: "+27 21 808 3911", location: "Stellenbosch Supply", bottlesSupplied: 40, logoColor: "from-rose-600 to-rose-900" },
  { id: 5, name: "Heineken Namibia Beverages", contact: "Markus Bauer", email: "dispatch@heineken.na", phone: "+264 61 333 5555", location: "Windhoek Central Depot", bottlesSupplied: 30, logoColor: "from-emerald-600 to-emerald-900" },
];

const initialLedger = generateScenarioLedger(BOTTLES_SEED, 'busy_friday');
export const MOVEMENTS_SEED: InventoryMovement[] = initialLedger.movements;
export const ACTIVITIES_SEED: ActivityItem[] = initialLedger.activities;
