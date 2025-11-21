// server/routes/sitemap-dynamic.xml.ts
import { defineEventHandler, setHeader } from 'h3'
import { useRuntimeConfig } from '#imports'
import { $fetch } from 'ofetch'

interface SitemapEntry { loc: string; lastmod?: string; changefreq?: 'daily' | 'weekly' | 'monthly'; priority?: number }

function escapeXml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = (config.public?.siteUrl as string) || 'https://jasapembayaran.com'
  const base = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl

  const todayIso = new Date().toISOString()

  const staticEntries: SitemapEntry[] = [
    { loc: '/', changefreq: 'daily', priority: 1.0, lastmod: todayIso },
    { loc: '/testimonials', changefreq: 'monthly', priority: 0.8, lastmod: todayIso },
    { loc: '/informasi/transaksi', changefreq: 'monthly', priority: 0.8, lastmod: todayIso },
    { loc: '/informasi/rekening', changefreq: 'monthly', priority: 0.8, lastmod: todayIso },
    { loc: '/bukti-transaksi', changefreq: 'monthly', priority: 0.7, lastmod: todayIso }
  ]

  let dynamicEntries: SitemapEntry[] = []
  try {
    // Fetch additional dynamic URLs (e.g., blog posts)
    dynamicEntries = await $fetch<SitemapEntry[]>('/api/sitemap-dynamic').catch(() => [])
  } catch {
    dynamicEntries = []
  }

  const entries = [...staticEntries, ...dynamicEntries]

  const urlsXml = entries.map((e) => {
    const parts: string[] = []
    const loc = e.loc.startsWith('http') ? e.loc : base + e.loc
    parts.push(`  <url>\n    <loc>${escapeXml(loc)}</loc>`) // loc is required

    // lastmod in ISO 8601 if valid
    if (e.lastmod) {
      const ts = Date.parse(e.lastmod)
      const iso = isNaN(ts) ? todayIso : new Date(ts).toISOString()
      parts.push(`    <lastmod>${escapeXml(iso)}</lastmod>`)
    }

    if (e.changefreq) parts.push(`    <changefreq>${e.changefreq}</changefreq>`)
    if (typeof e.priority === 'number') parts.push(`    <priority>${e.priority.toFixed(1)}</priority>`)

    parts.push('  </url>')
    return parts.join('\n')
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  return xml
})
