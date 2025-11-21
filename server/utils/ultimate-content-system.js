// Ultimate Content System - Integration of All Advanced Features
import SEOOptimizer from './seo-optimizer.js'
import CompetitorAnalyzer from './competitor-analyzer.js'
import ContentPersonalizer from './content-personalizer.js'
import SocialMediaOptimizer from './social-media-optimizer.js'
import AdvancedContentAnalyzer from './advanced-content-analyzer.js'

class UltimateContentSystem {
  constructor() {
    this.seoOptimizer = new SEOOptimizer()
    this.competitorAnalyzer = new CompetitorAnalyzer()
    this.contentPersonalizer = new ContentPersonalizer()
    this.socialMediaOptimizer = new SocialMediaOptimizer()
    this.contentAnalyzer = new AdvancedContentAnalyzer()
    
    this.systemConfig = {
      enableSEOOptimization: true,
      enableCompetitorAnalysis: true,
      enableContentPersonalization: true,
      enableSocialMediaOptimization: true,
      enableAdvancedAnalysis: true,
      qualityThreshold: 80,
      maxRetries: 3
    }
    
    this.performanceMetrics = {
      totalProcessed: 0,
      totalSuccessful: 0,
      totalFailed: 0,
      averageQuality: 0,
      averageProcessingTime: 0
    }
  }

  async init() {
    console.log('🚀 Initializing Ultimate Content System...')
    
    try {
      await Promise.all([
        this.competitorAnalyzer.init()
      ])
      
      console.log('✅ Ultimate Content System initialized successfully')
      
    } catch (error) {
      console.error('❌ Failed to initialize Ultimate Content System:', error)
      throw error
    }
  }

  // Main content processing method
  async processContent(blogContent, userProfile = null, options = {}) {
    const startTime = Date.now()
    console.log(`🎯 Processing content: ${blogContent.title}`)
    
    try {
      let processedContent = { ...blogContent }
      
      // 1. SEO Optimization
      if (this.systemConfig.enableSEOOptimization) {
        console.log('📊 Running SEO optimization...')
        const seoAnalysis = this.seoOptimizer.analyzeSEO(processedContent)
        processedContent.seoAnalysis = seoAnalysis
        
        if (seoAnalysis.overall.score < this.systemConfig.qualityThreshold) {
          processedContent = await this.optimizeSEO(processedContent, seoAnalysis)
        }
      }
      
      // 2. Competitor Analysis
      if (this.systemConfig.enableCompetitorAnalysis) {
        console.log('🔍 Running competitor analysis...')
        const competitorAnalysis = await this.competitorAnalyzer.analyzeCompetitorContent(
          processedContent.originalKeyword || 'keyword'
        )
        processedContent.competitorAnalysis = competitorAnalysis
        
        // Apply competitor insights
        processedContent = await this.applyCompetitorInsights(processedContent, competitorAnalysis)
      }
      
      // 3. Content Personalization
      if (this.systemConfig.enableContentPersonalization && userProfile) {
        console.log('👤 Running content personalization...')
        processedContent = this.contentPersonalizer.personalizeContent(
          processedContent,
          userProfile,
          processedContent.originalKeyword || 'keyword'
        )
      }
      
      // 4. Social Media Optimization
      if (this.systemConfig.enableSocialMediaOptimization) {
        console.log('📱 Running social media optimization...')
        const socialMediaContent = this.socialMediaOptimizer.optimizeForSocialMedia(
          processedContent,
          ['facebook', 'instagram', 'twitter', 'linkedin']
        )
        processedContent.socialMediaContent = socialMediaContent
      }
      
      // 5. Advanced Content Analysis
      if (this.systemConfig.enableAdvancedAnalysis) {
        console.log('🔬 Running advanced content analysis...')
        const advancedAnalysis = this.contentAnalyzer.analyzeContent(processedContent)
        processedContent.advancedAnalysis = advancedAnalysis
        
        // Apply analysis recommendations
        processedContent = await this.applyAnalysisRecommendations(processedContent, advancedAnalysis)
      }
      
      // 6. Final Quality Check
      const finalQuality = this.calculateFinalQuality(processedContent)
      processedContent.finalQuality = finalQuality
      
      // 7. Generate Comprehensive Report
      const comprehensiveReport = this.generateComprehensiveReport(processedContent)
      processedContent.comprehensiveReport = comprehensiveReport
      
      // Update performance metrics
      const processingTime = Date.now() - startTime
      this.updatePerformanceMetrics(processedContent, true, processingTime)
      
      console.log(`✅ Content processed successfully (Quality: ${finalQuality.score}/100, Time: ${processingTime}ms)`)
      
      return processedContent
      
    } catch (error) {
      console.error(`❌ Failed to process content: ${error.message}`)
      this.updatePerformanceMetrics(null, false, Date.now() - startTime)
      throw error
    }
  }

