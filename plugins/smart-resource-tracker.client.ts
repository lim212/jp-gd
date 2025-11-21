/**
 * Smart Resource Tracker Plugin
 * 
 * Tracks real-time loading of various resources:
 * - CSS files
 * - JavaScript files
 * - Images
 * - Fonts
 * - HTML/Components
 * 
 * Features:
 * - Real-time progress tracking
 * - Performance monitoring
 * - Smart mode activation after 5 seconds
 * - Progressive loading optimization
 */

export default defineNuxtPlugin({
  name: 'smart-resource-tracker',
  enforce: 'pre',
  setup() {
    // Resource tracking state
    const resourceState = reactive({
      resources: {
        css: { loaded: 0, total: 0, size: 0, status: 'pending' },
        js: { loaded: 0, total: 0, size: 0, status: 'pending' },
        images: { loaded: 0, total: 0, size: 0, status: 'pending' },
        fonts: { loaded: 0, total: 0, size: 0, status: 'pending' },
        html: { loaded: 0, total: 0, size: 0, status: 'pending' },
        components: { loaded: 0, total: 0, size: 0, status: 'pending' }
      },
      startTime: Date.now(),
      smartModeActive: false,
      totalProgress: 0
    })

    // Performance observer for tracking resources
    if (process.client && 'PerformanceObserver' in window) {
      try {
        // Track CSS files
        const cssObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming
            if (resource.initiatorType === 'link' && resource.name.includes('.css')) {
              resourceState.resources.css.loaded++
              resourceState.resources.css.size += resource.transferSize || 0
              resourceState.resources.css.status = 'loading'
            }
          }
        })

        // Track JavaScript files
        const jsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming
            if (resource.initiatorType === 'script' && (resource.name.includes('.js') || resource.name.includes('.mjs'))) {
              resourceState.resources.js.loaded++
              resourceState.resources.js.size += resource.transferSize || 0
              resourceState.resources.js.status = 'loading'
            }
          }
        })

        // Track images
        const imageObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming
            if (resource.initiatorType === 'img' || 
                resource.name.match(/\.(jpg|jpeg|png|gif|svg|webp|avif)$/i)) {
              resourceState.resources.images.loaded++
              resourceState.resources.images.size += resource.transferSize || 0
              resourceState.resources.images.status = 'loading'
            }
          }
        })

        // Track fonts
        const fontObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const resource = entry as PerformanceResourceTiming
            if (resource.initiatorType === 'css' && 
                resource.name.match(/\.(woff|woff2|ttf|eot|otf)$/i)) {
              resourceState.resources.fonts.loaded++
              resourceState.resources.fonts.size += resource.transferSize || 0
              resourceState.resources.fonts.status = 'loading'
            }
          }
        })

        // Start observing
        try {
          cssObserver.observe({ entryTypes: ['resource'] })
          jsObserver.observe({ entryTypes: ['resource'] })
          imageObserver.observe({ entryTypes: ['resource'] })
          fontObserver.observe({ entryTypes: ['resource'] })
        } catch (e) {
          console.warn('Resource tracking not fully supported:', e)
        }

        // Activate smart mode after 5 seconds
        setTimeout(() => {
          if (resourceState.totalProgress < 100) {
            resourceState.smartModeActive = true
            console.log('🚀 Smart Mode Activated - Progressive loading enabled')
            
            // Trigger progressive loading
            activateProgressiveLoading()
          }
        }, 5000)

        // Monitor page load
        window.addEventListener('load', () => {
          // Mark all resources as completed
          Object.keys(resourceState.resources).forEach(key => {
            const resource = resourceState.resources[key as keyof typeof resourceState.resources]
            if (resource.status === 'loading') {
              resource.status = 'completed'
            }
          })

          resourceState.totalProgress = 100

          const loadTime = Date.now() - resourceState.startTime
          console.log(`✅ Page loaded in ${loadTime}ms`)
          console.log('📊 Resources:', resourceState.resources)
        })

      } catch (error) {
        console.warn('Performance Observer not available:', error)
      }
    }

    /**
     * Progressive Loading Strategy
     * Loads resources in order from smallest to largest
     */
    const activateProgressiveLoading = () => {
      if (!process.client) return

      // Priority order: CSS > Fonts > HTML > JS > Components > Images
      const loadingStrategy = [
        { type: 'css', priority: 1 },
        { type: 'fonts', priority: 2 },
        { type: 'html', priority: 3 },
        { type: 'js', priority: 4 },
        { type: 'components', priority: 5 },
        { type: 'images', priority: 6 }
      ]

      console.log('⚡ Progressive Loading Strategy:', loadingStrategy)

      // Get all pending resources
      const pendingResources = document.querySelectorAll('[data-lazy-load]')
      
      // Sort by priority and size
      const sortedResources = Array.from(pendingResources).sort((a, b) => {
        const aType = a.getAttribute('data-resource-type') || 'unknown'
        const bType = b.getAttribute('data-resource-type') || 'unknown'
        
        const aPriority = loadingStrategy.find(s => s.type === aType)?.priority || 999
        const bPriority = loadingStrategy.find(s => s.type === bType)?.priority || 999
        
        return aPriority - bPriority
      })

      // Load resources sequentially
      let loadIndex = 0
      const loadNext = () => {
        if (loadIndex >= sortedResources.length) {
          console.log('✅ Progressive loading completed')
          return
        }

        const resource = sortedResources[loadIndex]
        const src = resource.getAttribute('data-src')
        const type = resource.getAttribute('data-resource-type')

        if (src) {
          console.log(`📦 Loading ${type}: ${src}`)
          
          if (resource.tagName === 'IMG') {
            const img = resource as HTMLImageElement
            img.src = src
            img.onload = () => {
              loadIndex++
              setTimeout(loadNext, 50) // 50ms delay between loads
            }
            img.onerror = () => {
              console.warn(`❌ Failed to load: ${src}`)
              loadIndex++
              setTimeout(loadNext, 50)
            }
          } else if (resource.tagName === 'LINK') {
            const link = resource as HTMLLinkElement
            link.href = src
            loadIndex++
            setTimeout(loadNext, 50)
          } else {
            loadIndex++
            setTimeout(loadNext, 50)
          }
        } else {
          loadIndex++
          setTimeout(loadNext, 50)
        }
      }

      // Start loading
      loadNext()
    }

    /**
     * Get current resource state
     */
    const getResourceState = () => {
      return { ...resourceState }
    }

    /**
     * Calculate total progress
     */
    const calculateProgress = () => {
      const resources = Object.values(resourceState.resources)
      const completed = resources.filter(r => r.status === 'completed').length
      return Math.floor((completed / resources.length) * 100)
    }

    /**
     * Check if smart mode should be activated
     */
    const shouldActivateSmartMode = () => {
      const elapsed = Date.now() - resourceState.startTime
      return elapsed > 5000 && resourceState.totalProgress < 100
    }

    /**
     * Get loading statistics
     */
    const getLoadingStats = () => {
      const elapsed = (Date.now() - resourceState.startTime) / 1000
      const totalSize = Object.values(resourceState.resources).reduce((sum, r) => sum + r.size, 0)
      const speed = elapsed > 0 ? totalSize / elapsed : 0

      return {
        elapsed: elapsed.toFixed(1),
        totalSize,
        speed: formatSpeed(speed),
        progress: calculateProgress(),
        smartMode: resourceState.smartModeActive
      }
    }

    /**
     * Format speed for display
     */
    const formatSpeed = (bytesPerSecond: number): string => {
      if (bytesPerSecond >= 1024 * 1024) {
        return `${(bytesPerSecond / (1024 * 1024)).toFixed(2)} MB/s`
      } else if (bytesPerSecond >= 1024) {
        return `${(bytesPerSecond / 1024).toFixed(2)} KB/s`
      }
      return `${bytesPerSecond.toFixed(0)} B/s`
    }

    /**
     * Preload critical resources (only if they exist and will be used)
     */
    const preloadCriticalResources = () => {
      if (!process.client || typeof document === 'undefined') return

      const preloadIfExists = (href: string, as: string, type?: string, crossorigin?: string) => {
        // Check if link already exists
        const existing = document.querySelector(`link[href="${href}"]`)
        if (existing) return

        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = href
        link.as = as
        if (type) link.type = type
        if (crossorigin) link.crossOrigin = crossorigin
        
        // Convert preload to actual resource after load
        link.onload = function() {
          if (as === 'style') {
            this.rel = 'stylesheet'
          }
        }
        
        // Remove if resource doesn't exist to avoid warning
        link.onerror = function() {
          this.remove()
        }
        
        document.head.appendChild(link)
      }

      // Only preload resources that are actually used by the app
      // These paths should match what Nuxt actually generates
      const criticalResources = [
        // Critical fonts (only if actually used)
        { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' }
      ]

      criticalResources.forEach(resource => {
        preloadIfExists(resource.href, resource.as, resource.type, resource.crossorigin)
      })
    }

    // Initialize preloading
    if (process.client) {
      preloadCriticalResources()
    }

    // Provide to app
    return {
      provide: {
        resourceTracker: {
          getState: getResourceState,
          getStats: getLoadingStats,
          calculateProgress,
          shouldActivateSmartMode,
          activateProgressiveLoading
        }
      }
    }
  }
})

