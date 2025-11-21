import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  if (import.meta.server) return

  // Prevent double-hit per session tab
  const KEY = 'jp_visitor_hit_sent'
  const HEARTBEAT_KEY = 'jp_visitor_heartbeat_started'

  async function post(action: 'hit' | 'heartbeat') {
    try {
      await $fetch('/api/visitors', {
        method: 'POST',
        body: { action }
      })
    } catch (e) {
      // ignore network errors
      // console.debug('visitors api error', e)
    }
  }

  // Send hit once per tab session
  try {
    if (!sessionStorage.getItem(KEY)) {
      sessionStorage.setItem(KEY, '1')
      post('hit')
    }
  } catch {
    // fallback: still try to post
    post('hit')
  }

  // Start heartbeat at a relaxed interval (every 25s) for a few minutes
  try {
    if (!sessionStorage.getItem(HEARTBEAT_KEY)) {
      sessionStorage.setItem(HEARTBEAT_KEY, '1')
      let count = 0
      const maxBeats = 12 // ~5 minutes
      const id = setInterval(() => {
        count += 1
        if (count > maxBeats) {
          clearInterval(id)
          return
        }
        post('heartbeat')
      }, 25000)
    }
  } catch {
    // ignore
  }
})