  // SEO Optimization
  async optimizeSEO(content, seoAnalysis) {
    const optimizations = this.seoOptimizer.generateSEOOptimizations(seoAnalysis)
    
    for (const optimization of optimizations) {
      if (optimization.priority === 'high') {
        switch (optimization.type) {
          case 'title':
            content.title = this.optimizeTitle(content.title, content.originalKeyword)
            break
          case 'meta_description':
            content.meta_description = this.optimizeMetaDescription(content.meta_description, content.originalKeyword)
            break
          case 'content':
            content.content = this.optimizeContentStructure(content.content, content.originalKeyword)
            break
        }
      }
    }
    
    return content
  }

  optimizeTitle(title, keyword) {
    // Ensure keyword is at the beginning
    if (!title.toLowerCase().startsWith(keyword.toLowerCase())) {
      title = `${keyword} - ${title}`
    }
    
    // Ensure optimal length
    if (title.length > 60) {
      title = title.substring(0, 57) + '...'
    }
    
    return title
  }

  optimizeMetaDescription(metaDescription, keyword) {
    if (!metaDescription) {
      metaDescription = `Panduan lengkap tentang ${keyword}. Pelajari cara mudah dan aman menggunakan ${keyword} untuk kebutuhan Anda. Konsultasi gratis!`
    }
    
    // Ensure keyword is included
    if (!metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      metaDescription = `${keyword} - ${metaDescription}`
    }
    
    // Ensure optimal length
    if (metaDescription.length > 160) {
      metaDescription = metaDescription.substring(0, 157) + '...'
    }
    
    return metaDescription
  }

  optimizeContentStructure(content, keyword) {
    // Add table of contents if missing
    if (!content.includes('table-of-contents')) {
      const headings = content.match(/<h[2-3][^>]*>(.*?)<\/h[2-3]>/g)
      if (headings && headings.length >= 3) {
        const toc = this.generateTableOfContents(headings)
        content = content.replace('<h1>', `<h1>${content.match(/<h1>(.*?)<\/h1>/)?.[1] || 'Title'}</h1>\n\n<div class="table-of-contents">\n<h3>Daftar Isi</h3>\n${toc}\n</div>\n\n<h2>`)
      }
    }
    
    // Add FAQ section if missing
    if (!content.toLowerCase().includes('faq') && !content.toLowerCase().includes('pertanyaan')) {
      const faqSection = this.generateFAQSection(keyword)
      content += faqSection
    }
    
    // Add CTA section if missing
    if (!content.includes('cta-section')) {
      const ctaSection = this.generateCTASection(keyword)
      content += ctaSection
    }
    
    return content
  }

  generateTableOfContents(headings) {
    const tocItems = headings.map(heading => {
      const text = heading.replace(/<[^>]*>/g, '').trim()
      const id = text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')
      return `<li><a href="#${id}">${text}</a></li>`
    }).join('\n')
    
    return `<ul>\n${tocItems}\n</ul>`
  }

