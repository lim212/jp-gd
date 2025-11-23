# ⚡ Quick Fix Blank Page & PM2 Error

## 🚨 Error yang Terlihat

```
npm error Missing script: "startPORT=5000"
```

## ✅ Fix Cepat (3 Langkah)

### 1. Fix PM2 Start

```bash
npm run pm2:fix-start
```

### 2. Check Status

```bash
npm run pm2:check-website
```

### 3. Restart PM2

```bash
pm2 restart all
pm2 logs
```

## 🔍 Jika Masih Blank Page

### Check Browser Console (F12)

1. Buka website di browser
2. Tekan **F12** (DevTools)
3. Tab **Console** - cek error merah
4. Tab **Network** - cek failed requests

### Check PM2 Logs

```bash
# Error logs
pm2 logs --err --lines 50

# All logs
pm2 logs --lines 50
```

### Rebuild Jika Perlu

```bash
# Clean rebuild
rm -rf .nuxt .output
npm run build

# Restart PM2
pm2 restart all
```

## 📝 Manual Fix

Jika script tidak bekerja:

```bash
# 1. Stop semua PM2
pm2 stop all
pm2 delete all

# 2. Rebuild
npm run build

# 3. Start dengan config yang benar
pm2 start ecosystem.config.cjs
# atau
pm2 start ecosystem.ubuntu.config.js

# 4. Save
pm2 save

# 5. Check
pm2 status
pm2 logs
```

## 🎯 Root Cause

Error `"startPORT=5000"` terjadi karena PM2 dijalankan dengan command salah:

```bash
# ❌ SALAH - Jangan gunakan ini
pm2 start npm --name "app" -- startPORT=5000

# ✅ BENAR - Gunakan ini
pm2 start ecosystem.config.cjs
```

## 🔗 Related

- `FIX-BLANK-PAGE-PM2.md` - Dokumentasi lengkap
- `scripts/fix-pm2-start.js` - Script fix otomatis
- `scripts/check-website-status.js` - Script check status

---

**Quick Fix**: `npm run pm2:fix-start`

