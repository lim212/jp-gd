// Advanced Scheduler with Smart Automation
import { promises as fs } from 'fs'
import path from 'path'

class AdvancedScheduler {
  constructor() {
    this.schedules = {
      daily: { hour: 3, minute: 0, enabled: true },
      weekly: { day: 1, hour: 2, minute: 0, enabled: false },
      monthly: { day: 1, hour: 1, minute: 0, enabled: false },
      custom: []
    }
    
    this.automation = {
      qualityThreshold: 70,
      maxRetries: 3,
      batchSize: 5,
      rateLimit: 2000, // 2 seconds between requests
      adaptiveScheduling: true,
      performanceBasedAdjustment: true
    }
    
    this.performance = {
      averageGenerationTime: 0,
      successRate: 0,
      qualityTrend: [],
      errorPatterns: []
    }
    
    this.schedulerDir = path.join(process.cwd(), 'data/scheduler')
  }

  async init() {
    await this.ensureDirectories()
    await this.loadSchedulerConfig()
    await this.analyzePerformance()
  }

  async ensureDirectories() {
    await fs.mkdir(this.schedulerDir, { recursive: true })
  }

  // Smart scheduling based on performance
  async calculateOptimalSchedule() {
    const analysis = await this.analyzePerformance()
    
    if (this.automation.adaptiveScheduling) {
      // Adjust schedule based on performance
      if (analysis.successRate < 0.8) {
        // Reduce frequency if success rate is low
        this.schedules.daily.enabled = false
        this.schedules.weekly.enabled = true
        console.log('📉 Low success rate detected, switching to weekly schedule')
      } else if (analysis.successRate > 0.95 && analysis.averageQuality > 80) {
        // Increase frequency if performance is excellent
        this.schedules.daily.enabled = true
        this.schedules.weekly.enabled = false
        console.log('📈 Excellent performance detected, switching to daily schedule')
      }
    }
    
    // Adjust batch size based on performance
    if (analysis.averageGenerationTime > 30000) { // 30 seconds
      this.automation.batchSize = Math.max(2, this.automation.batchSize - 1)
      console.log(`📊 Reducing batch size to ${this.automation.batchSize} due to slow generation`)
    } else if (analysis.averageGenerationTime < 15000) { // 15 seconds
      this.automation.batchSize = Math.min(10, this.automation.batchSize + 1)
      console.log(`📊 Increasing batch size to ${this.automation.batchSize} due to fast generation`)
    }
    
    // Adjust quality threshold based on trend
    if (analysis.qualityTrend.length > 5) {
      const recentTrend = analysis.qualityTrend.slice(-5)
      const averageRecent = recentTrend.reduce((sum, q) => sum + q, 0) / recentTrend.length
      
      if (averageRecent > 85) {
        this.automation.qualityThreshold = Math.min(80, this.automation.qualityThreshold + 5)
        console.log(`📊 Increasing quality threshold to ${this.automation.qualityThreshold}`)
      } else if (averageRecent < 70) {
        this.automation.qualityThreshold = Math.max(60, this.automation.qualityThreshold - 5)
        console.log(`📊 Decreasing quality threshold to ${this.automation.qualityThreshold}`)
      }
    }
    
    await this.saveSchedulerConfig()
  }

  // Performance analysis
  async analyzePerformance() {
    try {
      const performanceFile = path.join(this.schedulerDir, 'performance.json')
      const content = await fs.readFile(performanceFile, 'utf-8')
      const data = JSON.parse(content)
      
      const now = Date.now()
      const last24h = now - (24 * 60 * 60 * 1000)
      
      const recentData = data.filter(d => d.timestamp > last24h)
      
      if (recentData.length === 0) {
        return {
          averageGenerationTime: 0,
          successRate: 0,
          averageQuality: 0,
          qualityTrend: []
        }
      }
      
      const averageGenerationTime = recentData.reduce((sum, d) => sum + d.generationTime, 0) / recentData.length
      const successRate = recentData.filter(d => d.success).length / recentData.length
      const averageQuality = recentData.reduce((sum, d) => sum + d.quality, 0) / recentData.length
      const qualityTrend = recentData.map(d => d.quality)
      
      this.performance = {
        averageGenerationTime,
        successRate,
        qualityTrend,
        errorPatterns: this.analyzeErrorPatterns(recentData)
      }
      
      return this.performance
      
    } catch (error) {
      console.error('Failed to analyze performance:', error)
      return {
        averageGenerationTime: 0,
        successRate: 0,
        averageQuality: 0,
        qualityTrend: []
      }
    }
  }

