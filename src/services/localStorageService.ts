interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiry: number | null;
}

export class LocalStorageService {
  private static instance: LocalStorageService;

  private constructor() {}

  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  /**
   * Set an item in localStorage with optional expiration
   * @param key Storage key
   * @param value Value to store
   * @param expiryHours Optional expiration time in hours
   */
  public setItem<T>(key: string, value: T, expiryHours?: number): void {
    const storageItem: StorageItem<T> = {
      value,
      timestamp: Date.now(),
      expiry: expiryHours ? Date.now() + expiryHours * 60 * 60 * 1000 : null
    };

    try {
      localStorage.setItem(key, JSON.stringify(storageItem));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      // If localStorage is full, clear expired items and try again
      this.clearExpiredItems();
      try {
        localStorage.setItem(key, JSON.stringify(storageItem));
      } catch (retryError) {
        console.error('Failed to save even after clearing expired items:', retryError);
      }
    }
  }

  /**
   * Get an item from localStorage
   * @param key Storage key
   * @returns The stored value if not expired, null otherwise
   */
  public getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const storageItem: StorageItem<T> = JSON.parse(item);
      
      // Check if item has expired
      if (storageItem.expiry && Date.now() > storageItem.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return storageItem.value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  /**
   * Remove an item from localStorage
   * @param key Storage key
   */
  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all items from localStorage
   */
  public clear(): void {
    localStorage.clear();
  }

  /**
   * Remove all expired items from localStorage
   */
  private clearExpiredItems(): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const item = localStorage.getItem(key);
      if (!item) continue;

      try {
        const storageItem: StorageItem<any> = JSON.parse(item);
        if (storageItem.expiry && Date.now() > storageItem.expiry) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // If item can't be parsed, leave it alone
        continue;
      }
    }
  }

  /**
   * Get the remaining time in milliseconds before an item expires
   * @param key Storage key
   * @returns Time in milliseconds until expiry, or null if no expiry set
   */
  public getTimeToExpiry(key: string): number | null {
    const item = localStorage.getItem(key);
    if (!item) return null;

    try {
      const storageItem: StorageItem<any> = JSON.parse(item);
      if (!storageItem.expiry) return null;

      const timeToExpiry = storageItem.expiry - Date.now();
      return timeToExpiry > 0 ? timeToExpiry : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if an item exists and is not expired
   * @param key Storage key
   * @returns boolean indicating if item exists and is valid
   */
  public isValid(key: string): boolean {
    const item = this.getItem(key);
    return item !== null;
  }
}

export const storageService = LocalStorageService.getInstance();