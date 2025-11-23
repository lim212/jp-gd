# 💾 Disk Space Management - VPS

## 🎯 Masalah

Disk VPS penuh setelah upload karena file-file yang terus bertambah dan tidak ter-cleanup otomatis.

## 🔍 Penyebab Disk Penuh

### 1. **PM2 Logs** (Paling Besar!)
- File: `./logs/combined.log`, `./logs/out.log`, `./logs/error.log`
- **Masalah:** Log files terus bertambah tanpa rotation
- **Ukuran:** Bisa mencapai ratusan MB hingga GB jika tidak di-cleanup

### 2. **Backups Auto**
- Directory: `backups/`
- **Masalah:** Sistem auto-backup menyimpan backup tiap hari (max 7 hari - sudah dikurangi dari 30)
- **Ukuran:** Setiap backup bisa beberapa MB, total bisa ratusan MB

### 3. **Build Artifacts**
- Directories: `.nuxt`, `.output`, `.output-build`
- **Masalah:** Build artifacts tidak ter-cleanup setelah build
- **Ukuran:** Bisa mencapai 500MB - 1GB per build

### 4. **Data Files**
- Directories: `data/blog/generated`, `data/blog/images`
- **Masalah:** File blog yang di-generate terus bertambah
- **Ukuran:** Setiap blog + gambar bisa 1-5MB, total bisa ratusan MB

### 5. **Public Images**
- Directories: `public/images/blog`, `public/images/dummy`
- **Masalah:** Images yang di-generate untuk blog terus bertambah
- **Ukuran:** Bisa mencapai ratusan MB

### 6. **Cache Files**
- Directories: `.cache`, `node_modules/.cache`
- **Masalah:** Cache tidak ter-cleanup
- **Ukuran:** Bisa mencapai 100-500MB

### 7. **Notification Logs**
- File: `logs/notifications.json`
- **Masalah:** File terus bertambah tanpa limit
- **Ukuran:** Bisa mencapai puluhan MB

## ✅ Solusi yang Diterapkan

### 1. ✅ Script Check Disk Usage

**File:** `scripts/check-disk-usage.sh`

Script untuk mengecek penggunaan disk dan mengidentifikasi file/directory besar.

**Cara penggunaan:**
```bash
npm run disk:check
```

Atau:
```bash
chmod +x scripts/check-disk-usage.sh
./scripts/check-disk-usage.sh
```

### 2. ✅ Script Cleanup Disk Space

**File:** `scripts/cleanup-disk-space.sh`

Script komprehensif untuk cleanup disk space:
- Clean old logs (keep last 7 days)
- Clean old backups (keep last 7 days)
- Remove build artifacts (.nuxt, .output)
- Clean cache directories
- Clean old blog files (keep last 30 days)
- Truncate large log files
- Clean notification logs

**Cara penggunaan:**
```bash
npm run disk:cleanup
```

Atau:
```bash
chmod +x scripts/cleanup-disk-space.sh
./scripts/cleanup-disk-space.sh
```

### 3. ✅ Auto Cleanup Script

**File:** `scripts/auto-cleanup-disk.js`

Script otomatis yang bisa dijalankan via cron untuk auto-cleanup.

**Cara penggunaan:**
```bash
npm run disk:auto-cleanup
```

### 4. ✅ PM2 Log Rotation

**File:** `ecosystem.ubuntu.config.js`

PM2 configuration sudah diperbarui dengan log rotation:
- `max_size: '10M'` - Max log file size
- `retain: 7` - Keep last 7 log files
- `compress: true` - Compress old logs

### 7. ✅ Backup Cleanup

**File:** `server/utils/auto-blog-backup.js`

Sistem backup sudah diperbarui untuk cleanup otomatis (max 7 days - dikurangi dari 30 untuk menghemat space).

## 🚀 Cara Menggunakan

### Check Disk Usage

```bash
# Check disk usage
npm run disk:check

# Atau manual
df -h
du -sh .
```

### Cleanup Disk Space

```bash
# Manual cleanup
npm run disk:cleanup

# Atau run script bash langsung
chmod +x scripts/cleanup-disk-space.sh
./scripts/cleanup-disk-space.sh
```

### Auto Cleanup (via Cron)

Tambahkan ke crontab untuk auto-cleanup setiap hari:

```bash
# Edit crontab
crontab -e

# Add this line (cleanup setiap hari jam 2 pagi)
0 2 * * * cd /home/nuxt/jp-gd && /usr/bin/npm run disk:auto-cleanup >> /home/nuxt/jp-gd/logs/cleanup.log 2>&1
```

