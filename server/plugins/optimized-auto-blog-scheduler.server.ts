// Optimized Auto Blog Scheduler - Enhanced with Quality Control
import OptimizedBlogScheduler from '../utils/optimized-blog-scheduler.js'

// Global scheduler instance
let optimizedScheduler: OptimizedBlogScheduler

export default defineNitroPlugin(async () => {
  // Only run in production or when explicitly enabled
  const isDev = process.env.NODE_ENV === 'development'
  const enabled = process.env.NUXT_ENABLE_AUTO_BLOG === 'true'
  const useOptimized = process.env.NUXT_USE_OPTIMIZED_BLOG === 'true'
  
  if (isDev && !enabled) {
    console.log('[optimized-auto-blog-scheduler] Dev mode detected — scheduler disabled (set NUXT_ENABLE_AUTO_BLOG=true to override)')
    return
  }

  if (!enabled) {
    console.log('[optimized-auto-blog-scheduler] Scheduler disabled (default). Set NUXT_ENABLE_AUTO_BLOG=true to enable.')
    return
  }

  if (!useOptimized) {
    console.log('[optimized-auto-blog-scheduler] Using standard scheduler. Set NUXT_USE_OPTIMIZED_BLOG=true to use optimized version.')
    return
  }

  try {
    // Initialize optimized scheduler
    optimizedScheduler = new OptimizedBlogScheduler()
    await optimizedScheduler.init()

    // Check schedule every minute
    setInterval(() => {
      optimizedScheduler.checkSchedule()
    }, 60000)

    console.log('[optimized-auto-blog-scheduler] Optimized auto blog scheduler active - will run daily at 03:00 with quality control')
    
  } catch (error) {
    console.error('[optimized-auto-blog-scheduler] Failed to initialize:', error)
  }
})
