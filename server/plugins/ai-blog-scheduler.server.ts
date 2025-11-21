// AI Blog Scheduler - REAL AI dengan OpenAI GPT-4
// Generate 10 artikel berkualitas tinggi setiap hari
// SEO-optimized sesuai standar Google

import { promises as fs } from 'fs'
import path from 'path'
import { AIContentGenerator } from '../utils/ai-content-generator'
import ImageOptimizer from '../utils/image-optimizer'
import CacheManager from '../utils/cache-manager'
import GoogleIndexing from '../utils/google-indexing'
import DuplicateChecker from '../utils/duplicate-checker'
import AnalyticsTracker from '../utils/analytics-tracker'
import { pickAuthorForSlug } from '../utils/authors'

interface KeywordData {
  id: number
  keyword: string
}

interface BlogData {
  id: number
  slug: string
  title: string
  content: string
  excerpt: string
  author: string
  date: string
  image: string
  imageUrl: string
  featured_image: string
  categories: string[]
  tags: string[]
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]
  schema: any
  aiGenerated: boolean
  aiModel: string
  wordCount: number
  readTime: number
  seoScore: number
  updatedAt: string
  keywordId: number
  originalKeyword: string
}

interface RotationData {
  index: number
  lastReset: string
  totalKeywords: number
  dailyCount: number
  currentDay: number
  totalGenerated: number
  lastRunDate: string
}

class AIBlogScheduler {
  private keywords: KeywordData[] = []
  private rotation: RotationData = {
    index: 0,
    lastReset: new Date().toISOString(),
    totalKeywords: 0,
    dailyCount: 10,
    currentDay: 0,
    totalGenerated: 0,
    lastRunDate: ''
  }
  private isRunning = false
  private aiGenerator: AIContentGenerator
  private imageOptimizer: ImageOptimizer
  private cacheManager: CacheManager
  private googleIndexing: GoogleIndexing
  private duplicateChecker: DuplicateChecker
  private analyticsTracker: AnalyticsTracker

  constructor() {
    this.aiGenerator = new AIContentGenerator()
    this.imageOptimizer = new ImageOptimizer()
    this.cacheManager = new CacheManager()
    this.googleIndexing = new GoogleIndexing()
    this.duplicateChecker = new DuplicateChecker()
    this.analyticsTracker = new AnalyticsTracker()
  }

  async init() {
    console.log('🤖 Initializing AI Blog Scheduler with Real AI...')
    
    // Load keywords and rotation
    await this.loadKeywords()
    await this.loadRotation()
    
    // Ensure directories exist
    await this.ensureDirectories()
    
    console.log('✅ AI Blog Scheduler ready')
    console.log(`📊 Total keywords: ${this.keywords.length}`)
    console.log(`📍 Current index: ${this.rotation.index}`)
    console.log(`🎯 Daily target: ${this.rotation.dailyCount} articles`)
  }

