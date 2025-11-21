// composables/useAnalytics.ts
// Analytics tracking for blog articles

import { ref, onMounted } from 'vue'

export const useAnalytics = () => {
  const pageViews = ref<Record<string, number>>({})
  const articleViews = ref<Record<string, number>>({})
  const popularArticles = ref<Array<{ slug: string; views: number; title: string }>>([])

  // Track page view
  const trackPageView = (page: string) => {
    if (typeof window === 'undefined') return

    try {
      // Get existing views from localStorage
      const stored = localStorage.getItem('page_views')
      const views = stored ? JSON.parse(stored) : {}
      
      // Increment view count
      views[page] = (views[page] || 0) + 1
      pageViews.value = views
      
      // Store back to localStorage
      localStorage.setItem('page_views', JSON.stringify(views))
      
      // Send to server analytics (optional)
      sendToAnalytics('pageview', { page, views: views[page] })
    } catch (error) {
      console.error('Error tracking page view:', error)
    }
  }

  // Track article view
  const trackArticleView = (slug: string, title: string) => {
    if (typeof window === 'undefined') return

    try {
      // Get existing article views
      const stored = localStorage.getItem('article_views')
      const views = stored ? JSON.parse(stored) : {}
      
      // Increment view count
      views[slug] = {
        views: (views[slug]?.views || 0) + 1,
        title: title,
        lastViewed: new Date().toISOString()
      }
      
      articleViews.value = views
      
      // Store back to localStorage
      localStorage.setItem('article_views', JSON.stringify(views))
      
      // Update popular articles
      updatePopularArticles()
      
      // Send to server analytics
      sendToAnalytics('article_view', { slug, title, views: views[slug].views })
    } catch (error) {
      console.error('Error tracking article view:', error)
    }
  }

  // Track article read time
  const trackReadTime = (slug: string, seconds: number) => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('article_read_time')
      const readTimes = stored ? JSON.parse(stored) : {}
      
      readTimes[slug] = (readTimes[slug] || 0) + seconds
      
      localStorage.setItem('article_read_time', JSON.stringify(readTimes))
      
      // Send milestone read times to analytics (e.g., 30s, 60s, 120s)
      if (seconds % 30 === 0) {
        sendToAnalytics('read_time_milestone', { slug, seconds: readTimes[slug] })
      }
    } catch (error) {
      console.error('Error tracking read time:', error)
    }
  }

  // Track article share
  const trackShare = (slug: string, platform: string) => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('article_shares')
      const shares = stored ? JSON.parse(stored) : {}
      
      if (!shares[slug]) {
        shares[slug] = {}
      }
      
      shares[slug][platform] = (shares[slug][platform] || 0) + 1
      shares[slug].total = (shares[slug].total || 0) + 1
      
      localStorage.setItem('article_shares', JSON.stringify(shares))
      
      sendToAnalytics('article_share', { slug, platform })
    } catch (error) {
      console.error('Error tracking share:', error)
    }
  }

  // Track search query
  const trackSearch = (query: string, resultsCount: number) => {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem('search_queries')
      const searches = stored ? JSON.parse(stored) : {}
      
      if (!searches[query]) {
        searches[query] = { count: 0, lastSearched: '' }
      }
      
      searches[query].count += 1
      searches[query].lastSearched = new Date().toISOString()
      searches[query].resultsCount = resultsCount
      
      localStorage.setItem('search_queries', JSON.stringify(searches))
      
      sendToAnalytics('search', { query, resultsCount })
    } catch (error) {
      console.error('Error tracking search:', error)
    }
  }

  // Update popular articles list
  const updatePopularArticles = () => {
    try {
      const stored = localStorage.getItem('article_views')
      if (!stored) return
      
      const views = JSON.parse(stored)
      const articles = Object.entries(views)
        .map(([slug, data]: [string, any]) => ({
          slug,
          views: data.views,
          title: data.title
        }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10) // Top 10
      
      popularArticles.value = articles
    } catch (error) {
      console.error('Error updating popular articles:', error)
    }
  }

  // Send analytics to server
  const sendToAnalytics = async (event: string, data: any) => {
    if (typeof window === 'undefined') return

    try {
      // Send to your analytics API
      await $fetch('/api/analytics', {
        method: 'POST',
        body: {
          event,
          data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        }
      }).catch(() => {
        // Silently fail if analytics endpoint doesn't exist
      })
    } catch (error) {
      // Silently fail - analytics should not break the app
    }
  }

  // Get article statistics
  const getArticleStats = (slug: string) => {
    try {
      const viewsStored = localStorage.getItem('article_views')
      const readTimeStored = localStorage.getItem('article_read_time')
      const sharesStored = localStorage.getItem('article_shares')
      
      const views = viewsStored ? JSON.parse(viewsStored)[slug] : null
      const readTime = readTimeStored ? JSON.parse(readTimeStored)[slug] : 0
      const shares = sharesStored ? JSON.parse(sharesStored)[slug] : null
      
      return {
        views: views?.views || 0,
        readTime: readTime || 0,
        shares: shares?.total || 0,
        lastViewed: views?.lastViewed || null
      }
    } catch (error) {
      console.error('Error getting article stats:', error)
      return { views: 0, readTime: 0, shares: 0, lastViewed: null }
    }
  }

  // Get top searches
  const getTopSearches = (limit: number = 10) => {
    try {
      const stored = localStorage.getItem('search_queries')
      if (!stored) return []
      
      const searches = JSON.parse(stored)
      return Object.entries(searches)
        .map(([query, data]: [string, any]) => ({
          query,
          count: data.count,
          lastSearched: data.lastSearched
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting top searches:', error)
      return []
    }
  }

  // Clear analytics data (for GDPR compliance)
  const clearAnalytics = () => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem('page_views')
      localStorage.removeItem('article_views')
      localStorage.removeItem('article_read_time')
      localStorage.removeItem('article_shares')
      localStorage.removeItem('search_queries')
      
      pageViews.value = {}
      articleViews.value = {}
      popularArticles.value = []
    } catch (error) {
      console.error('Error clearing analytics:', error)
    }
  }

  // Initialize - load existing data
  onMounted(() => {
    updatePopularArticles()
  })

  return {
    pageViews,
    articleViews,
    popularArticles,
    trackPageView,
    trackArticleView,
    trackReadTime,
    trackShare,
    trackSearch,
    updatePopularArticles,
    getArticleStats,
    getTopSearches,
    clearAnalytics
  }
}

