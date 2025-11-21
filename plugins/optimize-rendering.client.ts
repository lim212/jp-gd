/**
 * Optimize Rendering Plugin
 * 
 * Mengoptimalkan rendering untuk performa maksimal
 * tanpa mengubah design atau fungsi
 */

export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  // Enable hardware acceleration untuk animations
  const enableHardwareAcceleration = () => {
    const style = document.createElement('style')
    style.textContent = `
      * {
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
      }
      
      img, video {
        transform: translateZ(0);
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }
    `
    document.head.appendChild(style)
  }

  // Optimize scroll performance
  const optimizeScroll = () => {
    let ticking = false
    let lastScrollY = window.scrollY

    const updateScroll = () => {
      lastScrollY = window.scrollY
      ticking = false
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll)
        ticking = true
      }
    }, { passive: true })
  }

  // Reduce layout shifts
  const reduceLayoutShifts = () => {
    // Add explicit dimensions to images without them
    const images = document.querySelectorAll('img:not([width]):not([height])')
    
    images.forEach((img: any) => {
      if (img.naturalWidth && img.naturalHeight) {
        const aspectRatio = img.naturalHeight / img.naturalWidth
        img.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`
      }
    })
  }

  // Optimize animations based on device capability
  const optimizeAnimations = () => {
    // Detect if device is low-end
    const isLowEndDevice = () => {
      // Check navigator.deviceMemory (if available)
      if ('deviceMemory' in navigator) {
        // @ts-ignore
        return navigator.deviceMemory < 4 // Less than 4GB RAM
      }
      
      // Check navigator.hardwareConcurrency
      if ('hardwareConcurrency' in navigator) {
        return navigator.hardwareConcurrency < 4 // Less than 4 cores
      }
      
      return false
    }

    if (isLowEndDevice()) {
      // Reduce animation complexity on low-end devices
      const style = document.createElement('style')
      style.textContent = `
        * {
          animation-duration: 0.1s !important;
          transition-duration: 0.1s !important;
        }
      `
      document.head.appendChild(style)
      console.log('Animations optimized for low-end device')
    }
  }

  // Optimize web fonts loading
  const optimizeFonts = () => {
    if ('fonts' in document) {
      // Use font-display: swap for better performance
      const style = document.createElement('style')
      style.textContent = `
        @font-face {
          font-display: swap;
        }
      `
      document.head.appendChild(style)
    }
  }

  // Preload critical resources
  const preloadCritical = () => {
    const criticalResources = [
      { href: '/favicon.ico', as: 'image', type: 'image/x-icon' }
    ]

    criticalResources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      link.as = resource.as
      if (resource.type) link.type = resource.type
      document.head.appendChild(link)
    })
  }

  // Execute optimizations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      enableHardwareAcceleration()
      optimizeScroll()
      reduceLayoutShifts()
      optimizeAnimations()
      optimizeFonts()
      preloadCritical()
    })
  } else {
    enableHardwareAcceleration()
    optimizeScroll()
    reduceLayoutShifts()
    optimizeAnimations()
    optimizeFonts()
    preloadCritical()
  }

  // Monitor performance
  if ('PerformanceObserver' in window) {
    try {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        console.log('LCP:', Math.round(lastEntry.renderTime || lastEntry.loadTime), 'ms')
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          console.log('FID:', Math.round(entry.processingStart - entry.startTime), 'ms')
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Monitor Cumulative Layout Shift (CLS)
      let clsScore = 0
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsScore += (entry as any).value
          }
        }
        console.log('CLS Score:', clsScore.toFixed(4))
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('Performance monitoring not fully supported')
    }
  }
})

