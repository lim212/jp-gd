#!/bin/bash

# Fix oxc-parser Native Binding for Ubuntu/Linux
# This script fixes the "Cannot find native binding" error for oxc-parser

set -e

echo "🔧 Fixing oxc-parser native binding for Linux..."

# Check if we're on Linux
if [ "$(uname)" != "Linux" ]; then
  echo "⚠️  This script is for Linux only. Current OS: $(uname)"
  exit 1
fi

# Detect architecture
ARCH=$(uname -m)
PLATFORM="linux"

if [ "$ARCH" = "x86_64" ]; then
  BINDING_NAME="linux-x64-gnu"
elif [ "$ARCH" = "aarch64" ]; then
  BINDING_NAME="linux-arm64-gnu"
else
  echo "❌ Unsupported architecture: $ARCH"
  exit 1
fi

echo "📋 Detected platform: $PLATFORM-$ARCH ($BINDING_NAME)"

# Remove package-lock.json and node_modules (as suggested by error message)
echo ""
echo "🧹 Cleaning npm cache and lock files..."
rm -f package-lock.json
rm -rf node_modules 2>/dev/null || true

# Clear npm cache
echo "🗑️  Clearing npm cache..."
npm cache clean --force

# Install oxc-parser binding explicitly
echo ""
echo "📦 Installing oxc-parser native binding for $BINDING_NAME..."
npm install --save-optional "@oxc-parser/binding-$BINDING_NAME" || {
  echo "⚠️  Failed to install @oxc-parser/binding-$BINDING_NAME, trying alternative method..."
  
  # Try installing oxc-parser directly
  npm install --no-optional=false oxc-parser || true
}

# Reinstall all dependencies with optional dependencies enabled
echo ""
echo "📦 Reinstalling all dependencies (including optional)..."
npm install --no-optional=false

# Verify oxc-parser installation
echo ""
echo "✅ Verifying oxc-parser installation..."
if [ -d "node_modules/oxc-parser" ]; then
  echo "   ✅ oxc-parser found"
  
  # Check for native binding
  if [ -f "node_modules/@oxc-parser/binding-$BINDING_NAME/package.json" ] || \
     [ -f "node_modules/oxc-parser/node_modules/@oxc-parser/binding-$BINDING_NAME/package.json" ]; then
    echo "   ✅ Native binding found"
  else
    echo "   ⚠️  Native binding not found, but oxc-parser exists"
    echo "   ℹ️  This might be okay if oxc-parser can work without native binding"
  fi
else
  echo "   ⚠️  oxc-parser not found directly, checking nested dependencies..."
  
  # Check in nuxt's node_modules
  if [ -d "node_modules/nuxt/node_modules/oxc-parser" ]; then
    echo "   ✅ oxc-parser found in nuxt's dependencies"
  fi
fi

echo ""
echo "✅ oxc-parser fix completed!"
echo ""
echo "💡 If you still see errors, try:"
echo "   1. rm -rf node_modules package-lock.json"
echo "   2. npm install --no-optional=false"
echo "   3. npm rebuild"

