// server/api/keyword-run.get.ts
import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, any>
  const count = Math.min(Math.max(parseInt(String(q.count ?? q.n ?? '20'), 10) || 20, 1), 50)
  const publish = ['1','true','yes','y','on'].includes(String(q.publish || '').toLowerCase())
  const date = q.date ? String(q.date) : undefined

  const { runKeywordJobForDate } = await import('../utils/keyword-job')
  const res = await runKeywordJobForDate(date, count, publish)
  return { status: 'ok', ...res }
})
