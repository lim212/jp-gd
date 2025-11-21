// Content Quality Controller - Validation and Optimization
class ContentQualityController {
  constructor() {
    this.qualityMetrics = {
      title: {
        minLength: 30,
        maxLength: 60,
        optimalLength: 50,
        requiredWords: ['panduan', 'cara', 'tips', 'solusi', 'jasa', 'layanan']
      },
      content: {
        minLength: 800,
        maxLength: 2000,
        optimalLength: 1200,
        minParagraphs: 5,
        requiredSections: ['introduction', 'main', 'tips', 'faq', 'conclusion']
      },
      meta: {
        descriptionMinLength: 120,
        descriptionMaxLength: 160,
        descriptionOptimalLength: 150,
        tagsMinCount: 5,
        tagsMaxCount: 10
      },
      images: {
        minCount: 3,
        maxCount: 8,
        optimalCount: 5,
        requiredAltText: true,
        requiredLoading: 'lazy'
      }
    }
    
    this.seoKeywords = [
      'panduan lengkap', 'cara mudah', 'tips terbaik', 'solusi aman',
      'panduan praktis', 'tutorial lengkap', 'cara benar', 'tips sukses',
      'panduan step by step', 'cara efektif', 'solusi terpercaya', 'panduan 2025'
    ]
    
    this.engagementWords = [
      'rahasia', 'terbaru', 'terpercaya', 'aman', 'cepat', 'mudah',
      'lengkap', 'praktis', 'efektif', 'terbaik', 'populer', 'favorit'
    ]
  }

  // Main quality validation method
  validateContentQuality(blogData) {
    const results = {
      overall: { score: 0, grade: 'F', issues: [] },
      title: this.validateTitle(blogData.title, blogData.originalKeyword),
      content: this.validateContent(blogData.content),
      meta: this.validateMeta(blogData),
      images: this.validateImages(blogData.content),
      seo: this.validateSEO(blogData),
      readability: this.validateReadability(blogData.content)
    }
    
    // Calculate overall score
    results.overall = this.calculateOverallScore(results)
    
    return results
  }

  // Title validation
  validateTitle(title, keyword) {
    const issues = []
    const score = 100
    
    // Length validation
    if (title.length < this.qualityMetrics.title.minLength) {
      issues.push(`Title too short (${title.length} chars, minimum ${this.qualityMetrics.title.minLength})`)
    }
    if (title.length > this.qualityMetrics.title.maxLength) {
      issues.push(`Title too long (${title.length} chars, maximum ${this.qualityMetrics.title.maxLength})`)
    }
    
    // Keyword presence
    if (!title.toLowerCase().includes(keyword.toLowerCase())) {
      issues.push('Title does not contain main keyword')
    }
    
    // SEO optimization
    if (!this.containsSEOKeywords(title)) {
      issues.push('Title lacks SEO-optimized keywords')
    }
    
    // Engagement words
    if (!this.containsEngagementWords(title)) {
      issues.push('Title lacks engagement words')
    }
    
    return {
      score: Math.max(0, score - (issues.length * 15)),
      grade: this.getGrade(score - (issues.length * 15)),
      issues,
      suggestions: this.getTitleSuggestions(title, keyword)
    }
  }

  // Content validation
  validateContent(content) {
    const issues = []
    const score = 100
    
    // Length validation
    const wordCount = this.getWordCount(content)
    if (wordCount < this.qualityMetrics.content.minLength) {
      issues.push(`Content too short (${wordCount} words, minimum ${this.qualityMetrics.content.minLength})`)
    }
    if (wordCount > this.qualityMetrics.content.maxLength) {
      issues.push(`Content too long (${wordCount} words, maximum ${this.qualityMetrics.content.maxLength})`)
    }
    
    // Structure validation
    const structure = this.analyzeContentStructure(content)
    if (structure.paragraphs < this.qualityMetrics.content.minParagraphs) {
      issues.push(`Insufficient paragraphs (${structure.paragraphs}, minimum ${this.qualityMetrics.content.minParagraphs})`)
    }
    
    // Required sections
    const missingSections = this.getMissingSections(content)
    if (missingSections.length > 0) {
      issues.push(`Missing required sections: ${missingSections.join(', ')}`)
    }
    
    // HTML structure
    if (!this.hasProperHTMLStructure(content)) {
      issues.push('Content lacks proper HTML structure')
    }
    
    return {
      score: Math.max(0, score - (issues.length * 12)),
      grade: this.getGrade(score - (issues.length * 12)),
      issues,
      wordCount,
      structure,
      suggestions: this.getContentSuggestions(content)
    }
  }

