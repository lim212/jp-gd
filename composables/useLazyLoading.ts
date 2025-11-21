import { ref, onMounted, onBeforeUnmount, watch, readonly, type Ref } from 'vue'

interface LazyLoadingOptions {
  rootMargin?: string
  threshold?: number | number[]
  once?: boolean
  delay?: number
  priority?: 'high' | 'medium' | 'low'
}

interface LazyLoadingReturn {
  isVisible: Ref<boolean>
  isLoaded: Ref<boolean>
  elementRef: Ref<HTMLElement | null>
  observe: () => void
  unobserve: () => void
}

/**
 * Advanced lazy loading composable with performance optimizations
 */
export function useLazyLoading(options: LazyLoadingOptions = {}): LazyLoadingReturn {
  const {
    rootMargin = '0px 0px 200px 0px',
    threshold = [0, 0.1, 0.25, 0.5],
    once = true,
    delay = 0,
    priority = 'medium'
  } = options

  const isVisible = ref(false)
  const isLoaded = ref(false)
  const elementRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null
  let loadTimeout: NodeJS.Timeout | null = null

  // High priority elements load immediately
  if (priority === 'high') {
    isVisible.value = true
    isLoaded.value = true
  }

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        if (delay > 0) {
          loadTimeout = setTimeout(() => {
            isVisible.value = true
            if (once && observer && elementRef.value) {
              observer.unobserve(elementRef.value)
              observer.disconnect()
              observer = null
            }
          }, delay)
        } else {
          isVisible.value = true
          if (once && observer && elementRef.value) {
            observer.unobserve(elementRef.value)
            observer.disconnect()
            observer = null
          }
        }
      }
    }
  }

  const observe = () => {
    if (priority === 'high' || !elementRef.value) return

    if (typeof window === 'undefined' || typeof (window as any).IntersectionObserver === 'undefined') {
      isVisible.value = true
      isLoaded.value = true
      return
    }

    observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin,
      threshold
    })

    observer.observe(elementRef.value)
  }

  const unobserve = () => {
    if (observer && elementRef.value) {
      observer.unobserve(elementRef.value)
      observer.disconnect()
      observer = null
    }
    if (loadTimeout) {
      clearTimeout(loadTimeout)
      loadTimeout = null
    }
  }

  // Watch for visibility changes to trigger loading
  const stopWatcher = watch(isVisible, (newValue) => {
    if (newValue && !isLoaded.value) {
      requestAnimationFrame(() => {
        isLoaded.value = true
      })
    }
  })

  onMounted(() => {
    if (priority !== 'high') {
      observe()
    }
  })

  onBeforeUnmount(() => {
    unobserve()
    stopWatcher()
  })

  return {
    isVisible,
    isLoaded,
    elementRef,
    observe,
    unobserve
  }
}

/**
 * Lazy loading for images with advanced features
 */
export function useLazyImage(options: LazyLoadingOptions & {
  src: string
  placeholder?: string
  errorFallback?: string
} = { src: '' }) {
  const { isVisible, isLoaded, elementRef, observe, unobserve } = useLazyLoading(options)
  const hasError = ref(false)
  const imageLoaded = ref(false)

  const handleImageLoad = () => {
    imageLoaded.value = true
    hasError.value = false
  }

  const handleImageError = () => {
    hasError.value = true
    imageLoaded.value = false
  }

  return {
    isVisible,
    isLoaded,
    hasError,
    imageLoaded,
    elementRef,
    observe,
    unobserve,
    handleImageLoad,
    handleImageError
  }
}

/**
 * Lazy loading for components with preloading
 */
export function useLazyComponent(options: LazyLoadingOptions & {
  component: () => Promise<any>
  preload?: boolean
} = { component: async () => null }) {
  const { isVisible, isLoaded, elementRef, observe, unobserve } = useLazyLoading(options)
  const component = ref(null)
  const isLoading = ref(false)
  const hasError = ref(false)

  const loadComponent = async () => {
    if (component.value || isLoading.value) return

    isLoading.value = true
    hasError.value = false

    try {
      const loadedComponent = await options.component()
      component.value = loadedComponent
    } catch (error) {
      console.error('Failed to load component:', error)
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  // Watch for visibility to load component
  watch(isVisible, (newValue) => {
    if (newValue) {
      loadComponent()
    }
  })

  // Preload if requested
  if (options.preload) {
    loadComponent()
  }

  return {
    isVisible,
    isLoaded,
    component,
    isLoading,
    hasError,
    elementRef,
    observe,
    unobserve,
    loadComponent
  }
}

/**
 * Batch lazy loading for multiple elements
 */
export function useBatchLazyLoading(
  elements: Ref<HTMLElement[]>,
  options: LazyLoadingOptions = {}
) {
  const visibleElements = ref<Set<number>>(new Set())
  const loadedElements = ref<Set<number>>(new Set())
  let observer: IntersectionObserver | null = null

  const handleBatchIntersection = (entries: IntersectionObserverEntry[]) => {
    for (const entry of entries) {
      const index = elements.value.indexOf(entry.target as HTMLElement)
      if (index === -1) continue

      if (entry.isIntersecting) {
        visibleElements.value.add(index)
        
        if (options.delay && options.delay > 0) {
          setTimeout(() => {
            loadedElements.value.add(index)
          }, options.delay)
        } else {
          loadedElements.value.add(index)
        }

        if (options.once && observer) {
          observer.unobserve(entry.target)
        }
      }
    }
  }

  const observe = () => {
    if (typeof window === 'undefined' || typeof (window as any).IntersectionObserver === 'undefined') {
      // Mark all as visible if IntersectionObserver is not available
      elements.value.forEach((_, index) => {
        visibleElements.value.add(index)
        loadedElements.value.add(index)
      })
      return
    }

    observer = new IntersectionObserver(handleBatchIntersection, {
      root: null,
      rootMargin: options.rootMargin || '0px 0px 200px 0px',
      threshold: options.threshold || [0, 0.1, 0.25, 0.5]
    })

    elements.value.forEach(element => {
      if (element) observer?.observe(element)
    })
  }

  const unobserve = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    observe()
  })

  onBeforeUnmount(() => {
    unobserve()
  })

  return {
    visibleElements,
    loadedElements,
    observe,
    unobserve
  }
}

/**
 * Performance monitoring for lazy loading
 */
export function useLazyLoadingPerformance() {
  const metrics = ref({
    totalElements: 0,
    loadedElements: 0,
    loadTime: 0,
    averageLoadTime: 0
  })

  const startTime = ref(0)
  const loadTimes = ref<number[]>([])

  const startLoading = () => {
    startTime.value = performance.now()
  }

  const endLoading = () => {
    if (startTime.value > 0) {
      const loadTime = performance.now() - startTime.value
      loadTimes.value.push(loadTime)
      metrics.value.loadTime = loadTime
      metrics.value.loadedElements++
      metrics.value.averageLoadTime = loadTimes.value.reduce((a, b) => a + b, 0) / loadTimes.value.length
    }
  }

  const resetMetrics = () => {
    metrics.value = {
      totalElements: 0,
      loadedElements: 0,
      loadTime: 0,
      averageLoadTime: 0
    }
    loadTimes.value = []
    startTime.value = 0
  }

  return {
    metrics: readonly(metrics),
    startLoading,
    endLoading,
    resetMetrics
  }
}
