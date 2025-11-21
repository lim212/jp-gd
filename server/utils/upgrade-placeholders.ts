// server/utils/upgrade-placeholders.ts
import { listCachedPosts, getPostFromCache, savePostToCache } from './blog-cache'
import type { CachedPost } from './blog-cache'
import { ensureHeroImage, normalizeTitle, ensureExcerpt, generateRichPlaceholderContent } from './blog-normalize'
import { buildAiHeroUrl } from './ai'

export type UpgradeSummary = {
  scanned: number
  upgraded: number
  skipped: number
  errors: { slug: string, reason: string }[]
  upgradedSlugs: string[]
}

function isPlaceholderContent(html?: string): boolean {
  const s = String(html || '').toLowerCase()
  if (!s) return true
  // Core phrase from legacy placeholders
  if (s.includes('artikel placeholder ini dibuat')) return true
  // Very short content (under ~120 words) is also considered placeholder-ish
  const words = s.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean)
  return words.length < 120
}

export async function upgradeCachedPlaceholders(): Promise<UpgradeSummary> {
  const idx = await listCachedPosts().catch(() => [])
  let scanned = 0
  let upgraded = 0
  const errors: { slug: string, reason: string }[] = []
  const upgradedSlugs: string[] = []

  for (const it of idx) {
    const slug = String((it as any)?.slug || '')
    if (!slug) continue
    scanned++
    try {
      const cached = await getPostFromCache(slug)
      if (!cached) continue
      const needsUpgrade = isPlaceholderContent(cached.content)
      if (!needsUpgrade) continue

      const title = normalizeTitle(cached.title, slug)
      const content = generateRichPlaceholderContent(title, slug)
      const excerpt = ensureExcerpt(cached.excerpt, title, slug)
      const aiHero = buildAiHeroUrl(title, slug)
      const image = ensureHeroImage(cached.aiImageUrl || cached.image || aiHero, title, slug)

      const updated: CachedPost = {
        ...cached,
        title,
        content,
        excerpt,
        image,
        aiImageUrl: aiHero,
        date: String(cached.date || new Date().toISOString()),
        author: String(cached.author || 'Redaksi'),
        categories: Array.isArray(cached.categories) && cached.categories.length ? cached.categories : ['Blog'],
        tags: Array.isArray(cached.tags) ? cached.tags : [],
      }

      await savePostToCache(updated)
      upgraded++
      upgradedSlugs.push(slug)
    } catch (e) {
      errors.push({ slug, reason: (e as any)?.message || String(e) })
      continue
    }
  }

  return { scanned, upgraded, skipped: Math.max(0, scanned - upgraded - errors.length), errors, upgradedSlugs }
}
