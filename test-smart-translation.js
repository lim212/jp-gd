#!/usr/bin/env node

/**
 * Test Smart Translation System
 * Verifikasi semua fungsi toggle bahasa dan translation system
 */

const https = require('https')
const http = require('http')

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000'
const IS_HTTPS = BASE_URL.startsWith('https://')

console.log('🧪 Testing Smart Translation System...')
console.log('📍 Base URL:', BASE_URL)
console.log('')

// Helper untuk HTTP request
function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL)
    const client = IS_HTTPS ? https : http
    
    const requestOptions = {
      hostname: url.hostname,
      port: url.port || (IS_HTTPS ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      timeout: 10000
    }

    const req = client.request(requestOptions, (res) => {
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve({ status: res.statusCode, headers: res.headers, data: json })
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data })
        }
      })
    })

    req.on('error', reject)
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timeout'))
    })

    if (options.body) {
      req.write(JSON.stringify(options.body))
    }

    req.end()
  })
}

// Test functions
async function testAPIEndpoints() {
  console.log('📡 Test 1: API Endpoints')
  console.log('━'.repeat(50))

  const tests = [
    {
      name: 'GET /api/i18n/messages?locale=id',
      path: '/api/i18n/messages?locale=id',
      expect: (res) => res.status === 200 && res.data.locale === 'id' && res.data.messages
    },
    {
      name: 'GET /api/i18n/messages?locale=en',
      path: '/api/i18n/messages?locale=en',
      expect: (res) => res.status === 200 && res.data.locale === 'en' && res.data.messages
    },
    {
      name: 'GET /api/i18n/stats',
      path: '/api/i18n/stats',
      expect: (res) => res.status === 200 && res.data.success === true
    },
    {
      name: 'GET /api/i18n/test-translation',
      path: '/api/i18n/test-translation',
      expect: (res) => res.status === 200 && res.data.success === true
    },
    {
      name: 'POST /api/i18n/sync',
      path: '/api/i18n/sync',
      method: 'POST',
      expect: (res) => res.status === 200 && (res.data.success !== undefined)
    }
  ]

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      const res = await request(test.path, { method: test.method || 'GET' })
      const success = test.expect(res)
      
      if (success) {
        console.log('✅', test.name)
        passed++
      } else {
        console.log('❌', test.name, '- Unexpected response')
        failed++
      }
    } catch (error) {
      console.log('❌', test.name, '-', error.message)
      failed++
    }
  }

  console.log('')
  console.log(`Result: ${passed} passed, ${failed} failed`)
  console.log('')
  
  return { passed, failed }
}

async function testTranslationSystem() {
  console.log('🌐 Test 2: Translation System')
  console.log('━'.repeat(50))

  try {
    const res = await request('/api/i18n/test-translation')
    
    if (res.status === 200 && res.data.success) {
      console.log('✅ Translation System: OK')
      console.log('')
      
      // Display test results
      Object.entries(res.data.tests).forEach(([key, test]) => {
        const statusIcon = test.status === 'passed' ? '✅' : 
                          test.status === 'warning' ? '⚠️' : 
                          test.status === 'failed' ? '❌' : 'ℹ️'
        console.log(`${statusIcon} ${test.name}: ${test.status}`)
        if (test.details) {
          console.log('   ', JSON.stringify(test.details, null, 2).split('\n').join('\n    '))
        }
      })
      
      console.log('')
      console.log('Summary:', res.data.summary.message)
      console.log('')
      
      return { passed: 1, failed: 0 }
    } else {
      console.log('❌ Translation System: Failed')
      console.log(res.data)
      return { passed: 0, failed: 1 }
    }
  } catch (error) {
    console.log('❌ Translation System Error:', error.message)
    return { passed: 0, failed: 1 }
  }
}

