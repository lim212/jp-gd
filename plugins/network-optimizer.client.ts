// plugins/network-optimizer.client.ts
// Network optimization tanpa mengubah design atau fungsi

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  class NetworkOptimizer {
    private connectionInfo: any = null
    private isSlowConnection = false
    private isOffline = false
    private retryQueue: Array<() => Promise<any>> = []
    private maxRetries = 3
    private retryDelay = 1000

    constructor() {
      this.init()
    }

    private init() {
      // Detect connection type and speed
      this.detectConnectionInfo()
      
      // Setup network monitoring
      this.setupNetworkMonitoring()
      
      // Setup request optimization
      this.setupRequestOptimization()
      
      // Setup offline handling
      this.setupOfflineHandling()
      
      // Make globally available
      this.setupGlobalAPI()
    }

    private detectConnectionInfo() {
      // Get connection information
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        this.connectionInfo = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        }
        
        // Determine if connection is slow
        this.isSlowConnection = this.connectionInfo.effectiveType === 'slow-2g' || 
                               this.connectionInfo.effectiveType === '2g' ||
                               this.connectionInfo.downlink < 1.5
        
        console.log('🌐 Connection Info:', this.connectionInfo)
        console.log('🌐 Slow Connection:', this.isSlowConnection)
      }
    }

    private setupNetworkMonitoring() {
      // Monitor connection changes
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        connection.addEventListener('change', () => {
          this.detectConnectionInfo()
          this.adaptToConnectionChange()
        })
      }

      // Monitor online/offline status
      window.addEventListener('online', () => {
        this.isOffline = false
        console.log('🌐 Back online, processing queued requests')
        this.processRetryQueue()
      })

      window.addEventListener('offline', () => {
        this.isOffline = true
        console.log('🌐 Gone offline, queuing requests')
      })
    }

    private adaptToConnectionChange() {
      // Adapt loading strategies based on connection
      if (this.isSlowConnection) {
        this.enableSlowConnectionMode()
      } else {
        this.disableSlowConnectionMode()
      }
    }

    private enableSlowConnectionMode() {
      // Reduce image quality for slow connections
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        if (img.src && !img.dataset.originalSrc) {
          img.dataset.originalSrc = img.src
          // You could implement image quality reduction here
        }
      })

      // Disable non-essential animations
      document.documentElement.classList.add('slow-connection')
      
      console.log('🌐 Slow connection mode enabled')
    }

    private disableSlowConnectionMode() {
      // Restore original image quality
      const images = document.querySelectorAll('img[data-original-src]')
      images.forEach(img => {
        if (img.dataset.originalSrc) {
          img.src = img.dataset.originalSrc
          delete img.dataset.originalSrc
        }
      })

      // Re-enable animations
      document.documentElement.classList.remove('slow-connection')
      
      console.log('🌐 Slow connection mode disabled')
    }

    private setupRequestOptimization() {
      // Optimize fetch requests
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        const url = args[0]?.toString()
        const options = args[1] || {}

        // Add connection-aware headers
        if (this.isSlowConnection) {
          options.headers = {
            ...options.headers,
            'X-Connection-Type': 'slow',
            'X-Save-Data': this.connectionInfo?.saveData ? '1' : '0'
          }
        }

        // Add timeout for slow connections
        if (this.isSlowConnection && !options.signal) {
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout
          options.signal = controller.signal
          
          try {
            const response = await originalFetch.apply(this, args)
            clearTimeout(timeout)
            return response
          } catch (error) {
            clearTimeout(timeout)
            throw error
          }
        }

        return originalFetch.apply(this, args)
      }
    }

    private setupOfflineHandling() {
      // Queue requests when offline
      const originalFetch = window.fetch
      window.fetch = async (...args) => {
        if (this.isOffline) {
          return new Promise((resolve, reject) => {
            this.retryQueue.push(async () => {
              try {
                const response = await originalFetch.apply(this, args)
                resolve(response)
              } catch (error) {
                reject(error)
              }
            })
          })
        }

        return originalFetch.apply(this, args)
      }
    }

    private async processRetryQueue() {
      while (this.retryQueue.length > 0) {
        const request = this.retryQueue.shift()
        if (request) {
          try {
            await request()
          } catch (error) {
            console.warn('🌐 Retry request failed:', error)
            // Could implement exponential backoff here
          }
        }
      }
    }

    private setupGlobalAPI() {
      // Make network optimizer globally available
      ;(window as any).networkOptimizer = {
        getConnectionInfo: () => this.connectionInfo,
        isSlowConnection: () => this.isSlowConnection,
        isOffline: () => this.isOffline,
        enableSlowMode: () => this.enableSlowConnectionMode(),
        disableSlowMode: () => this.disableSlowConnectionMode(),
        getRetryQueueLength: () => this.retryQueue.length
      }
    }
  }

  // Initialize network optimizer
  new NetworkOptimizer()
})
