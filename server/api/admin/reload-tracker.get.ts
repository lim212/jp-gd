// server/api/admin/reload-tracker.get.ts
// Admin endpoint to view and manage reload tracking data
import { defineEventHandler, getQuery } from 'h3'
import { getClientIp } from '../../utils/ip'
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

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const action = query.action as string || 'view'
    const clientIp = getClientIp(event) || 'unknown'
    
    // Basic admin check (you can enhance this with proper authentication)
    const adminKey = query.key as string
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      return {
        success: false,
        error: 'Unauthorized access'
      }
    }
    
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
    
    switch (action) {
      case 'view':
        // Return all tracking data with formatted information
        const formattedData = Object.entries(tracker || {}).map(([ip, data]) => ({
          ip,
          count: data.count,
          firstAttempt: new Date(data.firstAttempt).toISOString(),
          lastAttempt: new Date(data.lastAttempt).toISOString(),
          blocked: data.blocked,
          blockReason: data.blockReason,
          timeSinceFirst: Math.round((now - data.firstAttempt) / 1000 / 60), // minutes
          timeSinceLast: Math.round((now - data.lastAttempt) / 1000 / 60), // minutes
          blockExpires: data.blocked ? new Date(data.lastAttempt + (30 * 60 * 1000)).toISOString() : null
        }))
        
        return {
          success: true,
          data: formattedData,
          summary: {
            totalIPs: Object.keys(tracker || {}).length,
            blockedIPs: Object.values(tracker || {}).filter(d => d.blocked).length,
            activeIPs: Object.values(tracker || {}).filter(d => !d.blocked).length,
            totalAttempts: Object.values(tracker || {}).reduce((sum, d) => sum + d.count, 0)
          }
        }
        
      case 'blocked':
        // Return only blocked IPs
        const blockedIPs = Object.entries(tracker || {})
          .filter(([ip, data]) => data.blocked)
          .map(([ip, data]) => ({
            ip,
            count: data.count,
            blockReason: data.blockReason,
            blockTime: new Date(data.lastAttempt).toISOString(),
            blockExpires: new Date(data.lastAttempt + (30 * 60 * 1000)).toISOString(),
            remainingTime: Math.max(0, Math.ceil(((data.lastAttempt + (30 * 60 * 1000)) - now) / 1000 / 60))
          }))
        
        return {
          success: true,
          blockedIPs,
          count: blockedIPs.length
        }
        
      case 'reset':
        // Reset all tracking data
        const targetIp = query.ip as string
        if (targetIp) {
          // Reset specific IP
          if (tracker[targetIp]) {
            tracker[targetIp] = {
              count: 0,
              firstAttempt: now,
              lastAttempt: now,
              blocked: false
            }
            delete tracker[targetIp].blockReason
          }
        } else {
          // Reset all IPs
          tracker = {}
        }
        
        try {
          await storage.setItem('smart-reload-tracker', JSON.stringify(tracker))
        } catch (error) {
          console.warn('Failed to save reload tracker:', error)
        }
        
        return {
          success: true,
          message: targetIp ? `Reset data for IP: ${targetIp}` : 'Reset all tracking data',
          resetIP: targetIp || 'all'
        }
        
      case 'unblock':
        // Unblock specific IP
        const unblockIp = query.ip as string
        if (!unblockIp) {
          return {
            success: false,
            error: 'IP address required for unblock action'
          }
        }
        
        if (tracker[unblockIp]) {
          tracker[unblockIp].blocked = false
          tracker[unblockIp].count = 0
          tracker[unblockIp].firstAttempt = now
          tracker[unblockIp].lastAttempt = now
          delete tracker[unblockIp].blockReason
        }
        
        try {
          await storage.setItem('smart-reload-tracker', JSON.stringify(tracker))
        } catch (error) {
          console.warn('Failed to save reload tracker:', error)
        }
        
        return {
          success: true,
          message: `Unblocked IP: ${unblockIp}`,
          unblockedIP: unblockIp
        }
        
      case 'stats':
        // Return statistics
        const safeTracker = tracker || {}
        const stats = {
          totalIPs: Object.keys(safeTracker).length,
          blockedIPs: Object.values(safeTracker).filter(d => d.blocked).length,
          activeIPs: Object.values(safeTracker).filter(d => !d.blocked).length,
          totalAttempts: Object.values(safeTracker).reduce((sum, d) => sum + d.count, 0),
          averageAttempts: Object.keys(safeTracker).length > 0 
            ? Math.round(Object.values(safeTracker).reduce((sum, d) => sum + d.count, 0) / Object.keys(safeTracker).length * 100) / 100
            : 0,
          topOffenders: Object.entries(safeTracker)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 10)
            .map(([ip, data]) => ({
              ip,
              count: data.count,
              blocked: data.blocked,
              lastAttempt: new Date(data.lastAttempt).toISOString()
            }))
        }
        
        return {
          success: true,
          stats
        }
        
      default:
        return {
          success: false,
          error: 'Invalid action. Use: view, blocked, reset, unblock, or stats'
        }
    }
    
  } catch (error) {
    console.error('Admin reload tracker error:', error)
    return {
      success: false,
      error: 'Internal server error',
      details: error.message
    }
  }
})
