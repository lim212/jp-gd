// Cache Revalidation API
// POST /api/cache/revalidate
// Clear Nuxt cache untuk ensure artikel baru muncul

import CacheManager from '../../utils/cache-manager'

export default defineEventHandler(async (event) => {
  try {
    // Security check (optional)
    const authHeader = getHeader(event, 'authorization')
    const expectedToken = process.env.ADMIN_API_TOKEN || 'your-secret-token'
    
    // Allow internal calls without auth
    const isInternalCall = !authHeader
    const isAuthorized = authHeader === `Bearer ${expectedToken}`
    
    if (!isInternalCall && !isAuthorized) {
      return {
        success: false,
        error: 'Unauthorized'
      }
    }

    const cacheManager = new CacheManager()
    
    // Get routes to revalidate from body (optional)
    const body = await readBody(event).catch(() => ({}))
    const routes = body.routes || ['/blog', '/api/blog']
    
    console.log(`🔄 Cache revalidation requested for ${routes.length} routes`)
    
    // Clear cache
    if (body.clearAll) {
      await cacheManager.clearAll()
    } else {
      await cacheManager.revalidateRoutes(routes)
    }
    
    // Purge CDN if enabled
    if (body.purgeCDN && process.env.CLOUDFLARE_ZONE_ID) {
      const baseUrl = process.env.BASE_URL || 'https://jasapembayaran.com'
      const urls = routes.map(r => `${baseUrl}${r}`)
      await cacheManager.purgeCloudflare(urls)
    }
    
    return {
      success: true,
      message: 'Cache revalidated successfully',
      routes: routes.length,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('❌ Error revalidating cache:', error)
    return {
      success: false,
      error: String(error)
    }
  }
})

