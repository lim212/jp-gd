// types/analytics.d.ts
export interface PageView {
  visitorId: string
  path: string
  title: string
  referrer?: string
  category?: string
}

export interface Event {
  visitorId: string
  name: string
  properties?: Record<string, unknown>
}
