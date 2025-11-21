// Optimized Blog Scheduler - Enhanced with Quality Control
import { promises as fs } from 'fs'
import path from 'path'
import AdvancedContentGenerator from './advanced-content-generator.js'
import EnhancedImageGenerator from './enhanced-image-generator.js'
import ContentQualityController from './content-quality-controller.js'
import { pickAuthorForSlug } from './authors.ts'

class OptimizedBlogScheduler {
  constructor() {
    this.contentGenerator = new AdvancedContentGenerator()
    this.imageGenerator = new EnhancedImageGenerator()
    this.qualityController = new ContentQualityController()
    
    this.keywords = []
    this.rotation = {
      index: 0,
      lastReset: new Date().toISOString(),
      totalKeywords: 0,
      dailyCount: 10,
      currentDay: 0
    }
    
    this.isRunning = false
    this.qualityThreshold = 70 // Minimum quality score
    this.maxRetries = 3 // Maximum retries for quality improvement
  }

  async init() {
    console.log('🚀 Initializing Optimized Blog Scheduler...')
    
    try {
      await this.loadKeywords()
      await this.loadRotation()
      await this.ensureDirectories()
      
      console.log('✅ Optimized Blog Scheduler ready')
      console.log(`📊 Loaded ${this.keywords.length} keywords`)
      console.log(`📍 Current rotation index: ${this.rotation.index}`)
      
    } catch (error) {
      console.error('❌ Error initializing scheduler:', error)
      throw error
    }
  }

  async loadKeywords() {
    try {
      const keywordPath = path.join(process.cwd(), 'data/keywords/2025-08-21/list-keyword.txt')
      const content = await fs.readFile(keywordPath, 'utf-8')
      this.keywords = content.split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .map((k, index) => ({ id: index + 1, keyword: k }))
      
      console.log(`📝 Loaded ${this.keywords.length} keywords`)
      
    } catch (error) {
      console.error('❌ Error loading keywords:', error)
      this.keywords = []
    }
  }

  async loadRotation() {
    try {
      const rotationPath = path.join(process.cwd(), 'data/keyword-rotation.json')
      const content = await fs.readFile(rotationPath, 'utf-8')
      this.rotation = JSON.parse(content)
      
      // Reset if it's a new day
      const today = new Date().toDateString()
      const lastReset = new Date(this.rotation.lastReset).toDateString()
      
      if (today !== lastReset) {
        this.rotation.index = 0
        this.rotation.currentDay = 0
        this.rotation.lastReset = new Date().toISOString()
        await this.saveRotation()
        console.log('🔄 Reset keyword rotation for new day')
      }
      
    } catch (error) {
      console.error('❌ Error loading rotation:', error)
      this.rotation = {
        index: 0,
        lastReset: new Date().toISOString(),
        totalKeywords: this.keywords.length,
        dailyCount: 10,
        currentDay: 0
      }
    }
  }

  async saveRotation() {
    try {
      const rotationPath = path.join(process.cwd(), 'data/keyword-rotation.json')
      await fs.writeFile(rotationPath, JSON.stringify(this.rotation, null, 2))
    } catch (error) {
      console.error('❌ Error saving rotation:', error)
    }
  }

  async ensureDirectories() {
    const dirs = [
      'data/blog/generated',
      'data/blog/quality-reports',
      'public/images/blog',
      'data/blog/images',
      'public/images/dummy',
      'logs'
    ]

    for (const dir of dirs) {
      try {
        await fs.mkdir(path.join(process.cwd(), dir), { recursive: true })
      } catch (error) {
        // Directory might already exist
      }
    }
  }

  // Enhanced blog generation with quality control
  async generateOptimizedBlog(keywordData) {
    const { id, keyword } = keywordData
    console.log(`📝 Generating optimized blog for keyword ${id}: ${keyword}`)
    
    let attempts = 0
    let bestBlog = null
    let bestScore = 0
    
    while (attempts < this.maxRetries) {
      attempts++
      console.log(`🔄 Attempt ${attempts}/${this.maxRetries} for "${keyword}"`)
      
      try {
        // Generate content
        const title = this.contentGenerator.generateOptimizedTitle(keyword)
        const content = this.contentGenerator.generateOptimizedContent(keyword, title)
        const metaDescription = this.contentGenerator.generateOptimizedMetaDescription(keyword, title)
        const tags = this.contentGenerator.generateOptimizedTags(keyword)
        
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
          updateReason: 'Auto-generated with Enhanced AI',
          keywordId: id,
          originalKeyword: keyword,
          imageSet,
          generationAttempt: attempts
        }
        
        // Quality validation
        const qualityReport = this.qualityController.validateContentQuality(blog)
        blog.qualityReport = qualityReport
        
        console.log(`📊 Quality score: ${qualityReport.overall.score}/100 (${qualityReport.overall.grade})`)
        
        // Check if quality meets threshold
        if (qualityReport.overall.score >= this.qualityThreshold) {
          console.log(`✅ Quality threshold met for "${keyword}"`)
          return blog
        }
        
        // Keep track of best attempt
        if (qualityReport.overall.score > bestScore) {
          bestScore = qualityReport.overall.score
          bestBlog = blog
        }
        
        // If not last attempt, wait before retry
        if (attempts < this.maxRetries) {
          console.log(`⏳ Waiting before retry... (current score: ${qualityReport.overall.score})`)
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
        
      } catch (error) {
        console.error(`❌ Error in attempt ${attempts} for "${keyword}":`, error)
        
        if (attempts === this.maxRetries) {
          throw error
        }
      }
    }
    
    // If no attempt met threshold, return best attempt
    if (bestBlog) {
      console.log(`⚠️ Using best attempt for "${keyword}" (score: ${bestScore})`)
      return bestBlog
    }
    
    throw new Error(`Failed to generate quality blog for "${keyword}" after ${this.maxRetries} attempts`)
  }

