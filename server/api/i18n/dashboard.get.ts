import { defineEventHandler } from 'h3'
import { getTranslationManager } from '../../utils/enhancedTranslationManager'

/**
 * GET /api/i18n/dashboard
 * Get comprehensive translation dashboard data
 * Shows stats, pending items, failed items, and system status
 */
export default defineEventHandler(async (event) => {
  try {
    const manager = getTranslationManager()
    
    // Get stats
    const stats = manager.getStats()
    
    // Get pending pages
    const pendingPages = manager.getPendingPages()
    
    // Get failed pages
    const failedPages = manager.getFailedPages()
    
    // Check API configuration
    const hasApiKey = Boolean(
      process.env.CHATGPT_API_KEYS || 
      process.env.OPENAI_API_KEYS || 
      process.env.OPENAI_API_KEY
    )
    
    // Check scheduler status
    const schedulerEnabled = String(process.env.NUXT_ENABLE_SCHEDULER || 'true').toLowerCase() !== 'false'
    const isDev = process.env.NODE_ENV === 'development' || process.env.NUXT_DEV === 'true'
    const devCronEnabled = process.env.ENABLE_DEV_CRON === 'true'
    
    return {
      success: true,
      stats: {
        ...stats,
        lastScanFormatted: stats.lastScan ? new Date(stats.lastScan).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 'Never',
        lastTranslationFormatted: stats.lastTranslation ? new Date(stats.lastTranslation).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) : 'Never'
      },
      pendingPages: pendingPages.slice(0, 20), // Limit to 20 for dashboard
      failedPages,
      system: {
        hasApiKey,
        schedulerEnabled: schedulerEnabled && (!isDev || devCronEnabled),
        environment: isDev ? 'development' : 'production',
        devCronEnabled: isDev ? devCronEnabled : null
      },
      timestamp: Date.now()
    }
  } catch (error: any) {
    console.error('[dashboard] Error:', error)
    
    return {
      success: false,
      error: error?.message || 'Unknown error',
      stats: null,
      pendingPages: [],
      failedPages: [],
      system: null
    }
  }
})

