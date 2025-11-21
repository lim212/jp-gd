// Enhanced Auto Blog Scheduler with Monitoring and Error Handling
// This is an improved version of the original auto-blog-scheduler.server.ts

import { promises as fs } from 'fs'
import path from 'path'

// Import our new utilities
import AutoBlogMonitor from './server/utils/auto-blog-monitor.js'
import AutoBlogErrorHandler from './server/utils/auto-blog-error-handler.js'
import AutoBlogPerformance from './server/utils/auto-blog-performance.js'
import AutoBlogBackup from './server/utils/auto-blog-backup.js'
import AutoBlogNotification from './server/utils/auto-blog-notification.js'

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
  aiImageUrl: string
  updatedAt: string
  updateReason: string
  keywordId: number
  originalKeyword: string
}

interface RotationData {
  index: number
  lastReset: string
  totalKeywords: number
  dailyCount: number
  currentDay: number
}

class EnhancedAutoBlogScheduler {
  private keywords: KeywordData[] = []
  private rotation: RotationData = {
    index: 0,
    lastReset: new Date().toISOString(),
    totalKeywords: 0,
    dailyCount: 10,
    currentDay: 0
  }
  private isRunning = false
  
  // Enhanced components
  private monitor: AutoBlogMonitor
  private errorHandler: AutoBlogErrorHandler
  private performance: AutoBlogPerformance
  private backup: AutoBlogBackup
  private notification: AutoBlogNotification

  constructor() {
    this.monitor = new AutoBlogMonitor()
    this.errorHandler = new AutoBlogErrorHandler()
    this.performance = new AutoBlogPerformance()
    this.backup = new AutoBlogBackup()
    this.notification = new AutoBlogNotification()
  }

  async init() {
    console.log('🚀 Initializing Enhanced Auto Blog Scheduler...')
    
    try {
      // Load keywords and rotation
      await this.loadKeywords()
      await this.loadRotation()
      
      // Ensure directories exist
      await this.ensureDirectories()
      
      // Create initial backup
      await this.backup.createBackup()
      
      // Send initialization notification
      await this.notification.notifyInfo('Enhanced Auto Blog Scheduler initialized', {
        keywords: this.keywords.length,
        schedule: '03:00 daily'
      })
      
      console.log('✅ Enhanced Auto Blog Scheduler ready')
      
    } catch (error) {
      this.errorHandler.logError(error, { phase: 'initialization' })
      await this.notification.notifyError('Failed to initialize scheduler', { error: error.message })
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
      
      console.log(`📝 Loaded ${this.keywords.length} keywords from ${keywordPath}`)
      
    } catch (error) {
      this.errorHandler.logError(error, { phase: 'loadKeywords' })
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
      
      console.log(`📍 Current keyword index: ${this.rotation.index}`)
      
    } catch (error) {
      this.errorHandler.logError(error, { phase: 'loadRotation' })
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
      this.errorHandler.logError(error, { phase: 'saveRotation' })
    }
  }

  async ensureDirectories() {
    const dirs = [
      'data/blog/generated',
      'public/images/blog',
      'data/blog/images',
      'public/images/dummy',
      'logs',
      'backups'
    ]

    for (const dir of dirs) {
      try {
        await fs.mkdir(path.join(process.cwd(), dir), { recursive: true })
      } catch (error) {
        // Directory might already exist
      }
    }
  }

  async generateHumanTitle(keyword: string): Promise<string> {
    const timer = this.performance.startTimer('titleGeneration')
    
    try {
      const { generatePlaceholderPostBySlug } = await import('./server/utils/ai.js')
      const post = await generatePlaceholderPostBySlug(this.slugify(keyword))
      timer.end()
      return post.title
    } catch (error) {
      timer.end()
      this.errorHandler.logError(error, { phase: 'generateTitle', keyword })
      return `Panduan Lengkap ${keyword} - Tips & Trik Terbaik 2025`
    }
  }

  async generateHumanContent(keyword: string, title: string): Promise<string> {
    const timer = this.performance.startTimer('contentGeneration')
    
    try {
      const { generatePlaceholderPostBySlug } = await import('./server/utils/ai.js')
      const post = await generatePlaceholderPostBySlug(this.slugify(keyword))
      timer.end()
      return post.content
    } catch (error) {
      timer.end()
      this.errorHandler.logError(error, { phase: 'generateContent', keyword })
      return this.generateFallbackContent(keyword, title)
    }
  }

