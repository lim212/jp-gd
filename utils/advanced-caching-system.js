
// Advanced Caching System
export class AdvancedCachingSystem {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100; // Maximum number of cached items
    this.maxAge = 5 * 60 * 1000; // 5 minutes
    this.init();
  }

  init() {
    if (process.client) {
      this.setupServiceWorker();
      this.setupMemoryCache();
      this.setupLocalStorageCache();
    }
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }

  setupMemoryCache() {
    // Clean up expired cache entries
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 60000); // Every minute
  }

  setupLocalStorageCache() {
    // Load cached data from localStorage
    try {
      const cachedData = localStorage.getItem('app-cache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        Object.entries(parsed).forEach(([key, value]) => {
          this.cache.set(key, value);
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }

    // Save cache to localStorage periodically
    setInterval(() => {
      this.saveToLocalStorage();
    }, 30000); // Every 30 seconds
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    // Check if item has expired
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  cleanupExpiredEntries() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.maxAge) {
        this.cache.delete(key);
      }
    }
  }

  saveToLocalStorage() {
    try {
      const cacheData = {};
      for (const [key, item] of this.cache.entries()) {
        cacheData[key] = item;
      }
      localStorage.setItem('app-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  // Cache API responses
  async cacheApiResponse(url, response) {
    const cacheKey = `api:${url}`;
    this.set(cacheKey, response);
  }

  // Get cached API response
  getCachedApiResponse(url) {
    const cacheKey = `api:${url}`;
    return this.get(cacheKey);
  }
}

// Initialize caching system
if (process.client) {
  window.cachingSystem = new AdvancedCachingSystem();
}
