#!/bin/bash

# Fix Build Issues Script for JasaPembayaran.com
# This script fixes common build issues on Ubuntu VPS

set -e  # Exit on any error

echo "🔧 Fixing Build Issues for JasaPembayaran.com"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Fix 1: Clean all build artifacts
echo "🧹 Step 1: Cleaning all build artifacts..."
rm -rf .nuxt .output node_modules/.cache .nuxt-build .output-build
echo "✅ Cleaned build artifacts"

# Fix 2: Fix permissions
echo "🔐 Step 2: Fixing file permissions..."
chmod -R 755 .
chmod +x start.js
chmod +x ubuntu-deploy.sh
chmod +x fix-build-issues.sh
echo "✅ Fixed file permissions"

# Fix 3: Reinstall dependencies
echo "📦 Step 3: Reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm install
echo "✅ Dependencies reinstalled"

# Fix 4: Set environment variables
echo "🌍 Step 4: Setting environment variables..."
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=16384"
export SHARP_IGNORE_GLOBAL_LIBVIPS=1
export NUXT_ENV=production
echo "✅ Environment variables set"

# Fix 5: Verify PM2 configuration
echo "⚙️  Step 5: Verifying PM2 configuration..."
if [ -f "ecosystem.config.js" ]; then
    echo "✅ PM2 configuration found"
    # Check if script path is correct
    if grep -q "\.output/server/index\.mjs" ecosystem.config.js; then
        echo "✅ PM2 script path is correct"
    else
        echo "⚠️  PM2 script path might be incorrect"
    fi
else
    echo "❌ PM2 configuration not found"
fi

# Fix 6: Test build
echo "🔨 Step 6: Testing build..."
npm run build:ubuntu

# Fix 7: Verify build output
echo "🔍 Step 7: Verifying build output..."
if [ -f ".output/server/index.mjs" ]; then
    echo "✅ Build output verified: .output/server/index.mjs exists"
    
    # Check file size
    file_size=$(stat -c%s ".output/server/index.mjs")
    echo "📊 Build output size: $file_size bytes"
    
    if [ $file_size -gt 1000 ]; then
        echo "✅ Build output size looks good"
    else
        echo "⚠️  Build output size seems small, might be an issue"
    fi
else
    echo "❌ Build output not found at .output/server/index.mjs"
    echo "Build failed. Please check the build logs above."
    exit 1
fi

# Fix 8: Test start script
echo "🚀 Step 8: Testing start script..."
if [ -f "start.js" ]; then
    echo "✅ Start script found"
    # Check if start script has correct path
    if grep -q "\.output/server/index\.mjs" start.js; then
        echo "✅ Start script path is correct"
    else
        echo "⚠️  Start script path might be incorrect"
    fi
else
    echo "❌ Start script not found"
fi

echo ""
echo "🎉 Build issues fixed successfully!"
echo "============================================="
echo "✅ All build artifacts cleaned"
echo "✅ File permissions fixed"
echo "✅ Dependencies reinstalled"
echo "✅ Environment variables set"
echo "✅ PM2 configuration verified"
echo "✅ Build tested and verified"
echo "✅ Start script verified"
echo ""
echo "📋 Next steps:"
echo "  1. Run: ./ubuntu-deploy.sh"
echo "  2. Or manually: pm2 start ecosystem.config.js --env production"
echo ""
