// Script to clean build directories before build (fixes Windows ENOTEMPTY/EPERM errors)
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Helper to wait/delay
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function cleanDir(dirPath, dirName, retries = 3) {
  if (!fs.existsSync(dirPath)) {
    return true // Directory doesn't exist, consider it clean
  }

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Use modern fs.rmSync with recursive option (Node.js 14.14.0+)
      // This handles Windows ENOTEMPTY errors better
      fs.rmSync(dirPath, { recursive: true, force: true, maxRetries: 3, retryDelay: 200 })
      return true
    } catch (error) {
      // If it's a permission error, wait and retry
      if ((error.code === 'EPERM' || error.code === 'EBUSY') && attempt < retries - 1) {
        console.log(`⏳ ${dirName} is locked, waiting 500ms before retry ${attempt + 1}/${retries}...`)
        await sleep(500)
        continue
      }
      
      // If rmSync fails, try manual deletion as fallback
      if (error.code === 'ENOTEMPTY' || error.code === 'EBUSY' || error.code === 'EPERM') {
        try {
          // Manual recursive deletion as fallback with error handling
          async function removeDir(dir) {
            if (!fs.existsSync(dir)) return
            
            try {
              const files = fs.readdirSync(dir)
              
              for (const file of files) {
                const filePath = path.join(dir, file)
                try {
                  const stat = fs.statSync(filePath)
                  if (stat.isDirectory()) {
                    await removeDir(filePath)
                  } else {
                    // Try to remove file with retry
                    let removed = false
                    for (let i = 0; i < 3 && !removed; i++) {
                      try {
                        fs.unlinkSync(filePath)
                        removed = true
                      } catch (e) {
                        if (i < 2) {
                          await sleep(200)
                        }
                      }
                    }
                  }
                } catch (e) {
                  // Ignore errors for locked files
                }
              }
              
              try {
                fs.rmdirSync(dir)
              } catch (e) {
                // Ignore ENOTEMPTY/EPERM errors
              }
            } catch (e) {
              // Ignore readdir errors
            }
          }
          
          await removeDir(dirPath)
          return true
        } catch (fallbackError) {
          if (attempt < retries - 1) {
            console.log(`⏳ ${dirName} cleanup failed, retrying in 500ms...`)
            await sleep(500)
            continue
          }
          console.warn(`⚠️  Error cleaning ${dirName}: ${fallbackError.message}`)
          return false
        }
      } else {
        if (attempt < retries - 1) {
          console.log(`⏳ ${dirName} cleanup failed, retrying in 500ms...`)
          await sleep(500)
          continue
        }
        console.warn(`⚠️  Error cleaning ${dirName}: ${error.message}`)
        return false
      }
    }
  }
  
  return false
}

async function cleanOutputDir() {
  console.log('🧹 Cleaning build directories...')
  
  const dirsToClean = [
    { path: path.join(process.cwd(), '.output'), name: '.output' },
    { path: path.join(process.cwd(), '.nuxt', 'dist'), name: '.nuxt/dist' },
    { path: path.join(process.cwd(), '.nuxt'), name: '.nuxt' }
  ]
  
  let cleaned = 0
  let skipped = 0
  
  // Clean in reverse order (nested dirs first)
  for (const { path: dirPath, name: dirName } of dirsToClean) {
    if (!fs.existsSync(dirPath)) {
      skipped++
      continue
    }
    
    const result = await cleanDir(dirPath, dirName)
    if (result) {
      cleaned++
      console.log(`✅ ${dirName} cleaned successfully`)
    } else {
      console.warn(`⚠️  ${dirName} cleanup had issues, but continuing...`)
    }
  }
  
  if (cleaned > 0) {
    console.log(`✅ Cleaned ${cleaned} directory/directories`)
  }
  if (skipped > 0) {
    console.log(`ℹ️  ${skipped} directory/directories did not exist`)
  }
  
  // Always continue build even if cleanup had issues
  console.log('ℹ️  Build will continue...')
}

cleanOutputDir().catch(err => {
  console.warn(`⚠️  Cleanup script error: ${err.message}`)
  console.log('ℹ️  Build will continue anyway...')
  process.exit(0) // Exit with success so build continues
})
