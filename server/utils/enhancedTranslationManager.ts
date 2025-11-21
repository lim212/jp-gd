/**
 * Enhanced Translation Manager
 * 
 * Fitur:
 * - Auto-detect halaman baru setiap hari
 * - Scan content otomatis
 * - Queue management untuk translation
 * - Retry logic untuk translation yang gagal
 * - Real-time translation untuk konten urgent
 * - Smart caching dan optimization
 */

import { readdir, readFile, stat } from 'fs/promises'
import { join } from 'path'
import { translateMissingIdToEn, type TranslateSummary } from './i18nAuto'
import { readLocale, writeLocale, readMeta, writeMeta, buildMetaFromId } from './i18nStore'
import { createHash } from 'crypto'

interface PageInfo {
  path: string
  hash: string
  lastDetected: number
  lastTranslated?: number
  translationStatus: 'pending' | 'translated' | 'failed'
  retryCount: number
  error?: string
}

interface TranslationQueue {
  pages: Map<string, PageInfo>
  lastScan: number
  lastTranslation: number
}

const QUEUE_FILE = 'data/translation-queue.json'
const MAX_RETRY = 3
const SCAN_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours

export class EnhancedTranslationManager {
  private queue: TranslationQueue = {
    pages: new Map(),
    lastScan: 0,
    lastTranslation: 0
  }

  constructor() {
    this.loadQueue()
  }

  /**
   * Load queue from disk
   */
  private async loadQueue() {
    try {
      const data = await readFile(QUEUE_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      this.queue = {
        pages: new Map(Object.entries(parsed.pages || {})),
        lastScan: parsed.lastScan || 0,
        lastTranslation: parsed.lastTranslation || 0
      }
    } catch {
      // File doesn't exist yet, use defaults
      this.queue = {
        pages: new Map(),
        lastScan: 0,
        lastTranslation: 0
      }
    }
  }

  /**
   * Save queue to disk
   */
  private async saveQueue() {
    try {
      const data = {
        pages: (this.queue.pages && this.queue.pages instanceof Map)
          ? Object.fromEntries(this.queue.pages)
          : {},
        lastScan: this.queue.lastScan,
        lastTranslation: this.queue.lastTranslation,
        savedAt: new Date().toISOString()
      }
      const { writeFile, mkdir } = await import('fs/promises')
      await mkdir('data', { recursive: true })
      await writeFile(QUEUE_FILE, JSON.stringify(data, null, 2), 'utf-8')
    } catch (e) {
      console.error('[TranslationManager] Failed to save queue:', e)
    }
  }

  /**
   * Generate hash for content
   */
  private generateHash(content: string): string {
    return createHash('sha256').update(content).digest('hex').substring(0, 16)
  }

  /**
   * Scan all pages directory for new/changed content
   */
  async scanAllPages(): Promise<{ scanned: number; new: number; changed: number }> {
    console.log('[TranslationManager] Starting page scan...')
    
    let scanned = 0
    let newPages = 0
    let changed = 0

    try {
      const pagesDir = join(process.cwd(), 'app', 'pages')
      const files = await this.scanDirectory(pagesDir, '.vue')
      
      for (const file of files) {
        try {
          const content = await readFile(file, 'utf-8')
          const hash = this.generateHash(content)
          const relativePath = file.replace(process.cwd(), '').replace(/\\/g, '/')
          
          scanned++
          
          const existing = this.queue.pages.get(relativePath)
          
          if (!existing) {
            // New page detected
            this.queue.pages.set(relativePath, {
              path: relativePath,
              hash,
              lastDetected: Date.now(),
              translationStatus: 'pending',
              retryCount: 0
            })
            newPages++
            console.log(`[TranslationManager] New page detected: ${relativePath}`)
          } else if (existing.hash !== hash) {
            // Content changed
            existing.hash = hash
            existing.lastDetected = Date.now()
            existing.translationStatus = 'pending'
            existing.retryCount = 0
            changed++
            console.log(`[TranslationManager] Page changed: ${relativePath}`)
          }
        } catch (e) {
          console.warn(`[TranslationManager] Failed to scan file ${file}:`, e)
        }
      }

      // Also scan components that might have translatable content
      const componentsDir = join(process.cwd(), 'app', 'components')
      const componentFiles = await this.scanDirectory(componentsDir, '.vue')
      
      for (const file of componentFiles) {
        try {
          const content = await readFile(file, 'utf-8')
          // Only track components with i18n content
          if (content.includes('$t(') || content.includes('useI18n')) {
            const hash = this.generateHash(content)
            const relativePath = file.replace(process.cwd(), '').replace(/\\/g, '/')
            
            scanned++
            
            const existing = this.queue.pages.get(relativePath)
            
            if (!existing) {
              this.queue.pages.set(relativePath, {
                path: relativePath,
                hash,
                lastDetected: Date.now(),
                translationStatus: 'pending',
                retryCount: 0
              })
              newPages++
            } else if (existing.hash !== hash) {
              existing.hash = hash
              existing.lastDetected = Date.now()
              existing.translationStatus = 'pending'
              existing.retryCount = 0
              changed++
            }
          }
        } catch (e) {
          console.warn(`[TranslationManager] Failed to scan component ${file}:`, e)
        }
      }

      this.queue.lastScan = Date.now()
      await this.saveQueue()
      
      console.log(`[TranslationManager] Scan complete: ${scanned} files, ${newPages} new, ${changed} changed`)
      
      return { scanned, new: newPages, changed }
    } catch (e) {
      console.error('[TranslationManager] Scan failed:', e)
      return { scanned: 0, new: 0, changed: 0 }
    }
  }

  /**
   * Recursively scan directory for files with specific extension
   */
  private async scanDirectory(dir: string, ext: string): Promise<string[]> {
    const files: string[] = []
    
    try {
      const entries = await readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        
        if (entry.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath, ext)
          files.push(...subFiles)
        } else if (entry.isFile() && entry.name.endsWith(ext)) {
          files.push(fullPath)
        }
      }
    } catch (e) {
      // Directory might not exist
    }
    
