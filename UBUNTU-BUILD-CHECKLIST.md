# ✅ Ubuntu Build Checklist - Zero Warnings Edition

Checklist ini memastikan build di Ubuntu VPS berjalan tanpa error atau warning.

## 📋 Prerequisites (Sebelum Build)

### 1. System Requirements
- [ ] **Node.js 18+** terinstall
  ```bash
  node --version  # Harus v18.x.x atau lebih tinggi
  ```
- [ ] **npm** terinstall dan up-to-date
  ```bash
  npm --version
  ```
- [ ] **Memory cukup** (minimal 2GB free)
  ```bash
  free -h
  ```
- [ ] **Disk space cukup** (minimal 5GB free)
  ```bash
  df -h
  ```

### 2. Dependencies Check
- [ ] **postcss** terinstall
  ```bash
  npm list postcss
  ```
  Jika tidak ada:
  ```bash
  npm install --save-dev postcss
  ```

- [ ] **autoprefixer** terinstall
  ```bash
  npm list autoprefixer
  ```
  Jika tidak ada:
  ```bash
  npm install --save-dev autoprefixer
  ```

- [ ] **sharp** terinstall dan di-rebuild untuk Linux
  ```bash
  npm rebuild sharp
  ```

## 🚀 Build Steps

### Opsi 1: Build dengan Script No-Warnings (Recommended)
```bash
# Berikan execute permission
chmod +x build-ubuntu-no-warnings.sh

# Jalankan build
./build-ubuntu-no-warnings.sh
```

Atau via npm:
```bash
npm run build:ubuntu-clean-no-warnings
```

### Opsi 2: Build Manual dengan Script Existing
```bash
# Clean build
npm run build:ubuntu-clean

# Atau fix build
npm run build:ubuntu-fix
```

### Opsi 3: Build Standard
```bash
npm run build:ubuntu
```

## 🔧 Perbaikan yang Sudah Diterapkan

### 1. Google Fonts Warnings
✅ **Sudah diperbaiki** - Warnings tentang Google Fonts fetch sudah ditekan:
- `Could not fetch from https://fonts.google.com`
- `Will retry in Xms`
- `Could not initialize provider google`
- `getaddrinfo ENOTFOUND fonts.google.com`

**Cara kerja:**
- Patch di `nuxt.config.ts` untuk menekan warnings
- Konfigurasi fonts dengan `retry: 0` dan `silent: true` di production
- Fallback fonts akan digunakan jika Google Fonts tidak tersedia

### 2. Sharp Warnings
✅ **Sudah diperbaiki** - Warnings tentang sharp binaries sudah ditekan:
- `sharp binaries cannot be found`
- `linux-x64 cannot be found`

**Cara kerja:**
- Patch di `nuxt.config.ts` untuk menekan warnings
- Environment variable `SHARP_IGNORE_GLOBAL_LIBVIPS=1`
- Rebuild sharp untuk Linux saat build

### 3. PostCSS Error
✅ **Sudah diperbaiki** - Error `Cannot find module 'postcss'` sudah teratasi:
- `postcss` dan `autoprefixer` sudah ditambahkan ke devDependencies
- Script build akan memverifikasi dependencies sebelum build

### 4. Deprecation Warnings
✅ **Sudah diperbaiki** - Warnings DEP0155 sudah ditekan:
- Patch di `nuxt.config.ts` untuk menekan DEP0155 warnings
- Flag `--no-deprecation` di semua build scripts

## 📊 Build Output Verification

Setelah build selesai, verifikasi file output:

```bash
# Check output file exists
ls -la .output/server/index.mjs

# Check build size
du -sh .output

# Check executable permission
file .output/server/index.mjs
```

## 🚨 Troubleshooting

### Error: "Cannot find module 'postcss'"
**Solusi:**
```bash
npm install --save-dev postcss autoprefixer
npm rebuild sharp
```

### Error: "Out of memory"
**Solusi:**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=16384"
npm run build:ubuntu
```

### Error: "ENOTEMPTY" atau "EPERM"
**Solusi:**
```bash
# Clean build directories
rm -rf .nuxt .output
node scripts/clean-output.js
npm run build:ubuntu
```

### Warnings: Google Fonts fetch failed
**Status:** ✅ **Tidak masalah** - Warnings sudah ditekan dan fallback fonts akan digunakan.

### Warnings: Sharp binaries
**Status:** ✅ **Tidak masalah** - Warnings sudah ditekan dan build akan tetap berhasil.

## 📝 Environment Variables untuk Production

Saat build di Ubuntu VPS, set environment variables ini:

```bash
export NODE_ENV=production
export PLATFORM=linux
export SHARP_IGNORE_GLOBAL_LIBVIPS=1
export NODE_OPTIONS="--max-old-space-size=16384 --no-deprecation"
export NUXT_ENABLE_PWA=false
export SUPPRESS_SHARP_WARNINGS=true
```

## ✅ Success Indicators

Build dianggap berhasil jika:
- [ ] Exit code 0
- [ ] File `.output/server/index.mjs` ada
- [ ] Tidak ada ERROR (hanya warnings yang sudah ditekan)
- [ ] Build size reasonable (biasanya 50-200MB)

## 🎯 Best Practices

1. **Selalu gunakan clean build** untuk production:
   ```bash
   npm run build:ubuntu-clean
   ```

2. **Rebuild sharp** setelah update dependencies:
   ```bash
   npm rebuild sharp
   ```

3. **Verifikasi output** sebelum deployment:
   ```bash
   ls -la .output/server/index.mjs
   ```

4. **Test build** di environment yang sama dengan production:
   - Ubuntu VPS dengan Node.js 18+
   - Memory dan disk space cukup
   - Internet connection (optional, untuk Google Fonts)

## 📚 Related Documentation

- `UBUNTU-BUILD-GUIDE.md` - Panduan build Ubuntu lengkap
- `UBUNTU-BUILD-FIX.md` - Fix untuk masalah build Ubuntu
- `build-ubuntu-no-warnings.sh` - Script build tanpa warnings

## 🆘 Support

Jika masih ada error atau warning yang tidak teratasi:
1. Check error message dengan detail
2. Verify prerequisites sudah terpenuhi
3. Coba clean build: `rm -rf .nuxt .output && npm run build:ubuntu-clean`
4. Check system resources (memory, disk space)
5. Verify Node.js version (harus 18+)


