/**
 * 🚀 SUPER VERSION CHECKER SYSTEM
 * 
 * Fitur:
 * - Auto-detect pembaruan dengan polling
 * - Cache busting otomatis
 * - Build ID comparison
 * - Force reload dengan clear cache
 * - Event emitter untuk update notification
 */

import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRuntimeConfig } from '#app'
import updateSystemConfig from '../config/update-system.config'

export interface VersionInfo {
  buildId: string
  timestamp: number
  version: string
}

export const useVersionCheck = () => {
  const runtimeConfig = useRuntimeConfig()
  const currentBuildId = ref<string>('')
  const latestBuildId = ref<string>('')
  const hasUpdate = ref(false)
  const isChecking = ref(false)
  const checkInterval = ref<NodeJS.Timeout | null>(null)
  
  // Get config
  const CHECK_INTERVAL = updateSystemConfig.checkInterval
  const INITIAL_DELAY = updateSystemConfig.initialDelay
  const DEBUG = updateSystemConfig.debug
  
  /**
   * Get current build ID from runtime config
   */
  const getCurrentBuildId = (): string => {
    const buildId = runtimeConfig.public.buildId as string
    return buildId || String(Date.now())
  }
  
  /**
   * Fetch latest build ID from server
   * Cache busting dengan timestamp
   */
  const fetchLatestBuildId = async (): Promise<string | null> => {
    try {
      // Cache busting dengan timestamp
      const timestamp = Date.now()
      const response = await fetch(`/api/version?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (!response.ok) {
        console.warn('⚠️ Failed to fetch version info')
        return null
      }
      
      const data = await response.json()
      return data.buildId || null
    } catch (error) {
      console.error('❌ Error fetching version:', error)
      return null
    }
  }
  
  /**
   * Check for updates
   */
  const checkForUpdates = async (): Promise<boolean> => {
    if (isChecking.value) return false
    
    isChecking.value = true
    
    try {
      const latest = await fetchLatestBuildId()
      
      if (!latest) {
        isChecking.value = false
        return false
      }
      
      latestBuildId.value = latest
      
      // Compare build IDs
      if (latest !== currentBuildId.value) {
        console.log('🎉 New version detected!')
        console.log('Current:', currentBuildId.value)
        console.log('Latest:', latest)
        hasUpdate.value = true
        return true
      }
      
      return false
    } catch (error) {
      console.error('❌ Error checking updates:', error)
      return false
    } finally {
      isChecking.value = false
    }
  }
  
  /**
   * Force reload dengan smart cache clearing
   */
  const forceReload = async () => {
    if (typeof window === 'undefined') return

    console.log('🔄 Force reloading with SMART cache clear...')

    // Use smart update system if available
    if ((window as any).jpSmartUpdateSystem) {
      try {
        await (window as any).jpSmartUpdateSystem.clearAllCaches()
        console.log('✅ Smart cache clearing completed')
      } catch (e) {
        console.warn('Smart cache clear failed, using fallback:', e)
      }
    }

    // Fallback: Manual cache clearing
    // 1) Clear Cache Storage (semua cache browser)
    if ('caches' in window) {
      try {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name).catch(() => {})
          })
        }).catch(() => {})
      } catch (e) {
        console.warn('CacheStorage clear failed', e)
      }
    }

    // 2) Clear Service Worker caches via message
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_ALL_CACHES'
        })
      } catch (e) {
        console.warn('ServiceWorker message failed', e)
      }
    }

    // 3) Unregister semua Service Worker (optional - akan re-register otomatis)
    if ('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.getRegistrations()
          .then(regs => {
            regs.forEach(reg => {
              reg.unregister().catch(() => {})
            })
          })
          .catch(() => {})
      } catch (e) {
        console.warn('ServiceWorker unregister failed', e)
      }
    }

    // 4) Clear localStorage & sessionStorage yang berhubungan cache / versi
    // TAPI JANGAN HAPUS tracking popup (biar tetap max 3x)
    try {
      const lsKeys = Object.keys(localStorage)
      lsKeys.forEach(key => {
        if (
          (key.includes('cache') ||
          key.includes('version') ||
          key.includes('build') ||
          key.startsWith('nuxt-')) &&
          !key.includes('popup') // Keep popup tracking
        ) {
          localStorage.removeItem(key)
        }
      })
    } catch (e) {
      console.warn('Could not clear localStorage', e)
    }

    try {
      const ssKeys = Object.keys(sessionStorage)
      ssKeys.forEach(key => {
        if (
          (key.includes('cache') ||
          key.includes('version') ||
          key.includes('build') ||
          key.startsWith('nuxt-')) &&
          !key.includes('popup') // Keep popup tracking
        ) {
          sessionStorage.removeItem(key)
        }
      })
    } catch (e) {
      console.warn('Could not clear sessionStorage', e)
    }

    // 5) Hapus database IndexedDB yang berhubungan dengan cache (best effort)
    try {
      if ('indexedDB' in window) {
        try { indexedDB.deleteDatabase('nuxt-cache') } catch {}
        try { indexedDB.deleteDatabase('jp-cache') } catch {}
      }
    } catch (e) {
      console.warn('IndexedDB clear failed', e)
    }

    // 6) Reload dengan cache-busting query agar benar‑benar tidak ambil data lama
    setTimeout(() => {
      try {
        const url = new URL(window.location.href)
        url.searchParams.set('_force_reload', Date.now().toString())
        url.searchParams.set('_cache_bust', Math.random().toString(36).slice(2, 10))
        window.location.replace(url.toString())
      } catch {
        window.location.reload()
      }
    }, 150)
  }
  
  /**
   * Start periodic checking
   */
  const startChecking = () => {
    if (typeof window === 'undefined') return
    
    // Check if enabled
    if (!updateSystemConfig.enabled) {
      if (DEBUG) console.log('⚠️ Update system disabled (check config)')
      return
    }
    
    if (DEBUG) {
      console.log(`⏳ Version checker will start in ${INITIAL_DELAY/1000}s (after loading complete)`)
    }
    
    // Initial check after delay
    setTimeout(() => {
      if (DEBUG) console.log('🔍 Starting initial version check...')
      checkForUpdates()
    }, INITIAL_DELAY)
    
    // Periodic checks - start after initial delay + check interval
    setTimeout(() => {
      checkInterval.value = setInterval(() => {
        checkForUpdates()
      }, CHECK_INTERVAL)
      
      if (DEBUG) {
        console.log(`✅ Version checker started (interval: ${CHECK_INTERVAL}ms)`)
      }
    }, INITIAL_DELAY + CHECK_INTERVAL)
  }
  
  /**
   * Stop periodic checking
   */
  const stopChecking = () => {
    if (checkInterval.value) {
      clearInterval(checkInterval.value)
      checkInterval.value = null
      console.log('🛑 Version checker stopped')
    }
  }
  
  /**
   * Reset update flag
   */
  const resetUpdate = () => {
    hasUpdate.value = false
  }
  
  // Initialize on mount
  onMounted(() => {
    currentBuildId.value = getCurrentBuildId()
    
    if (DEBUG) {
      console.log('📦 Current build ID:', currentBuildId.value)
    }
    
    // Start checking
    startChecking()
  })
  
  // Cleanup on unmount
  onBeforeUnmount(() => {
    stopChecking()
  })
  
  return {
    currentBuildId,
    latestBuildId,
    hasUpdate,
    isChecking,
    checkForUpdates,
    forceReload,
    startChecking,
    stopChecking,
    resetUpdate
  }
}

