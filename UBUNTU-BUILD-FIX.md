# 🔧 Ubuntu Build Fix - V2.1.7

## 🚨 Masalah yang Ditemukan

Error PM2 pada Ubuntu VPS:
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/nuxt/jasapembayaran-new/.output-build/server/index.mjs'
```

## 🔍 Analisis Masalah

1. **Path Mismatch**: PM2 mencari file di `.output-build/server/index.mjs` tetapi build menghasilkan `.output/server/index.mjs`
2. **Build Process**: Build process tidak menghasilkan file di lokasi yang benar
3. **PM2 Configuration**: Konfigurasi PM2 tidak optimal untuk Ubuntu VPS

## ✅ Solusi yang Diterapkan

### 1. Script Fix Ubuntu Build (`fix-ubuntu-build.sh`)
- Membersihkan semua build cache
- Rebuild dependencies
- Build ulang dengan environment yang benar
- Verifikasi file output
- Start PM2 dengan konfigurasi yang benar

### 2. Konfigurasi PM2 Ubuntu (`ecosystem.ubuntu.config.js`)
- Mode `fork` instead of `cluster` untuk kompatibilitas Ubuntu
- Single instance untuk stabilitas
- Environment variables yang tepat
- Memory management yang optimal

### 3. Package.json Scripts Baru
- `build:ubuntu-fix`: Build dengan fix untuk Ubuntu
- `fix:ubuntu-build`: Jalankan script fix otomatis
- `pm2:ubuntu`: Start PM2 dengan konfigurasi Ubuntu
- `pm2:ubuntu-restart`: Restart PM2 process
- `pm2:ubuntu-stop`: Stop PM2 process

## 🚀 Cara Menggunakan

### Opsi 1: Fix Otomatis (Recommended)
```bash
npm run fix:ubuntu-build
```

### Opsi 2: Manual Fix
```bash
# 1. Stop PM2
pm2 stop jasapembayaran-new
pm2 delete jasapembayaran-new

# 2. Clean build
rm -rf .nuxt .output .output-build
npm cache clean --force

# 3. Rebuild
npm ci
npm rebuild sharp
npm run build:ubuntu-fix

# 4. Start PM2
npm run pm2:ubuntu
```

### Opsi 3: Build Manual
```bash
# Clean build
npm run build:ubuntu-clean

# Start with Ubuntu config
npm run pm2:ubuntu
```

## 🔧 Troubleshooting

### Jika masih error:
1. **Check file exists**:
   ```bash
   ls -la .output/server/index.mjs
   ```

2. **Check permissions**:
   ```bash
   chmod +x .output/server/index.mjs
   ```

3. **Check PM2 status**:
   ```bash
   pm2 status
   pm2 logs jasapembayaran-new
   ```

4. **Manual start**:
   ```bash
   node .output/server/index.mjs
   ```

## 📊 Monitoring

### PM2 Commands:
```bash
pm2 status                    # Status semua process
pm2 logs jasapembayaran-new   # Logs aplikasi
pm2 monit                     # Monitor real-time
pm2 restart jasapembayaran-new # Restart process
```

### Health Check:
```bash
curl http://localhost:3000    # Test aplikasi
```

## 🎯 Expected Results

Setelah fix:
- ✅ Build berhasil menghasilkan `.output/server/index.mjs`
- ✅ PM2 start tanpa error
- ✅ Aplikasi running di port 3000
- ✅ Auto blog system berfungsi
- ✅ Semua fitur berjalan normal

## 🔄 Update History

- **V2.1.7**: Fix Ubuntu build issues
- **V2.1.6**: Previous version
- **V2.1.5**: Previous version
- **V2.1.4**: Linux bug fix

## 📝 Notes

- Script ini khusus untuk Ubuntu VPS
- Menggunakan fork mode untuk kompatibilitas
- Memory limit disesuaikan untuk VPS
- Sharp library di-rebuild untuk Linux
