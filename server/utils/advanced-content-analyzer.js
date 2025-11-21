// Advanced Content Analysis System
class AdvancedContentAnalyzer {
  constructor() {
    this.analysisMetrics = {
      readability: {
        factors: ['sentence_length', 'word_complexity', 'paragraph_structure', 'vocabulary_diversity'],
        weights: { sentence_length: 0.3, word_complexity: 0.25, paragraph_structure: 0.25, vocabulary_diversity: 0.2 }
      },
      engagement: {
        factors: ['headings', 'images', 'interactive_elements', 'call_to_action', 'social_proof'],
        weights: { headings: 0.2, images: 0.25, interactive_elements: 0.2, call_to_action: 0.2, social_proof: 0.15 }
      },
      seo: {
        factors: ['keyword_density', 'meta_tags', 'internal_links', 'external_links', 'image_alt_text'],
        weights: { keyword_density: 0.3, meta_tags: 0.2, internal_links: 0.2, external_links: 0.15, image_alt_text: 0.15 }
      },
      technical: {
        factors: ['loading_speed', 'mobile_responsiveness', 'accessibility', 'structured_data', 'page_size'],
        weights: { loading_speed: 0.3, mobile_responsiveness: 0.25, accessibility: 0.2, structured_data: 0.15, page_size: 0.1 }
      }
    }
    
    this.benchmarks = {
      readability: { excellent: 90, good: 80, average: 70, poor: 60 },
      engagement: { excellent: 85, good: 75, average: 65, poor: 55 },
      seo: { excellent: 90, good: 80, average: 70, poor: 60 },
      technical: { excellent: 95, good: 85, average: 75, poor: 65 }
    }
    
    this.contentPatterns = {
      highPerforming: {
        titleLength: { min: 40, max: 60 },
        wordCount: { min: 1000, max: 2000 },
        headingCount: { min: 5, max: 10 },
        imageCount: { min: 3, max: 8 },
        internalLinks: { min: 3, max: 8 }
      },
      lowPerforming: {
        titleLength: { min: 20, max: 80 },
        wordCount: { min: 500, max: 3000 },
        headingCount: { min: 2, max: 15 },
        imageCount: { min: 1, max: 12 },
        internalLinks: { min: 1, max: 10 }
      }
    }
  }

  // Comprehensive content analysis
  analyzeContent(blogContent) {
    const analysis = {
      content: this.analyzeContentStructure(blogContent),
      readability: this.analyzeReadability(blogContent),
      engagement: this.analyzeEngagement(blogContent),
      seo: this.analyzeSEO(blogContent),
      technical: this.analyzeTechnical(blogContent),
      performance: this.analyzePerformance(blogContent),
      overall: { score: 0, grade: 'F', insights: [], recommendations: [] }
    }
    
    // Calculate overall score
    analysis.overall = this.calculateOverallScore(analysis)
    
    return analysis
  }

  analyzeContentStructure(blogContent) {
    const content = blogContent.content || ''
    const text = content.replace(/<[^>]*>/g, '')
    
    return {
      wordCount: text.split(/\s+/).length,
      characterCount: text.length,
      paragraphCount: content.split('</p>').length - 1,
      headingCount: this.countHeadings(content),
      imageCount: this.countImages(content),
      linkCount: this.countLinks(content),
      listCount: this.countLists(content),
      tableCount: this.countTables(content),
      structure: {
        hasIntroduction: this.hasIntroduction(content),
        hasConclusion: this.hasConclusion(content),
        hasFAQ: this.hasFAQ(content),
        hasCTA: this.hasCTA(content),
        hasRelatedContent: this.hasRelatedContent(content)
      }
    }
  }

