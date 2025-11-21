import { defineEventHandler } from 'h3'
import { getTranslationManager } from '../../utils/enhancedTranslationManager'

/**
 * GET /api/i18n/check-status
 * Check current translation status
 */
export default defineEventHandler(async (event) => {
  try {
    const manager = getTranslationManager()
    const stats = manager.getStats()
    
    // Check if OpenAI API key is configured
    const hasApiKey = Boolean(
      process.env.CHATGPT_API_KEYS || 
      process.env.OPENAI_API_KEYS || 
      process.env.OPENAI_API_KEY
    )

    return {
      hasPending: stats.pending > 0,
      canTranslate: hasApiKey,
      stats,
      timestamp: Date.now()
    }
  } catch (error: any) {
    console.error('[check-status] Error:', error)
    
    return {
      hasPending: false,
      canTranslate: false,
      error: error?.message || 'Unknown error'
    }
  }
})

