// server/routes/sitemap.get.ts
import { defineEventHandler, sendRedirect } from 'h3'

// Redirect /sitemap to the single canonical sitemap URL
export default defineEventHandler((event) => {
  return sendRedirect(event, '/sitemap.xml', 301)
})