  analyzeReadability(blogContent) {
    const content = blogContent.content || ''
    const text = content.replace(/<[^>]*>/g, '')
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = text.split(/\s+/).filter(w => w.length > 0)
    
    // Calculate readability metrics
    const avgSentenceLength = words.length / sentences.length
    const avgWordLength = text.replace(/\s+/g, '').length / words.length
    const complexWords = words.filter(w => w.length > 6).length
    const complexWordRatio = complexWords / words.length
    
    // Vocabulary diversity (unique words / total words)
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size
    const vocabularyDiversity = uniqueWords / words.length
    
    // Paragraph structure analysis
    const paragraphs = content.split('</p>').filter(p => p.trim().length > 0)
    const avgParagraphLength = words.length / paragraphs.length
    
    const readabilityScore = this.calculateReadabilityScore({
      avgSentenceLength,
      avgWordLength,
      complexWordRatio,
      vocabularyDiversity,
      avgParagraphLength
    })
    
    return {
      score: readabilityScore,
      grade: this.getGrade(readabilityScore, 'readability'),
      metrics: {
        avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
        avgWordLength: Math.round(avgWordLength * 10) / 10,
        complexWordRatio: Math.round(complexWordRatio * 100) / 100,
        vocabularyDiversity: Math.round(vocabularyDiversity * 100) / 100,
        avgParagraphLength: Math.round(avgParagraphLength * 10) / 10
      },
      issues: this.identifyReadabilityIssues({
        avgSentenceLength,
        avgWordLength,
        complexWordRatio,
        vocabularyDiversity,
        avgParagraphLength
      }),
      suggestions: this.generateReadabilitySuggestions({
        avgSentenceLength,
        avgWordLength,
        complexWordRatio,
        vocabularyDiversity,
        avgParagraphLength
      })
    }
  }

  analyzeEngagement(blogContent) {
    const content = blogContent.content || ''
    
    // Heading analysis
    const headings = this.extractHeadings(content)
    const headingScore = this.analyzeHeadings(headings)
    
    // Image analysis
    const images = this.extractImages(content)
    const imageScore = this.analyzeImages(images)
    
    // Interactive elements analysis
    const interactiveScore = this.analyzeInteractiveElements(content)
    
    // Call-to-action analysis
    const ctaScore = this.analyzeCallToAction(content)
    
    // Social proof analysis
    const socialProofScore = this.analyzeSocialProof(content)
    
    const engagementScore = this.calculateEngagementScore({
      headingScore,
      imageScore,
      interactiveScore,
      ctaScore,
      socialProofScore
    })
    
    return {
      score: engagementScore,
      grade: this.getGrade(engagementScore, 'engagement'),
      metrics: {
        headingScore,
        imageScore,
        interactiveScore,
        ctaScore,
        socialProofScore
      },
      issues: this.identifyEngagementIssues({
        headingScore,
        imageScore,
        interactiveScore,
        ctaScore,
        socialProofScore
      }),
      suggestions: this.generateEngagementSuggestions({
        headingScore,
        imageScore,
        interactiveScore,
        ctaScore,
        socialProofScore
      })
    }
  }

  analyzeSEO(blogContent) {
    const keyword = blogContent.originalKeyword || ''
    const content = blogContent.content || ''
    const text = content.replace(/<[^>]*>/g, '')
    
    // Keyword density analysis
    const keywordCount = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
    const keywordDensity = (keywordCount / text.split(/\s+/).length) * 100
    
    // Meta tags analysis
    const metaScore = this.analyzeMetaTags(blogContent)
    
    // Internal links analysis
    const internalLinks = this.extractInternalLinks(content)
    const internalLinkScore = this.analyzeInternalLinks(internalLinks)
    
    // External links analysis
    const externalLinks = this.extractExternalLinks(content)
    const externalLinkScore = this.analyzeExternalLinks(externalLinks)
    
    // Image alt text analysis
    const images = this.extractImages(content)
    const imageAltScore = this.analyzeImageAltText(images)
    
    const seoScore = this.calculateSEOScore({
      keywordDensity,
      metaScore,
      internalLinkScore,
      externalLinkScore,
      imageAltScore
    })
    
    return {
      score: seoScore,
      grade: this.getGrade(seoScore, 'seo'),
      metrics: {
        keywordDensity: Math.round(keywordDensity * 100) / 100,
        metaScore,
        internalLinkScore,
        externalLinkScore,
        imageAltScore
      },
      issues: this.identifySEOIssues({
        keywordDensity,
        metaScore,
        internalLinkScore,
        externalLinkScore,
        imageAltScore
      }),
      suggestions: this.generateSEOSuggestions({
        keywordDensity,
        metaScore,
        internalLinkScore,
        externalLinkScore,
        imageAltScore
      })
    }
  }

