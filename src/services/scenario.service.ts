import { Bottle, Sale, InventoryMovement, ActivityItem } from '../types';

export type DemoScenarioType = 'quiet_tuesday' | 'busy_friday' | 'ladies_night' | 'concert_night' | 'month_end_audit';

export interface DemoScenarioConfig {
  id: DemoScenarioType;
  label: string;
  badge: string;
  description: string;
  activeEvent: string;
  salesMultiplier: number;
  pourMultiplier: number;
}

export const DEMO_SCENARIOS: Record<DemoScenarioType, DemoScenarioConfig> = {
  quiet_tuesday: {
    id: 'quiet_tuesday',
    label: 'Quiet Tuesday Night',
    badge: '🌙 Relaxed Vibe',
    description: 'Low foot traffic, industry lounge workers night, high storeroom reserves.',
    activeEvent: 'Industry Workers Night',
    salesMultiplier: 0.35,
    pourMultiplier: 0.25,
  },
  busy_friday: {
    id: 'busy_friday',
    label: 'Busy Friday Night',
    badge: '🔥 Peak Capacity',
    description: 'Maximum venue capacity across all 4 bars, rapid 2-second checkout, heavy shot pouring.',
    activeEvent: 'Friday Night Sessions',
    salesMultiplier: 2.80,
    pourMultiplier: 3.40,
  },
  ladies_night: {
    id: 'ladies_night',
    label: 'Wednesday Ladies Night',
    badge: '💎 Divas & Diamonds',
    description: 'Spike in Moët, JC Le Roux, Cîroc Red Berry, Pink Gin & Cocktail sales (+300%).',
    activeEvent: 'Divas & Diamonds Ladies Night',
    salesMultiplier: 1.85,
    pourMultiplier: 2.10,
  },
  concert_night: {
    id: 'concert_night',
    label: 'Live DJ Headline Concert',
    badge: '🏟️ Stadium Rush',
    description: 'Massive Windhoek Draught, Tafel Lager, Heineken, Savanna Dry & Red Bull volume.',
    activeEvent: 'AfroTech Stadium DJ Headline',
    salesMultiplier: 3.60,
    pourMultiplier: 4.20,
  },
  month_end_audit: {
    id: 'month_end_audit',
    label: 'Month-End Stocktake Audit',
    badge: '📋 Audit Compliance',
    description: 'Storeroom stocktake audit mode active with automated variance PO reorder drafts.',
    activeEvent: 'Full Venue Stock Audit',
    salesMultiplier: 1.00,
    pourMultiplier: 1.00,
  },
};

// Helper for generating deterministic barcodes
const bc = (id: number) => `600100${(100000 + id * 37).toString().slice(0, 6)}0`;

// Map category to folder and fallback webp
const getImg = (cat: string, slug: string) => {
  const folderMap: Record<string, string> = {
    'Vodka': 'vodka',
    'Whisky': 'whiskey',
    'Brandy': 'brandy',
    'Gin': 'gin',
    'Rum': 'rum',
    'Tequila': 'tequila',
    'Champagne & Sparkling': 'champagne',
    'Wine': 'champagne', // use wine/champagne
    'Beer': 'beer',
    'Cider': 'cider',
    'Cooldrinks': 'cooldrink',
    'Water': 'water',
    'Juice': 'juice',
    'Energy Drinks': 'energy-drink',
    'Spirits': 'vodka',
    'Mixers & Others': 'cooldrink',
    'Non-Alcoholic': 'water',
  };
  const folder = folderMap[cat] || 'vodka';
  return `/products/${folder}/${slug}.webp`;
};

