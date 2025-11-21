#!/usr/bin/env node

/**
 * Manual Translation Sync Script
 * 
 * Usage:
 *   node scripts/translation-sync.js [command]
 * 
 * Commands:
 *   scan      - Scan all pages for new/changed content
 *   translate - Translate all pending content
 *   retry     - Retry failed translations
 *   stats     - Show translation statistics
 *   full      - Run full sync (scan + translate + cleanup)
 *   dashboard - Open translation dashboard in browser
 */

const http = require('http')
const https = require('https')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// Colors for console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset)
}

function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path)
    const client = url.protocol === 'https:' ? https : http
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    const req = client.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          resolve(json)
        } catch (e) {
          resolve({ error: 'Invalid JSON response', data })
        }
      })
    })
    
    req.on('error', (error) => {
      reject(error)
    })
    
    req.end()
  })
}

async function scanPages() {
  log('\n📂 Scanning all pages for changes...', 'cyan')
  
  try {
    const result = await makeRequest('/api/i18n/scan-pages', 'POST')
    
    if (result.success) {
      log('✅ Scan complete!', 'green')
      log(`   Scanned: ${result.scanned} files`, 'bright')
      log(`   New: ${result.newPages} pages`, 'bright')
      log(`   Changed: ${result.changedPages} pages`, 'bright')
    } else {
      log('❌ Scan failed: ' + (result.message || 'Unknown error'), 'red')
    }
    
    return result
  } catch (error) {
    log('❌ Scan failed: ' + error.message, 'red')
    return { success: false, error: error.message }
  }
}

async function translatePending() {
  log('\n🌐 Translating pending content...', 'cyan')
  log('   This may take a while depending on the amount of content...', 'yellow')
  
  try {
    const result = await makeRequest('/api/i18n/sync', 'POST')
    
    if (result.success) {
      log('✅ Translation complete!', 'green')
      log(`   Translated: ${result.translatedCount} keys`, 'bright')
      log(`   Missing: ${result.missingCount} keys`, 'bright')
      log(`   Changed: ${result.changedCount} keys`, 'bright')
    } else if (result.skipped) {
      log('⏭️  Translation skipped: ' + result.reason, 'yellow')
    } else {
      log('❌ Translation failed: ' + (result.message || 'Unknown error'), 'red')
    }
    
    return result
  } catch (error) {
    log('❌ Translation failed: ' + error.message, 'red')
    return { success: false, error: error.message }
  }
}

async function retryFailed() {
  log('\n🔄 Retrying failed translations...', 'cyan')
  
  try {
    const result = await makeRequest('/api/i18n/retry-failed', 'POST')
    
    if (result.success) {
      log('✅ Retry complete!', 'green')
      log(`   Retried: ${result.retriedPages} pages`, 'bright')
      log(`   Translated: ${result.translatedCount} keys`, 'bright')
    } else {
      log('❌ Retry failed: ' + (result.message || 'Unknown error'), 'red')
    }
    
    return result
  } catch (error) {
    log('❌ Retry failed: ' + error.message, 'red')
    return { success: false, error: error.message }
  }
}

async function showStats() {
  log('\n📊 Fetching translation statistics...', 'cyan')
  
  try {
    const result = await makeRequest('/api/i18n/dashboard', 'GET')
    
    if (result.success) {
      log('✅ Statistics:', 'green')
      log('\n📈 Overall Stats:', 'bright')
      log(`   Total Pages: ${result.stats.totalPages}`)
      log(`   Pending: ${result.stats.pending}`)
      log(`   Translated: ${result.stats.translated}`)
      log(`   Failed: ${result.stats.failed}`)
      log(`   Last Scan: ${result.stats.lastScanFormatted}`)
      log(`   Last Translation: ${result.stats.lastTranslationFormatted}`)
      
      log('\n🔧 System Status:', 'bright')
      log(`   API Key Configured: ${result.system.hasApiKey ? '✅ Yes' : '❌ No'}`)
      log(`   Scheduler Enabled: ${result.system.schedulerEnabled ? '✅ Yes' : '❌ No'}`)
      log(`   Environment: ${result.system.environment}`)
      
      if (result.pendingPages.length > 0) {
        log('\n📝 Recent Pending Pages:', 'yellow')
        result.pendingPages.slice(0, 10).forEach(page => {
          log(`   - ${page.path} (detected: ${page.lastDetected})`)
        })
        if (result.pendingPages.length > 10) {
          log(`   ... and ${result.pendingPages.length - 10} more`)
        }
      }
      
      if (result.failedPages.length > 0) {
        log('\n❌ Failed Pages:', 'red')
        result.failedPages.forEach(page => {
          log(`   - ${page.path}`)
          log(`     Error: ${page.error}`)
          log(`     Retry count: ${page.retryCount}`)
        })
      }
    } else {
      log('❌ Failed to get stats: ' + (result.error || 'Unknown error'), 'red')
    }
    
    return result
  } catch (error) {
    log('❌ Failed to get stats: ' + error.message, 'red')
    return { success: false, error: error.message }
  }
}

async function fullSync() {
  log('\n🚀 Running full translation sync...', 'cyan')
  log('='.repeat(60), 'bright')
  
  // Step 1: Scan
  await scanPages()
  
  // Step 2: Retry failed
  await retryFailed()
  
  // Step 3: Translate pending
  await translatePending()
  
  // Step 4: Show final stats
  await showStats()
  
  log('\n='.repeat(60), 'bright')
  log('✅ Full sync complete!', 'green')
}

function showDashboard() {
  const url = BASE_URL + '/api/i18n/dashboard'
  log('\n📊 Translation Dashboard URL:', 'cyan')
  log('   ' + url, 'bright')
  log('\n💡 You can also view stats with: node scripts/translation-sync.js stats', 'yellow')
}

function showHelp() {
  log('\n📚 Translation Sync Script', 'cyan')
  log('='.repeat(60), 'bright')
  log('\nUsage: node scripts/translation-sync.js [command]', 'bright')
  log('\nCommands:', 'bright')
  log('  scan       - Scan all pages for new/changed content')
  log('  translate  - Translate all pending content')
  log('  retry      - Retry failed translations')
  log('  stats      - Show translation statistics')
  log('  full       - Run full sync (scan + translate + cleanup)')
  log('  dashboard  - Show dashboard URL')
  log('  help       - Show this help message')
  log('\nEnvironment Variables:', 'bright')
  log('  BASE_URL   - Base URL of your application (default: http://localhost:3000)')
  log('\nExamples:', 'bright')
  log('  node scripts/translation-sync.js scan')
  log('  node scripts/translation-sync.js full')
  log('  BASE_URL=https://example.com node scripts/translation-sync.js stats')
  log('')
}

// Main
async function main() {
  const command = process.argv[2] || 'help'
  
  log('\n' + '='.repeat(60), 'bright')
  log('🌐 Translation Sync Utility', 'cyan')
  log('='.repeat(60), 'bright')
  
  switch (command.toLowerCase()) {
    case 'scan':
      await scanPages()
      break
    case 'translate':
      await translatePending()
      break
    case 'retry':
      await retryFailed()
      break
    case 'stats':
      await showStats()
      break
    case 'full':
      await fullSync()
      break
    case 'dashboard':
      showDashboard()
      break
    case 'help':
    default:
      showHelp()
      break
  }
  
  log('')
}

main().catch(error => {
  log('\n❌ Fatal error: ' + error.message, 'red')
  process.exit(1)
})

