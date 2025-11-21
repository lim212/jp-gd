import { defineEventHandler, createError } from 'h3'
import { getTranslationManager } from '../../utils/enhancedTranslationManager'

/**
 * POST /api/i18n/retry-failed
 * Retry all failed translations
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('[retry-failed] Starting retry of failed translations...')
    
    const manager = getTranslationManager()
    const result = await manager.retryFailed()

    console.log('[retry-failed] Retry complete:', result)

    return {
      success: true,
      retriedPages: result.retriedPages,
      translatedCount: result.translatedCount,
      message: `Retried ${result.retriedPages} failed pages, translated ${result.translatedCount} keys`,
      timestamp: Date.now()
    }
  } catch (error: any) {
    console.error('[retry-failed] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Retry failed',
      message: error?.message || 'Unknown error'
    })
  }
})