// Generate the master 260+ authentic nightclub SKUs
export function getEnterpriseCatalog(scenario: DemoScenarioType = 'busy_friday'): Bottle[] {
  const mult = DEMO_SCENARIOS[scenario].salesMultiplier;
  const pour = DEMO_SCENARIOS[scenario].pourMultiplier;

  const baseCatalog: Omit<Bottle, 'id' | 'status' | 'image'>[] = [
    // ─── VODKA (15) ───
    { name: "Cîroc Original", sku: "VOD-CIR-001", category: "Spirits", cost: 325, price: 590, quantity: Math.round(42 / mult), reorderLevel: 12, maxStock: 60, location: "Main Bar", supplierId: 1, notes: "NamBev Import", tags: ["VIP", "Vodka", "Fast Seller"] },
    { name: "Cîroc Red Berry", sku: "VOD-CIR-002", category: "Spirits", cost: 340, price: 620, quantity: scenario === 'ladies_night' ? 8 : Math.round(35 / mult), reorderLevel: 10, maxStock: 50, location: "VIP Fridge", supplierId: 1, tags: ["VIP", "Ladies Night"] },
    { name: "Cîroc Apple", sku: "VOD-CIR-003", category: "Spirits", cost: 340, price: 620, quantity: Math.round(28 / mult), reorderLevel: 8, maxStock: 40, location: "VIP Fridge", supplierId: 1, tags: ["VIP"] },
    { name: "Cîroc Coconut", sku: "VOD-CIR-004", category: "Spirits", cost: 340, price: 620, quantity: Math.round(24 / mult), reorderLevel: 8, maxStock: 40, location: "VIP Fridge", supplierId: 1, tags: ["VIP"] },
    { name: "Cîroc Pineapple", sku: "VOD-CIR-005", category: "Spirits", cost: 340, price: 620, quantity: Math.round(30 / mult), reorderLevel: 8, maxStock: 40, location: "VIP Fridge", supplierId: 1, tags: ["VIP"] },
    { name: "Grey Goose", sku: "VOD-GGO-001", category: "Spirits", cost: 380, price: 720, quantity: Math.round(22 / mult), reorderLevel: 8, maxStock: 36, location: "VIP Fridge", supplierId: 1, tags: ["Ultra Premium"] },
    { name: "Belvedere", sku: "VOD-BEL-001", category: "Spirits", cost: 360, price: 680, quantity: Math.round(18 / mult), reorderLevel: 6, maxStock: 30, location: "VIP Fridge", supplierId: 1, tags: ["Ultra Premium"] },
    { name: "Absolut Blue", sku: "VOD-ABS-001", category: "Spirits", cost: 190, price: 380, quantity: Math.round(55 / mult), reorderLevel: 18, maxStock: 90, location: "Main Bar", supplierId: 3, tags: ["Fast Seller"] },
    { name: "Absolut Lime", sku: "VOD-ABS-002", category: "Spirits", cost: 210, price: 400, quantity: Math.round(32 / mult), reorderLevel: 12, maxStock: 60, location: "Main Bar", supplierId: 3, tags: ["Cocktails"] },
    { name: "Absolut Raspberry", sku: "VOD-ABS-003", category: "Spirits", cost: 210, price: 400, quantity: Math.round(36 / mult), reorderLevel: 12, maxStock: 60, location: "Main Bar", supplierId: 3, tags: ["Cocktails"] },
    { name: "Smirnoff Red", sku: "VOD-SMI-001", category: "Spirits", cost: 130, price: 280, quantity: Math.round(80 / mult), reorderLevel: 24, maxStock: 150, location: "Storeroom", supplierId: 2, tags: ["House Rail", "Fast Seller"] },
    { name: "Smirnoff Black", sku: "VOD-SMI-002", category: "Spirits", cost: 170, price: 340, quantity: Math.round(40 / mult), reorderLevel: 12, maxStock: 80, location: "Main Bar", supplierId: 2, tags: ["Premium"] },
    { name: "Skyy Vodka", sku: "VOD-SKY-001", category: "Spirits", cost: 160, price: 320, quantity: Math.round(45 / mult), reorderLevel: 15, maxStock: 80, location: "Main Bar", supplierId: 3, tags: ["Rail"] },
    { name: "Russian Bear", sku: "VOD-RUS-001", category: "Spirits", cost: 110, price: 240, quantity: Math.round(65 / mult), reorderLevel: 20, maxStock: 120, location: "Main Bar", supplierId: 4, tags: ["Shooters"] },
    { name: "Stolichnaya", sku: "VOD-STO-001", category: "Spirits", cost: 180, price: 360, quantity: Math.round(30 / mult), reorderLevel: 10, maxStock: 60, location: "Main Bar", supplierId: 1, tags: ["Classic"] },

    // ─── WHISKY (17) ───
    { name: "Johnnie Walker Red", sku: "WHI-JWR-001", category: "Spirits", cost: 180, price: 380, quantity: Math.round(60 / mult), reorderLevel: 18, maxStock: 100, location: "Storeroom", supplierId: 2, tags: ["Whisky", "Fast Seller"] },
    { name: "Johnnie Walker Black", sku: "WHI-JWB-001", category: "Spirits", cost: 380, price: 750, quantity: Math.round(48 / mult), reorderLevel: 14, maxStock: 80, location: "Main Bar", supplierId: 2, tags: ["Whisky", "VIP", "Fast Seller"] },
    { name: "Johnnie Walker Double Black", sku: "WHI-JWD-001", category: "Spirits", cost: 480, price: 920, quantity: Math.round(25 / mult), reorderLevel: 8, maxStock: 40, location: "VIP Fridge", supplierId: 2, tags: ["VIP"] },
    { name: "Johnnie Walker Gold", sku: "WHI-JWG-001", category: "Spirits", cost: 720, price: 1450, quantity: Math.round(14 / mult), reorderLevel: 4, maxStock: 25, location: "VIP Fridge", supplierId: 2, tags: ["Ultra Premium"] },
    { name: "Johnnie Walker Blue", sku: "WHI-JWBL-001", category: "Spirits", cost: 2600, price: 5200, quantity: Math.round(6 / mult), reorderLevel: 2, maxStock: 12, location: "VIP Fridge", supplierId: 2, tags: ["Prestige", "VIP"] },
    { name: "Jack Daniel's Old No. 7", sku: "WHI-JD-001", category: "Spirits", cost: 260, price: 520, quantity: Math.round(70 / mult), reorderLevel: 20, maxStock: 120, location: "Main Bar", supplierId: 3, tags: ["Whisky", "Fast Seller"] },
    { name: "Jack Daniel's Honey", sku: "WHI-JDH-001", category: "Spirits", cost: 280, price: 550, quantity: Math.round(40 / mult), reorderLevel: 12, maxStock: 70, location: "Main Bar", supplierId: 3, tags: ["Shooters"] },
    { name: "Jack Daniel's Fire", sku: "WHI-JDF-001", category: "Spirits", cost: 280, price: 550, quantity: Math.round(38 / mult), reorderLevel: 12, maxStock: 70, location: "Main Bar", supplierId: 3, tags: ["Shooters"] },
    { name: "Jameson", sku: "WHI-JAM-001", category: "Spirits", cost: 220, price: 450, quantity: Math.round(95 / mult), reorderLevel: 30, maxStock: 180, location: "Main Bar", supplierId: 3, tags: ["Irish", "Top Seller"] },
    { name: "Chivas Regal 12", sku: "WHI-CHI-012", category: "Spirits", cost: 360, price: 720, quantity: Math.round(35 / mult), reorderLevel: 10, maxStock: 60, location: "Main Bar", supplierId: 3, tags: ["Scotch"] },
    { name: "Chivas Regal 18", sku: "WHI-CHI-018", category: "Spirits", cost: 850, price: 1700, quantity: Math.round(12 / mult), reorderLevel: 4, maxStock: 24, location: "VIP Fridge", supplierId: 3, tags: ["VIP"] },
    { name: "Ballantine's", sku: "WHI-BAL-001", category: "Spirits", cost: 170, price: 340, quantity: Math.round(50 / mult), reorderLevel: 15, maxStock: 90, location: "Main Bar", supplierId: 3, tags: ["Rail"] },
    { name: "Bell's", sku: "WHI-BEL-001", category: "Spirits", cost: 150, price: 300, quantity: Math.round(65 / mult), reorderLevel: 20, maxStock: 120, location: "Storeroom", supplierId: 2, tags: ["Rail"] },
    { name: "J&B", sku: "WHI-JB-001", category: "Spirits", cost: 160, price: 320, quantity: Math.round(55 / mult), reorderLevel: 18, maxStock: 100, location: "Main Bar", supplierId: 2, tags: ["Classic"] },
    { name: "Glenfiddich 12", sku: "WHI-GF-012", category: "Spirits", cost: 520, price: 980, quantity: Math.round(20 / mult), reorderLevel: 6, maxStock: 36, location: "VIP Fridge", supplierId: 4, tags: ["Single Malt"] },
    { name: "Glenlivet 12", sku: "WHI-GL-012", category: "Spirits", cost: 540, price: 1020, quantity: Math.round(18 / mult), reorderLevel: 6, maxStock: 36, location: "VIP Fridge", supplierId: 3, tags: ["Single Malt"] },
    { name: "Monkey Shoulder", sku: "WHI-MON-001", category: "Spirits", cost: 420, price: 820, quantity: Math.round(28 / mult), reorderLevel: 8, maxStock: 50, location: "Main Bar", supplierId: 4, tags: ["Craft Whisky"] },

    // ─── BRANDY (9) ───
    { name: "Klipdrift Premium", sku: "BRA-KLI-001", category: "Spirits", cost: 160, price: 320, quantity: Math.round(85 / mult), reorderLevel: 24, maxStock: 150, location: "Main Bar", supplierId: 4, tags: ["Brandy", "Namibia Favorite"] },
    { name: "Klipdrift Export", sku: "BRA-KLI-002", category: "Spirits", cost: 140, price: 280, quantity: Math.round(90 / mult), reorderLevel: 30, maxStock: 180, location: "Storeroom", supplierId: 4, tags: ["Rail"] },
    { name: "KWV 10", sku: "BRA-KWV-010", category: "Spirits", cost: 240, price: 480, quantity: Math.round(40 / mult), reorderLevel: 12, maxStock: 80, location: "Main Bar", supplierId: 4, tags: ["Aged Brandy"] },
    { name: "KWV 15", sku: "BRA-KWV-015", category: "Spirits", cost: 480, price: 950, quantity: Math.round(16 / mult), reorderLevel: 6, maxStock: 30, location: "VIP Fridge", supplierId: 4, tags: ["VIP Brandy"] },
    { name: "Hennessy VS", sku: "BRA-HEN-001", category: "Spirits", cost: 450, price: 890, quantity: Math.round(65 / mult), reorderLevel: 20, maxStock: 120, location: "Main Bar", supplierId: 2, tags: ["Cognac", "Top Seller"] },
    { name: "Hennessy VSOP", sku: "BRA-HEN-002", category: "Spirits", cost: 890, price: 1800, quantity: Math.round(24 / mult), reorderLevel: 8, maxStock: 48, location: "VIP Fridge", supplierId: 2, tags: ["Cognac", "VIP"] },
    { name: "Rémy Martin VSOP", sku: "BRA-REM-001", category: "Spirits", cost: 920, price: 1850, quantity: Math.round(18 / mult), reorderLevel: 6, maxStock: 36, location: "VIP Fridge", supplierId: 1, tags: ["Cognac", "VIP"] },
    { name: "Richelieu", sku: "BRA-RIC-001", category: "Spirits", cost: 135, price: 270, quantity: Math.round(75 / mult), reorderLevel: 24, maxStock: 140, location: "Main Bar", supplierId: 4, tags: ["Classic"] },
    { name: "Amarula Cream", sku: "BRA-AMA-001", category: "Spirits", cost: 150, price: 300, quantity: Math.round(45 / mult), reorderLevel: 15, maxStock: 80, location: "Main Fridge", supplierId: 4, tags: ["Cream Liqueur"] },

    // ─── GIN (7) ───
    { name: "Gordon's Dry Gin", sku: "GIN-GOR-001", category: "Spirits", cost: 140, price: 290, quantity: Math.round(70 / mult), reorderLevel: 20, maxStock: 120, location: "Main Bar", supplierId: 2, tags: ["House Gin"] },
    { name: "Gordon's Pink", sku: "GIN-GOR-002", category: "Spirits", cost: 155, price: 320, quantity: scenario === 'ladies_night' ? 6 : Math.round(65 / mult), reorderLevel: 18, maxStock: 110, location: "Main Bar", supplierId: 2, tags: ["Pink Gin", "Ladies Night"] },
    { name: "Bombay Sapphire", sku: "GIN-BOM-001", category: "Spirits", cost: 260, price: 520, quantity: Math.round(38 / mult), reorderLevel: 12, maxStock: 70, location: "Main Bar", supplierId: 3, tags: ["Premium Gin"] },
    { name: "Tanqueray", sku: "GIN-TAN-001", category: "Spirits", cost: 250, price: 500, quantity: Math.round(45 / mult), reorderLevel: 14, maxStock: 80, location: "Main Bar", supplierId: 2, tags: ["London Dry"] },
    { name: "Beefeater", sku: "GIN-BEE-001", category: "Spirits", cost: 190, price: 380, quantity: Math.round(40 / mult), reorderLevel: 12, maxStock: 70, location: "Main Bar", supplierId: 3, tags: ["Gin"] },
    { name: "Hendrick's", sku: "GIN-HEN-001", category: "Spirits", cost: 420, price: 820, quantity: Math.round(24 / mult), reorderLevel: 8, maxStock: 45, location: "VIP Fridge", supplierId: 4, tags: ["Craft Gin"] },
    { name: "Inverroche Classic", sku: "GIN-INV-001", category: "Spirits", cost: 380, price: 750, quantity: Math.round(28 / mult), reorderLevel: 8, maxStock: 50, location: "Main Bar", supplierId: 4, tags: ["Fynbos Gin"] },

    // ─── RUM (7) ───
    { name: "Captain Morgan", sku: "RUM-CAP-001", category: "Spirits", cost: 160, price: 320, quantity: Math.round(80 / mult), reorderLevel: 24, maxStock: 140, location: "Main Bar", supplierId: 2, tags: ["Dark Rum"] },
    { name: "Captain Morgan Spiced Gold", sku: "RUM-CAP-002", category: "Spirits", cost: 170, price: 340, quantity: Math.round(110 / mult), reorderLevel: 30, maxStock: 200, location: "Main Bar", supplierId: 2, tags: ["Spiced Rum", "Top Seller"] },
    { name: "Bacardi Carta Blanca", sku: "RUM-BAC-001", category: "Spirits", cost: 180, price: 360, quantity: Math.round(60 / mult), reorderLevel: 18, maxStock: 100, location: "Main Bar", supplierId: 3, tags: ["White Rum", "Mojitos"] },
    { name: "Bacardi Gold", sku: "RUM-BAC-002", category: "Spirits", cost: 190, price: 380, quantity: Math.round(45 / mult), reorderLevel: 14, maxStock: 80, location: "Main Bar", supplierId: 3, tags: ["Gold Rum"] },
    { name: "Malibu", sku: "RUM-MAL-001", category: "Spirits", cost: 150, price: 300, quantity: Math.round(50 / mult), reorderLevel: 15, maxStock: 90, location: "Main Bar", supplierId: 3, tags: ["Coconut Rum"] },
    { name: "Havana Club 3", sku: "RUM-HAV-003", category: "Spirits", cost: 210, price: 420, quantity: Math.round(32 / mult), reorderLevel: 10, maxStock: 60, location: "Main Bar", supplierId: 3, tags: ["Cuban Rum"] },
    { name: "Havana Club 7", sku: "RUM-HAV-007", category: "Spirits", cost: 360, price: 720, quantity: Math.round(20 / mult), reorderLevel: 6, maxStock: 40, location: "VIP Fridge", supplierId: 3, tags: ["Aged Rum"] },

    // ─── TEQUILA (6) ───
    { name: "José Cuervo Gold", sku: "TEQ-JCG-001", category: "Spirits", cost: 220, price: 450, quantity: Math.round(85 / mult), reorderLevel: 24, maxStock: 150, location: "Main Bar", supplierId: 1, tags: ["Shooters", "Top Seller"] },
    { name: "José Cuervo Silver", sku: "TEQ-JCS-001", category: "Spirits", cost: 220, price: 450, quantity: Math.round(75 / mult), reorderLevel: 20, maxStock: 140, location: "Main Bar", supplierId: 1, tags: ["Shooters"] },
    { name: "Olmeca Gold", sku: "TEQ-OLG-001", category: "Spirits", cost: 210, price: 420, quantity: Math.round(90 / mult), reorderLevel: 25, maxStock: 160, location: "Main Bar", supplierId: 3, tags: ["Shooters"] },
    { name: "Olmeca Silver", sku: "TEQ-OLS-001", category: "Spirits", cost: 210, price: 420, quantity: Math.round(80 / mult), reorderLevel: 24, maxStock: 150, location: "Main Bar", supplierId: 3, tags: ["Shooters"] },
    { name: "Patrón Silver", sku: "TEQ-PAS-001", category: "Spirits", cost: 680, price: 1350, quantity: Math.round(26 / mult), reorderLevel: 8, maxStock: 50, location: "VIP Fridge", supplierId: 3, tags: ["Ultra Premium"] },
    { name: "Patrón Reposado", sku: "TEQ-PAR-001", category: "Spirits", cost: 740, price: 1480, quantity: Math.round(20 / mult), reorderLevel: 6, maxStock: 40, location: "VIP Fridge", supplierId: 3, tags: ["Prestige Tequila"] },

    // ─── CHAMPAGNE & SPARKLING (5) ───
    { name: "Moët & Chandon", sku: "CHA-MOE-001", category: "Wine & Champagne", cost: 650, price: 1450, quantity: scenario === 'ladies_night' ? 4 : Math.round(35 / mult), reorderLevel: 10, maxStock: 60, location: "Cold Room", supplierId: 1, tags: ["Champagne", "VIP", "Ladies Night"] },
    { name: "Veuve Clicquot", sku: "CHA-VEU-001", category: "Wine & Champagne", cost: 720, price: 1600, quantity: Math.round(28 / mult), reorderLevel: 8, maxStock: 50, location: "Cold Room", supplierId: 1, tags: ["Champagne", "VIP"] },
    { name: "Dom Pérignon", sku: "CHA-DOM-001", category: "Wine & Champagne", cost: 3200, price: 6800, quantity: Math.round(8 / mult), reorderLevel: 3, maxStock: 15, location: "VIP Fridge", supplierId: 1, tags: ["Prestige"] },
    { name: "JC Le Roux Le Domaine", sku: "CHA-JCL-001", category: "Wine & Champagne", cost: 85, price: 220, quantity: scenario === 'ladies_night' ? 12 : Math.round(95 / mult), reorderLevel: 30, maxStock: 180, location: "Cold Room", supplierId: 4, tags: ["Sparkling", "Ladies Night"] },
    { name: "Pongrácz Brut", sku: "CHA-PON-001", category: "Wine & Champagne", cost: 180, price: 390, quantity: Math.round(45 / mult), reorderLevel: 12, maxStock: 80, location: "Cold Room", supplierId: 4, tags: ["Cap Classique"] },

    // ─── WINE (6) ───
    { name: "Durbanville Hills Sauvignon Blanc", sku: "WIN-DUR-001", category: "Wine & Champagne", cost: 95, price: 240, quantity: Math.round(50 / mult), reorderLevel: 15, maxStock: 90, location: "Cold Room", supplierId: 4, tags: ["White Wine"] },
    { name: "Spier Chardonnay", sku: "WIN-SPI-001", category: "Wine & Champagne", cost: 110, price: 260, quantity: Math.round(40 / mult), reorderLevel: 12, maxStock: 70, location: "Cold Room", supplierId: 4, tags: ["White Wine"] },
    { name: "Nederburg Merlot", sku: "WIN-NED-001", category: "Wine & Champagne", cost: 105, price: 250, quantity: Math.round(45 / mult), reorderLevel: 12, maxStock: 80, location: "Storeroom", supplierId: 4, tags: ["Red Wine"] },
    { name: "Kanokop Cabernet Sauvignon", sku: "WIN-KAN-001", category: "Wine & Champagne", cost: 280, price: 580, quantity: Math.round(20 / mult), reorderLevel: 6, maxStock: 40, location: "Storeroom", supplierId: 4, tags: ["Premium Red"] },
    { name: "Beyerskloof Pinotage", sku: "WIN-BEY-001", category: "Wine & Champagne", cost: 120, price: 280, quantity: Math.round(55 / mult), reorderLevel: 16, maxStock: 100, location: "Storeroom", supplierId: 4, tags: ["Red Wine"] },
    { name: "Rust en Vrede Shiraz", sku: "WIN-RUS-001", category: "Wine & Champagne", cost: 340, price: 690, quantity: Math.round(18 / mult), reorderLevel: 6, maxStock: 30, location: "VIP Fridge", supplierId: 4, tags: ["VIP Red"] },

    // ─── BEER (9) ───
    { name: "Windhoek Lager", sku: "BEE-WIN-001", category: "Beer", cost: 18, price: 38, quantity: scenario === 'concert_night' ? 24 : Math.round(180 / mult), reorderLevel: 48, maxStock: 360, location: "Cold Room", supplierId: 5, tags: ["Namibia", "Fast Seller"] },
    { name: "Windhoek Draught (440ml)", sku: "BEE-WIN-002", category: "Beer", cost: 20, price: 42, quantity: scenario === 'concert_night' ? 18 : Math.round(240 / mult), reorderLevel: 60, maxStock: 480, location: "Cold Room", supplierId: 5, tags: ["Namibia", "#1 Volume"] },
    { name: "Windhoek Light", sku: "BEE-WIN-003", category: "Beer", cost: 18, price: 38, quantity: Math.round(90 / mult), reorderLevel: 24, maxStock: 180, location: "Cold Room", supplierId: 5, tags: ["Light Beer"] },
    { name: "Tafel Lager (330ml)", sku: "BEE-TAF-001", category: "Beer", cost: 16, price: 35, quantity: scenario === 'concert_night' ? 30 : Math.round(220 / mult), reorderLevel: 60, maxStock: 450, location: "Cold Room", supplierId: 5, tags: ["Namibia Pride"] },
    { name: "Heineken", sku: "BEE-HEI-001", category: "Beer", cost: 22, price: 45, quantity: Math.round(200 / mult), reorderLevel: 50, maxStock: 400, location: "Cold Room", supplierId: 5, tags: ["International", "Fast Seller"] },
    { name: "Castle Lite", sku: "BEE-CAS-001", category: "Beer", cost: 17, price: 38, quantity: Math.round(160 / mult), reorderLevel: 40, maxStock: 320, location: "Cold Room", supplierId: 5, tags: ["Extra Cold"] },
    { name: "Corona Extra", sku: "BEE-COR-001", category: "Beer", cost: 26, price: 52, quantity: Math.round(110 / mult), reorderLevel: 30, maxStock: 220, location: "Main Fridge", supplierId: 5, tags: ["Imported"] },
    { name: "Stella Artois", sku: "BEE-STE-001", category: "Beer", cost: 24, price: 48, quantity: Math.round(120 / mult), reorderLevel: 30, maxStock: 240, location: "Cold Room", supplierId: 5, tags: ["Draft Chalice"] },
    { name: "Budweiser", sku: "BEE-BUD-001", category: "Beer", cost: 21, price: 42, quantity: Math.round(100 / mult), reorderLevel: 24, maxStock: 200, location: "Cold Room", supplierId: 5, tags: ["King of Beers"] },

    // ─── CIDER (5) ───
    { name: "Hunter's Gold", sku: "CID-HUN-001", category: "Mixers & Others", cost: 18, price: 40, quantity: Math.round(140 / mult), reorderLevel: 36, maxStock: 280, location: "Cold Room", supplierId: 4, tags: ["Cider", "Fast Seller"] },
    { name: "Hunter's Dry", sku: "CID-HUN-002", category: "Mixers & Others", cost: 18, price: 40, quantity: Math.round(130 / mult), reorderLevel: 36, maxStock: 260, location: "Cold Room", supplierId: 4, tags: ["Cider"] },
    { name: "Savanna Dry", sku: "CID-SAV-001", category: "Mixers & Others", cost: 22, price: 46, quantity: scenario === 'concert_night' ? 20 : Math.round(190 / mult), reorderLevel: 48, maxStock: 380, location: "Cold Room", supplierId: 4, tags: ["Cider", "#1 Cider"] },
    { name: "Savanna Light", sku: "CID-SAV-002", category: "Mixers & Others", cost: 22, price: 46, quantity: Math.round(110 / mult), reorderLevel: 30, maxStock: 220, location: "Cold Room", supplierId: 4, tags: ["Cider"] },
    { name: "Strongbow Gold Apple", sku: "CID-STR-001", category: "Mixers & Others", cost: 24, price: 48, quantity: Math.round(80 / mult), reorderLevel: 24, maxStock: 160, location: "Cold Room", supplierId: 5, tags: ["Craft Cider"] },

    // ─── COOLDRINKS & MIXERS (10) ───
    { name: "Coca-Cola (200ml)", sku: "COO-COC-001", category: "Mixers & Others", cost: 9, price: 25, quantity: Math.round(250 / mult), reorderLevel: 72, maxStock: 500, location: "Storeroom", supplierId: 1, tags: ["Mixer", "#1 Rail"] },
    { name: "Coke Zero (200ml)", sku: "COO-COC-002", category: "Mixers & Others", cost: 9, price: 25, quantity: Math.round(140 / mult), reorderLevel: 36, maxStock: 280, location: "Storeroom", supplierId: 1, tags: ["Mixer"] },
    { name: "Sprite (200ml)", sku: "COO-SPR-001", category: "Mixers & Others", cost: 9, price: 25, quantity: Math.round(180 / mult), reorderLevel: 48, maxStock: 360, location: "Storeroom", supplierId: 1, tags: ["Mixer"] },
    { name: "Sprite Zero (200ml)", sku: "COO-SPR-002", category: "Mixers & Others", cost: 9, price: 25, quantity: Math.round(80 / mult), reorderLevel: 24, maxStock: 160, location: "Storeroom", supplierId: 1, tags: ["Mixer"] },
    { name: "Fanta Orange (200ml)", sku: "COO-FAN-001", category: "Mixers & Others", cost: 9, price: 25, quantity: Math.round(120 / mult), reorderLevel: 30, maxStock: 240, location: "Storeroom", supplierId: 1, tags: ["Mixer"] },
    { name: "Fanta Grape (200ml)", sku: "COO-FAN-002", category: "Mixers & Others", cost: 9, price: 25, quantity: Math.round(90 / mult), reorderLevel: 24, maxStock: 180, location: "Storeroom", supplierId: 1, tags: ["Mixer"] },
    { name: "Schweppes Lemon (200ml)", sku: "COO-SCH-001", category: "Mixers & Others", cost: 10, price: 28, quantity: Math.round(200 / mult), reorderLevel: 48, maxStock: 400, location: "Storeroom", supplierId: 1, tags: ["Gin Mixer"] },
    { name: "Schweppes Tonic (200ml)", sku: "COO-SCH-002", category: "Mixers & Others", cost: 10, price: 28, quantity: Math.round(280 / mult), reorderLevel: 72, maxStock: 560, location: "Storeroom", supplierId: 1, tags: ["Gin Mixer", "High Vol"] },
    { name: "Schweppes Soda (200ml)", sku: "COO-SCH-003", category: "Mixers & Others", cost: 10, price: 28, quantity: Math.round(220 / mult), reorderLevel: 60, maxStock: 440, location: "Storeroom", supplierId: 1, tags: ["Whisky Mixer"] },
    { name: "Stoney Ginger Ale (200ml)", sku: "COO-STO-001", category: "Mixers & Others", cost: 10, price: 28, quantity: Math.round(160 / mult), reorderLevel: 40, maxStock: 320, location: "Storeroom", supplierId: 1, tags: ["Mixer"] },

    // ─── WATER (6) ───
    { name: "Aqua Splash Still (500ml)", sku: "WAT-AQU-001", category: "Non-Alcoholic", cost: 6, price: 20, quantity: Math.round(300 / mult), reorderLevel: 72, maxStock: 600, location: "Storeroom", supplierId: 1, tags: ["Water", "High Profit"] },
    { name: "Aqua Splash Sparkling (500ml)", sku: "WAT-AQU-002", category: "Non-Alcoholic", cost: 7, price: 22, quantity: Math.round(180 / mult), reorderLevel: 48, maxStock: 360, location: "Storeroom", supplierId: 1, tags: ["Water"] },
    { name: "Valpré Still (500ml)", sku: "WAT-VAL-001", category: "Non-Alcoholic", cost: 9, price: 30, quantity: Math.round(120 / mult), reorderLevel: 30, maxStock: 240, location: "Main Fridge", supplierId: 1, tags: ["Premium Water"] },
    { name: "Valpré Sparkling (500ml)", sku: "WAT-VAL-002", category: "Non-Alcoholic", cost: 9, price: 30, quantity: Math.round(100 / mult), reorderLevel: 24, maxStock: 200, location: "Main Fridge", supplierId: 1, tags: ["Premium Water"] },
    { name: "Evian Natural Mineral (500ml)", sku: "WAT-EVI-001", category: "Non-Alcoholic", cost: 24, price: 65, quantity: Math.round(36 / mult), reorderLevel: 12, maxStock: 72, location: "VIP Fridge", supplierId: 1, tags: ["VIP Water"] },
    { name: "San Pellegrino Sparkling (500ml)", sku: "WAT-SAN-001", category: "Non-Alcoholic", cost: 26, price: 70, quantity: Math.round(30 / mult), reorderLevel: 10, maxStock: 60, location: "VIP Fridge", supplierId: 1, tags: ["VIP Water"] },

    // ─── JUICES (7) ───
    { name: "Ceres Orange Juice (1L)", sku: "JUI-CER-001", category: "Non-Alcoholic", cost: 22, price: 60, quantity: Math.round(45 / mult), reorderLevel: 12, maxStock: 90, location: "Main Fridge", supplierId: 1, tags: ["Cocktails", "Perishable"] },
    { name: "Ceres Apple Juice (1L)", sku: "JUI-CER-002", category: "Non-Alcoholic", cost: 22, price: 60, quantity: Math.round(40 / mult), reorderLevel: 10, maxStock: 80, location: "Main Fridge", supplierId: 1, tags: ["Cocktails"] },
    { name: "Ceres Mango Juice (1L)", sku: "JUI-CER-003", category: "Non-Alcoholic", cost: 24, price: 65, quantity: Math.round(35 / mult), reorderLevel: 10, maxStock: 70, location: "Main Fridge", supplierId: 1, tags: ["Cocktails"] },
    { name: "Ceres Secret Valley Mixed (1L)", sku: "JUI-CER-004", category: "Non-Alcoholic", cost: 24, price: 65, quantity: Math.round(30 / mult), reorderLevel: 8, maxStock: 60, location: "Main Fridge", supplierId: 1, tags: ["Cocktails"] },
    { name: "Liqui Fruit Cranberry (1L)", sku: "JUI-LIQ-001", category: "Non-Alcoholic", cost: 28, price: 75, quantity: Math.round(60 / mult), reorderLevel: 18, maxStock: 120, location: "Main Fridge", supplierId: 1, tags: ["Cosmopolitans", "High Pour"] },
    { name: "Liqui Fruit Orange (1L)", sku: "JUI-LIQ-002", category: "Non-Alcoholic", cost: 25, price: 68, quantity: Math.round(50 / mult), reorderLevel: 12, maxStock: 100, location: "Main Fridge", supplierId: 1, tags: ["Juice"] },
    { name: "Liqui Fruit Mango (1L)", sku: "JUI-LIQ-003", category: "Non-Alcoholic", cost: 25, price: 68, quantity: Math.round(45 / mult), reorderLevel: 12, maxStock: 90, location: "Main Fridge", supplierId: 1, tags: ["Juice"] },

    // ─── ENERGY DRINKS (5) ───
    { name: "Red Bull Energy Drink (250ml)", sku: "ENE-RED-001", category: "Mixers & Others", cost: 22, price: 55, quantity: scenario === 'concert_night' ? 12 : Math.round(350 / mult), reorderLevel: 96, maxStock: 720, location: "Storeroom", supplierId: 5, tags: ["Vodka RedBull", "#1 Profit"] },
    { name: "Red Bull Sugar Free (250ml)", sku: "ENE-RED-002", category: "Mixers & Others", cost: 22, price: 55, quantity: Math.round(160 / mult), reorderLevel: 48, maxStock: 320, location: "Storeroom", supplierId: 5, tags: ["Energy"] },
    { name: "Monster Energy Original (500ml)", sku: "ENE-MON-001", category: "Mixers & Others", cost: 24, price: 58, quantity: Math.round(140 / mult), reorderLevel: 36, maxStock: 280, location: "Storeroom", supplierId: 1, tags: ["Energy Can"] },
    { name: "Monster Mango Loco (500ml)", sku: "ENE-MON-002", category: "Mixers & Others", cost: 26, price: 62, quantity: Math.round(110 / mult), reorderLevel: 30, maxStock: 220, location: "Storeroom", supplierId: 1, tags: ["Flavored Energy"] },
    { name: "Dragon Energy Red (500ml)", sku: "ENE-DRA-001", category: "Mixers & Others", cost: 12, price: 30, quantity: Math.round(220 / mult), reorderLevel: 60, maxStock: 440, location: "Storeroom", supplierId: 1, tags: ["Budget Energy"] },
  ];

  // Generate another ~140 secondary nightlife SKUs (shooters, craft spirits, VIP combos)
  const generatedSecondary: Omit<Bottle, 'id' | 'status' | 'image'>[] = [];
  const shooters = ['Jagermeister', 'Tequila Rose', 'Sambuca Black', 'Sambuca White', 'Lovoka Caramel', 'Cactus Jack Green', 'Tang Sour Apple', 'Strawberry Lips', 'Poncho 1910 Cafe', 'Aftershock Red'];
  shooters.forEach((sh, idx) => {
    generatedSecondary.push({
      name: `${sh} (750ml)`, sku: `SHT-${sh.slice(0,3).toUpperCase()}-0${idx}`, category: "Spirits",
      cost: 160 + idx * 10, price: 350 + idx * 25, quantity: Math.round((50 + idx * 5) / mult),
      reorderLevel: 12, maxStock: 100, location: "Main Bar", supplierId: 3, tags: ["Shooter", "High Velocity"]
    });
  });

  for (let i = 1; i <= 130; i++) {
    const barLoc = i % 4 === 0 ? 'VIP Fridge' : i % 3 === 0 ? 'Storeroom' : i % 2 === 0 ? 'Cold Room' : 'Main Bar';
    const cat = i % 5 === 0 ? 'Spirits' : i % 4 === 0 ? 'Beer' : i % 3 === 0 ? 'Wine & Champagne' : 'Mixers & Others';
    generatedSecondary.push({
      name: `Club Reserve ${cat === 'Spirits' ? 'Vodka' : cat === 'Beer' ? 'Craft Lager' : cat === 'Wine & Champagne' ? 'Sparkling Brut' : 'Tonic Syrup'} #${i}`,
      sku: `RES-${cat.slice(0,3).toUpperCase()}-${100 + i}`,
      category: cat as any,
      cost: 40 + (i % 20) * 15,
      price: 90 + (i % 20) * 40,
      quantity: Math.max(0, Math.round((40 + (i % 30) * 4) / mult) - (i % 7 === 0 ? 35 : 0)),
      reorderLevel: 15,
      maxStock: 120,
      location: barLoc,
      supplierId: (i % 5) + 1,
      tags: [cat === 'Spirits' ? 'Rail' : 'Volume']
    });
  }

  const combined = [...baseCatalog, ...generatedSecondary];

  return combined.map((item, idx) => {
    const id = idx + 1;
    const slug = item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const quantity = item.quantity;
    const reorder = item.reorderLevel;

    let status: Bottle['status'] = 'Normal';
    if (quantity <= 0) status = 'Out of Stock';
    else if (quantity <= Math.round(reorder * 0.5)) status = 'Critical';
    else if (quantity <= reorder) status = 'Low';
    else if (quantity >= item.maxStock) status = 'Overstocked';

    return {
      ...item,
      id,
      barcode: bc(id),
      openBottles: item.category === 'Spirits' ? (id % 3 === 0 ? 2 : 1) : 0,
      status,
      image: getImg(item.category, slug),
      notes: item.notes || `Daily Velocity: ${(pour * (1 + (id % 5) * 0.8)).toFixed(1)} pours/day.`,
      lastMovementAt: new Date(Date.now() - (id * 1400000)).toISOString(),
    };
  });
}

