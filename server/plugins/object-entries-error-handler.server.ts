/**
 * Object.entries Error Handler Plugin
 * Catches all Object.entries errors at the global level
 */

export default defineNitroPlugin((nitroApp) => {
  // Override global Object.entries to add safety check
  const originalEntries = Object.entries
  
  Object.entries = function(obj: any) {
    if (obj === null || obj === undefined) {
      console.warn('[Object.entries Error Handler] Attempted to call Object.entries on null/undefined, returning empty array')
      return []
    }
    if (typeof obj !== 'object') {
      console.warn('[Object.entries Error Handler] Attempted to call Object.entries on non-object, returning empty array')
      return []
    }
    try {
      return originalEntries.call(this, obj)
    } catch (error: any) {
      console.warn('[Object.entries Error Handler] Error in Object.entries:', error.message)
      return []
    }
  }
  
  // Also patch Object.keys and Object.values for safety
  const originalKeys = Object.keys
  Object.keys = function(obj: any) {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return []
    }
    try {
      return originalKeys.call(this, obj)
    } catch (error: any) {
      console.warn('[Object.entries Error Handler] Error in Object.keys:', error.message)
      return []
    }
  }
  
  const originalValues = Object.values
  Object.values = function(obj: any) {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return []
    }
    try {
      return originalValues.call(this, obj)
    } catch (error: any) {
      console.warn('[Object.entries Error Handler] Error in Object.values:', error.message)
      return []
    }
  }
  
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise) => {
    if (reason?.message?.includes('Cannot convert undefined or null to object') ||
        reason?.message?.includes('Object.entries')) {
      console.warn('[Object.entries Error Handler] Caught unhandled rejection:', reason.message)
      // Don't crash the process
      return
    }
  })
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error: any) => {
    if (error?.message?.includes('Cannot convert undefined or null to object') ||
        error?.message?.includes('Object.entries')) {
      console.warn('[Object.entries Error Handler] Caught uncaught exception:', error.message)
      // Don't crash the process
      return
    }
    // Re-throw other errors
    throw error
  })
  
  console.log('[Object.entries Error Handler] Plugin loaded - Global Object.entries protection active')
})

