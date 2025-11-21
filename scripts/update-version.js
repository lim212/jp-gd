#!/usr/bin/env node
/**
 * Update App Version Script
 * Automatically update version number setiap kali build atau restart
 */

import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const versionFilePath = join(__dirname, '../public/_app_version.json')

function generateVersion() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  
  return `v${year}.${month}.${day}.${hour}${minute}`
}

function updateVersion() {
  try {
    const version = generateVersion()
    const versionData = {
      version: version,
      buildTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    }
    
    writeFileSync(
      versionFilePath,
      JSON.stringify(versionData, null, 2),
      'utf8'
    )
    
    console.log('✅ Version updated:', version)
    console.log('📝 Version file:', versionFilePath)
    
  } catch (error) {
    console.error('❌ Failed to update version:', error)
    process.exit(1)
  }
}

// Run if called directly
updateVersion()

export { updateVersion, generateVersion }

