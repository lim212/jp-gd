
// Migrate existing cache to use saved blog content
import fs from 'node:fs'
import path from 'node:path'
import { getPostFromCache, savePostToCache } from '../utils/blog-cache'
import { pickAuthorForSlug, isAdminLike } from './authors'

const BLOG_DATA_DIR = path.join(process.cwd(), 'data', 'blog')

export async function migrateCacheToSavedContent() {
  console.log('🔄 Migrating cache to use saved blog content...')
  
  try {
    const blogFiles = fs.readdirSync(BLOG_DATA_DIR).filter(f => f.endsWith('.json'))
    let migrated = 0
    
    for (const file of blogFiles) {
      const slug = file.replace('.json', '')
      const filePath = path.join(BLOG_DATA_DIR, file)
      
      try {
        const savedContent = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        
        // Update cache with saved content
        const cachedPost = {
          id: Date.now(),
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
        
        await savePostToCache(cachedPost)
        migrated++
        console.log(`✅ Migrated: ${savedContent.title}`)
        
      } catch (error) {
        console.error(`❌ Failed to migrate ${slug}:`, error.message)
      }
    }
    
    console.log(`🎉 Migration completed. Migrated ${migrated} blog posts.`)
    return { success: true, migrated }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    return { success: false, error: error.message }
  }
}
