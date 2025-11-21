// server/api/smart-reload-tracker.post.ts
// Smart reload tracking system to prevent infinite reload loops
import { defineEventHandler, readBody } from 'h3'
import { getClientIp } from '../utils/ip'
import { useStorage } from '#imports'

interface ReloadAttempt {
  count: number
  firstAttempt: number
  lastAttempt: number
  blocked: boolean
  blockReason?: string
}

interface ReloadTracker {
  [ip: string]: ReloadAttempt
}

const RELOAD_LIMIT = 3 // Maximum reload attempts per IP
const BLOCK_DURATION = 30 * 60 * 1000 // 30 minutes block duration
const RESET_DURATION = 60 * 60 * 1000 // 1 hour reset duration

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { action, pageUrl, userAgent, timestamp } = body
    
    const clientIp = getClientIp(event) || 'unknown'
    const storage = useStorage()
    
    // Get current tracker data
    let tracker: ReloadTracker = {}
    try {
      const stored = await storage.getItem('smart-reload-tracker')
      if (stored) {
        tracker = JSON.parse(stored as string)
      }
    } catch (error) {
      console.warn('Failed to load reload tracker:', error)
    }
    
    const now = Date.now()
    const ipKey = clientIp
    
    // Initialize or get existing record for this IP
    if (!tracker[ipKey]) {
      tracker[ipKey] = {
        count: 0,
        firstAttempt: now,
        lastAttempt: now,
        blocked: false
      }
    }
    
    const record = tracker[ipKey]
    
    // Check if IP is currently blocked
    if (record.blocked) {
      const blockAge = now - record.lastAttempt
      if (blockAge < BLOCK_DURATION) {
        return {
          success: false,
          blocked: true,
          reason: 'IP blocked due to excessive reload attempts',
          blockExpires: new Date(record.lastAttempt + BLOCK_DURATION).toISOString(),
          remainingTime: Math.ceil((BLOCK_DURATION - blockAge) / 1000)
        }
      } else {
        // Block expired, reset the record
        record.blocked = false
        record.count = 0
        record.firstAttempt = now
        record.lastAttempt = now
        delete record.blockReason
      }
    }
    
    // Check if we should reset the counter (1 hour has passed since first attempt)
    const timeSinceFirst = now - record.firstAttempt
    if (timeSinceFirst > RESET_DURATION) {
      record.count = 0
      record.firstAttempt = now
      record.lastAttempt = now
      record.blocked = false
      delete record.blockReason
    }
    
    // Handle different actions
    switch (action) {
      case 'check':
        // Check if reload is allowed
        const canReload = record.count < RELOAD_LIMIT && !record.blocked
        return {
          success: true,
          canReload,
          attemptsRemaining: Math.max(0, RELOAD_LIMIT - record.count),
          totalAttempts: record.count,
          blocked: record.blocked,
          blockReason: record.blockReason,
          resetTime: new Date(record.firstAttempt + RESET_DURATION).toISOString()
        }
        
      case 'attempt':
        // Record a reload attempt
        record.count++
        record.lastAttempt = now
        
        // Check if we should block this IP
        if (record.count >= RELOAD_LIMIT) {
          record.blocked = true
          record.blockReason = `Exceeded ${RELOAD_LIMIT} reload attempts in ${Math.round(timeSinceFirst / 1000 / 60)} minutes`
          
          // Log the blocking event
          console.warn(`🚫 IP ${clientIp} blocked due to excessive reload attempts:`, {
            count: record.count,
            timeSpan: Math.round(timeSinceFirst / 1000 / 60),
            pageUrl,
            userAgent: userAgent?.substring(0, 100)
          })
        }
        
        // Save updated tracker
        try {
          await storage.setItem('smart-reload-tracker', JSON.stringify(tracker))
        } catch (error) {
          console.warn('Failed to save reload tracker:', error)
        }
        
        return {
          success: true,
          attemptRecorded: true,
          totalAttempts: record.count,
          blocked: record.blocked,
          blockReason: record.blockReason,
          attemptsRemaining: Math.max(0, RELOAD_LIMIT - record.count)
        }
        
      case 'reset':
        // Reset attempts for this IP (admin action)
        record.count = 0
        record.firstAttempt = now
        record.lastAttempt = now
        record.blocked = false
        delete record.blockReason
        
        try {
          await storage.setItem('smart-reload-tracker', JSON.stringify(tracker))
        } catch (error) {
          console.warn('Failed to save reload tracker:', error)
        }
        
        return {
          success: true,
          reset: true,
          message: 'Reload attempts reset for this IP'
        }
        
      default:
        return {
          success: false,
          error: 'Invalid action. Use: check, attempt, or reset'
        }
    }
    
  } catch (error) {
    console.error('Smart reload tracker error:', error)
    return {
      success: false,
      error: 'Internal server error',
      details: error.message
    }
  }
})
