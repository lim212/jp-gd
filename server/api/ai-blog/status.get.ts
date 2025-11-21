// API Endpoint untuk Monitor Status AI Blog Scheduler
// GET /api/ai-blog/status

import { promises as fs } from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Read rotation data
    let rotation: any = null
    try {
      const rotationPath = path.join(process.cwd(), 'data/keyword-rotation.json')
      const content = await fs.readFile(rotationPath, 'utf-8')
      rotation = JSON.parse(content)
    } catch (error) {
      rotation = { error: 'No rotation data found' }
    }

    // Read generated blogs count
    let totalBlogs = 0
    try {
      const blogsPath = path.join(process.cwd(), 'database/content/generated-blogs.json')
      const content = await fs.readFile(blogsPath, 'utf-8')
      const blogs = JSON.parse(content)
      totalBlogs = blogs.length
    } catch (error) {
      totalBlogs = 0
    }

    // Read latest blog
    let latestBlog: any = null
    try {
      const latestPath = path.join(process.cwd(), 'data/blog/latest-posts.json')
      const content = await fs.readFile(latestPath, 'utf-8')
      const posts = JSON.parse(content)
      latestBlog = posts[0] || null
    } catch (error) {
      latestBlog = null
    }

    // System info
    const isEnabled = process.env.NUXT_ENABLE_AI_BLOG === 'true' || process.env.NUXT_ENABLE_AUTO_BLOG === 'true'
    const hasOpenAIKey = !!(process.env.OPENAI_API_KEY || process.env.NUXT_OPENAI_API_KEY)
    
    // Calculate next run time
    const now = new Date()
    const nextRun = new Date(now)
    nextRun.setHours(3, 0, 0, 0)
    if (nextRun <= now) {
      nextRun.setDate(nextRun.getDate() + 1)
    }
    
    const timeUntilNextRun = nextRun.getTime() - now.getTime()
    const hoursUntilNextRun = (timeUntilNextRun / 1000 / 60 / 60).toFixed(1)

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      scheduler: {
        enabled: isEnabled,
        hasAIKey: hasOpenAIKey,
        aiModel: 'gpt-4o-mini',
        nextRunTime: nextRun.toISOString(),
        hoursUntilNextRun: parseFloat(hoursUntilNextRun),
        lastRunDate: rotation?.lastRunDate || 'Never'
      },
      rotation: {
        currentIndex: rotation?.index || 0,
        totalKeywords: rotation?.totalKeywords || 0,
        dailyTarget: rotation?.dailyCount || 10,
        totalGenerated: rotation?.totalGenerated || 0,
        currentDay: rotation?.currentDay || 0,
        progress: rotation?.totalKeywords > 0 
          ? `${((rotation.index / rotation.totalKeywords) * 100).toFixed(1)}%`
          : '0%'
      },
      database: {
        totalBlogs,
        latestBlog: latestBlog ? {
          title: latestBlog.title,
          slug: latestBlog.slug,
          date: latestBlog.date
        } : null
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version,
        uptime: process.uptime()
      }
    }
  } catch (error) {
    return {
      status: 'error',
      error: String(error),
      timestamp: new Date().toISOString()
    }
  }
})

