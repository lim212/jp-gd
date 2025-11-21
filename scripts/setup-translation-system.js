#!/usr/bin/env node

/**
 * Setup Translation System
 * 
 * Initializes all required directories and files for translation system
 * Run this once after cloning or before first deployment
 * 
 * Usage: node scripts/setup-translation-system.js
 */

const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  bright: '\x1b[1m'
}

function log(msg, color = 'reset') {
  console.log(colors[color] + msg + colors.reset)
}

async function setupTranslationSystem() {
  log('\n' + '='.repeat(60), 'bright')
  log('🌐 Translation System Setup', 'cyan')
  log('='.repeat(60), 'bright')
  log('')

  let errors = []
  let warnings = []

  // 1. Create required directories
  log('📁 Creating required directories...', 'cyan')
  
  const dirs = [
    'data',
    'locales',
    'i18n',
    'i18n/locales',
    'scripts',
    'logs'
  ]

  for (const dir of dirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        log(`  ✅ Created: ${dir}`, 'green')
      } else {
        log(`  ✓ Exists: ${dir}`)
      }
    } catch (error) {
      errors.push(`Failed to create directory ${dir}: ${error.message}`)
      log(`  ❌ Failed: ${dir}`, 'red')
    }
  }

  // 2. Create default locale files if not exist
  log('\n📝 Checking locale files...', 'cyan')
  
  const localeFiles = {
    'locales/id.json': {
      welcome: 'Selamat datang',
      home: 'Beranda',
      about: 'Tentang',
      contact: 'Kontak'
    },
    'locales/en.json': {
      welcome: 'Welcome',
      home: 'Home',
      about: 'About',
      contact: 'Contact'
    }
  }

  for (const [file, content] of Object.entries(localeFiles)) {
    try {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify(content, null, 2), 'utf-8')
        log(`  ✅ Created: ${file}`, 'green')
      } else {
        log(`  ✓ Exists: ${file}`)
      }
    } catch (error) {
      warnings.push(`Could not create ${file}: ${error.message}`)
      log(`  ⚠️ Warning: ${file}`, 'yellow')
    }
  }

  // 3. Create meta file if not exist
  log('\n📊 Checking meta files...', 'cyan')
  
  const metaFile = 'data/i18n-meta.json'
  try {
    if (!fs.existsSync(metaFile)) {
      fs.writeFileSync(metaFile, JSON.stringify({ en: {} }, null, 2), 'utf-8')
      log(`  ✅ Created: ${metaFile}`, 'green')
    } else {
      log(`  ✓ Exists: ${metaFile}`)
    }
  } catch (error) {
    warnings.push(`Could not create meta file: ${error.message}`)
    log(`  ⚠️ Warning: ${metaFile}`, 'yellow')
  }

  // 4. Create translation queue file if not exist
  const queueFile = 'data/translation-queue.json'
  try {
    if (!fs.existsSync(queueFile)) {
      const initialQueue = {
        pages: {},
        lastScan: 0,
        lastTranslation: 0,
        savedAt: new Date().toISOString()
      }
      fs.writeFileSync(queueFile, JSON.stringify(initialQueue, null, 2), 'utf-8')
      log(`  ✅ Created: ${queueFile}`, 'green')
    } else {
      log(`  ✓ Exists: ${queueFile}`)
    }
  } catch (error) {
    warnings.push(`Could not create queue file: ${error.message}`)
    log(`  ⚠️ Warning: ${queueFile}`, 'yellow')
  }

  // 5. Check environment variables
  log('\n🔐 Checking environment variables...', 'cyan')
  
  const requiredEnvVars = [
    { key: 'OPENAI_API_KEY', alternative: ['CHATGPT_API_KEYS', 'OPENAI_API_KEYS'] },
  ]

  let hasApiKey = false
  for (const envVar of requiredEnvVars) {
    const hasMain = process.env[envVar.key]
    const hasAlt = envVar.alternative?.some(alt => process.env[alt])
    
    if (hasMain || hasAlt) {
      log(`  ✅ API Key configured`, 'green')
      hasApiKey = true
    } else {
      warnings.push(`Environment variable ${envVar.key} (or ${envVar.alternative?.join('/')}) not set`)
      log(`  ⚠️ Warning: No API key found`, 'yellow')
      log(`     Set one of: ${envVar.key}, ${envVar.alternative?.join(', ')}`, 'yellow')
    }
  }

  // 6. Check optional env vars
  const schedulerEnabled = String(process.env.NUXT_ENABLE_SCHEDULER || 'true').toLowerCase() !== 'false'
  log(`  ${schedulerEnabled ? '✅' : '⚠️'} Scheduler: ${schedulerEnabled ? 'enabled' : 'disabled'}`)

  // 7. Create .gitignore entries for data files
  log('\n📝 Updating .gitignore...', 'cyan')
  
  const gitignorePath = '.gitignore'
  const gitignoreEntries = [
    '# Translation system data files',
    'data/translation-queue.json',
    'data/i18n-meta.json',
    '# Translation logs',
    'logs/translation-*.log'
  ]

  try {
    let gitignoreContent = ''
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8')
    }

    let updated = false
    for (const entry of gitignoreEntries) {
      if (!gitignoreContent.includes(entry)) {
        gitignoreContent += '\n' + entry
        updated = true
      }
    }

    if (updated) {
      fs.writeFileSync(gitignorePath, gitignoreContent, 'utf-8')
      log(`  ✅ Updated .gitignore`, 'green')
    } else {
      log(`  ✓ .gitignore already configured`)
    }
  } catch (error) {
    warnings.push(`Could not update .gitignore: ${error.message}`)
    log(`  ⚠️ Warning: Could not update .gitignore`, 'yellow')
  }

  // 8. Verify script permissions (Unix only)
  if (process.platform !== 'win32') {
    log('\n🔧 Setting script permissions...', 'cyan')
    
    const scripts = [
      'scripts/quick-translate.sh',
      'scripts/translation-sync.js'
    ]

    for (const script of scripts) {
      try {
        if (fs.existsSync(script)) {
          fs.chmodSync(script, '755')
          log(`  ✅ Set executable: ${script}`, 'green')
        }
      } catch (error) {
        warnings.push(`Could not set permissions for ${script}: ${error.message}`)
        log(`  ⚠️ Warning: ${script}`, 'yellow')
      }
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'bright')
  log('📊 Setup Summary', 'cyan')
  log('='.repeat(60), 'bright')
  
  if (errors.length === 0 && warnings.length === 0) {
    log('\n✅ Setup completed successfully!', 'green')
    log('   All directories and files are ready.', 'green')
  } else {
    if (errors.length > 0) {
      log('\n❌ Errors:', 'red')
      errors.forEach(err => log(`   - ${err}`, 'red'))
    }
    
    if (warnings.length > 0) {
      log('\n⚠️  Warnings:', 'yellow')
      warnings.forEach(warn => log(`   - ${warn}`, 'yellow'))
    }
  }

  // Next steps
  log('\n📝 Next Steps:', 'cyan')
  
  if (!hasApiKey) {
    log('   1. Set your OpenAI API key in .env:', 'yellow')
    log('      OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxx', 'yellow')
  } else {
    log('   1. ✅ API key is configured')
  }
  
  log('   2. Start your server:', 'bright')
  log('      npm run dev', 'bright')
  
  log('   3. Test the system:', 'bright')
  log('      npm run translate:stats', 'bright')
  
  log('   4. (Optional) Run manual scan:', 'bright')
  log('      npm run translate:scan', 'bright')

  log('\n📚 Documentation:', 'cyan')
  log('   - Quick Start: TRANSLATION-QUICK-START.md')
  log('   - Full Docs: ENHANCED-TRANSLATION-SYSTEM-COMPLETE.md')
  log('   - Ringkasan: RINGKASAN-PERBAIKAN-TRANSLASI-COMPLETE.md')

  log('\n' + '='.repeat(60), 'bright')
  log('🎉 Translation system is ready!', 'green')
  log('='.repeat(60), 'bright')
  log('')

  // Exit with error code if there were errors
  if (errors.length > 0) {
    process.exit(1)
  }
}

// Run setup
setupTranslationSystem().catch(error => {
  console.error('\n❌ Setup failed:', error.message)
  process.exit(1)
})