  generateFAQSection(keyword) {
    return `
<div class="faq-section">
<h3>FAQ - Pertanyaan yang Sering Diajukan</h3>
<div class="faq-item">
<h4>Apa itu ${keyword}?</h4>
<p>${keyword} adalah layanan yang sangat dibutuhkan di era digital saat ini. Dengan perkembangan teknologi yang pesat, kebutuhan akan layanan pembayaran yang aman, cepat, dan terpercaya semakin meningkat.</p>
</div>
<div class="faq-item">
<h4>Apakah layanan ${keyword} aman?</h4>
<p>Ya, semua layanan kami 100% legal dan aman. Kami memiliki izin resmi dan menggunakan sistem keamanan berlapis untuk melindungi data klien.</p>
</div>
<div class="faq-item">
<h4>Berapa lama proses ${keyword}?</h4>
<p>Proses ${keyword} biasanya selesai dalam hitungan menit hingga beberapa jam, tergantung pada jenis layanan dan verifikasi yang diperlukan.</p>
</div>
</div>`
  }

  generateCTASection(keyword) {
    return `
<div class="cta-section">
<div class="cta-card">
<h3>Siap Memulai Perjalanan Anda?</h3>
<p>Jangan lewatkan kesempatan untuk merasakan manfaat ${keyword} sekarang juga. Dapatkan pengalaman terbaik dengan layanan profesional kami dan bergabunglah dengan ribuan pengguna yang sudah merasakan manfaatnya.</p>
<div class="cta-buttons">
<a href="/contact" class="cta-button primary">Hubungi Kami Sekarang</a>
<a href="/pricing" class="cta-button secondary">Lihat Paket & Harga</a>
</div>
<div class="cta-guarantee">
<p>✓ Garansi 30 hari uang kembali</p>
<p>✓ Support 24/7</p>
<p>✓ Setup gratis</p>
</div>
</div>
</div>`
  }

  // Apply Competitor Insights
  async applyCompetitorInsights(content, competitorAnalysis) {
    const insights = competitorAnalysis.insights
    const recommendations = competitorAnalysis.recommendations
    
    // Apply content gap recommendations
    for (const recommendation of recommendations) {
      if (recommendation.type === 'content' && recommendation.priority === 'high') {
        content = this.fillContentGaps(content, insights.contentGaps, content.originalKeyword)
      }
    }
    
    // Apply opportunity recommendations
    for (const recommendation of recommendations) {
      if (recommendation.type === 'opportunities' && recommendation.priority === 'medium') {
        content = this.leverageOpportunities(content, insights.opportunities, content.originalKeyword)
      }
    }
    
    return content
  }

  fillContentGaps(content, gaps, keyword) {
    for (const gap of gaps) {
      switch (gap) {
        case 'Tutorial/How-to content':
          if (!content.toLowerCase().includes('cara') && !content.toLowerCase().includes('tutorial')) {
            content += this.generateTutorialSection(keyword)
          }
          break
        case 'Comparison content':
          if (!content.toLowerCase().includes('vs') && !content.toLowerCase().includes('banding')) {
            content += this.generateComparisonSection(keyword)
          }
          break
        case 'FAQ content':
          if (!content.toLowerCase().includes('faq') && !content.toLowerCase().includes('pertanyaan')) {
            content += this.generateFAQSection(keyword)
          }
          break
      }
    }
    
    return content
  }

  generateTutorialSection(keyword) {
    return `
<div class="tutorial-section">
<h3>Cara Menggunakan ${keyword}</h3>
<div class="tutorial-steps">
<div class="step">
<h4>Langkah 1: Persiapan</h4>
<p>Persiapkan semua dokumen dan informasi yang diperlukan untuk proses ${keyword}.</p>
</div>
<div class="step">
<h4>Langkah 2: Registrasi</h4>
<p>Daftarkan akun Anda dan lengkapi proses verifikasi yang diperlukan.</p>
</div>
<div class="step">
<h4>Langkah 3: Konfigurasi</h4>
<p>Atur pengaturan sesuai dengan kebutuhan dan preferensi Anda.</p>
</div>
<div class="step">
<h4>Langkah 4: Aktivasi</h4>
<p>Aktifkan layanan dan mulai menggunakan ${keyword} untuk kebutuhan Anda.</p>
</div>
</div>
</div>`
  }

