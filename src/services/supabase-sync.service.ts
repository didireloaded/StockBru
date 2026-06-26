import { supabase } from '../lib/supabase';
import { Bottle, Supplier, ActivityItem, Sale, PurchaseOrder, Stocktake, Shift, InventorySnapshot, InventoryMovement, InventoryTransfer } from '../types';
import { BOTTLES_SEED, SUPPLIERS_SEED, ACTIVITIES_SEED, MOVEMENTS_SEED } from '../data/seed';
import { saveToStorage, STORAGE_KEYS } from '../lib/persistence';

export interface CloudStateSetters {
  setBottles: React.Dispatch<React.SetStateAction<Bottle[]>>;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  setActivities: React.Dispatch<React.SetStateAction<ActivityItem[]>>;
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  setPOs: React.Dispatch<React.SetStateAction<PurchaseOrder[]>>;
  setStocktakes: React.Dispatch<React.SetStateAction<Stocktake[]>>;
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  setSnapshots: React.Dispatch<React.SetStateAction<InventorySnapshot[]>>;
  setMovements: React.Dispatch<React.SetStateAction<InventoryMovement[]>>;
  setTransfers: React.Dispatch<React.SetStateAction<InventoryTransfer[]>>;
  setCloudStatus: React.Dispatch<React.SetStateAction<'connected' | 'syncing' | 'offline'>>;
}

export async function syncCloudOnStartup(setters: CloudStateSetters) {
  setters.setCloudStatus('syncing');
  try {
    // 1. Fetch bottles from cloud
    const { data: remoteBottles, error: bottlesErr } = await supabase.from('bottles').select('*');
    
    if (bottlesErr) throw bottlesErr;

    // If cloud is empty, seed initial data
    if (!remoteBottles || remoteBottles.length === 0) {
      console.log('Cloud database is empty. Seeding initial Supabase tables...');
      
      await supabase.from('suppliers').upsert(SUPPLIERS_SEED);
      await supabase.from('bottles').upsert(BOTTLES_SEED);
      await supabase.from('activities').upsert(ACTIVITIES_SEED);
      await supabase.from('movements').upsert(MOVEMENTS_SEED);

      setters.setCloudStatus('connected');
      return;
    }

    // Otherwise load cloud data into local state and localStorage cache
    const { data: suppliers } = await supabase.from('suppliers').select('*');
    const { data: activities } = await supabase.from('activities').select('*');
    const { data: sales } = await supabase.from('sales').select('*');
    const { data: pos } = await supabase.from('purchase_orders').select('*');
    const { data: stocktakes } = await supabase.from('stocktakes').select('*');
    const { data: shifts } = await supabase.from('shifts').select('*');
    const { data: snapshots } = await supabase.from('snapshots').select('*');
    const { data: movements } = await supabase.from('movements').select('*');
    const { data: transfers } = await supabase.from('transfers').select('*');

    if (remoteBottles) {
      setters.setBottles(remoteBottles as Bottle[]);
      saveToStorage(STORAGE_KEYS.BOTTLES, remoteBottles);
    }
    if (suppliers && suppliers.length > 0) {
      setters.setSuppliers(suppliers as Supplier[]);
      saveToStorage(STORAGE_KEYS.SUPPLIERS, suppliers);
    }
    if (activities && activities.length > 0) {
      setters.setActivities(activities as ActivityItem[]);
      saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
    }
    if (sales && sales.length > 0) {
      setters.setSales(sales as Sale[]);
      saveToStorage(STORAGE_KEYS.SALES, sales);
    }
    if (pos && pos.length > 0) {
      setters.setPOs(pos as PurchaseOrder[]);
      saveToStorage(STORAGE_KEYS.POS, pos);
    }
    if (stocktakes && stocktakes.length > 0) {
      setters.setStocktakes(stocktakes as Stocktake[]);
      saveToStorage(STORAGE_KEYS.STOCKTAKES, stocktakes);
    }
    if (shifts && shifts.length > 0) {
      setters.setShifts(shifts as Shift[]);
      saveToStorage(STORAGE_KEYS.SHIFTS, shifts);
    }
    if (snapshots && snapshots.length > 0) {
      setters.setSnapshots(snapshots as InventorySnapshot[]);
      saveToStorage(STORAGE_KEYS.SNAPSHOTS, snapshots);
    }
    if (movements && movements.length > 0) {
      setters.setMovements(movements as InventoryMovement[]);
      saveToStorage(STORAGE_KEYS.MOVEMENTS, movements);
    }
    if (transfers && transfers.length > 0) {
      setters.setTransfers(transfers as InventoryTransfer[]);
      saveToStorage(STORAGE_KEYS.TRANSFERS, transfers);
    }

    setters.setCloudStatus('connected');
  } catch (err) {
    console.error('Supabase cloud sync error:', err);
    setters.setCloudStatus('offline');
  }
}

// Debounced background uploaders
let syncTimers: Record<string, NodeJS.Timeout> = {};

export function debouncedCloudSync(table: string, data: any[]) {
  if (syncTimers[table]) clearTimeout(syncTimers[table]);
  syncTimers[table] = setTimeout(async () => {
    try {
      if (!data || data.length === 0) return;
      await supabase.from(table).upsert(data);
    } catch (err) {
      console.error(`Failed to background sync ${table} to Supabase:`, err);
    }
  }, 1000);
}
