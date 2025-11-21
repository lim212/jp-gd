#!/bin/bash

# AI Blog System Installation Script
# Automate setup untuk production

echo "=============================================="
echo "🚀 AI BLOG SYSTEM - AUTO INSTALLATION"
echo "=============================================="
echo ""

# Step 1: Install Dependencies
echo "📦 Step 1: Installing dependencies..."
npm install sharp
npm install --save-dev @types/sharp

echo "✅ Dependencies installed"
echo ""

# Step 2: Create necessary directories
echo "📁 Step 2: Creating directories..."
mkdir -p data/blog/generated
mkdir -p public/images/blog
mkdir -p database/content
mkdir -p data/analytics
mkdir -p content/blog
mkdir -p config

echo "✅ Directories created"
echo ""

# Step 3: Check environment variables
echo "🔍 Step 3: Checking environment..."

if [ -z "$OPENAI_API_KEY" ] && [ -z "$NUXT_OPENAI_API_KEY" ]; then
    echo "⚠️  WARNING: OpenAI API Key not set!"
    echo "   Please set OPENAI_API_KEY in your .env file"
    echo ""
    echo "   Get your key from: https://platform.openai.com/api-keys"
    echo ""
fi

if [ -z "$NUXT_ENABLE_AI_BLOG" ]; then
    echo "⚠️  WARNING: AI Blog Scheduler not enabled!"
    echo "   Set NUXT_ENABLE_AI_BLOG=true in your .env file"
    echo ""
fi

if [ -z "$WHATSAPP_NUMBER" ]; then
    echo "⚠️  WARNING: WhatsApp number not set!"
    echo "   Set WHATSAPP_NUMBER=+62xxx in your .env file"
    echo ""
fi

echo "✅ Environment check complete"
echo ""

# Step 4: Set permissions
echo "🔐 Step 4: Setting permissions..."
chmod -R 755 public/images/blog
chmod -R 755 data
chmod -R 755 database

echo "✅ Permissions set"
echo ""

# Step 5: Create example .env if not exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from example..."
    cp env.ai-blog.example .env
    echo "⚠️  IMPORTANT: Edit .env and add your OpenAI API key!"
    echo ""
fi

# Step 6: Test script permissions
echo "🧪 Step 6: Setting test script permissions..."
chmod +x test-ai-blog.js

echo "✅ Test script ready"
echo ""

# Step 7: Build application
echo "🏗️  Step 7: Building application..."
npm run build

echo "✅ Build complete"
echo ""

# Final summary
echo "=============================================="
echo "✅ INSTALLATION COMPLETE!"
echo "=============================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Edit .env file:"
echo "   nano .env"
echo ""
echo "2. Add your OpenAI API Key:"
echo "   OPENAI_API_KEY=sk-your-key-here"
echo ""
echo "3. Enable AI Scheduler:"
echo "   NUXT_ENABLE_AI_BLOG=true"
echo ""
echo "4. Set WhatsApp Number:"
echo "   WHATSAPP_NUMBER=+62xxx"
echo ""
echo "5. Test the system:"
echo "   node test-ai-blog.js"
echo ""
echo "6. Start server:"
echo "   npm run start"
echo ""
echo "7. Check status:"
echo "   curl http://localhost:3000/api/ai-blog/status"
echo ""
echo "=============================================="
echo "📚 Documentation:"
echo "   - QUICK-START-AI-BLOG.md"
echo "   - AI-BLOG-GENERATOR-SETUP.md"
echo "   - AI-BLOG-QUALITY-CHECKLIST.md"
echo "=============================================="
echo ""
echo "🎉 Ready to generate 10 articles per day!"
echo ""

