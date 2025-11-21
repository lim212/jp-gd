// server/plugins/keyword-cron.server.ts
// Schedules daily keyword-based content generation at 02:00 WIB (Asia/Jakarta).
// It reads keywords from data\keywords\YYYY-MM-DD\*.txt and generates posts into data\blog.

function msUntilNextWIB(hour: number, minute: number) {
  // Compute time until next hour:minute in Asia/Jakarta (UTC+7, no DST)
  const now = new Date()
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000
  const nowWIB = new Date(now.getTime() + WIB_OFFSET_MS)
  const nextWIB = new Date(nowWIB)
  nextWIB.setHours(hour, minute, 0, 0)
  if (nextWIB <= nowWIB) nextWIB.setDate(nextWIB.getDate() + 1)
  const targetUtcMs = nextWIB.getTime() - WIB_OFFSET_MS
  return targetUtcMs - now.getTime()
}

function todayDateStrWIB(): string {
  const now = new Date()
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000
  const wib = new Date(now.getTime() + WIB_OFFSET_MS)
  const y = wib.getUTCFullYear()
  const m = String(wib.getUTCMonth() + 1).padStart(2, '0')
  const d = String(wib.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export async function runOnce(dateStr?: string) {
  try {
    const { runKeywordJobForDate } = await import('../utils/keyword-job')
    const { updateGeneratedBlogsToNewStandard } = await import('../utils/generated-blogs')
    // Requirement: run with undefined date and 10 items, then standardize the new batch
    const res = await runKeywordJobForDate(undefined, 10)
    await updateGeneratedBlogsToNewStandard()
    console.log(
      `[keyword-cron] Generated from keywords (cron 0 2 * * *): processed=${res.processed} skipped=${res.skipped} slugs=${res.generated.join(', ')}`
    )
  } catch (e) {
    console.warn('[keyword-cron] Error generating from keywords:', e)
  }
}

export default defineNitroPlugin(() => {
  // Bootstrap: if blog cache is empty, generate 10 posts once at startup
  try {
    setTimeout(async () => {
      try {
        const { listCachedPosts } = await import('../utils/blog-cache')
        const idx = await listCachedPosts()
        if (!Array.isArray(idx) || idx.length === 0) {
          const { runKeywordJobForDate } = await import('../utils/keyword-job')
          const { updateGeneratedBlogsToNewStandard } = await import('../utils/generated-blogs')
          await runKeywordJobForDate(undefined, 10)
          await updateGeneratedBlogsToNewStandard()
          console.log('[keyword-cron] Bootstrap: generated 10 posts and standardized generated-blogs.json because cache was empty')
        }
      } catch (e) {
        console.warn('[keyword-cron] Bootstrap check failed:', e)
      }
    }, 0)
  } catch {}
  const isDev = process.env.NODE_ENV !== 'production'
  const allowDevCron = process.env.ENABLE_DEV_CRON === 'true'

  if (isDev && !allowDevCron) {
    console.log('[keyword-cron] Dev mode detected — scheduler disabled (set ENABLE_DEV_CRON=true to override)')
    return
  }

  const disabled =
    String(process.env.NUXT_ENABLE_KEYWORD_SCHEDULER || process.env.NUXT_ENABLE_SCHEDULER || '')
      .toLowerCase() === 'false'
  if (disabled) {
    console.log('[keyword-cron] Scheduler disabled by env')
    return
  }

  // Schedule at 02:00 WIB (Asia/Jakarta)
  const initialDelay = msUntilNextWIB(2, 0)
  setTimeout(async () => {
    await runOnce()
    const dayMs = 24 * 60 * 60 * 1000
    setInterval(runOnce, dayMs)
  }, initialDelay)

  console.log('[keyword-cron] Scheduled daily keyword job at 02:00 WIB (Asia/Jakarta)')
})
