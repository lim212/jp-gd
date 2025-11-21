#!/usr/bin/env node

/**
 * 🚀 Development Server - No Cache Mode
 * 
 * Script untuk menjalankan development server tanpa cache
 * Perubahan akan langsung terlihat tanpa delay
 * 
 * Usage:
 *   node dev-no-cache.js
 *   npm run dev:nocache
 */

import { execSync, spawn } from 'child_process'
import { existsSync, rmSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function clearCache() {
  log('\n🧹 Membersihkan cache...', 'cyan')
  
  const cacheDirs = [
    '.nuxt',
    '.output',
    'node_modules/.vite',
    'node_modules/.cache',
  ]
  
  cacheDirs.forEach(dir => {
    const fullPath = join(__dirname, dir)
    if (existsSync(fullPath)) {
      log(`  ❌ Menghapus: ${dir}`, 'yellow')
      try {
        rmSync(fullPath, { recursive: true, force: true })
        log(`  ✅ Berhasil dihapus: ${dir}`, 'green')
      } catch (error) {
        log(`  ⚠️  Gagal menghapus ${dir}: ${error.message}`, 'red')
      }
    } else {
      log(`  ℹ️  Tidak ada: ${dir}`, 'blue')
    }
  })
}

function startDevServer() {
  log('\n🚀 Memulai Development Server (No-Cache Mode)...', 'green')
  log('', 'reset')
  log('📝 Tips:', 'cyan')
  log('  1. Buka DevTools (F12)', 'blue')
  log('  2. Go to Network tab', 'blue')
  log('  3. ✅ Check "Disable cache"', 'blue')
  log('  4. Keep DevTools open saat development', 'blue')
  log('', 'reset')
  log('🔥 Hot Module Replacement (HMR) aktif!', 'magenta')
  log('💡 Perubahan akan langsung terlihat', 'magenta')
  log('', 'reset')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('', 'reset')

  // Set environment variables untuk no-cache
  const env = {
    ...process.env,
    NODE_ENV: 'development',
    NUXT_ENABLE_PWA: 'false',
    USE_POLLING: 'false',
    POLL_INTERVAL: '100',
  }

  // Start dev server dengan no-cache flags
  const devProcess = spawn('npx', ['nuxt', 'dev'], {
    env,
    stdio: 'inherit',
    shell: true,
  })

  devProcess.on('error', (error) => {
    log(`\n❌ Error starting dev server: ${error.message}`, 'red')
    process.exit(1)
  })

  devProcess.on('close', (code) => {
    if (code !== 0) {
      log(`\n❌ Dev server exited with code ${code}`, 'red')
    }
    process.exit(code)
  })

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    log('\n\n👋 Menghentikan dev server...', 'yellow')
    devProcess.kill('SIGINT')
    setTimeout(() => {
      process.exit(0)
    }, 1000)
  })
}

async function main() {
  log('', 'reset')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  log('  🚀 DEV SERVER - NO CACHE MODE', 'bright')
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan')
  
  // Step 1: Clear cache
  clearCache()
  
  // Step 2: Wait a bit
  log('\n⏳ Menunggu sebentar...', 'yellow')
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Step 3: Start dev server
  startDevServer()
}

// Run main function
main().catch(error => {
  log(`\n❌ Fatal error: ${error.message}`, 'red')
  console.error(error)
  process.exit(1)
})