  // Enhanced blog saving with quality report
  async saveOptimizedBlog(blog) {
    try {
      // Ensure directory exists
      const blogDir = path.join(process.cwd(), 'data/blog/generated')
      await fs.mkdir(blogDir, { recursive: true })
      
      // Save individual blog file
      const blogFile = path.join(blogDir, `${blog.slug}.json`)
      await fs.writeFile(blogFile, JSON.stringify(blog, null, 2))
      
      // Save quality report
      await this.saveQualityReport(blog)
      
      // Update generated blogs
      await this.updateGeneratedBlogs(blog)
      await this.updateLatestPosts(blog)
      await this.updatePopularPosts(blog)
      
      console.log(`✅ Blog saved: ${blog.slug} (Quality: ${blog.qualityReport.overall.score}/100)`)
      
    } catch (error) {
      console.error('❌ Error saving blog:', error)
    }
  }

  async saveQualityReport(blog) {
    try {
      const reportDir = path.join(process.cwd(), 'data/blog/quality-reports')
      await fs.mkdir(reportDir, { recursive: true })
      
      const reportFile = path.join(reportDir, `${blog.slug}-quality.json`)
      const report = {
        slug: blog.slug,
        keyword: blog.originalKeyword,
        generatedAt: new Date().toISOString(),
        qualityReport: blog.qualityReport,
        generationAttempt: blog.generationAttempt
      }
      
      await fs.writeFile(reportFile, JSON.stringify(report, null, 2))
      
    } catch (error) {
      console.error('❌ Error saving quality report:', error)
    }
  }

  async updateGeneratedBlogs(newBlog) {
    try {
      const databaseContentDir = path.join(process.cwd(), 'database', 'content')
      await fs.mkdir(databaseContentDir, { recursive: true })
      
      const generatedFile = path.join(databaseContentDir, 'generated-blogs.json')
      let generatedBlogs = []
      
      try {
        const content = await fs.readFile(generatedFile, 'utf-8')
        generatedBlogs = JSON.parse(content)
      } catch {
        // File doesn't exist, start fresh
      }
      
      const generatedBlog = {
        id: newBlog.id,
        slug: newBlog.slug,
        title: newBlog.title,
        content: newBlog.content,
        publish_at: newBlog.date,
        featured_image: newBlog.featured_image,
        meta_title: newBlog.title,
        meta_description: newBlog.meta_description,
        quality_score: newBlog.qualityReport.overall.score,
        quality_grade: newBlog.qualityReport.overall.grade
      }
      
      // Remove existing blog with same slug
      generatedBlogs = generatedBlogs.filter(b => b.slug !== newBlog.slug)
      
      // Add new blog to the beginning
      generatedBlogs.unshift(generatedBlog)
      
      // Keep only latest 100 blogs
      generatedBlogs = generatedBlogs.slice(0, 100)
      
      await fs.writeFile(generatedFile, JSON.stringify(generatedBlogs, null, 2))
      console.log('✅ Updated generated blogs with quality scores')
      
    } catch (error) {
      console.error('❌ Error updating generated blogs:', error)
    }
  }

  async updateLatestPosts(newBlog) {
    try {
      const latestFile = path.join(process.cwd(), 'data/blog/latest-posts.json')
      let latestPosts = []
      
      try {
        const content = await fs.readFile(latestFile, 'utf-8')
        latestPosts = JSON.parse(content)
      } catch {
        // File doesn't exist, start fresh
      }
      
      latestPosts.unshift({
        slug: newBlog.slug,
        title: newBlog.title,
        date: newBlog.date,
        image: newBlog.image,
        quality_score: newBlog.qualityReport.overall.score
      })
      
      // Keep only latest 50 posts
      latestPosts = latestPosts.slice(0, 50)
      
      await fs.writeFile(latestFile, JSON.stringify(latestPosts, null, 2))
      console.log('✅ Updated latest posts with quality scores')
      
    } catch (error) {
      console.error('❌ Error updating latest posts:', error)
    }
  }