## 📋 Checklist Sebelum Upload ke VPS

1. **Cleanup lokal dulu**
   ```bash
   npm run disk:cleanup
   ```

2. **Check disk space**
   ```bash
   npm run disk:check
   ```

3. **Clean build artifacts sebelum upload**
   ```bash
   rm -rf .nuxt .output
   ```

4. **Exclude large directories dari upload** (jika menggunakan rsync/scp):
   - `.nuxt/`
   - `.output/`
   - `node_modules/`
   - `logs/` (old logs)
   - `backups/` (old backups)

## 🔧 Auto-Cleanup Setup

### Setup Cron Job untuk Auto Cleanup (Otomatis)

**Recommended:** Gunakan script setup:

```bash
# Setup auto-cleanup cron job
npm run disk:setup-cron
```

Script ini akan otomatis:
- Install cron job untuk cleanup setiap hari jam 2 pagi
- Install cron job untuk PM2 log flush setiap minggu
- Backup crontab yang ada sebelum install

**Manual Setup:**

Jika ingin setup manual:

```bash
# Edit crontab
crontab -e

# Add these lines:
# Cleanup disk setiap hari jam 2 pagi
0 2 * * * cd /home/nuxt/jp-gd && /usr/bin/npm run disk:auto-cleanup >> /home/nuxt/jp-gd/logs/cleanup.log 2>&1

# Clean PM2 logs setiap minggu (Minggu jam 3 pagi)
0 3 * * 0 cd /home/nuxt/jp-gd && pm2 flush jasapembayaran-new >> /home/nuxt/jp-gd/logs/cleanup.log 2>&1
```

### Setup Log Rotation di PM2

PM2 sudah dikonfigurasi dengan log rotation di `ecosystem.ubuntu.config.js`:
- Log files akan di-rotate otomatis ketika mencapai 10MB
- Hanya menyimpan 7 log files terakhir
- Log lama akan di-compress

## 🎯 Best Practices

1. **Jalankan cleanup sebelum upload**
   ```bash
   npm run disk:cleanup
   ```

2. **Monitor disk usage secara berkala**
   ```bash
   npm run disk:check
   ```

3. **Setup auto-cleanup via cron** untuk prevent disk penuh

4. **Limit log retention** di PM2 (sudah dikonfigurasi)

5. **Clean build artifacts setelah build**
   - `.nuxt/` dan `.output/` tidak perlu di-upload
   - Build ulang di VPS setelah upload

## 📊 Perkiraan Penghematan Space

Setelah cleanup:
- **Logs:** Menghemat 100-500MB (tergantung lama runtime)
- **Backups:** Menghemat 100-300MB (jika ada banyak backup lama)
- **Build artifacts:** Menghemat 500MB - 1GB per build
- **Cache:** Menghemat 100-500MB
- **Total potensial:** Bisa menghemat 1-2GB setelah cleanup pertama

## 🆘 Troubleshooting

### Disk masih penuh setelah cleanup?

1. **Check file besar manually:**
   ```bash
   find . -type f -size +100M -exec ls -lh {} \;
   ```

2. **Check hidden files:**
   ```bash
   du -sh .[!.]* 2>/dev/null
   ```

3. **Check node_modules:**
   ```bash
   du -sh node_modules
   # Jika terlalu besar, reinstall
   rm -rf node_modules
   npm ci --production=false
   ```

4. **Nuclear option - Clean semua:**
   ```bash
   # Stop PM2
   pm2 stop jasapembayaran-new
   
   # Clean everything
   npm run disk:cleanup
   rm -rf .nuxt .output .output-build
   rm -rf node_modules/.cache
   npm cache clean --force
   
   # Check space
   df -h
   ```

## 📚 Related Files

- `scripts/check-disk-usage.sh` - Check disk usage
- `scripts/cleanup-disk-space.sh` - Cleanup disk space
- `scripts/auto-cleanup-disk.js` - Auto cleanup script
- `ecosystem.ubuntu.config.js` - PM2 config with log rotation
- `server/utils/auto-blog-backup.js` - Backup system with cleanup

## 🎉 Hasil

Setelah implementasi:
- ✅ Disk space ter-monitor
- ✅ Auto-cleanup tersedia
- ✅ Log rotation di PM2
- ✅ Backup cleanup otomatis
- ✅ Build artifacts di-cleanup
- ✅ Disk tidak akan penuh tiba-tiba

---

**Status:** ✅ Implemented
**Last Updated:** $(date)

