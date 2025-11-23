#!/bin/bash
# Quick fix untuk PM2 jp-gd error - JALANKAN DI SERVER

echo "🔧 Fixing PM2 jp-gd Error - Quick Fix"
echo "======================================"

# 1. Stop semua PM2 processes
echo ""
echo "1️⃣  Stopping all PM2 processes..."
pm2 stop all
sleep 2

# 2. Delete process jp-gd yang error
echo ""
echo "2️⃣  Deleting jp-gd process..."
pm2 delete jp-gd 2>/dev/null || echo "   (No jp-gd to delete)"
pm2 delete all 2>/dev/null || echo "   (No processes to delete)"

# 3. Kill any remaining processes
echo ""
echo "3️⃣  Killing any remaining processes..."
pkill -f "npm.*startPORT" 2>/dev/null || echo "   (No processes to kill)"
pkill -f "nuxt.*start" 2>/dev/null || echo "   (No processes to kill)"

# 4. Cek build output
echo ""
echo "4️⃣  Checking build output..."
if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ Build tidak ditemukan!"
    echo "   Running build..."
    npm run build:ubuntu
    if [ $? -ne 0 ]; then
        echo "❌ Build gagal!"
        exit 1
    fi
    echo "✅ Build selesai!"
else
    echo "✅ Build sudah ada"
fi

# 5. Cek ecosystem config
echo ""
echo "5️⃣  Checking ecosystem config..."
if [ -f "ecosystem.ubuntu.config.cjs" ]; then
    ECOSYSTEM_FILE="ecosystem.ubuntu.config.cjs"
    echo "✅ Found: ecosystem.ubuntu.config.cjs"
elif [ -f "ecosystem.ubuntu.config.js" ]; then
    ECOSYSTEM_FILE="ecosystem.ubuntu.config.js"
    echo "✅ Found: ecosystem.ubuntu.config.js"
elif [ -f "ecosystem.config.cjs" ]; then
    ECOSYSTEM_FILE="ecosystem.config.cjs"
    echo "✅ Found: ecosystem.config.cjs"
elif [ -f "ecosystem.config.js" ]; then
    ECOSYSTEM_FILE="ecosystem.config.js"
    echo "✅ Found: ecosystem.config.js"
else
    echo "❌ Ecosystem config tidak ditemukan!"
    exit 1
fi

# 6. Start PM2 dengan config yang benar
echo ""
echo "6️⃣  Starting PM2 with correct config..."
# Ensure we use .cjs file if available
if [ -f "ecosystem.ubuntu.config.cjs" ]; then
    ECOSYSTEM_FILE="ecosystem.ubuntu.config.cjs"
fi
pm2 start $ECOSYSTEM_FILE --env production

if [ $? -eq 0 ]; then
    echo "✅ PM2 started successfully!"
else
    echo "❌ PM2 start failed!"
    exit 1
fi

# 7. Save PM2 config
echo ""
echo "7️⃣  Saving PM2 configuration..."
pm2 save
echo "✅ PM2 config saved!"

# 8. Show status
echo ""
echo "8️⃣  PM2 Status:"
pm2 status

# 9. Show recent logs
echo ""
echo "9️⃣  Recent logs (last 20 lines):"
pm2 logs --lines 20 --nostream

echo ""
echo "✅ Done!"
echo ""
echo "📝 Next steps:"
echo "   1. Check PM2 status: pm2 status"
echo "   2. Check logs: pm2 logs"
echo "   3. Check website: http://119.47.89.109:3000 atau http://119.47.89.109:5000"
echo "   4. If still blank, check browser console (F12)"

