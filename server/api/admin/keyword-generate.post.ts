// server/api/admin/keyword-generate.post.ts
// Manual trigger untuk keyword scheduler (runKeywordJobForDate)
import { defineEventHandler, getQuery, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const q = getQuery(event) as Record<string, any>
  const isProd = process.env.NODE_ENV === 'production'

  const expectedSecret = String(process.env.NUXT_REGENERATE_SECRET || process.env.ADMIN_SECRET || '')
  const provided = String(q.secret || '')

  // In production, require secret jika dikonfigurasi
  if (isProd && expectedSecret && provided !== expectedSecret) {
    setResponseStatus(event, 401)
    return { status: 'error', message: 'unauthorized' }
  }

  // Ambil jumlah artikel yang ingin di-generate (default 20, max 50)
  const rawCount = Number(q.count ?? q.limit ?? 20)
  const count = Math.min(Math.max(rawCount || 20, 1), 50)

  try {
    const { runKeywordJobForDate } = await import('../../../server/utils/keyword-job')
    const { updateGeneratedBlogsToNewStandard } = await import('../../../server/utils/generated-blogs')

    // Jalankan keyword job sekali untuk hari ini dengan jumlah "count"
    const res = await runKeywordJobForDate(undefined, count)

    // Standarisasi generated-blogs.json (title/meta/body/gambar sesuai aturan)
    await updateGeneratedBlogsToNewStandard()

    return {
      status: 'ok',
      mode: 'manual',
      requestedCount: count,
      processed: res.processed,
      skipped: res.skipped,
      generatedSlugs: res.generated
    }
  } catch (error: any) {
    setResponseStatus(event, 500)
    return {
      status: 'error',
      message: error?.message || String(error)
    }
  }
})








