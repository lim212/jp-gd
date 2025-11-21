import { defineEventHandler, getCookie, setCookie } from 'h3'
import { useStorage } from '#imports'
import { sanitizeResponse } from '../utils/safe-response'

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
    // Safely get storage with error handling
    let storage: any = null
    try {
      storage = useStorage()
    } catch (e) {
      storage = null
    }
    
    if (!storage) {
      // Fallback if storage is not available
      const dateInfo = getJakartaDate()
      return {
        success: true,
        date: String(dateInfo.dateStr),
        total: 0,
        unique: 0,
        isNewVisitor: false
      }
    }
    
    const { dateStr } = getJakartaDate()
    
    // Get or create today's visitor data
    const key = `visitors:${dateStr}`
    let todayData: any = null
    
    try {
      todayData = await storage.getItem(key)
    } catch (e) {
      todayData = null
    }
    
    // Ensure todayData is a valid object
    if (!todayData || typeof todayData !== 'object' || Array.isArray(todayData)) {
      todayData = { count: 0, unique: 0, lastUpdate: Date.now() }
    }
    
    // Ensure numeric properties exist
    if (typeof todayData.count !== 'number') todayData.count = 0
    if (typeof todayData.unique !== 'number') todayData.unique = 0
    
    // Check if this is a unique visitor (simple cookie-based tracking)
    let visitorId: string | null = null
    try {
      visitorId = getCookie(event, 'visitor_id')
    } catch (e) {
      visitorId = null
    }
    
    let isUnique = false
    
    if (!visitorId) {
      // New visitor
      try {
        const newVisitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        setCookie(event, 'visitor_id', newVisitorId, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          httpOnly: true,
          sameSite: 'lax'
        })
        isUnique = true
        todayData.unique += 1
      } catch (e) {
        // Ignore cookie errors
      }
    }
    
    // Increment total count
    todayData.count += 1
    todayData.lastUpdate = Date.now()
    
    // Save updated data
    try {
      await storage.setItem(key, todayData)
    } catch (e) {
      // Ignore save errors
    }
    
    // Ensure all return values are primitives
    const response = {
      success: true,
      date: String(dateStr),
      total: Number(todayData.count),
      unique: Number(todayData.unique),
      isNewVisitor: Boolean(isUnique)
    }
    
    // Sanitize response to ensure no null/undefined nested objects
    return sanitizeResponse(response)
  } catch (error) {
    // Return safe fallback response
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const dateInfo = getJakartaDate()
    const fallback = {
      success: false,
      error: String(errorMessage),
      date: String(dateInfo.dateStr),
      total: 0,
      unique: 0,
      isNewVisitor: false
    }
    return sanitizeResponse(fallback)
  }
})
