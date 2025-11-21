// composables/useConnectionQuality.ts
import { ref, computed, onMounted } from 'vue'

export interface ConnectionInfo {
  type: string
  effectiveType: string
  downlink: number
  rtt: number
  saveData: boolean
}

export interface ConnectionQuality {
  quality: 'fast' | 'medium' | 'slow' | 'very-slow' | 'unknown'
  timeout: number
  message: string
  emoji: string
  info: ConnectionInfo | null
  shouldOptimize: boolean
  maxResources: number
}

export const useConnectionQuality = () => {
  const connectionQuality = ref<ConnectionQuality>({
    quality: 'unknown',
    timeout: 5000,
    message: 'Checking connection...',
    emoji: '📡',
    info: null,
    shouldOptimize: false,
    maxResources: 100
  })

  const isOnline = ref(true)
  const connectionType = ref<string>('unknown')

  const detectConnectionQuality = (): ConnectionQuality => {
    // Check if online
    if (typeof navigator !== 'undefined') {
      isOnline.value = navigator.onLine

      if (!isOnline.value) {
        return {
          quality: 'very-slow',
          timeout: 10000,
          message: 'Offline - Menggunakan cache',
          emoji: '📴',
          info: null,
          shouldOptimize: true,
          maxResources: 10
        }
      }

      // Check connection API
      if ('connection' in navigator || 'mozConnection' in navigator || 'webkitConnection' in navigator) {
        const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

        if (conn) {
          const info: ConnectionInfo = {
            type: conn.type || 'unknown',
            effectiveType: conn.effectiveType || 'unknown',
            downlink: conn.downlink || 0,
            rtt: conn.rtt || 0,
            saveData: conn.saveData || false
          }

          connectionType.value = info.effectiveType

          // Very Fast (5G, Fast 4G)
          if (info.effectiveType === '4g' && info.downlink > 10) {
            return {
              quality: 'fast',
              timeout: 3000,
              message: '⚡ Koneksi Super Cepat - Loading optimal',
              emoji: '⚡',
              info,
              shouldOptimize: false,
              maxResources: 200
            }
          }
          
          // Fast (4G)
          if (info.effectiveType === '4g' || info.downlink > 5) {
            return {
              quality: 'fast',
              timeout: 4000,
              message: '📶 Koneksi Cepat - Loading lancar',
              emoji: '📶',
              info,
              shouldOptimize: false,
              maxResources: 150
            }
          }

          // Medium (3G)
          if (info.effectiveType === '3g' || info.downlink > 1) {
            return {
              quality: 'medium',
              timeout: 6000,
              message: '📱 Koneksi Normal - Mohon tunggu',
              emoji: '📱',
              info,
              shouldOptimize: true,
              maxResources: 80
            }
          }

          // Slow (2G)
          if (info.effectiveType === '2g' || info.downlink > 0.5) {
            return {
              quality: 'slow',
              timeout: 8000,
              message: '🐢 Koneksi Lambat - Mengoptimalkan...',
              emoji: '🐢',
              info,
              shouldOptimize: true,
              maxResources: 40
            }
          }

          // Very Slow (slow-2g or very poor)
          if (info.effectiveType === 'slow-2g' || info.downlink < 0.5) {
            return {
              quality: 'very-slow',
              timeout: 10000,
              message: '🐌 Koneksi Sangat Lambat - Mode hemat aktif',
              emoji: '🐌',
              info,
              shouldOptimize: true,
              maxResources: 20
            }
          }

          // Save Data mode
          if (info.saveData) {
            return {
              quality: 'slow',
              timeout: 8000,
              message: '💾 Mode Hemat Data - Optimalisasi aktif',
              emoji: '💾',
              info,
              shouldOptimize: true,
              maxResources: 30
            }
          }
        }
      }

      // Fallback: Estimate based on user agent (mobile vs desktop)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        return {
          quality: 'medium',
          timeout: 6000,
          message: '📱 Mobile Device - Optimized loading',
          emoji: '📱',
          info: null,
          shouldOptimize: true,
          maxResources: 60
        }
      }
    }

    // Default fallback
    return {
      quality: 'medium',
      timeout: 5000,
      message: '📡 Loading...',
      emoji: '📡',
      info: null,
      shouldOptimize: false,
      maxResources: 100
    }
  }

  const updateConnectionQuality = () => {
    connectionQuality.value = detectConnectionQuality()
    console.log('🌐 Connection Quality Detected:', {
      quality: connectionQuality.value.quality,
      timeout: connectionQuality.value.timeout,
      message: connectionQuality.value.message,
      shouldOptimize: connectionQuality.value.shouldOptimize,
      info: connectionQuality.value.info
    })
  }

  // Monitor online/offline changes
  const setupConnectionMonitoring = () => {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('✅ Connection restored')
        isOnline.value = true
        updateConnectionQuality()
      })

      window.addEventListener('offline', () => {
        console.log('❌ Connection lost')
        isOnline.value = false
        updateConnectionQuality()
      })

      // Monitor connection changes
      if ('connection' in navigator) {
        const conn = (navigator as any).connection
        if (conn) {
          conn.addEventListener('change', () => {
            console.log('🔄 Connection changed')
            updateConnectionQuality()
          })
        }
      }
    }
  }

  // Adaptive loading strategy based on connection
  const getLoadingStrategy = computed(() => {
    const quality = connectionQuality.value.quality

    return {
      // Should load images immediately?
      loadImagesImmediately: quality === 'fast',
      
      // Should use lazy loading?
      useLazyLoading: quality !== 'fast',
      
      // Image quality to use
      imageQuality: quality === 'fast' ? 'high' : quality === 'medium' ? 'medium' : 'low',
      
      // Number of concurrent requests
      maxConcurrentRequests: quality === 'fast' ? 6 : quality === 'medium' ? 3 : 1,
      
      // Should preload resources?
      shouldPreload: quality === 'fast',
      
      // Should use webp format?
      useWebP: quality !== 'very-slow',
      
      // Animation complexity
      animationLevel: quality === 'fast' ? 'full' : quality === 'medium' ? 'reduced' : 'minimal'
    }
  })

  onMounted(() => {
    updateConnectionQuality()
    setupConnectionMonitoring()
  })

  return {
    connectionQuality,
    isOnline,
    connectionType,
    detectConnectionQuality,
    updateConnectionQuality,
    getLoadingStrategy
  }
}

