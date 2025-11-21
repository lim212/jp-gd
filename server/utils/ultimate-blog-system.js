// Ultimate Blog System - Integrated All Optimizations
import AIEnhancedContentGenerator from './ai-enhanced-content-generator.js'
import EnhancedImageGenerator from './enhanced-image-generator.js'
import ContentQualityController from './content-quality-controller.js'
import PerformanceOptimizer from './performance-optimizer.js'
import AnalyticsTracker from './analytics-tracker.ts'
import AdvancedScheduler from './advanced-scheduler.js'
import { pickAuthorForSlug } from './authors.ts'

class UltimateBlogSystem {
  constructor() {
    this.contentGenerator = new AIEnhancedContentGenerator()
    this.imageGenerator = new EnhancedImageGenerator()
    this.qualityController = new ContentQualityController()
    this.performanceOptimizer = new PerformanceOptimizer()
    this.analyticsTracker = new AnalyticsTracker()
    this.scheduler = new AdvancedScheduler()
    
    this.config = {
      qualityThreshold: 75,
      maxRetries: 3,
      batchSize: 5,
      enableCaching: true,
      enableAnalytics: true,
      enablePerformanceOptimization: true,
      enableAdaptiveScheduling: true
    }
    
    this.stats = {
      totalGenerated: 0,
      totalSuccessful: 0,
      totalFailed: 0,
      averageQuality: 0,
      averageGenerationTime: 0
    }
  }

  async init() {
    console.log('🚀 Initializing Ultimate Blog System...')
    
    try {
      await Promise.all([
        this.performanceOptimizer.init(),
        this.analyticsTracker.init(),
        this.scheduler.init()
      ])
      
      console.log('✅ Ultimate Blog System initialized successfully')
      
    } catch (error) {
      console.error('❌ Failed to initialize Ultimate Blog System:', error)
      throw error
    }
  }

  // Main blog generation method
  async generateUltimateBlog(keywordData) {
    const { id, keyword } = keywordData
    const startTime = Date.now()
    
    console.log(`🎯 Generating ultimate blog for keyword ${id}: ${keyword}`)
    
    try {
      // Check cache first
      if (this.config.enableCaching) {
        const cached = await this.performanceOptimizer.getCachedContent(keyword, 'blog')
        if (cached) {
          console.log(`✅ Using cached content for "${keyword}"`)
          return cached
        }
      }
      
      // Determine content type based on keyword analysis
      const contentType = this.analyzeContentType(keyword)
      
      // Generate content with AI
      const title = await this.contentGenerator.generateAITitle(keyword, contentType)
      const content = await this.contentGenerator.generateAIContent(keyword, title, contentType)
      const metaDescription = await this.contentGenerator.generateAIMetaDescription(keyword, title, content)
      const tags = await this.contentGenerator.generateAITags(keyword, content)
      
      // Generate images
      const imageUrl = await this.imageGenerator.generateImage(title, keyword, 'featured')
      const imageSet = await this.imageGenerator.generateImageSet(title, keyword)
      
      // Create blog object
      const blog = {
        id: Date.now() + Math.random(),
        slug: this.slugify(keyword),
        title,
        content,
        excerpt: this.generateExcerpt(content),
        author: pickAuthorForSlug(this.slugify(keyword)),
        date: new Date().toISOString(),
        image: imageUrl,
        imageUrl,
        featured_image: imageUrl,
        meta_description: metaDescription,
        tags,
        categories: ['Blog', 'Panduan'],
        aiImageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
        updateReason: 'Auto-generated with Ultimate AI System',
        keywordId: id,
        originalKeyword: keyword,
        imageSet,
        contentType,
        generationTime: Date.now() - startTime
      }
      
      // Quality validation
      const qualityReport = this.qualityController.validateContentQuality(blog)
      blog.qualityReport = qualityReport
      
      // Performance optimization
      if (this.config.enablePerformanceOptimization) {
        this.performanceOptimizer.recordGenerationTime(keyword, blog.generationTime, qualityReport.overall.score)
      }
      
      // Analytics tracking
      if (this.config.enableAnalytics) {
        await this.analyticsTracker.trackKeywordPerformance(keyword, blog.slug, {
          views: 0,
          quality: qualityReport.overall.score,
          generationTime: blog.generationTime
        })
      }
      
      // Cache the result
      if (this.config.enableCaching) {
        await this.performanceOptimizer.setCachedContent(keyword, blog, 'blog')
      }
      
      // Update stats
      this.updateStats(blog, true)
      
      console.log(`✅ Ultimate blog generated: ${blog.slug} (Quality: ${qualityReport.overall.score}/100)`)
      return blog
      
    } catch (error) {
      console.error(`❌ Failed to generate ultimate blog for "${keyword}":`, error)
      
      // Update stats
      this.updateStats(null, false)
      
      // Record error
      if (this.config.enablePerformanceOptimization) {
        this.performanceOptimizer.recordError(keyword, error)
      }
      
      throw error
    }
  }

