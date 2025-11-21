#!/bin/bash

echo "🔧 Fixing Ubuntu Build Issues..."

# Stop PM2 process
echo "⏹️ Stopping PM2 process..."
pm2 stop jasapembayaran-new || true
pm2 delete jasapembayaran-new || true

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .nuxt
rm -rf .output
rm -rf .output-build
rm -rf dist
rm -rf node_modules/.cache

# Clear npm cache
echo "🗑️ Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "📦 Reinstalling dependencies..."
npm ci --production=false

# Rebuild sharp for Linux
echo "🔨 Rebuilding sharp for Linux..."
npm rebuild sharp

# Build the application
echo "🏗️ Building application..."
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=16384"
export PLATFORM=linux
export SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Run build with proper environment
npm run build:ubuntu

# Check if build was successful
if [ -f ".output/server/index.mjs" ]; then
    echo "✅ Build successful! File exists: .output/server/index.mjs"
    
    # Set proper permissions
    chmod +x .output/server/index.mjs
    
    # Start with PM2
    echo "🚀 Starting with PM2..."
    pm2 start ecosystem.config.js --env production
    
    # Show status
    echo "📊 PM2 Status:"
    pm2 status
    
    echo "✅ Ubuntu build fix completed successfully!"
else
    echo "❌ Build failed! File not found: .output/server/index.mjs"
    echo "📋 Checking build output..."
    ls -la .output/ || echo "No .output directory found"
    ls -la .output/server/ || echo "No .output/server directory found"
    exit 1
fi
