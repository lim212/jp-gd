#!/usr/bin/env node
/**
 * Script untuk monitor dan auto-cleanup PM2 logs
 * Run dengan cron job atau PM2 sendiri
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PM2_LOG_DIR = process.env.PM2_LOG_DIR || path.join(process.env.HOME || process.env.USERPROFILE || '', '.pm2', 'logs')
const MAX_LOG_SIZE_MB = 100 // Alert jika melebihi ini
const CHECK_INTERVAL = 3600000 // Check setiap 1 jam (dalam ms)

function getLogSize() {
  try {
    if (!fs.existsSync(PM2_LOG_DIR)) {
      return { size: 0, files: 0 }
    }

    const files = fs.readdirSync(PM2_LOG_DIR)
      .filter(file => file.endsWith('.log') || file.endsWith('.log.gz'))
      .map(file => {
        const filePath = path.join(PM2_LOG_DIR, file)
        try {
          return fs.statSync(filePath).size
        } catch {
          return 0
        }
      })

    const totalSize = files.reduce((sum, size) => sum + size, 0)
    return {
      size: totalSize / (1024 * 1024), // Convert to MB
      files: files.length
    }
  } catch (error) {
    console.error('Error checking log size:', error.message)
    return { size: 0, files: 0 }
  }
}

function cleanupLogs() {
  try {
    console.log('🧹 Running automatic log cleanup...')
    execSync('node scripts/cleanup-pm2-logs.js', { stdio: 'inherit' })
  } catch (error) {
    console.error('Error running cleanup:', error.message)
  }
}

function checkAndCleanup() {
  const { size, files } = getLogSize()
  
  console.log(`📊 PM2 Log Status: ${size.toFixed(2)} MB, ${files} files`)

  if (size > MAX_LOG_SIZE_MB) {
    console.warn(`⚠️  Log size melebihi batas (${size.toFixed(2)} MB > ${MAX_LOG_SIZE_MB} MB)`)
    console.log('🧹 Running cleanup...')
    cleanupLogs()
  } else if (files > 20) {
    console.warn(`⚠️  Terlalu banyak log files (${files} > 20)`)
    console.log('🧹 Running cleanup...')
    cleanupLogs()
  } else {
    console.log('✅ Log size masih normal')
  }
}

// Run check
checkAndCleanup()

// If running as daemon, check periodically
if (process.argv.includes('--daemon')) {
  console.log(`🔄 Starting daemon mode (check every ${CHECK_INTERVAL / 1000 / 60} minutes)`)
  setInterval(checkAndCleanup, CHECK_INTERVAL)
  
  // Keep process alive
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping log monitor...')
    process.exit(0)
  })
}

