#!/bin/bash

# Script to clean up disk space on VPS
# Removes unnecessary files: old logs, old backups, cache, build artifacts

set -e

echo "🧹 Starting Disk Cleanup..."
echo ""

# Function to get directory size
get_size() {
  if [ -d "$1" ]; then
    du -sh "$1" 2>/dev/null | cut -f1
  else
    echo "0"
  fi
}

# Function to get file count
get_count() {
  if [ -d "$1" ]; then
    find "$1" -type f 2>/dev/null | wc -l
  else
    echo "0"
  fi
}

# Show initial disk usage
echo "📊 Initial Disk Usage:"
df -h . | tail -1
INITIAL_SIZE=$(du -sh . 2>/dev/null | cut -f1)
echo "  Current directory: $INITIAL_SIZE"
echo ""

TOTAL_FREED=0

# 1. Clean old PM2 logs (keep last 7 days)
echo "📋 1. Cleaning PM2 logs..."
if [ -d "logs" ]; then
  BEFORE_SIZE=$(get_size "logs")
  BEFORE_COUNT=$(get_count "logs")
  
  # Remove log files older than 7 days
  find logs -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true
  
  # Truncate large log files (keep last 1000 lines)
  for logfile in logs/*.log; do
    if [ -f "$logfile" ]; then
      LINES=$(wc -l < "$logfile" 2>/dev/null || echo "0")
      if [ "$LINES" -gt 10000 ]; then
        echo "  Truncating large log: $(basename $logfile) ($LINES lines)"
        tail -1000 "$logfile" > "${logfile}.tmp" && mv "${logfile}.tmp" "$logfile"
      fi
    fi
  done
  
  AFTER_SIZE=$(get_size "logs")
  AFTER_COUNT=$(get_count "logs")
  echo "  Before: $BEFORE_SIZE ($BEFORE_COUNT files)"
  echo "  After: $AFTER_SIZE ($AFTER_COUNT files)"
fi
echo ""

# 2. Clean old backups (keep last 7 days)
echo "📦 2. Cleaning old backups..."
if [ -d "backups" ]; then
  BEFORE_SIZE=$(get_size "backups")
  BEFORE_COUNT=$(find backups -type d -maxdepth 1 2>/dev/null | wc -l)
  
  # Remove backups older than 7 days
  find backups -type d -maxdepth 1 -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
  
  AFTER_SIZE=$(get_size "backups")
  AFTER_COUNT=$(find backups -type d -maxdepth 1 2>/dev/null | wc -l)
  echo "  Before: $BEFORE_SIZE ($BEFORE_COUNT directories)"
  echo "  After: $AFTER_SIZE ($AFTER_COUNT directories)"
fi
echo ""

# 3. Clean build artifacts (safe to remove, will be regenerated)
echo "🏗️  3. Cleaning build artifacts..."
if [ -d ".nuxt" ]; then
  BEFORE_SIZE=$(get_size ".nuxt")
  rm -rf .nuxt
  echo "  Removed .nuxt ($BEFORE_SIZE)"
fi

if [ -d ".output" ]; then
  BEFORE_SIZE=$(get_size ".output")
  rm -rf .output
  echo "  Removed .output ($BEFORE_SIZE)"
fi

if [ -d ".output-build" ]; then
  BEFORE_SIZE=$(get_size ".output-build")
  rm -rf .output-build
  echo "  Removed .output-build ($BEFORE_SIZE)"
fi
echo ""

# 4. Clean cache directories
echo "🗑️  4. Cleaning cache..."
if [ -d ".cache" ]; then
  BEFORE_SIZE=$(get_size ".cache")
  rm -rf .cache
  echo "  Removed .cache ($BEFORE_SIZE)"
fi

if [ -d "node_modules/.cache" ]; then
  BEFORE_SIZE=$(get_size "node_modules/.cache")
  rm -rf node_modules/.cache
  echo "  Removed node_modules/.cache ($BEFORE_SIZE)"
fi

# Clear npm cache
echo "  Clearing npm cache..."
npm cache clean --force 2>/dev/null || echo "  ⚠️  npm cache clean failed"
echo ""

# 5. Clean temporary files
echo "🧹 5. Cleaning temporary files..."
# Remove .tmp and .temp files older than 1 day
find . -name "*.tmp" -type f -mtime +1 -delete 2>/dev/null || true
find . -name "*.temp" -type f -mtime +1 -delete 2>/dev/null || true
echo "  Removed temporary files"
echo ""

# 6. Clean old blog generated files (optional - keep last 30 days)
echo "📝 6. Cleaning old blog generated files..."
if [ -d "data/blog/generated" ]; then
  BEFORE_SIZE=$(get_size "data/blog/generated")
  BEFORE_COUNT=$(get_count "data/blog/generated")
  
  # Remove blog files older than 30 days
  find data/blog/generated -type f -mtime +30 -delete 2>/dev/null || true
  
  AFTER_SIZE=$(get_size "data/blog/generated")
  AFTER_COUNT=$(get_count "data/blog/generated")
  echo "  Before: $BEFORE_SIZE ($BEFORE_COUNT files)"
  echo "  After: $AFTER_SIZE ($AFTER_COUNT files)"
fi
echo ""

# 7. Clean old blog images (optional - keep last 30 days)
echo "🖼️  7. Cleaning old blog images..."
if [ -d "data/blog/images" ]; then
  BEFORE_SIZE=$(get_size "data/blog/images")
  BEFORE_COUNT=$(get_count "data/blog/images")
  
  # Remove images older than 30 days
  find data/blog/images -type f -mtime +30 -delete 2>/dev/null || true
  
  AFTER_SIZE=$(get_size "data/blog/images")
  AFTER_COUNT=$(get_count "data/blog/images")
  echo "  Before: $BEFORE_SIZE ($BEFORE_COUNT files)"
  echo "  After: $AFTER_SIZE ($AFTER_COUNT files)"
fi
echo ""

# 8. Clean notification logs (keep last 1000 entries)
echo "🔔 8. Cleaning notification logs..."
if [ -f "logs/notifications.json" ]; then
  BEFORE_SIZE=$(du -h logs/notifications.json 2>/dev/null | cut -f1)
  node -e "
    const fs = require('fs');
    try {
      const data = JSON.parse(fs.readFileSync('logs/notifications.json', 'utf-8'));
      if (Array.isArray(data) && data.length > 1000) {
        fs.writeFileSync('logs/notifications.json', JSON.stringify(data.slice(-1000), null, 2));
        console.log('  Kept last 1000 notifications');
      } else {
        console.log('  No cleanup needed');
      }
    } catch (e) {
      console.log('  No cleanup needed');
    }
  " 2>/dev/null || echo "  Skipped"
  AFTER_SIZE=$(du -h logs/notifications.json 2>/dev/null | cut -f1 || echo "0")
  echo "  Before: $BEFORE_SIZE"
  echo "  After: $AFTER_SIZE"
fi
echo ""

# Show final disk usage
echo "📊 Final Disk Usage:"
df -h . | tail -1
FINAL_SIZE=$(du -sh . 2>/dev/null | cut -f1)
echo "  Current directory: $FINAL_SIZE"
echo ""

echo "✅ Disk cleanup completed!"
echo ""
echo "💡 To check disk usage again: npm run disk:check"

