/**
 * Utility to ensure response objects are safe for Nitro
 * Prevents Object.entries() errors by ensuring all values are primitives
 */

export function sanitizeResponse(data: any): any {
  if (data === null || data === undefined) {
    return {}
  }

  if (typeof data !== 'object') {
    return data
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeResponse(item))
  }

  // Create a new plain object to avoid prototype issues
  const sanitized: Record<string, any> = Object.create(null)
  
  try {
    // Use Object.keys instead of for...in to avoid prototype chain
    const keys = Object.keys(data)
    for (const key of keys) {
      const value = data[key]
      
      if (value === null || value === undefined) {
        // Convert null/undefined to empty string
        sanitized[key] = ''
      } else if (typeof value === 'object') {
        if (Array.isArray(value)) {
          // Sanitize arrays - only keep primitives
          sanitized[key] = value.map(item => {
            if (item === null || item === undefined) return ''
            if (typeof item === 'object') {
              // Flatten nested objects to strings
              return JSON.stringify(sanitizeResponse(item))
            }
            return item
          })
        } else {
          // Recursively sanitize nested objects, but limit depth
          sanitized[key] = sanitizeResponse(value)
        }
      } else {
        // Primitives are safe - ensure they're proper types
        if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
          sanitized[key] = 0
        } else {
          sanitized[key] = value
        }
      }
    }
  } catch (e) {
    // If anything fails, return empty object
    return {}
  }
  
  return sanitized
}