  generateComparisonSection(keyword) {
    return `
<div class="comparison-section">
<h3>Perbandingan ${keyword} dengan Alternatif</h3>
<div class="comparison-table">
<table>
<thead>
<tr>
<th>Fitur</th>
<th>${keyword}</th>
<th>Alternatif 1</th>
<th>Alternatif 2</th>
</tr>
</thead>
<tbody>
<tr>
<td>Keamanan</td>
<td>✓ Tinggi</td>
<td>✓ Sedang</td>
<td>✓ Tinggi</td>
</tr>
<tr>
<td>Kecepatan</td>
<td>✓ Cepat</td>
<td>✓ Lambat</td>
<td>✓ Sedang</td>
</tr>
<tr>
<td>Biaya</td>
<td>✓ Terjangkau</td>
<td>✓ Mahal</td>
<td>✓ Sedang</td>
</tr>
</tbody>
</table>
</div>
</div>`
  }

  leverageOpportunities(content, opportunities, keyword) {
    for (const opportunity of opportunities) {
      if (opportunity.includes('longer, more comprehensive content')) {
        content = this.addComprehensiveContent(content, keyword)
      } else if (opportunity.includes('keyword density')) {
        content = this.optimizeKeywordDensity(content, keyword)
      }
    }
    
    return content
  }

  addComprehensiveContent(content, keyword) {
    const comprehensiveSection = `
<div class="comprehensive-section">
<h3>Panduan Komprehensif ${keyword}</h3>
<p>Untuk memberikan pemahaman yang lebih mendalam tentang ${keyword}, berikut adalah panduan komprehensif yang mencakup semua aspek penting:</p>

<h4>Aspek Teknis</h4>
<p>Dari segi teknis, ${keyword} menggunakan teknologi terdepan untuk memastikan keamanan dan kecepatan proses. Sistem enkripsi yang digunakan memenuhi standar internasional dan telah teruji keamanannya.</p>

<h4>Aspek Keamanan</h4>
<p>Keamanan adalah prioritas utama dalam layanan ${keyword}. Kami menggunakan multiple layer security yang meliputi enkripsi data, verifikasi multi-faktor, dan monitoring 24/7 untuk memastikan keamanan transaksi Anda.</p>

<h4>Aspek Legal</h4>
<p>Semua layanan ${keyword} telah memenuhi persyaratan legal dan regulasi yang berlaku. Kami memiliki izin resmi dari otoritas yang berwenang dan mengikuti standar internasional dalam operasional.</p>

<h4>Aspek Customer Service</h4>
<p>Tim customer service kami siap membantu Anda 24/7 dengan berbagai channel komunikasi. Dari chat online, email, hingga telepon, kami memastikan Anda mendapatkan bantuan yang dibutuhkan kapan saja.</p>
</div>`
    
    return content + comprehensiveSection
  }

  optimizeKeywordDensity(content, keyword) {
    const text = content.replace(/<[^>]*>/g, '')
    const words = text.split(/\s+/)
    const keywordCount = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
    const currentDensity = (keywordCount / words.length) * 100
    
    // Target density: 1-2%
    if (currentDensity < 1) {
      // Add keyword in strategic places
      content = content.replace(
        /<h2>(.*?)<\/h2>/g,
        (match, heading) => {
          if (!heading.toLowerCase().includes(keyword.toLowerCase())) {
            return `<h2>${keyword} - ${heading}</h2>`
          }
          return match
        }
      )
    }
    
    return content
  }

