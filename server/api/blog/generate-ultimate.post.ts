// API endpoint untuk generate blog dengan Ultimate System
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { keyword, contentType = 'beginner', options = {} } = body
    
    if (!keyword) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Keyword is required'
      })
    }
    
    const UltimateBlogSystem = (await import('../../utils/ultimate-blog-system.js')).default
    const system = new UltimateBlogSystem()
    await system.init()
    
    const keywordData = {
      id: Date.now(),
      keyword: keyword
    }
    
    const blog = await system.generateUltimateBlog(keywordData)
    
    return {
      status: 'success',
      data: blog,
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to generate blog: ${error.message}`
    })
  }
})
