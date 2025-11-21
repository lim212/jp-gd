// API endpoint untuk performance monitoring
export default defineEventHandler(async (event) => {
  try {
    const PerformanceOptimizer = (await import('../../utils/performance-optimizer.js')).default
    const optimizer = new PerformanceOptimizer()
    await optimizer.init()
    
    const health = await optimizer.healthCheck()
    const stats = optimizer.getPerformanceStats()
    const recommendations = optimizer.getPerformanceRecommendations()
    
    return {
      status: 'success',
      data: {
        health,
        stats,
        recommendations
      },
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get performance data'
    })
  }
})
