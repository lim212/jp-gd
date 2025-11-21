// Enhanced Image Generator - Multiple Sources with Quality Control
class EnhancedImageGenerator {
  constructor() {
    this.imageServices = [
      'pollinations',
      'unsplash', 
      'picsum',
      'placeholder',
      'dummy'
    ]
    
    this.imagePrompts = {
      business: [
        'professional business meeting, modern office, team collaboration, natural lighting, high quality photography',
        'business handshake, professional environment, trust and reliability, corporate setting, authentic moment',
        'digital payment concept, modern technology, secure transaction, professional photography, clean background',
        'customer service, professional support, modern office, team working, natural lighting, authentic interaction'
      ],
      technology: [
        'modern technology interface, digital payment system, clean design, professional photography, high quality',
        'smartphone with payment app, modern technology, digital lifestyle, professional photography, natural lighting',
        'computer screen showing payment interface, modern workspace, technology concept, professional photography',
        'digital security concept, encryption technology, modern design, professional photography, clean background'
      ],
      lifestyle: [
        'happy customer using digital service, modern lifestyle, natural environment, professional photography',
        'person using mobile payment, modern lifestyle, authentic moment, natural lighting, professional photography',
        'successful business transaction, celebration moment, modern environment, professional photography',
        'digital nomad lifestyle, modern technology, remote work, professional photography, natural setting'
      ],
      abstract: [
        'abstract digital payment concept, modern design, clean background, professional photography, high quality',
        'geometric patterns representing security, modern abstract design, professional photography, clean background',
        'flowing lines representing digital transactions, modern abstract art, professional photography, high quality',
        'colorful abstract background, modern design, professional photography, clean and minimal'
      ]
    }
    
    this.imageSizes = {
      featured: { width: 1200, height: 630 }, // Facebook/Twitter optimal
      blog: { width: 800, height: 400 },      // Blog content optimal
      thumbnail: { width: 300, height: 200 }, // Thumbnail optimal
      square: { width: 600, height: 600 }     // Instagram optimal
    }
  }

  // Main image generation method with fallback system
  async generateImage(title, keyword, type = 'featured') {
    const size = this.imageSizes[type] || this.imageSizes.featured
    const prompt = this.generateImagePrompt(title, keyword)
    
    console.log(`🎨 Generating ${type} image for "${keyword}" with prompt: ${prompt}`)
    
    // Try multiple services with fallback
    const services = this.getServiceOrder(keyword)
    
    for (const service of services) {
      try {
        const imageUrl = await this.generateWithService(service, prompt, keyword, size)
        if (imageUrl && await this.validateImageUrl(imageUrl)) {
          console.log(`✅ Generated image with ${service}: ${imageUrl}`)
          return imageUrl
        }
      } catch (error) {
        console.warn(`⚠️ ${service} failed for "${keyword}":`, error.message)
        continue
      }
    }
    
    // Final fallback to dummy image
    console.log(`🔄 All services failed, using dummy image for "${keyword}"`)
    return this.getDummyImage(keyword)
  }

