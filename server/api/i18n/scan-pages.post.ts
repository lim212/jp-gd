import { defineEventHandler, createError } from 'h3'
import { getTranslationManager } from '../../utils/enhancedTranslationManager'

/**
 * POST /api/i18n/scan-pages
 * Manually trigger a scan of all pages to detect new/changed content
 * Useful for detecting changes after code updates
 */
export default defineEventHandler(async (event) => {
  try {
    console.log('[scan-pages] Starting manual page scan...')
    
    const manager = getTranslationManager()
    const result = await manager.scanAllPages()

    console.log('[scan-pages] Scan complete:', result)

    return {
      success: true,
      scanned: result.scanned,
      newPages: result.new,
      changedPages: result.changed,
      message: `Scanned ${result.scanned} files, found ${result.new} new and ${result.changed} changed`,
      timestamp: Date.now()
    }
  } catch (error: any) {
    console.error('[scan-pages] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Page scan failed',
      message: error?.message || 'Unknown error'
    })
  }
})

