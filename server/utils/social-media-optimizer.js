// Social Media Optimization System
class SocialMediaOptimizer {
  constructor() {
    this.platforms = {
      facebook: {
        name: 'Facebook',
        imageSize: { width: 1200, height: 630 },
        titleLimit: 100,
        descriptionLimit: 200,
        hashtagLimit: 5,
        optimalPostTime: '13:00-15:00',
        engagementRate: 0.05
      },
      instagram: {
        name: 'Instagram',
        imageSize: { width: 1080, height: 1080 },
        titleLimit: 125,
        descriptionLimit: 150,
        hashtagLimit: 30,
        optimalPostTime: '11:00-13:00',
        engagementRate: 0.08
      },
      twitter: {
        name: 'Twitter',
        imageSize: { width: 1200, height: 675 },
        titleLimit: 70,
        descriptionLimit: 280,
        hashtagLimit: 3,
        optimalPostTime: '09:00-10:00',
        engagementRate: 0.03
      },
      linkedin: {
        name: 'LinkedIn',
        imageSize: { width: 1200, height: 627 },
        titleLimit: 80,
        descriptionLimit: 300,
        hashtagLimit: 5,
        optimalPostTime: '08:00-09:00',
        engagementRate: 0.02
      },
      tiktok: {
        name: 'TikTok',
        imageSize: { width: 1080, height: 1920 },
        titleLimit: 100,
        descriptionLimit: 100,
        hashtagLimit: 5,
        optimalPostTime: '18:00-21:00',
        engagementRate: 0.12
      }
    }
    
    this.hashtagCategories = {
      general: ['#jasapembayaran', '#pembayaranonline', '#indonesia', '#digital', '#teknologi'],
      paypal: ['#paypal', '#paypalindonesia', '#topuppaypal', '#verifikasipaypal', '#akunpaypal'],
      bitcoin: ['#bitcoin', '#cryptocurrency', '#crypto', '#blockchain', '#digitalcurrency'],
      tips: ['#tips', '#panduan', '#tutorial', '#cara', '#solusi'],
      business: ['#bisnis', '#usaha', '#entrepreneur', '#startup', '#onlinebusiness']
    }
    
    this.engagementStrategies = {
      questions: [
        'Apa pengalaman Anda dengan {keyword}?',
        'Bagaimana cara Anda menggunakan {keyword}?',
        'Apa tantangan terbesar dalam {keyword}?',
        'Tips apa yang bisa Anda bagikan tentang {keyword}?'
      ],
      callToAction: [
        'Bagikan pengalaman Anda di komentar!',
        'Tag teman yang perlu tahu tentang ini!',
        'Simpan post ini untuk referensi!',
        'Follow untuk tips lebih banyak!'
      ],
      hooks: [
        'Tahukah Anda bahwa...',
        'Fakta menarik tentang {keyword}:',
        'Kesalahan umum yang harus dihindari:',
        'Rahasia yang jarang diketahui:'
      ]
    }
  }

  // Optimize content for social media platforms
  optimizeForSocialMedia(blogContent, platforms = ['facebook', 'instagram', 'twitter']) {
    const optimizedContent = {}
    
    for (const platform of platforms) {
      if (this.platforms[platform]) {
        optimizedContent[platform] = this.optimizeForPlatform(blogContent, platform)
      }
    }
    
    return optimizedContent
  }

  optimizeForPlatform(blogContent, platform) {
    const platformConfig = this.platforms[platform]
    const keyword = blogContent.originalKeyword || 'keyword'
    
    return {
      title: this.optimizeTitle(blogContent.title, platform, keyword),
      description: this.optimizeDescription(blogContent.excerpt || blogContent.meta_description, platform, keyword),
      hashtags: this.generateHashtags(keyword, platform),
      image: this.optimizeImage(blogContent.image, platform),
      postTime: platformConfig.optimalPostTime,
      engagement: this.generateEngagementContent(keyword, platform),
      metrics: {
        expectedReach: this.calculateExpectedReach(platform),
        engagementRate: platformConfig.engagementRate,
        optimalLength: this.getOptimalLength(platform)
      }
    }
  }

  optimizeTitle(title, platform, keyword) {
    const platformConfig = this.platforms[platform]
    let optimizedTitle = title
    
    // Truncate if too long
    if (optimizedTitle.length > platformConfig.titleLimit) {
      optimizedTitle = optimizedTitle.substring(0, platformConfig.titleLimit - 3) + '...'
    }
    
    // Add platform-specific elements
    switch (platform) {
      case 'facebook':
        optimizedTitle = `📱 ${optimizedTitle}`
        break
      case 'instagram':
        optimizedTitle = `✨ ${optimizedTitle}`
        break
      case 'twitter':
        optimizedTitle = `🚀 ${optimizedTitle}`
        break
      case 'linkedin':
        optimizedTitle = `💼 ${optimizedTitle}`
        break
      case 'tiktok':
        optimizedTitle = `🎯 ${optimizedTitle}`
        break
    }
    
    return optimizedTitle
  }

