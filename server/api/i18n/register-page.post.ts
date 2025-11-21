import { defineEventHandler, readBody } from 'h3'
import { getTranslationManager } from '../../utils/enhancedTranslationManager'

/**
 * POST /api/i18n/register-page
 * Registers a page for translation tracking with enhanced detection
 * Auto-detects new/changed content and optionally triggers immediate translation
 * Called automatically by usePageTranslation composable
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { path, locale, content, options } = body

    if (!path || !locale || !content) {
      return {
        success: false,
        registered: false,
        needsTranslation: false,
        error: 'Missing required fields'
      }
    }

    // Validate locale
    if (locale !== 'id' && locale !== 'en') {
      return {
        success: false,
        registered: false,
        needsTranslation: false,
        error: 'Invalid locale'
      }
    }

    // Get translation manager
    const manager = getTranslationManager()

    // Create content string for hash-based change detection
    const contentString = JSON.stringify({
      title: content.title,
      description: content.description,
      extractedContent: content.extractedContent,
      messages: content.messages
    })

    // Register page with hash-based change detection
    const registered = await manager.registerPage(path, contentString)

    let translationTriggered = false
    
    // If immediate translation requested and page changed
    if (options?.immediate && registered) {
      try {
        console.log(`[register-page] Triggering immediate translation for ${path}`)
        await manager.translateImmediate()
        translationTriggered = true
      } catch (e) {
        console.error('[register-page] Immediate translation failed:', e)
      }
    }

    return {
      success: true,
      registered,
      needsTranslation: registered,
      translationTriggered,
      path,
      locale,
      message: registered ? 'Page registered with changes' : 'Page up to date',
      timestamp: Date.now()
    }
  } catch (error: any) {
    console.error('[register-page] Error:', error)
    
    // Return success=false but don't throw (non-critical operation)
    return {
      success: false,
      registered: false,
      needsTranslation: false,
      error: error?.message || 'Unknown error',
      message: 'Registration failed but non-critical'
    }
  }
})

