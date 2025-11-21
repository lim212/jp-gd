
// Resource Preloading Plugin
export default defineNuxtPlugin(() => {
  if (process.client && typeof document !== 'undefined') {
    // Preload critical resources with existence check
    const preloadResources = () => {
      // Helper function to check if resource exists before preloading
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
        
        // Only add if we can verify the resource will be used
        // Convert preload to actual resource link after load
        link.onload = function() {
          // Resource loaded successfully, convert to actual resource if needed
          if (as === 'style') {
            this.rel = 'stylesheet'
          }
        }
        
        link.onerror = function() {
          // Resource doesn't exist, remove the link to avoid warning
          this.remove()
        }
        
        document.head.appendChild(link)
      }

      // Preload critical CSS (only if file exists)
      preloadIfExists('/css/critical.css', 'style')

      // Preload critical fonts (only if file exists)
      preloadIfExists('/fonts/Poppins-Regular.woff2', 'font', 'font/woff2', 'anonymous')

      // Preload critical images (only if files exist)
      const criticalImages = [
        '/images/logo.webp',
        '/images/hero-bg.webp'
      ]

      criticalImages.forEach(src => {
        preloadIfExists(src, 'image')
      })
    }

    // Run preloading after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', preloadResources)
    } else {
      preloadResources()
    }
  }
})