  analyzeTechnical(blogContent) {
    const content = blogContent.content || ''
    
    // Loading speed analysis (estimated)
    const loadingSpeedScore = this.analyzeLoadingSpeed(content)
    
    // Mobile responsiveness analysis
    const mobileScore = this.analyzeMobileResponsiveness(content)
    
    // Accessibility analysis
    const accessibilityScore = this.analyzeAccessibility(content)
    
    // Structured data analysis
    const structuredDataScore = this.analyzeStructuredData(content)
    
    // Page size analysis
    const pageSizeScore = this.analyzePageSize(content)
    
    const technicalScore = this.calculateTechnicalScore({
      loadingSpeedScore,
      mobileScore,
      accessibilityScore,
      structuredDataScore,
      pageSizeScore
    })
    
    return {
      score: technicalScore,
      grade: this.getGrade(technicalScore, 'technical'),
      metrics: {
        loadingSpeedScore,
        mobileScore,
        accessibilityScore,
        structuredDataScore,
        pageSizeScore
      },
      issues: this.identifyTechnicalIssues({
        loadingSpeedScore,
        mobileScore,
        accessibilityScore,
        structuredDataScore,
        pageSizeScore
      }),
      suggestions: this.generateTechnicalSuggestions({
        loadingSpeedScore,
        mobileScore,
        accessibilityScore,
        structuredDataScore,
        pageSizeScore
      })
    }
  }

  analyzePerformance(blogContent) {
    const content = blogContent.content || ''
    const text = content.replace(/<[^>]*>/g, '')
    
    // Content length analysis
    const wordCount = text.split(/\s+/).length
    const lengthScore = this.analyzeContentLength(wordCount)
    
    // Content depth analysis
    const depthScore = this.analyzeContentDepth(content)
    
    // Content freshness analysis
    const freshnessScore = this.analyzeContentFreshness(blogContent)
    
    // Content uniqueness analysis
    const uniquenessScore = this.analyzeContentUniqueness(content)
    
    const performanceScore = this.calculatePerformanceScore({
      lengthScore,
      depthScore,
      freshnessScore,
      uniquenessScore
    })
    
    return {
      score: performanceScore,
      grade: this.getGrade(performanceScore, 'performance'),
      metrics: {
        lengthScore,
        depthScore,
        freshnessScore,
        uniquenessScore
      },
      issues: this.identifyPerformanceIssues({
        lengthScore,
        depthScore,
        freshnessScore,
        uniquenessScore
      }),
      suggestions: this.generatePerformanceSuggestions({
        lengthScore,
        depthScore,
        freshnessScore,
        uniquenessScore
      })
    }
  }

  // Utility methods for analysis
  countHeadings(content) {
    return (content.match(/<h[1-6][^>]*>/g) || []).length
  }

  countImages(content) {
    return (content.match(/<img[^>]*>/g) || []).length
  }

  countLinks(content) {
    return (content.match(/<a[^>]*>/g) || []).length
  }

  countLists(content) {
    return (content.match(/<[uo]l[^>]*>/g) || []).length
  }

  countTables(content) {
    return (content.match(/<table[^>]*>/g) || []).length
  }

  hasIntroduction(content) {
    return content.toLowerCase().includes('introduction') || 
           content.toLowerCase().includes('pengantar') ||
           content.toLowerCase().includes('pendahuluan')
  }

  hasConclusion(content) {
    return content.toLowerCase().includes('conclusion') || 
           content.toLowerCase().includes('kesimpulan') ||
           content.toLowerCase().includes('penutup')
  }

  hasFAQ(content) {
    return content.toLowerCase().includes('faq') || 
           content.toLowerCase().includes('pertanyaan') ||
           content.toLowerCase().includes('tanya jawab')
  }

  hasCTA(content) {
    return content.toLowerCase().includes('cta') || 
           content.toLowerCase().includes('call to action') ||
           content.toLowerCase().includes('hubungi') ||
           content.toLowerCase().includes('konsultasi')
  }

  hasRelatedContent(content) {
    return content.toLowerCase().includes('related') || 
           content.toLowerCase().includes('terkait') ||
           content.toLowerCase().includes('artikel lain')
  }