  analyzeErrorPatterns(data) {
    const errors = data.filter(d => !d.success).map(d => d.error)
    const patterns = {}
    
    for (const error of errors) {
      const pattern = this.categorizeError(error)
      patterns[pattern] = (patterns[pattern] || 0) + 1
    }
    
    return patterns
  }

  categorizeError(error) {
    if (error.includes('API') || error.includes('OpenAI')) return 'API_ERROR'
    if (error.includes('timeout')) return 'TIMEOUT_ERROR'
    if (error.includes('network')) return 'NETWORK_ERROR'
    if (error.includes('quality')) return 'QUALITY_ERROR'
    return 'UNKNOWN_ERROR'
  }

  // Smart keyword selection
  async selectOptimalKeywords(keywords, count = 10) {
    const analysis = await this.analyzeKeywordPerformance()
    
    // Score keywords based on performance
    const scoredKeywords = keywords.map(keyword => {
      const performance = analysis[keyword.keyword] || {
        views: 0,
        engagement: 0,
        quality: 0,
        lastGenerated: 0
      }
      
      const score = this.calculateKeywordScore(keyword, performance)
      return { ...keyword, score }
    })
    
    // Sort by score and select top keywords
    const selected = scoredKeywords
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
    
    console.log(`📊 Selected ${selected.length} keywords based on performance analysis`)
    return selected
  }

  calculateKeywordScore(keyword, performance) {
    let score = 0
    
    // Base score from keyword data
    score += keyword.id * 0.1 // Prefer newer keywords
    
    // Performance-based scoring
    score += performance.views * 0.3
    score += performance.engagement * 0.4
    score += performance.quality * 0.2
    
    // Recency bonus (prefer keywords not generated recently)
    const daysSinceLastGeneration = (Date.now() - performance.lastGenerated) / (24 * 60 * 60 * 1000)
    score += Math.min(daysSinceLastGeneration * 0.1, 5)
    
    return score
  }

