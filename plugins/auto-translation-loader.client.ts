/**
 * Enhanced Auto Translation Loader Plugin
 * 
 * Features:
 * - Ensures translations are loaded and ready on ALL pages
 * - Cache warming for faster language switching
 * - Retry logic for failed loads
 * - Background refresh for stale cache
 * - Automatic registration of pages for translation tracking
 */

export default defineNuxtPlugin(async (nuxtApp) => {
  const { $i18n } = nuxtApp
  const locale = $i18n.locale

  // Enhanced cache with retry tracking
  interface CacheEntry {
    messages: Record<string, any>
    timestamp: number
    loadAttempts: number
    lastError?: string
  }

  const messageCache = new Map<string, CacheEntry>()
  const CACHE_DURATION_ID = 24 * 60 * 60 * 1000 // 24 hours
  const CACHE_DURATION_EN = 30 * 60 * 1000 // 30 minutes
  const MAX_RETRY = 3
  const RETRY_DELAY = 1000 // 1 second

  /**
   * Enhanced preload with retry logic
   */
  async function preloadMessages(targetLocale: 'id' | 'en', retryCount = 0): Promise<Record<string, any>> {
    try {
      const cached = messageCache.get(targetLocale)
      const cacheDuration = targetLocale === 'id' ? CACHE_DURATION_ID : CACHE_DURATION_EN
      const now = Date.now()
      
      // Check if cache is still valid
      if (cached && (now - cached.timestamp) < cacheDuration) {
        console.log(`[AutoTranslation] ✅ Using cached messages for ${targetLocale} (age: ${Math.round((now - cached.timestamp) / 1000)}s)`)
        
        // Background refresh if cache is getting old (80% of duration)
        if ((now - cached.timestamp) > (cacheDuration * 0.8)) {
          console.log(`[AutoTranslation] 🔄 Cache aging, refreshing in background for ${targetLocale}`)
          setTimeout(() => {
            fetchFreshMessages(targetLocale).catch(() => {
              // Silent fail for background refresh
            })
          }, 100)
        }
        
        return cached.messages
      }

      // Fetch fresh messages
      return await fetchFreshMessages(targetLocale)
    } catch (error: any) {
      console.warn(`[AutoTranslation] ⚠️ Failed to load messages for ${targetLocale}:`, error?.message || error)
      
      // Retry logic
      if (retryCount < MAX_RETRY) {
        console.log(`[AutoTranslation] 🔄 Retrying (${retryCount + 1}/${MAX_RETRY}) for ${targetLocale}...`)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)))
        return preloadMessages(targetLocale, retryCount + 1)
      }
      
      // Return cached messages if available, even if stale
      const cached = messageCache.get(targetLocale)
      if (cached) {
        console.log(`[AutoTranslation] 📦 Using stale cache for ${targetLocale}`)
        return cached.messages
      }
      
      return {}
    }
  }

  /**
   * Fetch fresh messages from API
   */
  async function fetchFreshMessages(targetLocale: 'id' | 'en'): Promise<Record<string, any>> {
    console.log(`[AutoTranslation] 📡 Fetching fresh messages for ${targetLocale}`)
    
    const res = await $fetch<{ locale: string; messages: Record<string, any> }>(
      '/api/i18n/messages',
      { 
        query: { locale: targetLocale },
        headers: { 'Cache-Control': 'public, max-age=1800' },
        retry: 2,
        retryDelay: 500
      }
    )

    const messages = res?.messages || {}
    
    // Store in cache
    messageCache.set(targetLocale, {
      messages,
      timestamp: Date.now(),
      loadAttempts: 0
    })

    // Apply messages to i18n
    if ($i18n?.global?.setLocaleMessage) {
      $i18n.global.setLocaleMessage(targetLocale, messages)
    }

    console.log(`[AutoTranslation] ✅ Messages loaded for ${targetLocale} (${Object.keys(messages).length} keys)`)
    return messages
  }

  /**
   * Cache warming - preload both locales
   */
  async function warmCache() {
    console.log('[AutoTranslation] 🔥 Warming cache for both locales...')
    
    const currentLocale = (locale.value || 'id') as 'id' | 'en'
    const otherLocale = currentLocale === 'id' ? 'en' : 'id'
    
    try {
      // Load current locale first (priority)
      await preloadMessages(currentLocale)
      
      // Load other locale in background after a short delay
      setTimeout(async () => {
        try {
          await preloadMessages(otherLocale)
          console.log('[AutoTranslation] 🔥 Cache warming complete!')
        } catch (e) {
          console.log('[AutoTranslation] ⚠️ Background cache warming failed for', otherLocale)
        }
      }, 1500)
    } catch (e) {
      console.error('[AutoTranslation] ❌ Cache warming failed:', e)
    }
  }

  /**
   * Check translation status periodically
   */
  async function checkTranslationStatus() {
    try {
      const result = await $fetch<{ hasPending: boolean; canTranslate: boolean }>(
        '/api/i18n/check-status'
      )
      
      if (result.hasPending && result.canTranslate) {
        console.log('[AutoTranslation] 📝 Pending translations detected')
      }
    } catch {
      // Silent fail - not critical
    }
  }

  // Initialize plugin
  if (import.meta.client) {
    // Warm cache on app start
    await warmCache()
    
    // Watch for locale changes
    watch(locale, async (newLocale) => {
      if (newLocale === 'id' || newLocale === 'en') {
        console.log(`[AutoTranslation] 🌐 Locale changed to ${newLocale}`)
        await preloadMessages(newLocale)
      }
    })
    
    // Check translation status every 5 minutes
    setInterval(checkTranslationStatus, 5 * 60 * 1000)
    
    // Initial status check after 10 seconds
    setTimeout(checkTranslationStatus, 10000)
    
    // Periodic cache refresh (every 10 minutes)
    setInterval(() => {
      const currentLocale = (locale.value || 'id') as 'id' | 'en'
      console.log('[AutoTranslation] 🔄 Periodic cache refresh...')
      fetchFreshMessages(currentLocale).catch(() => {
        // Silent fail - will use cached version
      })
    }, 10 * 60 * 1000)
  }

  // Provide helper functions to components
  return {
    provide: {
      preloadMessages,
      warmCache,
      messageCache,
      fetchFreshMessages
    }
  }
})

