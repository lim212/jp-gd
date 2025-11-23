// Auto cleanup disk space script
// Runs cleanup automatically to prevent disk space issues

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

console.log('🧹 Auto Disk Cleanup Starting...')
console.log('')

// Check disk usage first
try {
  const diskUsage = execSync('df -h .', { encoding: 'utf-8' })
  console.log('📊 Current Disk Usage:')
  console.log(diskUsage)
} catch (error) {
  console.warn('⚠️  Could not check disk usage')
}

console.log('')

// Function to clean old files
function cleanOldFiles(dir, maxDays) {
  if (!fs.existsSync(dir)) {
    return { deleted: 0, freed: 0 }
  }
  
  let deleted = 0
  const now = Date.now()
  const maxAge = maxDays * 24 * 60 * 60 * 1000
  
  try {
    const files = fs.readdirSync(dir)
    
    for (const file of files) {
      const filePath = path.join(dir, file)
      try {
        const stat = fs.statSync(filePath)
        const age = now - stat.mtimeMs
        
        if (age > maxAge) {
          if (stat.isDirectory()) {
            const size = getDirSize(filePath)
            fs.rmSync(filePath, { recursive: true, force: true })
            deleted++
            console.log(`  ✅ Deleted old directory: ${file} (${formatSize(size)})`)
          } else {
            fs.unlinkSync(filePath)
            deleted++
            console.log(`  ✅ Deleted old file: ${file}`)
          }
        }
      } catch (error) {
        // Ignore errors
      }
    }
  } catch (error) {
    // Ignore errors
  }
  
  return { deleted }
}

function getDirSize(dir) {
  let size = 0
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true })
    for (const file of files) {
      const filePath = path.join(dir, file.name)
      if (file.isDirectory()) {
        size += getDirSize(filePath)
      } else {
        const stat = fs.statSync(filePath)
        size += stat.size
      }
    }
  } catch {
    // Ignore errors
  }
  return size
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

let totalDeleted = 0

// 1. Clean old logs (keep last 7 days)
console.log('📋 Cleaning old logs (keep last 7 days)...')
if (fs.existsSync(path.join(rootDir, 'logs'))) {
  const result = cleanOldFiles(path.join(rootDir, 'logs'), 7)
  totalDeleted += result.deleted
  console.log(`  Deleted ${result.deleted} old log files`)
}

// 2. Clean old backups (keep last 7 days)
console.log('📦 Cleaning old backups (keep last 7 days)...')
if (fs.existsSync(path.join(rootDir, 'backups'))) {
  const result = cleanOldFiles(path.join(rootDir, 'backups'), 7)
  totalDeleted += result.deleted
  console.log(`  Deleted ${result.deleted} old backup directories`)
}

// 3. Clean old blog generated files (keep last 30 days)
console.log('📝 Cleaning old blog generated files (keep last 30 days)...')
if (fs.existsSync(path.join(rootDir, 'data', 'blog', 'generated'))) {
  const result = cleanOldFiles(path.join(rootDir, 'data', 'blog', 'generated'), 30)
  totalDeleted += result.deleted
  console.log(`  Deleted ${result.deleted} old blog files`)
}

// 4. Clean old blog images (keep last 30 days)
console.log('🖼️  Cleaning old blog images (keep last 30 days)...')
if (fs.existsSync(path.join(rootDir, 'data', 'blog', 'images'))) {
  const result = cleanOldFiles(path.join(rootDir, 'data', 'blog', 'images'), 30)
  totalDeleted += result.deleted
  console.log(`  Deleted ${result.deleted} old blog images`)
}

// 5. Truncate large log files
console.log('📋 Truncating large log files...')
if (fs.existsSync(path.join(rootDir, 'logs'))) {
  try {
    const logFiles = fs.readdirSync(path.join(rootDir, 'logs'))
    for (const logFile of logFiles) {
      if (logFile.endsWith('.log')) {
        const logPath = path.join(rootDir, 'logs', logFile)
        const stats = fs.statSync(logPath)
        
        // If log file is larger than 10MB, truncate to last 1000 lines
        if (stats.size > 10 * 1024 * 1024) {
          try {
            const content = fs.readFileSync(logPath, 'utf-8')
            const lines = content.split('\n')
            if (lines.length > 1000) {
              const truncated = lines.slice(-1000).join('\n')
              fs.writeFileSync(logPath, truncated)
              console.log(`  ✅ Truncated ${logFile} (kept last 1000 lines)`)
            }
          } catch {
            // Ignore errors
          }
        }
      }
    }
  } catch {
    // Ignore errors
  }
}

// 6. Clean notification logs (keep last 1000 entries)
console.log('🔔 Cleaning notification logs...')
const notificationLog = path.join(rootDir, 'logs', 'notifications.json')
if (fs.existsSync(notificationLog)) {
  try {
    const content = fs.readFileSync(notificationLog, 'utf-8')
    const notifications = JSON.parse(content)
    
    if (Array.isArray(notifications) && notifications.length > 1000) {
      const truncated = notifications.slice(-1000)
      fs.writeFileSync(notificationLog, JSON.stringify(truncated, null, 2))
      console.log(`  ✅ Kept last 1000 notifications`)
    }
  } catch {
    // Ignore errors
  }
}

console.log('')
console.log(`✅ Auto cleanup completed!`)
console.log(`   Total items deleted: ${totalDeleted}`)
console.log('')
console.log('💡 Run "npm run disk:check" to see current disk usage')

