// server/plugins/i18n-cron.server.ts
// Enhanced automatic i18n sync scheduler
// 
// Features:
// - Runs daily at 02:00 WIB (consistent time)
// - Auto-detects new pages via enhanced translation manager
// - Scans all pages for changes
// - Translates pending content
// - Cleans old cache
// - Retry failed translations
// - Generates HTML snapshots
// - Comprehensive logging

import { writeAllSnapshots } from '../utils/i18nSnapshot'
import { getTranslationManager } from '../utils/enhancedTranslationManager'

function msUntilNext(hour: number, minute: number) {
  const now = new Date()
  const next = new Date(now)
  next.setHours(hour, minute, 0, 0)
  if (next <= now) next.setDate(next.getDate() + 1)
  return next.getTime() - now.getTime()
}

/**
 * Main scheduled sync function
 * Runs comprehensive translation workflow
 */
async function runScheduledSync() {
  const startTime = Date.now()
  const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
  
  console.log('\n' + '='.repeat(80))
  console.log(`[i18n-cron] 🚀 Starting scheduled translation sync at ${timestamp} WIB`)
  console.log('='.repeat(80) + '\n')
  
  const results: any = {
    started: timestamp,
    steps: {}
  }

  // Step 1: Scan all pages for new/changed content
  try {
    console.log('[i18n-cron] 📂 Step 1: Scanning all pages for changes...')
    const manager = getTranslationManager()
    const scanResult = await manager.scanAllPages()
    
    results.steps.scan = {
      success: true,
      scanned: scanResult.scanned,
      new: scanResult.new,
      changed: scanResult.changed
    }
    
    console.log(`[i18n-cron] ✅ Scan complete: ${scanResult.scanned} files, ${scanResult.new} new, ${scanResult.changed} changed`)
  } catch (e: any) {
    console.error('[i18n-cron] ❌ Scan failed:', e?.message || e)
    results.steps.scan = {
      success: false,
      error: e?.message || 'Unknown error'
    }
  }

  // Step 2: Get current stats
  try {
    console.log('\n[i18n-cron] 📊 Step 2: Checking translation stats...')
    const manager = getTranslationManager()
    const stats = manager.getStats()
    
    results.steps.stats = {
      success: true,
      ...stats,
      lastScanFormatted: stats.lastScan ? new Date(stats.lastScan).toLocaleString('id-ID') : 'never',
      lastTranslationFormatted: stats.lastTranslation ? new Date(stats.lastTranslation).toLocaleString('id-ID') : 'never'
    }
    
    console.log('[i18n-cron] 📊 Stats:', {
      total: stats.totalPages,
      pending: stats.pending,
      translated: stats.translated,
      failed: stats.failed
    })
  } catch (e: any) {
    console.error('[i18n-cron] ❌ Stats check failed:', e?.message || e)
    results.steps.stats = {
      success: false,
      error: e?.message || 'Unknown error'
    }
  }

  // Step 3: Retry failed translations
  try {
    console.log('\n[i18n-cron] 🔄 Step 3: Retrying failed translations...')
    const manager = getTranslationManager()
    const failedPages = manager.getFailedPages()
    
    if (failedPages.length > 0) {
      console.log(`[i18n-cron] Found ${failedPages.length} failed pages, retrying...`)
      const retryResult = await manager.retryFailed()
      
      results.steps.retry = {
        success: true,
        retriedPages: retryResult.retriedPages,
        translatedCount: retryResult.translatedCount
      }
      
      console.log(`[i18n-cron] ✅ Retry complete: ${retryResult.retriedPages} pages retried, ${retryResult.translatedCount} keys translated`)
    } else {
      console.log('[i18n-cron] ✅ No failed translations to retry')
      results.steps.retry = {
        success: true,
        retriedPages: 0,
        translatedCount: 0
      }
    }
  } catch (e: any) {
    console.error('[i18n-cron] ❌ Retry failed:', e?.message || e)
    results.steps.retry = {
      success: false,
      error: e?.message || 'Unknown error'
    }
  }

  // Step 4: Translate pending content
  try {
    console.log('\n[i18n-cron] 🌐 Step 4: Translating pending content...')
    const manager = getTranslationManager()
    const translateResult = await manager.translatePending()
    
    if (translateResult.skipped) {
      console.log(`[i18n-cron] ⏭️ Translation skipped: ${translateResult.reason}`)
      results.steps.translate = {
        success: false,
        skipped: true,
        reason: translateResult.reason
      }
    } else {
      results.steps.translate = {
        success: true,
        translatedCount: translateResult.translatedCount,
        missingCount: translateResult.missingCount,
        changedCount: translateResult.changedCount,
        processedPages: translateResult.processedPages,
        updated: translateResult.updated
      }
      
      console.log(`[i18n-cron] ✅ Translation complete:`, {
        translated: translateResult.translatedCount,
        missing: translateResult.missingCount,
        changed: translateResult.changedCount,
        pages: translateResult.processedPages
      })
    }
  } catch (e: any) {
    console.error('[i18n-cron] ❌ Translation failed:', e?.message || e)
    results.steps.translate = {
      success: false,
      error: e?.message || 'Unknown error'
    }
  }

  // Step 5: Clean old cache
  try {
    console.log('\n[i18n-cron] 🧹 Step 5: Cleaning old cache (30+ days)...')
    const manager = getTranslationManager()
    const cleaned = await manager.cleanOld(30)
    
    results.steps.cleanup = {
      success: true,
      cleaned
    }
    
    console.log(`[i18n-cron] ✅ Cleanup complete: ${cleaned} old entries removed`)
  } catch (e: any) {
    console.error('[i18n-cron] ❌ Cleanup failed:', e?.message || e)
    results.steps.cleanup = {
      success: false,
      error: e?.message || 'Unknown error'
    }
  }

  // Step 6: Write HTML snapshots
  try {
    console.log('\n[i18n-cron] 📸 Step 6: Writing HTML snapshots...')
    const files = await writeAllSnapshots()
    
    results.steps.snapshots = {
      success: true,
      files: files.length
    }
    
    console.log(`[i18n-cron] ✅ Snapshots written: ${files.length} files`)
  } catch (e: any) {
    console.error('[i18n-cron] ❌ Snapshot generation failed:', e?.message || e)
    results.steps.snapshots = {
      success: false,
      error: e?.message || 'Unknown error'
    }
  }

  // Summary
  const duration = Date.now() - startTime
  results.completed = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
  results.durationMs = duration
  results.durationFormatted = `${Math.round(duration / 1000)}s`
  
  console.log('\n' + '='.repeat(80))
  console.log(`[i18n-cron] ✅ Scheduled sync completed in ${results.durationFormatted}`)
  console.log('='.repeat(80) + '\n')
  
  return results
}

