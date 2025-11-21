#!/bin/bash

# Quick Translation Script
# Fast way to scan and translate without opening browser

echo ""
echo "🌐 Quick Translation Sync"
echo "======================================"
echo ""

# Check if node is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Run full sync
node scripts/translation-sync.js full

echo ""
echo "======================================"
echo "✅ Done!"
echo ""