  // Meta data validation
  validateMeta(blogData) {
    const issues = []
    const score = 100
    
    // Meta description
    if (!blogData.meta_description) {
      issues.push('Missing meta description')
    } else {
      const descLength = blogData.meta_description.length
      if (descLength < this.qualityMetrics.meta.descriptionMinLength) {
        issues.push(`Meta description too short (${descLength} chars)`)
      }
      if (descLength > this.qualityMetrics.meta.descriptionMaxLength) {
        issues.push(`Meta description too long (${descLength} chars)`)
      }
    }
    
    // Tags validation
    if (!blogData.tags || blogData.tags.length < this.qualityMetrics.meta.tagsMinCount) {
      issues.push(`Insufficient tags (${blogData.tags?.length || 0}, minimum ${this.qualityMetrics.meta.tagsMinCount})`)
    }
    if (blogData.tags && blogData.tags.length > this.qualityMetrics.meta.tagsMaxCount) {
      issues.push(`Too many tags (${blogData.tags.length}, maximum ${this.qualityMetrics.meta.tagsMaxCount})`)
    }
    
    return {
      score: Math.max(0, score - (issues.length * 20)),
      grade: this.getGrade(score - (issues.length * 20)),
      issues,
      suggestions: this.getMetaSuggestions(blogData)
    }
  }

  // Image validation
  validateImages(content) {
    const issues = []
    const score = 100
    
    const images = this.extractImages(content)
    
    // Image count
    if (images.length < this.qualityMetrics.images.minCount) {
      issues.push(`Insufficient images (${images.length}, minimum ${this.qualityMetrics.images.minCount})`)
    }
    if (images.length > this.qualityMetrics.images.maxCount) {
      issues.push(`Too many images (${images.length}, maximum ${this.qualityMetrics.images.maxCount})`)
    }
    
    // Image attributes
    const imagesWithoutAlt = images.filter(img => !img.alt)
    if (imagesWithoutAlt.length > 0) {
      issues.push(`${imagesWithoutAlt.length} images missing alt text`)
    }
    
    const imagesWithoutLoading = images.filter(img => !img.loading)
    if (imagesWithoutLoading.length > 0) {
      issues.push(`${imagesWithoutLoading.length} images missing loading attribute`)
    }
    
    return {
      score: Math.max(0, score - (issues.length * 15)),
      grade: this.getGrade(score - (issues.length * 15)),
      issues,
      imageCount: images.length,
      suggestions: this.getImageSuggestions(images)
    }
  }

  // SEO validation
  validateSEO(blogData) {
    const issues = []
    const score = 100
    
    // Keyword density
    const keywordDensity = this.calculateKeywordDensity(blogData.content, blogData.originalKeyword)
    if (keywordDensity < 0.5) {
      issues.push(`Low keyword density (${keywordDensity.toFixed(2)}%, minimum 0.5%)`)
    }
    if (keywordDensity > 3) {
      issues.push(`High keyword density (${keywordDensity.toFixed(2)}%, maximum 3%)`)
    }
    
    // Heading structure
    const headings = this.extractHeadings(blogData.content)
    if (!headings.some(h => h.tag === 'h1')) {
      issues.push('Missing H1 heading')
    }
    if (headings.filter(h => h.tag === 'h2').length < 3) {
      issues.push('Insufficient H2 headings (minimum 3)')
    }
    
    // Internal linking
    const internalLinks = this.extractInternalLinks(blogData.content)
    if (internalLinks.length === 0) {
      issues.push('No internal links found')
    }
    
    return {
      score: Math.max(0, score - (issues.length * 10)),
      grade: this.getGrade(score - (issues.length * 10)),
      issues,
      keywordDensity,
      headingCount: headings.length,
      internalLinkCount: internalLinks.length,
      suggestions: this.getSEOSuggestions(blogData)
    }
  }

