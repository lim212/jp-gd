# 🐧 Panduan Build Ubuntu VPS

## ✅ Perbaikan yang Sudah Dilakukan

### 1. **Script Cleanup Cross-Platform**
- ✅ Script `scripts/clean-output.js` sudah menggunakan `path.join()` yang cross-platform
- ✅ Kompatibel dengan Windows dan Linux
- ✅ Menangani error ENOTEMPTY dan EPERM dengan retry logic

### 2. **Build Scripts untuk Ubuntu**
- ✅ `build:ubuntu` - Build dengan cleanup otomatis
- ✅ `build:ubuntu-clean` - Clean build dengan rm -rf
- ✅ `build:ubuntu-fix` - Fix build dengan semua environment variables

### 3. **Environment Variables**
- ✅ `NODE_OPTIONS="--max-old-space-size=16384 --no-deprecation"`
- ✅ `PLATFORM=linux`
- ✅ `SHARP_IGNORE_GLOBAL_LIBVIPS=1`
- ✅ `NODE_ENV=production`

### 4. **Deprecation Warnings**
- ✅ Menekan DEP0155 warnings (trailing slash pattern mapping)
- ✅ Patch di `nuxt.config.ts` untuk menekan warnings
- ✅ `--no-deprecation` flag di semua build scripts

## 🚀 Cara Build di Ubuntu VPS

### Opsi 1: Build Sederhana (Recommended)
```bash
npm run build:ubuntu
```

### Opsi 2: Clean Build
```bash
npm run build:ubuntu-clean
```

### Opsi 3: Fix Build (Jika ada masalah)
```bash
npm run build:ubuntu-fix
```

### Opsi 4: Menggunakan Script Bash
```bash
chmod +x build-ubuntu-clean.sh
./build-ubuntu-clean.sh
```

### Opsi 5: Fix Build Comprehensive
```bash
chmod +x fix-ubuntu-build.sh
./fix-ubuntu-build.sh
```

## 📋 Checklist Sebelum Build

1. ✅ Pastikan Node.js versi 18+ terinstall
   ```bash
   node --version
   ```

2. ✅ Pastikan npm dependencies terinstall
   ```bash
   npm ci
   ```

3. ✅ Pastikan sharp terinstall untuk Linux
   ```bash
   npm rebuild sharp
   ```

4. ✅ Pastikan ada cukup memory (minimal 2GB)
   ```bash
   free -h
   ```

5. ✅ Pastikan ada cukup disk space (minimal 5GB)
   ```bash
   df -h
   ```

## 🔧 Troubleshooting

### Error: ENOTEMPTY
**Solusi:** Script cleanup sudah menangani ini. Jika masih error:
```bash
rm -rf .nuxt .output
npm run build:ubuntu
```

### Error: EPERM (Permission Denied)
**Solusi:** 
```bash
sudo chown -R $USER:$USER .
npm run build:ubuntu
```

### Error: Out of Memory
**Solusi:** Tambah swap atau kurangi memory limit:
```bash
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build:ubuntu
```

### Error: Sharp binaries not found
**Solusi:**
```bash
npm rebuild sharp
export SHARP_IGNORE_GLOBAL_LIBVIPS=1
npm run build:ubuntu
```

### Build Berhasil Tapi File Tidak Ada
**Solusi:** Cek apakah build benar-benar selesai:
```bash
ls -la .output/server/index.mjs
```

Jika file ada, set permissions:
```bash
chmod +x .output/server/index.mjs
```

## 🎯 Setelah Build Berhasil

### 1. Start dengan PM2
```bash
pm2 start ecosystem.ubuntu.config.js --env production
```

### 2. Cek Status
```bash
pm2 status
pm2 logs jasapembayaran-new
```

### 3. Save PM2 Configuration
```bash
pm2 save
pm2 startup
```

## 📝 Environment Variables yang Digunakan

```bash
NODE_ENV=production
NUXT_ENV=production
PLATFORM=linux
SHARP_IGNORE_GLOBAL_LIBVIPS=1
NODE_OPTIONS=--max-old-space-size=16384 --no-deprecation
PORT=3000
HOST=0.0.0.0
```

## ✅ Verifikasi Build

Setelah build selesai, pastikan file-file berikut ada:

```bash
ls -la .output/server/index.mjs  # Server entry point
ls -la .output/public/_nuxt/     # Client assets
```

## 🎉 Build Selesai!

Jika semua file ada dan tidak ada error, build Anda berhasil! 🚀

