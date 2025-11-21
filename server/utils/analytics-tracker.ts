// Analytics Tracker - Auto-track blog performance
// Monitor article views, engagement, and conversions

import { promises as fs } from 'fs'
import path from 'path'

interface ArticleMetrics {
  slug: string
  title: string
  views: number
  uniqueViews: number
  avgTimeOnPage: number
  bounceRate: number
  shares: {
    whatsapp: number
    twitter: number
    facebook: number
    copy: number
  }
  reactions: {
    like: number
    love: number
    useful: number
  }
  bookmarks: number
  conversions: number
  lastViewed: string
  createdAt: string
}

interface PerformanceReport {
  totalArticles: number
  totalViews: number
  avgViewsPerArticle: number
  topPerformers: ArticleMetrics[]
  lowPerformers: ArticleMetrics[]
  avgSEOScore: number
  avgReadTime: number
  totalConversions: number
  conversionRate: number
}

export class AnalyticsTracker {
  private metricsPath: string

  constructor() {
    this.metricsPath = path.join(process.cwd(), 'data/analytics/article-metrics.json')
  }

  /**
   * Track article view
   */
  async trackView(slug: string, userId?: string): Promise<void> {
    try {
      const metrics = await this.loadMetrics()
      
      if (!metrics[slug]) {
        metrics[slug] = this.createEmptyMetrics(slug)
      }
      
      metrics[slug].views++
      metrics[slug].lastViewed = new Date().toISOString()
      
      // Track unique view
      if (userId && !this.isViewedBefore(slug, userId)) {
        metrics[slug].uniqueViews++
        this.markAsViewed(slug, userId)
      }
      
      await this.saveMetrics(metrics)
      
    } catch (error) {
      console.error('❌ Error tracking view:', error)
    }
  }

  /**
   * Track article share
   */
  async trackShare(slug: string, platform: 'whatsapp' | 'twitter' | 'facebook' | 'copy'): Promise<void> {
    try {
      const metrics = await this.loadMetrics()
      
      if (!metrics[slug]) {
        metrics[slug] = this.createEmptyMetrics(slug)
      }
      
      metrics[slug].shares[platform]++
      
      await this.saveMetrics(metrics)
      
      console.log(`📊 Tracked ${platform} share for: ${slug}`)
      
    } catch (error) {
      console.error('❌ Error tracking share:', error)
    }
  }

  /**
   * Track article reaction
   */
  async trackReaction(slug: string, reaction: 'like' | 'love' | 'useful'): Promise<void> {
    try {
      const metrics = await this.loadMetrics()
      
      if (!metrics[slug]) {
        metrics[slug] = this.createEmptyMetrics(slug)
      }
      
      metrics[slug].reactions[reaction]++
      
      await this.saveMetrics(metrics)
      
      console.log(`📊 Tracked ${reaction} for: ${slug}`)
      
    } catch (error) {
      console.error('❌ Error tracking reaction:', error)
    }
  }

  /**
   * Track bookmark
   */
  async trackBookmark(slug: string): Promise<void> {
    try {
      const metrics = await this.loadMetrics()
      
      if (!metrics[slug]) {
        metrics[slug] = this.createEmptyMetrics(slug)
      }
      
      metrics[slug].bookmarks++
      
      await this.saveMetrics(metrics)
      
    } catch (error) {
      console.error('❌ Error tracking bookmark:', error)
    }
  }