    return files
  }

  /**
   * Run translation for all pending pages
   */
  async translatePending(): Promise<TranslateSummary & { processedPages: number }> {
    console.log('[TranslationManager] Starting translation of pending items...')
    
    const pending = Array.from(this.queue.pages.values()).filter(
      p => p.translationStatus === 'pending' && p.retryCount < MAX_RETRY
    )
    
    if (pending.length === 0) {
      console.log('[TranslationManager] No pending translations')
      return {
        translatedCount: 0,
        missingCount: 0,
        changedCount: 0,
        skipped: false,
        updated: false,
        processedPages: 0
      }
    }
    
    console.log(`[TranslationManager] Found ${pending.length} pending items`)
    
    try {
      // Run the main translation
      const result = await translateMissingIdToEn()
      
      if (result.skipped) {
        console.log(`[TranslationManager] Translation skipped: ${result.reason}`)
        return { ...result, processedPages: 0 }
      }
      
      // Mark pages as translated
      let processedPages = 0
      for (const page of pending) {
        const pageInfo = this.queue.pages.get(page.path)
        if (pageInfo) {
          pageInfo.translationStatus = 'translated'
          pageInfo.lastTranslated = Date.now()
          pageInfo.retryCount = 0
          processedPages++
        }
      }
      
      this.queue.lastTranslation = Date.now()
      await this.saveQueue()
      
      console.log(`[TranslationManager] Translation complete: ${result.translatedCount} keys translated, ${processedPages} pages processed`)
      
      return {
        ...result,
        processedPages
      }
    } catch (e: any) {
      console.error('[TranslationManager] Translation failed:', e)
      
      // Mark failed pages and increment retry count
      for (const page of pending) {
        const pageInfo = this.queue.pages.get(page.path)
        if (pageInfo) {
          pageInfo.translationStatus = 'failed'
          pageInfo.retryCount++
          pageInfo.error = e?.message || 'Unknown error'
        }
      }
      
      await this.saveQueue()
      
      throw e
    }
  }

  /**
   * Force immediate translation (for urgent content)
   */
  async translateImmediate(): Promise<TranslateSummary> {
    console.log('[TranslationManager] Running immediate translation...')
    
    try {
      const result = await translateMissingIdToEn()
      
      // Update all pending pages
      for (const [path, page] of this.queue.pages.entries()) {
        if (page.translationStatus === 'pending') {
          page.translationStatus = 'translated'
          page.lastTranslated = Date.now()
          page.retryCount = 0
        }
      }
      
      this.queue.lastTranslation = Date.now()
      await this.saveQueue()
      
      return result
    } catch (e) {
      console.error('[TranslationManager] Immediate translation failed:', e)
      throw e
    }
  }

  /**
   * Get queue statistics
   */
  getStats() {
    const pages = Array.from(this.queue.pages.values())
    
    return {
      totalPages: pages.length,
      pending: pages.filter(p => p.translationStatus === 'pending').length,
      translated: pages.filter(p => p.translationStatus === 'translated').length,
      failed: pages.filter(p => p.translationStatus === 'failed').length,
      lastScan: this.queue.lastScan,
      lastTranslation: this.queue.lastTranslation,
      needsScan: Date.now() - this.queue.lastScan > SCAN_INTERVAL
    }
  }

  /**
   * Get pending pages list
   */
  getPendingPages() {
    return Array.from(this.queue.pages.values())
      .filter(p => p.translationStatus === 'pending')
      .map(p => ({
        path: p.path,
        lastDetected: new Date(p.lastDetected).toISOString(),
        retryCount: p.retryCount
      }))
  }

  /**
   * Get failed pages list
   */
  getFailedPages() {
    return Array.from(this.queue.pages.values())
      .filter(p => p.translationStatus === 'failed')
      .map(p => ({
        path: p.path,
        lastDetected: new Date(p.lastDetected).toISOString(),
        retryCount: p.retryCount,
        error: p.error
      }))
  }

  /**
   * Retry failed translations
   */
  async retryFailed(): Promise<TranslateSummary & { retriedPages: number }> {
    console.log('[TranslationManager] Retrying failed translations...')
    
    const failed = Array.from(this.queue.pages.values()).filter(
      p => p.translationStatus === 'failed' && p.retryCount < MAX_RETRY
    )
    
    if (failed.length === 0) {
      return {
        translatedCount: 0,
        missingCount: 0,
        changedCount: 0,
        skipped: false,
        updated: false,
        retriedPages: 0
      }
    }
    
    // Reset to pending
    for (const page of failed) {
      const pageInfo = this.queue.pages.get(page.path)
      if (pageInfo) {
        pageInfo.translationStatus = 'pending'
      }
    }
    
    // Try translation again
    const result = await this.translatePending()
    
    return {
      ...result,
      retriedPages: failed.length
    }
  }

  /**
   * Clean old entries (older than X days)
   */
  async cleanOld(days: number = 30) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000)
    let cleaned = 0
    
    for (const [path, page] of this.queue.pages.entries()) {
      if (page.lastDetected < cutoff && page.translationStatus === 'translated') {
        this.queue.pages.delete(path)
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      await this.saveQueue()
      console.log(`[TranslationManager] Cleaned ${cleaned} old entries`)
    }
    
    return cleaned
  }

  /**
   * Register a single page manually
   */
  async registerPage(path: string, content: string) {
    const hash = this.generateHash(content)
    const existing = this.queue.pages.get(path)
    
    if (!existing || existing.hash !== hash) {
      this.queue.pages.set(path, {
        path,
        hash,
        lastDetected: Date.now(),
        translationStatus: 'pending',
        retryCount: 0
      })
      
      await this.saveQueue()
      
      console.log(`[TranslationManager] Page registered: ${path}`)
      return true
    }
    
    return false
  }
}

// Singleton instance
let managerInstance: EnhancedTranslationManager | null = null

export function getTranslationManager(): EnhancedTranslationManager {
  if (!managerInstance) {
    managerInstance = new EnhancedTranslationManager()
  }
  return managerInstance
}

