# 🔧 Fix Blank Page & PM2 Start Error

## 🐛 Masalah

1. **PM2 Error**: `npm error Missing script: "startPORT=5000"`
2. **Website Blank Putih**: Halaman tidak muncul, hanya putih

## ✅ Solusi Cepat

### Langkah 1: Fix PM2 Start Error

```bash
# Jalankan script fix
npm run pm2:fix-start

# Atau manual:
node scripts/fix-pm2-start.js
```

Script ini akan:
- ✅ Stop semua PM2 processes
- ✅ Delete semua PM2 processes
- ✅ Cek dan build jika perlu
- ✅ Start PM2 dengan config yang benar
- ✅ Save PM2 configuration

### Langkah 2: Check Website Status

```bash
# Check status website
npm run pm2:check-website

# Atau manual:
node scripts/check-website-status.js
```

### Langkah 3: Restart PM2 dengan Config yang Benar

```bash
# Stop semua
pm2 stop all
pm2 delete all

# Start dengan ecosystem config
pm2 start ecosystem.config.cjs
# atau
pm2 start ecosystem.config.js
# atau
pm2 start ecosystem.ubuntu.config.js

# Save config
pm2 save

# Check status
pm2 status
pm2 logs
```

## 🔍 Diagnose Blank Page

### 1. Check Browser Console (F12)

Buka browser console dan cek:
- ❌ **JavaScript errors** → Fix errors
- ❌ **Failed network requests** → Check server
- ❌ **CORS errors** → Check server config

### 2. Check PM2 Logs

```bash
# Check error logs
pm2 logs --err --lines 50

# Check all logs
pm2 logs --lines 50

# Check specific app
pm2 logs jasapembayaran-new --lines 50
```

### 3. Check Build Output

```bash
# Cek apakah build ada
ls -la .output/server/

# Jika tidak ada, rebuild
npm run build

# Atau untuk Ubuntu
npm run build:ubuntu
```

### 4. Check Server Response

```bash
# Test dengan curl
curl http://localhost:3000

# Atau test dengan browser
# Buka: http://localhost:3000
# Check Network tab di DevTools
```

## 🚨 Common Issues & Solutions

### Issue 1: PM2 Start Error "startPORT=5000"

**Penyebab**: PM2 dijalankan dengan command salah

**Solusi**:
```bash
# JANGAN gunakan:
pm2 start npm --name "app" -- startPORT=5000  # ❌ SALAH

# GUNAKAN:
pm2 start ecosystem.config.cjs  # ✅ BENAR
# atau
pm2 start node --name "app" -- .output/server/index.mjs  # ✅ BENAR
```

### Issue 2: Blank Page - No Errors

**Penyebab**: Build tidak ada atau server tidak start

**Solusi**:
```bash
# 1. Rebuild
npm run build

# 2. Restart PM2
pm2 restart all

# 3. Check logs
pm2 logs
```

### Issue 3: Blank Page - JavaScript Errors

**Penyebab**: Error di client-side code

**Solusi**:
1. Buka browser console (F12)
2. Lihat error message
3. Fix error di code
4. Rebuild dan restart

### Issue 4: Blank Page - CSS Not Loading

**Penyebab**: CSS files tidak ter-load

**Solusi**:
1. Check Network tab di DevTools
2. Cek apakah CSS files return 404
3. Rebuild: `npm run build`
4. Clear browser cache: Ctrl+Shift+R

### Issue 5: Blank Page - Server Error 500

**Penyebab**: Server-side error

**Solusi**:
```bash
# Check PM2 error logs
pm2 logs --err --lines 100

# Check server logs
pm2 logs jasapembayaran-new --err --lines 100

# Fix error dan restart
pm2 restart all
```

## 📋 Checklist

- [ ] PM2 processes running (`pm2 status`)
- [ ] Build output exists (`.output/server/index.mjs`)
- [ ] Port 3000 is listening (`curl http://localhost:3000`)
- [ ] No JavaScript errors in browser console
- [ ] No failed network requests in Network tab
- [ ] PM2 logs show no errors
- [ ] Server responds with 200 OK

## 🔧 Manual Fix Steps

Jika script tidak bekerja, lakukan manual:

### 1. Stop & Delete PM2

```bash
pm2 stop all
pm2 delete all
pm2 kill  # Force kill jika perlu
```

### 2. Rebuild

```bash
# Clean build
rm -rf .nuxt .output
npm run build

# Atau untuk Ubuntu
npm run build:ubuntu
```

### 3. Start PM2

```bash
# Gunakan ecosystem config
pm2 start ecosystem.config.cjs

# Atau langsung
pm2 start node --name "jasapembayaran-new" -- .output/server/index.mjs --env production

# Save
pm2 save
```

### 4. Verify

```bash
# Check status
pm2 status

# Check logs
pm2 logs

# Test website
curl http://localhost:3000
```

## 📝 Notes

- **Jangan** gunakan `npm start` langsung di PM2
- **Gunakan** `node .output/server/index.mjs` atau ecosystem config
- **Pastikan** build sudah selesai sebelum start PM2
- **Check** browser console untuk client-side errors
- **Check** PM2 logs untuk server-side errors

## 🔗 Related Files

- `scripts/fix-pm2-start.js` - Script fix PM2 start
- `scripts/check-website-status.js` - Script check website status
- `ecosystem.config.cjs` - PM2 config
- `ecosystem.config.js` - PM2 config
- `ecosystem.ubuntu.config.js` - PM2 config Ubuntu
- `start.js` - Server start script

---

**Status**: ✅ Ready
**Last Updated**: 2025-01-15