  /**
   * Generate performance report
   */
  async generateReport(): Promise<PerformanceReport> {
    try {
      const metrics = await this.loadMetrics()
      const articles = (metrics && typeof metrics === 'object') 
        ? Object.values(metrics) as ArticleMetrics[]
        : []
      
      // Calculate totals
      const totalArticles = articles.length
      const totalViews = articles.reduce((sum, a) => sum + a.views, 0)
      const avgViewsPerArticle = totalArticles > 0 ? totalViews / totalArticles : 0
      
      // Top performers (by views)
      const topPerformers = articles
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)
      
      // Low performers (need optimization)
      const lowPerformers = articles
        .filter(a => a.views > 0)
        .sort((a, b) => a.views - b.views)
        .slice(0, 10)
      
      // Calculate averages
      const avgSEOScore = 85 // Placeholder - integrate with SEO score from blog data
      const avgReadTime = 8 // Placeholder
      const totalConversions = articles.reduce((sum, a) => sum + (a.conversions || 0), 0)
      const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0
      
      const report: PerformanceReport = {
        totalArticles,
        totalViews,
        avgViewsPerArticle,
        topPerformers,
        lowPerformers,
        avgSEOScore,
        avgReadTime,
        totalConversions,
        conversionRate
      }
      
      console.log('\n📊 PERFORMANCE REPORT')
      console.log('='.repeat(60))
      console.log(`Total Articles: ${totalArticles}`)
      console.log(`Total Views: ${totalViews.toLocaleString()}`)
      console.log(`Avg Views/Article: ${avgViewsPerArticle.toFixed(1)}`)
      console.log(`Conversion Rate: ${conversionRate.toFixed(2)}%`)
      console.log('='.repeat(60))
      
      return report
      
    } catch (error) {
      console.error('❌ Error generating report:', error)
      throw error
    }
  }

  /**
   * Track Google Analytics event
   */
  async trackGAEvent(eventName: string, parameters: any): Promise<void> {
    const gaId = process.env.GOOGLE_ANALYTICS_ID
    
    if (!gaId) {
      return // GA not configured
    }

    try {
      // Send to Google Analytics 4
      await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${gaId}&api_secret=${process.env.GA_API_SECRET}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: 'auto-blog-system',
          events: [{
            name: eventName,
            params: parameters
          }]
        })
      })
      
      console.log(`📊 GA Event tracked: ${eventName}`)
      
    } catch (error) {
      console.error('❌ GA tracking error:', error)
    }
  }

  /**
   * Load metrics from file
   */
  private async loadMetrics(): Promise<Record<string, ArticleMetrics>> {
    try {
      await fs.mkdir(path.dirname(this.metricsPath), { recursive: true })
      const content = await fs.readFile(this.metricsPath, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      return {}
    }
  }

  /**
   * Save metrics to file
   */
  private async saveMetrics(metrics: Record<string, ArticleMetrics>): Promise<void> {
    try {
      await fs.mkdir(path.dirname(this.metricsPath), { recursive: true })
      await fs.writeFile(this.metricsPath, JSON.stringify(metrics, null, 2))
    } catch (error) {
      console.error('❌ Error saving metrics:', error)
    }
  }

  /**
   * Create empty metrics object
   */
  private createEmptyMetrics(slug: string): ArticleMetrics {
    return {
      slug,
      title: slug,
      views: 0,
      uniqueViews: 0,
      avgTimeOnPage: 0,
      bounceRate: 0,
      shares: {
        whatsapp: 0,
        twitter: 0,
        facebook: 0,
        copy: 0
      },
      reactions: {
        like: 0,
        love: 0,
        useful: 0
      },
      bookmarks: 0,
      conversions: 0,
      lastViewed: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
  }

  /**
   * Check if user viewed before (simple tracking)
   */
  private isViewedBefore(slug: string, userId: string): boolean {
    // Implement with Redis or database in production
    // For now, simple in-memory check
    return false
  }

  /**
   * Mark user as viewed
   */
  private markAsViewed(slug: string, userId: string): void {
    // Implement with Redis or database
  }

  /**
   * Get top performing articles
   */
  async getTopPerformers(limit: number = 10): Promise<ArticleMetrics[]> {
    const metrics = await this.loadMetrics()
    const articles = (metrics && typeof metrics === 'object')
      ? Object.values(metrics) as ArticleMetrics[]
      : []
    
    return articles
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  }

  /**
   * Get articles needing optimization
   */
  async getArticlesNeedingOptimization(): Promise<ArticleMetrics[]> {
    const metrics = await this.loadMetrics()
    const articles = (metrics && typeof metrics === 'object')
      ? Object.values(metrics) as ArticleMetrics[]
      : []
    
    // Articles with low views after 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    return articles.filter(a => {
      const createdAt = new Date(a.createdAt)
      return createdAt < sevenDaysAgo && a.views < 50
    })
  }
}

export default AnalyticsTracker

