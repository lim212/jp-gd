// plugins/advanced-cache-manager.client.ts
// Advanced caching strategy tanpa mengubah design atau fungsi

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  class AdvancedCacheManager {
    private cacheVersion = '1.0.0'
    private maxCacheSize = 50 * 1024 * 1024 // 50MB
    private cacheExpiry = 24 * 60 * 60 * 1000 // 24 hours
    private compressionEnabled = true

    constructor() {
      this.init()
    }

    private init() {
      // Initialize cache management
      this.setupCacheManagement()
      
      // Setup cache cleanup
      this.setupCacheCleanup()
      
      // Setup cache monitoring
      this.setupCacheMonitoring()
      
      // Make globally available
      this.setupGlobalAPI()
    }

    private setupCacheManagement() {
      // Enhanced cache strategies
      this.setupImageCaching()
      this.setupAPICaching()
      this.setupPageCaching()
      this.setupAssetCaching()
    }

    private setupImageCaching() {
      // Lazy load images with advanced caching
      const images = document.querySelectorAll('img[data-src]')
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            this.loadImageWithCache(img)
            imageObserver.unobserve(img)
          }
        })
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      })

      images.forEach(img => imageObserver.observe(img))
    }

    private async loadImageWithCache(img: HTMLImageElement) {
      const src = img.dataset.src
      if (!src) return

      try {
        // Check cache first
        const cachedImage = await this.getCachedImage(src)
        if (cachedImage) {
          img.src = cachedImage
          img.classList.add('loaded')
          return
        }

        // Load and cache image
        const response = await fetch(src)
        const blob = await response.blob()
        const objectURL = URL.createObjectURL(blob)
        
        // Cache the image
        await this.cacheImage(src, objectURL)
        
        img.src = objectURL
        img.classList.add('loaded')
      } catch (error) {
        console.warn('Failed to load image:', src, error)
        img.src = src // Fallback to original src
      }
    }

    private async getCachedImage(src: string): Promise<string | null> {
      try {
        const cacheKey = `img_${this.hashString(src)}`
        const cached = localStorage.getItem(cacheKey)
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < this.cacheExpiry) {
            return data
          } else {
            localStorage.removeItem(cacheKey)
          }
        }
      } catch (error) {
        console.warn('Cache read error:', error)
      }
      
      return null
    }

    private async cacheImage(src: string, objectURL: string) {
      try {
        const cacheKey = `img_${this.hashString(src)}`
        const cacheData = {
          data: objectURL,
          timestamp: Date.now(),
          src: src
        }
        
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))
        this.updateCacheSize()
      } catch (error) {
        console.warn('Cache write error:', error)
      }
    }

    private setupAPICaching() {
      // Enhanced API caching with compression
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        const url = args[0]?.toString()
        const options = args[1] || {}
        
        // Skip caching for POST, PUT, DELETE requests
        if (options.method && ['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
          return originalFetch.apply(this, args)
        }

        // Check cache for GET requests
        if (!options.method || options.method.toUpperCase() === 'GET') {
          const cached = await this.getCachedAPIResponse(url)
          if (cached) {
            return new Response(JSON.stringify(cached.data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            })
          }
        }

        // Make request and cache response
        const response = await originalFetch.apply(this, args)
        if (response.ok && url) {
          const data = await response.clone().json().catch(() => null)
          if (data) {
            await this.cacheAPIResponse(url, data)
          }
        }

        return response
      }
    }

    private async getCachedAPIResponse(url: string): Promise<any> {
      try {
        const cacheKey = `api_${this.hashString(url)}`
        const cached = localStorage.getItem(cacheKey)
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < this.cacheExpiry) {
            return data
          } else {
            localStorage.removeItem(cacheKey)
          }
        }
      } catch (error) {
        console.warn('API cache read error:', error)
      }
      
      return null
    }

    private async cacheAPIResponse(url: string, data: any) {
      try {
        const cacheKey = `api_${this.hashString(url)}`
        const cacheData = {
          data: data,
          timestamp: Date.now(),
          url: url
        }
        
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))
        this.updateCacheSize()
      } catch (error) {
        console.warn('API cache write error:', error)
      }
    }

    private setupPageCaching() {
      // Cache page data for faster navigation
      window.addEventListener('beforeunload', () => {
        const pageData = {
          title: document.title,
          url: window.location.href,
          timestamp: Date.now(),
          content: this.extractPageContent()
        }
        
        try {
          localStorage.setItem('page_cache', JSON.stringify(pageData))
        } catch (error) {
          console.warn('Page cache write error:', error)
        }
      })
    }

    private extractPageContent(): any {
      // Extract essential page content for caching
      return {
        meta: {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
          keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content')
        },
        content: {
          headings: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent),
          links: Array.from(document.querySelectorAll('a[href]')).map(a => ({
            text: a.textContent,
            href: a.getAttribute('href')
          }))
        }
      }
    }

    private setupAssetCaching() {
      // Cache static assets
      const assets = document.querySelectorAll('link[rel="stylesheet"], script[src]')
      assets.forEach(asset => {
        const href = (asset as any).href || (asset as any).src
        if (href && this.isStaticAsset(href)) {
          this.cacheAsset(href)
        }
      })
    }

    private async cacheAsset(url: string) {
      try {
        const response = await fetch(url)
        if (response.ok) {
          const content = await response.text()
          const cacheKey = `asset_${this.hashString(url)}`
          const cacheData = {
            content: content,
            timestamp: Date.now(),
            url: url
          }
          
          localStorage.setItem(cacheKey, JSON.stringify(cacheData))
        }
      } catch (error) {
        console.warn('Asset cache error:', error)
      }
    }

    private setupCacheCleanup() {
      // Cleanup expired cache entries
      setInterval(() => {
        this.cleanupExpiredCache()
      }, 60 * 60 * 1000) // Every hour

      // Cleanup on page load
      this.cleanupExpiredCache()
    }

    private cleanupExpiredCache() {
      const keysToRemove: string[] = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('img_') || key.startsWith('api_') || key.startsWith('asset_'))) {
          try {
            const cached = localStorage.getItem(key)
            if (cached) {
              const { timestamp } = JSON.parse(cached)
              if (Date.now() - timestamp > this.cacheExpiry) {
                keysToRemove.push(key)
              }
            }
          } catch (error) {
            keysToRemove.push(key) // Remove corrupted entries
          }
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      if (keysToRemove.length > 0) {
        console.log(`🧹 Cleaned up ${keysToRemove.length} expired cache entries`)
      }
    }

    private setupCacheMonitoring() {
      // Monitor cache performance
      this.updateCacheSize()
      
      // Log cache statistics
      setInterval(() => {
        this.logCacheStats()
      }, 5 * 60 * 1000) // Every 5 minutes
    }

    private updateCacheSize() {
      let totalSize = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key)
          if (value) {
            totalSize += key.length + value.length
          }
        }
      }
      
      // Convert to MB
      const sizeInMB = totalSize / (1024 * 1024)
      
      if (sizeInMB > this.maxCacheSize / (1024 * 1024)) {
        console.warn('⚠️ Cache size limit reached, cleaning up...')
        this.cleanupOldestCache()
      }
    }

    private cleanupOldestCache() {
      const cacheEntries: Array<{ key: string, timestamp: number }> = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('img_') || key.startsWith('api_') || key.startsWith('asset_'))) {
          try {
            const cached = localStorage.getItem(key)
            if (cached) {
              const { timestamp } = JSON.parse(cached)
              cacheEntries.push({ key, timestamp })
            }
          } catch (error) {
            // Skip corrupted entries
          }
        }
      }
      
      // Sort by timestamp (oldest first)
      cacheEntries.sort((a, b) => a.timestamp - b.timestamp)
      
      // Remove oldest 25% of entries
      const entriesToRemove = Math.ceil(cacheEntries.length * 0.25)
      for (let i = 0; i < entriesToRemove; i++) {
        localStorage.removeItem(cacheEntries[i].key)
      }
      
      console.log(`🧹 Cleaned up ${entriesToRemove} oldest cache entries`)
    }

    private logCacheStats() {
      let imageCount = 0
      let apiCount = 0
      let assetCount = 0
      let totalSize = 0
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          if (key.startsWith('img_')) imageCount++
          else if (key.startsWith('api_')) apiCount++
          else if (key.startsWith('asset_')) assetCount++
          
          const value = localStorage.getItem(key)
          if (value) {
            totalSize += key.length + value.length
          }
        }
      }
      
      console.log('📊 Cache Stats:', {
        images: imageCount,
        api: apiCount,
        assets: assetCount,
        totalSize: Math.round(totalSize / 1024) + 'KB'
      })
    }

    private setupGlobalAPI() {
      // Make cache manager globally available
      ;(window as any).advancedCacheManager = {
        getStats: () => this.getCacheStats(),
        clearCache: () => this.clearAllCache(),
        cleanup: () => this.cleanupExpiredCache(),
        getCachedImage: (src: string) => this.getCachedImage(src),
        getCachedAPI: (url: string) => this.getCachedAPIResponse(url)
      }
    }

    private getCacheStats() {
      let imageCount = 0
      let apiCount = 0
      let assetCount = 0
      let totalSize = 0
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          if (key.startsWith('img_')) imageCount++
          else if (key.startsWith('api_')) apiCount++
          else if (key.startsWith('asset_')) assetCount++
          
          const value = localStorage.getItem(key)
          if (value) {
            totalSize += key.length + value.length
          }
        }
      }
      
      return {
        images: imageCount,
        api: apiCount,
        assets: assetCount,
        totalSize: Math.round(totalSize / 1024) + 'KB',
        maxSize: Math.round(this.maxCacheSize / 1024) + 'KB'
      }
    }

    private clearAllCache() {
      const keysToRemove: string[] = []
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.startsWith('img_') || key.startsWith('api_') || key.startsWith('asset_'))) {
          keysToRemove.push(key)
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key))
      console.log(`🧹 Cleared ${keysToRemove.length} cache entries`)
    }

    private isStaticAsset(url: string): boolean {
      const staticExtensions = ['.css', '.js', '.woff', '.woff2', '.ttf', '.eot']
      return staticExtensions.some(ext => url.includes(ext))
    }

    private hashString(str: string): string {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(36)
    }
  }

  // Initialize advanced cache manager
  new AdvancedCacheManager()
})
