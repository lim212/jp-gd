# ✅ Ringkasan Perbaikan Disk Space Penuh di VPS

## 🎯 Masalah

Disk VPS penuh setelah upload karena file-file yang terus bertambah dan tidak ter-cleanup otomatis.

## 🔍 Penyebab Utama Disk Penuh

1. **PM2 Logs** ⚠️ **PALING BESAR!**
   - File: `./logs/combined.log`, `./logs/out.log`, `./logs/error.log`
   - Log files terus bertambah tanpa rotation
   - Bisa mencapai GB jika tidak di-cleanup

2. **Backups Auto** ⚠️
   - Directory: `backups/`
   - Sistem auto-backup menyimpan backup tiap hari
   - Total bisa ratusan MB

3. **Build Artifacts** ⚠️
   - Directories: `.nuxt`, `.output`, `.output-build`
   - Tidak ter-cleanup setelah build
   - Bisa mencapai 500MB - 1GB per build

4. **Data Files** ⚠️
   - Directories: `data/blog/generated`, `data/blog/images`
   - File blog yang di-generate terus bertambah
   - Total bisa ratusan MB

5. **Cache Files** ⚠️
   - Directories: `.cache`, `node_modules/.cache`
   - Cache tidak ter-cleanup
   - Bisa mencapai 100-500MB

## ✅ Solusi yang Diterapkan

### 1. ✅ Script Check Disk Usage

**File:** `scripts/check-disk-usage.sh`

Cara penggunaan:
```bash
npm run disk:check
```

### 2. ✅ Script Cleanup Disk Space

**File:** `scripts/cleanup-disk-space.sh`

Cara penggunaan:
```bash
npm run disk:cleanup
```

Cleanup ini akan:
- ✅ Clean old logs (keep last 7 days)
- ✅ Clean old backups (keep last 7 days)
- ✅ Remove build artifacts (.nuxt, .output)
- ✅ Clean cache directories
- ✅ Clean old blog files (keep last 30 days)
- ✅ Truncate large log files
- ✅ Clean notification logs

### 3. ✅ Auto Cleanup Script

**File:** `scripts/auto-cleanup-disk.js`

Cara penggunaan:
```bash
npm run disk:auto-cleanup
```

### 4. ✅ Setup Auto Cleanup Cron

**File:** `scripts/setup-auto-cleanup-cron.sh`

Cara penggunaan:
```bash
npm run disk:setup-cron
```

Ini akan setup cron job untuk:
- Cleanup disk setiap hari jam 2 pagi
- PM2 log flush setiap minggu

### 5. ✅ PM2 Log Rotation

**File:** `ecosystem.ubuntu.config.js`

Sudah dikonfigurasi dengan:
- `max_size: '10M'` - Max log file size
- `retain: 7` - Keep last 7 log files
- `compress: true` - Compress old logs

### 6. ✅ Backup Retention Reduced

**File:** `server/utils/auto-blog-backup.js`

Sudah diperbarui dari:
- **Sebelum:** max 30 days
- **Sesudah:** max 7 days

### 7. ✅ Build Script Auto Cleanup

**File:** `build-ubuntu-no-warnings.sh`

Sudah diperbarui untuk:
- Check disk space sebelum build
- Clean old logs sebelum build
- Clean build artifacts setelah build

## 🚀 Cara Menggunakan

### Quick Check

```bash
# Check disk usage
npm run disk:check
```

### Quick Cleanup

```bash
# Cleanup disk space
npm run disk:cleanup
```

### Setup Auto Cleanup (Recommended)

```bash
# Setup cron job untuk auto-cleanup
npm run disk:setup-cron
```

Ini akan otomatis cleanup setiap hari tanpa perlu manual.

### Manual Cleanup

Jika perlu cleanup manual:

```bash
# Clean logs (keep last 7 days)
find logs -name "*.log" -type f -mtime +7 -delete

# Clean backups (keep last 7 days)
find backups -type d -mtime +7 -exec rm -rf {} \;

# Clean build artifacts
rm -rf .nuxt .output .output-build

# Clean cache
rm -rf .cache node_modules/.cache
npm cache clean --force
```

