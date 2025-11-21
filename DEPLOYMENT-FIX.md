# Fix Connection Refused Error

## Masalah
Error "Connection refused" dari Nginx ke upstream `http://127.0.0.1:3000` berarti aplikasi Nuxt tidak berjalan.

## Solusi

### 1. Cek Status PM2
```bash
pm2 status
pm2 list
```

### 2. Jika App Tidak Berjalan, Start Aplikasi
```bash
cd /home/nuxt/jasapembayaran-new
pm2 start npm --name "jasapembayaran-new" -- start
pm2 save
```

### 3. Atau Restart PM2
```bash
pm2 restart jasapembayaran-new
# atau
pm2 restart all
```

### 4. Cek Port 3000
```bash
# Cek apakah port 3000 digunakan
lsof -i :3000
# atau
netstat -tulpn | grep 3000
```

### 5. Cek Log PM2
```bash
pm2 logs jasapembayaran-new --lines 50
```

### 6. Jika Masih Error, Cek Build
```bash
# Pastikan build sudah selesai
ls -la .output/server/

# Jika tidak ada, build ulang
npm run build
```

### 7. Start dengan PM2 Ecosystem (Recommended)
Buat file `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'jasapembayaran-new',
    script: 'node',
    args: '.output/server/index.mjs',
    cwd: '/home/nuxt/jasapembayaran-new',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '127.0.0.1'
    },
    error_file: '/home/nuxt/.pm2/logs/jasapembayaran-new-error.log',
    out_file: '/home/nuxt/.pm2/logs/jasapembayaran-new-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
```

Kemudian:
```bash
pm2 start ecosystem.config.js
pm2 save
```

## Troubleshooting

### Jika PM2 tidak bisa start:
1. Cek apakah build sudah selesai: `ls -la .output/server/`
2. Cek Node.js version: `node -v` (harus >= 18)
3. Cek dependencies: `npm install`
4. Cek error log: `pm2 logs jasapembayaran-new --err --lines 50`

### Jika port 3000 sudah digunakan:
```bash
# Kill process di port 3000
lsof -ti:3000 | xargs kill -9

# Atau gunakan port lain dan update Nginx config
```

