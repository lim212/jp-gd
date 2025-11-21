// plugins/analytics.ts
import { useCookie } from '#imports'

function fallbackUUID() {
  // Basic RFC4122-ish fallback (not cryptographically strong)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default defineNuxtPlugin(() => {
  const visitorCookie = useCookie<string>('visitor_id')
  const newId = (globalThis.crypto?.randomUUID?.() ?? fallbackUUID())
  if (!visitorCookie.value) {
    visitorCookie.value = newId
  }
  const visitorId = visitorCookie.value as string

  return {
    provide: {
      analytics: {
        trackPage: async (path: string, title: string, category?: string) => {
          await $fetch('/api/analytics/pageview', {
            method: 'POST',
            body: {
              visitorId,
              path,
              title,
              category,
              referrer: typeof document !== 'undefined' ? document.referrer : ''
            }
          })
        },
        trackEvent: async (name: string, properties: Record<string, any>) => {
          await $fetch('/api/analytics/event', {
            method: 'POST',
            body: {
              visitorId,
              name,
              properties
            }
          })
        }
      }
    }
  }
})
