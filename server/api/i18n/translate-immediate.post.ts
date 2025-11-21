import { defineEventHandler, createError } from 'h3'
import { getTranslationManager } from '../../utils/enhancedTranslationManager'

/**
 * POST /api/i18n/translate-immediate
 * Force immediate translation of all pending content
 * Use this when you need urgent translations (not waiting for scheduled job)
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('[translate-immediate] Starting immediate translation...')
    
    const manager = getTranslationManager()
    const result = await manager.translateImmediate()

    if (result.skipped) {
      return {
        success: false,
        skipped: true,
        reason: result.reason,
        message: 'Translation skipped: ' + result.reason
      }
    }

    const message = result.updated
      ? `Translated ${result.translatedCount} keys immediately (${result.missingCount} missing, ${result.changedCount} changed)`
      : 'No changes needed - translations are up to date'

    console.log('[translate-immediate]', message)

    return {
      success: true,
      skipped: false,
      updated: result.updated || false,
      translatedCount: result.translatedCount,
      missingCount: result.missingCount,
      changedCount: result.changedCount,
      message,
      timestamp: Date.now()
    }
  } catch (error: any) {
    console.error('[translate-immediate] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Immediate translation failed',
      message: error?.message || 'Unknown error'
    })
  }
})

