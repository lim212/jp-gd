# 🔧 Fix Error 500 pada Static Files (_nuxt/*.js)

## 🐛 Masalah

Semua file static (`_nuxt/*.js`, `favicon.ico`, dll) mengembalikan error 500:
```
Failed to load resource: the server responded with a status of 500 (Server Error)
```

## 🔍 Root Cause

Kemungkinan penyebab:
1. **Build output tidak lengkap** - File _nuxt tidak ter-generate
2. **Server tidak bisa serve static files** - Konfigurasi Nitro issue
3. **Permission issue** - File tidak bisa di-read
4. **Server-side error** - Error di server code yang menyebabkan semua request return 500

## ✅ Solusi

### Quick Fix (Copy-Paste di Server):

```bash
cd /home/nuxt/jp-gd

# 1. Stop PM2
pm2 stop all

# 2. Clean rebuild
rm -rf .output .nuxt
npm run build:ubuntu

# 3. Check build output
ls -la .output/public/_nuxt/ | head -10

# 4. Fix permissions
chmod -R 755 .output/public/_nuxt
chmod -R 755 .output/server

# 5. Restart PM2
pm2 restart all

# 6. Check logs
pm2 logs --err --lines 50
```

### Atau Gunakan Script:

```bash
cd /home/nuxt/jp-gd
chmod +x scripts/fix-500-static-files.sh
./scripts/fix-500-static-files.sh
```

## 🔍 Diagnose

### 1. Check Build Output

```bash
# Check apakah _nuxt files ada
ls -la .output/public/_nuxt/

# Check jumlah files
find .output/public/_nuxt -type f | wc -l

# Jika kosong atau tidak ada, rebuild
```

### 2. Check Server Logs

```bash
# Check PM2 error logs
pm2 logs --err --lines 100

# Check untuk error spesifik tentang static files
pm2 logs | grep -i "static\|_nuxt\|500"
```

### 3. Test Static File Access

```bash
# Test dengan curl
curl -I http://localhost:3000/_nuxt/$(ls .output/public/_nuxt | head -1)

# Atau test di browser
# Buka: http://119.47.89.109:5000/_nuxt/[filename]
```

### 4. Check Permissions

```bash
# Check permissions
ls -la .output/public/_nuxt/

# Fix permissions jika perlu
chmod -R 755 .output/public/_nuxt
chmod -R 755 .output/server
```

## 🔧 Troubleshooting

### Jika Build Gagal:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clean build
rm -rf .output .nuxt
npm run build:ubuntu
```

### Jika Files Ada Tapi Masih 500:

1. **Check server error logs:**
```bash
pm2 logs --err --lines 100
```

2. **Check apakah ada error di server code:**
```bash
# Look for specific errors
pm2 logs | grep -i "error\|exception\|failed"
```

3. **Check Nitro config:**
```bash
# Pastikan nitro config benar
cat nuxt.config.ts | grep -A 20 "nitro:"
```

### Jika Masih Error:

1. **Check PM2 process:**
```bash
pm2 status
pm2 describe jasapembayaran-new
```

2. **Restart dengan fresh start:**
```bash
pm2 stop all
pm2 delete all
pm2 start ecosystem.ubuntu.config.js --env production
pm2 save
```

3. **Check port:**
```bash
# Pastikan port benar (3000 atau 5000)
netstat -tulpn | grep :3000
netstat -tulpn | grep :5000
```

## 📝 Checklist

Setelah fix, pastikan:

- [ ] Build output lengkap (`.output/public/_nuxt/` ada dan berisi files)
- [ ] Server index ada (`.output/server/index.mjs`)
- [ ] Permissions benar (755 untuk directories, 644 untuk files)
- [ ] PM2 process running tanpa error
- [ ] No 500 error di PM2 logs
- [ ] Static files accessible (test dengan curl atau browser)

## 🔗 Related

- `scripts/fix-500-static-files.sh` - Fix script
- `FIX-ASSETS.md` - Fix missing assets
- `FIX-BLANK-PAGE-PM2.md` - Fix blank page
- `QUICK-FIX-SERVER.md` - Quick fix guide

---

**Quick Fix**: `./scripts/fix-500-static-files.sh`

