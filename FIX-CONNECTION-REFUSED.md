# 🔧 Fix ERR_CONNECTION_REFUSED - Port 5000

## 🐛 Masalah

Browser error: `ERR_CONNECTION_REFUSED` di port 5000
```
This site can't be reached
119.47.89.109 refused to connect.
```

## 🔍 Root Cause

Server tidak berjalan di port 5000 karena:
1. PM2 process error (`jp-gd` dengan command salah)
2. Server tidak start dengan benar
3. Port 5000 tidak listening

## ✅ Solusi Lengkap

### Langkah 1: Fix PM2 Process

```bash
cd /home/nuxt/jp-gd

# Stop dan delete semua PM2 processes
pm2 stop all
pm2 delete all

# Kill any remaining processes
pkill -f "npm.*startPORT" 2>/dev/null
pkill -f "nuxt.*start" 2>/dev/null
```

### Langkah 2: Cek Build Output

```bash
# Cek apakah build ada
ls -la .output/server/index.mjs

# Jika tidak ada, rebuild
npm run build:ubuntu
```

### Langkah 3: Start PM2 dengan Config yang Benar

```bash
# Start dengan .cjs file (BENAR)
pm2 start ecosystem.ubuntu.config.cjs --env production

# Save config
pm2 save

# Check status
pm2 status
```

### Langkah 4: Cek Port yang Listening

```bash
# Cek port 3000
netstat -tulpn | grep :3000

# Cek port 5000
netstat -tulpn | grep :5000

# Atau dengan ss
ss -tulpn | grep :3000
ss -tulpn | grep :5000
```

### Langkah 5: Cek PM2 Logs

```bash
# Check logs untuk error
pm2 logs --err --lines 50

# Check all logs
pm2 logs --lines 30
```

## 🔧 Jika Port 5000 Diperlukan

Jika website harus di port 5000, update ecosystem config:

```javascript
// ecosystem.ubuntu.config.cjs
env: {
  PORT: 5000,  // Ubah dari 3000 ke 5000
  NITRO_PORT: 5000,
  // ...
}
```

Kemudian restart:
```bash
pm2 restart all
```

## 📋 Checklist

Setelah fix, pastikan:

- [ ] PM2 process running (`pm2 status` menunjukkan process `online`)
- [ ] Port listening (`netstat` atau `ss` menunjukkan port listening)
- [ ] No error di PM2 logs (`pm2 logs --err` tidak ada error)
- [ ] Website accessible (test di browser)

## 🔍 Troubleshooting

### Jika PM2 tidak start:

```bash
# Cek build output
ls -la .output/server/index.mjs

# Rebuild jika perlu
npm run build:ubuntu

# Cek ecosystem config
cat ecosystem.ubuntu.config.cjs
```

### Jika port tidak listening:

```bash
# Cek apakah port sudah digunakan
lsof -i :5000
lsof -i :3000

# Kill process di port jika perlu
kill -9 $(lsof -ti:5000)
kill -9 $(lsof -ti:3000)

# Restart PM2
pm2 restart all
```

### Jika masih connection refused:

1. **Cek firewall:**
```bash
# Ubuntu/Debian
sudo ufw status
sudo ufw allow 5000/tcp
sudo ufw allow 3000/tcp
```

2. **Cek nginx/reverse proxy:**
```bash
# Cek nginx config
sudo nginx -t
sudo systemctl status nginx
```

3. **Cek PM2 process:**
```bash
pm2 describe jasapembayaran-new
pm2 logs jasapembayaran-new --err --lines 100
```

## 🔗 Related

- `FIX-ECOSYSTEM-CJS.md` - Fix ERR_REQUIRE_ESM
- `FIX-PM2-NOW.md` - Fix PM2 error
- `QUICK-FIX-SERVER.md` - Quick fix guide

---

**Quick Fix**: 
```bash
cd /home/nuxt/jp-gd && pm2 stop all && pm2 delete all && pm2 start ecosystem.ubuntu.config.cjs --env production && pm2 save && pm2 status
```

