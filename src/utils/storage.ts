/**
 * Local and cloud storage utilities for offline/online capability
 */

interface StorageData {
  transactions: any[];
  products: any[];
  customers: any[];
  users: any[];
  settings: any;
}

class StorageManager {
  private isOnline: boolean = navigator.onLine;
  private dbName = 'ApofikPosDB';
  private version = 1;

  constructor() {
    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncToCloud();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Initialize IndexedDB for offline storage
  async initIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('transactions')) {
          const transactionStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
          transactionStore.createIndex('transactionNumber', 'transactionNumber', { unique: true });
          transactionStore.createIndex('date', 'createdAt');
        }

        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' });
          productStore.createIndex('barcode', 'barcode', { unique: true });
          productStore.createIndex('name', 'name');
        }

        if (!db.objectStoreNames.contains('customers')) {
          db.createObjectStore('customers', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
    });
  }

  // Save to IndexedDB (offline storage)
  async saveToIndexedDB(storeName: string, data: any): Promise<void> {
    try {
      const db = await this.initIndexedDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      await store.put({ ...data, lastModified: new Date() });
      
      // Auto-sync if online
      if (this.isOnline) {
        await this.syncToCloud();
      }
    } catch (error) {
      console.error('Error saving to IndexedDB:', error);
    }
  }

  // Get from IndexedDB
  async getFromIndexedDB(storeName: string, key?: string): Promise<any> {
    try {
      const db = await this.initIndexedDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      if (key) {
        return new Promise((resolve, reject) => {
          const request = store.get(key);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      } else {
        return new Promise((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }
    } catch (error) {
      console.error('Error getting from IndexedDB:', error);
      return null;
    }
  }

  // Save transaction (works offline/online)
  async saveTransaction(transaction: any): Promise<void> {
    // Always save locally first
    await this.saveToIndexedDB('transactions', transaction);
    
    // Save to localStorage as backup
    const transactions = this.getFromLocalStorage('transactions') || [];
    transactions.push({ ...transaction, synced: this.isOnline });
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Sync to cloud if online
    if (this.isOnline) {
      await this.syncTransactionToCloud(transaction);
    }
  }

  // Save to localStorage (immediate backup)
  saveToLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Get from localStorage
  getFromLocalStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  }

  // Sync to cloud (simulated - replace with actual API)
  async syncToCloud(): Promise<void> {
    if (!this.isOnline) return;

    try {
      // Get all unsynced data
      const unsyncedTransactions = this.getUnsyncedTransactions();
      
      for (const transaction of unsyncedTransactions) {
        await this.syncTransactionToCloud(transaction);
      }

      console.log('Data synced to cloud successfully');
    } catch (error) {
      console.error('Error syncing to cloud:', error);
    }
  }

  // Sync single transaction to cloud
  async syncTransactionToCloud(transaction: any): Promise<void> {
    try {
      // Simulate API call (replace with actual cloud service)
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(transaction)
      });

      if (response.ok) {
        // Mark as synced
        transaction.synced = true;
        await this.saveToIndexedDB('transactions', transaction);
      }
    } catch (error) {
      console.error('Error syncing transaction to cloud:', error);
      // Keep as unsynced for later retry
    }
  }

  // Get unsynced transactions
  getUnsyncedTransactions(): any[] {
    const transactions = this.getFromLocalStorage('transactions') || [];
    return transactions.filter((t: any) => !t.synced);
  }

  // Get auth token (implement your auth logic)
  private getAuthToken(): string {
    return localStorage.getItem('authToken') || '';
  }

  // Export data for backup
  async exportData(): Promise<string> {
    const data: StorageData = {
      transactions: await this.getFromIndexedDB('transactions'),
      products: await this.getFromIndexedDB('products'),
      customers: await this.getFromIndexedDB('customers'),
      users: await this.getFromIndexedDB('users'),
      settings: await this.getFromIndexedDB('settings')
    };

    return JSON.stringify(data, null, 2);
  }

  // Import data from backup
  async importData(jsonData: string): Promise<void> {
    try {
      const data: StorageData = JSON.parse(jsonData);
      
      // Import to IndexedDB
      if (data.transactions) {
        for (const transaction of data.transactions) {
          await this.saveToIndexedDB('transactions', transaction);
        }
      }

      if (data.products) {
        for (const product of data.products) {
          await this.saveToIndexedDB('products', product);
        }
      }

      if (data.customers) {
        for (const customer of data.customers) {
          await this.saveToIndexedDB('customers', customer);
        }
      }

      if (data.users) {
        for (const user of data.users) {
          await this.saveToIndexedDB('users', user);
        }
      }

      if (data.settings) {
        for (const setting of data.settings) {
          await this.saveToIndexedDB('settings', setting);
        }
      }

      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  // Clear all local data
  async clearAllData(): Promise<void> {
    try {
      // Clear IndexedDB
      const db = await this.initIndexedDB();
      const storeNames = ['transactions', 'products', 'customers', 'users', 'settings'];
      
      for (const storeName of storeNames) {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.clear();
      }

      // Clear localStorage
      const keysToRemove = ['transactions', 'products', 'customers', 'users', 'settings'];
      keysToRemove.forEach(key => localStorage.removeItem(key));

      console.log('All data cleared successfully');
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Get connection status
  isOnlineMode(): boolean {
    return this.isOnline;
  }

  // Force sync now
  async forceSyncNow(): Promise<void> {
    if (this.isOnline) {
      await this.syncToCloud();
    } else {
      throw new Error('Cannot sync while offline');
    }
  }
}

// Export singleton instance
export const storageManager = new StorageManager();