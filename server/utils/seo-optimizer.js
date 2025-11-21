// Advanced SEO Optimizer for Blog Content
class SEOOptimizer {
  constructor() {
    this.seoRules = {
      title: {
        minLength: 30,
        maxLength: 60,
        optimalLength: 50,
        keywordPosition: 'beginning',
        powerWords: ['panduan', 'cara', 'tips', 'solusi', 'terbaik', 'lengkap', '2025']
      },
      metaDescription: {
        minLength: 120,
        maxLength: 160,
        optimalLength: 150,
        keywordDensity: 0.02,
        callToAction: true
      },
      content: {
        minWords: 800,
        maxWords: 2000,
        optimalWords: 1200,
        keywordDensity: 0.015,
        headingStructure: ['h1', 'h2', 'h3'],
        internalLinks: 3,
        externalLinks: 1
      },
      images: {
        altTextRequired: true,
        maxImages: 8,
        minImages: 3,
        optimalImages: 5,
        imageNames: 'keyword-based'
      }
    }
    
    this.seoKeywords = {
      primary: ['jasa', 'pembayaran', 'paypal', 'bitcoin', 'indonesia'],
      secondary: ['terpercaya', 'aman', 'cepat', 'mudah', 'lengkap'],
      longTail: ['cara mudah', 'panduan lengkap', 'tips terbaik', 'solusi aman']
    }
    
    this.competitorAnalysis = {
      topCompetitors: [
        'jasapembayaran.com',
        'paypal-indonesia.com',
        'bitcoin-indonesia.com'
      ],
      analysisKeywords: [
        'jasa paypal',
        'jasa bitcoin',
        'pembayaran online'
      ]
    }
  }

  // Advanced SEO analysis
  analyzeSEO(blogData) {
    const analysis = {
      title: this.analyzeTitleSEO(blogData.title, blogData.originalKeyword),
      metaDescription: this.analyzeMetaDescriptionSEO(blogData.meta_description, blogData.originalKeyword),
      content: this.analyzeContentSEO(blogData.content, blogData.originalKeyword),
      images: this.analyzeImagesSEO(blogData.content),
      structure: this.analyzeStructureSEO(blogData.content),
      keywords: this.analyzeKeywordsSEO(blogData.content, blogData.originalKeyword),
      overall: { score: 0, grade: 'F', issues: [], suggestions: [] }
    }
    
    // Calculate overall SEO score
    analysis.overall = this.calculateOverallSEOScore(analysis)
    
    return analysis
  }

