#!/bin/bash

# Ubuntu Troubleshooting Script
# This script helps diagnose issues with the application

echo "🔍 JasaPembayaran Ubuntu Troubleshooting"
echo "========================================"
echo ""

# System Information
echo "📋 System Information:"
echo "   - OS: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
echo "   - Kernel: $(uname -r)"
echo "   - Architecture: $(uname -m)"
echo ""

# Node.js Information
echo "📦 Node.js Information:"
echo "   - Node Version: $(node --version 2>&1)"
echo "   - NPM Version: $(npm --version 2>&1)"
echo "   - PM2 Version: $(pm2 --version 2>&1)"
echo ""

# Memory Information
echo "💾 Memory Information:"
free -h
echo ""

# Disk Space
echo "💿 Disk Space:"
df -h | grep -E '^/dev|Filesystem'
echo ""

# Check if project files exist
echo "📁 Project Files Check:"
if [ -f "package.json" ]; then
    echo "   ✅ package.json found"
else
    echo "   ❌ package.json NOT found"
fi

if [ -d "node_modules" ]; then
    echo "   ✅ node_modules directory exists"
else
    echo "   ❌ node_modules NOT found - run 'npm install'"
fi

if [ -d ".output" ]; then
    echo "   ✅ .output directory exists"
    if [ -f ".output/server/index.mjs" ]; then
        echo "   ✅ .output/server/index.mjs found"
    else
        echo "   ❌ .output/server/index.mjs NOT found - run 'npm run build:ubuntu'"
    fi
else
    echo "   ❌ .output directory NOT found - run 'npm run build:ubuntu'"
fi
echo ""

# Check port 3000
echo "🔌 Port 3000 Status:"
if lsof -i:3000 >/dev/null 2>&1; then
    echo "   ⚠️  Port 3000 is in use:"
    lsof -i:3000
else
    echo "   ✅ Port 3000 is available"
fi
echo ""

# PM2 Status
echo "🔄 PM2 Status:"
pm2 status 2>&1 || echo "   ❌ PM2 not running or has errors"
echo ""

# PM2 Logs (last 20 lines)
echo "📝 Last 20 lines of PM2 logs:"
if pm2 list | grep -q "jasapembayaran-new"; then
    echo "--- Output logs ---"
    pm2 logs jasapembayaran-new --lines 10 --nostream --out 2>&1 || echo "No output logs"
    echo ""
    echo "--- Error logs ---"
    pm2 logs jasapembayaran-new --lines 10 --nostream --err 2>&1 || echo "No error logs"
else
    echo "   ⚠️  jasapembayaran-new process not found in PM2"
fi
echo ""

# Environment Variables
echo "🌍 Environment Variables:"
echo "   - NODE_ENV: ${NODE_ENV:-not set}"
echo "   - PORT: ${PORT:-not set}"
echo "   - PLATFORM: ${PLATFORM:-not set}"
echo ""

# Recommendations
echo "💡 Troubleshooting Steps:"
echo ""
if [ ! -d ".output" ]; then
    echo "1. ❌ Build the application:"
    echo "   npm run build:ubuntu"
    echo ""
fi

if ! pm2 list | grep -q "jasapembayaran-new"; then
    echo "2. ❌ Start the application:"
    echo "   ./restart-ubuntu.sh"
    echo "   or"
    echo "   pm2 start ecosystem.ubuntu.config.js --env production"
    echo ""
fi

echo "3. 📊 Monitor the application:"
echo "   pm2 monit"
echo ""

echo "4. 📝 Check detailed logs:"
echo "   pm2 logs jasapembayaran-new"
echo ""

echo "5. 🔄 If issues persist, try a complete rebuild:"
echo "   ./deploy-ubuntu-fix.sh"
echo ""

echo "========================================"
echo "Troubleshooting completed!"

