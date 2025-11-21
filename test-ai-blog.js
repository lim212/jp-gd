// Test AI Blog Generator
// Usage: node test-ai-blog.js

const API_URL = 'http://localhost:3000'
const ADMIN_TOKEN = process.env.ADMIN_API_TOKEN || 'your-secret-admin-token-here'

async function checkStatus() {
  console.log('\n🔍 Checking AI Blog Scheduler Status...\n')
  
  try {
    const response = await fetch(`${API_URL}/api/ai-blog/status`)
    const data = await response.json()
    
    console.log('📊 STATUS REPORT')
    console.log('='.repeat(60))
    console.log(`✅ Status: ${data.status}`)
    console.log(`🤖 AI Enabled: ${data.scheduler.enabled}`)
    console.log(`🔑 OpenAI Key: ${data.scheduler.hasAIKey ? '✅ Set' : '❌ Missing'}`)
    console.log(`📅 Next Run: ${new Date(data.scheduler.nextRunTime).toLocaleString('id-ID')}`)
    console.log(`⏰ Hours Until Next: ${data.scheduler.hoursUntilNextRun}h`)
    console.log(`📈 Total Generated: ${data.rotation.totalGenerated}`)
    console.log(`📍 Progress: ${data.rotation.progress}`)
    console.log(`📚 Total Blogs: ${data.database.totalBlogs}`)
    
    if (data.database.latestBlog) {
      console.log(`\n📰 Latest Blog:`)
      console.log(`   Title: ${data.database.latestBlog.title}`)
      console.log(`   Slug: ${data.database.latestBlog.slug}`)
      console.log(`   Date: ${new Date(data.database.latestBlog.date).toLocaleString('id-ID')}`)
    }
    
    console.log('='.repeat(60))
    
    // Warnings
    if (!data.scheduler.hasAIKey) {
      console.log('\n⚠️  WARNING: OpenAI API key not set!')
      console.log('   Set OPENAI_API_KEY in your .env file')
    }
    
    if (!data.scheduler.enabled) {
      console.log('\n⚠️  WARNING: Scheduler is disabled!')
      console.log('   Set NUXT_ENABLE_AI_BLOG=true in your .env file')
    }
    
    return data
    
  } catch (error) {
    console.error('❌ Error checking status:', error.message)
    return null
  }
}

async function testGeneration(keyword = 'jasa pembayaran paypal', count = 1) {
  console.log(`\n🧪 Testing AI Generation...\n`)
  console.log(`🔑 Keyword: "${keyword}"`)
  console.log(`🎯 Count: ${count} article(s)`)
  console.log('⏳ This may take 1-2 minutes per article...\n')
  
  try {
    const response = await fetch(`${API_URL}/api/ai-blog/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      body: JSON.stringify({ keyword, count })
    })
    
    const data = await response.json()
    
    if (data.success) {
      console.log('✅ GENERATION SUCCESSFUL!')
      console.log('='.repeat(60))
      console.log(`Generated: ${data.generated}/${count}`)
      console.log(`Failed: ${data.failed}`)
      
      if (data.results && data.results.length > 0) {
        console.log('\n📚 Generated Articles:')
        data.results.forEach((result, idx) => {
          if (result.success) {
            console.log(`\n${idx + 1}. "${result.title}"`)
            console.log(`   Words: ${result.wordCount}`)
            console.log(`   Category: ${result.seo.category}`)
            console.log(`   Tags: ${result.seo.tags.join(', ')}`)
          } else {
            console.log(`\n${idx + 1}. ❌ Failed: ${result.error}`)
          }
        })
      }
      
      console.log('='.repeat(60))
    } else {
      console.log('❌ GENERATION FAILED!')
      console.log(`Error: ${data.error || data.message}`)
    }
    
    return data
    
  } catch (error) {
    console.error('❌ Error testing generation:', error.message)
    return null
  }
}

async function runTests() {
  console.log('\n' + '='.repeat(70))
  console.log('🧪 AI BLOG GENERATOR - TEST SUITE')
  console.log('='.repeat(70))
  
  // Test 1: Check Status
  console.log('\n📋 Test 1: System Status Check')
  const status = await checkStatus()
  
  if (!status) {
    console.log('\n❌ Cannot proceed - Server not responding')
    console.log('   Make sure server is running: npm run dev')
    return
  }
  
  if (!status.scheduler.hasAIKey) {
    console.log('\n⚠️  Cannot test generation - OpenAI key not set')
    console.log('   Skipping generation test...')
    return
  }
  
  // Test 2: Generate 1 article
  console.log('\n📋 Test 2: Generate Single Article')
  const testKeyword = 'jasa pembayaran paypal terpercaya'
  await testGeneration(testKeyword, 1)
  
  console.log('\n' + '='.repeat(70))
  console.log('✅ ALL TESTS COMPLETED')
  console.log('='.repeat(70))
  console.log('\n💡 Next Steps:')
  console.log('   1. Check generated blog at: /blog/jasa-pembayaran-paypal-terpercaya')
  console.log('   2. Verify image saved in: public/images/blog/')
  console.log('   3. Check database: database/content/generated-blogs.json')
  console.log('   4. Monitor logs for any warnings')
  console.log('   5. Let scheduler run automatically at 3 AM daily')
  console.log('\n')
}

// Run tests
runTests().catch(console.error)

