import { defineEventHandler, readBody } from 'h3'
import { useStorage } from '#imports'

// Helper: Asia/Jakarta date parts
function getJakartaDate() {
  const now = new Date()
  const j = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
  const y = j.getFullYear()
  const m = j.getMonth() + 1
  const d = j.getDate()
  return { year: y, month: m, day: d, dateStr: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const action = body?.action || 'hit'
    
    // Just acknowledge the request - no need to process it
    // The main tracking is handled by visitors.ts (GET handler)
    return {
      success: true,
      action,
      timestamp: Date.now()
    }
  } catch (error) {
    // Return safe fallback response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    }
  }
})