  // Readability validation
  validateReadability(content) {
    const issues = []
    const score = 100
    
    // Sentence length
    const avgSentenceLength = this.calculateAverageSentenceLength(content)
    if (avgSentenceLength > 20) {
      issues.push(`Average sentence too long (${avgSentenceLength.toFixed(1)} words, maximum 20)`)
    }
    
    // Paragraph length
    const avgParagraphLength = this.calculateAverageParagraphLength(content)
    if (avgParagraphLength > 150) {
      issues.push(`Average paragraph too long (${avgParagraphLength.toFixed(1)} words, maximum 150)`)
    }
    
    // Reading level
    const readingLevel = this.calculateReadingLevel(content)
    if (readingLevel > 12) {
      issues.push(`Reading level too high (${readingLevel.toFixed(1)}, maximum 12)`)
    }
    
    return {
      score: Math.max(0, score - (issues.length * 15)),
      grade: this.getGrade(score - (issues.length * 15)),
      issues,
      avgSentenceLength,
      avgParagraphLength,
      readingLevel,
      suggestions: this.getReadabilitySuggestions(content)
    }
  }

  // Helper methods
  getWordCount(content) {
    const text = content.replace(/<[^>]*>/g, '')
    return text.split(/\s+/).filter(word => word.length > 0).length
  }

  analyzeContentStructure(content) {
    const paragraphs = (content.match(/<p[^>]*>/g) || []).length
    const headings = (content.match(/<h[1-6][^>]*>/g) || []).length
    const lists = (content.match(/<[uo]l[^>]*>/g) || []).length
    
    return { paragraphs, headings, lists }
  }

  getMissingSections(content) {
    const required = this.qualityMetrics.content.requiredSections
    const found = []
    
    if (content.toLowerCase().includes('pengenalan') || content.toLowerCase().includes('introduction')) {
      found.push('introduction')
    }
    if (content.toLowerCase().includes('cara') || content.toLowerCase().includes('langkah')) {
      found.push('main')
    }
    if (content.toLowerCase().includes('tips') || content.toLowerCase().includes('trik')) {
      found.push('tips')
    }
    if (content.toLowerCase().includes('faq') || content.toLowerCase().includes('pertanyaan')) {
      found.push('faq')
    }
    if (content.toLowerCase().includes('kesimpulan') || content.toLowerCase().includes('conclusion')) {
      found.push('conclusion')
    }
    
    return required.filter(section => !found.includes(section))
  }

  hasProperHTMLStructure(content) {
    return content.includes('<h1') && 
           content.includes('<h2') && 
           content.includes('<p') &&
           content.includes('<ul') || content.includes('<ol')
  }

