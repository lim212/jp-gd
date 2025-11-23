#!/bin/bash

# Script to setup auto-cleanup cron job for VPS
# This prevents disk space issues by automatically cleaning up old files

set -e

echo "🔧 Setting up Auto-Cleanup Cron Job..."
echo ""

# Get current directory
PROJECT_DIR=$(pwd)
NPM_PATH=$(which npm)

echo "📋 Configuration:"
echo "   Project directory: $PROJECT_DIR"
echo "   npm path: $NPM_PATH"
echo ""

# Check if cron entry already exists
CRON_ENTRY_EXISTS=$(crontab -l 2>/dev/null | grep -c "disk:auto-cleanup" || echo "0")

if [ "$CRON_ENTRY_EXISTS" -gt "0" ]; then
  echo "⚠️  Auto-cleanup cron job already exists"
  echo ""
  echo "Current cron entries:"
  crontab -l | grep "disk:auto-cleanup"
  echo ""
  read -p "Do you want to remove existing entries and create new ones? (y/n) " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Remove existing entries
    crontab -l 2>/dev/null | grep -v "disk:auto-cleanup" | crontab -
    echo "✅ Removed existing cron entries"
  else
    echo "❌ Cancelled. Exiting."
    exit 0
  fi
fi

# Create cron entries
echo "📝 Creating cron entries..."

# Backup current crontab
crontab -l > /tmp/crontab_backup_$(date +%s) 2>/dev/null || true

# Add new cron entries
(crontab -l 2>/dev/null; echo "") | \
  (grep -v "disk:auto-cleanup" || true) | \
  (grep -v "pm2 flush" || true) | \
  cat - >> /tmp/new_crontab || true

# Add auto-cleanup cron (every day at 2 AM)
echo "0 2 * * * cd $PROJECT_DIR && $NPM_PATH run disk:auto-cleanup >> $PROJECT_DIR/logs/cleanup.log 2>&1" >> /tmp/new_crontab

# Add PM2 log flush (every Sunday at 3 AM)
echo "0 3 * * 0 cd $PROJECT_DIR && pm2 flush jasapembayaran-new >> $PROJECT_DIR/logs/cleanup.log 2>&1" >> /tmp/new_crontab

# Install new crontab
crontab /tmp/new_crontab
rm /tmp/new_crontab

echo "✅ Auto-cleanup cron job installed successfully!"
echo ""
echo "📋 Cron Schedule:"
echo "   - Disk cleanup: Every day at 2:00 AM"
echo "   - PM2 log flush: Every Sunday at 3:00 AM"
echo ""
echo "📝 To view cron entries:"
echo "   crontab -l"
echo ""
echo "🗑️  To remove cron entries:"
echo "   crontab -e"
echo "   (Then delete the lines with disk:auto-cleanup)"
echo ""
echo "✅ Setup completed!"