  // Apply Analysis Recommendations
  async applyAnalysisRecommendations(content, analysis) {
    const recommendations = analysis.overall.recommendations
    
    for (const recommendation of recommendations) {
      if (recommendation.priority === 'high') {
        switch (recommendation.category) {
          case 'readability':
            content.content = this.improveReadability(content.content)
            break
          case 'engagement':
            content.content = this.improveEngagement(content.content)
            break
          case 'seo':
            content = this.improveSEO(content)
            break
        }
      }
    }
    
    return content
  }

  improveReadability(content) {
    // Break long sentences
    content = content.replace(
      /<p>([^<]{100,})<\/p>/g,
      (match, text) => {
        const sentences = text.split(/[.!?]+/)
        if (sentences.length > 1) {
          const newParagraphs = sentences.map(sentence => 
            sentence.trim() ? `<p>${sentence.trim()}.</p>` : ''
          ).filter(p => p).join('\n')
          return newParagraphs
        }
        return match
      }
    )
    
    return content
  }

  improveEngagement(content) {
    // Add more images if needed
    const imageCount = (content.match(/<img[^>]*>/g) || []).length
    if (imageCount < 3) {
      const imageSection = `
<div class="content-image">
<img src="/images/dummy/dummy-${Math.floor(Math.random() * 100) + 1}.jpg" alt="Content illustration" class="section-img" loading="lazy">
<p class="image-caption">Ilustrasi untuk membantu pemahaman</p>
</div>`
      
      content = content.replace('<h2>', `${imageSection}\n<h2>`)
    }
    
    return content
  }

  improveSEO(content) {
    // Ensure proper heading structure
    if (!content.includes('<h1>')) {
      content = `<h1>${content.match(/<h2>(.*?)<\/h2>/)?.[1] || 'Title'}</h1>\n\n${content}`
    }
    
    return content
  }

  // Calculate Final Quality
  calculateFinalQuality(content) {
    const scores = []
    
    if (content.seoAnalysis) {
      scores.push(content.seoAnalysis.overall.score)
    }
    
    if (content.advancedAnalysis) {
      scores.push(content.advancedAnalysis.overall.score)
    }
    
    if (content.competitorAnalysis) {
      // Calculate competitor-based score
      const competitorScore = this.calculateCompetitorScore(content.competitorAnalysis)
      scores.push(competitorScore)
    }
    
    const finalScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0
    
    return {
      score: Math.round(finalScore),
      grade: this.getGrade(finalScore),
      breakdown: {
        seo: content.seoAnalysis?.overall.score || 0,
        advanced: content.advancedAnalysis?.overall.score || 0,
        competitor: content.competitorAnalysis ? this.calculateCompetitorScore(content.competitorAnalysis) : 0
      }
    }
  }

  calculateCompetitorScore(competitorAnalysis) {
    let score = 50
    
    // Score based on content gaps filled
    score += competitorAnalysis.insights.contentGaps.length * 10
    
    // Score based on opportunities leveraged
    score += competitorAnalysis.insights.opportunities.length * 5
    
    // Score based on recommendations followed
    score += competitorAnalysis.recommendations.filter(r => r.priority === 'high').length * 15
    
    return Math.min(100, score)
  }

