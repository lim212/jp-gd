#!/bin/bash

# Script to check disk usage and identify large files/directories
# Useful for troubleshooting disk space issues on VPS

echo "🔍 Checking Disk Usage..."
echo ""

# Overall disk usage
echo "📊 Overall Disk Usage:"
df -h
echo ""

# Check current directory size
echo "📁 Current Directory Size:"
du -sh . 2>/dev/null | head -1
echo ""

# Top 10 largest directories
echo "📦 Top 10 Largest Directories:"
du -h --max-depth=1 . 2>/dev/null | sort -rh | head -11 | tail -10
echo ""

# Check specific directories that might be large
echo "🔍 Checking Specific Directories:"
echo ""

# Node modules
if [ -d "node_modules" ]; then
  SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
  echo "  node_modules: $SIZE"
fi

# Build artifacts
if [ -d ".nuxt" ]; then
  SIZE=$(du -sh .nuxt 2>/dev/null | cut -f1)
  echo "  .nuxt: $SIZE"
fi

if [ -d ".output" ]; then
  SIZE=$(du -sh .output 2>/dev/null | cut -f1)
  echo "  .output: $SIZE"
fi

# Logs
if [ -d "logs" ]; then
  SIZE=$(du -sh logs 2>/dev/null | cut -f1)
  echo "  logs: $SIZE"
  # Show log files
  if [ -d "logs" ]; then
    echo "    Log files:"
    ls -lh logs/*.log 2>/dev/null | awk '{print "      " $9 " (" $5 ")"}'
  fi
fi

# Backups
if [ -d "backups" ]; then
  SIZE=$(du -sh backups 2>/dev/null | cut -f1)
  COUNT=$(find backups -type d -maxdepth 1 2>/dev/null | wc -l)
  echo "  backups: $SIZE ($COUNT backup directories)"
fi

# Data directory
if [ -d "data" ]; then
  SIZE=$(du -sh data 2>/dev/null | cut -f1)
  echo "  data: $SIZE"
  
  # Check blog data
  if [ -d "data/blog" ]; then
    BLOG_SIZE=$(du -sh data/blog 2>/dev/null | cut -f1)
    BLOG_FILES=$(find data/blog -type f 2>/dev/null | wc -l)
    echo "    data/blog: $BLOG_SIZE ($BLOG_FILES files)"
  fi
fi

# Public images
if [ -d "public/images" ]; then
  IMG_SIZE=$(du -sh public/images 2>/dev/null | cut -f1)
  IMG_FILES=$(find public/images -type f 2>/dev/null | wc -l)
  echo "  public/images: $IMG_SIZE ($IMG_FILES files)"
  
  # Check blog images
  if [ -d "public/images/blog" ]; then
    BLOG_IMG_SIZE=$(du -sh public/images/blog 2>/dev/null | cut -f1)
    BLOG_IMG_FILES=$(find public/images/blog -type f 2>/dev/null | wc -l)
    echo "    public/images/blog: $BLOG_IMG_SIZE ($BLOG_IMG_FILES files)"
  fi
  
  # Check dummy images
  if [ -d "public/images/dummy" ]; then
    DUMMY_SIZE=$(du -sh public/images/dummy 2>/dev/null | cut -f1)
    DUMMY_FILES=$(find public/images/dummy -type f 2>/dev/null | wc -l)
    echo "    public/images/dummy: $DUMMY_SIZE ($DUMMY_FILES files)"
  fi
fi

# Cache directories
if [ -d ".cache" ]; then
  SIZE=$(du -sh .cache 2>/dev/null | cut -f1)
  echo "  .cache: $SIZE"
fi

if [ -d "node_modules/.cache" ]; then
  SIZE=$(du -sh node_modules/.cache 2>/dev/null | cut -f1)
  echo "  node_modules/.cache: $SIZE"
fi

echo ""
echo "💡 To clean up, run: npm run cleanup:disk"