  async loadKeywords() {
    try {
      // Try to find the most recent keyword file
      const keywordsDir = path.join(process.cwd(), 'data/keywords')
      let keywordPath = ''
      
      try {
        const dirs = await fs.readdir(keywordsDir)
        const sortedDirs = dirs
          .filter(d => {
            try {
              const dirPath = path.join(keywordsDir, d)
              return fs.stat(dirPath).then(s => s.isDirectory()).catch(() => false)
            } catch {
              return false
            }
          })
          .sort()
          .reverse()
        
        for (const dir of sortedDirs) {
          const dirPath = path.join(keywordsDir, dir)
          const files = await fs.readdir(dirPath)
          const txtFile = files.find(f => f.endsWith('.txt') && !f.endsWith('.done.txt'))
          if (txtFile) {
            keywordPath = path.join(dirPath, txtFile)
            break
          }
        }
      } catch {
        // Fallback to default path
        keywordPath = path.join(process.cwd(), 'data/keywords/2025-08-21/list-keyword.txt')
      }
      
      if (!keywordPath) {
        keywordPath = path.join(process.cwd(), 'data/keywords/2025-08-21/list-keyword.txt')
      }
      
      const content = await fs.readFile(keywordPath, 'utf-8')
      this.keywords = content.split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .map((k, index) => ({ id: index + 1, keyword: k }))
      
      console.log(`📝 Loaded ${this.keywords.length} keywords from ${keywordPath}`)
      console.log(`📋 Keywords will be processed in order, one by one`)
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
      const lastRun = new Date(this.rotation.lastRunDate || this.rotation.lastReset).toDateString()
      
      if (today !== lastRun && this.rotation.lastRunDate) {
        console.log('🔄 New day detected - ready for new generation')
      }
      
      console.log(`📍 Rotation status: ${this.rotation.index}/${this.keywords.length}`)
    } catch (error) {
      console.error('❌ Error loading rotation:', error)
      const envDaily = Math.min(
        Math.max(parseInt(process.env.MAX_DAILY_POSTS || '20', 10) || 20, 1),
        50
      )

      this.rotation = {
        index: 0,
        lastReset: new Date().toISOString(),
        totalKeywords: this.keywords.length,
        dailyCount: envDaily,
        currentDay: 0,
        totalGenerated: 0,
        lastRunDate: ''
      }
    }
  }

  async saveRotation() {
    try {
      const rotationPath = path.join(process.cwd(), 'data/keyword-rotation.json')
      await fs.writeFile(rotationPath, JSON.stringify(this.rotation, null, 2))
      console.log('💾 Rotation data saved')
    } catch (error) {
      console.error('❌ Error saving rotation:', error)
    }
  }

  async ensureDirectories() {
    const dirs = [
      'data/blog/generated',
      'public/images/blog',
      'database/content',
      'data/blog',
      'data/keywords'
    ]

    for (const dir of dirs) {
      try {
        await fs.mkdir(path.join(process.cwd(), dir), { recursive: true })
      } catch (error) {
        // Directory might already exist
      }
    }
  }

