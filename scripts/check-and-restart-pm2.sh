#!/bin/bash
# Script to check PM2 status and restart if needed

echo "🔍 Checking PM2 status..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
  echo "❌ PM2 is not installed. Installing..."
  npm install -g pm2
fi

# Check PM2 status
pm2 status

# Check if app is running
if pm2 list | grep -q "jasapembayaran-new.*online"; then
  echo "✅ App is running"
else
  echo "⚠️  App is not running. Starting..."
  cd /home/nuxt/jasapembayaran-new
  pm2 start npm --name "jasapembayaran-new" -- start
  pm2 save
fi

# Check if port 3000 is in use
if lsof -i :3000 &> /dev/null; then
  echo "✅ Port 3000 is in use"
  lsof -i :3000 | head -5
else
  echo "❌ Port 3000 is not in use - app may not be running"
fi

# Show PM2 logs
echo ""
echo "📋 Recent PM2 logs:"
pm2 logs jasapembayaran-new --lines 20 --nostream

