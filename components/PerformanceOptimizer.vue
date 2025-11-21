<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

interface Props {
  enablePreloading?: boolean
  enablePrefetching?: boolean
  enableResourceHints?: boolean
  maxConcurrentLoads?: number
  networkAware?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enablePreloading: true,
  enablePrefetching: true,
  enableResourceHints: true,
  maxConcurrentLoads: 3,
  networkAware: true
})

const networkInfo = ref({
  effectiveType: '4g',
  downlink: 10,
  rtt: 50,
  saveData: false
})

const loadingQueue = ref<Array<() => Promise<any>>>([])
const activeLoads = ref(0)
const isSlowNetwork = computed(() => 
  networkInfo.value.effectiveType === 'slow-2g' || 
  networkInfo.value.effectiveType === '2g' ||
  networkInfo.value.downlink < 1 ||
  networkInfo.value.saveData
)

// Network detection
const detectNetwork = () => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    networkInfo.value = {
      effectiveType: connection.effectiveType || '4g',
      downlink: connection.downlink || 10,
      rtt: connection.rtt || 50,
      saveData: connection.saveData || false
    }
  }
}

// Resource preloading
const preloadResource = (url: string, type: 'image' | 'script' | 'style' | 'font' = 'image') => {
  if (!props.enablePreloading || isSlowNetwork.value) return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  
  switch (type) {
    case 'image':
      link.as = 'image'
      break
    case 'script':
      link.as = 'script'
      break
    case 'style':
      link.as = 'style'
      break
    case 'font':
      link.as = 'font'
      link.crossOrigin = 'anonymous'
      break
  }
  
  document.head.appendChild(link)
}

// Resource prefetching
const prefetchResource = (url: string) => {
  if (!props.enablePrefetching || isSlowNetwork.value) return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  document.head.appendChild(link)
}

// Queue management for controlled loading
const addToQueue = (loader: () => Promise<any>) => {
  loadingQueue.value.push(loader)
  processQueue()
}

const processQueue = async () => {
  if (activeLoads.value >= props.maxConcurrentLoads || loadingQueue.value.length === 0) {
    return
  }

  const loader = loadingQueue.value.shift()
  if (!loader) return

  activeLoads.value++
  
  try {
    await loader()
  } catch (error) {
    console.warn('Resource loading failed:', error)
  } finally {
    activeLoads.value--
    processQueue()
  }
}

// Critical resource hints
const addResourceHints = () => {
  if (!props.enableResourceHints) return

  // DNS prefetch for external domains
  const domains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'cdn.jsdelivr.net',
    'blog.jasapembayaran.com'
  ]

  domains.forEach(domain => {
    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = `//${domain}`
    document.head.appendChild(link)
  })

  // Preconnect to critical origins
  const origins = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net'
  ]

  origins.forEach(origin => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = origin
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
}

// Image optimization based on network
const getOptimalImageSettings = () => {
  if (isSlowNetwork.value) {
    return {
      quality: 60,
      format: 'webp',
      sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    }
  }

  return {
    quality: 85,
    format: 'webp',
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
}

// Lazy loading configuration based on network
const getLazyLoadingConfig = () => {
  if (isSlowNetwork.value) {
    return {
      rootMargin: '0px 0px 100px 0px',
      threshold: [0.1],
      delay: 300
    }
  }

  return {
    rootMargin: '0px 0px 200px 0px',
    threshold: [0, 0.1, 0.25],
    delay: 0
  }
}

// Performance monitoring
const performanceMetrics = ref({
  loadTime: 0,
  renderTime: 0,
  resourceCount: 0,
  totalSize: 0
})

const startPerformanceMonitoring = () => {
  if (typeof performance === 'undefined') return

  const startTime = performance.now()
  
  window.addEventListener('load', () => {
    performanceMetrics.value.loadTime = performance.now() - startTime
    
    // Get resource timing
    const resources = performance.getEntriesByType('resource')
    performanceMetrics.value.resourceCount = resources.length
    performanceMetrics.value.totalSize = resources.reduce((total, resource) => {
      return total + (resource.transferSize || 0)
    }, 0)
  })
}

// Expose methods and state
defineExpose({
  networkInfo: readonly(networkInfo),
  isSlowNetwork,
  preloadResource,
  prefetchResource,
  addToQueue,
  getOptimalImageSettings,
  getLazyLoadingConfig,
  performanceMetrics: readonly(performanceMetrics)
})

onMounted(() => {
  detectNetwork()
  addResourceHints()
  startPerformanceMonitoring()
  
  // Listen for network changes
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    connection.addEventListener('change', detectNetwork)
  }
})

onBeforeUnmount(() => {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection
    connection.removeEventListener('change', detectNetwork)
  }
})
</script>

<template>
  <div class="performance-optimizer">
    <!-- This component doesn't render anything visible -->
    <!-- It only provides performance optimization utilities -->
  </div>
</template>

<style scoped>
.performance-optimizer {
  display: none;
}
</style>
