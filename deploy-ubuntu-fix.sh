#!/bin/bash

# Complete Ubuntu Deployment Script
# This script builds and deploys the application on Ubuntu VPS

set -e  # Exit on any error

echo "🚀 Starting Ubuntu deployment..."

# Check Node.js version
echo "📋 Checking Node.js version..."
node --version

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project directory?"
    exit 1
fi

# Stop existing PM2 process
echo "⏹️  Stopping existing PM2 process..."
pm2 stop jasapembayaran-new 2>/dev/null || echo "Process not running"
pm2 delete jasapembayaran-new 2>/dev/null || echo "Process not found"

# Kill any process on port 3000
echo "🔫 Killing any process on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process on port 3000"

# Clean old build artifacts
echo "🧹 Cleaning old build artifacts..."
rm -rf .nuxt .output

# Wait a moment
sleep 2

# Build the application
echo "🔨 Building application..."
export NODE_ENV=production
export PLATFORM=linux
export SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Build and filter out cosmetic warnings (doesn't affect functionality)
echo "Note: Filtering cosmetic warnings (these don't affect the build)..."
npm run build:ubuntu 2>&1 | \
  grep -v "deep' is not recognized" | \
  grep -v "Did you mean '::deep'" | \
  grep -v "Found.*warnings while optimizing" | \
  grep -v "Issue #" | \
  grep -v "┆" | \
  grep -v "│" | \
  grep -v "Sourcemap is likely to be incorrect" | \
  grep -v "@tailwindcss/vite:generate:build" | \
  grep -v "Some chunks are larger" | \
  grep -v "chunkSizeWarningLimit" | \
  grep -v "dynamic import()" | \
  grep -v "manualChunks" | \
  grep -v "user-select: none" | \
  grep -v "display: grid" | \
  grep -v "opacity:" | \
  grep -v "transform:" | \
  grep -v "\.partner-card" | \
  grep -v "\.trusted-" || true

# Check if build was successful
if [ ! -d ".output" ]; then
    echo "❌ Build failed: .output directory not created"
    exit 1
fi

if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ Build failed: .output/server/index.mjs not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Create logs directory
mkdir -p logs

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.ubuntu.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 to run on startup
echo "⚙️  Setting up PM2 startup..."
pm2 startup || echo "PM2 startup already configured"

# Wait for application to start
echo "⏳ Waiting for application to start..."
sleep 5

# Check status
echo ""
echo "📊 Application Status:"
pm2 status

echo ""
echo "🌐 Testing application..."
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo "✅ Application is responding!"
else
    echo "⚠️  Warning: Application might not be responding correctly"
    echo "   Check logs with: pm2 logs jasapembayaran-new"
fi

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: pm2 logs jasapembayaran-new"
echo "   - View errors: pm2 logs jasapembayaran-new --err"
echo "   - Monitor: pm2 monit"
echo "   - Restart: ./restart-ubuntu.sh"
echo "   - Stop: pm2 stop jasapembayaran-new"

