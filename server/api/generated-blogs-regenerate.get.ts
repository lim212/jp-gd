// server/api/generated-blogs-regenerate.get.ts
import { defineEventHandler, getQuery, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, any>
  const isProd = process.env.NODE_ENV === 'production'
  const expectedSecret = String(process.env.NUXT_REGENERATE_SECRET || process.env.ADMIN_SECRET || '')
  const provided = String(q.secret || '')

  // Require secret in production when an expected secret is configured
  if (isProd && expectedSecret && provided !== expectedSecret) {
    setResponseStatus(event, 401)
    return { status: 'error', message: 'unauthorized' }
  }

  const dry = ['1','true','yes','y','on'].includes(String(q.dry || '').toLowerCase())

  const { listGeneratedBlogs, forceRegenerateAllGeneratedBlogs } = await import('../utils/generated-blogs')

  if (dry) {
    const before = await listGeneratedBlogs().catch(() => [])
    return { status: 'ok', dry: true, total: before.length, message: 'dry-run: no changes applied' }
  }

  const res = await forceRegenerateAllGeneratedBlogs()
  return { status: 'ok', ...res }
})
