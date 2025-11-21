#!/usr/bin/env node

/**
 * 🧹 Clear Cache Script
 * 
 * Script untuk membersihkan semua cache Nuxt/Vite
 * Gunakan jika perubahan tidak muncul
 * 
 * Usage:
 *   node clear-cache.js
 *   npm run clear:cache
 */

import { existsSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function clearCache() {
  log('', 'reset')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  🧹 CLEAR CACHE', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('', 'reset')

  const cacheDirs = [
    '.nuxt',
    '.output',
    'node_modules/.vite',
    'node_modules/.cache',
    'dist',
  ]

  let cleared = 0
  let notFound = 0
  let failed = 0

  cacheDirs.forEach(dir => {
    const fullPath = join(__dirname, dir)
    if (existsSync(fullPath)) {
      try {
        log(`🗑️  Menghapus: ${dir}`, 'yellow')
        rmSync(fullPath, { recursive: true, force: true })
        log(`✅ Berhasil: ${dir}`, 'green')
        cleared++
      } catch (error) {
        log(`❌ Gagal: ${dir} - ${error.message}`, 'red')
        failed++
      }
    } else {
      log(`ℹ️  Tidak ada: ${dir}`, 'blue')
      notFound++
    }
  })

  log('', 'reset')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log(`📊 Summary:`, 'bright')
  log(`  ✅ Cleared: ${cleared}`, 'green')
  log(`  ℹ️  Not found: ${notFound}`, 'blue')
  if (failed > 0) {
    log(`  ❌ Failed: ${failed}`, 'red')
  }
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('', 'reset')

  if (cleared > 0) {
    log('✅ Cache berhasil dibersihkan!', 'green')
    log('💡 Sekarang restart dev server atau build ulang', 'cyan')
  } else if (notFound === cacheDirs.length) {
    log('✅ Tidak ada cache yang perlu dibersihkan', 'green')
  }

  log('', 'reset')
}

clearCache()

