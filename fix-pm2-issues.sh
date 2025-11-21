#!/bin/bash

# Fix PM2 Issues Script for Jasapembayaran.com
# This script fixes common PM2 issues on Ubuntu VPS

set -e  # Exit on any error

echo "🔧 Fixing PM2 Issues for JasaPembayaran.com"
echo "==========================================="

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Installing PM2..."
    npm install -g pm2
    echo "✅ PM2 installed"
else
    echo "✅ PM2 is already installed"
fi

# Stop and delete existing processes
echo "🛑 Stopping and deleting existing PM2 processes..."
pm2 stop jasapembayaran-new 2>/dev/null || echo "No existing process to stop"
pm2 stop jasapembayaran 2>/dev/null || echo "No existing process to stop"
pm2 delete jasapembayaran-new 2>/dev/null || echo "No existing process to delete"
pm2 delete jasapembayaran 2>/dev/null || echo "No existing process to delete"
echo "✅ Existing processes cleaned"

# Kill any remaining processes
echo "🔪 Killing any remaining Node.js processes..."
pkill -f "node.*jasapembayaran" 2>/dev/null || echo "No processes to kill"
pkill -f "nuxt.*start" 2>/dev/null || echo "No processes to kill"
echo "✅ Remaining processes killed"

# Verify build output exists
echo "🔍 Verifying build output..."
if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ Build output not found. Please run build first:"
    echo "   npm run build:ubuntu"
    exit 1
fi
echo "✅ Build output verified"

# Check ecosystem.config.js
echo "⚙️  Checking PM2 configuration..."
if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ ecosystem.config.js not found"
    exit 1
fi
echo "✅ PM2 configuration found"

# Start with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Wait a moment for startup
sleep 3

# Check status
echo "📊 Checking PM2 status..."
pm2 status

# Show logs
echo "📋 Showing recent logs..."
pm2 logs jasapembayaran-new --lines 20

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Setup PM2 startup
echo "🔄 Setting up PM2 startup..."
pm2 startup 2>/dev/null || echo "PM2 startup already configured"

echo ""
echo "🎉 PM2 issues fixed successfully!"
echo "==========================================="
echo "✅ PM2 processes cleaned"
echo "✅ Build output verified"
echo "✅ Application started with PM2"
echo "✅ PM2 configuration saved"
echo ""
echo "📋 Useful PM2 commands:"
echo "  pm2 status                    - Check process status"
echo "  pm2 logs jasapembayaran-new   - View logs"
echo "  pm2 restart jasapembayaran-new - Restart application"
echo "  pm2 stop jasapembayaran-new   - Stop application"
echo "  pm2 monit                     - Monitor processes"
echo ""
echo "🌐 Your application should be accessible at:"
echo "  http://localhost:3000"
echo "  http://your-server-ip:3000"
echo ""
