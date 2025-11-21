// composables/useResourceDetection.ts
import { ref, computed, onMounted } from 'vue'

export interface ResourceEntry {
  name: string
  type: 'css' | 'js' | 'image' | 'font' | 'other'
  size: number
  duration: number
  loaded: boolean
  url: string
}

export interface ResourceStats {
  total: number
  loaded: number
  failed: number
  progress: number
  byType: {
    css: { total: number; loaded: number }
    js: { total: number; loaded: number }
    image: { total: number; loaded: number }
    font: { total: number; loaded: number }
    other: { total: number; loaded: number }
  }
}

export const useResourceDetection = () => {
  const resources = ref<ResourceEntry[]>([])
  const resourceStats = ref<ResourceStats>({
    total: 0,
    loaded: 0,
    failed: 0,
    progress: 0,
    byType: {
      css: { total: 0, loaded: 0 },
      js: { total: 0, loaded: 0 },
      image: { total: 0, loaded: 0 },
      font: { total: 0, loaded: 0 },
      other: { total: 0, loaded: 0 }
    }
  })

  const isLoading = ref(true)
  const loadStartTime = ref(0)
  const loadEndTime = ref(0)

  // Detect resource type from URL
  const detectResourceType = (url: string): ResourceEntry['type'] => {
    if (/\.css$/i.test(url)) return 'css'
    if (/\.js$/i.test(url)) return 'js'
    if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(url)) return 'image'
    if (/\.(woff|woff2|ttf|eot|otf)$/i.test(url)) return 'font'
    return 'other'
  }

  // Get real resources using Performance API
  const getRealResources = (): ResourceEntry[] => {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      console.warn('Performance API not available')
      return []
    }

    const perfEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    
    return perfEntries.map(entry => {
      const type = detectResourceType(entry.name)
      
      return {
        name: entry.name.split('/').pop() || entry.name,
        type,
        size: entry.transferSize || entry.encodedBodySize || 0,
        duration: entry.duration,
        loaded: entry.responseEnd > 0,
        url: entry.name
      }
    })
  }

  // Calculate statistics
  const calculateStats = (resourceList: ResourceEntry[]): ResourceStats => {
    const stats: ResourceStats = {
      total: resourceList.length,
      loaded: 0,
      failed: 0,
      progress: 0,
      byType: {
        css: { total: 0, loaded: 0 },
        js: { total: 0, loaded: 0 },
        image: { total: 0, loaded: 0 },
        font: { total: 0, loaded: 0 },
        other: { total: 0, loaded: 0 }
      }
    }

    resourceList.forEach(resource => {
      // Count by type
      stats.byType[resource.type].total++
      
      if (resource.loaded) {
        stats.loaded++
        stats.byType[resource.type].loaded++
      }
    })

    // Calculate progress
    stats.progress = stats.total > 0 
      ? Math.round((stats.loaded / stats.total) * 100) 
      : 0

    return stats
  }

  // Update resources periodically
  const updateResources = () => {
    const detectedResources = getRealResources()
    resources.value = detectedResources
    resourceStats.value = calculateStats(detectedResources)

    console.log('📊 Resource Stats:', {
      total: resourceStats.value.total,
      loaded: resourceStats.value.loaded,
      progress: `${resourceStats.value.progress}%`,
      byType: resourceStats.value.byType
    })

    // Check if loading complete
    if (resourceStats.value.progress >= 100 && isLoading.value) {
      isLoading.value = false
      loadEndTime.value = performance.now()
      
      const totalLoadTime = loadEndTime.value - loadStartTime.value
      console.log(`✅ All resources loaded in ${(totalLoadTime / 1000).toFixed(2)}s`)
    }
  }

  // Monitor resource loading
  const startMonitoring = (interval: number = 500) => {
    loadStartTime.value = performance.now()
    
    // Initial check
    updateResources()

    // Periodic updates
    const monitorInterval = setInterval(() => {
      updateResources()

      // Stop monitoring when complete
      if (!isLoading.value) {
        clearInterval(monitorInterval)
      }
    }, interval)

    // Stop after maximum time (30 seconds)
    setTimeout(() => {
      clearInterval(monitorInterval)
      if (isLoading.value) {
        isLoading.value = false
        console.warn('⚠️ Resource monitoring stopped after timeout')
      }
    }, 30000)
  }

  // Get loading message based on current progress
  const getLoadingMessage = computed(() => {
    const progress = resourceStats.value.progress
    const stats = resourceStats.value.byType

    if (progress < 20) {
      return `Loading essential resources...`
    } else if (progress < 40) {
      return `Loading CSS (${stats.css.loaded}/${stats.css.total})...`
    } else if (progress < 60) {
      return `Loading JavaScript (${stats.js.loaded}/${stats.js.total})...`
    } else if (progress < 80) {
      return `Loading images (${stats.image.loaded}/${stats.image.total})...`
    } else if (progress < 95) {
      return `Almost done...`
    } else {
      return `Complete!`
    }
  })

  // Get current phase based on what's loading
  const getCurrentPhase = computed(() => {
    const stats = resourceStats.value.byType
    
    if (stats.css.loaded < stats.css.total) {
      return 'styling'
    } else if (stats.js.loaded < stats.js.total) {
      return 'scripts'
    } else if (stats.image.loaded < stats.image.total) {
      return 'media'
    } else if (stats.font.loaded < stats.font.total) {
      return 'fonts'
    } else {
      return 'complete'
    }
  })

  // Calculate loading speed
  const getLoadingSpeed = computed(() => {
    if (loadStartTime.value === 0) return '0 KB/s'
    
    const elapsed = (performance.now() - loadStartTime.value) / 1000
    if (elapsed === 0) return '0 KB/s'

    const totalSize = resources.value.reduce((sum, r) => sum + (r.loaded ? r.size : 0), 0)
    const speed = totalSize / elapsed

    if (speed > 1024 * 1024) {
      return `${(speed / (1024 * 1024)).toFixed(2)} MB/s`
    } else if (speed > 1024) {
      return `${(speed / 1024).toFixed(2)} KB/s`
    }
    return `${speed.toFixed(0)} B/s`
  })

  onMounted(() => {
    // Start monitoring after a brief delay
    setTimeout(() => {
      startMonitoring()
    }, 100)
  })

  return {
    resources,
    resourceStats,
    isLoading,
    getLoadingMessage,
    getCurrentPhase,
    getLoadingSpeed,
    updateResources,
    startMonitoring
  }
}

