// composables/useLazyImage.ts
// Advanced Lazy Loading for Images with Intersection Observer

import { ref, onMounted, onBeforeUnmount } from 'vue'

export const useLazyImage = () => {
  const imageObserver = ref<IntersectionObserver | null>(null)

  // Initialize Intersection Observer
  const initLazyLoad = (options = {}) => {
    if (typeof window === 'undefined') return

    const defaultOptions = {
      root: null,
      rootMargin: '50px', // Start loading 50px before entering viewport
      threshold: 0.01,
      ...options
    }

    imageObserver.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          
          // Load image
          if (img.dataset.src) {
            const src = img.dataset.src
            const tempImg = new Image()
            
            // Add loading state
            img.classList.add('lazy-loading')
            
            tempImg.onload = () => {
              img.src = src
              img.classList.remove('lazy-loading')
              img.classList.add('lazy-loaded')
              
              // Unobserve after loading
              if (imageObserver.value) {
                imageObserver.value.unobserve(img)
              }
            }
            
            tempImg.onerror = () => {
              img.classList.remove('lazy-loading')
              img.classList.add('lazy-error')
              console.error('Failed to load image:', src)
            }
            
            tempImg.src = src
          }
        }
      })
    }, defaultOptions)

    // Observe all lazy images
    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => {
      if (imageObserver.value) {
        imageObserver.value.observe(img)
      }
    })
  }

  // Observe a specific element
  const observeImage = (element: HTMLElement) => {
    if (imageObserver.value) {
      imageObserver.value.observe(element)
    }
  }

  // Unobserve an element
  const unobserveImage = (element: HTMLElement) => {
    if (imageObserver.value) {
      imageObserver.value.unobserve(element)
    }
  }

  // Disconnect observer
  const disconnectObserver = () => {
    if (imageObserver.value) {
      imageObserver.value.disconnect()
      imageObserver.value = null
    }
  }

  // Preload critical images (for above-the-fold content)
  const preloadImages = (imageUrls: string[]) => {
    if (typeof window === 'undefined') return

    imageUrls.forEach(url => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = url
      document.head.appendChild(link)
    })
  }

  // Use native lazy loading as fallback
  const enableNativeLazyLoad = () => {
    if (typeof window === 'undefined') return
    
    const images = document.querySelectorAll('img[data-src]')
    images.forEach(img => {
      const imgElement = img as HTMLImageElement
      if ('loading' in imgElement) {
        imgElement.loading = 'lazy'
        imgElement.src = imgElement.dataset.src || ''
      }
    })
  }

  // Check if browser supports native lazy loading
  const supportsNativeLazyLoad = () => {
    if (typeof window === 'undefined') return false
    return 'loading' in HTMLImageElement.prototype
  }

  onMounted(() => {
    // Use native lazy loading if supported, otherwise use Intersection Observer
    if (supportsNativeLazyLoad()) {
      enableNativeLazyLoad()
    } else {
      initLazyLoad()
    }
  })

  onBeforeUnmount(() => {
    disconnectObserver()
  })

  return {
    initLazyLoad,
    observeImage,
    unobserveImage,
    disconnectObserver,
    preloadImages,
    enableNativeLazyLoad,
    supportsNativeLazyLoad
  }
}