  extractImages(content) {
    const imgRegex = /<img[^>]*>/g
    const images = []
    let match
    
    while ((match = imgRegex.exec(content)) !== null) {
      const imgTag = match[0]
      const srcMatch = imgTag.match(/src="([^"]*)"/)
      const altMatch = imgTag.match(/alt="([^"]*)"/)
      const loadingMatch = imgTag.match(/loading="([^"]*)"/)
      
      images.push({
        src: srcMatch ? srcMatch[1] : '',
        alt: altMatch ? altMatch[1] : '',
        loading: loadingMatch ? loadingMatch[1] : ''
      })
    }
    
    return images
  }

  calculateKeywordDensity(content, keyword) {
    const text = content.replace(/<[^>]*>/g, '').toLowerCase()
    const keywordLower = keyword.toLowerCase()
    const totalWords = text.split(/\s+/).length
    const keywordCount = (text.match(new RegExp(keywordLower, 'g')) || []).length
    
    return (keywordCount / totalWords) * 100
  }

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

  calculateAverageSentenceLength(content) {
    const text = content.replace(/<[^>]*>/g, '')
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const totalWords = sentences.reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0)
    
    return sentences.length > 0 ? totalWords / sentences.length : 0
  }

  calculateAverageParagraphLength(content) {
    const paragraphs = content.split(/<\/p>/).filter(p => p.trim().length > 0)
    const totalWords = paragraphs.reduce((sum, para) => {
      const text = para.replace(/<[^>]*>/g, '')
      return sum + text.split(/\s+/).length
    }, 0)
    
    return paragraphs.length > 0 ? totalWords / paragraphs.length : 0
  }

  calculateReadingLevel(content) {
    const text = content.replace(/<[^>]*>/g, '')
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = text.split(/\s+/).filter(w => w.length > 0)
    const syllables = words.reduce((sum, word) => sum + this.countSyllables(word), 0)
    
    if (sentences.length === 0 || words.length === 0) return 0
    
    const avgWordsPerSentence = words.length / sentences.length
    const avgSyllablesPerWord = syllables / words.length
    
    return 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59
  }

  countSyllables(word) {
    word = word.toLowerCase()
    if (word.length <= 3) return 1
    
    const vowels = 'aeiouy'
    let count = 0
    let previousWasVowel = false
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i])
      if (isVowel && !previousWasVowel) count++
      previousWasVowel = isVowel
    }
    
    if (word.endsWith('e')) count--
    return Math.max(1, count)
  }

  containsSEOKeywords(text) {
    return this.seoKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  containsEngagementWords(text) {
    return this.engagementWords.some(word => 
      text.toLowerCase().includes(word.toLowerCase())
    )
  }

  getGrade(score) {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  calculateOverallScore(results) {
    const weights = {
      title: 0.2,
      content: 0.3,
      meta: 0.15,
      images: 0.15,
      seo: 0.15,
      readability: 0.05
    }
    
    let totalScore = 0
    let totalWeight = 0
    
    if (weights && typeof weights === 'object') {
      for (const [key, weight] of Object.entries(weights)) {
        if (results[key]) {
          totalScore += results[key].score * weight
          totalWeight += weight
        }
      }
    }
    
    const finalScore = totalWeight > 0 ? totalScore / totalWeight : 0
    
    return {
      score: Math.round(finalScore),
      grade: this.getGrade(finalScore),
      issues: (results && typeof results === 'object')
        ? Object.values(results)
            .filter(r => r && r.issues)
            .flatMap(r => r.issues)
        : []
    }
  }

  // Suggestion methods
  getTitleSuggestions(title, keyword) {
    const suggestions = []
    
    if (title.length < 30) {
      suggestions.push('Add more descriptive words to make title more informative')
    }
    if (title.length > 60) {
      suggestions.push('Shorten title to improve SEO and readability')
    }
    if (!title.toLowerCase().includes(keyword.toLowerCase())) {
      suggestions.push(`Include main keyword "${keyword}" in title`)
    }
    if (!this.containsSEOKeywords(title)) {
      suggestions.push('Add SEO-optimized keywords like "panduan", "cara", or "tips"')
    }
    
    return suggestions
  }

  getContentSuggestions(content) {
    const suggestions = []
    const wordCount = this.getWordCount(content)
    
    if (wordCount < 800) {
      suggestions.push('Add more detailed content to reach minimum 800 words')
    }
    if (wordCount > 2000) {
      suggestions.push('Consider breaking content into multiple articles')
    }
    
    const missingSections = this.getMissingSections(content)
    if (missingSections.length > 0) {
      suggestions.push(`Add missing sections: ${missingSections.join(', ')}`)
    }
    
    return suggestions
  }

  getMetaSuggestions(blogData) {
    const suggestions = []
    
    if (!blogData.meta_description) {
      suggestions.push('Add meta description for better SEO')
    } else if (blogData.meta_description.length < 120) {
      suggestions.push('Expand meta description to at least 120 characters')
    }
    
    if (!blogData.tags || blogData.tags.length < 5) {
      suggestions.push('Add more relevant tags (minimum 5)')
    }
    
    return suggestions
  }

  getImageSuggestions(images) {
    const suggestions = []
    
    if (images.length < 3) {
      suggestions.push('Add more images to improve visual appeal')
    }
    
    const imagesWithoutAlt = images.filter(img => !img.alt)
    if (imagesWithoutAlt.length > 0) {
      suggestions.push('Add alt text to all images for accessibility')
    }
    
    return suggestions
  }

  getSEOSuggestions(blogData) {
    const suggestions = []
    const keywordDensity = this.calculateKeywordDensity(blogData.content, blogData.originalKeyword)
    
    if (keywordDensity < 0.5) {
      suggestions.push(`Increase keyword density for "${blogData.originalKeyword}"`)
    }
    if (keywordDensity > 3) {
      suggestions.push(`Reduce keyword density for "${blogData.originalKeyword}"`)
    }
    
    const headings = this.extractHeadings(blogData.content)
    if (headings.filter(h => h.tag === 'h2').length < 3) {
      suggestions.push('Add more H2 headings to improve structure')
    }
    
    return suggestions
  }

  getReadabilitySuggestions(content) {
    const suggestions = []
    const avgSentenceLength = this.calculateAverageSentenceLength(content)
    const avgParagraphLength = this.calculateAverageParagraphLength(content)
    
    if (avgSentenceLength > 20) {
      suggestions.push('Use shorter sentences for better readability')
    }
    if (avgParagraphLength > 150) {
      suggestions.push('Break long paragraphs into shorter ones')
    }
    
    return suggestions
  }
}

export default ContentQualityController
