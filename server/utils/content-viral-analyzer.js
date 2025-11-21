// Content Viral Analyzer - Menganalisis Potensi Viral Content
class ContentViralAnalyzer {
  constructor() {
    this.viralFactors = {
      emotional: {
        excitement: 0.3,
        surprise: 0.25,
        anger: 0.2,
        joy: 0.15,
        fear: 0.1
      },
      social: {
        shareability: 0.4,
        relatability: 0.3,
        controversy: 0.2,
        timeliness: 0.1
      },
      content: {
        uniqueness: 0.3,
        usefulness: 0.25,
        entertainment: 0.2,
        visual: 0.15,
        length: 0.1
      },
      technical: {
        readability: 0.3,
        mobile: 0.25,
        loading: 0.2,
        accessibility: 0.15,
        seo: 0.1
      }
    }
    
    this.viralPatterns = {
      highViral: {
        titlePatterns: [
          'Shocking Truth About',
          'Secret That Will Change',
          'What Nobody Tells You About',
          'The Hidden Truth Behind',
          'Why Everyone is Wrong About'
        ],
        contentPatterns: [
          'list-based',
          'story-driven',
          'controversial',
          'educational',
          'entertaining'
        ],
        imagePatterns: [
          'infographic',
          'before-after',
          'comparison',
          'emotional',
          'surprising'
        ]
      },
      mediumViral: {
        titlePatterns: [
          'Complete Guide to',
          'Best Tips for',
          'How to Master',
          'Ultimate Tutorial',
          'Expert Advice on'
        ],
        contentPatterns: [
          'tutorial',
          'guide',
          'tips',
          'comparison',
          'review'
        ],
        imagePatterns: [
          'step-by-step',
          'illustration',
          'screenshot',
          'diagram',
          'chart'
        ]
      }
    }
    
    this.viralMetrics = {
      shareability: 0,
      engagement: 0,
      reach: 0,
      virality: 0
    }
  }

  // Analyze viral potential of content
  async analyzeViralPotential(content) {
    const analysis = {
      viralScore: 0,
      viralGrade: 'F',
      factors: {
        emotional: this.analyzeEmotionalFactors(content),
        social: this.analyzeSocialFactors(content),
        content: this.analyzeContentFactors(content),
        technical: this.analyzeTechnicalFactors(content)
      },
      recommendations: [],
      viralElements: [],
      expectedReach: 0,
      expectedShares: 0,
      expectedEngagement: 0
    }
    
    // Calculate overall viral score
    analysis.viralScore = this.calculateViralScore(analysis.factors)
    analysis.viralGrade = this.getViralGrade(analysis.viralScore)
    
    // Generate recommendations
    analysis.recommendations = this.generateViralRecommendations(analysis)
    
    // Identify viral elements
    analysis.viralElements = this.identifyViralElements(content)
    
    // Calculate expected metrics
    analysis.expectedReach = this.calculateExpectedReach(analysis.viralScore)
    analysis.expectedShares = this.calculateExpectedShares(analysis.viralScore)
    analysis.expectedEngagement = this.calculateExpectedEngagement(analysis.viralScore)
    
    return analysis
  }

  // Analyze emotional factors
  analyzeEmotionalFactors(content) {
    const factors = {
      excitement: 0,
      surprise: 0,
      anger: 0,
      joy: 0,
      fear: 0,
      overall: 0
    }
    
    const text = (content.title + ' ' + content.content).toLowerCase()
    
    // Excitement words
    const excitementWords = ['amazing', 'incredible', 'fantastic', 'awesome', 'mind-blowing', 'revolutionary']
    factors.excitement = this.calculateEmotionalScore(text, excitementWords)
    
    // Surprise words
    const surpriseWords = ['shocking', 'surprising', 'unexpected', 'secret', 'hidden', 'revealed']
    factors.surprise = this.calculateEmotionalScore(text, surpriseWords)
    
    // Anger words
    const angerWords = ['wrong', 'mistake', 'problem', 'issue', 'concern', 'warning']
    factors.anger = this.calculateEmotionalScore(text, angerWords)
    
    // Joy words
    const joyWords = ['happy', 'success', 'win', 'victory', 'celebration', 'achievement']
    factors.joy = this.calculateEmotionalScore(text, joyWords)
    
    // Fear words
    const fearWords = ['danger', 'risk', 'threat', 'warning', 'caution', 'beware']
    factors.fear = this.calculateEmotionalScore(text, fearWords)
    
    // Calculate overall emotional score
    factors.overall = (
      factors.excitement * this.viralFactors.emotional.excitement +
      factors.surprise * this.viralFactors.emotional.surprise +
      factors.anger * this.viralFactors.emotional.anger +
      factors.joy * this.viralFactors.emotional.joy +
      factors.fear * this.viralFactors.emotional.fear
    )
    
    return factors
  }

