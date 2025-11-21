/**
 * Optimized Lazy Load Composable
 * 
 * Composable untuk lazy loading komponen dengan optimasi performance
 * Tidak mengubah design atau fungsi, hanya mempercepat loading
 */

import { 
  defineAsyncComponent, 
  ref, 
  computed, 
  onMounted, 
  onBeforeUnmount,
  getCurrentInstance,
  type Component 
} from 'vue'

interface LazyLoadOptions {
  /**
   * Delay sebelum loading component (ms)
   * Default: 200ms
   */
  delay?: number
  
  /**
   * Timeout untuk loading component (ms)
   * Default: 3000ms
   */
  timeout?: number
  
  /**
   * Component yang ditampilkan saat loading
   */
  loadingComponent?: Component
  
  /**
   * Component yang ditampilkan saat error
   */
  errorComponent?: Component
  
  /**
   * Suspensible mode
   */
  suspensible?: boolean
}

/**
 * Lazy load component dengan optimasi
 * 
 * @param loader Function yang return dynamic import
 * @param options Lazy load options
 * @returns Async component
 */
export function useOptimizedLazyLoad(
  loader: () => Promise<any>,
  options: LazyLoadOptions = {}
) {
  const {
    delay = 100,
    timeout = 5000,
    loadingComponent = null,
    errorComponent = null,
    suspensible = false
  } = options

  return defineAsyncComponent({
    loader,
    loadingComponent,
    errorComponent,
    delay,
    timeout,
    suspensible,
    // Optimize onError callback
    onError(error, retry, fail, attempts) {
      if (attempts <= 3) {
        // Retry dengan exponential backoff
        const delay = Math.min(1000 * Math.pow(2, attempts), 5000)
        setTimeout(retry, delay)
      } else {
        fail()
        console.error('Failed to load component after 3 retries:', error)
      }
    }
  })
}

/**
 * Lazy load komponen dengan intersection observer
 * Component hanya di-load ketika visible di viewport
 * 
 * @param loader Function yang return dynamic import
 * @param options Lazy load options
 * @returns Async component
 */
export function useLazyLoadOnVisible(
  loader: () => Promise<any>,
  options: LazyLoadOptions & {
    /**
     * Root margin untuk intersection observer
     * Default: '50px'
     */
    rootMargin?: string
    
    /**
     * Threshold untuk intersection observer
     * Default: 0.01
     */
    threshold?: number
  } = {}
) {
  const {
    rootMargin = '50px',
    threshold = 0.01,
    ...lazyOptions
  } = options

  const componentLoader = ref<(() => Promise<any>) | null>(null)
  const isVisible = ref(false)

  onMounted(() => {
    if (typeof window === 'undefined') {
      // SSR: load immediately
      componentLoader.value = loader
      return
    }

    // Setup intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible.value) {
            isVisible.value = true
            componentLoader.value = loader
            observer.disconnect()
          }
        })
      },
      {
        rootMargin,
        threshold
      }
    )

    // Observe element
    const element = getCurrentInstance()?.vnode.el
    if (element) {
      observer.observe(element as Element)
    }

    // Cleanup
    onBeforeUnmount(() => {
      observer.disconnect()
    })
  })

  return computed(() => {
    if (!componentLoader.value) return null
    return useOptimizedLazyLoad(componentLoader.value, lazyOptions)
  })
}

/**
 * Lazy load komponen dengan prioritas
 * High priority components load immediately
 * Low priority components load on idle
 * 
 * @param loader Function yang return dynamic import
 * @param priority Priority level: 'high' | 'medium' | 'low'
 * @param options Lazy load options
 * @returns Async component
 */
export function useLazyLoadWithPriority(
  loader: () => Promise<any>,
  priority: 'high' | 'medium' | 'low' = 'medium',
  options: LazyLoadOptions = {}
) {
  if (priority === 'high') {
    // High priority: load immediately
    return useOptimizedLazyLoad(loader, {
      ...options,
      delay: 0
    })
  }

  if (priority === 'medium') {
    // Medium priority: load with small delay
    return useOptimizedLazyLoad(loader, {
      ...options,
      delay: 200
    })
  }

  // Low priority: load on idle
  const componentLoader = ref<(() => Promise<any>) | null>(null)

  onMounted(() => {
    if (typeof window === 'undefined') {
      componentLoader.value = loader
      return
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        componentLoader.value = loader
      }, { timeout: 2000 })
    } else {
      setTimeout(() => {
        componentLoader.value = loader
      }, 1000)
    }
  })

  return computed(() => {
    if (!componentLoader.value) return null
    return useOptimizedLazyLoad(componentLoader.value, options)
  })
}

/**
 * Preload komponen untuk faster navigation
 * Component akan di-preload saat user hover/focus
 * 
 * @param loader Function yang return dynamic import
 * @returns Preload function
 */
export function useComponentPreload(loader: () => Promise<any>) {
  let preloadPromise: Promise<any> | null = null

  const preload = () => {
    if (!preloadPromise) {
      preloadPromise = loader()
    }
    return preloadPromise
  }

  const onMouseEnter = () => preload()
  const onFocus = () => preload()

  return {
    preload,
    onMouseEnter,
    onFocus
  }
}

