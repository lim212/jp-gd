// Content Personalization System
class ContentPersonalizer {
  constructor() {
    this.userProfiles = {
      beginner: {
        characteristics: ['new to topic', 'needs basic explanation', 'prefers simple language'],
        contentPreferences: {
          tone: 'friendly and encouraging',
          complexity: 'simple',
          examples: 'basic and relatable',
          length: 'shorter (800-1200 words)',
          structure: 'step-by-step'
        },
        keywords: ['cara mudah', 'untuk pemula', 'panduan dasar', 'tips sederhana']
      },
      intermediate: {
        characteristics: ['some experience', 'wants to improve', 'seeks practical tips'],
        contentPreferences: {
          tone: 'professional but accessible',
          complexity: 'moderate',
          examples: 'practical and detailed',
          length: 'medium (1200-1500 words)',
          structure: 'comprehensive guide'
        },
        keywords: ['tips advanced', 'cara efektif', 'optimasi', 'strategi']
      },
      expert: {
        characteristics: ['experienced user', 'wants advanced techniques', 'seeks optimization'],
        contentPreferences: {
          tone: 'technical and authoritative',
          complexity: 'advanced',
          examples: 'complex and technical',
          length: 'longer (1500-2000 words)',
          structure: 'detailed analysis'
        },
        keywords: ['advanced', 'expert', 'optimasi lanjutan', 'teknik profesional']
      }
    }
    
    this.contentTemplates = {
      beginner: {
        introduction: `Selamat datang di panduan lengkap tentang {keyword}! Jika Anda baru mengenal {keyword}, artikel ini akan membantu Anda memahami dasar-dasarnya dengan cara yang mudah dipahami.`,
        mainContent: `Mari kita mulai dengan memahami apa itu {keyword} dan mengapa hal ini penting untuk Anda.`,
        conclusion: `Dengan panduan ini, Anda sekarang memiliki pemahaman dasar tentang {keyword}. Jangan ragu untuk mencoba dan praktikkan tips yang telah kami berikan.`
      },
      intermediate: {
        introduction: `Dalam artikel ini, kami akan membahas {keyword} secara mendalam untuk membantu Anda meningkatkan pemahaman dan keterampilan Anda.`,
        mainContent: `Untuk mengoptimalkan penggunaan {keyword}, ada beberapa strategi yang bisa Anda terapkan.`,
        conclusion: `Dengan menerapkan tips dan strategi di atas, Anda dapat memaksimalkan manfaat dari {keyword} untuk kebutuhan Anda.`
      },
      expert: {
        introduction: `Sebagai seorang expert, Anda tentu sudah familiar dengan {keyword}. Artikel ini akan memberikan insight mendalam dan teknik advanced yang mungkin belum Anda ketahui.`,
        mainContent: `Untuk mencapai level optimasi tertinggi dalam {keyword}, diperlukan pemahaman mendalam tentang berbagai aspek teknis.`,
        conclusion: `Teknik-teknik advanced yang telah dibahas di atas akan membantu Anda mencapai performa optimal dalam {keyword}.`
      }
    }
    
    this.personalizationFactors = {
      timeOfDay: {
        morning: { tone: 'energetic', focus: 'productivity' },
        afternoon: { tone: 'professional', focus: 'efficiency' },
        evening: { tone: 'relaxed', focus: 'learning' }
      },
      device: {
        mobile: { format: 'short paragraphs', images: 'optimized for mobile' },
        desktop: { format: 'detailed content', images: 'high resolution' },
        tablet: { format: 'balanced', images: 'medium resolution' }
      },
      location: {
        indonesia: { language: 'bahasa indonesia', examples: 'local context' },
        international: { language: 'english', examples: 'global context' }
      }
    }
  }

