import { defineEventHandler, createError } from 'h3'
import { translateMissingIdToEn } from '../../utils/i18nAuto'

/**
 * POST /api/i18n/sync
 * Triggers translation of missing/changed Indonesian → English keys
 * Called manually or by scheduler
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('[i18n-sync] Starting translation sync...')
    const result = await translateMissingIdToEn()

    if (result.skipped) {
      return {
        success: false,
        skipped: true,
        reason: result.reason,
        message: 'Translation skipped: ' + result.reason
      }
    }

    const message = result.updated
      ? `Translated ${result.translatedCount} keys (${result.missingCount} missing, ${result.changedCount} changed)`
      : 'No changes needed - translations are up to date'

    console.log('[i18n-sync]', message)

    return {
      success: true,
      skipped: false,
      updated: result.updated || false,
      translatedCount: result.translatedCount,
      missingCount: result.missingCount,
      changedCount: result.changedCount,
      message
    }
  } catch (error: any) {
    console.error('[i18n-sync] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Translation sync failed',
      message: error?.message || 'Unknown error'
    })
  }
})

