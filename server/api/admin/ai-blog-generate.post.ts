// server/api/admin/ai-blog-generate.post.ts
// Manual trigger for REAL AI blog generation (uses AIBlogScheduler)
import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { scheduler as aiScheduler } from '../../plugins/ai-blog-scheduler.server'

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, any>
  const isProd = process.env.NODE_ENV === 'production'
  const expectedSecret = String(process.env.NUXT_REGENERATE_SECRET || process.env.ADMIN_SECRET || '')
  const provided = String(q.secret || '')

  // In production, require secret if configured
  if (isProd && expectedSecret && provided !== expectedSecret) {
    setResponseStatus(event, 401)
    return { status: 'error', message: 'unauthorized' }
  }

  if (!aiScheduler) {
    setResponseStatus(event, 500)
    return { status: 'error', message: 'AI blog scheduler is not initialized. Make sure NUXT_ENABLE_AI_BLOG or NUXT_ENABLE_AUTO_BLOG is true.' }
  }

  try {
    // This will use MAX_DAILY_POSTS (default 20) as configured in env / runtime
    const result = await aiScheduler.runDailyGeneration()

    return {
      status: 'ok',
      mode: 'manual',
      targetPerDay: process.env.MAX_DAILY_POSTS || '20',
      ...result
    }
  } catch (error: any) {
    setResponseStatus(event, 500)
    return {
      status: 'error',
      message: error?.message || String(error)
    }
  }
})