  optimizeDescription(description, platform, keyword) {
    const platformConfig = this.platforms[platform]
    let optimizedDescription = description
    
    // Add engagement hook
    const hook = this.getEngagementHook(keyword, platform)
    optimizedDescription = `${hook}\n\n${optimizedDescription}`
    
    // Add call-to-action
    const cta = this.getCallToAction(platform)
    optimizedDescription += `\n\n${cta}`
    
    // Truncate if too long
    if (optimizedDescription.length > platformConfig.descriptionLimit) {
      optimizedDescription = optimizedDescription.substring(0, platformConfig.descriptionLimit - 3) + '...'
    }
    
    return optimizedDescription
  }

  generateHashtags(keyword, platform) {
    const platformConfig = this.platforms[platform]
    const hashtags = []
    
    // Add keyword-based hashtags
    const keywordHashtag = `#${keyword.replace(/\s+/g, '')}`
    hashtags.push(keywordHashtag)
    
    // Add category-based hashtags
    if (keyword.toLowerCase().includes('paypal')) {
      hashtags.push(...this.hashtagCategories.paypal.slice(0, 3))
    } else if (keyword.toLowerCase().includes('bitcoin')) {
      hashtags.push(...this.hashtagCategories.bitcoin.slice(0, 3))
    } else {
      hashtags.push(...this.hashtagCategories.general.slice(0, 3))
    }
    
    // Add tips hashtags
    hashtags.push(...this.hashtagCategories.tips.slice(0, 2))
    
    // Limit hashtags based on platform
    return hashtags.slice(0, platformConfig.hashtagLimit)
  }

  optimizeImage(imageUrl, platform) {
    const platformConfig = this.platforms[platform]
    
    return {
      url: imageUrl,
      dimensions: platformConfig.imageSize,
      alt: `Social media image for ${platform}`,
      optimization: {
        format: 'JPEG',
        quality: 85,
        compression: 'optimized'
      }
    }
  }

  generateEngagementContent(keyword, platform) {
    const engagement = {
      questions: this.getEngagementQuestions(keyword, platform),
      callToAction: this.getCallToAction(platform),
      hooks: this.getEngagementHooks(keyword, platform)
    }
    
    return engagement
  }

  getEngagementHook(keyword, platform) {
    const hooks = this.engagementStrategies.hooks
    const hook = hooks[Math.floor(Math.random() * hooks.length)]
    return hook.replace('{keyword}', keyword)
  }

  getEngagementQuestions(keyword, platform) {
    const questions = this.engagementStrategies.questions
    return questions.map(q => q.replace('{keyword}', keyword))
  }

  getCallToAction(platform) {
    const ctas = this.engagementStrategies.callToAction
    return ctas[Math.floor(Math.random() * ctas.length)]
  }

  getEngagementHooks(keyword, platform) {
    const hooks = this.engagementStrategies.hooks
    return hooks.map(h => h.replace('{keyword}', keyword))
  }

  calculateExpectedReach(platform) {
    const baseReach = {
      facebook: 1000,
      instagram: 800,
      twitter: 500,
      linkedin: 300,
      tiktok: 1200
    }
    
    return baseReach[platform] || 500
  }

  getOptimalLength(platform) {
    const platformConfig = this.platforms[platform]
    return {
      title: platformConfig.titleLimit,
      description: platformConfig.descriptionLimit,
      hashtags: platformConfig.hashtagLimit
    }
  }

  // Generate social media content calendar
  generateContentCalendar(blogContent, days = 7) {
    const calendar = []
    const platforms = Object.keys(this.platforms)
    
    for (let day = 0; day < days; day++) {
      const date = new Date()
      date.setDate(date.getDate() + day)
      
      const dayContent = {
        date: date.toISOString().split('T')[0],
        posts: []
      }
      
      // Generate posts for each platform
      for (const platform of platforms) {
        const post = this.generateDailyPost(blogContent, platform, day)
        dayContent.posts.push(post)
      }
      
      calendar.push(dayContent)
    }
    
    return calendar
  }

  generateDailyPost(blogContent, platform, dayOffset) {
    const platformConfig = this.platforms[platform]
    const keyword = blogContent.originalKeyword || 'keyword'
    
    // Vary content based on day
    const contentVariations = [
      'tips',
      'tutorial',
      'faq',
      'comparison',
      'case-study',
      'news',
      'infographic'
    ]
    
    const variation = contentVariations[dayOffset % contentVariations.length]
    
    return {
      platform,
      type: variation,
      title: this.generateVariationTitle(blogContent.title, variation, platform),
      description: this.generateVariationDescription(blogContent.excerpt, variation, platform, keyword),
      hashtags: this.generateVariationHashtags(keyword, platform, variation),
      image: this.optimizeImage(blogContent.image, platform),
      scheduledTime: this.getOptimalPostTime(platform),
      engagement: this.generateEngagementContent(keyword, platform)
    }
  }

