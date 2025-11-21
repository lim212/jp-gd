// server/utils/moderationQueue.ts
import type { BlogPost } from '~/types/blog'

// Supabase is disabled, using mock implementation
interface QueuedContent {
  id: string
  postId: number
  title: string
  content: string
  source: 'regeneration' | 'user' | 'api'
  timestamp: number
  status: 'pending' | 'approved' | 'rejected'
}

export async function addToModerationQueue(
  content: Partial<BlogPost>,
  source: QueuedContent['source']
): Promise<string> {
  console.warn('Supabase is disabled: Moderation queue functionality is not available')

  const queueId = randomUUID()

  const queued: QueuedContent = {
    id: queueId,
    postId: content.id!,
    title: content.title!,
    content: content.content!,
    source,
    timestamp: Date.now(),
    status: 'pending'
  }

  // Mock Supabase operation (no actual storage)
  try {
    await supabase
      .from('moderation_queue')
      .insert(queued)
  } catch (e) {
    console.warn('Failed to add to moderation queue:', e)
  }

  // Still try to notify moderators
  try {
    await sendEmail(
      process.env.MODERATOR_EMAIL!,
      'moderationRequired',
      {
        title: queued.title,
        source: queued.source,
        reviewUrl: `${process.env.SITE_URL}/admin/moderation/${queueId}`
      }
    )
  } catch (e) {
    console.warn('Failed to send moderation email:', e)
  }

  return queueId
}

export async function processQueueItem(
  queueId: string,
  approve: boolean,
  moderatorNotes?: string
) {
  console.warn('Supabase is disabled: Moderation queue processing is not available')

  try {
    // Mock Supabase operation (returns null with disabled Supabase)
    const { data: queued } = await supabase
      .from('moderation_queue')
      .select('*')
      .eq('id', queueId)
      .single()

    // Since Supabase is disabled, queued will be null
    if (!queued) {
      console.warn(`Queue item ${queueId} not found (Supabase disabled)`)
      throw new Error('Moderation queue functionality is disabled')
    }

    // This code will not be reached in the current implementation
    // but is kept for reference in case Supabase is re-enabled
    if (approve) {
      try {
        // Update post with approved content
        await updatePost(queued.postId, {
          content: queued.content,
          title: queued.title
        })
      } catch (e) {
        console.warn('Failed to update post:', e)
      }

      try {
        // Send notification
        await sendEmail(
          process.env.ADMIN_EMAIL!,
          'contentApproved',
          {
            title: queued.title,
            postUrl: `${process.env.SITE_URL}/blog/${queued.postId}`
          }
        )
      } catch (e) {
        console.warn('Failed to send approval email:', e)
      }
    }

    try {
      // Mock update queue status
      await supabase
        .from('moderation_queue')
        .update({
          status: approve ? 'approved' : 'rejected',
          moderatorNotes
        })
        .eq('id', queueId)
    } catch (e) {
      console.warn('Failed to update moderation queue status:', e)
    }
  } catch (e) {
    console.error('Error in processQueueItem:', e)
    throw new Error('Moderation queue functionality is disabled')
  }
}
