#!/bin/bash
# Quick fix untuk PM2 jp-gd error

echo "⚡ Quick Fix PM2 jp-gd Error"
echo "============================"

# Stop dan delete jp-gd
pm2 stop jp-gd 2>/dev/null
pm2 delete jp-gd 2>/dev/null

# Start dengan ecosystem config yang benar
if [ -f "ecosystem.ubuntu.config.cjs" ]; then
    pm2 start ecosystem.ubuntu.config.cjs --env production
elif [ -f "ecosystem.ubuntu.config.js" ]; then
    pm2 start ecosystem.ubuntu.config.js --env production
elif [ -f "ecosystem.config.cjs" ]; then
    pm2 start ecosystem.config.cjs --env production
elif [ -f "ecosystem.config.js" ]; then
    pm2 start ecosystem.config.js --env production
else
    echo "❌ Ecosystem config tidak ditemukan!"
    exit 1
fi

# Save dan show status
pm2 save
pm2 status

echo ""
echo "✅ Fixed! Check: pm2 logs"

