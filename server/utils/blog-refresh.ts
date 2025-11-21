// server/utils/blog-refresh.ts
// WordPress integration removed - using ChatGPT only
import { generatePlaceholderPostBySlug, buildAiHeroUrl } from './ai'
import { saveManyPosts, saveIndex, listCachedPosts, getPostFromCache } from './blog-cache'
import type { CachedPost, CachedIndexItem } from './blog-cache'
import { ensureHeroImage, normalizeTitle, ensureExcerpt, generateRichPlaceholderContent } from './blog-normalize'

export type RefreshSummary = {
  totalFromWP: number
  savedCount: number
  pagesProcessed: number
  errors: { slug: string; reason: string }[]
}

export async function refreshAllBlogPosts(maxPerPage: number = 100): Promise<RefreshSummary> {
  const allPosts: CachedPost[] = []
  const errors: { slug: string; reason: string }[] = []

  // WordPress integration removed - using cached posts instead
  const cachedPosts = await listCachedPosts()
  const totalPages = Math.ceil(cachedPosts.length / maxPerPage)

  for (const p of cachedPosts) {
      const slug = String(p.slug || '')
      if (!slug) continue
      try {
        // Build normalized, rich article (no placeholder body)
        const cleanTitle = normalizeTitle(String(p.title || ''), slug)
        const body = generateRichPlaceholderContent(cleanTitle, slug)
        const excerpt = ensureExcerpt(String(p.excerpt || ''), cleanTitle, slug)
        const image = ensureHeroImage(String(p.image || ''), cleanTitle, slug)
        const merged: CachedPost = {
          id: Number(p.id) || 0,
          slug,
          title: cleanTitle,
          excerpt,
          content: body,
          author: String((p as any)?.author || 'Redaksi'),
          date: String(p.date || new Date().toISOString()),
          image,
          categories: Array.isArray(p.categories) ? p.categories : ['Blog'],
          tags: Array.isArray(p.tags) ? p.tags : [],
          aiImageUrl: buildAiHeroUrl(cleanTitle, slug),
        }
        allPosts.push(merged)
      } catch (e) {
        // Fallback: try to get the post from cache
        try {
          const cachedPost = await getPostFromCache(slug)
          if (cachedPost) {
            const title = normalizeTitle(String(cachedPost.title || p.title || ''), slug)
            const image = ensureHeroImage(String(cachedPost.image || p.image || ''), title, slug)
            const excerpt = ensureExcerpt(String(cachedPost.excerpt || p.excerpt || ''), title, slug)
            const merged: CachedPost = {
              id: Number(p.id) || Number(cachedPost.id) || 0,
              slug,
              title,
              excerpt,
              content: String(cachedPost.content || ''),
              author: String(cachedPost.author || 'Redaksi'),
              date: String(p.date || cachedPost.date || new Date().toISOString()),
              image,
              categories: Array.isArray(cachedPost.categories) ? cachedPost.categories : (Array.isArray(p.categories) ? p.categories : []),
              tags: Array.isArray(cachedPost.tags) ? cachedPost.tags : (Array.isArray(p.tags) ? p.tags : []),
            }
            allPosts.push(merged)
            continue
          } else {
            errors.push({ slug, reason: 'AI and cache fallback both failed (no post found)' })
            continue
          }
        } catch (e2) {
          errors.push({ slug, reason: (e2 as any)?.message || String(e2) })
          continue
        }
      }
    }

  // De-duplicate by slug, keep the most recent date
  const bySlug = new Map<string, CachedPost>()
  for (const p of allPosts) {
    const existing = bySlug.get(p.slug)
    if (!existing) {
      bySlug.set(p.slug, p)
    } else {
      const existingTs = Date.parse(existing.date || '') || 0
      const candidateTs = Date.parse(p.date || '') || 0
      bySlug.set(p.slug, candidateTs >= existingTs ? p : existing)
    }
  }
  const deduped = Array.from(bySlug.values())

  // Persist per-post and update index
  await saveManyPosts(deduped)

  const indexItems: CachedIndexItem[] = deduped.map(p => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    date: p.date,
    image: p.image,
    excerpt: p.excerpt,
  }))
  await saveIndex(indexItems)

  return {
    totalFromWP: deduped.length,
    savedCount: deduped.length,
    pagesProcessed: Math.max(1, totalPages),
    errors,
  }
}
