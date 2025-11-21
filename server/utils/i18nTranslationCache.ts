/**
 * Smart Translation Cache System
 * Manages translation cache and tracks new pages/content
 */

import { promises as fs } from 'fs'
import path from 'path'

const projectRoot = process.cwd()
const cacheDir = path.join(projectRoot, 'data', 'i18n-cache')
const pageCacheFile = path.join(cacheDir, 'page-translations.json')
const statsFile = path.join(cacheDir, 'translation-stats.json')

interface PageTranslation {
  path: string
  locale: 'id' | 'en'
  content: Record<string, any>
  lastUpdated: number
  translationStatus: 'pending' | 'completed' | 'failed'
  hash?: string
}

interface TranslationStats {
  totalPages: number
  translatedPages: number
  pendingPages: number
  lastSync: number
  lastCheck: number
  history: Array<{
    timestamp: number
    action: string
    details: any
  }>
}

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {}
}

async function readJSON<T>(file: string, defaultValue: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

async function writeJSON(file: string, data: any) {
  await ensureDir(path.dirname(file))
  const tmp = `${file}.tmp`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
  await fs.rename(tmp, file)
}

export class TranslationCacheManager {
  private pageCache: Map<string, PageTranslation> = new Map()
  private stats: TranslationStats = {
    totalPages: 0,
    translatedPages: 0,
    pendingPages: 0,
    lastSync: 0,
    lastCheck: 0,
    history: []
  }

  async initialize() {
    await ensureDir(cacheDir)
    
    // Load page cache
    const pages = await readJSON<PageTranslation[]>(pageCacheFile, [])
    pages.forEach(page => {
      this.pageCache.set(`${page.path}:${page.locale}`, page)
    })

    // Load stats
    this.stats = await readJSON<TranslationStats>(statsFile, this.stats)
    
    console.log('[TranslationCache] Initialized with', pages.length, 'cached pages')
  }

  async saveCache() {
    const pages = Array.from(this.pageCache.values())
    await writeJSON(pageCacheFile, pages)
    await writeJSON(statsFile, this.stats)
  }

  /**
   * Register a new page or content that needs translation
   */
  async registerPage(pagePath: string, locale: 'id' | 'en', content: Record<string, any>) {
    const key = `${pagePath}:${locale}`
    const hash = this.hashContent(content)
    
    const existing = this.pageCache.get(key)
    
    // Check if content has changed
    if (existing && existing.hash === hash) {
      return false // No changes
    }

    const pageTranslation: PageTranslation = {
      path: pagePath,
      locale,
      content,
      lastUpdated: Date.now(),
      translationStatus: locale === 'id' ? 'completed' : 'pending',
      hash
    }

    this.pageCache.set(key, pageTranslation)
    
    // Update stats
    this.stats.totalPages = this.pageCache.size
    this.stats.pendingPages = Array.from(this.pageCache.values())
      .filter(p => p.translationStatus === 'pending').length
    this.stats.translatedPages = Array.from(this.pageCache.values())
      .filter(p => p.translationStatus === 'completed').length

    // Log to history
    this.stats.history.push({
      timestamp: Date.now(),
      action: existing ? 'update' : 'register',
      details: { path: pagePath, locale, status: pageTranslation.translationStatus }
    })

    // Keep only last 100 history items
    if (this.stats.history.length > 100) {
      this.stats.history = this.stats.history.slice(-100)
    }

    await this.saveCache()
    
    console.log('[TranslationCache] Registered page:', pagePath, locale, '- status:', pageTranslation.translationStatus)
    
    return true // Changes detected
  }

  /**
   * Get pages that need translation
   */
  getPendingPages(): PageTranslation[] {
    return Array.from(this.pageCache.values())
      .filter(p => p.translationStatus === 'pending')
  }

  /**
   * Mark page as translated
   */
  async markAsTranslated(pagePath: string, locale: 'id' | 'en') {
    const key = `${pagePath}:${locale}`
    const page = this.pageCache.get(key)
    
    if (page) {
      page.translationStatus = 'completed'
      page.lastUpdated = Date.now()
      this.pageCache.set(key, page)
      
      this.stats.lastSync = Date.now()
      await this.saveCache()
      
      console.log('[TranslationCache] Marked as translated:', pagePath, locale)
    }
  }

  /**
   * Get translation statistics
   */
  getStats(): TranslationStats {
    return { ...this.stats }
  }

  /**
   * Update last check timestamp
   */
  async updateLastCheck() {
    this.stats.lastCheck = Date.now()
    await this.saveCache()
  }

  /**
   * Simple hash function for content comparison
   */
  private hashContent(content: any): string {
    const str = JSON.stringify(content)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i)
      hash |= 0
    }
    return String(hash)
  }

  /**
   * Clean old cache entries (older than 30 days)
   */
  async cleanOldCache(daysThreshold = 30) {
    const threshold = Date.now() - (daysThreshold * 24 * 60 * 60 * 1000)
    let cleaned = 0

    for (const [key, page] of this.pageCache.entries()) {
      if (page.lastUpdated < threshold) {
        this.pageCache.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      await this.saveCache()
      console.log('[TranslationCache] Cleaned', cleaned, 'old cache entries')
    }

    return cleaned
  }
}

// Singleton instance
let cacheManagerInstance: TranslationCacheManager | null = null

export async function getTranslationCacheManager(): Promise<TranslationCacheManager> {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new TranslationCacheManager()
    await cacheManagerInstance.initialize()
  }
  return cacheManagerInstance
}

