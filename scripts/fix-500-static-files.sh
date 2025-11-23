#!/bin/bash
# Script untuk fix error 500 pada static files (_nuxt/*.js)

echo "🔧 Fixing 500 Error on Static Files"
echo "===================================="

# 1. Check build output
echo ""
echo "1️⃣  Checking build output..."
if [ ! -d ".output" ]; then
    echo "❌ .output directory tidak ditemukan!"
    echo "   Running build..."
    npm run build:ubuntu
    if [ $? -ne 0 ]; then
        echo "❌ Build gagal!"
        exit 1
    fi
else
    echo "✅ .output directory exists"
fi

# 2. Check _nuxt files
echo ""
echo "2️⃣  Checking _nuxt files..."
if [ -d ".output/public/_nuxt" ]; then
    NUXT_COUNT=$(find .output/public/_nuxt -type f | wc -l)
    echo "✅ Found $NUXT_COUNT files in .output/public/_nuxt"
    
    if [ $NUXT_COUNT -eq 0 ]; then
        echo "⚠️  No files found in _nuxt directory!"
        echo "   Rebuilding..."
        rm -rf .output .nuxt
        npm run build:ubuntu
    fi
else
    echo "❌ .output/public/_nuxt directory tidak ditemukan!"
    echo "   Rebuilding..."
    rm -rf .output .nuxt
    npm run build:ubuntu
    if [ $? -ne 0 ]; then
        echo "❌ Build gagal!"
        exit 1
    fi
fi

# 3. Check server index
echo ""
echo "3️⃣  Checking server index..."
if [ ! -f ".output/server/index.mjs" ]; then
    echo "❌ Server index tidak ditemukan!"
    echo "   Rebuilding..."
    npm run build:ubuntu
    if [ $? -ne 0 ]; then
        echo "❌ Build gagal!"
        exit 1
    fi
else
    echo "✅ Server index exists"
fi

# 4. Check permissions
echo ""
echo "4️⃣  Checking file permissions..."
chmod -R 755 .output/public/_nuxt 2>/dev/null || echo "   (Could not set permissions)"
chmod -R 755 .output/server 2>/dev/null || echo "   (Could not set permissions)"
echo "✅ Permissions checked"

# 5. Restart PM2
echo ""
echo "5️⃣  Restarting PM2..."
pm2 restart all
sleep 3

# 6. Check PM2 status
echo ""
echo "6️⃣  PM2 Status:"
pm2 status

# 7. Check logs for errors
echo ""
echo "7️⃣  Checking PM2 logs for errors..."
pm2 logs --err --lines 20 --nostream

# 8. Test static file access
echo ""
echo "8️⃣  Testing static file access..."
if [ -f ".output/public/_nuxt/$(ls .output/public/_nuxt | head -1)" ]; then
    TEST_FILE=$(ls .output/public/_nuxt | head -1)
    echo "   Testing: /_nuxt/$TEST_FILE"
    echo "   (Check if this file is accessible via browser)"
else
    echo "   ⚠️  No files to test"
fi

echo ""
echo "✅ Done!"
echo ""
echo "📝 Next steps:"
echo "   1. Check PM2 logs: pm2 logs --err --lines 50"
echo "   2. Test website: http://119.47.89.109:5000"
echo "   3. Check browser console (F12) for errors"
echo "   4. If still 500, check server logs for detailed error"

