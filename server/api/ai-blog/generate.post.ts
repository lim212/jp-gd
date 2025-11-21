// API Endpoint untuk Manual Trigger AI Blog Generation
// POST /api/ai-blog/generate

export default defineEventHandler(async (event) => {
  try {
    // Security: Check for authorization (optional, add your own auth)
    const authHeader = getHeader(event, 'authorization')
    const expectedToken = process.env.ADMIN_API_TOKEN || 'your-secret-token'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return {
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or missing authorization token'
      }
    }

    // Import scheduler
    const { AIContentGenerator } = await import('../../utils/ai-content-generator')
    const generator = new AIContentGenerator()
    
    // Get request body
    const body = await readBody(event)
    const keyword = body.keyword || 'jasa pembayaran paypal'
    const count = Math.min(body.count || 1, 10) // Max 10 at once
    
    console.log(`🚀 Manual generation triggered: ${count} article(s)`)
    console.log(`🔑 Keyword: "${keyword}"`)
    
    const results = []
    
    for (let i = 0; i < count; i++) {
      try {
        // Generate title
        const title = await generator.generateTitle(keyword)
        
        // Generate content
        const content = await generator.generateContent(keyword, title)
        
        results.push({
          success: true,
          keyword,
          title,
          contentLength: content.content.length,
          wordCount: content.content.replace(/<[^>]*>/g, ' ').split(' ').filter(w => w.length > 0).length,
          seo: {
            title: title,
            metaDescription: content.metaDescription,
            tags: content.tags,
            category: content.category
          }
        })
        
        console.log(`✅ Generated ${i + 1}/${count}: "${title}"`)
        
        // Rate limiting
        if (i < count - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000))
        }
        
      } catch (error) {
        results.push({
          success: false,
          keyword,
          error: String(error)
        })
      }
    }
    
    return {
      success: true,
      generated: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    }
    
  } catch (error) {
    console.error('❌ Error in manual generation:', error)
    return {
      success: false,
      error: String(error),
      message: 'Failed to generate articles'
    }
  }
})

