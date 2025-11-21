// server/utils/analytics.ts
import { Analytics } from '@segment/analytics-node'
import type { PageView, Event } from '~/types/analytics'

const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY!
})

export async function trackPageView(pageView: PageView) {
  return analytics.track({
    event: 'Page Viewed',
    anonymousId: pageView.visitorId,
    properties: {
      path: pageView.path,
      title: pageView.title,
      referrer: pageView.referrer,
      category: pageView.category,
      timestamp: new Date()
    }
  })
}

export async function trackEvent(event: Event) {
  return analytics.track({
    event: event.name,
    anonymousId: event.visitorId,
    properties: {
      ...event.properties,
      timestamp: new Date()
    }
  })
}
