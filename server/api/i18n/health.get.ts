import { defineEventHandler } from 'h3'
import { readFile, access } from 'fs/promises'
import { join } from 'path'

/**
 * GET /api/i18n/health
 * Health check endpoint for translation system
 * Verifies all required files and configurations
 */
export default defineEventHandler(async (event) => {
  const checks: Record<string, any> = {}
  let healthy = true

  // Check 1: API Key configured
  const hasApiKey = Boolean(
    process.env.OPENAI_API_KEY || 
    process.env.CHATGPT_API_KEYS || 
    process.env.OPENAI_API_KEYS
  )
  checks.apiKey = {
    status: hasApiKey ? 'ok' : 'warning',
    message: hasApiKey ? 'API key configured' : 'API key not configured'
  }
  if (!hasApiKey) healthy = false

  // Check 2: Scheduler enabled
  const schedulerEnabled = String(process.env.NUXT_ENABLE_SCHEDULER || 'true').toLowerCase() !== 'false'
  checks.scheduler = {
    status: schedulerEnabled ? 'ok' : 'disabled',
    message: schedulerEnabled ? 'Scheduler enabled' : 'Scheduler disabled'
  }

  // Check 3: Required directories exist
  const dirs = ['data', 'locales']
  checks.directories = {}
  
  for (const dir of dirs) {
    try {
      await access(join(process.cwd(), dir))
      checks.directories[dir] = 'ok'
    } catch {
      checks.directories[dir] = 'missing'
      healthy = false
    }
  }

  // Check 4: Locale files exist
  checks.localeFiles = {}
  const localeFiles = ['locales/id.json', 'locales/en.json']
  
  for (const file of localeFiles) {
    try {
      const content = await readFile(join(process.cwd(), file), 'utf-8')
      const json = JSON.parse(content)
      const keyCount = Object.keys(json).length
      checks.localeFiles[file] = {
        status: 'ok',
        keys: keyCount
      }
    } catch (error: any) {
      checks.localeFiles[file] = {
        status: 'error',
        error: error.message
      }
      healthy = false
    }
  }

  // Check 5: Translation queue file
  try {
    const queuePath = join(process.cwd(), 'data', 'translation-queue.json')
    await access(queuePath)
    const content = await readFile(queuePath, 'utf-8')
    const queue = JSON.parse(content)
    checks.queue = {
      status: 'ok',
      pages: Object.keys(queue.pages || {}).length,
      lastScan: queue.lastScan || 0,
      lastTranslation: queue.lastTranslation || 0
    }
  } catch (error: any) {
    checks.queue = {
      status: 'warning',
      message: 'Queue file not initialized (will be created on first scan)'
    }
  }

  // Check 6: Meta file
  try {
    const metaPath = join(process.cwd(), 'data', 'i18n-meta.json')
    await access(metaPath)
    const content = await readFile(metaPath, 'utf-8')
    const meta = JSON.parse(content)
    checks.meta = {
      status: 'ok',
      enKeys: Object.keys(meta.en || {}).length
    }
  } catch (error: any) {
    checks.meta = {
      status: 'warning',
      message: 'Meta file not initialized (will be created on first translation)'
    }
  }

  // Overall status
  const status = healthy ? 'healthy' : 'unhealthy'
  const statusCode = healthy ? 200 : 503

  // Set response status
  event.node.res.statusCode = statusCode

  return {
    status,
    healthy,
    timestamp: new Date().toISOString(),
    checks,
    recommendations: healthy ? [] : getRecommendations(checks)
  }
})

function getRecommendations(checks: Record<string, any>): string[] {
  const recommendations: string[] = []

  if (checks.apiKey?.status !== 'ok') {
    recommendations.push('Set OPENAI_API_KEY environment variable')
  }

  if (checks.directories?.data === 'missing') {
    recommendations.push('Run: node scripts/setup-translation-system.js')
  }

  if (checks.localeFiles?.['locales/id.json']?.status === 'error') {
    recommendations.push('Create locales/id.json with default translations')
  }

  if (checks.localeFiles?.['locales/en.json']?.status === 'error') {
    recommendations.push('Create locales/en.json with default translations')
  }

  return recommendations
}

