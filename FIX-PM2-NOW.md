# ⚡ Fix PM2 jp-gd Error - JALANKAN SEKARANG

## 🚨 Error yang Terlihat

```
npm error Missing script: "startPORT=5000"
```

Process `jp-gd` terus restart karena command salah.

## ✅ Fix Sekarang (Copy-Paste di Server)

```bash
cd /home/nuxt/jp-gd

# Jalankan script fix
chmod +x fix-pm2-now.sh
./fix-pm2-now.sh
```

## 🔍 Atau Manual Fix

```bash
cd /home/nuxt/jp-gd

# 1. Stop dan delete semua PM2 processes
pm2 stop all
pm2 delete all

# 2. Kill any remaining processes
pkill -f "npm.*startPORT" 2>/dev/null
pkill -f "nuxt.*start" 2>/dev/null

# 3. Start dengan ecosystem config yang benar
pm2 start ecosystem.ubuntu.config.cjs --env production

# 4. Save config
pm2 save

# 5. Check status
pm2 status
pm2 logs --lines 30
```

## 📋 Setelah Fix

1. **Check PM2 status:**
```bash
pm2 status
```

2. **Check logs:**
```bash
pm2 logs --lines 30
```

3. **Test website:**
- http://119.47.89.109:3000
- http://119.47.89.109:5000

4. **Jika masih blank:**
- Buka browser console (F12)
- Check error di Console tab
- Check PM2 error logs: `pm2 logs --err`

## 🎯 Root Cause

Process `jp-gd` dijalankan dengan command **SALAH**:
```bash
# ❌ SALAH
pm2 start npm --name "jp-gd" -- startPORT=5000

# ✅ BENAR
pm2 start ecosystem.ubuntu.config.cjs --env production
```

## 📝 Notes

- Process name akan jadi `jasapembayaran-new` (dari ecosystem config)
- Port default: 3000 (bisa diubah di ecosystem config)
- Pastikan build sudah ada: `.output/server/index.mjs`

---

**Quick Command**: 
```bash
cd /home/nuxt/jp-gd && chmod +x fix-pm2-now.sh && ./fix-pm2-now.sh
```

