// Performance Optimizer for Blog Generation
import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

class PerformanceOptimizer {
  constructor() {
    this.cacheDir = path.join(process.cwd(), 'data/cache')
    this.performanceDir = path.join(process.cwd(), 'data/performance')
    this.cacheTTL = 24 * 60 * 60 * 1000 // 24 hours
    this.maxCacheSize = 1000 // Maximum cached items
    this.performanceMetrics = {
      generationTimes: [],
      cacheHitRates: [],
      errorRates: [],
      qualityScores: []
    }
  }

  async init() {
    await this.ensureDirectories()
    await this.loadPerformanceMetrics()
    await this.cleanupExpiredCache()
  }

  async ensureDirectories() {
    const dirs = [this.cacheDir, this.performanceDir]
    for (const dir of dirs) {
      await fs.mkdir(dir, { recursive: true })
    }
  }

  // Advanced caching system
  async getCachedContent(key, type = 'content') {
    try {
      const cacheKey = this.generateCacheKey(key, type)
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`)
      
      const stats = await fs.stat(cacheFile)
      const isExpired = Date.now() - stats.mtime.getTime() > this.cacheTTL
      
      if (isExpired) {
        await fs.unlink(cacheFile)
        return null
      }
      
      const content = await fs.readFile(cacheFile, 'utf-8')
      const cached = JSON.parse(content)
      
      this.recordCacheHit(type)
      return cached.data
      
    } catch (error) {
      this.recordCacheMiss(type)
      return null
    }
  }

  async setCachedContent(key, data, type = 'content') {
    try {
      const cacheKey = this.generateCacheKey(key, type)
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`)
      
      const cacheEntry = {
        key: cacheKey,
        type,
        data,
        timestamp: Date.now(),
        ttl: this.cacheTTL
      }
      
      await fs.writeFile(cacheFile, JSON.stringify(cacheEntry, null, 2))
      await this.manageCacheSize()
      
    } catch (error) {
      console.error('Failed to cache content:', error)
    }
  }

  generateCacheKey(key, type) {
    const input = `${type}:${key}`
    return crypto.createHash('md5').update(input).digest('hex')
  }

  async manageCacheSize() {
    try {
      const files = await fs.readdir(this.cacheDir)
      if (files.length <= this.maxCacheSize) return
      
      // Get file stats and sort by modification time
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(this.cacheDir, file)
          const stats = await fs.stat(filePath)
          return { file, mtime: stats.mtime }
        })
      )
      
      // Sort by modification time (oldest first)
      fileStats.sort((a, b) => a.mtime.getTime() - b.mtime.getTime())
      
      // Remove oldest files
      const filesToRemove = fileStats.slice(0, files.length - this.maxCacheSize)
      for (const { file } of filesToRemove) {
        await fs.unlink(path.join(this.cacheDir, file))
      }
      
    } catch (error) {
      console.error('Failed to manage cache size:', error)
    }
  }

  async cleanupExpiredCache() {
    try {
      const files = await fs.readdir(this.cacheDir)
      const now = Date.now()
      
      for (const file of files) {
        const filePath = path.join(this.cacheDir, file)
        const stats = await fs.stat(filePath)
        
        if (now - stats.mtime.getTime() > this.cacheTTL) {
          await fs.unlink(filePath)
        }
      }
      
    } catch (error) {
      console.error('Failed to cleanup expired cache:', error)
    }
  }

  // Performance monitoring
  recordGenerationTime(keyword, duration, quality) {
    this.performanceMetrics.generationTimes.push({
      keyword,
      duration,
      quality,
      timestamp: Date.now()
    })
    
    // Keep only last 1000 entries
    if (this.performanceMetrics.generationTimes.length > 1000) {
      this.performanceMetrics.generationTimes = this.performanceMetrics.generationTimes.slice(-1000)
    }
  }

  recordCacheHit(type) {
    this.performanceMetrics.cacheHitRates.push({
      type,
      hit: true,
      timestamp: Date.now()
    })
  }

  recordCacheMiss(type) {
    this.performanceMetrics.cacheHitRates.push({
      type,
      hit: false,
      timestamp: Date.now()
    })
  }

  recordError(keyword, error) {
    this.performanceMetrics.errorRates.push({
      keyword,
      error: error.message,
      timestamp: Date.now()
    })
  }

  recordQualityScore(keyword, score) {
    this.performanceMetrics.qualityScores.push({
      keyword,
      score,
      timestamp: Date.now()
    })
  }

  // Performance analysis
  getPerformanceStats() {
    const now = Date.now()
    const last24h = now - (24 * 60 * 60 * 1000)
    
    const recentGenerations = this.performanceMetrics.generationTimes.filter(
      g => g.timestamp > last24h
    )
    
    const recentCacheHits = this.performanceMetrics.cacheHitRates.filter(
      c => c.timestamp > last24h
    )
    
    const recentErrors = this.performanceMetrics.errorRates.filter(
      e => e.timestamp > last24h
    )
    
    const recentQualityScores = this.performanceMetrics.qualityScores.filter(
      q => q.timestamp > last24h
    )
    
    return {
      generation: {
        total: recentGenerations.length,
        averageTime: recentGenerations.length > 0 
          ? recentGenerations.reduce((sum, g) => sum + g.duration, 0) / recentGenerations.length 
          : 0,
        averageQuality: recentGenerations.length > 0
          ? recentGenerations.reduce((sum, g) => sum + g.quality, 0) / recentGenerations.length
          : 0
      },
      cache: {
        totalRequests: recentCacheHits.length,
        hitRate: recentCacheHits.length > 0
          ? recentCacheHits.filter(c => c.hit).length / recentCacheHits.length
          : 0
      },
      errors: {
        total: recentErrors.length,
        rate: recentGenerations.length > 0
          ? recentErrors.length / recentGenerations.length
          : 0
      },
      quality: {
        average: recentQualityScores.length > 0
          ? recentQualityScores.reduce((sum, q) => sum + q.score, 0) / recentQualityScores.length
          : 0,
        distribution: this.getQualityDistribution(recentQualityScores)
      }
    }
  }

  getQualityDistribution(qualityScores) {
    const distribution = {
      excellent: 0, // 90-100
      good: 0,      // 70-89
      average: 0,   // 50-69
      poor: 0       // 0-49
    }
    
    for (const score of qualityScores) {
      if (score.score >= 90) distribution.excellent++
      else if (score.score >= 70) distribution.good++
      else if (score.score >= 50) distribution.average++
      else distribution.poor++
    }
    
    return distribution
  }

  // Batch processing optimization
  async processBatch(keywords, processor, batchSize = 5) {
    const results = []
    const errors = []
    
    for (let i = 0; i < keywords.length; i += batchSize) {
      const batch = keywords.slice(i, i + batchSize)
      
      try {
        const batchResults = await Promise.allSettled(
          batch.map(keyword => processor(keyword))
        )
        
        for (const result of batchResults) {
          if (result.status === 'fulfilled') {
            results.push(result.value)
          } else {
            errors.push(result.reason)
          }
        }
        
        // Rate limiting between batches
        if (i + batchSize < keywords.length) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
        
      } catch (error) {
        console.error(`Batch ${i}-${i + batchSize} failed:`, error)
        errors.push(error)
      }
    }
    
    return { results, errors }
  }

  // Memory optimization
  optimizeMemoryUsage() {
    // Clear old performance metrics
    const now = Date.now()
    const cutoff = now - (7 * 24 * 60 * 60 * 1000) // 7 days
    
    this.performanceMetrics.generationTimes = this.performanceMetrics.generationTimes.filter(
      g => g.timestamp > cutoff
    )
    
    this.performanceMetrics.cacheHitRates = this.performanceMetrics.cacheHitRates.filter(
      c => c.timestamp > cutoff
    )
    
    this.performanceMetrics.errorRates = this.performanceMetrics.errorRates.filter(
      e => e.timestamp > cutoff
    )
    
    this.performanceMetrics.qualityScores = this.performanceMetrics.qualityScores.filter(
      q => q.timestamp > cutoff
    )
  }

  // Save performance metrics
  async savePerformanceMetrics() {
    try {
      const metricsFile = path.join(this.performanceDir, 'metrics.json')
      await fs.writeFile(metricsFile, JSON.stringify(this.performanceMetrics, null, 2))
    } catch (error) {
      console.error('Failed to save performance metrics:', error)
    }
  }

  async loadPerformanceMetrics() {
    try {
      const metricsFile = path.join(this.performanceDir, 'metrics.json')
      const content = await fs.readFile(metricsFile, 'utf-8')
      this.performanceMetrics = JSON.parse(content)
    } catch (error) {
      // File doesn't exist or is corrupted, start fresh
      this.performanceMetrics = {
        generationTimes: [],
        cacheHitRates: [],
        errorRates: [],
        qualityScores: []
      }
    }
  }

  // Performance recommendations
  getPerformanceRecommendations() {
    const stats = this.getPerformanceStats()
    const recommendations = []
    
    if (stats.generation.averageTime > 30000) { // 30 seconds
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Generation time is too high. Consider optimizing AI prompts or reducing content length.',
        action: 'Optimize AI prompts and reduce max_tokens'
      })
    }
    
    if (stats.cache.hitRate < 0.3) {
      recommendations.push({
        type: 'cache',
        priority: 'medium',
        message: 'Cache hit rate is low. Consider increasing cache TTL or improving cache keys.',
        action: 'Increase cache TTL and optimize cache keys'
      })
    }
    
    if (stats.errors.rate > 0.1) {
      recommendations.push({
        type: 'reliability',
        priority: 'high',
        message: 'Error rate is high. Check API keys and network connectivity.',
        action: 'Check OpenAI API keys and network stability'
      })
    }
    
    if (stats.quality.average < 70) {
      recommendations.push({
        type: 'quality',
        priority: 'high',
        message: 'Average quality score is below threshold. Review content generation process.',
        action: 'Improve content templates and AI prompts'
      })
    }
    
    return recommendations
  }

  // Health check
  async healthCheck() {
    const stats = this.getPerformanceStats()
    const recommendations = this.getPerformanceRecommendations()
    
    return {
      status: recommendations.length === 0 ? 'healthy' : 'needs_attention',
      stats,
      recommendations,
      timestamp: new Date().toISOString()
    }
  }
}

export default PerformanceOptimizer
