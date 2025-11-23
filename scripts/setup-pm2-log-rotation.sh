#!/bin/bash
# Script untuk setup PM2 log rotation module

echo "🔧 Setting up PM2 log rotation..."

# Install PM2 log rotation module jika belum ada
if ! pm2 list | grep -q "pm2-logrotate"; then
  echo "📦 Installing pm2-logrotate module..."
  pm2 install pm2-logrotate
else
  echo "✅ pm2-logrotate sudah terinstall"
fi

# Configure log rotation
echo "⚙️  Configuring log rotation..."

# Set max log size to 5MB
pm2 set pm2-logrotate:max_size 5M

# Keep only 3 rotated files
pm2 set pm2-logrotate:retain 3

# Compress old logs
pm2 set pm2-logrotate:compress true

# Rotate logs daily at midnight
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

# Don't rotate if log is empty
pm2 set pm2-logrotate:workerInterval 30

# Show current configuration
echo ""
echo "📋 Current PM2 log rotation configuration:"
pm2 conf pm2-logrotate

echo ""
echo "✅ PM2 log rotation configured!"
echo "   - Max size: 5MB per file"
echo "   - Retain: 3 files"
echo "   - Compress: enabled"
echo "   - Max total: ~15MB"