  generateFallbackContent(keyword: string, title: string): string {
    return `
<h1>${title}</h1>

<p>Dalam panduan lengkap ini, kami akan membahas secara detail tentang <strong>${keyword}</strong>. Sebagai penyedia jasa pembayaran terpercaya di Indonesia, JasaPembayaran.com memiliki pengalaman bertahun-tahun dalam membantu ribuan klien dengan berbagai kebutuhan pembayaran digital.</p>

<h2>Apa itu ${keyword}?</h2>
<p><strong>${keyword}</strong> adalah layanan yang sangat dibutuhkan di era digital saat ini. Dengan perkembangan teknologi yang pesat, kebutuhan akan layanan pembayaran yang aman, cepat, dan terpercaya semakin meningkat.</p>

<h2>Mengapa Memilih ${keyword} dari JasaPembayaran.com?</h2>
<p>Ada beberapa keunggulan yang membuat layanan ${keyword} kami menjadi pilihan utama:</p>
<ul>
<li><strong>Keamanan Terjamin:</strong> Sistem keamanan berlapis dengan enkripsi tingkat militer</li>
<li><strong>Proses Cepat:</strong> Transaksi selesai dalam hitungan menit, bukan jam</li>
<li><strong>Biaya Terjangkau:</strong> Tarif kompetitif tanpa biaya tersembunyi</li>
<li><strong>Support 24/7:</strong> Tim customer service siap membantu kapan saja</li>
</ul>

<h2>FAQ - Pertanyaan yang Sering Diajukan</h2>
<p><strong>Q: Apakah layanan ${keyword} aman dan legal?</strong><br>
A: Ya, semua layanan kami 100% legal dan aman. Kami memiliki izin resmi dan menggunakan sistem keamanan berlapis untuk melindungi data klien.</p>

<h2>Kesimpulan</h2>
<p><strong>${keyword}</strong> adalah solusi terpercaya untuk kebutuhan pembayaran digital Anda. Dengan pengalaman bertahun-tahun dan ribuan klien puas, JasaPembayaran.com siap memberikan layanan terbaik dengan standar keamanan dan kualitas tertinggi.</p>
`
  }

  async generateImage(title: string, keyword: string): Promise<string> {
    const timer = this.performance.startTimer('imageGeneration')
    
    try {
      const humanPrompts = [
        `${title}, professional business photo, natural lighting, real people, authentic setting, high quality photography`,
        `${keyword} service, modern office environment, team collaboration, genuine interaction, professional photography`,
        `${title}, real-world application, natural environment, authentic moment, professional documentary style`,
        `${keyword} solution, contemporary workspace, human-centered design, realistic scenario, high-end photography`
      ]
      
      const promptIndex = this.hashString(keyword) % humanPrompts.length
      const selectedPrompt = humanPrompts[promptIndex]
      
      const services = [
        () => this.generatePollinationsImage(selectedPrompt, keyword),
        () => this.generateUnsplashImage(keyword),
        () => this.getRandomDummyImage()
      ]
      
      const serviceIndex = this.hashString(keyword) % services.length
      const imageUrl = await services[serviceIndex]()
      
      timer.end()
      console.log(`✅ Generated image for "${keyword}": ${imageUrl}`)
      return imageUrl
      
    } catch (error) {
      timer.end()
      this.errorHandler.logError(error, { phase: 'generateImage', keyword })
      return this.getRandomDummyImage()
    }
  }

  async generatePollinationsImage(prompt: string, keyword: string): Promise<string> {
    const cleanPrompt = prompt.replace(/[^\w\s-]/g, '').trim()
    const encoded = encodeURIComponent(cleanPrompt)
    const seed = this.hashString(keyword)
    return `https://image.pollinations.ai/prompt/${encoded}?seed=${seed}&width=1200&height=630&nologo=true&enhance=true&model=flux`
  }

  async generateUnsplashImage(keyword: string): Promise<string> {
    const cleanKeyword = keyword.replace(/[^\w\s]/g, '').trim()
    return `https://source.unsplash.com/1200x630/?${encodeURIComponent(cleanKeyword)}&sig=${this.hashString(keyword)}`
  }

  hashString(input: string): number {
    let h = 2166136261 >>> 0
    for (let i = 0; i < input.length; i++) { 
      h ^= input.charCodeAt(i); 
      h = Math.imul(h, 16777619) 
    }
    return h >>> 0
  }

