// server/api/sitemap-dynamic.ts
// Provides dynamic sitemap entries consumed by nuxt-simple-sitemap via `sitemap.sitemaps.dynamic.sources`.
// Keep it fast and resilient: return relative URLs so the module resolves the full site URL.

import { defineEventHandler } from 'h3'
import { listCachedPosts } from '../utils/blog-cache'

export default defineEventHandler(async () => {
  const now = new Date().toISOString()

  // Static key pages (ensure consistency with routeRules and existing pages)
  const entries: Array<{ url: string; priority?: number; changefreq?: string; lastmod?: string }> = [
    { url: '/', priority: 1.0, changefreq: 'daily', lastmod: now },
    { url: '/blog', priority: 0.9, changefreq: 'daily', lastmod: now },
    { url: '/testimonials', priority: 0.8, changefreq: 'monthly', lastmod: now },
    { url: '/informasi/transaksi', priority: 0.8, changefreq: 'monthly', lastmod: now },
    { url: '/informasi/rekening', priority: 0.8, changefreq: 'monthly', lastmod: now },
    { url: '/bukti-transaksi', priority: 0.7, changefreq: 'monthly', lastmod: now }
  ]

  // Include local blog posts from cache (data\blog\index.json)
  try {
    const idx = await listCachedPosts()
    if (Array.isArray(idx) && idx.length) {
      for (const it of idx) {
        const lastmod = String((it as any)?.date || now)
        entries.push({ url: `/blog/${it.slug}`, priority: 0.7, changefreq: 'daily', lastmod })
      }
    }
  } catch {}

  return entries
})