export default defineNitroPlugin(() => {
  // Check if running in dev mode
  const isDev = process.env.NODE_ENV === 'development' || process.env.NUXT_DEV === 'true'
  const allowDevCron = process.env.ENABLE_DEV_CRON === 'true'
  
  if (isDev && !allowDevCron) {
    console.log('[i18n-cron] 🛑 Dev mode detected — scheduler disabled')
    console.log('[i18n-cron] 💡 To enable in dev: set ENABLE_DEV_CRON=true')
    return
  }

  // Check if scheduler is explicitly disabled
  const disabled = String(process.env.NUXT_ENABLE_SCHEDULER || '').toLowerCase() === 'false'
  if (disabled) {
    console.log('[i18n-cron] 🛑 Scheduler disabled by NUXT_ENABLE_SCHEDULER=false')
    return
  }

  // Schedule to run at 02:00 WIB daily
  const SCHEDULE_HOUR = 2
  const SCHEDULE_MINUTE = 0
  const initialDelay = msUntilNext(SCHEDULE_HOUR, SCHEDULE_MINUTE)
  const nextRun = new Date(Date.now() + initialDelay).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })
  
  console.log('\n' + '='.repeat(80))
  console.log('[i18n-cron] 🕐 Enhanced Translation Scheduler Initialized')
  console.log('='.repeat(80))
  console.log(`[i18n-cron] ⏰ Scheduled time: ${SCHEDULE_HOUR.toString().padStart(2, '0')}:${SCHEDULE_MINUTE.toString().padStart(2, '0')} WIB (daily)`)
  console.log(`[i18n-cron] 📅 Next run: ${nextRun}`)
  console.log(`[i18n-cron] ⏱️  Time until next run: ${Math.round(initialDelay / 1000 / 60)} minutes`)
  console.log('='.repeat(80) + '\n')

  // Set initial timer
  setTimeout(async () => {
    // Run first sync
    await runScheduledSync()
    
    // Then run every 24 hours
    const dayMs = 24 * 60 * 60 * 1000
    setInterval(async () => {
      await runScheduledSync()
    }, dayMs)
  }, initialDelay)
})
