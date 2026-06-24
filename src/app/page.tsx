import { prisma } from "@/lib/prisma";
import FridgeDisplay, { ProductData } from "@/components/hero/FridgeDisplay";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  // Fetch products with their inventory count
  const dbProducts = await prisma.product.findMany({
    include: {
      Inventory: true,
    },
    take: 20, // Limit to what fits in the fridge nicely
  });

  // Map to the required structure for the Fridge Display
  // including some simulated mock fields (used30Days, supplier) that aren't in this basic schema yet
  const products: ProductData[] = dbProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    costPrice: p.costPrice,
    sellingPrice: p.sellingPrice,
    minimumStock: p.minimumStock,
    bottleSizeMl: p.bottleSizeMl,
    Inventory: p.Inventory ? {
      fullBottles: p.Inventory.fullBottles,
      openBottleMl: p.Inventory.openBottleMl,
    } : null,
    used30Days: Math.floor(Math.random() * 20), // Placeholder for demo realism
    supplier: "Benchmark Beverages",
  }));

  // If there are no products, provide dummy data to show the beautiful UI empty state
  if (products.length === 0) {
    const dummyProducts: ProductData[] = [
      { id: "1", name: "Tito's Handmade Vodka", category: "Vodka", costPrice: 19.5, sellingPrice: 32, minimumStock: 10, bottleSizeMl: 750, Inventory: { fullBottles: 18, openBottleMl: 0 }, used30Days: 7, supplier: "Benchmark Beverages" },
      { id: "2", name: "Ciroc Vodka", category: "Vodka", costPrice: 25.0, sellingPrice: 45, minimumStock: 5, bottleSizeMl: 750, Inventory: { fullBottles: 12, openBottleMl: 0 }, used30Days: 4, supplier: "Diageo" },
      { id: "3", name: "Gordons Gin", category: "Gin", costPrice: 15.0, sellingPrice: 25, minimumStock: 12, bottleSizeMl: 750, Inventory: { fullBottles: 5, openBottleMl: 0 }, used30Days: 14, supplier: "Diageo" },
      { id: "4", name: "Moet & Chandon", category: "Champagne", costPrice: 45.0, sellingPrice: 120, minimumStock: 6, bottleSizeMl: 750, Inventory: { fullBottles: 2, openBottleMl: 0 }, used30Days: 8, supplier: "LVMH" },
      { id: "5", name: "Hendricks Gin", category: "Gin", costPrice: 28.0, sellingPrice: 50, minimumStock: 8, bottleSizeMl: 750, Inventory: { fullBottles: 14, openBottleMl: 0 }, used30Days: 6, supplier: "William Grant" },
      { id: "6", name: "Don Julio Tequila", category: "Tequila", costPrice: 35.0, sellingPrice: 65, minimumStock: 5, bottleSizeMl: 750, Inventory: { fullBottles: 9, openBottleMl: 0 }, used30Days: 12, supplier: "Diageo" },
      { id: "7", name: "Jameson Whiskey", category: "Whiskey", costPrice: 22.0, sellingPrice: 38, minimumStock: 15, bottleSizeMl: 750, Inventory: { fullBottles: 24, openBottleMl: 0 }, used30Days: 18, supplier: "Pernod Ricard" },
    ];
    products.push(...dummyProducts);
  }

  return (
    <main className="w-full bg-[#0a0a0c] min-h-screen">
      <FridgeDisplay products={products} />
    </main>
  );
}
