import { defineEventHandler, getQuery, setResponseStatus } from 'h3'
import { listCachedPosts, getPostFromCache } from '../../utils/blog-cache'
import { listGeneratedIndex } from '../../utils/generated-blogs'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const q = (query.q as string || '').trim()
    const limit = Math.max(1, Math.min(50, Number(query.limit) || 12))
    const lang = query.lang as string || 'id'

    if (!q || q.length < 2) {
      return []
    }

    // Get all cached posts
    let allPosts = await listCachedPosts()
    
    // Merge with generated posts
    try {
      const generatedPosts = await listGeneratedIndex()
      if (Array.isArray(generatedPosts) && generatedPosts.length) {
        const map = new Map<string, any>()
        for (const post of allPosts) map.set(post.slug, post)
        for (const post of generatedPosts) {
          map.set(post.slug, {
            id: post.id,
            slug: post.slug,
            title: post.title,
            date: post.date,
            image: post.image,
            excerpt: post.excerpt || post.title
          })
        }
        allPosts = Array.from(map.values())
      }
    } catch {}

    // Search in posts
    const searchTerm = q.toLowerCase()
    const searchResults = allPosts.filter((post: any) => {
      const title = (post.title || '').toLowerCase()
      const excerpt = (post.excerpt || '').toLowerCase()
      const slug = (post.slug || '').toLowerCase()
      
      return title.includes(searchTerm) || 
             excerpt.includes(searchTerm) || 
             slug.includes(searchTerm)
    })

    // Sort by relevance (title matches first, then excerpt, then slug)
    searchResults.sort((a: any, b: any) => {
      const aTitle = (a.title || '').toLowerCase()
      const bTitle = (b.title || '').toLowerCase()
      const aExcerpt = (a.excerpt || '').toLowerCase()
      const bExcerpt = (b.excerpt || '').toLowerCase()
      const aSlug = (a.slug || '').toLowerCase()
      const bSlug = (b.slug || '').toLowerCase()
      
      // Title match gets highest priority
      const aTitleMatch = aTitle.includes(searchTerm)
      const bTitleMatch = bTitle.includes(searchTerm)
      if (aTitleMatch && !bTitleMatch) return -1
      if (!aTitleMatch && bTitleMatch) return 1
      
      // Then excerpt match
      const aExcerptMatch = aExcerpt.includes(searchTerm)
      const bExcerptMatch = bExcerpt.includes(searchTerm)
      if (aExcerptMatch && !bExcerptMatch) return -1
      if (!aExcerptMatch && bExcerptMatch) return 1
      
      // Finally sort by date (newest first)
      return (Date.parse(b.date || '') || 0) - (Date.parse(a.date || '') || 0)
    })

    // Return formatted results for header search
    const results = searchResults.slice(0, limit).map((post: any) => ({
      title: post.title || 'Untitled',
      slug: post.slug || 'untitled',
      date: post.date || post.publish_at || new Date().toISOString(),
      excerpt: post.excerpt || post.title || 'No description available'
    }))

    return results
    
  } catch (error: any) {
    console.error('Search suggest error:', error)
    // Return empty array instead of throwing error to prevent 500
    setResponseStatus(event, 200)
    return []
  }
})
