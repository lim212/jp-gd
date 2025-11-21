#!/bin/bash

# Ubuntu VPS Deployment Script for JasaPembayaran.com
# This script ensures proper build and deployment on Ubuntu VPS

set -e  # Exit on any error

echo "🚀 Starting Ubuntu VPS Deployment for JasaPembayaran.com"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node --version)
echo "✅ Node.js version: $node_version"

# Check npm version
echo "📋 Checking npm version..."
npm_version=$(npm --version)
echo "✅ npm version: $npm_version"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .nuxt .output node_modules/.cache

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production=false

# Build the application
echo "🔨 Building application for Ubuntu VPS..."
export NODE_ENV=production
export NODE_OPTIONS="--max-old-space-size=16384"
export SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Run the build
npm run build:ubuntu

# Verify build output
echo "🔍 Verifying build output..."
if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ Error: Build output not found at .output/server/index.mjs"
    echo "Build failed. Please check the build logs above."
    exit 1
fi

echo "✅ Build output verified: .output/server/index.mjs exists"

# Check PM2 status
echo "📋 Checking PM2 status..."
if command -v pm2 &> /dev/null; then
    echo "✅ PM2 is installed"
    
    # Stop existing process if running
    echo "🛑 Stopping existing PM2 process..."
    pm2 stop jasapembayaran-new 2>/dev/null || echo "No existing process to stop"
    pm2 delete jasapembayaran-new 2>/dev/null || echo "No existing process to delete"
    
    # Start with PM2
    echo "🚀 Starting application with PM2..."
    pm2 start ecosystem.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    
    # Show status
    echo "📊 PM2 Status:"
    pm2 status
    
    echo "📋 PM2 Logs (last 10 lines):"
    pm2 logs jasapembayaran-new --lines 10
    
else
    echo "⚠️  PM2 not found. Starting with npm start..."
    npm start
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "=================================================="
echo "✅ Application is now running"
echo "✅ Build output verified"
echo "✅ PM2 process started"
echo ""
echo "📋 Useful commands:"
echo "  pm2 status                    - Check process status"
echo "  pm2 logs jasapembayaran-new   - View logs"
echo "  pm2 restart jasapembayaran-new - Restart application"
echo "  pm2 stop jasapembayaran-new   - Stop application"
echo ""
echo "🌐 Your application should be accessible at:"
echo "  http://localhost:3000"
echo "  http://your-server-ip:3000"
echo ""
