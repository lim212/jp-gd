export default defineEventHandler(async (event) => {
  try {
    // Return visitor count to prevent Vue Router warnings
    // Ensure we return a valid object to prevent Object.entries errors
    const response = {
      count: 0,
      timestamp: Date.now()
    }
    
    // Ensure response is a plain object (not null/undefined)
    if (!response || typeof response !== 'object') {
      return {
        count: 0,
        timestamp: Date.now()
      }
    }
    
    return response
  } catch (error) {
    // Fallback response if anything fails
    return {
      count: 0,
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
})
