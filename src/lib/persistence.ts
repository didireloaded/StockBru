// Persistence layer using localStorage
const STORAGE_KEYS = {
  BOTTLES: 'stockbru-bottles',
  SUPPLIERS: 'stockbru-suppliers',
  ACTIVITIES: 'stockbru-activities',
  SALES: 'stockbru-sales',
  POS: 'stockbru-pos',
  STOCKTAKES: 'stockbru-stocktakes',
  SHIFTS: 'stockbru-shifts',
  SNAPSHOTS: 'stockbru-snapshots',
  MOVEMENTS: 'stockbru-movements',
  TRANSFERS: 'stockbru-transfers',
  SAVED_VIEWS: 'stockbru-saved-views',
};

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

export { STORAGE_KEYS };