// Generate matching scenario transaction ledger
export function generateScenarioLedger(bottles: Bottle[], scenario: DemoScenarioType = 'busy_friday') {
  const pour = DEMO_SCENARIOS[scenario].pourMultiplier;
  const count = scenario === 'quiet_tuesday' ? 45 : scenario === 'busy_friday' ? 320 : 180;

  const movements: InventoryMovement[] = [];
  const sales: Sale[] = [];
  const activities: ActivityItem[] = [];

  for (let i = 0; i < count; i++) {
    const b = bottles[i % bottles.length];
    const isSale = i % 5 !== 0;
    const time = new Date(Date.now() - i * 180000).toISOString();
    const qty = Math.max(1, Math.round((i % 4 + 1) * pour));

    if (isSale) {
      movements.push({
        id: 10000 + i, timestamp: time, type: 'sold', bottleId: b.id, bottleName: b.name,
        sku: b.sku, qty, user: i % 2 === 0 ? 'Bartender Sarah' : 'Pedro Manager'
      });
      sales.push({
        id: 20000 + i, date: time, bottleId: b.id, bottleName: b.name, sku: b.sku,
        qty, total: qty * b.price, paymentMethod: i % 3 === 0 ? 'cash' : 'card'
      });
    } else {
      movements.push({
        id: 10000 + i, timestamp: time, type: 'received', bottleId: b.id, bottleName: b.name,
        sku: b.sku, qty: qty * 12, user: 'NamBev Delivery Dispatch'
      });
    }

    if (i < 25) {
      activities.push({
        id: 30000 + i, time, type: isSale ? 'sale' : 'purchase',
        title: `${isSale ? 'Sold' : 'Received PO'} ${qty} × ${b.name}`,
        subtitle: `${b.location} • N$ ${(qty * (isSale ? b.price : b.cost)).toLocaleString()}`,
        user: isSale ? 'Main Bar POS' : 'Warehouse Receiving'
      });
    }
  }

  return { movements, sales, activities };
}
