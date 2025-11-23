# ⚡ Quick Fix Error 500 pada Static Files

## 🚨 Error yang Terlihat

Browser console menunjukkan semua file `_nuxt/*.js` mengembalikan 500:
```
Failed to load resource: the server responded with a status of 500 (Server Error)
```

## ✅ Fix Sekarang (Copy-Paste di Server)

```bash
cd /home/nuxt/jp-gd

# 1. Stop PM2
pm2 stop all

# 2. Clean rebuild
rm -rf .output .nuxt
npm run build:ubuntu

# 3. Check _nuxt files
ls -la .output/public/_nuxt/ | head -10

# 4. Fix permissions
chmod -R 755 .output/public/_nuxt
chmod -R 755 .output/server

# 5. Restart PM2
pm2 restart all

# 6. Check logs
pm2 logs --err --lines 30
```

## 🔍 Atau Gunakan Script

```bash
cd /home/nuxt/jp-gd
chmod +x scripts/fix-500-static-files.sh
./scripts/fix-500-static-files.sh
```

## 📋 Setelah Fix

1. **Check PM2 status:**
```bash
pm2 status
```

2. **Check logs:**
```bash
pm2 logs --err --lines 50
```

3. **Test website:**
- http://119.47.89.109:5000
- Buka browser console (F12)
- Check apakah masih ada error 500

## 🎯 Root Cause

Error 500 pada static files biasanya karena:
1. Build output tidak lengkap
2. File _nuxt tidak ter-generate
3. Permission issue
4. Server-side error saat serve files

## 📝 Notes

- Pastikan build selesai tanpa error
- Check apakah `.output/public/_nuxt/` berisi files
- Pastikan permissions benar (755 untuk dirs, 644 untuk files)
- Check PM2 logs untuk error detail

---

**Quick Command**: 
```bash
pm2 stop all && rm -rf .output .nuxt && npm run build:ubuntu && chmod -R 755 .output && pm2 restart all
```