  extractHeadings(content) {
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/g
    const headings = []
    let match
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2].replace(/<[^>]*>/g, '').trim()
      })
    }
    
    return headings
  }

  extractImages(content) {
    const imgRegex = /<img[^>]*>/g
    const images = []
    let match
    
    while ((match = imgRegex.exec(content)) !== null) {
      const imgTag = match[0]
      const srcMatch = imgTag.match(/src="([^"]*)"/)
      const altMatch = imgTag.match(/alt="([^"]*)"/)
      
      images.push({
        src: srcMatch ? srcMatch[1] : '',
        alt: altMatch ? altMatch[1] : ''
      })
    }
    
    return images
  }

  extractInternalLinks(content) {
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>/g
    const links = []
    let match
    
    while ((match = linkRegex.exec(content)) !== null) {
      const href = match[1]
      if (href.startsWith('/') || href.includes('jasapembayaran.com')) {
        links.push(href)
      }
    }
    
    return links
  }

  extractExternalLinks(content) {
    const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>/g
    const links = []
    let match
    
    while ((match = linkRegex.exec(content)) !== null) {
      const href = match[1]
      if (href.startsWith('http') && !href.includes('jasapembayaran.com')) {
        links.push(href)
      }
    }
    
    return links
  }

  // Scoring methods
  calculateReadabilityScore(metrics) {
    let score = 100
    
    // Sentence length penalty
    if (metrics.avgSentenceLength > 20) score -= 20
    else if (metrics.avgSentenceLength > 15) score -= 10
    
    // Word complexity penalty
    if (metrics.complexWordRatio > 0.3) score -= 20
    else if (metrics.complexWordRatio > 0.2) score -= 10
    
    // Vocabulary diversity bonus
    if (metrics.vocabularyDiversity > 0.7) score += 10
    else if (metrics.vocabularyDiversity < 0.5) score -= 10
    
    // Paragraph length penalty
    if (metrics.avgParagraphLength > 150) score -= 15
    else if (metrics.avgParagraphLength > 100) score -= 5
    
    return Math.max(0, Math.min(100, score))
  }

  calculateEngagementScore(metrics) {
    const weights = this.analysisMetrics.engagement.weights
    return Math.round(
      metrics.headingScore * weights.headings +
      metrics.imageScore * weights.images +
      metrics.interactiveScore * weights.interactive_elements +
      metrics.ctaScore * weights.call_to_action +
      metrics.socialProofScore * weights.social_proof
    )
  }

  calculateSEOScore(metrics) {
    const weights = this.analysisMetrics.seo.weights
    return Math.round(
      Math.min(100, metrics.keywordDensity * 10) * weights.keyword_density +
      metrics.metaScore * weights.meta_tags +
      metrics.internalLinkScore * weights.internal_links +
      metrics.externalLinkScore * weights.external_links +
      metrics.imageAltScore * weights.image_alt_text
    )
  }

  calculateTechnicalScore(metrics) {
    const weights = this.analysisMetrics.technical.weights
    return Math.round(
      metrics.loadingSpeedScore * weights.loading_speed +
      metrics.mobileScore * weights.mobile_responsiveness +
      metrics.accessibilityScore * weights.accessibility +
      metrics.structuredDataScore * weights.structured_data +
      metrics.pageSizeScore * weights.page_size
    )
  }

  calculatePerformanceScore(metrics) {
    return Math.round(
      metrics.lengthScore * 0.3 +
      metrics.depthScore * 0.3 +
      metrics.freshnessScore * 0.2 +
      metrics.uniquenessScore * 0.2
    )
  }

  calculateOverallScore(analysis) {
    const weights = {
      readability: 0.25,
      engagement: 0.25,
      seo: 0.25,
      technical: 0.15,
      performance: 0.10
    }
    
    const overallScore = Math.round(
      analysis.readability.score * weights.readability +
      analysis.engagement.score * weights.engagement +
      analysis.seo.score * weights.seo +
      analysis.technical.score * weights.technical +
      analysis.performance.score * weights.performance
    )
    
    const insights = this.generateInsights(analysis)
    const recommendations = this.generateRecommendations(analysis)
    
    return {
      score: overallScore,
      grade: this.getGrade(overallScore, 'overall'),
      insights,
      recommendations
    }
  }

  getGrade(score, category) {
    const benchmark = this.benchmarks[category] || this.benchmarks.readability
    
    if (score >= benchmark.excellent) return 'A'
    if (score >= benchmark.good) return 'B'
    if (score >= benchmark.average) return 'C'
    if (score >= benchmark.poor) return 'D'
    return 'F'
  }

  // Analysis helper methods
  analyzeHeadings(headings) {
    if (headings.length === 0) return 0
    
    let score = 50
    
    // Check for H1
    if (headings.some(h => h.level === 1)) score += 20
    
    // Check for proper hierarchy
    const levels = headings.map(h => h.level)
    const hasProperHierarchy = levels.every((level, index) => {
      if (index === 0) return true
      return level <= levels[index - 1] + 1
    })
    if (hasProperHierarchy) score += 20
    
    // Check for descriptive headings
    const descriptiveHeadings = headings.filter(h => h.text.length > 10).length
    if (descriptiveHeadings / headings.length > 0.7) score += 10
    
    return Math.min(100, score)
  }

  analyzeImages(images) {
    if (images.length === 0) return 0
    
    let score = 50
    
    // Check for alt text
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim().length > 0).length
    score += (imagesWithAlt / images.length) * 30
    
    // Check for appropriate number of images
    if (images.length >= 3 && images.length <= 8) score += 20
    
    return Math.min(100, score)
  }

  analyzeInteractiveElements(content) {
    let score = 50
    
    // Check for lists
    if (content.includes('<ul>') || content.includes('<ol>')) score += 15
    
    // Check for tables
    if (content.includes('<table>')) score += 10
    
    // Check for forms
    if (content.includes('<form>')) score += 15
    
    // Check for buttons
    if (content.includes('<button>')) score += 10
    
    return Math.min(100, score)
  }

  analyzeCallToAction(content) {
    let score = 0
    
    const ctaIndicators = [
      'hubungi', 'konsultasi', 'daftar', 'mulai', 'coba',
      'contact', 'consult', 'register', 'start', 'try'
    ]
    
    const ctaCount = ctaIndicators.reduce((count, indicator) => {
      return count + (content.toLowerCase().includes(indicator) ? 1 : 0)
    }, 0)
    
    score = Math.min(100, ctaCount * 20)
    
    return score
  }

  analyzeSocialProof(content) {
    let score = 0
    
    const socialProofIndicators = [
      'testimoni', 'review', 'rating', 'ulasan', 'pengalaman',
      'testimonial', 'review', 'rating', 'experience'
    ]
    
    const socialProofCount = socialProofIndicators.reduce((count, indicator) => {
      return count + (content.toLowerCase().includes(indicator) ? 1 : 0)
    }, 0)
    
    score = Math.min(100, socialProofCount * 25)
    
    return score
  }

  // Generate insights and recommendations
  generateInsights(analysis) {
    const insights = []
    
    if (analysis.readability.score >= 80) {
      insights.push('Content is highly readable and easy to understand')
    } else if (analysis.readability.score < 60) {
      insights.push('Content readability needs improvement')
    }
    
    if (analysis.engagement.score >= 80) {
      insights.push('Content has excellent engagement potential')
    } else if (analysis.engagement.score < 60) {
      insights.push('Content engagement could be enhanced')
    }
    
    if (analysis.seo.score >= 80) {
      insights.push('Content is well-optimized for search engines')
    } else if (analysis.seo.score < 60) {
      insights.push('SEO optimization needs attention')
    }
    
    return insights
  }

  generateRecommendations(analysis) {
    const recommendations = []
    
    // Readability recommendations
    if (analysis.readability.score < 70) {
      recommendations.push({
        category: 'readability',
        priority: 'high',
        suggestion: 'Improve content readability by using shorter sentences and simpler words',
        impact: 'High - Better user experience and engagement'
      })
    }
    
    // Engagement recommendations
    if (analysis.engagement.score < 70) {
      recommendations.push({
        category: 'engagement',
        priority: 'medium',
        suggestion: 'Add more interactive elements like images, lists, and call-to-actions',
        impact: 'Medium - Better user engagement'
      })
    }
    
    // SEO recommendations
    if (analysis.seo.score < 70) {
      recommendations.push({
        category: 'seo',
        priority: 'high',
        suggestion: 'Optimize SEO by improving keyword density and meta tags',
        impact: 'High - Better search engine visibility'
      })
    }
    
    return recommendations
  }

  // Placeholder methods for detailed analysis
  analyzeMetaTags(blogContent) {
    let score = 50
    
    if (blogContent.title && blogContent.title.length >= 30 && blogContent.title.length <= 60) score += 25
    if (blogContent.meta_description && blogContent.meta_description.length >= 120 && blogContent.meta_description.length <= 160) score += 25
    
    return Math.min(100, score)
  }

  analyzeInternalLinks(links) {
    if (links.length === 0) return 0
    if (links.length >= 3 && links.length <= 8) return 100
    if (links.length < 3) return 50
    return 75
  }

  analyzeExternalLinks(links) {
    if (links.length === 0) return 50
    if (links.length >= 1 && links.length <= 3) return 100
    return 75
  }

  analyzeImageAltText(images) {
    if (images.length === 0) return 0
    
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim().length > 0).length
    return Math.round((imagesWithAlt / images.length) * 100)
  }

  analyzeLoadingSpeed(content) {
    // Simplified loading speed analysis
    const imageCount = this.countImages(content)
    const linkCount = this.countLinks(content)
    
    let score = 100
    if (imageCount > 10) score -= 20
    if (linkCount > 20) score -= 10
    
    return Math.max(0, score)
  }

  analyzeMobileResponsiveness(content) {
    // Simplified mobile responsiveness analysis
    let score = 80
    
    if (content.includes('mobile') || content.includes('responsive')) score += 20
    
    return Math.min(100, score)
  }

  analyzeAccessibility(content) {
    // Simplified accessibility analysis
    let score = 70
    
    const images = this.extractImages(content)
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim().length > 0).length
    
    if (images.length > 0) {
      score += (imagesWithAlt / images.length) * 30
    }
    
    return Math.min(100, score)
  }

  analyzeStructuredData(content) {
    // Simplified structured data analysis
    let score = 50
    
    if (content.includes('schema') || content.includes('structured')) score += 30
    if (content.includes('json-ld')) score += 20
    
    return Math.min(100, score)
  }

  analyzePageSize(content) {
    // Simplified page size analysis
    const contentSize = content.length
    let score = 100
    
    if (contentSize > 100000) score -= 30
    else if (contentSize > 50000) score -= 15
    
    return Math.max(0, score)
  }

  analyzeContentLength(wordCount) {
    if (wordCount >= 1000 && wordCount <= 2000) return 100
    if (wordCount >= 800 && wordCount <= 2500) return 80
    if (wordCount >= 500 && wordCount <= 3000) return 60
    return 40
  }

  analyzeContentDepth(content) {
    let score = 50
    
    const headings = this.countHeadings(content)
    const images = this.countImages(content)
    const links = this.countLinks(content)
    
    if (headings >= 5) score += 20
    if (images >= 3) score += 15
    if (links >= 3) score += 15
    
    return Math.min(100, score)
  }

  analyzeContentFreshness(blogContent) {
    // Simplified freshness analysis
    let score = 80
    
    const currentYear = new Date().getFullYear()
    if (blogContent.title.includes(currentYear.toString())) score += 20
    
    return Math.min(100, score)
  }

  analyzeContentUniqueness(content) {
    // Simplified uniqueness analysis
    let score = 70
    
    const text = content.replace(/<[^>]*>/g, '')
    const words = text.split(/\s+/)
    const uniqueWords = new Set(words.map(w => w.toLowerCase())).size
    const uniqueness = uniqueWords / words.length
    
    if (uniqueness > 0.7) score += 20
    else if (uniqueness < 0.5) score -= 20
    
    return Math.max(0, Math.min(100, score))
  }

  // Issue identification methods
  identifyReadabilityIssues(metrics) {
    const issues = []
    
    if (metrics.avgSentenceLength > 20) {
      issues.push('Sentences are too long (average > 20 words)')
    }
    
    if (metrics.complexWordRatio > 0.3) {
      issues.push('Too many complex words (> 30%)')
    }
    
    if (metrics.vocabularyDiversity < 0.5) {
      issues.push('Limited vocabulary diversity (< 50%)')
    }
    
    return issues
  }

  identifyEngagementIssues(metrics) {
    const issues = []
    
    if (metrics.headingScore < 60) {
      issues.push('Poor heading structure')
    }
    
    if (metrics.imageScore < 60) {
      issues.push('Insufficient or poorly optimized images')
    }
    
    if (metrics.ctaScore < 40) {
      issues.push('Missing or weak call-to-actions')
    }
    
    return issues
  }

  identifySEOIssues(metrics) {
    const issues = []
    
    if (metrics.keywordDensity < 0.5) {
      issues.push('Low keyword density (< 0.5%)')
    } else if (metrics.keywordDensity > 3) {
      issues.push('High keyword density (> 3%)')
    }
    
    if (metrics.metaScore < 60) {
      issues.push('Poor meta tags optimization')
    }
    
    if (metrics.internalLinkScore < 60) {
      issues.push('Insufficient internal links')
    }
    
    return issues
  }

  identifyTechnicalIssues(metrics) {
    const issues = []
    
    if (metrics.loadingSpeedScore < 70) {
      issues.push('Slow loading speed')
    }
    
    if (metrics.accessibilityScore < 70) {
      issues.push('Accessibility issues')
    }
    
    if (metrics.structuredDataScore < 50) {
      issues.push('Missing structured data')
    }
    
    return issues
  }

  identifyPerformanceIssues(metrics) {
    const issues = []
    
    if (metrics.lengthScore < 60) {
      issues.push('Content length not optimal')
    }
    
    if (metrics.depthScore < 60) {
      issues.push('Content depth insufficient')
    }
    
    if (metrics.uniquenessScore < 60) {
      issues.push('Content uniqueness needs improvement')
    }
    
    return issues
  }

  // Suggestion generation methods
  generateReadabilitySuggestions(metrics) {
    const suggestions = []
    
    if (metrics.avgSentenceLength > 20) {
      suggestions.push('Break long sentences into shorter ones (target: 15-20 words)')
    }
    
    if (metrics.complexWordRatio > 0.3) {
      suggestions.push('Replace complex words with simpler alternatives')
    }
    
    if (metrics.vocabularyDiversity < 0.5) {
      suggestions.push('Use more varied vocabulary to improve diversity')
    }
    
    return suggestions
  }

  generateEngagementSuggestions(metrics) {
    const suggestions = []
    
    if (metrics.headingScore < 60) {
      suggestions.push('Improve heading structure with proper H1-H6 hierarchy')
    }
    
    if (metrics.imageScore < 60) {
      suggestions.push('Add more images with descriptive alt text')
    }
    
    if (metrics.ctaScore < 40) {
      suggestions.push('Add clear call-to-action buttons and links')
    }
    
    return suggestions
  }

  generateSEOSuggestions(metrics) {
    const suggestions = []
    
    if (metrics.keywordDensity < 0.5) {
      suggestions.push('Increase keyword density to 1-2%')
    } else if (metrics.keywordDensity > 3) {
      suggestions.push('Reduce keyword density to avoid over-optimization')
    }
    
    if (metrics.metaScore < 60) {
      suggestions.push('Optimize title and meta description')
    }
    
    if (metrics.internalLinkScore < 60) {
      suggestions.push('Add more internal links to related content')
    }
    
    return suggestions
  }

  generateTechnicalSuggestions(metrics) {
    const suggestions = []
    
    if (metrics.loadingSpeedScore < 70) {
      suggestions.push('Optimize images and reduce page size')
    }
    
    if (metrics.accessibilityScore < 70) {
      suggestions.push('Improve accessibility with proper alt text and structure')
    }
    
    if (metrics.structuredDataScore < 50) {
      suggestions.push('Add structured data markup')
    }
    
    return suggestions
  }

  generatePerformanceSuggestions(metrics) {
    const suggestions = []
    
    if (metrics.lengthScore < 60) {
      suggestions.push('Adjust content length to 1000-2000 words')
    }
    
    if (metrics.depthScore < 60) {
      suggestions.push('Add more detailed content with headings and examples')
    }
    
    if (metrics.uniquenessScore < 60) {
      suggestions.push('Improve content uniqueness and originality')
    }
    
    return suggestions
  }
}

export default AdvancedContentAnalyzer
