# Linux Deployment Guide untuk JasaPembayaran.com

Panduan lengkap untuk deploy aplikasi JasaPembayaran.com ke Ubuntu VPS tanpa error.

## 🚀 Quick Start

### 1. Persiapan Server Ubuntu

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y curl wget git build-essential python3 python3-pip

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2
```

### 2. Clone dan Setup Project

```bash
# Clone repository
git clone <your-repo-url>
cd jasapembayaran-new

# Install dependencies
npm ci

# Fix Linux-specific issues
node scripts/fix-all-linux.js

# Build untuk production
npm run build:production
```

### 3. Deploy dengan PM2

```bash
# Start aplikasi dengan PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
```

## 🔧 Scripts yang Tersedia

### Build Scripts
- `npm run build:linux` - Build khusus untuk Linux
- `npm run build:production` - Build production dengan optimasi
- `npm run build:clean` - Clean build dengan pembersihan cache

### Fix Scripts
- `npm run fix:sharp-linux` - Fix Sharp library untuk Linux
- `npm run fix:all-linux` - Fix semua masalah Linux
- `npm run fix:dev-warnings-linux` - Fix development warnings
- `npm run fix:import-meta-linux` - Fix import.meta issues
- `npm run fix:deep-linux` - Fix CSS deep selector issues

## 🐛 Troubleshooting

### Error: Sharp library not found
```bash
npm rebuild sharp
node scripts/fix-sharp-linux.js
```

### Error: Import.meta issues
```bash
node scripts/fix-import-meta-linux.js
```

### Error: CSS deep selector issues
```bash
node scripts/fix-deep-linux-comprehensive.js
```

### Error: Memory issues
```bash
export NODE_OPTIONS="--max-old-space-size=16384"
npm run build:production
```

### Error: Permission denied
```bash
chmod +x scripts/*.js
chmod +x scripts/*.sh
chmod -R 755 .output
```

## 📁 File Konfigurasi Penting

### ecosystem.config.js
Konfigurasi PM2 untuk production deployment dengan:
- Cluster mode untuk performa optimal
- Memory management
- Auto-restart
- Logging configuration

### linux-deploy.sh
Script otomatis untuk deployment lengkap di Linux.

## 🔍 Monitoring

### Check Status
```bash
pm2 status
pm2 logs jasapembayaran
pm2 monit
```

### Restart Application
```bash
pm2 restart jasapembayaran
pm2 reload jasapembayaran
```

## 🚨 Common Issues & Solutions

### 1. Build Error: Path separator issues
**Solution:** Scripts sudah diupdate untuk menggunakan path separator yang cross-platform.

### 2. Build Error: Sharp binary not found
**Solution:** 
```bash
npm rebuild sharp
export SHARP_IGNORE_GLOBAL_LIBVIPS=1
```

### 3. Build Error: Memory limit exceeded
**Solution:**
```bash
export NODE_OPTIONS="--max-old-space-size=16384 --max-semi-space-size=512"
```

### 4. Runtime Error: Module not found
**Solution:**
```bash
npm ci --production=false
npm run build:production
```

## 📊 Performance Optimization

### Environment Variables
```bash
export NODE_ENV=production
export NUXT_ENV=production
export NODE_OPTIONS="--max-old-space-size=16384 --max-semi-space-size=512"
export PLATFORM=linux
export SHARP_IGNORE_GLOBAL_LIBVIPS=1
```

### PM2 Configuration
- Cluster mode dengan instances maksimal
- Memory restart pada 2GB
- Auto-restart dengan delay 4 detik
- Health monitoring

## 🔄 Update Process

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm ci

# Fix any new issues
node scripts/fix-all-linux.js

# Rebuild
npm run build:production

# Reload PM2
pm2 reload jasapembayaran
```

## 📞 Support

Jika mengalami masalah deployment, jalankan:

```bash
# Debug build
npm run build:linux

# Check logs
pm2 logs jasapembayaran --lines 100

# System info
pm2 info jasapembayaran
```

---

**Note:** Semua script sudah dioptimalkan untuk cross-platform compatibility dan akan berjalan dengan baik di Ubuntu VPS.