  // Analyze user profile based on behavior
  analyzeUserProfile(userBehavior) {
    const profile = {
      level: 'beginner',
      preferences: {},
      characteristics: [],
      confidence: 0
    }
    
    // Analyze based on user behavior
    if (userBehavior.searchHistory) {
      const searchTerms = userBehavior.searchHistory.join(' ').toLowerCase()
      
      if (searchTerms.includes('advanced') || searchTerms.includes('expert')) {
        profile.level = 'expert'
        profile.confidence += 0.3
      } else if (searchTerms.includes('tips') || searchTerms.includes('cara')) {
        profile.level = 'intermediate'
        profile.confidence += 0.2
      } else {
        profile.level = 'beginner'
        profile.confidence += 0.1
      }
    }
    
    // Analyze based on engagement
    if (userBehavior.engagement) {
      if (userBehavior.engagement.averageTimeOnPage > 300) {
        profile.level = profile.level === 'beginner' ? 'intermediate' : profile.level
        profile.confidence += 0.2
      }
      
      if (userBehavior.engagement.scrollDepth > 0.8) {
        profile.level = profile.level === 'intermediate' ? 'expert' : profile.level
        profile.confidence += 0.2
      }
    }
    
    // Analyze based on device and time
    if (userBehavior.device === 'mobile') {
      profile.preferences.format = 'mobile-optimized'
    }
    
    if (userBehavior.timeOfDay) {
      const timeProfile = this.personalizationFactors.timeOfDay[userBehavior.timeOfDay]
      if (timeProfile) {
        profile.preferences.tone = timeProfile.tone
        profile.preferences.focus = timeProfile.focus
      }
    }
    
    return profile
  }

  // Personalize content based on user profile
  personalizeContent(content, userProfile, keyword) {
    const personalizedContent = { ...content }
    
    // Get user level template
    const userLevel = userProfile.level || 'beginner'
    const template = this.contentTemplates[userLevel]
    
    if (!template) {
      console.warn(`No template found for user level: ${userLevel}`)
      return content
    }
    
    // Personalize title
    personalizedContent.title = this.personalizeTitle(content.title, userProfile, keyword)
    
    // Personalize content structure
    personalizedContent.content = this.personalizeContentStructure(content.content, userProfile, keyword, template)
    
    // Personalize meta description
    personalizedContent.meta_description = this.personalizeMetaDescription(content.meta_description, userProfile, keyword)
    
    // Personalize tags
    personalizedContent.tags = this.personalizeTags(content.tags, userProfile, keyword)
    
    // Add personalization metadata
    personalizedContent.personalization = {
      userLevel,
      confidence: userProfile.confidence,
      preferences: userProfile.preferences,
      timestamp: new Date().toISOString()
    }
    
    return personalizedContent
  }

  personalizeTitle(title, userProfile, keyword) {
    const userLevel = userProfile.level || 'beginner'
    const levelKeywords = this.userProfiles[userLevel].keywords
    
    // Check if title already contains level-appropriate keywords
    const hasLevelKeywords = levelKeywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    )
    
    if (hasLevelKeywords) {
      return title
    }
    
    // Add level-appropriate keyword to title
    const appropriateKeyword = levelKeywords[0] // Use first keyword
    const personalizedTitle = `${appropriateKeyword} ${title}`
    
    // Ensure title length is optimal
    if (personalizedTitle.length > 60) {
      return title // Keep original if personalized version is too long
    }
    
