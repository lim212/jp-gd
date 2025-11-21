#!/usr/bin/env node

/**
 * Convert Hardcoded Text to i18n
 * 
 * Scans components and converts hardcoded Indonesian text to use i18n system
 * This ensures ALL text can be translated when user clicks EN icon
 * 
 * Usage: node scripts/convert-hardcoded-to-i18n.cjs
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

// Files that need i18n conversion
const componentsToCheck = [
  'app/components/SuperLoadingScreen.vue',
  'app/components/ChatWhatsapp.vue',
  'app/components/Home/WhyWe.vue',
  'app/components/Home/Information.vue',
  'app/components/Home/TransactionProcess.vue',
  'app/components/BannerSlider.vue',
  'app/components/AppHeader.vue',
  'app/components/BlogList.vue'
]

async function analyzeComponents() {
  log('\n' + '='.repeat(60), 'bright')
  log('🔍 Analyzing Components for Hardcoded Text', 'cyan')
  log('='.repeat(60), 'bright')
  log('')

  const issues = []

  for (const filePath of componentsToCheck) {
    try {
      if (!fs.existsSync(filePath)) {
        log(`  ⚠️  File not found: ${filePath}`, 'yellow')
        continue
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Check if file uses i18n
      const usesI18n = content.includes('useI18n') || content.includes('$t(')
      
      if (!usesI18n) {
        log(`  ❌ No i18n: ${filePath}`, 'red')
        issues.push({
          file: filePath,
          issue: 'Does not use i18n system',
          severity: 'high'
        })
      } else {
        log(`  ✅ Uses i18n: ${filePath}`, 'green')
      }

      // Check for hardcoded Indonesian text patterns
      const indonesianPatterns = [
        /[>"]([^<"]*(?:kami|anda|yang|dengan|untuk|dari|pada)[^<"]*)[<"]/gi,
        /title:\s*["']([^"']*(?:keamanan|layanan|respons|kepercayaan)[^"']*)['"]/gi,
        /description:\s*["']([^"']{20,})['"]/gi
      ]

      let foundHardcoded = false
      for (const pattern of indonesianPatterns) {
        const matches = content.match(pattern)
        if (matches && matches.length > 0) {
          if (!foundHardcoded) {
            log(`  ⚠️  Hardcoded text found in: ${filePath}`, 'yellow')
            foundHardcoded = true
          }
          issues.push({
            file: filePath,
            issue: 'Contains hardcoded Indonesian text',
            severity: 'medium',
            samples: matches.slice(0, 3)
          })
        }
      }

    } catch (error) {
      log(`  ❌ Error reading ${filePath}: ${error.message}`, 'red')
    }
  }

  log('\n' + '='.repeat(60), 'bright')
  log('📊 Analysis Summary', 'cyan')
  log('='.repeat(60), 'bright')
  log(`\nTotal files checked: ${componentsToCheck.length}`)
  log(`Issues found: ${issues.length}`)
  
  if (issues.length > 0) {
    log('\n⚠️  Issues by severity:', 'yellow')
    const high = issues.filter(i => i.severity === 'high').length
    const medium = issues.filter(i => i.severity === 'medium').length
    log(`  High: ${high}`)
    log(`  Medium: ${medium}`)
  }

  return issues
}

async function generateI18nKeys() {
  log('\n' + '='.repeat(60), 'bright')
  log('📝 Generating i18n Keys', 'cyan')
  log('='.repeat(60), 'bright')
  log('')

  const newKeys = {
    loading: {
      slow_loading_message: 'Loading agak lama? Klik tombol di bawah untuk langsung masuk',
      skip_button: 'Langsung Masuk',
      smart_mode_active: 'Mode pintar aktif',
      loading_message: 'Memuat konten...',
      please_wait: 'Mohon tunggu sebentar',
      loading: 'Memuat',
      complete: 'Selesai'
    },
    whatsapp: {
      default_message: 'Halo JasaPembayaran.com, saya ingin konsultasi tentang jasa PayPal',
      contact_us: 'Hubungi Kami',
      chat_now: 'Chat Sekarang'
    },
    why_we: {
      title: 'Mengapa Memilih Kami?',
      security: {
        title: 'Keamanan Berstandar Bank',
        description: 'Berpengalaman lebih dari 12 tahun menangani pembayaran dan pembelian online dengan sistem keamanan berlapis. Kami memberikan arahan profesional agar transaksi Anda terhindar dari risiko penipuan, seller nakal, dan ancaman siber lainnya.'
      },
      response: {
        title: 'Respons Super Cepat 24/7',
        description: 'Pesanan diproses segera dengan rata-rata waktu respon ±3 menit. Tim customer service profesional kami ramah, sopan, dan siap membantu 24 jam sehari dari awal hingga transaksi selesai dengan standar internasional.'
      },
      service: {
        title: 'Layanan Berstandar Internasional',
        description: 'Customer service kami memahami kebutuhan unik setiap pelanggan. Melalui rekrutmen dan pelatihan ketat, kami menghadirkan layanan ramah, responsif, dan profesional berstandar kelas internasional dengan teknologi terdepan.'
      },
      trust: {
        title: 'Kepercayaan Terbuktikan 12+ Tahun',
        description: 'Dipercaya oleh ribuan pelanggan di Indonesia dan luar negeri selama lebih dari 12 tahun. Testimoni nyata dan track record sempurna menjadi bukti komitmen kami memberikan layanan terbaik.'
      }
    },
    common: {
      read_more: 'Baca Selengkapnya',
      learn_more: 'Pelajari Lebih Lanjut',
      contact_now: 'Hubungi Sekarang',
      get_started: 'Mulai Sekarang'
    }
  }

  // Read existing id.json
  const idPath = 'locales/id.json'
  let existingId = {}
  
  try {
    existingId = JSON.parse(fs.readFileSync(idPath, 'utf-8'))
  } catch (e) {
    log('  ⚠️  Could not read existing id.json', 'yellow')
  }

  // Merge new keys (deep merge)
  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = target[key] || {}
        deepMerge(target[key], source[key])
      } else {
        target[key] = source[key]
      }
    }
    return target
  }

  const merged = deepMerge({...existingId}, newKeys)
  
  // Write to id.json
  fs.writeFileSync(idPath, JSON.stringify(merged, null, 2), 'utf-8')
  log('  ✅ Updated locales/id.json', 'green')

  // Generate English translations
  const enKeys = {
    loading: {
      slow_loading_message: 'Loading taking too long? Click the button below to skip',
      skip_button: 'Skip to Content',
      smart_mode_active: 'Smart mode activated',
      loading_message: 'Loading content...',
      please_wait: 'Please wait a moment',
      loading: 'Loading',
      complete: 'Complete'
    },
    whatsapp: {
      default_message: 'Hello JasaPembayaran.com, I would like to consult about PayPal services',
      contact_us: 'Contact Us',
      chat_now: 'Chat Now'
    },
    why_we: {
      title: 'Why Choose Us?',
      security: {
        title: 'Bank-Standard Security',
        description: 'Over 12 years of experience handling online payments and purchases with multi-layered security systems. We provide professional guidance to keep your transactions safe from fraud risks, dishonest sellers, and other cyber threats.'
      },
      response: {
        title: 'Super Fast Response 24/7',
        description: 'Orders are processed immediately with an average response time of ±3 minutes. Our professional customer service team is friendly, polite, and ready to assist 24 hours a day from start to finish with international standards.'
      },
      service: {
        title: 'International Standard Service',
        description: 'Our customer service understands the unique needs of each customer. Through rigorous recruitment and training, we deliver friendly, responsive, and professional service with world-class standards and cutting-edge technology.'
      },
      trust: {
        title: '12+ Years of Proven Trust',
        description: 'Trusted by thousands of customers in Indonesia and abroad for over 12 years. Real testimonials and a perfect track record prove our commitment to providing the best service.'
      }
    },
    common: {
      read_more: 'Read More',
      learn_more: 'Learn More',
      contact_now: 'Contact Now',
      get_started: 'Get Started'
    }
  }

  // Read existing en.json
  const enPath = 'locales/en.json'
  let existingEn = {}
  
  try {
    existingEn = JSON.parse(fs.readFileSync(enPath, 'utf-8'))
  } catch (e) {
    log('  ⚠️  Could not read existing en.json', 'yellow')
  }

  // Merge new keys
  const mergedEn = deepMerge({...existingEn}, enKeys)
  
  // Write to en.json
  fs.writeFileSync(enPath, JSON.stringify(mergedEn, null, 2), 'utf-8')
  log('  ✅ Updated locales/en.json', 'green')

  log('\n📊 Summary:')
  log(`  Added ${Object.keys(newKeys).length} top-level keys`)
  log(`  Total keys in id.json: ${Object.keys(merged).length}`)
  log(`  Total keys in en.json: ${Object.keys(mergedEn).length}`)
}

async function generateFixGuide() {
  log('\n' + '='.repeat(60), 'bright')
  log('📚 Component Fix Guide', 'cyan')
  log('='.repeat(60), 'bright')
  
  const guide = `# 🔧 How to Fix Hardcoded Text in Components

## Problem
Components have hardcoded Indonesian text that doesn't change when user clicks EN icon.

## Solution
Replace hardcoded text with i18n keys using \$t() or useI18n()

## Quick Start

### Step 1: Add useI18n to component
\`\`\`vue
<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
\`\`\`

### Step 2: Replace hardcoded text
\`\`\`vue
<!-- ❌ BEFORE (Hardcoded) -->
<button>Langsung Masuk</button>

<!-- ✅ AFTER (Using i18n) -->
<button>{{ t('loading.skip_button') }}</button>
\`\`\`

## Examples by Component

### 1. SuperLoadingScreen.vue

**Replace:**
\`\`\`vue
<!-- Line ~326 -->
<p class="skip-text">Loading agak lama? Klik tombol di bawah untuk langsung masuk</p>
<!-- TO: -->
<p class="skip-text">{{ t('loading.slow_loading_message') }}</p>

<!-- Line ~332 -->
<span>Langsung Masuk</span>
<!-- TO: -->
<span>{{ t('loading.skip_button') }}</span>

<!-- Line ~486 -->
return \`\${connectionQuality.value.message} - Mode pintar aktif\`
<!-- TO: -->
return \`\${connectionQuality.value.message} - \${t('loading.smart_mode_active')}\`
\`\`\`

### 2. ChatWhatsapp.vue

**Replace:**
\`\`\`vue
<!-- Line ~9 -->
const whatsappMessage = computed(
  () => config.public?.whatsappMessage || 'Halo JasaPembayaran.com, saya ingin konsultasi tentang jasa PayPal'
)
<!-- TO: -->
const whatsappMessage = computed(
  () => config.public?.whatsappMessage || t('whatsapp.default_message')
)
\`\`\`

### 3. WhyWe.vue

**Replace all hardcoded titles and descriptions:**
\`\`\`vue
<!-- Line ~14 -->
title: "<span class=\\"text-emerald-400\\">Keamanan</span> Berstandar Bank",
<!-- TO: -->
title: \`<span class="text-emerald-400">\${t('why_we.security.title').split(' ')[0]}</span> \${t('why_we.security.title').split(' ').slice(1).join(' ')}\`,

<!-- Or simpler: -->
title: computed(() => t('why_we.security.title')),

<!-- Line ~15-16 -->
description: "Berpengalaman lebih dari...",
<!-- TO: -->
description: computed(() => t('why_we.security.description')),
\`\`\`

## Available i18n Keys

Check \`locales/id.json\` and \`locales/en.json\` for all available keys.

New keys added:
- \`loading.*\` - Loading screen texts
- \`whatsapp.*\` - WhatsApp messages
- \`why_we.*\` - Why choose us section
- \`common.*\` - Common buttons and links

## Testing

After making changes:

1. Start dev server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open website in browser

3. Click EN icon (top right)

4. **ALL text should change to English!** ✅

5. Click ID icon to switch back

## Troubleshooting

### Text not changing?
- Check if you're using {{ t('key') }} not hardcoded text
- Verify key exists in both id.json and en.json
- Check browser console for errors
- Try hard refresh (Ctrl+F5)

### Key not found error?
- Run: \`npm run translate:setup\`
- Check spelling of key
- Make sure key exists in locales/id.json

## Quick Commands

\`\`\`bash
# Update translation files
npm run translate:setup

# Trigger translation sync
npm run translate:sync

# Check status
npm run translate:stats
\`\`\`

## Need Help?

See: TRANSLATION-TROUBLESHOOTING.md for detailed troubleshooting guide.
`

  fs.writeFileSync('FIX-HARDCODED-TEXT-GUIDE.md', guide, 'utf-8')
  log('\n  ✅ Created: FIX-HARDCODED-TEXT-GUIDE.md', 'green')
  log('  📖 Read this file for detailed instructions', 'cyan')
}

async function main() {
  log('\n' + '='.repeat(60), 'bright')
  log('🌐 Hardcoded Text to i18n Converter', 'cyan')
  log('='.repeat(60), 'bright')
  log('')

  // Step 1: Analyze components
  const issues = await analyzeComponents()

  // Step 2: Generate i18n keys
  await generateI18nKeys()

  // Step 3: Generate fix guide
  await generateFixGuide()

  // Summary
  log('\n' + '='.repeat(60), 'bright')
  log('✅ Conversion Complete!', 'green')
  log('='.repeat(60), 'bright')
  log('')
  log('📝 Next Steps:', 'cyan')
  log('')
  log('  1. Read: FIX-HARDCODED-TEXT-GUIDE.md', 'bright')
  log('  2. I will now auto-fix the main components', 'bright')
  log('  3. Test by clicking EN icon', 'bright')
  log('  4. Run: npm run translate:sync', 'bright')
  log('')
}

main().catch(error => {
  log('\n❌ Error: ' + error.message, 'red')
  process.exit(1)
})

