#!/usr/bin/env node
/**
 * Script untuk fix PM2 start error dan blank page
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔧 Fixing PM2 start configuration...\n')

// 1. Stop semua PM2 processes
console.log('1️⃣  Stopping all PM2 processes...')
try {
  execSync('pm2 stop all', { stdio: 'inherit' })
} catch (e) {
  console.log('   (No processes to stop)')
}

// 2. Delete semua PM2 processes
console.log('\n2️⃣  Deleting all PM2 processes...')
try {
  execSync('pm2 delete all', { stdio: 'inherit' })
} catch (e) {
  console.log('   (No processes to delete)')
}

// 3. Cek apakah build sudah ada
console.log('\n3️⃣  Checking build output...')
const buildPath = path.join(process.cwd(), '.output', 'server', 'index.mjs')
if (!fs.existsSync(buildPath)) {
  console.error('❌ Build tidak ditemukan!')
  console.log('   Running build...')
  try {
    execSync('npm run build', { stdio: 'inherit' })
    console.log('✅ Build selesai!')
  } catch (e) {
    console.error('❌ Build gagal!')
    process.exit(1)
  }
} else {
  console.log('✅ Build sudah ada')
}

// 4. Cek ecosystem config
console.log('\n4️⃣  Checking ecosystem config...')
const ecosystemFiles = [
  'ecosystem.config.cjs',
  'ecosystem.config.js',
  'ecosystem.ubuntu.config.js'
]

let ecosystemFile = null
for (const file of ecosystemFiles) {
  if (fs.existsSync(file)) {
    ecosystemFile = file
    console.log(`✅ Found: ${file}`)
    break
  }
}

if (!ecosystemFile) {
  console.error('❌ Ecosystem config tidak ditemukan!')
  process.exit(1)
}

// 5. Start PM2 dengan config yang benar
console.log(`\n5️⃣  Starting PM2 with ${ecosystemFile}...`)
try {
  execSync(`pm2 start ${ecosystemFile}`, { stdio: 'inherit' })
  console.log('✅ PM2 started!')
} catch (e) {
  console.error('❌ PM2 start gagal!')
  console.error('   Error:', e.message)
  process.exit(1)
}

// 6. Save PM2 config
console.log('\n6️⃣  Saving PM2 configuration...')
try {
  execSync('pm2 save', { stdio: 'inherit' })
  console.log('✅ PM2 config saved!')
} catch (e) {
  console.error('⚠️  Warning: Could not save PM2 config')
}

// 7. Show status
console.log('\n7️⃣  PM2 Status:')
try {
  execSync('pm2 status', { stdio: 'inherit' })
} catch (e) {
  console.error('Error getting PM2 status')
}

// 8. Show logs
console.log('\n8️⃣  Recent logs (last 20 lines):')
try {
  execSync('pm2 logs --lines 20 --nostream', { stdio: 'inherit' })
} catch (e) {
  console.error('Error getting logs')
}

console.log('\n✅ Done!')
console.log('\n📝 Next steps:')
console.log('   1. Check PM2 status: pm2 status')
console.log('   2. Check logs: pm2 logs')
console.log('   3. Check website: http://localhost:3000')
console.log('   4. If blank page, check browser console (F12)')

