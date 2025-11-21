// plugins/performance-monitor.client.ts
// Performance monitoring tanpa mengubah design atau fungsi

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  class PerformanceMonitor {
    private metrics: Record<string, any> = {}
    private observers: PerformanceObserver[] = []

    constructor() {
      this.init()
    }

    private init() {
      // Monitor Core Web Vitals
      this.monitorCoreWebVitals()
      
      // Monitor loading performance
      this.monitorLoadingPerformance()
      
      // Monitor user interactions
      this.monitorUserInteractions()
      
      // Monitor resource loading
      this.monitorResourceLoading()
    }

    private monitorCoreWebVitals() {
      // Largest Contentful Paint (LCP)
      if ('PerformanceObserver' in window) {
        try {
          const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            const lastEntry = entries[entries.length - 1] as PerformanceEntry
            this.metrics.lcp = lastEntry.startTime
            console.log('📊 LCP:', Math.round(lastEntry.startTime), 'ms')
          })
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
          this.observers.push(lcpObserver)
        } catch (error) {
          console.warn('LCP monitoring failed:', error)
        }

        // First Input Delay (FID)
        try {
          const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            entries.forEach((entry: any) => {
              this.metrics.fid = entry.processingStart - entry.startTime
              console.log('📊 FID:', Math.round(entry.processingStart - entry.startTime), 'ms')
            })
          })
          fidObserver.observe({ entryTypes: ['first-input'] })
          this.observers.push(fidObserver)
        } catch (error) {
          console.warn('FID monitoring failed:', error)
        }

        // Cumulative Layout Shift (CLS)
        try {
          let clsValue = 0
          const clsObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value
              }
            })
            this.metrics.cls = clsValue
            console.log('📊 CLS:', Math.round(clsValue * 1000) / 1000)
          })
          clsObserver.observe({ entryTypes: ['layout-shift'] })
          this.observers.push(clsObserver)
        } catch (error) {
          console.warn('CLS monitoring failed:', error)
        }
      }
    }

    private monitorLoadingPerformance() {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        if (navigation) {
          this.metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart
          this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart
          this.metrics.firstByte = navigation.responseStart - navigation.requestStart
          
          console.log('📊 Load Time:', Math.round(this.metrics.loadTime), 'ms')
          console.log('📊 DOM Content Loaded:', Math.round(this.metrics.domContentLoaded), 'ms')
          console.log('📊 First Byte:', Math.round(this.metrics.firstByte), 'ms')
        }
      })
    }

    private monitorUserInteractions() {
      // Track scroll depth
      let maxScrollDepth = 0
      let scrollTimeout: number | undefined
      
      window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout)
        
        scrollTimeout = window.setTimeout(() => {
          const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
          maxScrollDepth = Math.max(maxScrollDepth, scrollDepth)
          this.metrics.scrollDepth = maxScrollDepth
        }, 100)
      })

      // Track time on page
      const startTime = Date.now()
      window.addEventListener('beforeunload', () => {
        this.metrics.timeOnPage = Date.now() - startTime
        console.log('📊 Time on Page:', Math.round(this.metrics.timeOnPage / 1000), 'seconds')
      })

      // Track click events
      let clickCount = 0
      document.addEventListener('click', () => {
        clickCount++
        this.metrics.clickCount = clickCount
      })
    }

    private monitorResourceLoading() {
      if ('PerformanceObserver' in window) {
        try {
          const resourceObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            entries.forEach((entry: any) => {
              if (entry.duration > 1000) { // Log slow resources (>1s)
                console.log('🐌 Slow Resource:', entry.name, Math.round(entry.duration), 'ms')
              }
            })
          })
          resourceObserver.observe({ entryTypes: ['resource'] })
          this.observers.push(resourceObserver)
        } catch (error) {
          console.warn('Resource monitoring failed:', error)
        }
      }
    }

    public getMetrics() {
      return { ...this.metrics }
    }

    public cleanup() {
      this.observers.forEach(observer => observer.disconnect())
      this.observers = []
    }
  }

  // Initialize performance monitoring
  const monitor = new PerformanceMonitor()
  
  // Make it globally available
  ;(window as any).performanceMonitor = monitor

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    monitor.cleanup()
  })
})