  getGrade(score) {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  // Generate Comprehensive Report
  generateComprehensiveReport(content) {
    const report = {
      summary: {
        title: content.title,
        keyword: content.originalKeyword,
        finalQuality: content.finalQuality,
        processingTimestamp: new Date().toISOString()
      },
      analysis: {
        seo: content.seoAnalysis || null,
        competitor: content.competitorAnalysis || null,
        advanced: content.advancedAnalysis || null,
        socialMedia: content.socialMediaContent || null
      },
      optimizations: {
        applied: this.getAppliedOptimizations(content),
        recommendations: this.getOptimizationRecommendations(content)
      },
      performance: {
        expectedTraffic: this.calculateExpectedTraffic(content),
        expectedEngagement: this.calculateExpectedEngagement(content),
        expectedConversion: this.calculateExpectedConversion(content)
      }
    }
    
    return report
  }

  getAppliedOptimizations(content) {
    const optimizations = []
    
    if (content.seoAnalysis && content.seoAnalysis.overall.score > 80) {
      optimizations.push('SEO optimization applied')
    }
    
    if (content.competitorAnalysis && content.competitorAnalysis.insights.contentGaps.length > 0) {
      optimizations.push('Competitor insights applied')
    }
    
    if (content.advancedAnalysis && content.advancedAnalysis.overall.score > 80) {
      optimizations.push('Advanced analysis optimizations applied')
    }
    
    if (content.socialMediaContent) {
      optimizations.push('Social media optimization applied')
    }
    
    return optimizations
  }

  getOptimizationRecommendations(content) {
    const recommendations = []
    
    if (content.seoAnalysis) {
      recommendations.push(...content.seoAnalysis.overall.suggestions)
    }
    
    if (content.advancedAnalysis) {
      recommendations.push(...content.advancedAnalysis.overall.recommendations)
    }
    
    if (content.competitorAnalysis) {
      recommendations.push(...content.competitorAnalysis.recommendations.map(r => r.suggestion))
    }
    
    return recommendations
  }

  calculateExpectedTraffic(content) {
    let traffic = 1000 // Base traffic
    
    if (content.seoAnalysis && content.seoAnalysis.overall.score > 80) {
      traffic *= 1.5
    }
    
    if (content.competitorAnalysis && content.competitorAnalysis.insights.contentGaps.length > 0) {
      traffic *= 1.3
    }
    
    if (content.socialMediaContent) {
      traffic *= 1.2
    }
    
    return Math.round(traffic)
  }

  calculateExpectedEngagement(content) {
    let engagement = 0.05 // Base engagement rate
    
    if (content.advancedAnalysis && content.advancedAnalysis.engagement.score > 80) {
      engagement *= 1.5
    }
    
    if (content.socialMediaContent) {
      engagement *= 1.3
    }
    
    return Math.round(engagement * 100) / 100
  }

  calculateExpectedConversion(content) {
    let conversion = 0.02 // Base conversion rate
    
    if (content.advancedAnalysis && content.advancedAnalysis.overall.score > 80) {
      conversion *= 1.4
    }
    
    if (content.seoAnalysis && content.seoAnalysis.overall.score > 80) {
      conversion *= 1.2
    }
    
    return Math.round(conversion * 100) / 100
  }

  // Update Performance Metrics
  updatePerformanceMetrics(content, success, processingTime) {
    this.performanceMetrics.totalProcessed++
    
    if (success && content) {
      this.performanceMetrics.totalSuccessful++
      this.performanceMetrics.averageQuality = (
        this.performanceMetrics.averageQuality * (this.performanceMetrics.totalSuccessful - 1) + 
        content.finalQuality.score
      ) / this.performanceMetrics.totalSuccessful
      
      this.performanceMetrics.averageProcessingTime = (
        this.performanceMetrics.averageProcessingTime * (this.performanceMetrics.totalSuccessful - 1) + 
        processingTime
      ) / this.performanceMetrics.totalSuccessful
    } else {
      this.performanceMetrics.totalFailed++
    }
  }

  // Get System Performance
  getSystemPerformance() {
    return {
      metrics: this.performanceMetrics,
      successRate: this.performanceMetrics.totalProcessed > 0 ? 
        this.performanceMetrics.totalSuccessful / this.performanceMetrics.totalProcessed : 0,
      averageQuality: this.performanceMetrics.averageQuality,
      averageProcessingTime: this.performanceMetrics.averageProcessingTime,
      systemStatus: this.performanceMetrics.totalProcessed > 0 && 
        this.performanceMetrics.totalSuccessful / this.performanceMetrics.totalProcessed > 0.8 ? 
        'healthy' : 'needs_attention'
    }
  }

  // Health Check
  async healthCheck() {
    const performance = this.getSystemPerformance()
    
    return {
      status: performance.systemStatus,
      performance,
      timestamp: new Date().toISOString()
    }
  }
}

export default UltimateContentSystem
