#!/bin/bash

# Ubuntu PM2 Restart Script
# This script properly restarts the application on Ubuntu VPS

echo "🔄 Restarting JasaPembayaran on Ubuntu..."

# Stop PM2 process
echo "⏹️  Stopping PM2 process..."
pm2 stop jasapembayaran-new 2>/dev/null || echo "Process not running"

# Delete PM2 process
echo "🗑️  Deleting PM2 process..."
pm2 delete jasapembayaran-new 2>/dev/null || echo "Process not found"

# Kill any process on port 3000
echo "🔫 Killing any process on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process on port 3000"

# Wait a moment
sleep 2

# Check if .output directory exists
if [ ! -d ".output" ]; then
    echo "❌ Error: .output directory not found. Please run 'npm run build:ubuntu' first."
    exit 1
fi

# Check if server file exists
if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ Error: .output/server/index.mjs not found. Please run 'npm run build:ubuntu' first."
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start PM2 with Ubuntu config
echo "🚀 Starting PM2 with Ubuntu configuration..."
pm2 start ecosystem.ubuntu.config.js --env production

# Save PM2 process list
echo "💾 Saving PM2 process list..."
pm2 save

# Show status
echo ""
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "✅ Restart completed!"
echo ""
echo "📝 Useful commands:"
echo "   - View logs: pm2 logs jasapembayaran-new"
echo "   - View errors: pm2 logs jasapembayaran-new --err"
echo "   - Monitor: pm2 monit"
echo "   - Stop: pm2 stop jasapembayaran-new"
echo "   - Restart: pm2 restart jasapembayaran-new"