  // Analyze social factors
  analyzeSocialFactors(content) {
    const factors = {
      shareability: 0,
      relatability: 0,
      controversy: 0,
      timeliness: 0,
      overall: 0
    }
    
    const text = (content.title + ' ' + content.content).toLowerCase()
    
    // Shareability (questions, lists, tips)
    const shareabilityIndicators = ['tips', 'tricks', 'secrets', 'guide', 'how to', 'what is', 'why']
    factors.shareability = this.calculateSocialScore(text, shareabilityIndicators)
    
    // Relatability (personal stories, common problems)
    const relatabilityIndicators = ['everyone', 'common', 'typical', 'usual', 'normal', 'average']
    factors.relatability = this.calculateSocialScore(text, relatabilityIndicators)
    
    // Controversy (controversial topics, debates)
    const controversyIndicators = ['controversial', 'debate', 'argument', 'disagree', 'opposing', 'against']
    factors.controversy = this.calculateSocialScore(text, controversyIndicators)
    
    // Timeliness (current events, trends)
    const currentYear = new Date().getFullYear()
    const timelinessIndicators = [currentYear.toString(), 'new', 'latest', 'recent', 'trending', 'now']
    factors.timeliness = this.calculateSocialScore(text, timelinessIndicators)
    
    // Calculate overall social score
    factors.overall = (
      factors.shareability * this.viralFactors.social.shareability +
      factors.relatability * this.viralFactors.social.relatability +
      factors.controversy * this.viralFactors.social.controversy +
      factors.timeliness * this.viralFactors.social.timeliness
    )
    
    return factors
  }

  // Analyze content factors
  analyzeContentFactors(content) {
    const factors = {
      uniqueness: 0,
      usefulness: 0,
      entertainment: 0,
      visual: 0,
      length: 0,
      overall: 0
    }
    
    // Uniqueness (unique angles, fresh perspectives)
    factors.uniqueness = this.analyzeUniqueness(content)
    
    // Usefulness (practical value, actionable content)
    factors.usefulness = this.analyzeUsefulness(content)
    
    // Entertainment (engaging, fun content)
    factors.entertainment = this.analyzeEntertainment(content)
    
    // Visual (images, videos, infographics)
    factors.visual = this.analyzeVisualContent(content)
    
    // Length (optimal content length)
    factors.length = this.analyzeContentLength(content)
    
    // Calculate overall content score
    factors.overall = (
      factors.uniqueness * this.viralFactors.content.uniqueness +
      factors.usefulness * this.viralFactors.content.usefulness +
      factors.entertainment * this.viralFactors.content.entertainment +
      factors.visual * this.viralFactors.content.visual +
      factors.length * this.viralFactors.content.length
    )
    
    return factors
  }

  // Analyze technical factors
  analyzeTechnicalFactors(content) {
    const factors = {
      readability: 0,
      mobile: 0,
      loading: 0,
      accessibility: 0,
      seo: 0,
      overall: 0
    }
    
    // Readability
    factors.readability = this.analyzeReadability(content)
    
    // Mobile optimization
    factors.mobile = this.analyzeMobileOptimization(content)
    
    // Loading speed
    factors.loading = this.analyzeLoadingSpeed(content)
    
    // Accessibility
    factors.accessibility = this.analyzeAccessibility(content)
    
    // SEO
    factors.seo = this.analyzeSEO(content)
    
    // Calculate overall technical score
    factors.overall = (
      factors.readability * this.viralFactors.technical.readability +
      factors.mobile * this.viralFactors.technical.mobile +
      factors.loading * this.viralFactors.technical.loading +
      factors.accessibility * this.viralFactors.technical.accessibility +
      factors.seo * this.viralFactors.technical.seo
    )
    
    return factors
  }

  // Calculate viral score
  calculateViralScore(factors) {
    return Math.round(
      factors.emotional.overall * 0.3 +
      factors.social.overall * 0.3 +
      factors.content.overall * 0.25 +
      factors.technical.overall * 0.15
    )
  }

