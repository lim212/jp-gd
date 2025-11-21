// server/utils/feedback.ts
// Supabase is disabled, using mock implementation
interface Feedback {
  postId: number
  rating: number
  comment?: string
  visitorId: string
  helpful: boolean
}

export async function saveFeedback(feedback: Feedback) {
  console.warn('Supabase is disabled: Feedback storage functionality is not available')

  try {
    // Mock Supabase operation (no actual storage)
    const { error: _error } = await supabase
      .from('post_feedback')
      .insert(feedback)

    // Still try to track the event
    try {
      await trackEvent({
        name: 'Post Feedback Submitted',
        visitorId: feedback.visitorId,
        properties: {
          postId: feedback.postId,
          rating: feedback.rating,
          helpful: feedback.helpful
        }
      })
    } catch (e) {
      console.warn('Failed to track feedback event:', e)
    }

    // Return success even though data wasn't stored
    return true
  } catch (e) {
    console.error('Error in saveFeedback:', e)
    // Don't throw error to prevent breaking the user experience
    return false
  }
}