  getRandomDummyImage(): string {
    const dummyNumber = Math.floor(Math.random() * 100) + 1
    return `/images/dummy/dummy-${dummyNumber}.jpg`
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  generateExcerpt(content: string): string {
    const firstParagraph = content.match(/<p[^>]*>(.*?)<\/p>/i)
    if (firstParagraph) {
      return firstParagraph[1]
        .replace(/<[^>]*>/g, '')
        .substring(0, 160)
        .trim() + '...'
    }
    
    return content.replace(/<[^>]*>/g, '').substring(0, 160).trim() + '...'
  }

  async generateBlog(keywordData: KeywordData): Promise<BlogData | null> {
    const { id, keyword } = keywordData
    const generationTimer = this.performance.startTimer('blogGeneration')
    
    console.log(`📝 Generating blog for keyword ${id}: ${keyword}`)
    
    try {
      // Generate title
      const title = await this.generateHumanTitle(keyword)
      console.log(`✅ Generated title: ${title}`)
      
      // Generate content
      const content = await this.generateHumanContent(keyword, title)
      console.log(`✅ Generated content (${content.length} chars)`)
      
      // Generate image
      const imageUrl = await this.generateImage(title, keyword)
      console.log(`✅ Generated image: ${imageUrl}`)
      
      // Create blog object
      const blog: BlogData = {
        id: Date.now() + Math.random(),
        slug: this.slugify(keyword),
        title,
        content,
        excerpt: this.generateExcerpt(content),
        author: 'JasaPembayaran.com Team',
        date: new Date().toISOString(),
        image: imageUrl,
        imageUrl,
        featured_image: imageUrl,
        categories: ['Blog', 'Panduan'],
        tags: [keyword, 'tips', 'panduan', 'indonesia'],
        aiImageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
        updateReason: 'Auto-generated with ChatGPT',
        keywordId: id,
        originalKeyword: keyword
      }
      
      // Save blog
      await this.saveBlog(blog)
      
      const duration = generationTimer.end()
      this.monitor.logGeneration(true, duration, 1)
      
      console.log(`✅ Blog saved: ${blog.slug}`)
      return blog
      
    } catch (error) {
      const duration = generationTimer.end()
      this.monitor.logGeneration(false, duration, 0)
      this.errorHandler.logError(error, { phase: 'generateBlog', keyword })
      await this.notification.notifyError(`Failed to generate blog for ${keyword}`, { error: error.message })
      return null
    }
  }

  async saveBlog(blog: BlogData) {
    try {
      // Ensure directory exists
      const blogDir = path.join(process.cwd(), 'data/blog/generated')
      await fs.mkdir(blogDir, { recursive: true })
      
      // Save individual blog file
      const blogFile = path.join(blogDir, `${blog.slug}.json`)
      await fs.writeFile(blogFile, JSON.stringify(blog, null, 2))
      
      // Also save to generated-blogs.json for API integration
      await this.updateGeneratedBlogs(blog)
      
      // Update latest posts
      await this.updateLatestPosts(blog)
      
      // Update popular posts
      await this.updatePopularPosts(blog)
      
      console.log(`✅ Blog saved to: ${blogFile}`)
      
    } catch (error) {
      this.errorHandler.logError(error, { phase: 'saveBlog', slug: blog.slug })
    }
  }

  async updateGeneratedBlogs(newBlog: BlogData) {
    try {
      const databaseContentDir = path.join(process.cwd(), 'database', 'content')
      await fs.mkdir(databaseContentDir, { recursive: true })
      
      const generatedFile = path.join(databaseContentDir, 'generated-blogs.json')
      let generatedBlogs: any[] = []
      
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
        meta_description: newBlog.excerpt
      }
      
      generatedBlogs = generatedBlogs.filter(b => b.slug !== newBlog.slug)
      generatedBlogs.unshift(generatedBlog)
      generatedBlogs = generatedBlogs.slice(0, 100)
      
      await fs.writeFile(generatedFile, JSON.stringify(generatedBlogs, null, 2))
      console.log('✅ Updated generated blogs')
      
    } catch (error) {
      this.errorHandler.logError(error, { phase: 'updateGeneratedBlogs' })
    }
  }

  async updateLatestPosts(newBlog: BlogData) {
    try {
      const latestFile = path.join(process.cwd(), 'data/blog/latest-posts.json')
      let latestPosts: any[] = []
      
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
        image: newBlog.image
      })
      
      latestPosts = latestPosts.slice(0, 50)
      
