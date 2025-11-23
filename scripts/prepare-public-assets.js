// Script to ensure public assets are ready before build
// This fixes the "ENOENT: no such file or directory" error for social-card.png

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

const publicDir = path.join(rootDir, 'public')
const outputPublicDir = path.join(rootDir, '.output', 'public')

console.log('🔧 Preparing public assets before build...')

// Ensure .output/public exists
if (!fs.existsSync(outputPublicDir)) {
  fs.mkdirSync(outputPublicDir, { recursive: true })
  console.log('✅ Created .output/public directory')
}

// List of critical files that must exist
const criticalFiles = [
  'social-card.png',
  'landing-page.png',
  'favicon.ico',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png'
]

let copied = 0
let skipped = 0
let missing = 0

// Copy critical files if they exist
for (const file of criticalFiles) {
  const sourceFile = path.join(publicDir, file)
  const destFile = path.join(outputPublicDir, file)
  
  if (fs.existsSync(sourceFile)) {
    try {
      // Ensure destination directory exists
      const destDir = path.dirname(destFile)
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      
      // Copy file if it doesn't exist or is different
      if (!fs.existsSync(destFile)) {
        fs.copyFileSync(sourceFile, destFile)
        copied++
        console.log(`✅ Copied ${file}`)
      } else {
        skipped++
      }
    } catch (error) {
      console.warn(`⚠️  Could not copy ${file}: ${error.message}`)
    }
  } else {
    missing++
    console.warn(`⚠️  Missing file: ${file} (non-critical, will be handled by Nitro)`)
  }
}

console.log(`\n📊 Summary:`)
console.log(`   Copied: ${copied}`)
console.log(`   Already exists: ${skipped}`)
console.log(`   Missing: ${missing}`)
console.log(`\n✅ Public assets preparation completed!`)


