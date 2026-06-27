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
