// server/api/health.get.ts
import { defineEventHandler, createError } from 'h3'
import { getOpenAIManager } from '../utils/openaiManager'
import { getCached } from '../utils/cache'
async function fetchWithRetry(url: string, options: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await $fetch(url, {
        ...options,
        timeout: 5000 // 5 detik timeout
      })
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))) // exponential backoff
    }
  }
}

export default defineEventHandler(async () => {
  try {
    // Check Redis connection
    await getCached('health-check')

    // Optionally check WordPress API only when not globally disabled
    const wpDisabled = String(process.env.WORDPRESS_DISABLED || process.env.NUXT_DISABLE_WORDPRESS || 'true').toLowerCase() === 'true'
    if (!wpDisabled && process.env.WORDPRESS_API_URL) {
      await fetchWithRetry(`${process.env.WORDPRESS_API_URL}/posts`, { params: { per_page: 1 } })
    }

    // Check OpenAI API via manager
    const manager = getOpenAIManager()
    const holdInfo = manager.getHoldInfo()
    if (holdInfo.onHold) {
      return {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        openai: holdInfo
      }
    }

    await manager.testConnection()

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      openai: manager.getHoldInfo()
    }
  } catch (error) {
    throw createError({
      statusCode: 503,
      message: 'Service Unavailable',
      cause: error
    })
  }
})