  generateVariationTitle(originalTitle, variation, platform) {
    const variations = {
      tips: `💡 Tips ${originalTitle}`,
      tutorial: `📚 Tutorial ${originalTitle}`,
      faq: `❓ FAQ ${originalTitle}`,
      comparison: `⚖️ Perbandingan ${originalTitle}`,
      'case-study': `📊 Case Study ${originalTitle}`,
      news: `📰 Update ${originalTitle}`,
      infographic: `📈 Infografis ${originalTitle}`
    }
    
    return variations[variation] || originalTitle
  }

  generateVariationDescription(originalDescription, variation, platform, keyword) {
    const variations = {
      tips: `Kumpulan tips terbaik untuk ${keyword}. Simak dan praktikkan!`,
      tutorial: `Panduan step-by-step untuk ${keyword}. Cocok untuk pemula!`,
      faq: `Pertanyaan yang sering diajukan tentang ${keyword}. Temukan jawabannya!`,
      comparison: `Perbandingan mendalam tentang ${keyword}. Pilih yang terbaik!`,
      'case-study': `Studi kasus nyata tentang ${keyword}. Pelajari dari pengalaman!`,
      news: `Update terbaru tentang ${keyword}. Jangan sampai ketinggalan!`,
      infographic: `Data dan statistik menarik tentang ${keyword}. Visual yang mudah dipahami!`
    }
    
    return variations[variation] || originalDescription
  }

  generateVariationHashtags(keyword, platform, variation) {
    const baseHashtags = this.generateHashtags(keyword, platform)
    const variationHashtags = {
      tips: ['#tips', '#panduan'],
      tutorial: ['#tutorial', '#stepbystep'],
      faq: ['#faq', '#pertanyaan'],
      comparison: ['#perbandingan', '#review'],
      'case-study': ['#casestudy', '#pengalaman'],
      news: ['#berita', '#update'],
      infographic: ['#infografis', '#data']
    }
    
    const additionalHashtags = variationHashtags[variation] || []
    return [...baseHashtags, ...additionalHashtags].slice(0, this.platforms[platform].hashtagLimit)
  }

  getOptimalPostTime(platform) {
    const platformConfig = this.platforms[platform]
    return platformConfig.optimalPostTime
  }

  // Generate social media analytics
  generateSocialMediaAnalytics(blogContent, platforms = ['facebook', 'instagram', 'twitter']) {
    const analytics = {
      blog: {
        title: blogContent.title,
        keyword: blogContent.originalKeyword,
        url: blogContent.slug
      },
      platforms: {},
      summary: {
        totalReach: 0,
        totalEngagement: 0,
        averageEngagementRate: 0
      }
    }
    
    for (const platform of platforms) {
      const platformConfig = this.platforms[platform]
      const expectedReach = this.calculateExpectedReach(platform)
      const expectedEngagement = expectedReach * platformConfig.engagementRate
      
      analytics.platforms[platform] = {
        expectedReach,
        expectedEngagement,
        engagementRate: platformConfig.engagementRate,
        optimalPostTime: platformConfig.optimalPostTime,
        hashtagCount: platformConfig.hashtagLimit,
        imageSize: platformConfig.imageSize
      }
      
      analytics.summary.totalReach += expectedReach
      analytics.summary.totalEngagement += expectedEngagement
    }
    
    analytics.summary.averageEngagementRate = 
      analytics.summary.totalEngagement / analytics.summary.totalReach
    
    return analytics
  }

  // Get social media optimization recommendations
  getOptimizationRecommendations(blogContent, platforms = ['facebook', 'instagram', 'twitter']) {
    const recommendations = []
    
    for (const platform of platforms) {
      const platformConfig = this.platforms[platform]
      const optimized = this.optimizeForPlatform(blogContent, platform)
      
      // Title length recommendations
      if (optimized.title.length > platformConfig.titleLimit) {
        recommendations.push({
          platform,
          type: 'title',
          priority: 'high',
          issue: `Title too long for ${platform} (${optimized.title.length}/${platformConfig.titleLimit})`,
          suggestion: `Shorten title to ${platformConfig.titleLimit} characters or less`
        })
      }
      
      // Description length recommendations
      if (optimized.description.length > platformConfig.descriptionLimit) {
        recommendations.push({
          platform,
          type: 'description',
          priority: 'medium',
          issue: `Description too long for ${platform} (${optimized.description.length}/${platformConfig.descriptionLimit})`,
          suggestion: `Shorten description to ${platformConfig.descriptionLimit} characters or less`
        })
      }
      
      // Hashtag recommendations
      if (optimized.hashtags.length < platformConfig.hashtagLimit) {
        recommendations.push({
          platform,
          type: 'hashtags',
          priority: 'low',
          issue: `Underutilized hashtags for ${platform} (${optimized.hashtags.length}/${platformConfig.hashtagLimit})`,
          suggestion: `Add more relevant hashtags to reach ${platformConfig.hashtagLimit}`
        })
      }
    }
    
    return recommendations
  }
}

export default SocialMediaOptimizer