      await fs.writeFile(latestFile, JSON.stringify(latestPosts, null, 2))
      console.log('✅ Updated latest posts')
      
    } catch (error) {
      this.errorHandler.logError(error, { phase: 'updateLatestPosts' })
    }
  }

  async updatePopularPosts(newBlog: BlogData) {
    try {
      const popularFile = path.join(process.cwd(), 'data/blog/popular-posts.json')
      let popularPosts: any = {}
      
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
        date: newBlog.date
      }
      
      await fs.writeFile(popularFile, JSON.stringify(popularPosts, null, 2))
      console.log('✅ Updated popular posts')
      
    } catch (error) {
      this.errorHandler.logError(error, { phase: 'updatePopularPosts' })
    }
  }

  async runDailyGeneration() {
    if (this.isRunning) {
      console.log('⏳ Daily generation already running, skipping...')
      return
    }

    this.isRunning = true
    const dailyTimer = this.performance.startTimer('dailyGeneration')
    
    console.log('🌅 Starting daily blog generation at 03:00...')
    
    try {
      if (this.keywords.length === 0) {
        throw new Error('No keywords available')
      }
      
      const startIndex = this.rotation.index
      const endIndex = Math.min(startIndex + this.rotation.dailyCount, this.keywords.length)
      
      console.log(`📊 Generating 10 blogs starting from keyword ${startIndex + 1} to ${endIndex} of ${this.keywords.length}`)
      
      const generatedBlogs: BlogData[] = []
      
      for (let i = startIndex; i < endIndex; i++) {
        const keywordData = this.keywords[i]
        console.log(`📝 Processing keyword ${i + 1}/${this.keywords.length}: ${keywordData.keyword}`)
        
        const blog = await this.generateBlog(keywordData)
        
        if (blog) {
          generatedBlogs.push(blog)
          console.log(`✅ Blog ${generatedBlogs.length}/10 generated successfully`)
        }
        
        // Rate limiting - wait between generations to avoid API limits
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
      
      // Update rotation
      this.rotation.index = endIndex
      this.rotation.currentDay++
      
      if (this.rotation.index >= this.keywords.length) {
        this.rotation.index = 0
        console.log('🔄 Reset keyword rotation - starting from keyword 1 again')
      }
      
      await this.saveRotation()
      
      const duration = dailyTimer.end()
      this.monitor.logGeneration(true, duration, generatedBlogs.length)
      
      console.log(`✅ Daily generation complete: ${generatedBlogs.length} blogs generated`)
      console.log(`📍 Next generation will start from keyword ${this.rotation.index + 1}`)
      
      // Create backup after successful generation
      await this.backup.createBackup()
      
      // Send success notification
      await this.notification.notifySuccess(`Daily generation completed successfully`, {
        blogsGenerated: generatedBlogs.length,
        duration: duration,
        nextIndex: this.rotation.index + 1
      })
      
      // Schedule Nuxt Pro rebuild after 1 hour
      if (generatedBlogs.length > 0) {
        console.log('🔄 Scheduling Nuxt Pro rebuild in 1 hour...')
        try {
          const { NuxtProRebuildManager } = await import('./nuxt-pro-rebuild-manager.js')
          const rebuildManager = new NuxtProRebuildManager()
          const scheduledTime = await rebuildManager.scheduleRebuild('After daily blog generation')
          console.log(`✅ Nuxt Pro rebuild scheduled for: ${scheduledTime.toISOString()}`)
        } catch (error) {
          this.errorHandler.logError(error, { phase: 'scheduleRebuild' })
        }
      }
      
      return generatedBlogs
      
    } catch (error) {
      const duration = dailyTimer.end()
      this.monitor.logGeneration(false, duration, 0)
      this.errorHandler.logError(error, { phase: 'runDailyGeneration' })
      await this.notification.notifyError('Daily generation failed', { error: error.message })
      throw error
    } finally {
      this.isRunning = false
    }
  }

  async checkSchedule() {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    // Run at 3 AM (03:00)
    if (currentHour === 3 && currentMinute === 0) {
      console.log('⏰ Scheduled time reached (03:00) - starting generation')
      try {
        await this.runDailyGeneration()
      } catch (error) {
        this.errorHandler.logError(error, { phase: 'checkSchedule' })
        await this.notification.notifyError('Scheduled generation failed', { error: error.message })
      }
    }
  }

  // Health check method
  getHealthStatus() {
    return this.monitor.getHealthStatus()
  }

  // Performance report method
  getPerformanceReport() {
    return this.performance.getPerformanceReport()
  }

  // Error statistics method
  getErrorStats() {
    return this.errorHandler.getErrorStats()
  }
}

// Global scheduler instance
let scheduler: EnhancedAutoBlogScheduler

export default defineNitroPlugin(async () => {
  // Only run in production or when explicitly enabled
  const isDev = process.env.NODE_ENV === 'development'
  const enabled = process.env.NUXT_ENABLE_AUTO_BLOG === 'true'
  
  if (isDev && !enabled) {
    console.log('[enhanced-auto-blog-scheduler] Dev mode detected — scheduler disabled (set NUXT_ENABLE_AUTO_BLOG=true to override)')
    return
  }

  if (!enabled) {
    console.log('[enhanced-auto-blog-scheduler] Scheduler disabled (default). Set NUXT_ENABLE_AUTO_BLOG=true to enable.')
    return
  }

  try {
    // Initialize enhanced scheduler
    scheduler = new EnhancedAutoBlogScheduler()
    await scheduler.init()

    // Check schedule every minute
    setInterval(() => {
      scheduler.checkSchedule()
    }, 60000)

    console.log('[enhanced-auto-blog-scheduler] Enhanced auto blog scheduler active - will run daily at 03:00')
    
  } catch (error) {
    console.error('[enhanced-auto-blog-scheduler] Failed to initialize:', error)
  }
})
