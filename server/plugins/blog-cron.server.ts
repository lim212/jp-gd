// server/plugins/blog-cron.server.ts
// ChatGPT blog generation scheduler - WordPress integration removed

function msUntilNext(hour: number, minute: number) {
  const now = new Date()
  const next = new Date(now)
  next.setHours(hour, minute, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)
  return next.getTime() - now.getTime()
}

async function runRefreshOnce() {
  try {
    const mod = await import('../utils/blog-refresh')
    const res = await mod.refreshAllBlogPosts(100)
    console.log(`[blog-cron] Refresh done: saved=${res.savedCount} pages=${res.pagesProcessed} errors=${res.errors.length}`)
    if (res.errors.length) {
      console.warn('[blog-cron] Errors:', res.errors.slice(0, 3))
    }
  } catch (e) {
    console.warn('[blog-cron] Refresh error:', e)
  }
}

export default defineNitroPlugin(() => {
  // Disable only in explicit dev mode; allow override via ENABLE_DEV_CRON like keyword-cron
  const isDev = process.env.NODE_ENV === 'development' || process.env.NUXT_DEV === 'true'
  const allowDevCron = process.env.ENABLE_DEV_CRON === 'true'
  if (isDev && !allowDevCron) {
    console.log('[blog-cron] Dev mode detected — scheduler disabled (set ENABLE_DEV_CRON=true to override)')
    return
  }

  // Require explicit enable via env to prevent WP API calls by default
  const enabled = String(process.env.NUXT_ENABLE_BLOG_SCHEDULER || process.env.NUXT_ENABLE_SCHEDULER || '').toLowerCase() === 'true'
  if (!enabled) {
    console.log('[blog-cron] Scheduler disabled (default). Set NUXT_ENABLE_BLOG_SCHEDULER=true to enable.')
    return
  }

  // Kick off initial schedule to 01:00 local time
  const initialDelay = msUntilNext(1, 0)
  setTimeout(async () => {
    await runRefreshOnce()
    // Then run every 24 hours
    const dayMs = 24 * 60 * 60 * 1000
    setInterval(runRefreshOnce, dayMs)
  }, initialDelay)

  console.log('[blog-cron] Scheduled daily blog refresh at 01:00 local server time')
})
