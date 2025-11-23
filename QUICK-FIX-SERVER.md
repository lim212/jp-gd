# ⚡ Quick Fix - Server Ubuntu

## 🚨 Error yang Terlihat

```
npm error Missing script: "startPORT=5000"
```

Process `jp-gd` terus restart karena command salah.

## ✅ Fix Sekarang (Copy-Paste)

```bash
# 1. Stop dan delete process yang error
pm2 stop jp-gd
pm2 delete jp-gd

# 2. Start dengan config yang benar
cd /home/nuxt/jp-gd
pm2 start ecosystem.ubuntu.config.js --env production

# 3. Save config
pm2 save

# 4. Check status
pm2 status
pm2 logs --lines 20
```

## 🔍 Atau Gunakan Script

```bash
cd /home/nuxt/jp-gd
chmod +x scripts/fix-pm2-jp-gd-quick.sh
./scripts/fix-pm2-jp-gd-quick.sh
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
```

Seharusnya:
```bash
# ✅ BENAR
pm2 start ecosystem.ubuntu.config.js --env production
```

## 📝 Notes

- Process name akan jadi `jasapembayaran-new` (dari ecosystem config)
- Port default: 3000 (bisa diubah di ecosystem config)
- Pastikan build sudah ada: `.output/server/index.mjs`

---

**Quick Command**: 
```bash
pm2 stop jp-gd && pm2 delete jp-gd && pm2 start ecosystem.ubuntu.config.js --env production && pm2 save
```

