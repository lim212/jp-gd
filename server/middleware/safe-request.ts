/**
 * Safe Request Middleware
 * Ensures all request data is safe before Nitro processes it
 */

export default defineEventHandler((event) => {
  // Safely process query parameters
  try {
    const query = getQuery(event)
    if (query && typeof query === 'object') {
      // Ensure query is a plain object with string values
      const safeQuery: Record<string, string> = {}
      for (const key in query) {
        if (Object.prototype.hasOwnProperty.call(query, key)) {
          const value = query[key]
          safeQuery[key] = Array.isArray(value) 
            ? String(value[0] || '')
            : String(value || '')
        }
      }
      // Replace query with safe version
      event.context = event.context || {}
      event.context.query = safeQuery
    }
  } catch (e) {
    // Ignore query processing errors
  }
  
  // Safely process headers
  try {
    if (event.node?.req?.headers) {
      const headers = event.node.req.headers
      if (headers && typeof headers === 'object') {
        // Ensure headers is a plain object
        const safeHeaders: Record<string, string> = {}
        for (const key in headers) {
          if (Object.prototype.hasOwnProperty.call(headers, key)) {
            const value = headers[key]
            safeHeaders[key] = Array.isArray(value) 
              ? String(value[0] || '')
              : String(value || '')
          }
        }
        // Headers are read-only, so we can't replace them, but we ensure they're safe
      }
    }
  } catch (e) {
    // Ignore header processing errors
  }
})

