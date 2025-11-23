# 📋 PM2 Log Management - Mencegah Log Penuh 40GB

## 🎯 Masalah
PM2 logs bisa membesar sampai 40GB+ dan memenuhi disk space. Dokumentasi ini menjelaskan cara membatasi dan mengelola log PM2.

## ✅ Solusi yang Diterapkan

### 1. Konfigurasi Log Rotation di PM2

Semua file `ecosystem.config.*` sudah dikonfigurasi dengan:
- **Max size**: 5MB per file (dikurangi dari 10MB)
- **Retain**: 3 file terakhir (dikurangi dari 7)
- **Compress**: Enabled (compress log lama)
- **Total max**: ~15MB (dari sebelumnya bisa sampai 70MB+)

### 2. PM2 Log Rotation Module

Install dan setup PM2 log rotation module:

```bash
# Setup log rotation
npm run pm2:setup-log-rotation

# Atau manual:
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 5M
pm2 set pm2-logrotate:retain 3
pm2 set pm2-logrotate:compress true
```

### 3. Script Cleanup Manual

```bash
# Cleanup log PM2 yang sudah besar
npm run pm2:cleanup-logs

# Flush semua log PM2 (hapus semua)
npm run pm2:flush-logs

# Monitor log size
npm run pm2:monitor-logs
```

## 🔧 Setup Otomatis

### Option 1: PM2 Log Rotation Module (Recommended)

```bash
# Install module
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 5M
pm2 set pm2-logrotate:retain 3
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'  # Rotate daily at midnight

# Save configuration
pm2 save
```

### Option 2: Cron Job untuk Cleanup

Tambahkan ke crontab untuk cleanup otomatis setiap hari:

```bash
# Edit crontab
crontab -e

# Tambahkan baris ini (cleanup setiap hari jam 2 pagi)
0 2 * * * cd /path/to/project && node scripts/cleanup-pm2-logs.js >> /var/log/pm2-cleanup.log 2>&1
```

### Option 3: PM2 Monitor Script

Jalankan monitor script sebagai PM2 process:

```bash
# Start monitor sebagai PM2 process
pm2 start scripts/monitor-pm2-logs.js --name "pm2-log-monitor" -- --daemon

# Save PM2 configuration
pm2 save
```

## 📊 Monitoring

### Cek Ukuran Log PM2

```bash
# Cek ukuran log directory
du -sh ~/.pm2/logs/

# Atau di Windows
dir /s ~/.pm2/logs/

# List semua log files dengan size
ls -lh ~/.pm2/logs/
```

### Cek Konfigurasi Log Rotation

```bash
# Cek konfigurasi PM2 log rotation
pm2 conf pm2-logrotate

# Cek status PM2
pm2 status

# Cek log PM2
pm2 logs --lines 50
```

## 🧹 Cleanup Manual

### Cleanup Log Sekarang

```bash
# Cleanup log otomatis (keep 3 file terbaru, max 15MB)
npm run pm2:cleanup-logs

# Atau manual:
node scripts/cleanup-pm2-logs.js
```

### Flush Semua Log

```bash
# Hapus semua log PM2 (HATI-HATI!)
npm run pm2:flush-logs

# Atau:
pm2 flush
```

### Cleanup Log Lama Manual

```bash
# Hapus log lebih dari 7 hari
find ~/.pm2/logs/ -name "*.log" -mtime +7 -delete
find ~/.pm2/logs/ -name "*.log.gz" -mtime +7 -delete

# Hapus log lebih besar dari 10MB
find ~/.pm2/logs/ -name "*.log" -size +10M -delete
```

## ⚙️ Konfigurasi di ecosystem.config

Semua file `ecosystem.config.*` sudah dikonfigurasi dengan:

```javascript
{
  // Log rotation - BATASI KETAT
  max_size: '5M',        // Max 5MB per file
  retain: 3,            // Keep hanya 3 file terakhir
  compress: true,        // Compress old logs
  merge_logs: true,      // Merge stdout dan stderr
  log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
}
```

## 📈 Hasil Setelah Konfigurasi

**Sebelum:**
- Max size: 10MB per file
- Retain: 7 files
- Total max: ~70MB (bisa lebih jika tidak di-rotate)
- Bisa membesar sampai 40GB+ jika tidak di-manage

**Sesudah:**
- Max size: 5MB per file
- Retain: 3 files
- Total max: ~15MB
- Auto rotation dengan PM2 module
- Auto cleanup dengan script

## 🚨 Troubleshooting

### Log Masih Membesar

1. **Cek apakah PM2 log rotation module sudah terinstall:**
```bash
pm2 list | grep pm2-logrotate
```

2. **Cek konfigurasi:**
```bash
pm2 conf pm2-logrotate
```

3. **Restart PM2:**
```bash
pm2 restart all
pm2 save
```

### Disk Masih Penuh

1. **Cek ukuran log:**
```bash
du -sh ~/.pm2/logs/
```

2. **Cleanup manual:**
```bash
npm run pm2:cleanup-logs
```

3. **Flush semua log (jika perlu):**
```bash
npm run pm2:flush-logs
```

### PM2 Log Rotation Tidak Bekerja

1. **Reinstall module:**
```bash
pm2 uninstall pm2-logrotate
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 5M
pm2 set pm2-logrotate:retain 3
pm2 save
```

2. **Cek PM2 version:**
```bash
pm2 --version
# Pastikan menggunakan PM2 versi terbaru
```

## 📝 Best Practices

1. **Setup log rotation segera setelah install PM2**
2. **Monitor log size secara berkala**
3. **Setup cron job untuk cleanup otomatis**
4. **Jangan disable logging sepenuhnya** (penting untuk debugging)
5. **Gunakan compress untuk menghemat space**

## 🔗 Related Files

- `ecosystem.config.cjs` - PM2 config dengan log rotation
- `ecosystem.config.js` - PM2 config dengan log rotation
- `ecosystem.ubuntu.config.js` - PM2 config Ubuntu dengan log rotation
- `scripts/cleanup-pm2-logs.js` - Script cleanup log
- `scripts/setup-pm2-log-rotation.sh` - Script setup log rotation
- `scripts/monitor-pm2-logs.js` - Script monitor log size

---

**Status:** ✅ Configured
**Last Updated:** 2025-01-15

