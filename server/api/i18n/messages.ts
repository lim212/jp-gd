import { defineEventHandler, getQuery, createError } from 'h3'
import { readLocale } from '../../utils/i18nStore'

/**
 * GET /api/i18n/messages?locale=id|en
 * Returns i18n messages for the requested locale with caching headers
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const locale = (query.locale as string) || 'id'

    // Validate locale
    if (locale !== 'id' && locale !== 'en') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid locale',
        message: 'Locale must be "id" or "en"'
      })
    }

    // Read locale messages from file
    const messages = await readLocale(locale as 'id' | 'en')

    // Set aggressive caching for ID (Indonesian - stable), moderate for EN (may change)
    const isId = locale === 'id'
    const cacheMaxAge = isId ? 86400 : 1800 // ID: 24h, EN: 30min
    const staleWhileRevalidate = isId ? 86400 : 3600 // ID: 24h, EN: 1h

    // Set cache headers
    event.node.res.setHeader(
      'Cache-Control',
      `public, max-age=${cacheMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`
    )
    event.node.res.setHeader('CDN-Cache-Control', `public, max-age=${cacheMaxAge}`)
    event.node.res.setHeader('Vary', 'Accept-Encoding')

    // Add ETag for better cache validation
    const etag = `"${locale}-${Date.now()}"`
    event.node.res.setHeader('ETag', etag)

    return {
      locale,
      messages,
      cached: true,
      timestamp: Date.now()
    }
  } catch (error: any) {
    console.error('[i18n-messages] Error:', error)
    
    // Return fallback empty messages on error
    return {
      locale: 'id',
      messages: {},
      error: true,
      message: error?.message || 'Failed to load messages'
    }
  }
})

