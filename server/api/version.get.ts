/**
 * 🚀 VERSION API ENDPOINT
 * 
 * Returns current build version info
 * Always fresh, no caching
 */

import { defineEventHandler, setHeader } from 'h3'
import { sanitizeResponse } from '../utils/safe-response'

export default defineEventHandler((event) => {
  // Return immediately with safe response - plain object with primitives only
  // No complex operations, no nested objects
  const buildId = String(Date.now())
  const timestamp = Date.now()
  const version = '2.3.0'
  const env = String(process.env.NODE_ENV || 'production')
  
  // Try to get buildId from config, but don't fail if it doesn't work
  try {
    const config = useRuntimeConfig()
    if (config && config.public && config.public.buildId) {
      const configBuildId = String(config.public.buildId)
      if (configBuildId) {
        // Use config buildId if available
        return {
          buildId: configBuildId,
          timestamp: timestamp,
          version: version,
          env: env
        }
      }
    }
  } catch (e) {
    // Ignore config errors
  }
  
  // Try to set headers, but don't fail if it doesn't work
  try {
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Expires', '0')
    setHeader(event, 'Content-Type', 'application/json')
  } catch (e) {
    // Ignore header errors
  }
  
  // Return plain object with primitives only - no sanitization needed
  return {
    buildId: buildId,
    timestamp: timestamp,
    version: version,
    env: env
  }
})