async function testCacheHeaders() {
  console.log('💾 Test 3: Cache Headers')
  console.log('━'.repeat(50))

  const tests = [
    {
      name: 'ID Messages Cache (should be 24h)',
      path: '/api/i18n/messages?locale=id',
      expectHeader: (headers) => {
        const cc = headers['cache-control'] || ''
        return cc.includes('max-age=86400') || cc.includes('max-age=1800')
      }
    },
    {
      name: 'EN Messages Cache (should be 30m)',
      path: '/api/i18n/messages?locale=en',
      expectHeader: (headers) => {
        const cc = headers['cache-control'] || ''
        return cc.includes('max-age=1800') || cc.includes('max-age=86400')
      }
    }
  ]

  let passed = 0
  let failed = 0

  for (const test of tests) {
    try {
      const res = await request(test.path)
      const success = test.expectHeader(res.headers)
      
      if (success) {
        console.log('✅', test.name)
        console.log('    Cache-Control:', res.headers['cache-control'])
        passed++
      } else {
        console.log('❌', test.name)
        console.log('    Cache-Control:', res.headers['cache-control'])
        failed++
      }
    } catch (error) {
      console.log('❌', test.name, '-', error.message)
      failed++
    }
  }

  console.log('')
  console.log(`Result: ${passed} passed, ${failed} failed`)
  console.log('')
  
  return { passed, failed }
}

async function testTranslationStats() {
  console.log('📊 Test 4: Translation Statistics')
  console.log('━'.repeat(50))

  try {
    const res = await request('/api/i18n/stats')
    
    if (res.status === 200 && res.data.success) {
      const stats = res.data.stats
      
      console.log('✅ Translation Statistics Retrieved')
      console.log('')
      console.log('   Total Pages:', stats.totalPages)
      console.log('   Translated:', stats.translatedPages)
      console.log('   Pending:', stats.pendingPages)
      console.log('   Last Sync:', stats.lastSync ? new Date(stats.lastSync).toLocaleString('id-ID') : 'Never')
      console.log('   Last Check:', stats.lastCheck ? new Date(stats.lastCheck).toLocaleString('id-ID') : 'Never')
      
      if (stats.pendingPagesDetails && stats.pendingPagesDetails.length > 0) {
        console.log('')
        console.log('   Pending Pages:')
        stats.pendingPagesDetails.slice(0, 5).forEach(page => {
          console.log(`   - ${page.path} (${page.locale})`)
        })
      }
      
      console.log('')
      return { passed: 1, failed: 0 }
    } else {
      console.log('❌ Failed to retrieve statistics')
      return { passed: 0, failed: 1 }
    }
  } catch (error) {
    console.log('❌ Error:', error.message)
    return { passed: 0, failed: 1 }
  }
}

// Main test runner
async function runTests() {
  console.log('╔════════════════════════════════════════════════╗')
  console.log('║   Smart Translation System - Test Suite       ║')
  console.log('╚════════════════════════════════════════════════╝')
  console.log('')

  const results = []

  try {
    results.push(await testAPIEndpoints())
    results.push(await testTranslationSystem())
    results.push(await testCacheHeaders())
    results.push(await testTranslationStats())
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }

  // Calculate totals
  const totalPassed = results.reduce((sum, r) => sum + r.passed, 0)
  const totalFailed = results.reduce((sum, r) => sum + r.failed, 0)
  const totalTests = totalPassed + totalFailed

  console.log('╔════════════════════════════════════════════════╗')
  console.log('║   FINAL RESULTS                                ║')
  console.log('╚════════════════════════════════════════════════╝')
  console.log('')
  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${totalPassed} ✅`)
  console.log(`Failed: ${totalFailed} ❌`)
  console.log('')

  if (totalFailed === 0) {
    console.log('🎉 All tests passed! System is working perfectly!')
    process.exit(0)
  } else {
    console.log('⚠️  Some tests failed. Please check the errors above.')
    process.exit(1)
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error)
  process.exit(1)
})

