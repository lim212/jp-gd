// Duplicate Content Checker
// Detect similar content to prevent Google penalty

export class DuplicateChecker {
  /**
   * Calculate text similarity using Jaccard index
   */
  calculateSimilarity(text1: string, text2: string): number {
    // Clean and tokenize
    const tokens1 = this.tokenize(text1)
    const tokens2 = this.tokenize(text2)
    
    // Calculate Jaccard similarity
    const set1 = new Set(tokens1)
    const set2 = new Set(tokens2)
    
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    const similarity = intersection.size / union.size
    
    return similarity
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/<[^>]*>/g, ' ') // Remove HTML
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(word => word.length > 3) // Keep words > 3 chars
  }

  /**
   * Check if content is duplicate
   */
  async checkDuplicate(newContent: string, existingContents: string[], threshold: number = 0.8): Promise<{ isDuplicate: boolean, similarityScore: number, matchedIndex: number }> {
    let maxSimilarity = 0
    let matchedIndex = -1
    
    for (let i = 0; i < existingContents.length; i++) {
      const similarity = this.calculateSimilarity(newContent, existingContents[i])
      
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity
        matchedIndex = i
      }
      
      // Early exit if very similar
      if (similarity > threshold) {
        break
      }
    }
    
    const isDuplicate = maxSimilarity > threshold
    
    if (isDuplicate) {
      console.warn(`⚠️ Duplicate detected! Similarity: ${(maxSimilarity * 100).toFixed(1)}%`)
    } else {
      console.log(`✅ Content unique (similarity: ${(maxSimilarity * 100).toFixed(1)}%)`)
    }
    
    return {
      isDuplicate,
      similarityScore: maxSimilarity,
      matchedIndex
    }
  }

  /**
   * Advanced similarity using n-grams
   */
  calculateNGramSimilarity(text1: string, text2: string, n: number = 3): number {
    const ngrams1 = this.generateNGrams(text1, n)
    const ngrams2 = this.generateNGrams(text2, n)
    
    const set1 = new Set(ngrams1)
    const set2 = new Set(ngrams2)
    
    const intersection = new Set([...set1].filter(x => set2.has(x)))
    const union = new Set([...set1, ...set2])
    
    return intersection.size / union.size
  }

  /**
   * Generate n-grams from text
   */
  private generateNGrams(text: string, n: number): string[] {
    const words = this.tokenize(text)
    const ngrams: string[] = []
    
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.push(words.slice(i, i + n).join(' '))
    }
    
    return ngrams
  }

  /**
   * Check plagiarism against existing database
   */
  async checkAgainstDatabase(newContent: string, databasePath: string): Promise<{ isOriginal: boolean, maxSimilarity: number }> {
    try {
      const { promises: fs } = await import('fs')
      const path = await import('path')
      
      // Read existing blogs
      const dbPath = path.join(process.cwd(), databasePath)
      const content = await fs.readFile(dbPath, 'utf-8')
      const existingBlogs = JSON.parse(content)
      
      // Check against all existing
      const existingContents = existingBlogs.map((blog: any) => blog.content || '')
      
      const result = await this.checkDuplicate(newContent, existingContents, 0.7)
      
      return {
        isOriginal: !result.isDuplicate,
        maxSimilarity: result.similarityScore
      }
      
    } catch (error) {
      console.error('❌ Error checking database:', error)
      return { isOriginal: true, maxSimilarity: 0 }
    }
  }

  /**
   * Calculate content uniqueness score
   */
  calculateUniquenessScore(text: string, existingTexts: string[]): number {
    if (existingTexts.length === 0) return 100
    
    let totalSimilarity = 0
    
    for (const existing of existingTexts) {
      totalSimilarity += this.calculateSimilarity(text, existing)
    }
    
    const avgSimilarity = totalSimilarity / existingTexts.length
    const uniqueness = (1 - avgSimilarity) * 100
    
    return Math.max(0, Math.min(100, uniqueness))
  }

  /**
   * Detect keyword stuffing
   */
  detectKeywordStuffing(content: string, keyword: string): { isStuffed: boolean, density: number } {
    const cleanContent = content.toLowerCase().replace(/<[^>]*>/g, ' ')
    const words = cleanContent.split(/\s+/).filter(w => w.length > 0)
    const keywordLower = keyword.toLowerCase()
    
    const keywordCount = words.filter(word => word.includes(keywordLower)).length
    const density = (keywordCount / words.length) * 100
    
    // Google recommends 1-2% keyword density
    const isStuffed = density > 3
    
    if (isStuffed) {
      console.warn(`⚠️ Keyword stuffing detected! Density: ${density.toFixed(2)}%`)
    } else {
      console.log(`✅ Keyword density optimal: ${density.toFixed(2)}%`)
    }
    
    return { isStuffed, density }
  }

  /**
   * Validate content quality
   */
  validateContent(content: string, title: string): { isValid: boolean, issues: string[], score: number } {
    const issues: string[] = []
    let score = 100
    
    // Check minimum length
    const wordCount = content.split(/\s+/).length
    if (wordCount < 500) {
      issues.push('Content too short (<500 words)')
      score -= 30
    }
    
    // Check title presence
    if (!content.includes(title)) {
      issues.push('Title not found in content')
      score -= 10
    }
    
    // Check heading structure
    if (!content.includes('<h2>')) {
      issues.push('Missing H2 headings')
      score -= 20
    }
    
    // Check lists
    if (!content.includes('<ul>') && !content.includes('<ol>')) {
      issues.push('Missing bullet points or numbered lists')
      score -= 10
    }
    
    // Check paragraphs
    const paragraphCount = (content.match(/<p>/g) || []).length
    if (paragraphCount < 5) {
      issues.push('Too few paragraphs')
      score -= 10
    }
    
    // Check images
    if (!content.includes('<img') && !content.includes('featured_image')) {
      issues.push('No images found')
      score -= 10
    }
    
    const isValid = score >= 70
    
    return { isValid, issues, score }
  }
}

export default DuplicateChecker