  // Batch processing with optimization
  async generateBatchBlogs(keywords, options = {}) {
    const {
      maxRetries = this.config.maxRetries,
      batchSize = this.config.batchSize,
      qualityThreshold = this.config.qualityThreshold
    } = options
    
    console.log(`🎯 Starting batch generation: ${keywords.length} keywords`)
    
    const results = []
    const errors = []
    
    // Use advanced scheduler for optimal processing
    const processed = await this.scheduler.processBatch(keywords, async (keyword) => {
      let attempts = 0
      let bestBlog = null
      let bestScore = 0
      
      while (attempts < maxRetries) {
        attempts++
        
        try {
          const blog = await this.generateUltimateBlog(keyword)
          
          if (blog.qualityReport.overall.score >= qualityThreshold) {
            return blog
          }
          
          if (blog.qualityReport.overall.score > bestScore) {
            bestScore = blog.qualityReport.overall.score
            bestBlog = blog
          }
          
        } catch (error) {
          console.error(`Attempt ${attempts} failed for "${keyword.keyword}":`, error.message)
        }
        
        if (attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
      
      return bestBlog || null
    })
    
    return processed
  }

  // Content type analysis
  analyzeContentType(keyword) {
    const keywordLower = keyword.toLowerCase()
    
    if (keywordLower.includes('cara') || keywordLower.includes('tutorial')) {
      return 'tutorial'
    } else if (keywordLower.includes('vs') || keywordLower.includes('banding')) {
      return 'comparison'
    } else if (keywordLower.includes('advanced') || keywordLower.includes('expert')) {
      return 'advanced'
    } else {
      return 'beginner'
    }
  }

  // Performance monitoring
  async getSystemPerformance() {
    const performance = await this.performanceOptimizer.getPerformanceStats()
    const analytics = this.analyticsTracker.getOverallAnalytics()
    const schedulerHealth = await this.scheduler.getSchedulerHealth()
    
    return {
      system: {
        totalGenerated: this.stats.totalGenerated,
        totalSuccessful: this.stats.totalSuccessful,
        totalFailed: this.stats.totalFailed,
        successRate: this.stats.totalGenerated > 0 ? this.stats.totalSuccessful / this.stats.totalGenerated : 0,
        averageQuality: this.stats.averageQuality,
        averageGenerationTime: this.stats.averageGenerationTime
      },
      performance,
      analytics,
      scheduler: schedulerHealth,
      recommendations: this.performanceOptimizer.getPerformanceRecommendations()
    }
  }

  // Quality optimization
  async optimizeQuality() {
    const performance = await this.performanceOptimizer.getPerformanceStats()
    const recommendations = this.performanceOptimizer.getPerformanceRecommendations()
    
    // Adjust quality threshold based on performance
    if (performance.quality.average > 85) {
      this.config.qualityThreshold = Math.min(85, this.config.qualityThreshold + 5)
      console.log(`📈 Increasing quality threshold to ${this.config.qualityThreshold}`)
    } else if (performance.quality.average < 70) {
      this.config.qualityThreshold = Math.max(60, this.config.qualityThreshold - 5)
      console.log(`📉 Decreasing quality threshold to ${this.config.qualityThreshold}`)
    }
    
    // Adjust batch size based on performance
    if (performance.generation.averageTime > 30000) {
      this.config.batchSize = Math.max(2, this.config.batchSize - 1)
      console.log(`📊 Reducing batch size to ${this.config.batchSize}`)
    } else if (performance.generation.averageTime < 15000) {
      this.config.batchSize = Math.min(10, this.config.batchSize + 1)
      console.log(`📊 Increasing batch size to ${this.config.batchSize}`)
    }
    
    return recommendations
  }

  // Analytics and reporting
  async generateReport(type = 'comprehensive') {
    const performance = await this.getSystemPerformance()
    
    switch (type) {
      case 'performance':
        return {
          generation: performance.performance.generation,
          cache: performance.performance.cache,
          errors: performance.performance.errors,
          quality: performance.performance.quality
        }
      
      case 'analytics':
        return {
          overview: performance.analytics.overview,
          topBlogs: performance.analytics.topBlogs,
          topKeywords: performance.analytics.topKeywords
        }
      
      case 'quality':
        return {
          average: performance.system.averageQuality,
          distribution: performance.performance.quality.distribution,
          trends: performance.performance.quality
        }
      
      case 'comprehensive':
      default:
        return performance
    }
  }

  // System maintenance
  async performMaintenance() {
    console.log('🔧 Performing system maintenance...')
    
    try {
      // Cleanup old data
      await this.analyticsTracker.cleanupOldData(30)
      await this.performanceOptimizer.optimizeMemoryUsage()
      
      // Optimize quality settings
      await this.optimizeQuality()
      
      // Update scheduler configuration
      await this.scheduler.calculateOptimalSchedule()
      
      console.log('✅ System maintenance completed')
      
    } catch (error) {
      console.error('❌ System maintenance failed:', error)
    }
  }

  // Utility methods
  updateStats(blog, success) {
    this.stats.totalGenerated++
    
    if (success && blog) {
      this.stats.totalSuccessful++
      this.stats.averageQuality = (this.stats.averageQuality * (this.stats.totalSuccessful - 1) + blog.qualityReport.overall.score) / this.stats.totalSuccessful
      this.stats.averageGenerationTime = (this.stats.averageGenerationTime * (this.stats.totalSuccessful - 1) + blog.generationTime) / this.stats.totalSuccessful
    } else {
      this.stats.totalFailed++
    }
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  generateExcerpt(content) {
    const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/i)
    if (firstParagraph) {
      return firstParagraph[1]
        .replace(/<[^>]*>/g, '')
        .substring(0, 160)
        .trim() + '...'
    }
    
    return content.replace(/<[^>]*>/g, '').substring(0, 160).trim() + '...'
  }

  // Health check
  async healthCheck() {
    const performance = await this.getSystemPerformance()
    const schedulerHealth = await this.scheduler.getSchedulerHealth()
    
    return {
      status: performance.system.successRate > 0.8 ? 'healthy' : 'needs_attention',
      system: performance.system,
      scheduler: schedulerHealth,
      timestamp: new Date().toISOString()
    }
  }
}

export default UltimateBlogSystem
