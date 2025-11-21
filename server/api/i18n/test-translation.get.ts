import { defineEventHandler } from 'h3'
import { getTranslationCacheManager } from '../../utils/i18nTranslationCache'
import { readLocale } from '../../utils/i18nStore'

/**
 * GET /api/i18n/test-translation
 * Test endpoint untuk verifikasi sistem translasi
 */
export default defineEventHandler(async () => {
  const results: any = {
    success: true,
    timestamp: new Date().toISOString(),
    tests: {}
  }

  try {
    // Test 1: Check locale files
    results.tests.localeFiles = {
      name: 'Check Locale Files',
      status: 'running'
    }
    
    const idMessages = await readLocale('id')
    const enMessages = await readLocale('en')
    
    const idKeysCount = Object.keys(idMessages).length
    const enKeysCount = Object.keys(enMessages).length
    
    results.tests.localeFiles = {
      name: 'Check Locale Files',
      status: 'passed',
      details: {
        idKeys: idKeysCount,
        enKeys: enKeysCount,
        hasData: idKeysCount > 0 && enKeysCount > 0
      }
    }

    // Test 2: Check cache manager
    results.tests.cacheManager = {
      name: 'Check Cache Manager',
      status: 'running'
    }
    
    const cacheManager = await getTranslationCacheManager()
    const stats = cacheManager.getStats()
    
    results.tests.cacheManager = {
      name: 'Check Cache Manager',
      status: 'passed',
      details: {
        totalPages: stats.totalPages,
        translatedPages: stats.translatedPages,
        pendingPages: stats.pendingPages,
        lastSync: stats.lastSync ? new Date(stats.lastSync).toISOString() : null,
        lastCheck: stats.lastCheck ? new Date(stats.lastCheck).toISOString() : null
      }
    }

    // Test 3: Check OpenAI configuration
    results.tests.openAI = {
      name: 'Check OpenAI Configuration',
      status: 'running'
    }
    
    const hasApiKey = Boolean(
      process.env.CHATGPT_API_KEYS || 
      process.env.OPENAI_API_KEYS || 
      process.env.OPENAI_API_KEY
    )
    
    results.tests.openAI = {
      name: 'Check OpenAI Configuration',
      status: hasApiKey ? 'passed' : 'warning',
      details: {
        configured: hasApiKey,
        message: hasApiKey 
          ? 'API key is configured' 
          : 'API key not found - translations will be skipped'
      }
    }

    // Test 4: Check scheduler status
    results.tests.scheduler = {
      name: 'Check Scheduler Status',
      status: 'running'
    }
    
    const schedulerDisabled = String(process.env.NUXT_ENABLE_SCHEDULER || '').toLowerCase() === 'false'
    const isDev = process.env.NODE_ENV === 'development' || process.env.NUXT_DEV === 'true'
    const devCronEnabled = process.env.ENABLE_DEV_CRON === 'true'
    
    let schedulerStatus = 'enabled'
    if (schedulerDisabled) schedulerStatus = 'disabled by NUXT_ENABLE_SCHEDULER=false'
    else if (isDev && !devCronEnabled) schedulerStatus = 'disabled in development mode'
    
    results.tests.scheduler = {
      name: 'Check Scheduler Status',
      status: schedulerStatus === 'enabled' ? 'passed' : 'info',
      details: {
        status: schedulerStatus,
        schedule: '02:00 WIB daily',
        isDev,
        devCronEnabled
      }
    }

    // Summary
    const passedTests = Object.values(results.tests).filter((t: any) => t.status === 'passed').length
    const totalTests = Object.keys(results.tests).length
    
    results.summary = {
      total: totalTests,
      passed: passedTests,
      warnings: Object.values(results.tests).filter((t: any) => t.status === 'warning').length,
      failed: Object.values(results.tests).filter((t: any) => t.status === 'failed').length,
      message: `${passedTests}/${totalTests} tests passed`
    }

  } catch (error: any) {
    results.success = false
    results.error = error?.message || 'Unknown error'
    results.summary = {
      message: 'Test suite failed',
      error: error?.message
    }
  }

  return results
})

