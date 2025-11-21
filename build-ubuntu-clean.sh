#!/bin/bash

# Clean Ubuntu Build Script
# This script builds the app with proper cleanup and filters out cosmetic warnings

set -e  # Exit on error

echo "🚀 Starting Ubuntu build process..."

# Set environment variables
export NODE_ENV=production
export PLATFORM=linux
export SHARP_IGNORE_GLOBAL_LIBVIPS=1
export NODE_OPTIONS="--max-old-space-size=16384 --no-deprecation"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .nuxt .output .output-build dist node_modules/.cache || true

# Run cleanup script
echo "🧹 Running cleanup script..."
node scripts/clean-output.js || echo "⚠️  Cleanup script had issues, continuing..."

# Run build and filter out cosmetic warnings
echo "🔨 Building application..."
npm run build:ubuntu 2>&1 | \
  grep -v "deep' is not recognized" | \
  grep -v "Did you mean '::deep'" | \
  grep -v "Found.*warnings while optimizing" | \
  grep -v "Issue #" | \
  grep -v "┆" | \
  grep -v "│" | \
  grep -v "Sourcemap is likely to be incorrect" | \
  grep -v "@tailwindcss/vite:generate:build" | \
  grep -v "WARN.*plugin" | \
  grep -v "Some chunks are larger" | \
  grep -v "chunkSizeWarningLimit" | \
  grep -v "dynamic import()" | \
  grep -v "manualChunks" | \
  grep -v "user-select:" | \
  grep -v "display:" | \
  grep -v "opacity:" | \
  grep -v "transform:" | \
  grep -v "\.partner-card" | \
  grep -v "\.trusted-" | \
  grep -v "DEP0155" | \
  grep -v "DeprecationWarning" || true

# Check if build was successful
if [ -f ".output/server/index.mjs" ]; then
    echo ""
    echo "✅ Build completed successfully!"
    echo "📁 Output: .output/server/index.mjs"
    echo "🚀 Ready for deployment!"
    exit 0
else
    echo ""
    echo "❌ Build failed! File not found: .output/server/index.mjs"
    echo "📋 Checking build output..."
    ls -la .output/ 2>/dev/null || echo "No .output directory found"
    ls -la .output/server/ 2>/dev/null || echo "No .output/server directory found"
    exit 1
fi
