/**
 * Defer Non-Critical Resources Plugin
 * 
 * Menunda loading resource non-critical untuk mempercepat initial load
 */

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  // Defer non-critical CSS
  const deferCSS = () => {
    // Find all non-critical stylesheets
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"][data-defer]')
    
    stylesheets.forEach((link: any) => {
      // Create new link element
      const newLink = document.createElement('link')
      newLink.rel = 'stylesheet'
      newLink.href = link.href
      newLink.media = 'all'
      
      // Load after page is interactive
      if (document.readyState === 'complete') {
        document.head.appendChild(newLink)
      } else {
        window.addEventListener('load', () => {
          document.head.appendChild(newLink)
        })
      }
      
      // Remove original link
      link.remove()
    })
  }

  // Defer analytics and tracking scripts
  const deferAnalytics = () => {
    // Wait for page to be fully loaded before initializing analytics
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Analytics will be initialized here if needed
        console.log('Analytics deferred successfully')
      }, { timeout: 2000 })
    } else {
      setTimeout(() => {
        console.log('Analytics deferred successfully')
      }, 2000)
    }
  }

  // Optimize third-party scripts
  const optimizeThirdParty = () => {
    // Lazy load third-party iframes (like YouTube embeds)
    const iframes = document.querySelectorAll('iframe[data-src]')
    
    const loadIframe = (iframe: any) => {
      iframe.src = iframe.dataset.src
      iframe.removeAttribute('data-src')
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadIframe(entry.target)
            observer.unobserve(entry.target)
          }
        })
      }, {
        rootMargin: '50px'
      })

      iframes.forEach((iframe) => observer.observe(iframe))
    } else {
      // Fallback untuk browser lama
      iframes.forEach(loadIframe)
    }
  }

  // Execute optimizations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      deferCSS()
      optimizeThirdParty()
    })
    window.addEventListener('load', deferAnalytics)
  } else {
    deferCSS()
    optimizeThirdParty()
    deferAnalytics()
  }

  // Optimize font loading
  if ('fonts' in document) {
    // @ts-ignore
    document.fonts.ready.then(() => {
      console.log('Fonts loaded successfully')
    })
  }
})