  // Generate contextual image prompt based on keyword and title
  generateImagePrompt(title, keyword) {
    const keywordLower = keyword.toLowerCase()
    const titleLower = title.toLowerCase()
    
    // Determine image category based on keyword
    let category = 'business'
    if (keywordLower.includes('paypal') || keywordLower.includes('payment')) {
      category = 'technology'
    } else if (keywordLower.includes('bitcoin') || keywordLower.includes('crypto')) {
      category = 'technology'
    } else if (keywordLower.includes('netflix') || keywordLower.includes('streaming')) {
      category = 'lifestyle'
    } else if (keywordLower.includes('domain') || keywordLower.includes('hosting')) {
      category = 'technology'
    }
    
    // Select prompt from category
    const prompts = this.imagePrompts[category]
    const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)]
    
    // Enhance prompt with keyword context
    let enhancedPrompt = selectedPrompt
    if (keywordLower.includes('jasa') || keywordLower.includes('service')) {
      enhancedPrompt += ', service provider, professional team, customer satisfaction'
    }
    if (keywordLower.includes('aman') || keywordLower.includes('secure')) {
      enhancedPrompt += ', security concept, trust and safety, protection'
    }
    if (keywordLower.includes('cepat') || keywordLower.includes('fast')) {
      enhancedPrompt += ', speed and efficiency, quick service, modern technology'
    }
    
    return enhancedPrompt
  }

  // Get service order based on keyword (for consistency)
  getServiceOrder(keyword) {
    const hash = this.hashString(keyword)
    const shuffled = [...this.imageServices]
    
    // Shuffle based on keyword hash for consistency
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = (hash + i) % (i + 1)
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    return shuffled
  }

  // Generate image with specific service
  async generateWithService(service, prompt, keyword, size) {
    switch (service) {
      case 'pollinations':
        return this.generatePollinationsImage(prompt, keyword, size)
      case 'unsplash':
        return this.generateUnsplashImage(keyword, size)
      case 'picsum':
        return this.generatePicsumImage(keyword, size)
      case 'placeholder':
        return this.generatePlaceholderImage(keyword, size)
      case 'dummy':
        return this.getDummyImage(keyword)
      default:
        throw new Error(`Unknown service: ${service}`)
    }
  }

  // Pollinations AI Image Generation
  async generatePollinationsImage(prompt, keyword, size) {
    const cleanPrompt = prompt
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    
    const encoded = encodeURIComponent(cleanPrompt)
    const seed = this.hashString(keyword)
    
    const params = new URLSearchParams({
      prompt: cleanPrompt,
      seed: seed.toString(),
      width: size.width.toString(),
      height: size.height.toString(),
      nologo: 'true',
      enhance: 'true',
      model: 'flux'
    })
    
    return `https://image.pollinations.ai/prompt/${encoded}?${params.toString()}`
  }

  // Unsplash Image Generation
  async generateUnsplashImage(keyword, size) {
    const cleanKeyword = keyword
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ',')
      .trim()
    
    const seed = this.hashString(keyword)
    
    return `https://source.unsplash.com/${size.width}x${size.height}/?${encodeURIComponent(cleanKeyword)}&sig=${seed}`
  }

  // Picsum Random Image Generation
  async generatePicsumImage(keyword, size) {
    const seed = this.hashString(keyword)
    return `https://picsum.photos/seed/${seed}/${size.width}/${size.height}`
  }

  // Placeholder Image Generation
  async generatePlaceholderImage(keyword, size) {
    const text = keyword.replace(/[^\w\s]/g, '').substring(0, 20)
    const encodedText = encodeURIComponent(text)
    
    return `https://via.placeholder.com/${size.width}x${size.height}/4F46E5/FFFFFF?text=${encodedText}`
  }

  // Dummy Image Fallback
  getDummyImage(keyword) {
    const dummyNumber = (this.hashString(keyword) % 100) + 1
    return `/images/dummy/dummy-${dummyNumber}.jpg`
  }

  // Validate image URL accessibility
  async validateImageUrl(url) {
    try {
      const response = await fetch(url, { method: 'HEAD', timeout: 5000 })
      return response.ok
    } catch (error) {
      return false
    }
  }

  // Generate multiple image sizes for different use cases
  async generateImageSet(title, keyword) {
    const imageSet = {}
    
    const types = ['featured', 'blog', 'thumbnail', 'square']
    
    for (const type of types) {
      try {
        imageSet[type] = await this.generateImage(title, keyword, type)
        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.warn(`Failed to generate ${type} image:`, error.message)
        imageSet[type] = this.getDummyImage(keyword)
      }
    }
    
    return imageSet
  }

  // Generate social media optimized images
  async generateSocialImages(title, keyword) {
    const socialSizes = {
      facebook: { width: 1200, height: 630 },
      twitter: { width: 1200, height: 675 },
      linkedin: { width: 1200, height: 627 },
      instagram: { width: 1080, height: 1080 }
    }
    
    const socialImages = {}
    
    for (const [platform, size] of Object.entries(socialSizes)) {
      try {
        socialImages[platform] = await this.generateImage(title, keyword, size)
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.warn(`Failed to generate ${platform} image:`, error.message)
        socialImages[platform] = this.getDummyImage(keyword)
      }
    }
    
    return socialImages
  }

  // Hash function for consistent results
  hashString(input) {
    let h = 2166136261 >>> 0
    for (let i = 0; i < input.length; i++) { 
      h ^= input.charCodeAt(i); 
      h = Math.imul(h, 16777619) 
    }
    return h >>> 0
  }

  // Generate image with specific style
  async generateStyledImage(keyword, style = 'professional') {
    const stylePrompts = {
      professional: 'professional business photo, modern office, clean background, high quality photography',
      modern: 'modern minimalist design, clean lines, contemporary style, professional photography',
      creative: 'creative abstract design, artistic composition, modern art style, professional photography',
      corporate: 'corporate business environment, professional team, modern office, high quality photography'
    }
    
    const basePrompt = stylePrompts[style] || stylePrompts.professional
    const enhancedPrompt = `${basePrompt}, ${keyword} concept, natural lighting, authentic moment`
    
    return this.generateImage(enhancedPrompt, keyword, 'featured')
  }

  // Batch generate images for multiple keywords
  async generateBatchImages(keywords, type = 'featured') {
    const results = {}
    
    for (const keyword of keywords) {
      try {
        results[keyword] = await this.generateImage(keyword, keyword, type)
        // Rate limiting between requests
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        console.error(`Failed to generate image for ${keyword}:`, error.message)
        results[keyword] = this.getDummyImage(keyword)
      }
    }
    
    return results
  }
}

export default EnhancedImageGenerator
