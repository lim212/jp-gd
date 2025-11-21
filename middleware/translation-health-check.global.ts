/**
 * Translation System Health Check Middleware
 * 
 * Runs a lightweight check on app initialization to ensure
 * translation system is properly configured
 * 
 * Only runs once on server start
 */

let healthCheckDone = false

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only run on server-side and only once
  if (import.meta.server && !healthCheckDone) {
    healthCheckDone = true

    try {
      // Quick check for critical components
      const hasApiKey = Boolean(
        process.env.OPENAI_API_KEY || 
        process.env.CHATGPT_API_KEYS || 
        process.env.OPENAI_API_KEYS
      )

      if (!hasApiKey) {
        console.warn('\n' + '⚠️ '.repeat(20))
        console.warn('⚠️  TRANSLATION SYSTEM WARNING')
        console.warn('⚠️  OpenAI API key not configured!')
        console.warn('⚠️  Translation features will not work.')
        console.warn('⚠️  Set OPENAI_API_KEY in your .env file')
        console.warn('⚠️ '.repeat(20) + '\n')
      } else {
        console.log('✅ Translation system: API key configured')
      }

      // Check scheduler status
      const schedulerEnabled = String(process.env.NUXT_ENABLE_SCHEDULER || 'true').toLowerCase() !== 'false'
      const isDev = process.env.NODE_ENV === 'development' || process.env.NUXT_DEV === 'true'
      const devCronEnabled = process.env.ENABLE_DEV_CRON === 'true'
      
      const schedulerActive = schedulerEnabled && (!isDev || devCronEnabled)
      
      if (schedulerActive) {
        console.log('✅ Translation scheduler: Active (runs at 02:00 WIB daily)')
      } else if (isDev && !devCronEnabled) {
        console.log('ℹ️  Translation scheduler: Disabled in dev mode (set ENABLE_DEV_CRON=true to enable)')
      } else {
        console.log('⚠️  Translation scheduler: Disabled')
      }

    } catch (error) {
      console.error('❌ Translation system health check failed:', error)
    }
  }
})

