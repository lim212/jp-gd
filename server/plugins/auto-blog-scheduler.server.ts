// server/plugins/auto-blog-scheduler.server.ts
// Auto Blog Scheduler - ChatGPT Powered
// Runs daily at 3 AM to generate 10 blogs automatically

import { promises as fs } from 'fs'
import path from 'path'
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

class AutoBlogScheduler {
  private keywords: KeywordData[] = []
  private rotation: RotationData = {
    index: 0,
    lastReset: new Date().toISOString(),
    totalKeywords: 0,
    dailyCount: Math.min(
      Math.max(parseInt(process.env.MAX_DAILY_POSTS || '20', 10) || 20, 1),
      50
    ),
    currentDay: 0
  }
  private isRunning = false

  async init() {
    console.log('🚀 Initializing Auto Blog Scheduler...')
    
    // Load keywords and rotation
    await this.loadKeywords()
    await this.loadRotation()
    
    // Ensure directories exist
    await this.ensureDirectories()
    
    console.log('✅ Auto Blog Scheduler ready')
  }

  async loadKeywords() {
    try {
      // Use the correct path from your current file
      const keywordPath = path.join(process.cwd(), 'data/keywords/2025-08-21/list-keyword.txt')
      const content = await fs.readFile(keywordPath, 'utf-8')
      this.keywords = content.split('\n')
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .map((k, index) => ({ id: index + 1, keyword: k }))
      
      console.log(`📝 Loaded ${this.keywords.length} keywords from ${keywordPath}`)
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
      
      console.log(`📍 Current keyword index: ${this.rotation.index}`)
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
      'public/images/blog',
      'data/blog/images',
      'public/images/dummy'
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
    try {
      // Use enhanced content generator
      const EnhancedContentGenerator = (await import('../utils/enhanced-content-generator.js')).default
      const generator = new EnhancedContentGenerator()
      const title = generator.generateTitle(keyword)
      
      console.log(`✅ Generated enhanced title: "${title}" (${title.length} chars)`)
      return title
    } catch (error) {
      console.error('❌ Error generating title:', error)
      // Fallback to simple title (max 60 chars for Google SEO)
      let fallbackTitle = `${keyword} 2025 - Panduan`
      if (fallbackTitle.length > 60) {
        // Smart truncation
        let cutPoint = 57
        while (cutPoint > 40 && fallbackTitle[cutPoint] !== ' ' && fallbackTitle[cutPoint] !== '-') {
          cutPoint--
        }
        fallbackTitle = cutPoint > 40 
          ? fallbackTitle.substring(0, cutPoint).trim()
          : fallbackTitle.substring(0, 57).trim() + '...'
      }
      return fallbackTitle
    }
  }

  async generateHumanContent(keyword: string, title: string): Promise<string> {
    try {
      // Use enhanced content generator
      const EnhancedContentGenerator = (await import('../utils/enhanced-content-generator.js')).default
      const generator = new EnhancedContentGenerator()
      const content = generator.generateContent(keyword)
      
      console.log(`✅ Generated enhanced content: ${content.length} characters`)
      return content
    } catch (error) {
      console.error('❌ Error generating content:', error)
      return this.generateFallbackContent(keyword, title)
    }
  }

  generateFallbackContent(keyword: string, title: string): string {
    return `
<h1>${title}</h1>

<div class="intro-section">
<p>Halo! Apakah Anda sedang mencari informasi tentang <strong>${keyword}</strong>? Anda berada di tempat yang tepat!</p>
<p>Dalam artikel ini, kami akan membahas secara detail tentang ${keyword} yang mungkin Anda butuhkan. Sebagai penyedia jasa pembayaran terpercaya di Indonesia, kami sering mendapat pertanyaan tentang ${keyword}.</p>
</div>

<h2>Apa itu ${keyword}?</h2>
<p>Berdasarkan pengalaman kami melayani ribuan klien, <strong>${keyword}</strong> memang menjadi pilihan yang populer. Tidak sedikit orang yang bertanya tentang ${keyword} karena memang memiliki banyak manfaat.</p>
<p>Kami akan memberikan penjelasan yang mudah dipahami tentang ${keyword}. Sebenarnya, ${keyword} tidak sesulit yang Anda bayangkan.</p>

<h2>Mengapa Memilih ${keyword}?</h2>
<p>Ada beberapa alasan mengapa ${keyword} menjadi pilihan yang tepat untuk kebutuhan Anda:</p>
<ul>
<li><strong>Keamanan Terjamin:</strong> Sistem keamanan berlapis untuk melindungi data Anda</li>
<li><strong>Proses Cepat:</strong> Transaksi selesai dalam hitungan menit</li>
<li><strong>Biaya Terjangkau:</strong> Tarif kompetitif tanpa biaya tersembunyi</li>
<li><strong>Support 24/7:</strong> Tim customer service siap membantu kapan saja</li>
<li><strong>Berpengalaman:</strong> Lebih dari 5 tahun melayani ribuan klien puas</li>
</ul>

<h2>Cara Menggunakan ${keyword}</h2>
<p>Berikut adalah langkah-langkah mudah untuk menggunakan ${keyword}:</p>
<ol>
<li><strong>Konsultasi Gratis:</strong> Hubungi tim kami untuk konsultasi kebutuhan Anda</li>
<li><strong>Verifikasi Identitas:</strong> Proses verifikasi cepat dan aman</li>
<li><strong>Konfirmasi Transaksi:</strong> Detail transaksi akan dikonfirmasi sebelum diproses</li>
<li><strong>Proses Pembayaran:</strong> Tim kami akan memproses pembayaran sesuai instruksi</li>
<li><strong>Konfirmasi Selesai:</strong> Anda akan menerima notifikasi setelah transaksi selesai</li>
</ol>

<h2>Tips & Trik ${keyword}</h2>
<p>Berikut adalah tips dari tim expert kami berdasarkan pengalaman melayani ribuan klien:</p>
<ul>
<li><strong>Persiapkan Dokumen:</strong> Pastikan semua dokumen yang diperlukan sudah lengkap</li>
<li><strong>Komunikasi Jelas:</strong> Berikan instruksi yang detail dan jelas</li>
<li><strong>Timing yang Tepat:</strong> Lakukan transaksi pada jam kerja untuk proses yang lebih cepat</li>
<li><strong>Backup Data:</strong> Simpan semua bukti transaksi dengan aman</li>
<li><strong>Update Informasi:</strong> Pastikan informasi kontak selalu up-to-date</li>
</ul>

<h2>FAQ - Pertanyaan yang Sering Diajukan</h2>
<div class="faq-item">
<p><strong>Q: Apakah ${keyword} aman digunakan?</strong><br>
A: Ya, semua layanan kami 100% legal dan aman. Kami memiliki izin resmi dan menggunakan sistem keamanan berlapis untuk melindungi data klien.</p>
</div>

<div class="faq-item">
<p><strong>Q: Berapa lama proses ${keyword} biasanya?</strong><br>
A: Proses biasanya selesai dalam 1-3 jam kerja, tergantung kompleksitas transaksi dan kelengkapan dokumen.</p>
</div>

<div class="faq-item">
<p><strong>Q: Apakah ada biaya tersembunyi?</strong><br>
A: Tidak ada biaya tersembunyi. Semua biaya akan diinformasikan secara transparan sebelum transaksi dimulai.</p>
</div>

<div class="faq-item">
<p><strong>Q: Bagaimana jika terjadi masalah dengan transaksi?</strong><br>
A: Tim support kami siap membantu 24/7. Kami memiliki sistem refund dan garansi untuk memastikan kepuasan klien.</p>
</div>

<h2>Testimoni Klien</h2>
<div class="testimonial">
<p>"Layanan ${keyword} dari JasaPembayaran.com sangat memuaskan. Proses cepat, aman, dan tim support responsif. Highly recommended!" - <strong>Budi S., Jakarta</strong></p>
</div>

<div class="testimonial">
<p>"Sudah menggunakan layanan ini selama 2 tahun, tidak pernah ada masalah. Pelayanan yang sangat profesional." - <strong>Sari M., Surabaya</strong></p>
</div>

<h2>Kesimpulan</h2>
<p>Demikian penjelasan lengkap tentang <strong>${keyword}</strong>. Semoga artikel ini bermanfaat untuk Anda.</p>
<p>Jika Anda masih memiliki pertanyaan tentang ${keyword}, jangan ragu untuk menghubungi kami. Kami harap artikel tentang ${keyword} ini dapat membantu Anda.</p>

<div class="cta-section">
<h3>🚀 Siap Menggunakan ${keyword}?</h3>
<p>Jangan ragu untuk menghubungi tim kami. Konsultasi gratis dan proses cepat!</p>
<a href="/contact" class="cta-button">Hubungi Sekarang</a>
</div>

<div class="contact-info">
<h3>📞 Hubungi Kami Sekarang</h3>
<p><strong>WhatsApp:</strong> +62-xxx-xxxx-xxxx<br>
<strong>Email:</strong> info@jasapembayaran.com<br>
<strong>Website:</strong> www.jasapembayaran.com</p>
<p><em>Layanan 24/7 - Konsultasi Gratis - Proses Cepat & Aman</em></p>
</div>
`
  }

  async generateImage(title: string, keyword: string): Promise<string> {
    try {
      // Create more human-like, anti-AI prompts
      const humanPrompts = [
        `${title}, professional business photo, natural lighting, real people, authentic setting, high quality photography`,
        `${keyword} service, modern office environment, team collaboration, genuine interaction, professional photography`,
        `${title}, real-world application, natural environment, authentic moment, professional documentary style`,
        `${keyword} solution, contemporary workspace, human-centered design, realistic scenario, high-end photography`
      ]
      
      // Select prompt based on keyword hash for consistency
      const promptIndex = this.hashString(keyword) % humanPrompts.length
      const selectedPrompt = humanPrompts[promptIndex]
      
      // Use multiple image generation services for variety
      const services = [
        () => this.generatePollinationsImage(selectedPrompt, keyword),
        () => this.generateUnsplashImage(keyword),
        () => this.getRandomDummyImage()
      ]
      
      const serviceIndex = this.hashString(keyword) % services.length
      const imageUrl = await services[serviceIndex]()
      
      console.log(`✅ Generated image for "${keyword}": ${imageUrl}`)
      return imageUrl
      
    } catch (error) {
      console.error('❌ Error generating image:', error)
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
    // Use Unsplash API for more natural images
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
    // Extract first paragraph and clean HTML
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
    
    console.log(`📝 Generating enhanced blog for keyword ${id}: ${keyword}`)
    
    try {
      // Use enhanced content generator
      const EnhancedContentGenerator = (await import('../utils/enhanced-content-generator.js')).default
      const generator = new EnhancedContentGenerator()
      
      // Generate enhanced title
      const title = generator.generateTitle(keyword)
      console.log(`✅ Generated enhanced title: ${title}`)
      
      // Generate enhanced content
      const content = generator.generateContent(keyword)
      console.log(`✅ Generated enhanced content (${content.length} chars)`)
      
      // Generate enhanced meta description
      const metaDescription = generator.generateMetaDescription(keyword)
      console.log(`✅ Generated meta description: ${metaDescription}`)
      
      // Generate enhanced tags
      const tags = generator.generateTags(keyword)
      console.log(`✅ Generated tags: ${tags.join(', ')}`)
      
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
        author: pickAuthorForSlug(this.slugify(keyword)),
        date: new Date().toISOString(),
        image: imageUrl,
        imageUrl,
        featured_image: imageUrl,
        meta_description: metaDescription,
        tags: tags,
        categories: ['Blog', 'Panduan'],
        aiImageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
        updateReason: 'Auto-generated with ChatGPT',
        keywordId: id,
        originalKeyword: keyword
      }
      
      // Save blog
      await this.saveBlog(blog)
      
      console.log(`✅ Blog saved: ${blog.slug}`)
      return blog
      
    } catch (error) {
      console.error(`❌ Error generating blog for ${keyword}:`, error)
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
      console.error('❌ Error saving blog:', error)
    }
  }

  async updateGeneratedBlogs(newBlog: BlogData) {
    try {
      // Ensure database/content directory exists (preferred path)
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
      
      // Add new blog to generated blogs
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
      
      // Remove existing blog with same slug if exists
      generatedBlogs = generatedBlogs.filter(b => b.slug !== newBlog.slug)
      
      // Add new blog to the beginning
      generatedBlogs.unshift(generatedBlog)
      
      // Keep only latest 100 blogs
      generatedBlogs = generatedBlogs.slice(0, 100)
      
      await fs.writeFile(generatedFile, JSON.stringify(generatedBlogs, null, 2))
      console.log('✅ Updated generated blogs')
      
    } catch (error) {
      console.error('❌ Error updating generated blogs:', error)
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
      
      // Add new blog to the beginning
      latestPosts.unshift({
        slug: newBlog.slug,
        title: newBlog.title,
        date: newBlog.date,
        image: newBlog.image
      })
      
      // Keep only latest 50 posts
      latestPosts = latestPosts.slice(0, 50)
      
      await fs.writeFile(latestFile, JSON.stringify(latestPosts, null, 2))
      console.log('✅ Updated latest posts')
      
    } catch (error) {
      console.error('❌ Error updating latest posts:', error)
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
      
      // Add new blog to popular posts
      popularPosts[newBlog.slug] = {
        title: newBlog.title,
        count: 1,
        last: Date.now(),
        date: newBlog.date
      }
      
      await fs.writeFile(popularFile, JSON.stringify(popularPosts, null, 2))
      console.log('✅ Updated popular posts')
      
    } catch (error) {
      console.error('❌ Error updating popular posts:', error)
    }
  }

  async runDailyGeneration() {
    if (this.isRunning) {
      console.log('⏳ Daily generation already running, skipping...')
      return
    }

    this.isRunning = true
    console.log('🌅 Starting daily blog generation at 03:00...')
    
    if (this.keywords.length === 0) {
      console.log('❌ No keywords available')
      this.isRunning = false
      return
    }
    
    // Ensure we always generate a fixed number of blogs per day (configurable via env)
    const dailyCount = Math.min(
      Math.max(parseInt(process.env.MAX_DAILY_POSTS || String(this.rotation.dailyCount) || '20', 10) || 20, 1),
      50
    )
    const startIndex = this.rotation.index
    let endIndex = startIndex + dailyCount
    
    console.log(`📊 Generating ${dailyCount} blogs starting from keyword ${startIndex + 1} to ${endIndex} of ${this.keywords.length}`)
    
    const generatedBlogs: BlogData[] = []
    
    // Generate exactly 10 blogs with proper rotation
    for (let i = 0; i < dailyCount; i++) {
      const currentIndex = (startIndex + i) % this.keywords.length
      const keywordData = this.keywords[currentIndex]
      
      console.log(`📝 Processing keyword ${currentIndex + 1}/${this.keywords.length}: ${keywordData.keyword}`)
      
      const blog = await this.generateBlog(keywordData)
      
      if (blog) {
        generatedBlogs.push(blog)
        console.log(`✅ Blog ${generatedBlogs.length}/${dailyCount} generated successfully`)
      }
      
      // Rate limiting - wait between generations to avoid API limits
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    
    // Update rotation - move to next 10 keywords for tomorrow
    this.rotation.index = (startIndex + dailyCount) % this.keywords.length
    this.rotation.currentDay++
    this.rotation.dailyCount = dailyCount
    
    // Log rotation status
    if (this.rotation.index === 0) {
      console.log('🔄 Reset keyword rotation - starting from keyword 1 again (cycle complete)')
    }
    
    await this.saveRotation()
    
    console.log(`✅ Daily generation complete: ${generatedBlogs.length} blogs generated`)
    console.log(`📍 Next generation will start from keyword ${this.rotation.index + 1}`)
    console.log(`🔄 Rotation status: ${this.rotation.index}/${this.keywords.length} (${((this.rotation.index / this.keywords.length) * 100).toFixed(1)}%)`)
    
    // Schedule Nuxt Pro rebuild after 1 hour (Disabled - file removed)
    if (generatedBlogs.length > 0) {
      console.log('🔄 Blog generation completed successfully')
      // Rebuild manager functionality disabled after cleanup
    }
    
    this.isRunning = false
    
    return generatedBlogs
  }

  async checkSchedule() {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    
    // Run at 3 AM (03:00) - exact time as requested
    if (currentHour === 3 && currentMinute === 0) {
      console.log('⏰ Scheduled time reached (03:00) - starting generation')
      await this.runDailyGeneration()
    }
  }
}

// Global scheduler instance
let scheduler: AutoBlogScheduler

export default defineNitroPlugin(async () => {
  // Only run in production or when explicitly enabled
  const isDev = process.env.NODE_ENV === 'development'
  const enabled = process.env.NUXT_ENABLE_AUTO_BLOG === 'true'
  
  if (isDev && !enabled) {
    console.log('[auto-blog-scheduler] Dev mode detected — scheduler disabled (set NUXT_ENABLE_AUTO_BLOG=true to override)')
    return
  }

  if (!enabled) {
    console.log('[auto-blog-scheduler] Scheduler disabled (default). Set NUXT_ENABLE_AUTO_BLOG=true to enable.')
    return
  }

  // Initialize scheduler
  scheduler = new AutoBlogScheduler()
  await scheduler.init()

  // Check schedule every minute
  setInterval(() => {
    scheduler.checkSchedule()
  }, 60000)

  console.log('[auto-blog-scheduler] Auto blog scheduler active - will run daily at 03:00')
})
