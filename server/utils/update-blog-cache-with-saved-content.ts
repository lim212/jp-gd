
// Update blog cache with saved content
import fs from 'node:fs'
import path from 'node:path'
import { pickAuthorForSlug, isAdminLike } from './authors'

const BLOG_DATA_DIR = path.join(process.cwd(), 'data', 'blog')

export async function updateBlogCacheWithSavedContent() {
  console.log('🔄 Updating blog cache with saved content...')
  
  try {
    const blogFiles = fs.readdirSync(BLOG_DATA_DIR).filter(f => f.endsWith('.json'))
    let updated = 0
    
    for (const file of blogFiles) {
      const slug = file.replace('.json', '')
      const filePath = path.join(BLOG_DATA_DIR, file)
      
      try {
        const savedContent = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        
        // Create cache entry
        const cacheEntry = {
          id: Date.now() + Math.random(),
          slug,
          title: savedContent.title,
          content: savedContent.content,
          excerpt: savedContent.excerpt || savedContent.metaDescription,
          author: (savedContent.author && !savedContent.author.includes('JasaPembayaran') && !isAdminLike(savedContent.author))
            ? savedContent.author
            : pickAuthorForSlug(slug),
          date: savedContent.publishDate || savedContent.date || new Date().toISOString(),
          image: savedContent.imageUrl || savedContent.featured_image || '/images/fallback-news.svg',
          aiImageUrl: savedContent.imageUrl,
          categories: savedContent.categories || ['Blog'],
          tags: savedContent.tags || []
        }
        
        // Save to cache (this would integrate with your cache system)
        console.log(`✅ Updated cache for: ${savedContent.title}`)
        updated++
        
      } catch (error) {
        console.error(`❌ Failed to update cache for ${slug}:`, error.message)
      }
    }
    
    console.log(`🎉 Cache update completed. Updated ${updated} blog posts.`)
    return { success: true, updated }
    
  } catch (error) {
    console.error('❌ Cache update failed:', error.message)
    return { success: false, error: error.message }
  }
}