## 📋 Checklist Sebelum Upload ke VPS

1. ✅ **Cleanup lokal dulu**
   ```bash
   npm run disk:cleanup
   ```

2. ✅ **Check disk space**
   ```bash
   npm run disk:check
   ```

3. ✅ **Clean build artifacts sebelum upload**
   ```bash
   rm -rf .nuxt .output
   ```

4. ✅ **Exclude large directories dari upload** (jika menggunakan rsync/scp):
   - `.nuxt/`
   - `.output/`
   - `node_modules/`
   - `logs/` (old logs)
   - `backups/` (old backups)

5. ✅ **Setup auto-cleanup setelah upload**
   ```bash
   npm run disk:setup-cron
   ```

## 🎯 Best Practices

1. **Setup auto-cleanup via cron** untuk prevent disk penuh
   ```bash
   npm run disk:setup-cron
   ```

2. **Monitor disk usage secara berkala**
   ```bash
   npm run disk:check
   ```

3. **Cleanup sebelum upload** untuk mengurangi ukuran upload

4. **Clean build artifacts setelah build** (tidak perlu di-upload)

5. **Limit log retention** di PM2 (sudah dikonfigurasi)

## 📊 Perkiraan Penghematan Space

Setelah cleanup pertama:
- **Logs:** Menghemat 100-500MB
- **Backups:** Menghemat 100-300MB
- **Build artifacts:** Menghemat 500MB - 1GB
- **Cache:** Menghemat 100-500MB
- **Total:** Bisa menghemat 1-2GB setelah cleanup pertama

Dengan auto-cleanup via cron:
- **Disk tidak akan penuh tiba-tiba**
- **Logs otomatis di-rotate**
- **Backups otomatis di-cleanup**
- **Build artifacts otomatis di-cleanup**

## 🔧 Troubleshooting

### Disk masih penuh setelah cleanup?

1. **Check file besar:**
   ```bash
   find . -type f -size +100M -exec ls -lh {} \;
   ```

2. **Check node_modules:**
   ```bash
   du -sh node_modules
   ```

3. **Nuclear option:**
   ```bash
   # Stop PM2
   pm2 stop jasapembayaran-new
   
   # Clean everything
   npm run disk:cleanup
   rm -rf .nuxt .output
   rm -rf node_modules/.cache
   npm cache clean --force
   
   # Check space
   df -h
   ```

## 📚 File yang Dibuat/Diperbarui

1. **`scripts/check-disk-usage.sh`** - Check disk usage
2. **`scripts/cleanup-disk-space.sh`** - Cleanup disk space
3. **`scripts/auto-cleanup-disk.js`** - Auto cleanup script
4. **`scripts/setup-auto-cleanup-cron.sh`** - Setup cron job
5. **`DISK-SPACE-MANAGEMENT.md`** - Dokumentasi lengkap
6. **`DISK-SPACE-FIX-SUMMARY.md`** - Ringkasan (file ini)
7. **`ecosystem.ubuntu.config.js`** - PM2 config dengan log rotation
8. **`server/utils/auto-blog-backup.js`** - Backup retention dikurangi
9. **`build-ubuntu-no-warnings.sh`** - Auto cleanup sebelum build
10. **`.gitignore`** - Diperbarui untuk exclude large files

## 🎉 Hasil

Setelah implementasi:
- ✅ Disk space ter-monitor dengan script check
- ✅ Auto-cleanup tersedia dengan script cleanup
- ✅ Cron job setup untuk auto-cleanup harian
- ✅ PM2 log rotation sudah dikonfigurasi
- ✅ Backup retention dikurangi (7 days)
- ✅ Build scripts auto-cleanup sebelum build
- ✅ Disk tidak akan penuh tiba-tiba

---

**Status:** ✅ All solutions implemented
**Last Updated:** $(date)

