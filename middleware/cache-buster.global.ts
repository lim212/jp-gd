/**
 * Global Cache Buster Middleware
 * Redirect ke URL dengan unique cache path
 */

export default defineNuxtRouteMiddleware((to, from) => {
  // Only run on client side
  if (process.client) {
    const now = new Date()
    const cacheKey = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
    
    // Check if URL already has cache param
    if (!to.query._v && !to.query._nocache) {
      return navigateTo({
        path: to.path,
        query: { ...to.query, _v: cacheKey },
        hash: to.hash
      }, { redirectCode: 302 })
    }
  }
})

