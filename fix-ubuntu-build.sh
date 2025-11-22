#!/bin/bash

# Fix Ubuntu Build Issues Script
# Comprehensive script to fix and build on Ubuntu VPS

set -e  # Exit on error

echo "🔧 Fixing Ubuntu Build Issues..."

# Stop PM2 process
echo "⏹️  Stopping PM2 process..."
pm2 stop jasapembayaran-new 2>/dev/null || echo "  ℹ️  Process not running"
pm2 delete jasapembayaran-new 2>/dev/null || echo "  ℹ️  Process not found"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .nuxt .output .output-build dist node_modules/.cache || true

# Run cleanup script
echo "🧹 Running cleanup script..."
node scripts/clean-output.js || echo "  ⚠️  Cleanup script had issues, continuing..."

# Clear npm cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force || echo "  ⚠️  npm cache clean failed, continuing..."

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm ci --production=false || npm install

# Rebuild sharp for Linux
echo "🔨 Rebuilding sharp for Linux..."
npm rebuild sharp || echo "  ⚠️  Sharp rebuild failed, continuing..."

# Build the application
echo "🏗️  Building application..."
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=16384 --no-deprecation"
export PLATFORM=linux
export SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Run build
npm run build:ubuntu

# Check if build was successful
if [ -f ".output/server/index.mjs" ]; then
    echo ""
    echo "✅ Build successful! File exists: .output/server/index.mjs"
    
    # Set proper permissions
    chmod +x .output/server/index.mjs
    echo "  ✅ Set executable permissions"
    
    # Start with PM2
    echo ""
    echo "🚀 Starting with PM2..."
    pm2 start ecosystem.ubuntu.config.js --env production || pm2 start ecosystem.config.js --env production
    
    # Show status
    echo ""
    echo "📊 PM2 Status:"
    pm2 status
    
    echo ""
    echo "✅ Ubuntu build fix completed successfully!"
    exit 0
else
    echo ""
    echo "❌ Build failed! File not found: .output/server/index.mjs"
    echo "📋 Checking build output..."
    ls -la .output/ 2>/dev/null || echo "  No .output directory found"
    ls -la .output/server/ 2>/dev/null || echo "  No .output/server directory found"
    exit 1
fi
