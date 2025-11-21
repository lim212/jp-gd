// server/plugins/sitemap.server.ts

// Lazy import to avoid circular deps when building
async function getAllBlogUrls() {
  const urls: Array<{ loc: string, lastmod?: string, changefreq?: 'daily' | 'weekly' | 'monthly', priority?: number }> = []
  try {
    const { listCachedPosts } = await import('../utils/blog-cache')
    const idx = await listCachedPosts()
    if (Array.isArray(idx)) {
      for (const it of idx) {
        if (!it?.slug) continue
        urls.push({
          loc: `/blog/${it.slug}`,
          lastmod: it.date,
          changefreq: 'weekly',
          priority: 0.7
        })
      }
    }
  } catch (e: unknown) {
    console.warn('[sitemap] Failed to build sitemap from cache:', e instanceof Error ? e.message : String(e))
  }
  return urls
}

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('sitemap:sources', (ctx: { sources: Array<() => Promise<unknown>> }) => {
    // Optional: enable this plugin source only when explicitly turned on to avoid duplicates with nuxt.config.ts `sitemap.sources`.
    if (process.env.NUXT_SITEMAP_PLUGIN_ENABLED === 'true') {
      ctx.sources.push(getAllBlogUrls)
    }
  })
})
