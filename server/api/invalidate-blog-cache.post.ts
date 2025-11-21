
// Invalidate blog cache to force reading from saved content
import { defineEventHandler } from 'h3'
import { useStorage } from '#imports'

export default defineEventHandler(async (event) => {
  const storage = useStorage()
  
  try {
    // Invalidate all blog-related caches
    await storage.removeItem('blog:list:*')
    await storage.removeItem('blog:post:*')
    await storage.removeItem('blog:popular:*')
    await storage.removeItem('blog:latest:*')
    
    return { success: true, message: 'Blog cache invalidated successfully' }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
