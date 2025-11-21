#!/bin/bash

# Clean Ubuntu Build Script
# This script builds the app and filters out CSS :deep() warnings

echo "🔨 Building application for Ubuntu..."

# Set environment variables
export NODE_ENV=production
export PLATFORM=linux
export SHARP_IGNORE_GLOBAL_LIBVIPS=1

# Run build and filter out cosmetic warnings
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
  grep -v "\.trusted-" || true

# Check if build was successful
if [ -f ".output/server/index.mjs" ]; then
    echo "✅ Build completed successfully!"
    exit 0
else
    echo "❌ Build failed!"
    exit 1
fi