    return personalizedTitle
  }

  personalizeContentStructure(content, userProfile, keyword, template) {
    const userLevel = userProfile.level || 'beginner'
    const preferences = this.userProfiles[userLevel].contentPreferences
    
    let personalizedContent = content
    
    // Add personalized introduction
    const personalizedIntro = template.introduction.replace(/{keyword}/g, keyword)
    if (!personalizedContent.includes('intro-section')) {
      personalizedContent = personalizedContent.replace(
        '<h1>',
        `<h1>${personalizedContent.match(/<h1>(.*?)<\/h1>/)?.[1] || 'Title'}</h1>
<div class="intro-section personalized-intro">
<p>${personalizedIntro}</p>
</div>`
      )
    }
    
    // Adjust content complexity based on user level
    if (userLevel === 'beginner') {
      personalizedContent = this.simplifyContent(personalizedContent)
    } else if (userLevel === 'expert') {
      personalizedContent = this.addAdvancedContent(personalizedContent, keyword)
    }
    
    // Add personalized conclusion
    const personalizedConclusion = template.conclusion.replace(/{keyword}/g, keyword)
    if (!personalizedContent.includes('personalized-conclusion')) {
      personalizedContent += `
<div class="personalized-conclusion">
<h3>Kesimpulan untuk ${userLevel === 'beginner' ? 'Pemula' : userLevel === 'intermediate' ? 'Pengguna Menengah' : 'Expert'}</h3>
<p>${personalizedConclusion}</p>
</div>`
    }
    
    // Add level-specific tips
    personalizedContent += this.addLevelSpecificTips(userLevel, keyword)
    
    return personalizedContent
  }

  personalizeMetaDescription(metaDescription, userProfile, keyword) {
    const userLevel = userProfile.level || 'beginner'
    const levelKeywords = this.userProfiles[userLevel].keywords
    
    // Check if meta description already contains level-appropriate keywords
    const hasLevelKeywords = levelKeywords.some(keyword => 
      metaDescription.toLowerCase().includes(keyword.toLowerCase())
    )
    
    if (hasLevelKeywords) {
      return metaDescription
    }
    
    // Add level-appropriate keyword to meta description
    const appropriateKeyword = levelKeywords[0]
    const personalizedMeta = `${appropriateKeyword} ${metaDescription}`
    
    // Ensure meta description length is optimal
    if (personalizedMeta.length > 160) {
      return metaDescription // Keep original if personalized version is too long
    }
    
    return personalizedMeta
  }

  personalizeTags(tags, userProfile, keyword) {
    const userLevel = userProfile.level || 'beginner'
    const levelKeywords = this.userProfiles[userLevel].keywords
    
    // Add level-appropriate tags
    const personalizedTags = [...tags]
    
    // Add level-specific tag
    personalizedTags.push(userLevel === 'beginner' ? 'untuk-pemula' : 
                          userLevel === 'intermediate' ? 'menengah' : 'advanced')
    
    // Add level-appropriate keyword
    const appropriateKeyword = levelKeywords[0]
    if (!personalizedTags.includes(appropriateKeyword)) {
      personalizedTags.push(appropriateKeyword)
    }
    
    return personalizedTags
  }

  simplifyContent(content) {
    // Replace complex words with simpler alternatives
    const simplifications = {
      'optimasi': 'pengaturan',
      'implementasi': 'penerapan',
      'konfigurasi': 'pengaturan',
      'autentikasi': 'verifikasi',
      'enkripsi': 'pengamanan',
      'algoritma': 'cara kerja',
      'infrastruktur': 'sistem',
      'integrasi': 'penyambungan'
    }
    
    let simplifiedContent = content
    if (simplifications && typeof simplifications === 'object') {
      for (const [complex, simple] of Object.entries(simplifications)) {
        simplifiedContent = simplifiedContent.replace(
          new RegExp(complex, 'gi'),
          simple
        )
      }
    }
    
    // Add explanation for technical terms
    simplifiedContent = simplifiedContent.replace(
      /<p>([^<]*\b(?:API|SSL|HTTPS|DNS)\b[^<]*)<\/p>/gi,
      '<p>$1 <span class="tech-explanation">(Istilah teknis yang akan dijelaskan lebih detail di bawah)</span></p>'
    )
    
    return simplifiedContent
  }

  addAdvancedContent(content, keyword) {
    // Add advanced sections for expert users
    const advancedSections = `
<div class="advanced-section">
<h3>Teknik Advanced untuk Expert</h3>
<p>Sebagai expert, Anda mungkin tertarik dengan teknik-teknik advanced berikut:</p>
<ul>
<li><strong>Optimasi Lanjutan:</strong> Teknik untuk memaksimalkan performa ${keyword}</li>
<li><strong>Custom Configuration:</strong> Pengaturan khusus untuk kebutuhan spesifik</li>
<li><strong>Performance Monitoring:</strong> Cara memantau dan mengoptimalkan performa</li>
<li><strong>Troubleshooting Expert:</strong> Solusi untuk masalah kompleks</li>
</ul>
</div>

<div class="expert-tips">
<h3>Tips dari Expert</h3>
<p>Berdasarkan pengalaman expert, berikut adalah tips yang mungkin belum Anda ketahui:</p>
<div class="expert-tip">
<h4>Pro Tip #1</h4>
<p>Gunakan teknik advanced untuk mendapatkan hasil yang lebih optimal.</p>
</div>
<div class="expert-tip">
<h4>Pro Tip #2</h4>
<p>Implementasikan monitoring yang komprehensif untuk performa terbaik.</p>
</div>
</div>`
    
    return content + advancedSections
  }

  addLevelSpecificTips(userLevel, keyword) {
    const tips = {
      beginner: `
<div class="beginner-tips">
<h3>Tips untuk Pemula</h3>
<ul>
<li>Mulailah dengan langkah-langkah dasar</li>
<li>Jangan terburu-buru, pelajari satu per satu</li>
<li>Praktikkan secara bertahap</li>
<li>Jangan ragu bertanya jika ada yang tidak jelas</li>
</ul>
</div>`,
      intermediate: `
<div class="intermediate-tips">
<h3>Tips untuk Pengguna Menengah</h3>
<ul>
<li>Eksperimen dengan berbagai pengaturan</li>
<li>Pelajari fitur-fitur advanced</li>
<li>Optimalkan berdasarkan kebutuhan Anda</li>
<li>Bagikan pengalaman dengan komunitas</li>
</ul>
</div>`,
      expert: `
<div class="expert-tips">
<h3>Tips untuk Expert</h3>
<ul>
<li>Implementasikan teknik-teknik advanced</li>
<li>Kustomisasi sesuai kebutuhan spesifik</li>
<li>Monitor performa secara real-time</li>
<li>Berbagi pengetahuan dengan komunitas expert</li>
</ul>
</div>`
    }
    
    return tips[userLevel] || tips.beginner
  }

  // Generate personalized content recommendations
  generatePersonalizedRecommendations(userProfile, keyword) {
    const recommendations = []
    const userLevel = userProfile.level || 'beginner'
    
    // Content length recommendations
    const preferredLength = this.userProfiles[userLevel].contentPreferences.length
    recommendations.push({
      type: 'content_length',
      suggestion: `Target content length: ${preferredLength}`,
      reason: `Optimal for ${userLevel} users`
    })
    
    // Tone recommendations
    const preferredTone = this.userProfiles[userLevel].contentPreferences.tone
    recommendations.push({
      type: 'tone',
      suggestion: `Use ${preferredTone} tone`,
      reason: `Better engagement for ${userLevel} users`
    })
    
    // Structure recommendations
    const preferredStructure = this.userProfiles[userLevel].contentPreferences.structure
    recommendations.push({
      type: 'structure',
      suggestion: `Use ${preferredStructure} structure`,
      reason: `Better comprehension for ${userLevel} users`
    })
    
    // Keyword recommendations
    const levelKeywords = this.userProfiles[userLevel].keywords
    recommendations.push({
      type: 'keywords',
      suggestion: `Include keywords: ${levelKeywords.join(', ')}`,
      reason: `Better targeting for ${userLevel} users`
    })
    
    return recommendations
  }

  // Get personalization statistics
  getPersonalizationStats() {
    return {
      userLevels: (this.userProfiles && typeof this.userProfiles === 'object') ? Object.keys(this.userProfiles) : [],
      totalTemplates: (this.contentTemplates && typeof this.contentTemplates === 'object') ? Object.keys(this.contentTemplates).length : 0,
      personalizationFactors: (this.personalizationFactors && typeof this.personalizationFactors === 'object') ? Object.keys(this.personalizationFactors) : [],
      supportedLanguages: ['bahasa indonesia', 'english'],
      supportedDevices: ['mobile', 'desktop', 'tablet']
    }
  }
}

export default ContentPersonalizer