  async updatePopularPosts(newBlog) {
    try {
      const popularFile = path.join(process.cwd(), 'data/blog/popular-posts.json')
      let popularPosts = {}
      
      try {
        const content = await fs.readFile(popularFile, 'utf-8')
        popularPosts = JSON.parse(content)
      } catch {
        // File doesn't exist, start fresh
      }
      
      popularPosts[newBlog.slug] = {
        title: newBlog.title,
        count: 1,
        last: Date.now(),
        date: newBlog.date,
        quality_score: newBlog.qualityReport.overall.score
      }
      
      await fs.writeFile(popularFile, JSON.stringify(popularPosts, null, 2))
      console.log('✅ Updated popular posts with quality scores')
      
    } catch (error) {
      console.error('❌ Error updating popular posts:', error)
    }
  }

  // Enhanced daily generation with quality tracking
  async runOptimizedDailyGeneration() {
    if (this.isRunning) {
      console.log('⏳ Daily generation already running, skipping...')
      return
    }

    this.isRunning = true
    console.log('🌅 Starting optimized daily blog generation...')
    
    try {
      if (this.keywords.length === 0) {
        throw new Error('No keywords available')
      }
      
      const dailyCount = 10
      const startIndex = this.rotation.index
      const generatedBlogs = []
      const qualityStats = {
        total: 0,
        passed: 0,
        failed: 0,
        averageScore: 0,
        scores: []
      }
      
      console.log(`📊 Generating ${dailyCount} optimized blogs starting from keyword ${startIndex + 1}`)
      
      for (let i = 0; i < dailyCount; i++) {
        const currentIndex = (startIndex + i) % this.keywords.length
        const keywordData = this.keywords[currentIndex]
        
        console.log(`📝 Processing keyword ${currentIndex + 1}/${this.keywords.length}: ${keywordData.keyword}`)
        
        try {
          const blog = await this.generateOptimizedBlog(keywordData)
          await this.saveOptimizedBlog(blog)
          
          generatedBlogs.push(blog)
          qualityStats.total++
          qualityStats.scores.push(blog.qualityReport.overall.score)
          
          if (blog.qualityReport.overall.score >= this.qualityThreshold) {
            qualityStats.passed++
          } else {
            qualityStats.failed++
          }
          
          console.log(`✅ Blog ${generatedBlogs.length}/${dailyCount} generated successfully`)
          
        } catch (error) {
          console.error(`❌ Failed to generate blog for "${keywordData.keyword}":`, error)
          qualityStats.total++
          qualityStats.failed++
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
      
      // Calculate quality statistics
      if (qualityStats.scores.length > 0) {
        qualityStats.averageScore = Math.round(
          qualityStats.scores.reduce((sum, score) => sum + score, 0) / qualityStats.scores.length
        )
      }
      
      // Update rotation
      this.rotation.index = (startIndex + dailyCount) % this.keywords.length
      this.rotation.currentDay++
      await this.saveRotation()
      
      // Log results
      console.log(`✅ Optimized daily generation complete:`)
      console.log(`📊 Generated: ${generatedBlogs.length}/${dailyCount} blogs`)
      console.log(`📈 Quality stats: ${qualityStats.passed} passed, ${qualityStats.failed} failed`)
      console.log(`📊 Average quality score: ${qualityStats.averageScore}/100`)
      console.log(`📍 Next generation will start from keyword ${this.rotation.index + 1}`)
      
      // Save quality statistics
      await this.saveQualityStatistics(qualityStats)
      
      return {
        blogs: generatedBlogs,
        qualityStats,
        nextIndex: this.rotation.index
      }
      
    } catch (error) {
      console.error('❌ Error in optimized daily generation:', error)
      throw error
    } finally {
      this.isRunning = false
    }
  }

  async saveQualityStatistics(stats) {
    try {
      const statsFile = path.join(process.cwd(), 'data/blog/quality-statistics.json')
      let allStats = []
      
      try {
        const content = await fs.readFile(statsFile, 'utf-8')
        allStats = JSON.parse(content)
      } catch {
        // File doesn't exist, start fresh
      }
      
      const dailyStats = {
        date: new Date().toISOString(),
        ...stats
      }
      
      allStats.unshift(dailyStats)
      allStats = allStats.slice(0, 30) // Keep last 30 days
      
      await fs.writeFile(statsFile, JSON.stringify(allStats, null, 2))
      console.log('✅ Quality statistics saved')
      
    } catch (error) {
      console.error('❌ Error saving quality statistics:', error)
    }
  }

  // Utility methods
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

  // Schedule checking
  async checkSchedule() {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    // Run at 3 AM (03:00)
    if (currentHour === 3 && currentMinute === 0) {
      console.log('⏰ Scheduled time reached (03:00) - starting optimized generation')
      try {
        await this.runOptimizedDailyGeneration()
      } catch (error) {
        console.error('❌ Scheduled generation failed:', error)
      }
    }
  }

  // Get quality statistics
  getQualityStatistics() {
    return {
      qualityThreshold: this.qualityThreshold,
      maxRetries: this.maxRetries,
      currentRotation: this.rotation
    }
  }
}

export default OptimizedBlogScheduler