  /**
   * Generate image using AI prompt sesuai keyword, optimize and save locally
   */
  async generateAndSaveImage(keyword: string, title: string, slug: string): Promise<string> {
    try {
      // Create SEO-friendly image prompt sesuai keyword
      const imagePrompt = `${keyword}, ${title}, professional photography, modern business, high quality, natural lighting, authentic, 4k, payment services, fintech`
      const encodedPrompt = encodeURIComponent(imagePrompt)
      const seed = this.hashString(keyword + slug)
      
      // Use Pollinations AI with enhanced settings
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1200&height=630&nologo=true&enhance=true&model=flux`
      
      console.log(`   🖼️ Generating image for keyword: "${keyword}"`)
      
      // Download, optimize, and save image with compression
      const result = await this.imageOptimizer.downloadAndOptimize(imageUrl, slug)
      
      console.log(`✅ Image generated sesuai keyword, optimized and saved: ${result.path}`)
      console.log(`   📊 Size: ${(result.size / 1024).toFixed(2)} KB (optimized: ${result.optimized})`)
      
      return result.path
      
    } catch (error) {
      console.error('❌ Error generating/saving image:', error)
      // Return AI-generated URL as fallback
      return `/images/fallback-news.svg`
    }
  }

  /**
   * Generate blog with REAL AI
   */
  async generateBlogWithAI(keywordData: KeywordData): Promise<BlogData | null> {
    const { id, keyword } = keywordData
    
    console.log(`\n🤖 === Generating AI Blog ${id} for: "${keyword}" ===`)
    
    try {
      // Step 1: Generate AI Title
      console.log('1️⃣ Generating AI title...')
      const title = await this.aiGenerator.generateTitle(keyword)
      console.log(`   ✅ Title: "${title}"`)
      
      // Step 2: Generate slug
      const slug = this.slugify(keyword)
      console.log(`   📝 Slug: "${slug}"`)
      
      // Step 3: Generate AI Content
      console.log('2️⃣ Generating AI content (1500-2000 words)...')
      const aiContent = await this.aiGenerator.generateContent(keyword, title)
      console.log(`   ✅ Content: ${aiContent.content.length} characters`)
      console.log(`   ✅ Meta: ${aiContent.metaDescription}`)
      console.log(`   ✅ Tags: ${aiContent.tags.join(', ')}`)
      
      // Step 3.5: Check for duplicate content
      console.log('2️⃣.5 Checking for duplicate content...')
      const duplicateCheck = await this.duplicateChecker.checkAgainstDatabase(
        aiContent.content,
        'database/content/generated-blogs.json'
      )
      
      if (!duplicateCheck.isOriginal && duplicateCheck.maxSimilarity > 0.7) {
        console.warn(`   ⚠️ High similarity detected: ${(duplicateCheck.maxSimilarity * 100).toFixed(1)}%`)
        console.log('   🔄 Regenerating with different prompt...')
        
        // Retry with modified keyword
        const retryKeyword = `${keyword} panduan terbaru`
        const retryContent = await this.aiGenerator.generateContent(retryKeyword, title)
        Object.assign(aiContent, retryContent)
        
        console.log('   ✅ Content regenerated successfully')
      } else {
        console.log(`   ✅ Content unique (${(duplicateCheck.isOriginal ? 100 : (1 - duplicateCheck.maxSimilarity) * 100).toFixed(1)}% uniqueness)`)
      }
      
      // Check keyword stuffing
      const stuffingCheck = this.duplicateChecker.detectKeywordStuffing(aiContent.content, keyword)
      if (stuffingCheck.isStuffed) {
        console.warn(`   ⚠️ Keyword stuffing: ${stuffingCheck.density.toFixed(2)}%`)
      }
      
      // Step 4: Generate and Save Image
      console.log('3️⃣ Generating and saving image...')
      const savedImagePath = await this.generateAndSaveImage(keyword, title, slug)
      console.log(`   ✅ Image: ${savedImagePath}`)
      
      // Step 5: Calculate metrics
      const wordCount = this.countWords(aiContent.content)
      const readTime = Math.ceil(wordCount / 200) // Average 200 words/minute
      const seoScore = this.calculateSEOScore(aiContent, wordCount)
      
      console.log(`   📊 Word Count: ${wordCount}`)
      console.log(`   ⏱️ Read Time: ${readTime} minutes`)
      console.log(`   🎯 SEO Score: ${seoScore}/100`)
      
      // Step 6: Create blog object
      const blog: BlogData = {
        id: Date.now() + Math.random(),
        slug,
        title,
        content: aiContent.content,
        excerpt: aiContent.excerpt,
        author: pickAuthorForSlug(slug),
        date: new Date().toISOString(),
        image: savedImagePath,
        imageUrl: savedImagePath,
        featured_image: savedImagePath,
        categories: [aiContent.category, 'Blog'],
        tags: aiContent.tags,
        metaTitle: title,
        metaDescription: aiContent.metaDescription,
        metaKeywords: aiContent.metaKeywords,
        schema: aiContent.schema,
        aiGenerated: true,
        aiModel: 'gpt-4o-mini',
        wordCount,
        readTime,
        seoScore,
        updatedAt: new Date().toISOString(),
        keywordId: id,
        originalKeyword: keyword
      }
      
      // Step 7: Save blog
      console.log('4️⃣ Saving blog to database...')
      await this.saveBlog(blog)
      console.log(`   ✅ Blog saved successfully`)
      
      // Step 8: Submit to Google for indexing
      console.log('5️⃣ Submitting to search engines...')
      const baseUrl = process.env.BASE_URL || 'https://jasapembayaran.com'
      const blogUrl = `${baseUrl}/blog/${slug}`
      await this.googleIndexing.submitToAllSearchEngines(blogUrl)
      console.log(`   ✅ Submitted to search engines`)
      
      // Step 9: Track in Analytics
      console.log('6️⃣ Initializing analytics tracking...')
      await this.analyticsTracker.trackGAEvent('article_published', {
        article_slug: slug,
        article_title: title,
        word_count: wordCount,
        seo_score: seoScore,
        category: aiContent.category
      })
      console.log(`   ✅ Analytics initialized`)
      
      // Step 10: Update latest tags (12 tags terbaru)
      console.log('7️⃣ Updating latest tags...')
      await this.updateLatestTags(aiContent.tags, keyword)
      console.log(`   ✅ Latest tags updated`)
      
      console.log(`🎉 === Blog ${id} completed successfully! ===\n`)
      return blog
      
    } catch (error) {
      console.error(`❌ Error generating AI blog for "${keyword}":`, error)
      return null
    }
  }

  /**
   * Save blog to all necessary locations
   */
  async saveBlog(blog: BlogData) {
    try {
      // 1. Save individual JSON file
      const blogDir = path.join(process.cwd(), 'data/blog/generated')
      await fs.mkdir(blogDir, { recursive: true })
      const blogFile = path.join(blogDir, `${blog.slug}.json`)
      await fs.writeFile(blogFile, JSON.stringify(blog, null, 2))
      console.log(`   💾 Saved to: ${blogFile}`)
      
      // 2. Update generated-blogs.json (main database)
      await this.updateGeneratedBlogs(blog)
      
      // 3. Update latest-posts.json
      await this.updateLatestPosts(blog)
      
      // 4. Update sitemap (for Google)
      await this.updateSitemap(blog)
      
      // 5. Create markdown file for Nuxt Content (optional)
      await this.createMarkdownFile(blog)
      
    } catch (error) {
      console.error('❌ Error saving blog:', error)
    }
  }

  async updateGeneratedBlogs(newBlog: BlogData) {
    try {
      const dbPath = path.join(process.cwd(), 'database/content/generated-blogs.json')
      let blogs: any[] = []
      
      try {
        const content = await fs.readFile(dbPath, 'utf-8')
        blogs = JSON.parse(content)
      } catch {
        blogs = []
      }
      
      // Remove duplicate if exists
      blogs = blogs.filter((b: any) => b.slug !== newBlog.slug)
      
      // Add new blog at the beginning
      blogs.unshift({
        id: newBlog.id,
        slug: newBlog.slug,
        title: newBlog.title,
        content: newBlog.content,
        excerpt: newBlog.excerpt,
        author: newBlog.author,
        date: newBlog.date,
        image: newBlog.image,
        featured_image: newBlog.featured_image,
        categories: newBlog.categories,
        tags: newBlog.tags,
        metaTitle: newBlog.metaTitle,
        metaDescription: newBlog.metaDescription,
        metaKeywords: newBlog.metaKeywords,
        schema: newBlog.schema,
        wordCount: newBlog.wordCount,
        readTime: newBlog.readTime,
        seoScore: newBlog.seoScore,
        aiGenerated: true,
        aiModel: newBlog.aiModel
      })
      
      // Keep latest 200 blogs
      blogs = blogs.slice(0, 200)
      
      await fs.writeFile(dbPath, JSON.stringify(blogs, null, 2))
      console.log('   ✅ Updated generated-blogs.json')
      
    } catch (error) {
      console.error('   ❌ Error updating generated blogs:', error)
    }
  }

  async updateLatestPosts(newBlog: BlogData) {
    try {
      const latestPath = path.join(process.cwd(), 'data/blog/latest-posts.json')
      let posts: any[] = []
      
      try {
        const content = await fs.readFile(latestPath, 'utf-8')
        posts = JSON.parse(content)
      } catch {
        posts = []
      }
      
      // Add new blog
      posts.unshift({
        slug: newBlog.slug,
        title: newBlog.title,
        date: newBlog.date,
        image: newBlog.image,
        excerpt: newBlog.excerpt,
        category: newBlog.categories[0],
        readTime: newBlog.readTime
      })
      
      // Keep latest 50
      posts = posts.slice(0, 50)
      
      await fs.writeFile(latestPath, JSON.stringify(posts, null, 2))
      console.log('   ✅ Updated latest-posts.json')
      
    } catch (error) {
      console.error('   ❌ Error updating latest posts:', error)
    }
  }

  async updateSitemap(newBlog: BlogData) {
    try {
      const sitemapPath = path.join(process.cwd(), 'data/blog/sitemap.json')
      let sitemap: any[] = []
      
      try {
        const content = await fs.readFile(sitemapPath, 'utf-8')
        sitemap = JSON.parse(content)
      } catch {
        sitemap = []
      }
      
      // Add new entry
      sitemap.push({
        loc: `/blog/${newBlog.slug}`,
        lastmod: newBlog.date,
        changefreq: 'weekly',
        priority: 0.8
      })
      
      await fs.writeFile(sitemapPath, JSON.stringify(sitemap, null, 2))
      console.log('   ✅ Updated sitemap.json')
      
    } catch (error) {
      console.error('   ❌ Error updating sitemap:', error)
    }
  }

  async createMarkdownFile(blog: BlogData) {
    try {
      const mdDir = path.join(process.cwd(), 'content/blog')
      await fs.mkdir(mdDir, { recursive: true })
      
      const mdContent = `---
title: ${blog.title}
description: ${blog.metaDescription}
date: ${blog.date}
image: ${blog.image}
author: ${blog.author}
category: ${blog.categories[0]}
tags: ${JSON.stringify(blog.tags)}
slug: ${blog.slug}
readTime: ${blog.readTime}
seoScore: ${blog.seoScore}
aiGenerated: true
---

${blog.content}
`
      
      const mdPath = path.join(mdDir, `${blog.slug}.md`)
      await fs.writeFile(mdPath, mdContent)
      console.log(`   ✅ Created markdown: ${mdPath}`)
      
    } catch (error) {
      console.error('   ❌ Error creating markdown:', error)
    }
  }

  /**
   * Run daily generation - 10 articles with REAL AI
   */
  async runDailyGeneration() {
    if (this.isRunning) {
      console.log('⏳ Generation already running, skipping...')
      return { success: false, message: 'Already running' }
    }

    this.isRunning = true
    const startTime = Date.now()
    
    console.log('\n' + '='.repeat(70))
    console.log('🌅 STARTING DAILY AI BLOG GENERATION')
    console.log('='.repeat(70))
    console.log(`⏰ Time: ${new Date().toLocaleString('id-ID')}`)
    const envDaily = Math.min(
      Math.max(parseInt(process.env.MAX_DAILY_POSTS || String(this.rotation.dailyCount) || '20', 10) || 20, 1),
      50
    )
    console.log(`🎯 Target: ${envDaily} AI-generated articles (per MAX_DAILY_POSTS env)`)
    console.log('='.repeat(70) + '\n')
    
    if (this.keywords.length === 0) {
      console.log('❌ No keywords available')
      this.isRunning = false
      return { success: false, message: 'No keywords' }
    }
    
    const dailyCount = envDaily
    const startIndex = this.rotation.index
    const generatedBlogs: BlogData[] = []
    const errors: any[] = []
    
      // Generate blogs with REAL AI - satu persatu secara urut
      for (let i = 0; i < dailyCount; i++) {
        const currentIndex = (startIndex + i) % this.keywords.length
        const keywordData = this.keywords[currentIndex]
        
        console.log(`\n${'='.repeat(70)}`)
        console.log(`📌 Progress: ${i + 1}/${dailyCount}`)
        console.log(`🔑 Keyword ${currentIndex + 1}/${this.keywords.length}: "${keywordData.keyword}"`)
        console.log(`${'='.repeat(70)}`)
        
        try {
          // Generate satu artikel secara urut
          const blog = await this.generateBlogWithAI(keywordData)
          
          if (blog) {
            generatedBlogs.push(blog)
            console.log(`✅ Success! Blog ${i + 1}/${dailyCount} generated: "${blog.title}"`)
          } else {
            errors.push({ keyword: keywordData.keyword, error: 'Generation returned null' })
            console.log(`❌ Failed to generate blog ${i + 1}/${dailyCount}`)
          }
          
          // Rate limiting - wait 5 seconds between API calls
          if (i < dailyCount - 1) {
            console.log('⏳ Waiting 5 seconds before next generation...')
            await new Promise(resolve => setTimeout(resolve, 5000))
          }
          
        } catch (error) {
          errors.push({ keyword: keywordData.keyword, error: String(error) })
          console.error(`❌ Error with keyword "${keywordData.keyword}":`, error)
        }
      }
    
    // Update rotation
    this.rotation.index = (startIndex + dailyCount) % this.keywords.length
    this.rotation.currentDay++
    this.rotation.totalGenerated += generatedBlogs.length
    this.rotation.lastRunDate = new Date().toISOString()
    
    await this.saveRotation()
    
    // Step 10: Clear cache and revalidate
    if (generatedBlogs.length > 0) {
      console.log('\n🔄 Step 10: Cache Invalidation & Revalidation...')
      const blogSlugs = generatedBlogs.map(b => b.slug)
      await this.cacheManager.invalidateAfterBlogGeneration(blogSlugs)
      console.log('✅ Cache cleared - new articles will appear immediately!')
    }
    
    // Step 11: Generate performance report
    console.log('\n📊 Step 11: Generating analytics report...')
    await this.analyticsTracker.generateReport()
    
    const endTime = Date.now()
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(2)
    
    // Final report
    console.log('\n' + '='.repeat(70))
    console.log('🎉 DAILY GENERATION COMPLETE!')
    console.log('='.repeat(70))
    console.log(`✅ Successfully generated: ${generatedBlogs.length}/${dailyCount} articles`)
    console.log(`❌ Errors: ${errors.length}`)
    console.log(`⏱️ Total time: ${duration} minutes`)
    console.log(`📍 Next start index: ${this.rotation.index}`)
    console.log(`📊 Total generated to date: ${this.rotation.totalGenerated}`)
    
    if (generatedBlogs.length > 0) {
      console.log('\n📚 Generated Articles:')
      generatedBlogs.forEach((blog, idx) => {
        console.log(`   ${idx + 1}. "${blog.title}" (${blog.wordCount} words, SEO: ${blog.seoScore}/100)`)
      })
    }
    
    if (errors.length > 0) {
      console.log('\n⚠️ Errors:')
      errors.forEach((err, idx) => {
        console.log(`   ${idx + 1}. ${err.keyword}: ${err.error}`)
      })
    }
    
    console.log('='.repeat(70) + '\n')
    
    this.isRunning = false
    
    return {
      success: true,
      generated: generatedBlogs.length,
      errors: errors.length,
      duration,
      blogs: generatedBlogs.map(b => ({ slug: b.slug, title: b.title, seoScore: b.seoScore }))
    }
  }

  /**
   * Check if it's time to run (3 AM daily)
   */
  async checkSchedule() {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const today = now.toDateString()
    const lastRun = this.rotation.lastRunDate ? new Date(this.rotation.lastRunDate).toDateString() : ''
    
    // Run at 3 AM and only once per day
    if (currentHour === 3 && currentMinute === 0 && today !== lastRun) {
      console.log('⏰ Scheduled time reached (03:00) - Starting AI generation')
      await this.runDailyGeneration()
    }
  }

  /**
   * Calculate SEO score
   */
  private calculateSEOScore(content: AIGeneratedContent, wordCount: number): number {
    let score = 0
    
    // Word count (30 points)
    if (wordCount >= 1500) score += 30
    else if (wordCount >= 1000) score += 20
    else if (wordCount >= 500) score += 10
    
    // Meta description (20 points)
    const metaLen = content.metaDescription.length
    if (metaLen >= 150 && metaLen <= 160) score += 20
    else if (metaLen >= 140 && metaLen <= 170) score += 15
    else score += 10
    
    // Title length (20 points)
    const titleLen = content.title.length
    if (titleLen >= 50 && titleLen <= 60) score += 20
    else if (titleLen >= 40 && titleLen <= 70) score += 15
    else score += 10
    
    // Tags (10 points)
    if (content.tags.length >= 6) score += 10
    else if (content.tags.length >= 4) score += 7
    else score += 5
    
    // Keywords (10 points)
    if (content.metaKeywords.length >= 8) score += 10
    else if (content.metaKeywords.length >= 5) score += 7
    else score += 5
    
    // Structure (10 points) - check for headings
    const hasH1 = content.content.includes('<h1>')
    const hasH2 = content.content.includes('<h2>')
    const hasList = content.content.includes('<ul>') || content.content.includes('<ol>')
    if (hasH1 && hasH2 && hasList) score += 10
    else if (hasH1 && hasH2) score += 7
    else score += 5
    
    return Math.min(score, 100)
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    return text.split(' ').filter(w => w.length > 0).length
  }

  /**
   * Hash string
   */
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  /**
   * Slugify text
   */
  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  /**
   * Update latest tags (12 tags terbaru sesuai keyword)
   */
  async updateLatestTags(newTags: string[], keyword: string): Promise<void> {
    try {
      const tagsPath = path.join(process.cwd(), 'data/blog/latest-tags.json')
      let tags: Array<{ name: string; slug: string; count: number; lastUsed: string }> = []
      
      try {
        const content = await fs.readFile(tagsPath, 'utf-8')
        tags = JSON.parse(content)
      } catch {
        tags = []
      }
      
      const now = new Date().toISOString()
      
      // Add new tags from this article
      for (const tagName of newTags) {
        const tagSlug = this.slugify(tagName)
        const existingIndex = tags.findIndex(t => t.slug === tagSlug)
        
        if (existingIndex >= 0) {
          // Update existing tag
          tags[existingIndex].count++
          tags[existingIndex].lastUsed = now
        } else {
          // Add new tag
          tags.push({
            name: tagName,
            slug: tagSlug,
            count: 1,
            lastUsed: now
          })
        }
      }
      
      // Sort by lastUsed (newest first), then by count
      tags.sort((a, b) => {
        const dateCompare = new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
        if (dateCompare !== 0) return dateCompare
        return b.count - a.count
      })
      
      // Keep only latest 12 tags
      const latestTags = tags.slice(0, 12)
      
      await fs.writeFile(tagsPath, JSON.stringify(latestTags, null, 2))
      console.log(`   📌 Updated latest 12 tags: ${latestTags.map(t => t.name).join(', ')}`)
      
    } catch (error) {
      console.error('   ❌ Error updating latest tags:', error)
    }
  }
}

// Global scheduler instance
let scheduler: AIBlogScheduler

export default defineNitroPlugin(async () => {
  // Check if enabled
  const enabled = process.env.NUXT_ENABLE_AI_BLOG === 'true' || process.env.NUXT_ENABLE_AUTO_BLOG === 'true'
  
  if (!enabled) {
    console.log('[ai-blog-scheduler] Disabled. Set NUXT_ENABLE_AI_BLOG=true to enable.')
    return
  }

  // Check if OpenAI key is set
  if (!process.env.OPENAI_API_KEY && !process.env.NUXT_OPENAI_API_KEY) {
    console.warn('[ai-blog-scheduler] ⚠️ OpenAI API key not set. Please set OPENAI_API_KEY or NUXT_OPENAI_API_KEY')
    console.warn('[ai-blog-scheduler] Scheduler will use fallback content generator')
  }

  // Initialize scheduler
  scheduler = new AIBlogScheduler()
  await scheduler.init()

  // Check schedule every minute
  setInterval(() => {
    scheduler.checkSchedule()
  }, 60000) // Every 1 minute

  console.log('[ai-blog-scheduler] ✅ AI Blog Scheduler active')
  console.log('[ai-blog-scheduler] ⏰ Will run daily at 03:00')
  console.log('[ai-blog-scheduler] 🎯 Target: 20 AI articles per day')
  console.log('[ai-blog-scheduler] 🤖 Model: GPT-4o-mini (OpenAI)')
  console.log('[ai-blog-scheduler] 📋 Keywords: Processed in order, one by one')
  console.log('[ai-blog-scheduler] 🏷️ Tags: 12 latest tags generated after each article')
  console.log('[ai-blog-scheduler] ✍️ Authors: Random from 100 names pool')
})

// Export scheduler instance for manual trigger
export { scheduler }

