#!/usr/bin/env node
/**
 * Script untuk cleanup log PM2 yang sudah besar
 * Menghapus log lama dan memastikan tidak melebihi batas
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const PM2_LOG_DIR = process.env.PM2_LOG_DIR || path.join(process.env.HOME || process.env.USERPROFILE || '', '.pm2', 'logs')
const MAX_LOG_SIZE_MB = 100 // Total maksimal log size dalam MB
const MAX_LOG_FILES = 10 // Maksimal jumlah file log

console.log('🧹 Starting PM2 log cleanup...')
console.log(`📁 Log directory: ${PM2_LOG_DIR}`)

try {
  // Cek apakah directory ada
  if (!fs.existsSync(PM2_LOG_DIR)) {
    console.log('⚠️  PM2 log directory tidak ditemukan, skip cleanup')
    process.exit(0)
  }

  // Get semua log files
  const files = fs.readdirSync(PM2_LOG_DIR)
    .filter(file => file.endsWith('.log') || file.endsWith('.log.gz'))
    .map(file => {
      const filePath = path.join(PM2_LOG_DIR, file)
      const stats = fs.statSync(filePath)
      return {
        name: file,
        path: filePath,
        size: stats.size,
        mtime: stats.mtime
      }
    })
    .sort((a, b) => b.mtime - a.mtime) // Sort by modification time, newest first

  console.log(`📊 Found ${files.length} log files`)

  // Calculate total size
  const totalSizeMB = files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)
  console.log(`📦 Total log size: ${totalSizeMB.toFixed(2)} MB`)

  if (totalSizeMB < MAX_LOG_SIZE_MB && files.length <= MAX_LOG_FILES) {
    console.log('✅ Log size masih dalam batas normal, tidak perlu cleanup')
    process.exit(0)
  }

  // Keep newest files, delete old ones
  const filesToKeep = files.slice(0, MAX_LOG_FILES)
  const filesToDelete = files.slice(MAX_LOG_FILES)

  let deletedSize = 0
  let deletedCount = 0

  // Delete old files
  for (const file of filesToDelete) {
    try {
      fs.unlinkSync(file.path)
      deletedSize += file.size
      deletedCount++
      console.log(`🗑️  Deleted: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
    } catch (error) {
      console.error(`❌ Error deleting ${file.name}:`, error.message)
    }
  }

  // Also delete files if total size still exceeds limit
  let currentSize = filesToKeep.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024)
  if (currentSize > MAX_LOG_SIZE_MB) {
    console.log(`⚠️  Total size masih ${currentSize.toFixed(2)} MB, menghapus file lebih lanjut...`)
    
    for (const file of filesToKeep.slice(1)) { // Keep newest file
      if (currentSize <= MAX_LOG_SIZE_MB) break
      
      try {
        fs.unlinkSync(file.path)
        deletedSize += file.size
        deletedCount++
        currentSize -= file.size / (1024 * 1024)
        console.log(`🗑️  Deleted (size limit): ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`)
      } catch (error) {
        console.error(`❌ Error deleting ${file.name}:`, error.message)
      }
    }
  }

  const finalSizeMB = (totalSizeMB - (deletedSize / 1024 / 1024)).toFixed(2)
  console.log(`\n✅ Cleanup selesai!`)
  console.log(`   - Deleted: ${deletedCount} files`)
  console.log(`   - Freed: ${(deletedSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`   - Remaining: ${finalSizeMB} MB`)

  // Flush PM2 logs
  try {
    console.log('\n🔄 Flushing PM2 logs...')
    execSync('pm2 flush', { stdio: 'inherit' })
    console.log('✅ PM2 logs flushed')
  } catch (error) {
    console.error('⚠️  Error flushing PM2 logs:', error.message)
  }

} catch (error) {
  console.error('❌ Error during cleanup:', error.message)
  process.exit(1)
}

