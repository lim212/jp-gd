#!/usr/bin/env node

// Script untuk upgrade ke optimized blog system
import { promises as fs } from 'fs'
import path from 'path'

console.log('🚀 Upgrading to Optimized Blog System...')

async function upgradeToOptimizedBlog() {
  try {
    // 1. Backup current configuration
    console.log('📦 Creating backup of current configuration...')
    const backupDir = `backup-${Date.now()}`
    await fs.mkdir(backupDir, { recursive: true })
    
    const filesToBackup = [
      'server/plugins/auto-blog-scheduler.server.ts',
      'server/plugins/enhanced-auto-scheduler.server.ts',
      'nuxt.config.ts'
    ]
    
    for (const file of filesToBackup) {
      try {
        await fs.copyFile(file, path.join(backupDir, path.basename(file)))
        console.log(`✅ Backed up: ${file}`)
      } catch (error) {
        console.log(`⚠️ Could not backup ${file}: ${error.message}`)
      }
    }
    
    // 2. Update nuxt.config.ts to include optimized blog settings
    console.log('⚙️ Updating nuxt.config.ts...')
    const nuxtConfigPath = 'nuxt.config.ts'
    let nuxtConfig = await fs.readFile(nuxtConfigPath, 'utf-8')
    
    // Add optimized blog configuration
    const optimizedBlogConfig = `
    // Optimized Blog Configuration
    enableOptimizedBlog: process.env.NUXT_USE_OPTIMIZED_BLOG === 'true',
    blogQualityThreshold: process.env.BLOG_QUALITY_THRESHOLD || '70',
    blogMaxRetries: process.env.BLOG_MAX_RETRIES || '3',`
    
    if (!nuxtConfig.includes('enableOptimizedBlog')) {
      nuxtConfig = nuxtConfig.replace(
        /enableAutoBlog: process\.env\.NUXT_ENABLE_AUTO_BLOG === 'true',/,
        `enableAutoBlog: process.env.NUXT_ENABLE_AUTO_BLOG === 'true',${optimizedBlogConfig}`
      )
      await fs.writeFile(nuxtConfigPath, nuxtConfig)
      console.log('✅ Updated nuxt.config.ts with optimized blog settings')
    } else {
      console.log('✅ nuxt.config.ts already has optimized blog settings')
    }
    
    // 3. Create environment configuration
    console.log('🔧 Creating environment configuration...')
    const envConfig = `
# Optimized Blog System Configuration
NUXT_USE_OPTIMIZED_BLOG=true
BLOG_QUALITY_THRESHOLD=70
BLOG_MAX_RETRIES=3

# Existing Auto Blog Configuration
NUXT_ENABLE_AUTO_BLOG=true
`
    
    const envPath = '.env.optimized-blog'
    await fs.writeFile(envPath, envConfig)
    console.log('✅ Created .env.optimized-blog configuration')
    
    // 4. Create directories for quality reports
    console.log('📁 Creating directories for quality reports...')
    const directories = [
      'data/blog/quality-reports',
      'data/blog/quality-statistics'
    ]
    
    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true })
      console.log(`✅ Created directory: ${dir}`)
    }
    
    // 5. Create upgrade documentation
    console.log('📝 Creating upgrade documentation...')
    const upgradeDoc = `# Optimized Blog System Upgrade

## What's New

### 🎯 Enhanced Title Generation
- SEO-optimized titles (50-60 characters)
- Keyword placement optimization
- Engagement word integration
- Multiple title templates based on content type

### 📝 Improved Content Quality
- Structured content generation
- Multiple content types (beginner, advanced, tutorial, comparison)
- Enhanced readability scoring
- Better paragraph and sentence structure

### 🖼️ Advanced Image Generation
- Multiple image services with fallback
- Contextual image prompts
- Multiple image sizes (featured, blog, thumbnail, square)
- Social media optimized images

### 📊 Quality Control System
- Comprehensive quality validation
- SEO optimization checks
- Readability analysis
- Image quality validation
- Quality scoring and reporting

### 🔄 Retry Mechanism
- Automatic retry for low-quality content
- Quality threshold enforcement
- Best attempt selection
- Quality statistics tracking

## Configuration

### Environment Variables
\`\`\`bash
# Enable optimized blog system
NUXT_USE_OPTIMIZED_BLOG=true

# Quality threshold (0-100)
BLOG_QUALITY_THRESHOLD=70

# Maximum retries for quality improvement
BLOG_MAX_RETRIES=3

# Existing auto blog configuration
NUXT_ENABLE_AUTO_BLOG=true
\`\`\`

### API Endpoints
- \`/api/blog/quality-report?slug=<blog-slug>\` - Get quality report for specific blog
- \`/api/blog/quality-statistics\` - Get overall quality statistics

## Usage

1. Set environment variables
2. Restart the application
3. Monitor quality reports in \`data/blog/quality-reports/\`
4. Check quality statistics via API

## Quality Metrics

### Title Quality
- Length optimization (30-60 characters)
- Keyword presence
- SEO keyword integration
- Engagement word usage

### Content Quality
- Word count (800-2000 words)
- Structure validation
- Required sections presence
- HTML structure validation

### SEO Quality
- Keyword density (0.5-3%)
- Heading structure
- Internal linking
- Meta data optimization

### Readability Quality
- Sentence length optimization
- Paragraph length control
- Reading level assessment
- Content flow analysis

## Monitoring

Quality reports are automatically generated for each blog and saved to:
- \`data/blog/quality-reports/<slug>-quality.json\`

Overall statistics are tracked in:
- \`data/blog/quality-statistics.json\`

## Rollback

If you need to rollback to the previous system:
1. Set \`NUXT_USE_OPTIMIZED_BLOG=false\`
2. Restart the application
3. The system will use the standard blog scheduler

## Support

For issues or questions about the optimized blog system, check:
1. Quality reports for specific blogs
2. Quality statistics for overall performance
3. Application logs for generation details
`
    
    await fs.writeFile('OPTIMIZED-BLOG-UPGRADE.md', upgradeDoc)
    console.log('✅ Created OPTIMIZED-BLOG-UPGRADE.md documentation')
    
    // 6. Create test script
    console.log('🧪 Creating test script...')
    const testScript = `#!/usr/bin/env node

// Test script for optimized blog system
import OptimizedBlogScheduler from './server/utils/optimized-blog-scheduler.js'

async function testOptimizedBlog() {
  console.log('🧪 Testing Optimized Blog System...')
  
  try {
    const scheduler = new OptimizedBlogScheduler()
    await scheduler.init()
    
    // Test with a sample keyword
    const testKeyword = { id: 1, keyword: 'jasa paypal test' }
    
    console.log('📝 Testing blog generation...')
    const blog = await scheduler.generateOptimizedBlog(testKeyword)
    
    console.log('✅ Blog generated successfully!')
    console.log(\`📊 Quality Score: \${blog.qualityReport.overall.score}/100 (\${blog.qualityReport.overall.grade})\`)
    console.log(\`📝 Title: \${blog.title}\`)
    console.log(\`📄 Content Length: \${blog.content.length} characters\`)
    console.log(\`🖼️ Image: \${blog.image}\`)
    
    // Save test blog
    await scheduler.saveOptimizedBlog(blog)
    console.log('✅ Test blog saved successfully!')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  }
}

testOptimizedBlog()
`
    
    await fs.writeFile('test-optimized-blog.js', testScript)
    console.log('✅ Created test-optimized-blog.js')
    
    console.log('\\n🎉 Optimized Blog System Upgrade Complete!')
    console.log('\\n📋 Next Steps:')
    console.log('1. Set NUXT_USE_OPTIMIZED_BLOG=true in your environment')
    console.log('2. Restart your application')
    console.log('3. Run: node test-optimized-blog.js (to test the system)')
    console.log('4. Monitor quality reports in data/blog/quality-reports/')
    console.log('5. Check API endpoints for quality statistics')
    console.log('\\n📚 Documentation: OPTIMIZED-BLOG-UPGRADE.md')
    console.log('🔧 Configuration: .env.optimized-blog')
    console.log('📦 Backup: ' + backupDir)
    
  } catch (error) {
    console.error('❌ Upgrade failed:', error)
    process.exit(1)
  }
}

upgradeToOptimizedBlog()