  // Batch processing with smart optimization
  async processBatch(keywords, processor) {
    const results = []
    const errors = []
    
    // Sort keywords by priority
    const sortedKeywords = await this.selectOptimalKeywords(keywords, this.automation.batchSize)
    
    for (const keyword of sortedKeywords) {
      try {
        const startTime = Date.now()
        const result = await processor(keyword)
        const generationTime = Date.now() - startTime
        
        // Record performance
        await this.recordPerformance({
          keyword: keyword.keyword,
          generationTime,
          success: true,
          quality: result.quality || 0,
          timestamp: Date.now()
        })
        
        results.push(result)
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, this.automation.rateLimit))
        
      } catch (error) {
        // Record error
        await this.recordPerformance({
          keyword: keyword.keyword,
          generationTime: 0,
          success: false,
          error: error.message,
          timestamp: Date.now()
        })
        
        errors.push({ keyword: keyword.keyword, error: error.message })
      }
    }
    
    return { results, errors }
  }

  // Performance recording
  async recordPerformance(data) {
    try {
      const performanceFile = path.join(this.schedulerDir, 'performance.json')
      let performance = []
      
      try {
        const content = await fs.readFile(performanceFile, 'utf-8')
        performance = JSON.parse(content)
      } catch {
        // File doesn't exist, start fresh
      }
      
      performance.push(data)
      
      // Keep only last 1000 entries
      if (performance.length > 1000) {
        performance = performance.slice(-1000)
      }
      
      await fs.writeFile(performanceFile, JSON.stringify(performance, null, 2))
      
    } catch (error) {
      console.error('Failed to record performance:', error)
    }
  }

  // Schedule management
  async addCustomSchedule(schedule) {
    this.schedules.custom.push({
      ...schedule,
      id: Date.now(),
      enabled: true,
      lastRun: null,
      nextRun: this.calculateNextRun(schedule)
    })
    
    await this.saveSchedulerConfig()
  }

  async removeCustomSchedule(scheduleId) {
    this.schedules.custom = this.schedules.custom.filter(s => s.id !== scheduleId)
    await this.saveSchedulerConfig()
  }

  calculateNextRun(schedule) {
    const now = new Date()
    const next = new Date(now)
    
    if (schedule.type === 'daily') {
      next.setHours(schedule.hour, schedule.minute, 0, 0)
      if (next <= now) {
        next.setDate(next.getDate() + 1)
      }
    } else if (schedule.type === 'weekly') {
      const daysUntilTarget = (schedule.day - now.getDay() + 7) % 7
      next.setDate(now.getDate() + daysUntilTarget)
      next.setHours(schedule.hour, schedule.minute, 0, 0)
      if (next <= now) {
        next.setDate(next.getDate() + 7)
      }
    } else if (schedule.type === 'monthly') {
      next.setDate(schedule.day)
      next.setHours(schedule.hour, schedule.minute, 0, 0)
      if (next <= now) {
        next.setMonth(next.getMonth() + 1)
      }
    }
    
    return next.toISOString()
  }

  // Schedule checking
  async checkSchedules() {
    const now = new Date()
    const activeSchedules = []
    
    // Check daily schedule
    if (this.schedules.daily.enabled) {
      if (now.getHours() === this.schedules.daily.hour && 
          now.getMinutes() === this.schedules.daily.minute) {
        activeSchedules.push({ type: 'daily', schedule: this.schedules.daily })
      }
    }
    
    // Check weekly schedule
    if (this.schedules.weekly.enabled) {
      if (now.getDay() === this.schedules.weekly.day &&
          now.getHours() === this.schedules.weekly.hour &&
          now.getMinutes() === this.schedules.weekly.minute) {
        activeSchedules.push({ type: 'weekly', schedule: this.schedules.weekly })
      }
    }
    
    // Check monthly schedule
    if (this.schedules.monthly.enabled) {
      if (now.getDate() === this.schedules.monthly.day &&
          now.getHours() === this.schedules.monthly.hour &&
          now.getMinutes() === this.schedules.monthly.minute) {
        activeSchedules.push({ type: 'monthly', schedule: this.schedules.monthly })
      }
    }
    
    // Check custom schedules
    for (const schedule of this.schedules.custom) {
      if (schedule.enabled && new Date(schedule.nextRun) <= now) {
        activeSchedules.push({ type: 'custom', schedule })
        
        // Update next run time
        schedule.lastRun = now.toISOString()
        schedule.nextRun = this.calculateNextRun(schedule)
      }
    }
    
    return activeSchedules
  }

  // Configuration management
  async saveSchedulerConfig() {
    try {
      const configFile = path.join(this.schedulerDir, 'config.json')
      const config = {
        schedules: this.schedules,
        automation: this.automation,
        lastUpdated: new Date().toISOString()
      }
      
      await fs.writeFile(configFile, JSON.stringify(config, null, 2))
    } catch (error) {
      console.error('Failed to save scheduler config:', error)
    }
  }

  async loadSchedulerConfig() {
    try {
      const configFile = path.join(this.schedulerDir, 'config.json')
      const content = await fs.readFile(configFile, 'utf-8')
      const config = JSON.parse(content)
      
      this.schedules = config.schedules || this.schedules
      this.automation = config.automation || this.automation
      
    } catch (error) {
      // File doesn't exist or is corrupted, use defaults
      console.log('Using default scheduler configuration')
    }
  }

  // Health monitoring
  async getSchedulerHealth() {
    const performance = await this.analyzePerformance()
    const activeSchedules = await this.checkSchedules()
    
    return {
      status: performance.successRate > 0.8 ? 'healthy' : 'needs_attention',
      performance,
      activeSchedules: activeSchedules.length,
      automation: this.automation,
      schedules: this.schedules
    }
  }
}

export default AdvancedScheduler
