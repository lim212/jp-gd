#!/bin/bash
# Fix Sharp library for Ubuntu/Linux
# This script rebuilds sharp for the correct platform

echo "🔧 Fixing Sharp library for Ubuntu/Linux..."

# Check if we're on Linux
if [ "$(uname)" != "Linux" ]; then
  echo "⚠️  This script is for Linux only. Current OS: $(uname)"
  exit 1
fi

# Remove existing sharp
echo "📦 Removing existing sharp..."
npm uninstall sharp 2>/dev/null || true

# Install sharp for Linux platform
echo "📦 Installing sharp for Linux platform..."
npm install sharp --platform=linux --arch=x64

# Rebuild sharp
echo "🔨 Rebuilding sharp..."
npm rebuild sharp

# Verify installation
echo "✅ Verifying sharp installation..."
node -e "try { const sharp = require('sharp'); console.log('✅ Sharp version:', sharp.versions); } catch(e) { console.error('❌ Sharp not working:', e.message); process.exit(1); }"

echo "✅ Sharp library fixed successfully!"

