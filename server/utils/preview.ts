// server/utils/preview.ts
interface PreviewData {
  id: string
  content: string
  title: string
  excerpt: string
  image?: string
  timestamp: number
  expiresAt: number
}

const PREVIEW_TTL = 3600 * 24 // 24 hours

export async function savePreview(data: Partial<BlogPost>): Promise<string> {
  const previewId = randomUUID()
  const preview: PreviewData = {
    id: previewId,
    content: data.content || '',
    title: data.title || '',
    excerpt: data.excerpt || '',
    image: data.image,
    timestamp: Date.now(),
    expiresAt: Date.now() + (PREVIEW_TTL * 1000)
  }

  await setCache(`preview:${previewId}`, preview, PREVIEW_TTL)
  return previewId
}

export async function getPreview(previewId: string): Promise<PreviewData | null> {
  return await getCached(`preview:${previewId}`)
}
