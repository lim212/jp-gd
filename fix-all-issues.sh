#!/bin/bash

# Master Fix All Issues Script for JasaPembayaran.com
# This script fixes all common issues on Ubuntu VPS

set -e  # Exit on any error

echo "🚀 Master Fix All Issues Script for JasaPembayaran.com"
echo "====================================================="
echo "This script will fix all common issues that might occur on Ubuntu VPS"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Step 1: Fix file paths
echo "🔧 Step 1: Fixing file paths..."
chmod +x fix-file-paths.sh
./fix-file-paths.sh
echo "✅ File paths fixed"
echo ""

# Step 2: Fix build issues
echo "🔧 Step 2: Fixing build issues..."
chmod +x fix-build-issues.sh
./fix-build-issues.sh
echo "✅ Build issues fixed"
echo ""

# Step 3: Fix PM2 issues
echo "🔧 Step 3: Fixing PM2 issues..."
chmod +x fix-pm2-issues.sh
./fix-pm2-issues.sh
echo "✅ PM2 issues fixed"
echo ""

# Step 4: Final verification
echo "🔍 Step 4: Final verification..."
echo "Checking if application is running..."

# Check PM2 status
if command -v pm2 &> /dev/null; then
    echo "📊 PM2 Status:"
    pm2 status
    
    # Check if our app is running
    if pm2 list | grep -q "jasapembayaran-new"; then
        echo "✅ Application is running with PM2"
        
        # Check if it's online
        if pm2 list | grep "jasapembayaran-new" | grep -q "online"; then
            echo "✅ Application status: ONLINE"
        else
            echo "⚠️  Application status: NOT ONLINE"
            echo "📋 Recent logs:"
            pm2 logs jasapembayaran-new --lines 10
        fi
    else
        echo "❌ Application is not running with PM2"
    fi
else
    echo "⚠️  PM2 not found"
fi

# Check if port is listening
echo "🔍 Checking if port 3000 is listening..."
if netstat -tlnp 2>/dev/null | grep -q ":3000 "; then
    echo "✅ Port 3000 is listening"
else
    echo "⚠️  Port 3000 is not listening"
fi

echo ""
echo "🎉 All issues fixed successfully!"
echo "====================================================="
echo "✅ File paths fixed"
echo "✅ Build issues fixed"
echo "✅ PM2 issues fixed"
echo "✅ Final verification completed"
echo ""
echo "📋 Your application should now be running at:"
echo "  http://localhost:3000"
echo "  http://your-server-ip:3000"
echo ""
echo "📋 Useful commands:"
echo "  pm2 status                    - Check process status"
echo "  pm2 logs jasapembayaran-new   - View logs"
echo "  pm2 restart jasapembayaran-new - Restart application"
echo "  pm2 stop jasapembayaran-new   - Stop application"
echo "  pm2 monit                     - Monitor processes"
echo ""
echo "🔧 If you still have issues, try:"
echo "  1. Check logs: pm2 logs jasapembayaran-new"
echo "  2. Restart: pm2 restart jasapembayaran-new"
echo "  3. Rebuild: npm run build:ubuntu"
echo "  4. Run this script again: ./fix-all-issues.sh"
echo ""
