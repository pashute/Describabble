// Filename: stickSetup.js v0.1.7
// Initialize IndexedDB and asset caching for stickchat
// Runs on app startup via npm run dev

class StickSetup {
  constructor() {
    this.dbName = 'stickchat-v0.1.7';
    this.dbVersion = 1;
    this.assetsCacheName = 'stick-assets-v0.1.7';
  }

  async initialize() {
    console.log('[stickSetup] Initializing stickchat...');

    try {
      // Step 1: Initialize IndexedDB
      await this.initIndexedDB();
      console.log('[stickSetup] ✓ IndexedDB initialized');

      // Step 2: Initialize asset cache
      await this.initAssetCache();
      console.log('[stickSetup] ✓ Asset cache initialized');

      // Step 3: Make assets globally accessible
      this.exposeAssetAccessor();
      console.log('[stickSetup] ✓ Asset accessor ready');

      console.log('[stickSetup] Ready for stickchat!');
      return { success: true };
    } catch (error) {
      console.error('[stickSetup] Initialization failed:', error);
      return { success: false, error: error.message };
    }
  }

  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Projects store
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' });
        }

        // Scenes store
        if (!db.objectStoreNames.contains('scenes')) {
          db.createObjectStore('scenes', { keyPath: 'id' });
        }

        // Shots store
        if (!db.objectStoreNames.contains('shots')) {
          db.createObjectStore('shots', { keyPath: 'id' });
        }

        // Assets cache store
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets', { keyPath: 'id' });
        }

        // Session store
        if (!db.objectStoreNames.contains('session')) {
          db.createObjectStore('session', { keyPath: 'id' });
        }
      };
    });
  }

  async initAssetCache() {
    const db = await this.getDB();
    const tx = db.transaction('assets', 'readonly');
    const store = tx.objectStore('assets');

    // List of assets to fetch from CDN
    const assetsToFetch = [
      'meta.stick.emotions',
      'meta.stick.movement',
      'meta.stick.component.bridge',
      'trans.stick.characters',
      'trans.stick.dialogue',
      'trans.stick.emotions',
      'desc.gen.emotions',
      'desc.gen.bridge'
    ];

    // Check each asset
    for (const assetId of assetsToFetch) {
      const stored = await this.getAssetFromDB(assetId);

      if (!stored || this.isCacheExpired(stored)) {
        // Fetch from CDN
        try {
          const content = await this.fetchAssetFromCDN(assetId);
          await this.saveAssetToDB(assetId, content);
          console.log(`[stickSetup] Cached ${assetId}`);
        } catch (error) {
          console.warn(`[stickSetup] Could not fetch ${assetId}:`, error.message);
          // Continue even if one asset fails
        }
      } else {
        console.log(`[stickSetup] Asset cached: ${assetId}`);
      }
    }
  }

  async fetchAssetFromCDN(assetId) {
    // Convert assetId to CDN URL: meta.stick.emotions → pashute.describ//meta/stick.emotions
    const parts = assetId.split('.');
    const path = parts.slice(0, -1).join('/') + '/' + parts[parts.length - 1];
    const url = `https://pashute.describ//assets/${path}.md`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    return await response.text();
  }

  async getAssetFromDB(assetId) {
    const db = await this.getDB();
    return new Promise((resolve) => {
      const tx = db.transaction('assets', 'readonly');
      const store = tx.objectStore('assets');
      const request = store.get(assetId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }

  async saveAssetToDB(assetId, content) {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('assets', 'readwrite');
      const store = tx.objectStore('assets');

      const asset = {
        id: assetId,
        content: content,
        fetchedAt: Date.now(),
        expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
      };

      const request = store.put(asset);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  isCacheExpired(asset) {
    return asset.expiresAt < Date.now();
  }

  async getDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  exposeAssetAccessor() {
    // Make global Assets accessor available to stickchat code
    window.Assets = {
      get: async (assetId) => {
        const asset = await this.getAssetFromDB(assetId);
        return asset ? asset.content : null;
      },

      list: async (pattern) => {
        const db = await this.getDB();
        const tx = db.transaction('assets', 'readonly');
        const store = tx.objectStore('assets');

        return new Promise((resolve) => {
          const allAssets = [];
          const request = store.getAll();

          request.onsuccess = () => {
            const results = request.result.filter(asset => {
              // Simple glob matching: convert * to regex
              const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
              return regex.test(asset.id);
            });
            resolve(results.map(a => ({ id: a.id, fetchedAt: a.fetchedAt })));
          };
        });
      },

      isCached: async (assetId) => {
        const asset = await this.getAssetFromDB(assetId);
        return asset && !this.isCacheExpired(asset);
      },

      refresh: async () => {
        const db = await this.getDB();
        const tx = db.transaction('assets', 'readwrite');
        const store = tx.objectStore('assets');
        store.clear();
        console.log('[stickSetup] Asset cache cleared');
        await this.initAssetCache();
      }
    };
  }
}

// Auto-initialize on module load (called from stickchat startup)
const setup = new StickSetup();

// Export for both ES modules and scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = setup;
}
