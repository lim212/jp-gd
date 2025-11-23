# 🔧 Fix PM2 jp-gd Error - "startPORT=5000"

## 🐛 Masalah

PM2 process `jp-gd` error dengan message:
```
npm error Missing script: "startPORT=5000"
```

Process terus restart karena command yang salah.

## ✅ Solusi Cepat

### Di Server (Ubuntu):

```bash
# Quick fix
chmod +x scripts/fix-pm2-jp-gd-quick.sh
./scripts/fix-pm2-jp-gd-quick.sh

# Atau full fix
chmod +x scripts/fix-pm2-jp-gd.sh
./scripts/fix-pm2-jp-gd.sh
```

### Manual Fix:

```bash
# 1. Stop dan delete process yang error
pm2 stop jp-gd
pm2 delete jp-gd

# 2. Start dengan ecosystem config yang benar
pm2 start ecosystem.ubuntu.config.js --env production
# atau
pm2 start ecosystem.config.cjs --env production

# 3. Save config
pm2 save

# 4. Check status
pm2 status
pm2 logs
```

## 🔍 Root Cause

Error terjadi karena PM2 dijalankan dengan command yang **SALAH**:

```bash
# ❌ SALAH - Jangan gunakan ini
pm2 start npm --name "jp-gd" -- startPORT=5000

# ✅ BENAR - Gunakan ini
pm2 start ecosystem.ubuntu.config.js --env production
```

## 📋 Checklist

Setelah fix, pastikan:

- [ ] Process `jp-gd` sudah dihapus
- [ ] Process baru (dari ecosystem config) running
- [ ] No error di PM2 logs
- [ ] Website accessible di port 3000 atau 5000
- [ ] PM2 config sudah di-save

## 🔧 Troubleshooting

### Jika masih error:

1. **Cek build output:**
```bash
ls -la .output/server/index.mjs
```

2. **Rebuild jika perlu:**
```bash
npm run build:ubuntu
```

3. **Cek ecosystem config:**
```bash
cat ecosystem.ubuntu.config.js
```

4. **Check PM2 logs:**
```bash
pm2 logs --err --lines 50
```

### Jika website masih blank:

1. **Check browser console (F12)**
2. **Check PM2 logs untuk error**
3. **Check apakah port benar (3000 atau 5000)**
4. **Check nginx/reverse proxy config**

## 📝 Notes

- **Jangan** gunakan `npm start` langsung di PM2
- **Gunakan** ecosystem config file
- **Pastikan** build sudah selesai sebelum start PM2
- **Check** port di ecosystem config (default: 3000)

## 🔗 Related

- `scripts/fix-pm2-jp-gd.sh` - Full fix script
- `scripts/fix-pm2-jp-gd-quick.sh` - Quick fix script
- `ecosystem.ubuntu.config.js` - PM2 config untuk Ubuntu
- `FIX-BLANK-PAGE-PM2.md` - Fix blank page guide

---

**Quick Fix**: `./scripts/fix-pm2-jp-gd-quick.sh`