  // Get viral grade
  getViralGrade(score) {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  // Generate viral recommendations
  generateViralRecommendations(analysis) {
    const recommendations = []
    
    // Emotional recommendations
    if (analysis.factors.emotional.overall < 70) {
      recommendations.push({
        type: 'emotional',
        priority: 'high',
        suggestion: 'Add more emotional triggers like excitement, surprise, or controversy',
        impact: 'High - Emotional content gets 3x more shares'
      })
    }
    
    // Social recommendations
    if (analysis.factors.social.overall < 70) {
      recommendations.push({
        type: 'social',
        priority: 'high',
        suggestion: 'Make content more shareable with questions, lists, and relatable examples',
        impact: 'High - Shareable content reaches 5x more people'
      })
    }
    
    // Content recommendations
    if (analysis.factors.content.overall < 70) {
      recommendations.push({
        type: 'content',
        priority: 'medium',
        suggestion: 'Improve content uniqueness and entertainment value',
        impact: 'Medium - Unique content stands out in feeds'
      })
    }
    
    // Technical recommendations
    if (analysis.factors.technical.overall < 70) {
      recommendations.push({
        type: 'technical',
        priority: 'medium',
        suggestion: 'Optimize for mobile and improve loading speed',
        impact: 'Medium - Technical optimization improves user experience'
      })
    }
    
    return recommendations
  }

  // Identify viral elements
  identifyViralElements(content) {
    const elements = []
    
    // Check title patterns
    const title = content.title.toLowerCase()
    for (const pattern of this.viralPatterns.highViral.titlePatterns) {
      if (title.includes(pattern.toLowerCase())) {
        elements.push({
          type: 'title',
          element: pattern,
          viralPotential: 'high'
        })
      }
    }
    
    // Check content patterns
    const contentText = content.content.toLowerCase()
    if (contentText.includes('list') || contentText.includes('tips')) {
      elements.push({
        type: 'content',
        element: 'list-based content',
        viralPotential: 'high'
      })
    }
    
    if (contentText.includes('story') || contentText.includes('experience')) {
      elements.push({
        type: 'content',
        element: 'story-driven content',
        viralPotential: 'medium'
      })
    }
    
    // Check for questions
    const questionCount = (contentText.match(/\?/g) || []).length
    if (questionCount >= 3) {
      elements.push({
        type: 'engagement',
        element: 'multiple questions',
        viralPotential: 'high'
      })
    }
    
    return elements
  }

  // Calculate expected metrics
  calculateExpectedReach(viralScore) {
    const baseReach = 1000
    const multiplier = viralScore / 100
    return Math.round(baseReach * (1 + multiplier * 2))
  }

  calculateExpectedShares(viralScore) {
    const baseShares = 50
    const multiplier = viralScore / 100
    return Math.round(baseShares * (1 + multiplier * 3))
  }

  calculateExpectedEngagement(viralScore) {
    const baseEngagement = 0.05
    const multiplier = viralScore / 100
    return Math.round((baseEngagement * (1 + multiplier * 2)) * 100) / 100
  }

  // Utility methods
  calculateEmotionalScore(text, words) {
    const matches = words.filter(word => text.includes(word)).length
    return Math.min(100, (matches / words.length) * 100)
  }

  calculateSocialScore(text, indicators) {
    const matches = indicators.filter(indicator => text.includes(indicator)).length
    return Math.min(100, (matches / indicators.length) * 100)
  }

  analyzeUniqueness(content) {
    let score = 50
    
    // Check for unique angles
    const uniqueIndicators = ['secret', 'hidden', 'unknown', 'exclusive', 'insider']
    const text = (content.title + ' ' + content.content).toLowerCase()
    const uniqueCount = uniqueIndicators.filter(indicator => text.includes(indicator)).length
    
    score += uniqueCount * 10
    
    return Math.min(100, score)
  }

  analyzeUsefulness(content) {
    let score = 50
    
    // Check for actionable content
    const usefulIndicators = ['how to', 'step by step', 'guide', 'tutorial', 'tips', 'tricks']
    const text = (content.title + ' ' + content.content).toLowerCase()
    const usefulCount = usefulIndicators.filter(indicator => text.includes(indicator)).length
    
    score += usefulCount * 8
    
    return Math.min(100, score)
  }

  analyzeEntertainment(content) {
    let score = 50
    
    // Check for entertaining elements
    const entertainmentIndicators = ['fun', 'interesting', 'amazing', 'incredible', 'wow', 'surprising']
    const text = (content.title + ' ' + content.content).toLowerCase()
    const entertainmentCount = entertainmentIndicators.filter(indicator => text.includes(indicator)).length
    
    score += entertainmentCount * 8
    
    return Math.min(100, score)
  }

  analyzeVisualContent(content) {
    let score = 50
    
    // Check for images
    const imageCount = (content.content.match(/<img[^>]*>/g) || []).length
    score += imageCount * 10
    
    // Check for videos
    const videoCount = (content.content.match(/<video[^>]*>/g) || []).length
    score += videoCount * 15
    
    return Math.min(100, score)
  }

  analyzeContentLength(content) {
    const wordCount = content.content.replace(/<[^>]*>/g, '').split(/\s+/).length
    
    if (wordCount >= 800 && wordCount <= 1500) return 100
    if (wordCount >= 500 && wordCount <= 2000) return 80
    if (wordCount >= 300 && wordCount <= 2500) return 60
    return 40
  }

  analyzeReadability(content) {
    const text = content.content.replace(/<[^>]*>/g, '')
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = text.split(/\s+/).filter(w => w.length > 0)
    
    if (sentences.length === 0) return 50
    
    const avgSentenceLength = words.length / sentences.length
    
    if (avgSentenceLength <= 15) return 100
    if (avgSentenceLength <= 20) return 80
    if (avgSentenceLength <= 25) return 60
    return 40
  }

  analyzeMobileOptimization(content) {
    let score = 70
    
    // Check for mobile-friendly elements
    if (content.content.includes('mobile') || content.content.includes('responsive')) {
      score += 20
    }
    
    // Check for short paragraphs
    const paragraphs = content.content.split('</p>')
    const shortParagraphs = paragraphs.filter(p => p.length < 200).length
    if (shortParagraphs / paragraphs.length > 0.7) {
      score += 10
    }
    
    return Math.min(100, score)
  }

  analyzeLoadingSpeed(content) {
    let score = 80
    
    // Check for image optimization
    const images = content.content.match(/<img[^>]*>/g) || []
    const optimizedImages = images.filter(img => img.includes('loading="lazy"')).length
    
    if (images.length > 0) {
      score += (optimizedImages / images.length) * 20
    }
    
    return Math.min(100, score)
  }

  analyzeAccessibility(content) {
    let score = 70
    
    // Check for alt text
    const images = content.content.match(/<img[^>]*>/g) || []
    const imagesWithAlt = images.filter(img => img.includes('alt=')).length
    
    if (images.length > 0) {
      score += (imagesWithAlt / images.length) * 30
    }
    
    return Math.min(100, score)
  }

  analyzeSEO(content) {
    let score = 60
    
    // Check for proper heading structure
    const h1Count = (content.content.match(/<h1[^>]*>/g) || []).length
    const h2Count = (content.content.match(/<h2[^>]*>/g) || []).length
    
    if (h1Count === 1) score += 20
    if (h2Count >= 3) score += 20
    
    return Math.min(100, score)
  }

  // Generate viral content suggestions
  generateViralContentSuggestions(keyword, targetViralScore = 80) {
    const suggestions = []
    
    // Title suggestions
    const viralTitles = [
      `Shocking Truth About ${keyword} That Nobody Tells You`,
      `The Secret ${keyword} Method That Changed Everything`,
      `Why Everyone is Wrong About ${keyword} (Here's the Truth)`,
      `The Hidden Truth Behind ${keyword} Success`,
      `${keyword}: The Ultimate Guide That Will Change Your Life`
    ]
    
    suggestions.push({
      type: 'title',
      suggestions: viralTitles,
      expectedViralScore: 85
    })
    
    // Content structure suggestions
    const viralStructures = [
      'List-based content with surprising facts',
      'Story-driven content with personal experience',
      'Controversial take on common beliefs',
      'Before/after comparison with dramatic results',
      'Secret tips that experts don\'t want you to know'
    ]
    
    suggestions.push({
      type: 'structure',
      suggestions: viralStructures,
      expectedViralScore: 80
    })
    
    // Engagement suggestions
    const engagementElements = [
      'Ask provocative questions throughout the content',
      'Include surprising statistics and facts',
      'Add emotional stories and personal experiences',
      'Create controversy by challenging common beliefs',
      'Use power words that trigger emotional responses'
    ]
    
    suggestions.push({
      type: 'engagement',
      suggestions: engagementElements,
      expectedViralScore: 75
    })
    
    return suggestions
  }

  // Get viral content templates
  getViralContentTemplates(keyword) {
    return {
      shocking: {
        title: `Shocking Truth About ${keyword} That Will Change Everything`,
        structure: 'controversial-revelation',
        expectedViralScore: 90
      },
      secret: {
        title: `The Secret ${keyword} Method That Experts Don't Want You to Know`,
        structure: 'insider-knowledge',
        expectedViralScore: 85
      },
      ultimate: {
        title: `Ultimate ${keyword} Guide: Everything You Need to Know`,
        structure: 'comprehensive-guide',
        expectedViralScore: 80
      },
      mistake: {
        title: `The Biggest ${keyword} Mistake Everyone Makes (And How to Fix It)`,
        structure: 'problem-solution',
        expectedViralScore: 82
      },
      hidden: {
        title: `Hidden ${keyword} Secrets That Will Transform Your Results`,
        structure: 'secret-revealed',
        expectedViralScore: 88
      }
    }
  }
}

export default ContentViralAnalyzer
