/**
 * Critical Components Lazy Loading Plugin
 * 
 * Optimizes component loading untuk mempercepat initial load
 * tanpa mengubah design atau fungsi
 */

export default defineNuxtPlugin(() => {
  // Preload critical fonts untuk menghindari FOUT (Flash of Unstyled Text)
  if (typeof window !== 'undefined') {
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap',
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
    ]

    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = fontUrl
      link.onload = function() {
        this.rel = 'stylesheet'
      }
      document.head.appendChild(link)
    })

    // Preconnect ke domain penting untuk mempercepat koneksi
    const preconnectDomains = [
      'https://cdn.jsdelivr.net',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ]

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })

    // Optimize resource loading dengan priority hints
    if ('performance' in window && 'getEntriesByType' in performance) {
      // Monitor dan optimize resource loading
      const resourceTimings = performance.getEntriesByType('resource')
      
      // Identify slow-loading resources
      resourceTimings.forEach((resource: any) => {
        if (resource.duration > 1000) {
          console.warn(`Slow resource detected: ${resource.name} (${Math.round(resource.duration)}ms)`)
        }
      })
    }

    // Optimize images dengan native lazy loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img:not([loading])')
      images.forEach((img) => {
        img.setAttribute('loading', 'lazy')
        img.setAttribute('decoding', 'async')
      })
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', optimizeImages)
    } else {
      optimizeImages()
    }

    // Re-run on route change
    window.addEventListener('popstate', () => {
      setTimeout(optimizeImages, 100)
    })
  }
})

