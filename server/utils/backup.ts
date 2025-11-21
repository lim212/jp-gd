// server/utils/backup.ts
// Supabase disabled due to bugs and issues
// import { createClient } from '@supabase/supabase-js'
import type { BlogPost } from '~/types/blog'

// Disabled Supabase client initialization
// if (!process.env.SUPABASE_URL) {
//   throw new Error('SUPABASE_URL is not defined in environment variables')
// }

// if (!process.env.SUPABASE_KEY) {
//   throw new Error('SUPABASE_KEY is not defined in environment variables')
// }

// const supabase = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_KEY
// )

// Mock Supabase client for compatibility
const supabase = {
  from: () => ({
    insert: () => Promise.resolve({ error: null }),
    select: () => ({
      eq: () => ({
        order: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null })
      })
    }),
    update: () => ({
      eq: () => Promise.resolve({ error: null })
    })
  })
}

interface BackupRecord {
  id: number
  post_id: number
  content: string
  title: string
  excerpt: string
  image?: string
  backup_date: string
}

export async function backupPost(post: BlogPost) {
  // Supabase is disabled, log warning and create a local backup object
  console.warn('Supabase is disabled: Post backup functionality is not available')

  const backup: BackupRecord = {
    post_id: post.id,
    content: post.content,
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    backup_date: new Date().toISOString()
  }

  // Mock the Supabase operation (no actual storage)
  const { error: _error } = await supabase
    .from('blog_backups')
    .insert(backup)

  // Still log the event for tracking purposes
  try {
    await logEvent('post_backup_created', {
      postId: post.id,
      backupDate: backup.backup_date
    })
  } catch (e) {
    console.warn('Failed to log backup event:', e)
  }

  // Return the backup object for potential local use
  return backup
}

export async function getBackups(postId: number): Promise<BackupRecord[]> {
  console.warn('Supabase is disabled: Cannot retrieve post backups')

  // Mock the Supabase operation (returns empty array)
  const { data, error: _error } = await supabase
    .from('blog_backups')
    .select('*')
    .eq('post_id', postId)
    .order('backup_date', { ascending: false })

  // Return empty array since Supabase is disabled
  return data || []
}

export async function restoreFromBackup(backupId: number): Promise<BlogPost> {
  console.warn('Supabase is disabled: Cannot restore from backup')

  // Mock the Supabase operation (returns null)
  const { data: backup, error: _error } = await supabase
    .from('blog_backups')
    .select('*')
    .eq('id', backupId)
    .single()

  // Since Supabase is disabled, we can't retrieve the actual backup
  // Return a placeholder response or throw an error based on your application needs
  if (!backup) {
    throw new Error('Backup functionality is disabled')
  }

  // This code will not be reached in the current implementation
  // but is kept for reference in case Supabase is re-enabled
  try {
    // WordPress integration removed - backup data is for reference only
    const restored = await updatePost(backup.post_id, {
      title: backup.title,
      content: backup.content,
      excerpt: backup.excerpt,
      featuredImage: backup.image
    })

    try {
      await logEvent('post_restored_from_backup', {
        postId: backup.post_id,
        backupId: backup.id
      })
    } catch (e) {
      console.warn('Failed to log restore event:', e)
    }

    return restored
  } catch (e) {
    console.error('Failed to restore from backup:', e)
    throw new Error('Restore functionality is disabled')
  }
}
