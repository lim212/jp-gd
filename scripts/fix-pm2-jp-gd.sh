#!/bin/bash
# Script untuk fix PM2 process jp-gd yang error

echo "🔧 Fixing PM2 process jp-gd..."
echo "=============================="

# 1. Stop dan delete process jp-gd yang error
echo ""
echo "1️⃣  Stopping and deleting jp-gd process..."
pm2 stop jp-gd 2>/dev/null || echo "   (No jp-gd process to stop)"
pm2 delete jp-gd 2>/dev/null || echo "   (No jp-gd process to delete)"
echo "✅ jp-gd process cleaned"

# 2. Stop dan delete process nuxt-app juga jika ada error
echo ""
echo "2️⃣  Checking nuxt-app process..."
pm2 stop nuxt-app 2>/dev/null || echo "   (No nuxt-app process to stop)"
pm2 delete nuxt-app 2>/dev/null || echo "   (No nuxt-app process to delete)"

# 3. Cek apakah build ada
echo ""
echo "3️⃣  Checking build output..."
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

# 4. Cek ecosystem config
echo ""
echo "4️⃣  Checking ecosystem config..."
if [ -f "ecosystem.ubuntu.config.js" ]; then
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

# 5. Start PM2 dengan config yang benar
echo ""
echo "5️⃣  Starting PM2 with correct config..."
pm2 start $ECOSYSTEM_FILE --env production

if [ $? -eq 0 ]; then
    echo "✅ PM2 started successfully!"
else
    echo "❌ PM2 start failed!"
    exit 1
fi

# 6. Save PM2 config
echo ""
echo "6️⃣  Saving PM2 configuration..."
pm2 save
echo "✅ PM2 config saved!"

# 7. Show status
echo ""
echo "7️⃣  PM2 Status:"
pm2 status

# 8. Show recent logs
echo ""
echo "8️⃣  Recent logs (last 20 lines):"
pm2 logs --lines 20 --nostream

echo ""
echo "✅ Done!"
echo ""
echo "📝 Next steps:"
echo "   1. Check PM2 status: pm2 status"
echo "   2. Check logs: pm2 logs"
echo "   3. Check website: http://119.47.89.109:5000 atau http://119.47.89.109:3000"
echo "   4. If still blank, check browser console (F12)"

