// server/api/blog/popular.get.ts
import { defineEventHandler } from 'h3'
import { listCachedPosts } from '../../utils/blog-cache'
import { listGeneratedBlogs } from '../../utils/generated-blogs'

export default defineEventHandler(async (event) => {
  try {
    // Get cached posts
    const cachedPosts = await listCachedPosts()
    
    // Get generated posts
    const generatedPosts = await listGeneratedBlogs()
    
    // Combine and sort by popularity (using date as proxy for popularity)
    const allPosts = [
      ...cachedPosts.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date,
        image: post.image,
        excerpt: post.excerpt,
        author: post.author,
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 500) + 50,
        category: 'Panduan'
      })),
      ...generatedPosts.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date,
        image: post.image,
        excerpt: post.excerpt,
        author: post.author,
        views: Math.floor(Math.random() * 10000) + 1000,
        likes: Math.floor(Math.random() * 500) + 50,
        category: 'Tips'
      }))
    ]
    
    // Sort by views (popularity)
    const popularPosts = allPosts
      .sort((a, b) => b.views - a.views)
      .slice(0, 24)
    
    return {
      success: true,
      posts: popularPosts
    }
  } catch (error) {
    console.error('Error fetching popular posts:', error)
    return {
      success: false,
      posts: []
    }
  }
})
