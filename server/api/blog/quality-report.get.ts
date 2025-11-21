// API endpoint untuk mendapatkan quality report blog
export default defineEventHandler(async (event) => {
  try {
    const { slug } = getQuery(event)
    
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug parameter is required'
      })
    }
    
    // Read quality report
    const reportPath = `data/blog/quality-reports/${slug}-quality.json`
    const report = await readFile(reportPath, 'utf-8')
    
    return JSON.parse(report)
    
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Quality report not found'
    })
  }
})
