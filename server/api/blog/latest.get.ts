// server/api/blog/latest.get.ts
import { defineEventHandler } from 'h3'
import { listCachedPosts } from '../../utils/blog-cache'
import { listGeneratedBlogs } from '../../utils/generated-blogs'

export default defineEventHandler(async (event) => {
  try {
    // Get cached posts
    const cachedPosts = await listCachedPosts()
    
    // Get generated posts
    const generatedPosts = await listGeneratedBlogs()
    
    // Combine and sort by date (latest first)
    const allPosts = [
      ...cachedPosts.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        date: post.date,
        image: post.image,
        excerpt: post.excerpt,
        author: post.author,
        readTime: Math.floor(Math.random() * 10) + 3,
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
        readTime: Math.floor(Math.random() * 10) + 3,
        category: 'Tips'
      }))
    ]
    
    // Sort by date (latest first)
    const latestPosts = allPosts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 24)
    
    return {
      success: true,
      posts: latestPosts
    }
  } catch (error) {
    console.error('Error fetching latest posts:', error)
    return {
      success: false,
      posts: []
    }
  }
})
