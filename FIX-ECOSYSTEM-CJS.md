# ✅ Fix Ecosystem Config - ERR_REQUIRE_ESM

## 🐛 Masalah

Error saat start PM2:
```
Error [ERR_REQUIRE_ESM]: require() of ES Module ecosystem.ubuntu.config.js not supported
```

## 🔍 Root Cause

`package.json` memiliki `"type": "module"`, yang membuat semua `.js` files menjadi ES modules. PM2 membutuhkan CommonJS format untuk config files.

## ✅ Solusi

File `ecosystem.ubuntu.config.js` sudah di-copy menjadi `ecosystem.ubuntu.config.cjs` (CommonJS format).

### Gunakan File .cjs

```bash
# ✅ BENAR - Gunakan .cjs
pm2 start ecosystem.ubuntu.config.cjs --env production

# ❌ SALAH - Jangan gunakan .js
pm2 start ecosystem.ubuntu.config.js --env production
```

## 📋 Quick Fix

```bash
cd /home/nuxt/jp-gd

# Stop dan delete semua PM2 processes
pm2 stop all
pm2 delete all

# Start dengan .cjs file
pm2 start ecosystem.ubuntu.config.cjs --env production

# Save config
pm2 save

# Check status
pm2 status
```

## 🔗 Related Files

- `ecosystem.ubuntu.config.cjs` - ✅ File yang benar (CommonJS)
- `ecosystem.ubuntu.config.js` - ⚠️ File lama (tidak bisa digunakan dengan PM2)
- `ecosystem.config.cjs` - ✅ Alternatif config
- `ecosystem.config.js` - ⚠️ File lama (tidak bisa digunakan dengan PM2)

## 📝 Notes

- PM2 membutuhkan CommonJS format (`.cjs` atau `module.exports`)
- File `.js` tidak bisa digunakan jika `package.json` memiliki `"type": "module"`
- Semua script sudah di-update untuk menggunakan `.cjs`

---

**Quick Command**: 
```bash
pm2 start ecosystem.ubuntu.config.cjs --env production
```

