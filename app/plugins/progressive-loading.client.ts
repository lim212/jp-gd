// Progressive Loading Plugin
// Optimizes resource loading dengan strategi pintar

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) return

  // Track loading state
  const loadingState = {
    critical: false,
    images: false,
    fonts: false,
    scripts: false
  }

  // Progressive Image Loader
  class ProgressiveImageLoader {
    private observer: IntersectionObserver | null = null
    private loadedImages = new Set<string>()

    constructor() {
      this.init()
    }

    private init() {
      // Create intersection observer for lazy loading
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target as HTMLElement)
            }
          })
        },
        {
          rootMargin: '100px', // Start loading 100px before viewport
          threshold: 0.01
        }
      )

      // Observe all images with data-src
      this.observeImages()

      // Re-observe on route change
      nuxtApp.hook('page:finish', () => {
        setTimeout(() => this.observeImages(), 100)
      })
    }

    private observeImages() {
      const images = document.querySelectorAll('img[data-src], [data-background]')
      images.forEach((img) => {
        if (this.observer) {
          this.observer.observe(img)
        }
      })
    }

    private async loadImage(element: HTMLElement) {
      const img = element as HTMLImageElement
      const src = img.dataset.src || img.dataset.background

      if (!src || this.loadedImages.has(src)) return

      try {
        // Create tiny placeholder first
        if (img.dataset.placeholder) {
          img.src = img.dataset.placeholder
          img.style.filter = 'blur(10px)'
        }

        // Load actual image
        const image = new Image()
        image.src = src

        await new Promise((resolve, reject) => {
          image.onload = resolve
          image.onerror = reject
        })

        // Apply loaded image with fade effect
        if (img.tagName === 'IMG') {
          img.src = src
          img.style.filter = 'blur(0)'
          img.style.transition = 'filter 0.3s ease-out'
        } else {
          element.style.backgroundImage = `url(${src})`
        }

        this.loadedImages.add(src)
        
        // Unobserve after loading
        if (this.observer) {
          this.observer.unobserve(element)
        }
      } catch (error) {
        console.warn('Failed to load image:', src, error)
      }
    }

    public disconnect() {
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    }
  }

  // CSS Loading Optimizer
  class CSSOptimizer {
    private nonCriticalCSS: string[] = []

    constructor() {
      this.init()
    }

    private init() {
      // Defer non-critical CSS
      this.deferNonCriticalCSS()

      // Preload critical fonts
      this.preloadFonts()
    }

    private deferNonCriticalCSS() {
      // Move non-critical CSS to load after page interactive
      if (document.readyState === 'complete') {
        this.loadNonCritical()
      } else {
        window.addEventListener('load', () => {
          setTimeout(() => this.loadNonCritical(), 100)
        })
      }
    }

    private loadNonCritical() {
      const styleSheets = document.querySelectorAll('link[rel="stylesheet"][data-defer]')
      styleSheets.forEach((link) => {
        const href = (link as HTMLLinkElement).dataset.href
        if (href && !this.nonCriticalCSS.includes(href)) {
          const newLink = document.createElement('link')
          newLink.rel = 'stylesheet'
          newLink.href = href
          document.head.appendChild(newLink)
          this.nonCriticalCSS.push(href)
        }
      })
    }

    private preloadFonts() {
      // Preload critical fonts - only if they exist
      // Skip font preloading as Nuxt @nuxt/fonts handles this
      // This prevents 404 errors for non-existent font files
    }
  }

  // Script Loader with Priority
  class ScriptLoader {
    private loadedScripts = new Set<string>()

    public async loadScript(src: string, priority: 'high' | 'low' = 'low'): Promise<void> {
      if (this.loadedScripts.has(src)) return

      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.async = true
        
        if (priority === 'low') {
          script.defer = true
        }

        script.onload = () => {
          this.loadedScripts.add(src)
          resolve()
        }
        
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`))

        document.body.appendChild(script)
      })
    }

    public loadScriptsSequentially(scripts: Array<{ src: string; priority?: 'high' | 'low' }>) {
      const highPriority = scripts.filter((s) => s.priority === 'high')
      const lowPriority = scripts.filter((s) => s.priority !== 'high')

      // Load high priority first
      Promise.all(highPriority.map((s) => this.loadScript(s.src, 'high'))).then(() => {
        // Then load low priority when idle
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => {
            lowPriority.forEach((s) => this.loadScript(s.src, 'low'))
          })
        } else {
          setTimeout(() => {
            lowPriority.forEach((s) => this.loadScript(s.src, 'low'))
          }, 1000)
        }
      })
    }
  }

  // Network-aware loading
  class NetworkAwareLoader {
    private connection: any = null
    private isSlowConnection = false

    constructor() {
      this.init()
    }

    private init() {
      // @ts-ignore - Navigator.connection is experimental
      this.connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

      if (this.connection) {
        this.checkConnection()
        this.connection.addEventListener('change', () => this.checkConnection())
      }
    }

    private checkConnection() {
      if (!this.connection) return

      const { effectiveType, saveData } = this.connection
      
      // Detect slow connection
      this.isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g' || saveData

      // Update body class for CSS targeting
      if (this.isSlowConnection) {
        document.body.classList.add('slow-connection')
        document.body.classList.add('data-saver')
      } else {
        document.body.classList.remove('slow-connection')
      }

      // Dispatch event for components to react
      window.dispatchEvent(new CustomEvent('network-change', {
        detail: {
          slow: this.isSlowConnection,
          effectiveType,
          saveData
        }
      }))
    }

    public isConnectionSlow(): boolean {
      return this.isSlowConnection
    }
  }

  // Initialize all loaders
  const imageLoader = new ProgressiveImageLoader()
  const cssOptimizer = new CSSOptimizer()
  const scriptLoader = new ScriptLoader()
  const networkLoader = new NetworkAwareLoader()

  // Provide to app
  nuxtApp.provide('progressiveLoader', {
    imageLoader,
    cssOptimizer,
    scriptLoader,
    networkLoader,
    loadingState
  })

  // Performance monitoring
  if (import.meta.client) {
    window.addEventListener('load', () => {
      // Mark when critical resources are loaded
      loadingState.critical = true

      // Log performance metrics
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing
        const loadTime = timing.loadEventEnd - timing.navigationStart
        const domReady = timing.domContentLoadedEventEnd - timing.navigationStart
        
        console.log('⚡ Performance Metrics:')
        console.log(`  DOM Ready: ${domReady}ms`)
        console.log(`  Full Load: ${loadTime}ms`)
        
        // Send to analytics if needed
        if (loadTime > 3000) {
          console.warn('⚠️  Page load time is slow. Consider optimization.')
        }
      }
    })
  }

  // Cleanup on app unmount
  nuxtApp.hook('app:unmounted', () => {
    imageLoader.disconnect()
  })
})

