// Cache Manager - Auto-Revalidate Nuxt Cache
// Ensures new articles appear immediately without manual rebuild

import { promises as fs } from 'fs'
import path from 'path'

export class CacheManager {
  private cacheDir: string

  constructor() {
    this.cacheDir = path.join(process.cwd(), '.nuxt', 'cache')
  }

  /**
   * Clear all Nuxt cache
   */
  async clearAll(): Promise<void> {
    try {
      console.log('🗑️ Clearing Nuxt cache...')
      
      const cachePaths = [
        '.nuxt/cache',
        '.nuxt/.cache',
        '.output/cache',
        'node_modules/.cache'
      ]
      
      for (const cachePath of cachePaths) {
        try {
          const fullPath = path.join(process.cwd(), cachePath)
          await fs.rm(fullPath, { recursive: true, force: true })
          console.log(`   ✅ Cleared: ${cachePath}`)
        } catch (error) {
          // Path might not exist, ignore
        }
      }
      
      console.log('✅ Cache cleared successfully')
    } catch (error) {
      console.error('❌ Error clearing cache:', error)
    }
  }

  /**
   * Clear specific route cache
   */
  async clearRoute(route: string): Promise<void> {
    try {
      console.log(`🗑️ Clearing cache for route: ${route}`)
      
      // Clear route-specific cache files
      const routeCachePattern = route.replace(/\//g, '_')
      const cacheFiles = await this.findCacheFiles(routeCachePattern)
      
      for (const file of cacheFiles) {
        try {
          await fs.unlink(file)
          console.log(`   ✅ Deleted: ${path.basename(file)}`)
        } catch (error) {
          // File might not exist
        }
      }
      
      console.log(`✅ Route cache cleared: ${route}`)
    } catch (error) {
      console.error('❌ Error clearing route cache:', error)
    }
  }

  /**
   * Find cache files matching pattern
   */
  private async findCacheFiles(pattern: string): Promise<string[]> {
    const files: string[] = []
    
    try {
      const items = await fs.readdir(this.cacheDir)
      
      for (const item of items) {
        if (item.includes(pattern)) {
          files.push(path.join(this.cacheDir, item))
        }
      }
    } catch (error) {
      // Cache dir might not exist
    }
    
    return files
  }

  /**
   * Trigger Nuxt regeneration for specific routes
   */
  async revalidateRoutes(routes: string[]): Promise<void> {
    console.log(`🔄 Revalidating ${routes.length} routes...`)
    
    for (const route of routes) {
      await this.clearRoute(route)
    }
    
    console.log('✅ Routes revalidated')
  }

  /**
   * Purge CDN cache (Cloudflare)
   */
  async purgeCloudflare(urls: string[]): Promise<void> {
    const zoneId = process.env.CLOUDFLARE_ZONE_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN
    
    if (!zoneId || !apiToken) {
      console.log('⚠️ Cloudflare credentials not set, skipping CDN purge')
      return
    }
    
    try {
      console.log(`🌐 Purging Cloudflare cache for ${urls.length} URLs...`)
      
      const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ files: urls })
      })
      
      const data = await response.json()
      
      if (data.success) {
        console.log('✅ Cloudflare cache purged successfully')
      } else {
        console.error('❌ Cloudflare purge failed:', data.errors)
      }
    } catch (error) {
      console.error('❌ Error purging Cloudflare:', error)
    }
  }

  /**
   * Full cache invalidation after blog generation
   */
  async invalidateAfterBlogGeneration(blogSlugs: string[]): Promise<void> {
    console.log('\n🔄 Starting full cache invalidation...')
    
    // 1. Clear Nuxt cache
    await this.clearAll()
    
    // 2. Clear specific blog routes
    const routes = [
      '/blog',
      '/api/blog',
      ...blogSlugs.map(slug => `/blog/${slug}`)
    ]
    await this.revalidateRoutes(routes)
    
    // 3. Purge CDN if configured
    if (process.env.CLOUDFLARE_ZONE_ID) {
      const baseUrl = process.env.BASE_URL || 'https://jasapembayaran.com'
      const urls = routes.map(route => `${baseUrl}${route}`)
      await this.purgeCloudflare(urls)
    }
    
    console.log('✅ Cache invalidation complete!')
  }
}

export default CacheManager

