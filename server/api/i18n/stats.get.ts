import { defineEventHandler } from 'h3'
import { getTranslationCacheManager } from '../../utils/i18nTranslationCache'

/**
 * GET /api/i18n/stats
 * Returns translation statistics
 */
export default defineEventHandler(async () => {
  try {
    const cacheManager = await getTranslationCacheManager()
    const stats = cacheManager.getStats()
    const pending = cacheManager.getPendingPages()

    return {
      success: true,
      stats: {
        ...stats,
        pendingPagesDetails: pending.slice(0, 10).map(p => ({
          path: p.path,
          locale: p.locale,
          status: p.translationStatus,
          lastUpdated: p.lastUpdated
        }))
      },
      timestamp: Date.now()
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to get stats'
    }
  }
})

