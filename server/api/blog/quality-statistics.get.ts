// API endpoint untuk mendapatkan quality statistics
export default defineEventHandler(async (event) => {
  try {
    // Read quality statistics
    const statsPath = 'data/blog/quality-statistics.json'
    const stats = await readFile(statsPath, 'utf-8')
    
    const statistics = JSON.parse(stats)
    
    // Calculate summary statistics
    const summary = {
      totalDays: statistics.length,
      averageScore: 0,
      totalBlogs: 0,
      passedBlogs: 0,
      failedBlogs: 0,
      recentTrend: []
    }
    
    if (statistics.length > 0) {
      const allScores = statistics.flatMap(day => day.scores || [])
      summary.averageScore = Math.round(
        allScores.reduce((sum, score) => sum + score, 0) / allScores.length
      )
      summary.totalBlogs = statistics.reduce((sum, day) => sum + (day.total || 0), 0)
      summary.passedBlogs = statistics.reduce((sum, day) => sum + (day.passed || 0), 0)
      summary.failedBlogs = statistics.reduce((sum, day) => sum + (day.failed || 0), 0)
      
      // Recent trend (last 7 days)
      summary.recentTrend = statistics.slice(0, 7).map(day => ({
        date: day.date,
        averageScore: day.averageScore,
        total: day.total,
        passed: day.passed,
        failed: day.failed
      }))
    }
    
    return {
      summary,
      dailyStats: statistics
    }
    
  } catch (error) {
    return {
      summary: {
        totalDays: 0,
        averageScore: 0,
        totalBlogs: 0,
        passedBlogs: 0,
        failedBlogs: 0,
        recentTrend: []
      },
      dailyStats: []
    }
  }
})
