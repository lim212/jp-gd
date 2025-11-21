export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    // CSS is now handled via standard import in main.css
    // Focus on other performance optimizations instead

    // Optimize third-party resources
    const optimizeThirdParty = () => {
      // Prefetch DNS for external domains
      const domains = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com']
      domains.forEach(domain => {
        const link = document.createElement('link')
        link.rel = 'dns-prefetch'
        link.href = `//${domain}`
        document.head.appendChild(link)
      })
    }

    // Run optimizations on page load
    if (document.readyState === 'complete') {
      optimizeThirdParty()
    } else {
      window.addEventListener('load', optimizeThirdParty)
    }

    // Reduce animation on low-end devices
    const reduceMotion = () => {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      if (mediaQuery.matches || navigator.hardwareConcurrency <= 2) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s')
        document.documentElement.style.setProperty('--transition-duration', '0.1s')
      }
    }
    reduceMotion()

    // Monitor and report performance metrics
    if ('PerformanceObserver' in window) {
      try {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime)
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            console.log('FID:', entry.processingStart - entry.startTime)
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift (CLS)
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
              console.log('CLS:', clsValue)
            }
          }
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        // Silently fail if PerformanceObserver not supported
      }
    }
  }
})
