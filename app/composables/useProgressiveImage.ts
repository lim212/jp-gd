// Composable for progressive image loading
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

export interface ProgressiveImageOptions {
  src: string
  placeholderSrc?: string
  rootMargin?: string
  threshold?: number
  priority?: boolean
}

export function useProgressiveImage(options: ProgressiveImageOptions) {
  const {
    src,
    placeholderSrc,
    rootMargin = '100px',
    threshold = 0.01,
    priority = false
  } = options

  const container = ref<HTMLElement | null>(null)
  const currentSrc = ref(placeholderSrc || generatePlaceholder())
  const isLoading = ref(true)
  const isLoaded = ref(false)
  const hasError = ref(false)
  let observer: IntersectionObserver | null = null

  // Generate tiny placeholder data URL
  function generatePlaceholder(): string {
    if (typeof document === 'undefined') return ''
    
    const canvas = document.createElement('canvas')
    canvas.width = 10
    canvas.height = 10
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, 10, 10)
    }
    return canvas.toDataURL()
  }

  // Load the actual image
  async function loadImage() {
    if (hasError.value || isLoaded.value) return

    try {
      const img = new Image()
      
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = src
      })

      // Image loaded successfully
      currentSrc.value = src
      isLoaded.value = true
      isLoading.value = false
    } catch (error) {
      console.warn('Failed to load image:', src, error)
      hasError.value = true
      isLoading.value = false
    }
  }

  onMounted(() => {
    if (typeof window === 'undefined') return

    // Priority images load immediately
    if (priority) {
      loadImage()
      return
    }

    // Lazy load with IntersectionObserver
    if (!container.value) {
      loadImage()
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage()
            if (observer && container.value) {
              observer.unobserve(container.value)
            }
          }
        })
      },
      {
        rootMargin,
        threshold
      }
    )

    observer.observe(container.value)
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })

  return {
    container,
    currentSrc,
    isLoading,
    isLoaded,
    hasError,
    loadImage
  }
}

// Network-aware image loading
export function useNetworkAwareImage(src: string) {
  const shouldLoadHighQuality = ref(true)
  const effectiveType = ref('4g')

  if (import.meta.client) {
    try {
      // @ts-ignore - Navigator.connection is experimental
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection

      if (connection) {
        effectiveType.value = connection.effectiveType || '4g'
        shouldLoadHighQuality.value = !['slow-2g', '2g'].includes(connection.effectiveType)
        
        connection.addEventListener('change', () => {
          effectiveType.value = connection.effectiveType || '4g'
          shouldLoadHighQuality.value = !['slow-2g', '2g'].includes(connection.effectiveType)
        })
      }
    } catch (error) {
      console.warn('Network Information API not supported')
    }
  }

  const optimizedSrc = computed(() => {
    if (!shouldLoadHighQuality.value) {
      // Return lower quality version for slow connections
      return src.replace(/\.(jpg|jpeg|png|webp)$/i, '-low.$1')
    }
    return src
  })

  return {
    optimizedSrc,
    shouldLoadHighQuality,
    effectiveType
  }
}

