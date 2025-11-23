#!/usr/bin/env node
/**
 * Script untuk check status website dan diagnose blank page
 */

const http = require('http')
const { execSync } = require('child_process')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

console.log('🔍 Checking website status...\n')

// 1. Check PM2 status
console.log('1️⃣  PM2 Status:')
try {
  const status = execSync('pm2 jlist', { encoding: 'utf-8' })
  const processes = JSON.parse(status)
  
  if (processes.length === 0) {
    console.log('   ❌ No PM2 processes running!')
    console.log('   💡 Run: npm run pm2:start')
  } else {
    processes.forEach(proc => {
      const status = proc.pm2_env?.status || 'unknown'
      const name = proc.name || 'unknown'
      const uptime = proc.pm2_env?.pm_uptime || 0
      const restarts = proc.pm2_env?.restart_time || 0
      
      console.log(`   ${status === 'online' ? '✅' : '❌'} ${name}: ${status}`)
      console.log(`      Uptime: ${Math.floor(uptime / 1000)}s, Restarts: ${restarts}`)
    })
  }
} catch (e) {
  console.log('   ⚠️  Could not check PM2 status')
}

// 2. Check if port is listening
console.log(`\n2️⃣  Checking port ${PORT}...`)
const checkPort = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: HOST,
      port: PORT,
      path: '/',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      console.log(`   ✅ Port ${PORT} is responding!`)
      console.log(`   Status: ${res.statusCode}`)
      console.log(`   Headers:`, res.headers)
      resolve(true)
    })

    req.on('error', (e) => {
      console.log(`   ❌ Port ${PORT} is not responding!`)
      console.log(`   Error: ${e.message}`)
      resolve(false)
    })

    req.on('timeout', () => {
      console.log(`   ❌ Port ${PORT} timeout!`)
      req.destroy()
      resolve(false)
    })

    req.end()
  })
}

checkPort().then(portOk => {
  if (!portOk) {
    console.log('\n❌ Website is not accessible!')
    console.log('\n💡 Troubleshooting:')
    console.log('   1. Check if PM2 is running: pm2 status')
    console.log('   2. Check PM2 logs: pm2 logs')
    console.log('   3. Restart PM2: pm2 restart all')
    console.log('   4. Check if build exists: ls -la .output/server/')
    console.log('   5. Rebuild if needed: npm run build')
    process.exit(1)
  }

  // 3. Check build output
  console.log('\n3️⃣  Checking build output...')
  const fs = require('fs')
  const path = require('path')
  const buildPath = path.join(process.cwd(), '.output', 'server', 'index.mjs')
  
  if (fs.existsSync(buildPath)) {
    const stats = fs.statSync(buildPath)
    console.log(`   ✅ Build exists (${(stats.size / 1024).toFixed(2)} KB)`)
  } else {
    console.log('   ❌ Build not found!')
    console.log('   💡 Run: npm run build')
  }

  // 4. Check for common blank page issues
  console.log('\n4️⃣  Common blank page causes:')
  console.log('   - JavaScript errors (check browser console F12)')
  console.log('   - CSS not loading (check Network tab)')
  console.log('   - Build errors (check PM2 logs)')
  console.log('   - Server errors (check PM2 error logs)')
  
  console.log('\n✅ Website check complete!')
  console.log(`\n🌐 Try accessing: http://${HOST}:${PORT}`)
  console.log('   If blank page:')
  console.log('   1. Open browser console (F12)')
  console.log('   2. Check for errors in Console tab')
  console.log('   3. Check Network tab for failed requests')
  console.log('   4. Check PM2 logs: pm2 logs')
})