  analyzeTitleSEO(title, keyword) {
    const issues = []
    const suggestions = []
    let score = 100
    
    // Length analysis
    if (title.length < this.seoRules.title.minLength) {
      issues.push(`Title too short (${title.length} chars, minimum ${this.seoRules.title.minLength})`)
      score -= 20
    } else if (title.length > this.seoRules.title.maxLength) {
      issues.push(`Title too long (${title.length} chars, maximum ${this.seoRules.title.maxLength})`)
      score -= 15
    }
    
    // Keyword position analysis
    if (!title.toLowerCase().startsWith(keyword.toLowerCase())) {
      issues.push('Keyword not at the beginning of title')
      score -= 25
      suggestions.push(`Move "${keyword}" to the beginning of the title`)
    }
    
    // Power words analysis
    const hasPowerWords = this.seoRules.title.powerWords.some(word => 
      title.toLowerCase().includes(word.toLowerCase())
    )
    if (!hasPowerWords) {
      issues.push('Title lacks SEO power words')
      score -= 10
      suggestions.push('Add power words like "panduan", "cara", "tips", or "solusi"')
    }
    
    // Keyword density analysis
    const keywordCount = (title.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
    if (keywordCount === 0) {
      issues.push('Title does not contain main keyword')
      score -= 30
    } else if (keywordCount > 2) {
      issues.push('Title has too many keyword repetitions')
      score -= 15
    }
    
    return {
      score: Math.max(0, score),
      grade: this.getSEOGrade(score),
      issues,
      suggestions,
      analysis: {
        length: title.length,
        keywordPosition: title.toLowerCase().indexOf(keyword.toLowerCase()),
        powerWords: this.seoRules.title.powerWords.filter(word => 
          title.toLowerCase().includes(word.toLowerCase())
        ),
        keywordCount
      }
    }
  }

  analyzeMetaDescriptionSEO(metaDescription, keyword) {
    const issues = []
    const suggestions = []
    let score = 100
    
    if (!metaDescription) {
      return {
        score: 0,
        grade: 'F',
        issues: ['Meta description is missing'],
        suggestions: ['Add a meta description'],
        analysis: {}
      }
    }
    
    // Length analysis
    if (metaDescription.length < this.seoRules.metaDescription.minLength) {
      issues.push(`Meta description too short (${metaDescription.length} chars)`)
      score -= 20
    } else if (metaDescription.length > this.seoRules.metaDescription.maxLength) {
      issues.push(`Meta description too long (${metaDescription.length} chars)`)
      score -= 15
    }
    
    // Keyword presence
    if (!metaDescription.toLowerCase().includes(keyword.toLowerCase())) {
      issues.push('Meta description does not contain main keyword')
      score -= 25
      suggestions.push(`Include "${keyword}" in meta description`)
    }
    
    // Call-to-action analysis
    const hasCTA = metaDescription.includes('!') || 
                   metaDescription.includes('Hubungi') ||
                   metaDescription.includes('Konsultasi') ||
                   metaDescription.includes('Gratis')
    if (!hasCTA) {
      issues.push('Meta description lacks call-to-action')
      score -= 10
      suggestions.push('Add call-to-action like "Konsultasi gratis!" or "Hubungi sekarang!"')
    }
    
    return {
      score: Math.max(0, score),
      grade: this.getSEOGrade(score),
      issues,
      suggestions,
      analysis: {
        length: metaDescription.length,
        keywordPresent: metaDescription.toLowerCase().includes(keyword.toLowerCase()),
        hasCTA
      }
    }
  }

  analyzeContentSEO(content, keyword) {
    const issues = []
    const suggestions = []
    let score = 100
    
    const text = content.replace(/<[^>]*>/g, '')
    const wordCount = text.split(/\s+/).length
    
    // Word count analysis
    if (wordCount < this.seoRules.content.minWords) {
      issues.push(`Content too short (${wordCount} words, minimum ${this.seoRules.content.minWords})`)
      score -= 20
    } else if (wordCount > this.seoRules.content.maxWords) {
      issues.push(`Content too long (${wordCount} words, maximum ${this.seoRules.content.maxWords})`)
      score -= 10
    }
    
    // Keyword density analysis
    const keywordCount = (text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
    const keywordDensity = (keywordCount / wordCount) * 100
    
    if (keywordDensity < 0.5) {
      issues.push(`Low keyword density (${keywordDensity.toFixed(2)}%, minimum 0.5%)`)
      score -= 15
      suggestions.push(`Increase keyword density for "${keyword}"`)
    } else if (keywordDensity > 3) {
      issues.push(`High keyword density (${keywordDensity.toFixed(2)}%, maximum 3%)`)
      score -= 10
      suggestions.push(`Reduce keyword density for "${keyword}"`)
    }
    
    // Heading structure analysis
    const headings = this.extractHeadings(content)
    if (!headings.some(h => h.tag === 'h1')) {
      issues.push('Missing H1 heading')
      score -= 20
    }
    if (headings.filter(h => h.tag === 'h2').length < 3) {
      issues.push('Insufficient H2 headings (minimum 3)')
      score -= 15
    }
    
    // Internal links analysis
    const internalLinks = this.extractInternalLinks(content)
    if (internalLinks.length < this.seoRules.content.internalLinks) {
      issues.push(`Insufficient internal links (${internalLinks.length}, minimum ${this.seoRules.content.internalLinks})`)
      score -= 10
      suggestions.push('Add more internal links to related content')
    }
    
    return {
      score: Math.max(0, score),
      grade: this.getSEOGrade(score),
      issues,
      suggestions,
      analysis: {
        wordCount,
        keywordDensity,
        headingCount: headings.length,
        internalLinkCount: internalLinks.length,
        headings
      }
    }
  }

  analyzeImagesSEO(content) {
    const issues = []
    const suggestions = []
    let score = 100
    
    const images = this.extractImages(content)
    
    // Image count analysis
    if (images.length < this.seoRules.images.minImages) {
      issues.push(`Insufficient images (${images.length}, minimum ${this.seoRules.images.minImages})`)
      score -= 20
    } else if (images.length > this.seoRules.images.maxImages) {
      issues.push(`Too many images (${images.length}, maximum ${this.seoRules.images.maxImages})`)
      score -= 10
    }
    
    // Alt text analysis
    const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '')
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`)
      score -= 15
      suggestions.push('Add descriptive alt text to all images')
    }
    
    // Image naming analysis
    const imagesWithKeywordNames = images.filter(img => 
      img.src.toLowerCase().includes('keyword') || 
      img.alt.toLowerCase().includes('keyword')
    )
    if (imagesWithKeywordNames.length === 0) {
      issues.push('Images not optimized with keyword-based names')
      score -= 10
      suggestions.push('Use keyword-based names for images')
    }
    
    return {
      score: Math.max(0, score),
      grade: this.getSEOGrade(score),
      issues,
      suggestions,
      analysis: {
        imageCount: images.length,
        imagesWithoutAlt: imagesWithoutAlt.length,
        imagesWithKeywordNames: imagesWithKeywordNames.length
      }
    }
  }

  analyzeStructureSEO(content) {
    const issues = []
    const suggestions = []
    let score = 100
    
    // Table of contents analysis
    if (!content.includes('table-of-contents') && !content.includes('daftar isi')) {
      issues.push('Missing table of contents')
      score -= 10
      suggestions.push('Add table of contents for better navigation')
    }
    
    // FAQ section analysis
    if (!content.toLowerCase().includes('faq') && !content.toLowerCase().includes('pertanyaan')) {
      issues.push('Missing FAQ section')
      score -= 10
      suggestions.push('Add FAQ section for better user experience')
    }
    
    // Call-to-action analysis
    if (!content.includes('cta-section') && !content.includes('hubungi')) {
      issues.push('Missing call-to-action section')
      score -= 10
      suggestions.push('Add call-to-action section')
    }
    
    // Related articles analysis
    if (!content.includes('related-articles') && !content.includes('artikel terkait')) {
      issues.push('Missing related articles section')
      score -= 5
      suggestions.push('Add related articles section')
    }
    
    return {
      score: Math.max(0, score),
      grade: this.getSEOGrade(score),
      issues,
      suggestions,
      analysis: {
        hasTableOfContents: content.includes('table-of-contents'),
        hasFAQ: content.toLowerCase().includes('faq'),
        hasCTA: content.includes('cta-section'),
        hasRelatedArticles: content.includes('related-articles')
      }
    }
  }

  analyzeKeywordsSEO(content, mainKeyword) {
    const issues = []
    const suggestions = []
    let score = 100
    
    const text = content.replace(/<[^>]*>/g, '').toLowerCase()
    
    // Primary keywords analysis
    const primaryKeywords = this.seoKeywords.primary.filter(keyword => 
      text.includes(keyword.toLowerCase())
    )
    if (primaryKeywords.length < 2) {
      issues.push('Insufficient primary keywords')
      score -= 15
      suggestions.push('Include more primary keywords like "jasa", "pembayaran", "paypal"')
    }
    
    // Secondary keywords analysis
    const secondaryKeywords = this.seoKeywords.secondary.filter(keyword => 
      text.includes(keyword.toLowerCase())
    )
    if (secondaryKeywords.length < 3) {
      issues.push('Insufficient secondary keywords')
      score -= 10
      suggestions.push('Include more secondary keywords like "terpercaya", "aman", "cepat"')
    }
    
    // Long-tail keywords analysis
    const longTailKeywords = this.seoKeywords.longTail.filter(keyword => 
      text.includes(keyword.toLowerCase())
    )
    if (longTailKeywords.length === 0) {
      issues.push('Missing long-tail keywords')
      score -= 10
      suggestions.push('Include long-tail keywords like "cara mudah", "panduan lengkap"')
    }
    
    return {
      score: Math.max(0, score),
      grade: this.getSEOGrade(score),
      issues,
      suggestions,
      analysis: {
        primaryKeywords,
        secondaryKeywords,
        longTailKeywords,
        totalKeywords: primaryKeywords.length + secondaryKeywords.length + longTailKeywords.length
      }
    }
  }

  // SEO optimization suggestions
  generateSEOOptimizations(analysis) {
    const optimizations = []
    
    // Title optimizations
    if (analysis.title.score < 80) {
      optimizations.push({
        type: 'title',
        priority: 'high',
        suggestions: analysis.title.suggestions,
        impact: 'High - Title is crucial for SEO'
      })
    }
    
    // Meta description optimizations
    if (analysis.metaDescription.score < 80) {
      optimizations.push({
        type: 'meta_description',
        priority: 'high',
        suggestions: analysis.metaDescription.suggestions,
        impact: 'High - Meta description affects click-through rates'
      })
    }
    
    // Content optimizations
    if (analysis.content.score < 80) {
      optimizations.push({
        type: 'content',
        priority: 'medium',
        suggestions: analysis.content.suggestions,
        impact: 'Medium - Content structure affects user experience'
      })
    }
    
    // Image optimizations
    if (analysis.images.score < 80) {
      optimizations.push({
        type: 'images',
        priority: 'medium',
        suggestions: analysis.images.suggestions,
        impact: 'Medium - Images affect page load speed and accessibility'
      })
    }
    
    // Structure optimizations
    if (analysis.structure.score < 80) {
      optimizations.push({
        type: 'structure',
        priority: 'low',
        suggestions: analysis.structure.suggestions,
        impact: 'Low - Structure affects user experience'
      })
    }
    
    return optimizations
  }

  // Utility methods
  extractHeadings(content) {
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/g
    const headings = []
    let match
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        tag: `h${match[1]}`,
        text: match[2].replace(/<[^>]*>/g, '').trim()
      })
    }
    
    return headings
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

  calculateOverallSEOScore(analysis) {
    const weights = {
      title: 0.25,
      metaDescription: 0.20,
      content: 0.30,
      images: 0.15,
      structure: 0.05,
      keywords: 0.05
    }
    
    let totalScore = 0
    let totalWeight = 0
    
    if (weights && typeof weights === 'object') {
      for (const [key, weight] of Object.entries(weights)) {
        if (analysis[key]) {
          totalScore += analysis[key].score * weight
          totalWeight += weight
        }
      }
    }
    
    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0
    const allIssues = (analysis && typeof analysis === 'object')
      ? Object.values(analysis)
          .filter(a => a && a.issues)
          .flatMap(a => a.issues)
      : []
    
    const allSuggestions = (analysis && typeof analysis === 'object')
      ? Object.values(analysis)
          .filter(a => a && a.suggestions)
          .flatMap(a => a.suggestions)
      : []
    
    return {
      score: Math.round(finalScore),
      grade: this.getSEOGrade(finalScore),
      issues: allIssues,
      suggestions: allSuggestions
    }
  }

  getSEOGrade(score) {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }
}

export default SEOOptimizer
