// server/api/blog/cron/run.get.ts
import { defineEventHandler, getQuery } from 'h3'

function todayDateStrWIB(): string {
  const now = new Date()
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000
  const wib = new Date(now.getTime() + WIB_OFFSET_MS)
  const y = wib.getUTCFullYear()
  const m = String(wib.getUTCMonth() + 1).padStart(2, '0')
  const d = String(wib.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, any>
  const count = Math.min(Math.max(parseInt(String(q.count ?? q.n ?? '10'), 10) || 10, 1), 50)
  const publish = ['1','true','yes','y','on'].includes(String(q.publish || '').toLowerCase())
  const date = q.date ? String(q.date) : todayDateStrWIB()

  try {
    const { runKeywordJobForDate } = await import('~~/server/utils/keyword-job')
    const res = await runKeywordJobForDate(date, count, publish)
    return { ok: true, date, count, publish, ...res }
  } catch (e) {
    return { ok: false, error: String((e as any)?.message || 'cron_run_failed') }
  }
})
